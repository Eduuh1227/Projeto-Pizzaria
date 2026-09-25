const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { randomUUID } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { CONFIG } = require('../catalog.js');
delete process.env.DATABASE_URL;
delete process.env.VERCEL;
process.env.NODE_ENV = 'test';
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'realeza-browser-'));
process.env.SQLITE_PATH = path.join(directory, 'browser.sqlite');
const db = require('../server/db.cjs');
const { hashPassword } = require('../server/auth.cjs');
const root = path.resolve(__dirname, '..');
const screenshots = path.join(root, 'test-results');
let server;
let browser;
async function port() {
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const value = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return value;
}
async function noOverflow(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Page overflows horizontally');
  if (await page.locator('#detail').isVisible()) {
    assert.equal(await page.locator('#detail').evaluate(el => el.scrollWidth <= el.clientWidth), true, 'Detail drawer overflows');
  }
}
(async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const password = randomUUID();
  await db.query('INSERT INTO admins(email,password_hash,created_at) VALUES($1,$2,$3)', ['browser@example.com', await hashPassword(password), new Date().toISOString()]);
  const localPort = await port();
  const origin = `http://127.0.0.1:${localPort}`;
  server = spawn(process.execPath, ['scripts/dev.cjs'], { cwd: root, env: { ...process.env, PORT: String(localPort), APP_ORIGIN: origin }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Local server did not start')), 15000);
    server.stdout.on('data', data => { if (String(data).includes('Admin:')) { clearTimeout(timeout); resolve(); } });
    server.once('exit', code => reject(new Error(`Server exited: ${code}`)));
  });
  browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const errors = [];
  const localFile = await browser.newPage();
  localFile.on('pageerror', error => errors.push(error.message));
  await localFile.route('https://**/*', route => route.abort());
  await localFile.route(CONFIG.business.siteUrl, route => route.fulfill({ contentType: 'text/html', body: '<h1>Site online</h1>' }));
  await localFile.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await localFile.waitForURL(CONFIG.business.siteUrl);
  assert.equal(await localFile.locator('h1').innerText(), 'Site online');
  await localFile.close();
  const customer = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await customer.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://**/*', route => route.abort());
  await page.goto(`${origin}/?test=1`);
  await page.getByRole('button', { name: 'Adicionar Calabresa', exact: true }).click();
  await page.locator('[data-product-form] button[type=submit]').click();
  await page.locator('[data-open-cart]').first().click();
  await page.locator('[data-checkout]').click();
  const form = page.locator('[data-checkout-form]');
  await form.locator('[name=name]').fill('Cliente Teste Browser');
  const phone = form.locator('[name=phone]');
  await phone.fill('abc (11) 99999-9999');
  assert.equal(await phone.inputValue(), '11999999999');
  await phone.pressSequentially('abc-+ ');
  assert.equal(await phone.inputValue(), '11999999999');
  await phone.fill('');
  await phone.focus();
  await page.keyboard.insertText('+55 (11) 99999-9999');
  assert.equal(await phone.inputValue(), '5511999999999');
  await phone.evaluate(el => el.setSelectionRange(2, 2));
  await page.keyboard.insertText('a7-');
  assert.equal(await phone.inputValue(), '55711999999999');
  assert.equal(await phone.evaluate(el => el.selectionStart), 3);
  await form.locator('[name=phone]').fill('11999999999');
  await page.route('https://viacep.com.br/ws/05877200/json/', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ logradouro: 'Rua Cortegaca', bairro: 'Jardim Guaruja', localidade: 'São Paulo', uf: 'SP' }) }));
  await form.locator('[name=cep]').fill('05877200');
  await page.waitForFunction(() => document.querySelector('#cep-status').textContent.includes('Endereço encontrado'));
  assert.equal(await form.locator('[name=street]').inputValue(), 'Rua Cortegaca');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const cepBox = await form.locator('[name=cep]').boundingBox();
    const streetBox = await form.locator('[name=street]').boundingBox();
    assert.ok(Math.abs(cepBox.height - streetBox.height) < 1, 'Street input stretched after CEP lookup');
    if (width === 1440) assert.ok(Math.abs(cepBox.y - streetBox.y) < 1, 'CEP and street inputs are misaligned');
    assert.equal(await form.evaluate(el => el.scrollWidth <= el.clientWidth), true, 'Checkout overflows horizontally');
    await form.locator('[name=street]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshots, `checkout-address-${width}.png`) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await form.locator('[name=fulfillment]').selectOption('pickup');
  await form.locator('[name=generalNotes]').fill('<img src=x onerror=alert(1)> Sem cebola, por favor.');
  for (const message of ['Failed to fetch', 'NetworkError when attempting to fetch resource.', 'Load failed']) {
    await page.evaluate(message => {
      window.originalFetch = window.fetch;
      window.fetch = (...args) => String(args[0]).includes('/api/backend?action=orders')
        ? Promise.reject(new TypeError(message)) : window.originalFetch(...args);
    }, message);
    await form.locator('button[type=submit]').click();
    await form.locator('[data-checkout-error]:not([hidden])').waitFor();
    assert.match(await form.locator('[data-checkout-error]').innerText(), /Seu carrinho foi mantido/);
    assert.equal(await form.locator('button[type=submit]').isEnabled(), true);
    assert.equal(await page.locator('[data-success-modal]').isVisible(), false);
    assert.equal(await form.locator('[name=name]').inputValue(), 'Cliente Teste Browser');
    await page.evaluate(() => { window.fetch = window.originalFetch; delete window.originalFetch; });
  }
  await page.route('**/api/backend?action=orders', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Conexão temporariamente indisponível.' }) }));
  await form.locator('button[type=submit]').click();
  await form.locator('[data-checkout-error]:not([hidden])').waitFor();
  assert.match(await form.locator('[data-checkout-error]').innerText(), /temporariamente indisponível/);
  assert.equal(await page.locator('[data-success-modal]').isVisible(), false);
  assert.equal(await form.locator('[name=name]').inputValue(), 'Cliente Teste Browser');
  await page.unroute('**/api/backend?action=orders');
  await form.locator('button[type=submit]').click();
  await page.locator('[data-success-modal][open]').waitFor();
  assert.match(await page.locator('[data-reopen-whatsapp]').getAttribute('href'), /^https:\/\/wa\.me\//);
  const storedUrl = await page.evaluate(() => document.body.dataset.lastWhatsappUrl);
  assert.match(decodeURIComponent(storedUrl), /38,00/);
  assert.equal((await customer.request.get(`${origin}/api/backend?action=orders`)).status(), 401);
  await page.locator('[data-close-success]').click();
  await page.locator('[data-open-cart]').first().click();
  await page.locator('[data-checkout]').click();
  await form.locator('button[type=submit]').click();
  await page.locator('[data-success-modal][open]').waitFor();

  const staff = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const admin = await staff.newPage();
  admin.on('pageerror', error => errors.push(error.message));
  await admin.goto(`${origin}/admin/`);
  await admin.locator('#login-form').waitFor();
  await admin.screenshot({ path: path.join(screenshots, 'admin-login.png') });
  await admin.locator('[name=email]').fill('browser@example.com');
  await admin.locator('[name=password]').fill(password);
  await admin.locator('#login-form button').click();
  await admin.locator('#orders tr').waitFor();
  assert.equal(await admin.locator('#orders tr').count(), 1, 'Retry duplicated an order');
  await noOverflow(admin);
  await admin.screenshot({ path: path.join(screenshots, 'admin-desktop.png'), fullPage: true });
  await admin.locator('.order-link').first().click();
  await admin.locator('#next-status').waitFor();
  assert.match(await admin.locator('#detail-body').innerText(), /Sem cebola/);
  assert.equal(await admin.locator('#detail-body img').count(), 0, 'Unsafe HTML from customer');
  await admin.locator('#next-status').selectOption('preparing');
  await admin.locator('#status-form button').click();
  await admin.waitForFunction(() => document.querySelector('.detail-meta .status')?.textContent === 'Em preparo');
  await admin.screenshot({ path: path.join(screenshots, 'admin-detail-desktop.png') });
  await admin.locator('#next-status').selectOption('ready');
  await admin.locator('#status-form button').click();
  await admin.waitForFunction(() => document.querySelector('.detail-meta .status')?.textContent === 'Pronto para retirada');
  await admin.locator('#next-status').selectOption('delivered');
  await admin.locator('#status-form button').click();
  await admin.waitForFunction(() => document.querySelector('.detail-meta .status')?.textContent === 'Concluído');
  assert.equal(await admin.locator('#status-form').isVisible(), false);
  for (const width of [390, 320]) {
    await admin.setViewportSize({ width, height: 844 });
    await noOverflow(admin);
    await admin.screenshot({ path: path.join(screenshots, `admin-detail-${width}.png`) });
  }
  await admin.locator('#close-detail').click();
  await admin.setViewportSize({ width: 390, height: 844 });
  await noOverflow(admin);
  await admin.screenshot({ path: path.join(screenshots, 'admin-mobile.png'), fullPage: true });
  await admin.reload();
  await admin.locator('#orders tr').waitFor();
  assert.match(await admin.locator('#orders').innerText(), /Concluído/);
  await admin.locator('#logout').click();
  await admin.locator('#login-view').waitFor();
  assert.equal((await staff.request.get(`${origin}/api/backend?action=orders`)).status(), 401);
  for (const privatePath of ['/.data/admin-access.txt', '/server/db.cjs', '/.env', '/tests/browser.cjs']) assert.equal((await staff.request.get(origin + privatePath)).status(), 404);
  assert.deepEqual(errors, []);
  console.log('PASS: storefront -> persistent order -> admin login -> status lifecycle -> reload -> logout. Desktop/mobile 390/320, no overflow or JS errors.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  if (server && server.exitCode === null) { server.kill(); await new Promise(resolve => server.once('exit', resolve)); }
  await db.close();
  fs.rmSync(directory, { recursive: true });
});
