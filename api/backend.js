const { getSession, login, logout, limit, digest, production } = require('../server/auth.cjs');
const { STATUSES, fail, createOrder, getOrder, listOrders, updateOrder, nextStatuses } = require('../server/orders.cjs');

async function readBody(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) fail('Use JSON.', 415);
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > 65536) fail('Envio muito grande.', 413);
    return typeof req.body === 'string' ? JSON.parse(raw) : req.body;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 65536) fail('Envio muito grande.', 413);
  }
  try { return JSON.parse(raw); } catch { fail('JSON inválido.'); }
}
function checkOrigin(req) {
  let expected = process.env.APP_ORIGIN;
  if (!expected && !production()) expected = `http://127.0.0.1:${process.env.PORT || 4181}`;
  if (!expected) fail('Serviço ainda não configurado.', 503);
  if (req.headers.origin !== new URL(expected).origin) fail('Origem não permitida.', 403);
}
function ipAddress(req) {
  // Vercel overwrites x-vercel-forwarded-for; never trust arbitrary forwarded headers locally.
  return process.env.VERCEL ? String(req.headers['x-vercel-forwarded-for'] || 'unknown').split(',')[0].trim() : req.socket?.remoteAddress || 'local';
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  try {
    const url = new URL(req.url, 'http://localhost');
    const action = url.searchParams.get('action');
    if (!['GET', 'POST', 'PATCH'].includes(req.method)) fail('Método não permitido.', 405);
    if (req.method !== 'GET') checkOrigin(req);
    const ip = digest(ipAddress(req));
    if (action === 'login' && req.method === 'POST') {
      if (!await limit(`login-ip:${ip}`, 20, 15 * 60000)) fail('Muitas tentativas. Aguarde 15 minutos.', 429);
      const body = await readBody(req);
      if (typeof body?.email !== 'string' || body.email.length > 254 || typeof body.password !== 'string' || body.password.length > 256) fail('E-mail ou senha inválidos.', 401);
      const email = body.email.trim().toLowerCase();
      if (!await limit(`login-email:${digest(email)}`, 8, 15 * 60000)) fail('Muitas tentativas. Aguarde 15 minutos.', 429);
      if (!await login(email, body.password, req, res)) fail('E-mail ou senha inválidos.', 401);
      return send(200, { email });
    }
    if (action === 'orders' && req.method === 'POST') {
      if (!await limit(`order:${ip}`, 15, 10 * 60000)) fail('Muitos envios. Aguarde alguns minutos.', 429);
      return send(201, await createOrder(await readBody(req), req.headers['idempotency-key']));
    }
    const admin = await getSession(req);
    if (!admin) fail('Entre com sua conta da equipe.', 401);
    if (action === 'session' && req.method === 'GET') return send(200, { email: admin.email, statuses: STATUSES });
    if (action === 'logout' && req.method === 'POST') { await logout(req, res); return send(200, { ok: true }); }
    if (action === 'orders' && req.method === 'GET') return send(200, await listOrders(url.searchParams));
    if (action === 'order') {
      const id = url.searchParams.get('id');
      if (!/^[a-f0-9-]{36}$/.test(id || '')) fail('Pedido inválido.');
      if (req.method === 'GET') {
        const order = await getOrder(id);
        return send(200, { ...order, nextStatuses: nextStatuses(order) });
      }
      if (req.method === 'PATCH') {
        const order = await updateOrder(id, await readBody(req), admin.email);
        return send(200, { ...order, nextStatuses: nextStatuses(order) });
      }
    }
    fail('Rota não encontrada.', 404);
  } catch (error) {
    if (!error.status) console.error('API failure:', error.code || error.name);
    send(error.status || 503, { error: error.status ? error.message : 'Serviço indisponível. Tente novamente em instantes.' });
  }
};
