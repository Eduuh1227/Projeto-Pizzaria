const $ = selector => document.querySelector(selector);
const labels = { new: 'Novo', preparing: 'Em preparo', ready: 'Pronto para retirada', out_for_delivery: 'Saiu para entrega', delivered: 'Concluído', cancelled: 'Cancelado' };
const filterLabels = { '': 'Todos', new: 'Novos', preparing: 'Em preparo', ready: 'Retirada', out_for_delivery: 'Em entrega', delivered: 'Concluídos', cancelled: 'Cancelados' };
const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTime = value => new Date(value).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icons = () => window.lucide?.createIcons();
let status = '';
let page = 1;
let activeOrder = null;
let authenticated = false;
let epoch = 0;
let listRequest = 0;
let detailRequest = 0;
let noticeTimer;
const badge = value => `<span class="status ${escapeHtml(value)}">${escapeHtml(labels[value])}</span>`;

async function api(action, options = {}, params = {}) {
  const response = await fetch(`/api/backend?${new URLSearchParams({ action, ...params })}`, {
    ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, cache: 'no-store', signal: AbortSignal.timeout(20000)
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 && action !== 'login') showLogin();
    throw new Error(result.error || 'Não foi possível concluir. Tente novamente.');
  }
  return result;
}
function showLogin() {
  epoch++;
  authenticated = false;
  activeOrder = null;
  $('#detail').close();
  $('#detail-body').replaceChildren();
  $('#orders').replaceChildren();
  $('#account-email').textContent = '';
  $('#app').hidden = true;
  $('#login-view').hidden = false;
  $('#login-form').elements.password.value = '';
}
function showApp(email) {
  authenticated = true;
  epoch++;
  $('#login-view').hidden = true;
  $('#app').hidden = false;
  $('#account-email').textContent = email;
  $('#login-error').textContent = '';
  $('#login-form').reset();
  refresh();
}
function notice(message) {
  clearTimeout(noticeTimer);
  $('#notice').textContent = message;
  $('#notice').hidden = false;
  noticeTimer = setTimeout(() => { $('#notice').hidden = true; }, 4000);
}
function renderFilters(counts) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  $('#status-filters').innerHTML = Object.entries(filterLabels).map(([key, label]) => `<button type="button" data-status="${key}" aria-pressed="${status === key}">${label}<span class="count">${key ? counts[key] || 0 : total}</span></button>`).join('');
}
async function refresh() {
  if (!authenticated) return;
  const currentEpoch = epoch;
  const request = ++listRequest;
  $('#refresh').disabled = true;
  const params = { status, page, search: $('#filters').elements.search.value.trim(), date: $('#filters').elements.date.value };
  try {
    const data = await api('orders', {}, params);
    if (epoch !== currentEpoch || request !== listRequest) return;
    $('#app-error').hidden = true;
    renderFilters(data.counts);
    $('#list-title').textContent = status ? filterLabels[status] : 'Todos os pedidos';
    $('#result-count').textContent = `${data.count} ${data.count === 1 ? 'pedido' : 'pedidos'}`;
    $('#empty').hidden = data.orders.length > 0;
    $('#orders').innerHTML = data.orders.map(order => `<tr>
      <td><button class="order-link" data-order="${order.id}">${escapeHtml(order.reference)}</button><small>${dateTime(order.created_at)}</small></td>
      <td><strong>${escapeHtml(order.customer_name)}</strong><small>${escapeHtml(order.phone)}</small></td>
      <td>${order.fulfillment === 'pickup' ? 'Retirada' : 'Entrega'}</td>
      <td>${badge(order.status)}</td><td class="align-right"><strong>${money(order.total)}</strong></td>
      <td><button class="quiet" data-order="${order.id}" aria-label="Detalhes do pedido ${escapeHtml(order.reference)}" title="Ver detalhes"><i data-lucide="chevron-right"></i></button></td>
    </tr>`).join('');
    $('#page-label').textContent = `Página ${page} de ${Math.max(1, Math.ceil(data.count / 30))}`;
    $('#previous').disabled = page <= 1;
    $('#next').disabled = page * 30 >= data.count;
    $('#sync-time').textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    icons();
  } catch (error) {
    if (epoch !== currentEpoch) return;
    $('#app-error').textContent = `${error.message} Os dados exibidos podem estar desatualizados.`;
    $('#app-error').hidden = false;
  } finally { if (request === listRequest) $('#refresh').disabled = false; }
}
function renderDetail(order) {
  activeOrder = order;
  const c = order.customer;
  const address = c.address;
  $('#detail-title').textContent = order.reference;
  $('#detail-body').innerHTML = `
    <div class="detail-meta">${badge(order.status)}<time>${dateTime(order.createdAt)}</time></div>
    <section class="detail-section"><h3>Cliente</h3><p><strong>${escapeHtml(c.name)}</strong></p><p><a href="tel:${escapeHtml(c.phone)}">${escapeHtml(c.phone)}</a></p></section>
    <section class="detail-section"><h3>Itens do pedido</h3><ul class="item-list">${order.items.map(item => `<li><div class="item-line"><span><b>${item.quantity}×</b> ${escapeHtml(item.name)}</span><strong>${money(item.unitPrice * item.quantity)}</strong></div>${item.details.map(detail => `<small>${escapeHtml(detail)}</small>`).join('')}${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ''}</li>`).join('')}</ul>
      <div class="totals"><div><span>Subtotal</span><span>${money(order.totals.subtotal)}</span></div><div><span>Desconto${order.coupon ? ` (${escapeHtml(order.coupon)})` : ''}</span><span>${money(order.totals.discount)}</span></div><div><span>Total</span><span>${money(order.totals.total)}</span></div></div>
    </section>
    <section class="detail-section"><h3>${c.fulfillment === 'pickup' ? 'Retirada no balcão' : 'Entrega'}</h3>${address ? `<p>${escapeHtml(address.street)}, ${escapeHtml(address.number)}</p><p>${escapeHtml(address.neighborhood)} · São Paulo</p><p>CEP: ${escapeHtml(address.cep || 'Não informado')}</p>${address.complement ? `<p>Complemento: ${escapeHtml(address.complement)}</p>` : ''}${address.reference ? `<p>Referência: ${escapeHtml(address.reference)}</p>` : ''}` : '<p>Retirada pelo cliente</p>'}</section>
    <section class="detail-section"><h3>Pagamento</h3><p>${escapeHtml(c.payment)}</p>${c.changeFor ? `<p>Troco para ${money(c.changeFor)} · devolver ${money(c.changeFor - order.totals.total)}</p>` : ''}</section>
    ${c.generalNotes ? `<section class="detail-section"><h3>Observações</h3><p>${escapeHtml(c.generalNotes)}</p></section>` : ''}
    <section class="detail-section"><h3>Histórico</h3><ol class="history">${order.history.map(event => `<li><strong>${escapeHtml(labels[event.status])}</strong><small>${dateTime(event.createdAt)} · ${escapeHtml(event.actor)}</small>${event.note ? `<p>${escapeHtml(event.note)}</p>` : ''}</li>`).join('')}</ol></section>`;
  $('#status-form').hidden = !order.nextStatuses.length;
  $('#next-status').innerHTML = '<option value="">Selecionar status</option>' + order.nextStatuses.map(value => `<option value="${value}">${value === 'delivered' ? (c.fulfillment === 'pickup' ? 'Retirado pelo cliente' : 'Entregue') : labels[value]}</option>`).join('');
  $('#cancel-note').value = '';
  syncCancel();
}
async function openDetail(id) {
  const currentEpoch = epoch;
  const request = ++detailRequest;
  $('#detail-title').textContent = 'Carregando...';
  $('#detail-body').replaceChildren();
  $('#detail-error').textContent = '';
  $('#status-form').hidden = true;
  activeOrder = null;
  if (!$('#detail').open) $('#detail').showModal();
  try {
    const order = await api('order', {}, { id });
    if (epoch === currentEpoch && request === detailRequest) renderDetail(order);
  } catch (error) { if (epoch === currentEpoch) $('#detail-error').textContent = error.message; }
}
function syncCancel() {
  const cancel = $('#next-status').value === 'cancelled';
  $('#cancel-field').hidden = !cancel;
  $('#cancel-note').required = cancel;
  $('#status-form button span').textContent = cancel ? 'Confirmar cancelamento' : 'Salvar status';
}
$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $('#login-form button');
  button.disabled = true;
  $('#login-error').textContent = '';
  try { const result = await api('login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.target))) }); showApp(result.email); }
  catch (error) { $('#login-error').textContent = error.message; }
  finally { button.disabled = false; }
});
$('#logout').addEventListener('click', async () => {
  $('#logout').disabled = true;
  try { await api('logout', { method: 'POST', body: '{}' }); showLogin(); }
  catch (error) { notice('Não foi possível encerrar a sessão. Tente novamente.'); }
  finally { $('#logout').disabled = false; }
});
$('#refresh').addEventListener('click', refresh);
$('#status-filters').addEventListener('click', event => { const button = event.target.closest('[data-status]'); if (button) { status = button.dataset.status; page = 1; refresh(); } });
$('#orders').addEventListener('click', event => { const button = event.target.closest('[data-order]'); if (button) openDetail(button.dataset.order); });
$('#filters').addEventListener('submit', event => { event.preventDefault(); page = 1; refresh(); });
let searchTimer;
$('#filters').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { page = 1; refresh(); }, 300); });
$('#clear-filters').addEventListener('click', () => { $('#filters').reset(); status = ''; page = 1; refresh(); });
$('#previous').addEventListener('click', () => { page--; refresh(); });
$('#next').addEventListener('click', () => { page++; refresh(); });
$('#close-detail').addEventListener('click', () => $('#detail').close());
$('#next-status').addEventListener('change', syncCancel);
$('#status-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!activeOrder) return;
  const currentEpoch = epoch;
  const button = $('#status-form button');
  button.disabled = true;
  $('#detail-error').textContent = '';
  try {
    const order = await api('order', { method: 'PATCH', body: JSON.stringify({ version: activeOrder.version, status: $('#next-status').value, note: $('#cancel-note').value }) }, { id: activeOrder.id });
    if (currentEpoch !== epoch) return;
    renderDetail(order);
    refresh();
    notice('Status atualizado.');
  } catch (error) { if (currentEpoch === epoch) $('#detail-error').textContent = `${error.message} Feche e reabra o pedido para conferir o status atual.`; }
  finally { button.disabled = false; }
});
setInterval(() => { if (!document.hidden) refresh(); }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
icons();
api('session').then(result => showApp(result.email)).catch(error => { if (error.message !== 'Entre com sua conta da equipe.') $('#login-error').textContent = error.message; });
