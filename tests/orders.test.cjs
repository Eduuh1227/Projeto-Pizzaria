const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
// Tests must never use an operator's production database.
delete process.env.DATABASE_URL;
delete process.env.VERCEL;
process.env.NODE_ENV = 'test';
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'realeza-test-'));
process.env.SQLITE_PATH = path.join(directory, 'orders.sqlite');
const handler = require('../api/backend.js');
const db = require('../server/db.cjs');
const { hashPassword } = require('../server/auth.cjs');
const { normalize } = require('../server/orders.cjs');
let server;
let origin;
let cookie;
let orderId;
const password = 'Test-only-password-not-an-account';
const payload = () => ({ customer: { name: 'Cliente de teste', phone: '11999999999', fulfillment: 'delivery', payment: 'Pix', cep: '05877200', street: 'Rua Teste', number: '20', neighborhood: 'Centro', generalNotes: '<script>alert(1)</script>' }, items: [{ productId: 'calabresa', quantity: 1, extras: [], crustId: 'none' }] });
async function call(action, method = 'GET', body, options = {}) {
  const { cookie: auth, origin: requestOrigin, key, params } = options;
  const response = await fetch(`${origin}/api/backend?${new URLSearchParams({ action, ...params })}`, { method, headers: { 'Content-Type': 'application/json', Origin: requestOrigin ?? origin, ...(auth ? { Cookie: auth } : {}), ...(key ? { 'Idempotency-Key': key } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie') };
}
before(async () => {
  await db.init();
  await db.query('INSERT INTO admins(email,password_hash,created_at) VALUES($1,$2,$3)', ['team@example.com', await hashPassword(password), new Date().toISOString()]);
  server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  process.env.APP_ORIGIN = origin;
});
after(async () => { await new Promise(resolve => server.close(resolve)); await db.close(); fs.rmSync(directory, { recursive: true }); });

test('guests cannot read orders, sessions, details or update status', async () => {
  for (const [action, method] of [['orders', 'GET'], ['order', 'GET'], ['session', 'GET'], ['order', 'PATCH']]) {
    const result = await call(action, method, method === 'PATCH' ? {} : undefined, { params: { id: randomUUID() } });
    assert.equal(result.status, 401);
    assert.equal(Object.hasOwn(result.data, 'orders'), false);
  }
});
test('login requires an existing account and issues an HttpOnly SameSite cookie', async () => {
  assert.equal((await call('login', 'POST', { email: 'customer@example.com', password })).status, 401);
  assert.equal((await call('login', 'POST', { email: 'team@example.com', password: 'wrong' })).status, 401);
  const result = await call('login', 'POST', { email: 'team@example.com', password });
  assert.equal(result.status, 200);
  assert.match(result.cookie, /HttpOnly; SameSite=Strict/);
  cookie = result.cookie.split(';')[0];
  assert.equal((await call('session', 'GET', undefined, { cookie })).data.email, 'team@example.com');
});
test('cross-origin writes are blocked even with a valid admin cookie', async () => {
  assert.equal((await call('orders', 'POST', payload(), { key: randomUUID(), origin: 'https://attacker.example' })).status, 403);
  assert.equal((await call('order', 'PATCH', {}, { cookie, origin: 'https://attacker.example', params: { id: randomUUID() } })).status, 403);
});
test('prices are canonical, and duplicated parallel submissions create one order', async () => {
  const data = payload();
  data.items[0].unitPrice = 0.01;
  data.items[0].name = 'forged product';
  const key = randomUUID();
  const results = await Promise.all([call('orders', 'POST', data, { key }), call('orders', 'POST', data, { key })]);
  assert.equal(results[0].status, 201);
  assert.equal(results[1].status, 201);
  assert.equal(results[0].data.id, results[1].data.id);
  assert.equal(results[0].data.totals.total, 3800);
  orderId = results[0].data.id;
  const list = await call('orders', 'GET', undefined, { cookie });
  assert.equal(list.data.count, 1);
  const detail = await call('order', 'GET', undefined, { cookie, params: { id: orderId } });
  assert.equal(detail.data.items[0].name, 'Calabresa');
  data.items[0].quantity = 2;
  assert.equal((await call('orders', 'POST', data, { key })).status, 409);
});
test('half pizzas, brotos, extras, cash and coupons are validated server-side', () => {
  const input = payload();
  input.items = [{ productId: 'broto-calabresa', quantity: 1, half: true, secondFlavorId: 'broto-carne-seca', crustId: 'catupiry', extras: ['bacon-extra'] }];
  assert.equal(normalize(input).totals.total, 4500);
  input.items[0].secondFlavorId = 'carne-seca';
  assert.throws(() => normalize(input), /Segundo sabor/);
  input.items[0].secondFlavorId = 'broto-carne-seca';
  input.items[0].extras = ['bacon-extra', 'bacon-extra'];
  assert.throws(() => normalize(input), /Adicionais/);
  input.items[0].extras = [];
  input.customer.payment = 'Dinheiro';
  input.customer.changeFor = '1,00';
  assert.throws(() => normalize(input), /troco/);
  input.customer.changeFor = '50,00';
  assert.equal(normalize(input).customer.changeFor, 5000);
  input.coupon = 'RETIRADA5';
  assert.throws(() => normalize(input), /Cupom/);
  input.customer.fulfillment = 'pickup';
  assert.equal(normalize(input).totals.total, 3610);
  input.items[0].sizeId = 'small';
  assert.throws(() => normalize(input), /Tamanho/);
});
test('invalid fields, stale totals and unsupported products cannot create orders', async () => {
  const input = payload();
  input.expectedTotal = 1;
  assert.equal((await call('orders', 'POST', input, { key: randomUUID() })).status, 409);
  delete input.expectedTotal;
  input.items[0].quantity = -1;
  assert.equal((await call('orders', 'POST', input, { key: randomUUID() })).status, 400);
  input.items[0].quantity = 1;
  input.items[0].productId = 'does-not-exist';
  assert.equal((await call('orders', 'POST', input, { key: randomUUID() })).status, 400);
});
test('valid lifecycle is audited; conflicting and terminal changes are denied', async () => {
  const change = (status, version) => call('order', 'PATCH', { status, version }, { cookie, params: { id: orderId } });
  assert.equal((await change('delivered', 1)).status, 400);
  assert.equal((await change('preparing', 1)).status, 200);
  assert.equal((await change('out_for_delivery', 1)).status, 409);
  assert.equal((await change('out_for_delivery', 2)).status, 200);
  const result = await change('delivered', 3);
  assert.equal(result.status, 200);
  assert.equal(result.data.history.length, 4);
  assert.equal(result.data.history[3].actor, 'team@example.com');
  assert.equal((await change('cancelled', 4)).status, 400);
});
test('cancellation requires reason and pickup follows its own statuses', async () => {
  const input = payload();
  input.customer.fulfillment = 'pickup';
  const created = await call('orders', 'POST', input, { key: randomUUID() });
  const options = { cookie, params: { id: created.data.id } };
  assert.equal((await call('order', 'PATCH', { status: 'cancelled', version: 1 }, options)).status, 400);
  const cancelled = await call('order', 'PATCH', { status: 'cancelled', version: 1, note: 'Solicitado pelo cliente' }, options);
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.data.history[1].note, 'Solicitado pelo cliente');
  const pickup = await call('orders', 'POST', input, { key: randomUUID() });
  options.params.id = pickup.data.id;
  const result = await call('order', 'PATCH', { status: 'preparing', version: 1 }, options);
  assert.deepEqual(result.data.nextStatuses, ['ready', 'cancelled']);
});
test('orders survive reopening the database, and filtering/search remain restricted', async () => {
  await db.close();
  const detail = await call('order', 'GET', undefined, { cookie, params: { id: orderId } });
  assert.equal(detail.status, 200);
  assert.equal(detail.data.status, 'delivered');
  const filtered = await call('orders', 'GET', undefined, { cookie, params: { status: 'delivered', search: 'Cliente' } });
  assert.equal(filtered.data.count, 1);
  const injection = await call('orders', 'GET', undefined, { cookie, params: { search: "' OR 1=1 --" } });
  assert.equal(injection.data.count, 0);
});
test('logout revokes the session on the server', async () => {
  assert.equal((await call('logout', 'POST', {}, { cookie })).status, 200);
  assert.equal((await call('orders', 'GET', undefined, { cookie })).status, 401);
});
test('expired sessions cannot read customer data', async () => {
  const result = await call('login', 'POST', { email: 'team@example.com', password });
  const expiredCookie = result.cookie.split(';')[0];
  await db.query('UPDATE sessions SET expires_at=$1 WHERE email=$2', [Date.now() - 1000, 'team@example.com']);
  assert.equal((await call('orders', 'GET', undefined, { cookie: expiredCookie })).status, 401);
});
test('production refuses an ephemeral local database', () => {
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['-e', "require('./server/db.cjs').init().catch(e=>{console.log(e.message);process.exitCode=1})"], { cwd: path.resolve(__dirname, '..'), env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: '' }, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /DATABASE_URL is required/);
});
test('password guessing is rate limited', async () => {
  let response;
  for (let i = 0; i < 9; i++) response = await call('login', 'POST', { email: 'nonexistent@example.com', password: 'wrong' });
  assert.equal(response.status, 429);
});
