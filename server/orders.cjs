const { randomUUID, randomBytes } = require('node:crypto');
const { CONFIG, PRODUCTS } = require('../catalog.js');
const { query } = require('./db.cjs');
const { digest } = require('./auth.cjs');

const STATUSES = { new: 'Novo', preparing: 'Em preparo', ready: 'Pronto para retirada', out_for_delivery: 'Saiu para entrega', delivered: 'Concluído', cancelled: 'Cancelado' };
function fail(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
function text(value, name, max, required = false) {
  if (value === undefined || value === null) value = '';
  if (typeof value !== 'string' || value.length > max) fail(`${name}: valor inválido.`);
  value = value.trim();
  if (required && !value) fail(`Preencha ${name}.`);
  return value;
}
function money(value) { return Math.round(value * 100); }
function normalize(body) {
  if (!body || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) fail('Carrinho inválido.');
  const input = body.customer || {};
  const customer = {
    name: text(input.name, 'nome', 100, true),
    phone: text(input.phone, 'telefone', 25, true).replace(/\D/g, ''),
    fulfillment: input.fulfillment,
    payment: input.payment,
    generalNotes: text(input.generalNotes, 'observações', 1000)
  };
  if (!/^\d{10,13}$/.test(customer.phone)) fail('Informe um telefone válido com DDD.');
  if (!['delivery', 'pickup'].includes(customer.fulfillment)) fail('Forma de recebimento inválida.');
  if (!['Pix', 'Dinheiro', 'Cartão de débito na entrega', 'Cartão de crédito na entrega'].includes(customer.payment)) fail('Pagamento inválido.');
  if (customer.fulfillment === 'delivery') {
    customer.address = {
      cep: text(input.cep, 'CEP', 9).replace(/\D/g, ''),
      street: text(input.street, 'rua', 180, true),
      number: text(input.number, 'número', 20, true),
      neighborhood: text(input.neighborhood, 'bairro', 100, true),
      complement: text(input.complement, 'complemento', 150),
      reference: text(input.reference, 'referência', 200),
      city: 'São Paulo'
    };
    if (customer.address.cep && !/^\d{8}$/.test(customer.address.cep)) fail('CEP inválido.');
  }
  let units = 0;
  const items = body.items.map(item => {
    const product = PRODUCTS.find(product => product.id === item?.productId && product.available);
    if (!product) fail('Um item não está mais disponível.');
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) fail('Quantidade inválida (1 a 20 por item).');
    units += item.quantity;
    let unitPrice = money(product.price);
    let name = product.name;
    const details = [];
    let crustId = null;
    let secondFlavorId = null;
    if (product.type === 'pizza') {
      if (item.sizeId && item.sizeId !== 'medium') fail('Tamanho indisponível.');
      if (item.doughId && item.doughId !== 'traditional') fail('Massa indisponível.');
      if (item.half) {
        const second = PRODUCTS.find(p => p.id === item.secondFlavorId && p.available && p.type === 'pizza' && (p.category === 'brotos') === (product.category === 'brotos'));
        if (!second) fail('Segundo sabor inválido.');
        unitPrice = Math.max(unitPrice, money(second.price));
        name += ` / ${second.name}`;
        secondFlavorId = second.id;
      }
      const crust = CONFIG.crusts.find(c => c.id === (item.crustId || 'none'));
      if (!crust) fail('Borda inválida.');
      crustId = crust.id;
      unitPrice += money(crust.price);
      details.push(`Borda: ${crust.name}`);
    } else if (item.half || (item.crustId && item.crustId !== 'none')) fail('Opções inválidas para este item.');
    const extras = item.extras || [];
    if (!Array.isArray(extras) || extras.length > CONFIG.extras.length || new Set(extras).size !== extras.length || (product.type === 'simple' && extras.length)) fail('Adicionais inválidos.');
    const names = extras.map(id => {
      const extra = CONFIG.extras.find(e => e.id === id);
      if (!extra) fail('Adicional indisponível.');
      unitPrice += money(extra.price);
      return extra.name;
    });
    if (names.length) details.push(`Adicionais: ${names.join(', ')}`);
    const notes = text(item.notes, 'observação do item', 500);
    return { productId: product.id, name, category: product.category, quantity: item.quantity, unitPrice, secondFlavorId, crustId, extras, details, notes };
  });
  if (units > 100) fail('Para pedidos acima de 100 itens, fale com a pizzaria.');
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  if (subtotal < money(CONFIG.business.minimumOrder)) fail(`O pedido mínimo é R$ ${CONFIG.business.minimumOrder.toFixed(2)}.`);
  const couponCode = text(body.coupon, 'cupom', 30).toUpperCase();
  let discount = 0;
  if (couponCode) {
    const coupon = CONFIG.coupons.find(c => c.code === couponCode);
    if (!coupon || (coupon.pickupOnly && customer.fulfillment !== 'pickup') || subtotal < money(coupon.minimum || 0)) fail('Cupom não aplicável a este pedido.');
    discount = Math.min(subtotal, coupon.type === 'percent' ? Math.round(subtotal * coupon.value / 100) : money(coupon.value));
  }
  const total = subtotal - discount;
  if (body.expectedTotal !== undefined && body.expectedTotal !== total) fail('Os preços foram atualizados. Recarregue o cardápio e confira seu carrinho.', 409);
  if (customer.payment === 'Dinheiro') {
    const raw = text(input.changeFor, 'troco', 20, true);
    if (!/^\d+(?:[.,]\d{1,2})?$/.test(raw)) fail('Valor de troco inválido.');
    customer.changeFor = money(Number(raw.replace(',', '.')));
    if (customer.changeFor < total || customer.changeFor > 10000000) fail('O valor para troco deve cobrir o total do pedido.');
  }
  return { customer, items, coupon: couponCode, totals: { subtotal, discount, total }, source: 'site' };
}

async function createOrder(body, key) {
  if (!/^[a-f0-9-]{36}$/.test(key || '')) fail('Identificador de envio inválido.');
  const data = normalize(body);
  const payloadHash = digest(JSON.stringify(data));
  const now = new Date().toISOString();
  const id = randomUUID();
  const reference = `RZ-${now.slice(0, 10).replaceAll('-', '')}-${randomBytes(4).toString('hex').toUpperCase()}`;
  data.history = [{ status: 'new', actor: 'Site', note: 'Registrado no site; confirmação pelo WhatsApp pendente.', createdAt: now }];
  // Unique idempotency key makes concurrent retries atomic, including after a lost response.
  await query(`INSERT INTO orders(id,reference,idempotency_key,payload_hash,status,version,created_at,updated_at,customer_name,phone,fulfillment,total,data)
    VALUES($1,$2,$3,$4,'new',1,$5,$5,$6,$7,$8,$9,$10) ON CONFLICT(idempotency_key) DO NOTHING`,
    [id, reference, key, payloadHash, now, data.customer.name, data.customer.phone, data.customer.fulfillment, data.totals.total, JSON.stringify(data)]);
  const { rows } = await query('SELECT id,reference,payload_hash,total FROM orders WHERE idempotency_key=$1', [key]);
  const row = rows[0];
  if (row.payload_hash !== payloadHash) fail('Este envio já foi usado para outro pedido. Reabra a finalização.', 409);
  return { id: row.id, reference: row.reference, totals: data.totals };
}
function unpack(row) {
  const data = JSON.parse(row.data);
  return { id: row.id, reference: row.reference, status: row.status, version: row.version, createdAt: row.created_at, updatedAt: row.updated_at, ...data };
}
async function getOrder(id) {
  const { rows } = await query('SELECT * FROM orders WHERE id=$1', [id]);
  if (!rows[0]) fail('Pedido não encontrado.', 404);
  return unpack(rows[0]);
}
async function listOrders(params) {
  const status = params.get('status') || '';
  if (status && !STATUSES[status]) fail('Status inválido.');
  const search = text(params.get('search'), 'busca', 100).toLowerCase();
  const date = params.get('date') || '';
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)))) fail('Data inválida.');
  const page = Math.max(1, Math.min(10000, Number(params.get('page')) || 1));
  const values = [];
  const clauses = [];
  const bind = value => { values.push(value); return `$${values.length}`; };
  if (date) {
    const start = new Date(`${date}T00:00:00-03:00`);
    const end = new Date(start.getTime() + 86400000);
    clauses.push(`created_at>=${bind(start.toISOString())} AND created_at<${bind(end.toISOString())}`);
  }
  if (search) clauses.push(`(LOWER(customer_name) LIKE ${bind(`%${search}%`)} OR phone LIKE ${bind(`%${search}%`)} OR LOWER(reference) LIKE ${bind(`%${search}%`)})`);
  const where = () => clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const summary = await query(`SELECT status,COUNT(*) AS count FROM orders ${where()} GROUP BY status`, values);
  if (status) clauses.push(`status=${bind(status)}`);
  const count = await query(`SELECT COUNT(*) AS count FROM orders ${where()}`, values);
  const { rows } = await query(`SELECT id,reference,status,version,created_at,customer_name,phone,fulfillment,total FROM orders ${where()} ORDER BY created_at DESC,id DESC LIMIT 30 OFFSET ${bind((Math.floor(page) - 1) * 30)}`, values);
  return { orders: rows, count: Number(count.rows[0].count), page: Math.floor(page), counts: Object.fromEntries(summary.rows.map(r => [r.status, Number(r.count)])) };
}
function nextStatuses(order) {
  return ({ new: ['preparing', 'cancelled'], preparing: [order.customer.fulfillment === 'pickup' ? 'ready' : 'out_for_delivery', 'cancelled'], ready: ['delivered', 'cancelled'], out_for_delivery: ['delivered', 'cancelled'], delivered: [], cancelled: [] })[order.status];
}
async function updateOrder(id, body, actor) {
  const order = await getOrder(id);
  if (body.version !== order.version) fail('Este pedido foi atualizado por outra pessoa. Atualize a tela.', 409);
  if (!nextStatuses(order).includes(body.status)) fail('Esta mudança de status não é permitida.');
  const note = text(body.note, 'motivo', 500, body.status === 'cancelled');
  const now = new Date().toISOString();
  const { id: ignored, reference, status, version, createdAt, updatedAt, ...data } = order;
  data.history.push({ status: body.status, actor, note, createdAt: now });
  // Status and audit history share one optimistic write; neither can be saved alone.
  const result = await query('UPDATE orders SET status=$1,version=version+1,updated_at=$2,data=$3 WHERE id=$4 AND version=$5', [body.status, now, JSON.stringify(data), id, body.version]);
  if (!result.rowCount) fail('Este pedido foi atualizado por outra pessoa. Atualize a tela.', 409);
  return getOrder(id);
}
module.exports = { STATUSES, fail, normalize, createOrder, getOrder, listOrders, updateOrder, nextStatuses };
