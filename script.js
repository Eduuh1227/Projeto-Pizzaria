const state = {
  cart: loadCart(),
  activeCategory: "savory",
  activeFilter: "all",
  search: "",
  coupon: null,
  currentProduct: null,
  editingId: null,
  lastWhatsappUrl: ""
};

const els = {};
let memoryCart = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  hydrateBusinessInfo();
  renderCategories();
  renderProducts();
  renderHoursList();
  renderNeighborhoodOptions();
  renderCart();
  updateOpenStatus();
  bindEvents();
  observeReveals();
  setInterval(updateOpenStatus, 60000);
}

function cacheElements() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    els[`config-${el.dataset.config}`] = el;
  });
  Object.assign(els, {
    header: document.querySelector(".site-header"),
    menuToggle: document.querySelector("[data-menu-toggle]"),
    mainNav: document.querySelector("[data-main-nav]"),
    products: document.querySelector("[data-products]"),
    empty: document.querySelector("[data-empty]"),
    categoryTabs: document.querySelector("[data-category-tabs]"),
    search: document.querySelector("[data-search]"),
    cartDrawer: document.querySelector("[data-cart-drawer]"),
    cartItems: document.querySelector("[data-cart-items]"),
    cartCount: document.querySelector("[data-cart-count]"),
    cartMobileCount: document.querySelector("[data-cart-mobile-count]"),
    cartMobileTotal: document.querySelector("[data-cart-mobile-total]"),
    subtotal: document.querySelector("[data-subtotal]"),
    deliveryFee: document.querySelector("[data-delivery-fee]"),
    discount: document.querySelector("[data-discount]"),
    total: document.querySelector("[data-total]"),
    coupon: document.querySelector("[data-coupon]"),
    productModal: document.querySelector("[data-product-modal]"),
    productForm: document.querySelector("[data-product-form]"),
    modalImage: document.querySelector("[data-modal-image]"),
    modalCategory: document.querySelector("[data-modal-category]"),
    modalName: document.querySelector("[data-modal-name]"),
    modalDesc: document.querySelector("[data-modal-desc]"),
    modalOptions: document.querySelector("[data-modal-options]"),
    modalPrice: document.querySelector("[data-modal-price]"),
    checkoutModal: document.querySelector("[data-checkout-modal]"),
    checkoutForm: document.querySelector("[data-checkout-form]"),
    fulfillment: document.querySelector("[data-fulfillment]"),
    addressFields: document.querySelector("[data-address-fields]"),
    neighborhood: document.querySelector("[data-neighborhood]"),
    payment: document.querySelector("[data-payment]"),
    changeWrapper: document.querySelector("[data-change-wrapper]"),
    pixNote: document.querySelector("[data-pix-note]"),
    checkoutSubtotal: document.querySelector("[data-checkout-subtotal]"),
    checkoutDelivery: document.querySelector("[data-checkout-delivery]"),
    checkoutDiscount: document.querySelector("[data-checkout-discount]"),
    checkoutTotal: document.querySelector("[data-checkout-total]"),
    closedWarning: document.querySelector("[data-closed-warning]"),
    successModal: document.querySelector("[data-success-modal]"),
    reopenWhatsapp: document.querySelector("[data-reopen-whatsapp]"),
    toast: document.querySelector("[data-toast]")
  });
}

function hydrateBusinessInfo() {
  const b = CONFIG.business;
  setText("deliveryTime", b.deliveryTime);
  setText("minimumOrder", money(b.minimumOrder));
  setText("payments", "Pix, dinheiro e cartões");
  setText("hours", b.hoursNote);
  setText("hoursFull", b.hoursNote);
  setText("address", b.address);
  setText("phone", b.phone);
  setText("whatsapp", b.whatsapp);
  setText("instagram", b.instagram);
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  const mapsLink = document.querySelector("[data-maps-link]");
  mapsLink.href = b.mapsUrl;
}

function setText(key, value) {
  const el = els[`config-${key}`];
  if (el) el.textContent = value;
}

function bindEvents() {
  window.addEventListener("scroll", () => {
    els.header.classList.toggle("scrolled", window.scrollY > 8);
  });

  els.menuToggle.addEventListener("click", () => {
    const isOpen = els.mainNav.classList.toggle("open");
    els.menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  els.mainNav.addEventListener("click", () => {
    els.mainNav.classList.remove("open");
    els.menuToggle.setAttribute("aria-expanded", "false");
  });

  els.search.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderProducts();
    });
  });

  document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
  document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
  els.cartDrawer.addEventListener("click", (event) => {
    if (event.target === els.cartDrawer) closeCart();
  });
  els.cartItems.addEventListener("click", handleCartAction);

  document.querySelector("[data-clear-cart]").addEventListener("click", () => {
    if (!state.cart.length) return;
    if (confirm("Deseja limpar todo o carrinho?")) {
      state.cart = [];
      persistCart();
      renderCart();
      toast("Carrinho limpo.");
    }
  });

  document.querySelector("[data-apply-coupon]").addEventListener("click", applyCoupon);
  document.querySelector("[data-checkout]").addEventListener("click", openCheckout);

  document.querySelectorAll("[data-whatsapp-start]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.cart.length) openCheckout();
      else {
        location.hash = "cardapio";
        toast("Escolha um item do cardápio para montar o pedido.");
      }
    });
  });

  document.querySelector("[data-close-modal]").addEventListener("click", () => els.productModal.close());
  els.productForm.addEventListener("change", updateModalPrice);
  els.productForm.addEventListener("input", updateModalPrice);
  els.productForm.addEventListener("submit", handleProductSubmit);

  document.querySelector("[data-close-checkout]").addEventListener("click", () => els.checkoutModal.close());
  els.fulfillment.addEventListener("change", () => {
    updateCheckoutVisibility();
    renderCart();
    syncCheckoutTotals();
  });
  els.neighborhood.addEventListener("change", () => {
    renderCart();
    syncCheckoutTotals();
  });
  els.payment.addEventListener("change", updatePaymentVisibility);
  els.payment.addEventListener("input", updatePaymentVisibility);
  bindCepLookup();
  els.checkoutForm.addEventListener("submit", handleCheckout);

  document.querySelector("[data-close-success]").addEventListener("click", () => els.successModal.close());
  document.querySelector("[data-new-order]").addEventListener("click", () => {
    orderAttempt = null;
    try { sessionStorage.removeItem("realeza-order-attempt"); } catch {}
    state.cart = [];
    persistCart();
    renderCart();
    els.successModal.close();
    location.hash = "cardapio";
  });
}

function bindCepLookup() {
  const cep = els.checkoutForm.elements.cep;
  const status = document.querySelector("#cep-status");
  const fields = [els.checkoutForm.elements.street, els.neighborhood];
  const filledValues = new Map();
  let debounce;
  let controller;
  let lastResolved = "";

  function showStatus(message, error = false) {
    status.textContent = message;
    status.dataset.error = String(error);
  }

  async function lookup() {
    clearTimeout(debounce);
    const digits = cep.value.replace(/\D/g, "");
    if (digits.length !== 8 || digits === lastResolved || controller) return;
    const request = new AbortController();
    controller = request;
    const originalValues = fields.map(field => field.value);
    cep.setAttribute("aria-busy", "true");
    cep.setCustomValidity("Aguarde a consulta do CEP.");
    showStatus("Buscando endereço...");
    const timeout = setTimeout(() => request.abort(), 8000);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: request.signal });
      if (!response.ok) throw new Error("CEP lookup failed");
      const address = await response.json();
      if (controller !== request || cep.value.replace(/\D/g, "") !== digits) return;
      cep.setCustomValidity("");
      if (address.erro) {
        showStatus("CEP não encontrado. Confira o CEP ou preencha o endereço manualmente.", true);
        return;
      }
      if (address.uf !== "SP" || address.localidade !== "São Paulo") {
        const message = "Entregamos somente na cidade de São Paulo. Confira o CEP ou selecione retirada.";
        cep.setCustomValidity(message);
        showStatus(message, true);
        lastResolved = digits;
        return;
      }
      const values = [address.logradouro, address.bairro];
      fields.forEach((field, index) => {
        // Preserve edits made while the address request was in flight.
        if (field.value === originalValues[index] && typeof values[index] === "string" && values[index]) {
          field.value = values[index];
          filledValues.set(field, field.value);
        }
      });
      lastResolved = digits;
      showStatus(values.every(Boolean) ? "Endereço encontrado. Informe o número." : "CEP encontrado. Complete os campos de endereço.");
    } catch {
      if (controller !== request) return;
      cep.setCustomValidity("");
      showStatus("Não foi possível consultar o CEP. Preencha o endereço manualmente.", true);
    } finally {
      clearTimeout(timeout);
      if (controller === request) {
        controller = null;
        cep.removeAttribute("aria-busy");
      }
    }
  }

  cep.addEventListener("input", () => {
    clearTimeout(debounce);
    controller?.abort();
    controller = null;
    lastResolved = "";
    cep.removeAttribute("aria-busy");
    const digits = cep.value.replace(/\D/g, "").slice(0, 8);
    cep.value = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    for (const [field, value] of filledValues) {
      if (field.value === value) field.value = "";
    }
    filledValues.clear();
    cep.setCustomValidity(digits && digits.length !== 8 ? "Informe os 8 dígitos do CEP." : "");
    showStatus("");
    if (digits.length === 8) debounce = setTimeout(lookup, 350);
  });
  cep.addEventListener("blur", lookup);
}

function renderCategories() {
  els.categoryTabs.innerHTML = CONFIG.categories
    .map((cat) => `<button type="button" class="chip ${cat.id === state.activeCategory ? "active" : ""}" data-category="${cat.id}">${cat.label}</button>`)
    .join("");
  els.categoryTabs.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      els.categoryTabs.querySelectorAll("[data-category]").forEach((item) => item.classList.toggle("active", item === button));
      renderProducts();
    });
  });
}

function renderProducts() {
  let items = getVisibleProducts();
  els.empty.hidden = items.length > 0;
  els.products.innerHTML = items
    .map(
      (product) => `
      <article class="product-card reveal ${product.available ? "" : "unavailable"}" data-product-id="${product.id}">
        <div class="product-body">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description)}</p>
          <span class="price">${money(product.price)}</span>
        </div>
        <button class="add-button" type="button" aria-label="${product.available ? `Adicionar ${escapeHtml(product.name)}` : `${escapeHtml(product.name)} indisponível`}" ${product.available ? "" : "disabled"}></button>
      </article>`
    )
    .join("");

  els.products.querySelectorAll(".product-card").forEach((card) => {
    const product = PRODUCTS.find((item) => item.id === card.dataset.productId);
    card.querySelector(".add-button").addEventListener("click", (event) => {
      event.stopPropagation();
      openProduct(product);
    });
    card.addEventListener("click", () => product.available && openProduct(product));
  });
  observeReveals();
}

function getVisibleProducts() {
  let list = state.activeCategory === "popular" ? PRODUCTS.filter((product) => product.popular) : PRODUCTS.filter((product) => product.category === state.activeCategory);
  if (state.search) {
    list = list.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(state.search));
  }
  if (state.activeFilter === "vegetarian") list = list.filter((p) => isVegetarian(p));
  if (state.activeFilter === "frango") list = list.filter((p) => p.description.toLowerCase().includes("frango"));
  if (state.activeFilter === "bacon") list = list.filter((p) => p.description.toLowerCase().includes("bacon"));
  if (state.activeFilter === "sweet") list = list.filter((p) => p.category === "sweet" || p.description.toLowerCase().includes("doce"));
  if (state.activeFilter === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (state.activeFilter === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

function isVegetarian(product) {
  const text = `${product.name} ${product.description}`.toLowerCase();
  const meats = ["frango", "bacon", "presunto", "calabresa", "atum", "lombo", "carne", "peito de peru", "peperone"];
  return !meats.some((word) => text.includes(word));
}

function openProduct(product, existingItem = null) {
  state.currentProduct = product;
  state.editingId = existingItem?.cartId || null;
  els.productModal.dataset.category = product.category;
  els.modalImage.src = product.image;
  els.modalImage.alt = product.name;
  els.modalCategory.textContent = categoryLabel(product.category);
  els.modalName.textContent = product.name;
  els.modalDesc.textContent = product.description;
  els.modalOptions.innerHTML = buildOptions(product, existingItem);
  updateModalPrice();
  els.productModal.showModal();
}

function buildOptions(product, existingItem) {
  if (product.type === "simple") {
    return `
      ${quantityGroup(existingItem?.quantity || 1)}
      <label class="option-group">Observações
        <textarea name="notes" rows="3" placeholder="Ex.: bebida gelada, retirar gelo...">${escapeHtml(existingItem?.notes || "")}</textarea>
      </label>`;
  }

  if (product.type === "single") {
    return `
      ${quantityGroup(existingItem?.quantity || 1)}
      ${extrasGroup(existingItem?.extras || [])}
      <label class="option-group">Observações
        <textarea name="notes" rows="3" placeholder="Alguma observação?">${escapeHtml(existingItem?.notes || "")}</textarea>
      </label>`;
  }

  const selectedMode = existingItem?.half ? "half" : "whole";
  const secondFlavor = existingItem?.secondFlavorId || "";
  return `
    <fieldset class="option-group">
      <legend>Montagem</legend>
      <div class="option-grid">
        ${choice("radio", "mode", "whole", "Pizza inteira", "Um sabor", selectedMode)}
        ${choice("radio", "mode", "half", "Meio a meio", "Cobra o maior sabor", selectedMode)}
      </div>
    </fieldset>
    <label class="option-group" data-second-flavor-wrap>Segundo sabor
      <select name="secondFlavor">
        <option value="">Selecione o segundo sabor</option>
        ${PRODUCTS.filter((item) => item.type === "pizza" && item.id !== product.id && (item.category === "brotos") === (product.category === "brotos"))
          .map((item) => `<option value="${item.id}" ${item.id === secondFlavor ? "selected" : ""}>${escapeHtml(item.name)} - ${money(item.price)}</option>`)
          .join("")}
      </select>
    </label>
    <fieldset class="option-group">
      <legend>Borda recheada</legend>
      <div class="option-grid">
        ${CONFIG.crusts.map((crust) => choice("radio", "crust", crust.id, crust.name, crust.price ? `+ ${money(crust.price)}` : "Grátis", existingItem?.crustId || "none")).join("")}
      </div>
    </fieldset>
    ${extrasGroup(existingItem?.extras || [])}
    ${quantityGroup(existingItem?.quantity || 1)}
    <label class="option-group">Observações
      <textarea name="notes" rows="3" placeholder="Alguma observação?">${escapeHtml(existingItem?.notes || "")}</textarea>
    </label>`;
}

function choice(type, name, value, label, hint, selected) {
  const checked = selected === value || (Array.isArray(selected) && selected.includes(value)) ? "checked" : "";
  return `<label class="choice"><input type="${type}" name="${name}" value="${value}" ${checked} /><span>${escapeHtml(label)}<small>${escapeHtml(hint)}</small></span></label>`;
}

function extrasGroup(selected = []) {
  return `<fieldset class="option-group">
    <legend>Adicionais</legend>
    <div class="option-grid">
      ${CONFIG.extras.map((extra) => choice("checkbox", "extras", extra.id, extra.name, `+ ${money(extra.price)}`, selected)).join("")}
    </div>
  </fieldset>`;
}

function quantityGroup(quantity) {
  return `<label class="option-group">Quantidade
    <input type="number" name="quantity" min="1" max="99" required value="${quantity}" />
  </label>`;
}

function updateModalPrice() {
  const data = getProductFormData();
  const result = calculateItemPrice(data);
  els.modalPrice.textContent = money(result.unitPrice * result.quantity);
  const wrap = els.productForm.querySelector("[data-second-flavor-wrap]");
  if (wrap) {
    wrap.style.display = data.half ? "grid" : "none";
    wrap.querySelector("select").required = data.half;
  }
}

function getProductFormData() {
  const form = new FormData(els.productForm);
  return {
    product: state.currentProduct,
    sizeId: form.get("size") || "medium",
    half: form.get("mode") === "half",
    secondFlavorId: form.get("secondFlavor") || "",
    doughId: form.get("dough") || "traditional",
    crustId: form.get("crust") || "none",
    extras: form.getAll("extras"),
    removals: [],
    quantity: Math.max(1, Number(form.get("quantity") || 1)),
    notes: String(form.get("notes") || "").trim()
  };
}

function calculateItemPrice(data) {
  const product = data.product;
  let unitPrice = product.price;
  if (product.type === "pizza") {
    const second = PRODUCTS.find((item) => item.id === data.secondFlavorId && item.type === "pizza" && (item.category === "brotos") === (product.category === "brotos"));
    const base = data.half && second ? Math.max(product.price, second.price) : product.price;
    const size = CONFIG.sizes.find((item) => item.id === data.sizeId) || CONFIG.sizes[1];
    const dough = CONFIG.doughs.find((item) => item.id === data.doughId) || CONFIG.doughs[0];
    const crust = CONFIG.crusts.find((item) => item.id === data.crustId) || CONFIG.crusts[0];
    unitPrice = base * (product.category === "brotos" ? 1 : size.multiplier) + dough.price + crust.price;
  }
  const extraTotal = data.extras.reduce((sum, id) => sum + (CONFIG.extras.find((extra) => extra.id === id)?.price || 0), 0);
  unitPrice += extraTotal;
  return { unitPrice: roundMoney(unitPrice), quantity: data.quantity };
}

function handleProductSubmit(event) {
  event.preventDefault();
  const data = getProductFormData();
  if (data.product.type === "pizza" && data.half && !data.secondFlavorId) {
    toast("Escolha o segundo sabor da pizza meio a meio.");
    return;
  }
  const price = calculateItemPrice(data).unitPrice;
  const item = {
    cartId: state.editingId || createId(),
    productId: data.product.id,
    name: data.product.name,
    category: data.product.category,
    image: data.product.image,
    type: data.product.type,
    sizeId: data.product.type === "pizza" ? data.sizeId : null,
    half: data.half,
    secondFlavorId: data.secondFlavorId,
    secondFlavorName: PRODUCTS.find((p) => p.id === data.secondFlavorId)?.name || "",
    doughId: data.doughId,
    crustId: data.crustId,
    extras: data.extras,
    removals: data.removals,
    notes: data.notes,
    quantity: data.quantity,
    unitPrice: price
  };

  if (state.editingId) {
    state.cart = state.cart.map((entry) => (entry.cartId === state.editingId ? item : entry));
    toast("Item atualizado no carrinho.");
  } else {
    state.cart.push(item);
    toast("Item adicionado ao carrinho.");
  }
  persistCart();
  renderCart(true);
  els.productModal.close();
}

function renderCart(bump = false) {
  if (!state.cart.length) {
    els.cartItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio. Escolha um item do cardápio para começar.</div>`;
  } else {
    els.cartItems.innerHTML = state.cart.map(renderCartItem).join("");
  }

  const totals = calculateTotals();
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  els.cartCount.textContent = count > 99 ? "99+" : count;
  els.cartCount.hidden = count === 0;
  els.cartCount.closest("button").setAttribute("aria-label", count ? `Abrir carrinho com ${count} ${count === 1 ? "item" : "itens"}` : "Abrir carrinho vazio");
  els.cartMobileCount.textContent = count;
  els.cartMobileTotal.textContent = money(totals.total);
  els.subtotal.textContent = money(totals.subtotal);
  els.discount.textContent = money(totals.discount);
  els.total.textContent = money(totals.total);
  syncCheckoutTotals();
  if (bump) bumpCart();
}

function renderCartItem(item, index) {
  const details = itemDetails(item);
  const cartId = escapeHtml(item.cartId || "");
  return `<article class="cart-item">
    <div class="cart-item-top">
      <div>
        <h3>${escapeHtml(item.quantity)}x ${escapeHtml(displayName(item))}</h3>
        <p>${details.map(escapeHtml).join(" • ")}</p>
      </div>
      <strong>${money(item.unitPrice * item.quantity)}</strong>
    </div>
    <div class="cart-actions">
      <div class="qty-controls">
        <button type="button" data-cart-action="decrease" data-id="${cartId}" data-index="${index}">−</button>
        <strong>${item.quantity}</strong>
        <button type="button" data-cart-action="increase" data-id="${cartId}" data-index="${index}">+</button>
      </div>
      <button type="button" data-cart-action="edit" data-id="${cartId}" data-index="${index}">Editar</button>
      <button type="button" data-cart-action="remove" data-id="${cartId}" data-index="${index}">Remover</button>
    </div>
  </article>`;
}

function handleCartAction(event) {
  const button = event.target.closest("[data-cart-action]");
  if (!button || !els.cartItems.contains(button)) return;
  const { cartAction: action, id, index } = button.dataset;
  let itemIndex = state.cart.findIndex((entry) => String(entry.cartId || "") === String(id || ""));
  if (itemIndex < 0 && index !== undefined) itemIndex = Number(index);
  const item = state.cart[itemIndex];
  if (!item) return;
  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity = Math.max(1, item.quantity - 1);
  if (action === "remove") state.cart.splice(itemIndex, 1);
  if (action === "edit") {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) {
      toast("Não foi possível editar este item. Remova e adicione novamente.");
      return;
    }
    closeCart();
    openProduct(product, item);
    return;
  }
  persistCart();
  renderCart();
}

function displayName(item) {
  const base = item.name;
  return item.half ? `${base} / ${item.secondFlavorName}` : base;
}

function itemDetails(item) {
  const details = [];
  const crust = CONFIG.crusts.find((entry) => entry.id === item.crustId);
  const extras = item.extras.map((id) => CONFIG.extras.find((extra) => extra.id === id)?.name).filter(Boolean);
  if (crust && item.type === "pizza") details.push(`Borda: ${crust.name}`);
  if (extras.length) details.push(`Adicionais: ${extras.join(", ")}`);
  if (item.notes) details.push(`Obs.: ${item.notes}`);
  return details;
}

function calculateTotals() {
  const subtotal = roundMoney(state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const couponDiscount = getCouponDiscount(subtotal);
  return {
    subtotal,
    deliveryFee: 0,
    discount: couponDiscount,
    total: Math.max(0, roundMoney(subtotal - couponDiscount)),
    consultDelivery: false
  };
}

function getDeliveryData() {
  const fulfillment = els.fulfillment?.value || "delivery";
  const neighborhoodName = els.neighborhood?.value.trim() || "";
  return { fulfillment, fee: 0, consult: false, neighborhood: { name: neighborhoodName, fee: 0 } };
}

function applyCoupon() {
  const code = els.coupon.value.trim().toUpperCase();
  const coupon = CONFIG.coupons.find((entry) => entry.code === code);
  if (!coupon) {
    state.coupon = null;
    toast("Cupom não encontrado.");
  } else {
    state.coupon = coupon;
    toast(`Cupom ${coupon.code} aplicado.`);
  }
  renderCart();
}

function getCouponDiscount(subtotal) {
  const coupon = state.coupon;
  if (!coupon) return 0;
  const deliveryData = getDeliveryData();
  if (coupon.pickupOnly && deliveryData.fulfillment !== "pickup") return 0;
  if (coupon.minimum && subtotal < coupon.minimum) return 0;
  if (coupon.type === "percent") return roundMoney(subtotal * (coupon.value / 100));
  return Math.min(subtotal, coupon.value);
}

function openCart() {
  els.cartDrawer.classList.add("open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeCart() {
  els.cartDrawer.classList.remove("open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function openCheckout() {
  showCheckoutError("");
  if (!state.cart.length) {
    toast("Seu carrinho está vazio.");
    return;
  }
  const totals = calculateTotals();
  if (totals.subtotal < CONFIG.business.minimumOrder) {
    toast(`O pedido mínimo é ${money(CONFIG.business.minimumOrder)}.`);
    return;
  }
  closeCart();
  clearLegacyCheckoutValues();
  updateCheckoutVisibility();
  updatePaymentVisibility();
  syncCheckoutTotals();
  const openStatus = getOpenStatus();
  els.closedWarning.hidden = openStatus.isOpen;
  els.closedWarning.textContent = CONFIG.business.allowScheduledWhenClosed
    ? "A pizzaria está fechada agora. Você pode enviar o pedido como agendamento pelo WhatsApp."
    : "A pizzaria está fechada agora. Finalização temporariamente indisponível.";
  els.checkoutModal.showModal();
}

function updateCheckoutVisibility() {
  const pickup = els.fulfillment.value === "pickup";
  els.addressFields.classList.toggle("hidden", pickup);
  els.addressFields.querySelectorAll("input, select").forEach((field) => {
    const requiredNames = ["street", "number", "neighborhood"];
    field.required = !pickup && requiredNames.includes(field.name);
    field.disabled = pickup;
  });
}

function updatePaymentVisibility() {
  const isMoney = els.payment.value === "Dinheiro";
  const isPix = els.payment.value === "Pix";
  const changeInput = els.changeWrapper.querySelector("input");
  els.changeWrapper.classList.toggle("is-hidden", !isMoney);
  els.changeWrapper.toggleAttribute("hidden", !isMoney);
  els.changeWrapper.setAttribute("aria-hidden", String(!isMoney));
  changeInput.required = isMoney;
  changeInput.disabled = !isMoney;
  if (!isMoney) changeInput.value = "";
  els.pixNote.hidden = !isPix;
}

function clearLegacyCheckoutValues() {
  const reference = els.checkoutForm.elements.reference;
  if (reference?.value.trim().toLowerCase() === "cidade a confirmar") {
    reference.value = "";
  }
  const city = els.checkoutForm.elements.city;
  if (city) city.value = "";
}

function syncCheckoutTotals() {
  if (!els.checkoutSubtotal) return;
  const totals = calculateTotals();
  els.checkoutSubtotal.textContent = money(totals.subtotal);
  els.checkoutDiscount.textContent = money(totals.discount);
  els.checkoutTotal.textContent = money(totals.total);
}

function renderNeighborhoodOptions() {
  if (!els.neighborhood) return;
  els.neighborhood.placeholder = "Digite seu bairro";
}

let submittingOrder = false;
let orderAttempt = null;

function showCheckoutError(message) {
  const error = document.querySelector("[data-checkout-error]");
  error.textContent = message;
  error.hidden = !message;
  if (message) error.focus();
}

async function handleCheckout(event) {
  event.preventDefault();
  if (submittingOrder) return;
  showCheckoutError("");
  const totals = calculateTotals();
  const data = Object.fromEntries(new FormData(els.checkoutForm).entries());
  if (data.payment === "Dinheiro") {
    const change = parseMoneyInput(data.changeFor);
    if (Number.isNaN(change) || change < totals.total) {
      showCheckoutError(`Informe um valor de troco igual ou maior que ${money(totals.total)}.`);
      return;
    }
  }
  if (!CONFIG.business.allowScheduledWhenClosed && !getOpenStatus().isOpen) {
    showCheckoutError("Estamos fechados no momento.");
    return;
  }
  submittingOrder = true;
  const button = els.checkoutForm.querySelector('button[type="submit"]');
  const label = button.textContent;
  button.disabled = true;
  button.textContent = "Registrando pedido...";
  try {
    const payload = { customer: data, items: state.cart, coupon: state.coupon?.code || "", expectedTotal: Math.round(totals.total * 100) };
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
    const signature = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
    try { orderAttempt = JSON.parse(sessionStorage.getItem("realeza-order-attempt")) || orderAttempt; } catch {}
    if (orderAttempt?.signature !== signature) orderAttempt = { signature, key: crypto.randomUUID() };
    try { sessionStorage.setItem("realeza-order-attempt", JSON.stringify(orderAttempt)); } catch {}
    const response = await fetch("/api/backend?action=orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": orderAttempt.key },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000)
    });
    if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("O serviço de pedidos está indisponível. Seu carrinho foi mantido; tente novamente em instantes.");
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível registrar o pedido.");
    const verifiedTotals = Object.fromEntries(Object.entries(result.totals).map(([key, value]) => [key, value / 100]));
    const message = buildWhatsappMessage(result.reference, data, verifiedTotals);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    state.lastWhatsappUrl = url;
    document.body.dataset.lastWhatsappUrl = url;
    els.reopenWhatsapp.href = url;
    // The confirmation link also works when the browser blocks an asynchronous popup.
    if (new URLSearchParams(window.location.search).get("test") !== "1") window.open(url, "_blank", "noopener,noreferrer");
    els.checkoutModal.close();
    els.successModal.showModal();
  } catch (error) {
    showCheckoutError(error.name === "TimeoutError" ? "O envio demorou. Tente novamente; o pedido não será duplicado." : error.message === "Failed to fetch" ? "Sem conexão. Confira sua internet e tente novamente." : error.message);
  } finally {
    submittingOrder = false;
    button.disabled = false;
    button.textContent = label;
  }
}

function buildWhatsappMessage(orderId, data, totals) {
  const lines = [
    "*NOVO PEDIDO - PIZZARIA REALEZA*",
    "",
    "*CLIENTE*",
    `Nome: ${data.name}`,
    `Telefone: ${data.phone}`,
    "",
    "*ITENS DO PEDIDO*",
    ""
  ];
  state.cart.forEach((item) => {
    lines.push(`*${item.quantity}x ${displayName(item)}*`);
    itemDetails(item).forEach((detail) => lines.push(`- ${detail}`));
    lines.push(`- Valor: ${money(item.unitPrice * item.quantity)}`, "");
  });
  lines.push(
    "*RESUMO DO PEDIDO*",
    `Subtotal: ${money(totals.subtotal)}`,
    `Desconto: ${money(totals.discount)}`,
    `TOTAL: ${money(totals.total)}`,
    "",
    "*FORMA DE RECEBIMENTO*",
    data.fulfillment === "pickup" ? "Retirada" : "Entrega",
    ""
  );
  if (data.fulfillment === "delivery") {
    lines.push(
      "*ENDERECO*",
      `CEP: ${data.cep || "Não informado"}`,
      `Rua: ${data.street}, nº ${data.number}`,
      `Complemento: ${data.complement || "Não informado"}`,
      `Bairro: ${data.neighborhood}`,
      "Cidade: São Paulo",
      `Referência: ${data.reference || "Não informado"}`,
      ""
    );
  }
  lines.push(
    "*PAGAMENTO*",
    data.payment,
    data.payment === "Dinheiro" ? `Troco para: ${money(parseMoneyInput(data.changeFor))}` : "",
    data.payment === "Pix" ? "Dados Pix serão confirmados pelo estabelecimento." : "",
    "",
    "*OBSERVACOES GERAIS*",
    data.generalNotes || "Nenhuma",
    "",
    "*Aguardo a confirmação do pedido e do prazo de entrega.*"
  );
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function generateOrderId() {
  const now = new Date();
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `RZ-${date}-${random}`;
}

function getOpenStatus() {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const periods = CONFIG.business.hours[day] || [];
  for (const period of periods) {
    const open = timeToMinutes(period.open);
    const close = timeToMinutes(period.close);
    if (close >= open && minutes >= open && minutes <= close) return { isOpen: true };
    if (close < open && (minutes >= open || minutes <= close)) return { isOpen: true };
  }
  const next = findNextOpening(now);
  return { isOpen: false, next };
}

function updateOpenStatus() {
  const status = getOpenStatus();
  const el = document.querySelector("[data-open-status]");
  el.classList.toggle("open", status.isOpen);
  el.textContent = status.isOpen ? "Aberto agora" : `Fechado • Abrimos às ${status.next}`;
}

function findNextOpening(date) {
  for (let offset = 0; offset < 7; offset++) {
    const day = (date.getDay() + offset) % 7;
    const periods = CONFIG.business.hours[day] || [];
    if (periods[0]) return periods[0].open;
  }
  return "horário a confirmar";
}

function renderHoursList() {
  const list = document.querySelector("[data-hours-list]");
  if (!list) return;
  const labels = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const order = [2, 3, 4, 5, 6, 0, 1];
  const today = new Date().getDay();
  list.innerHTML = order
    .map((day) => {
      const periods = CONFIG.business.hours[day] || [];
      const text = periods.length ? periods.map((period) => `${period.open} - ${period.close}`).join(" / ") : "Fechada";
      return `<div class="hours-row ${day === today ? "current" : ""} ${periods.length ? "" : "closed"}">
        <span>${labels[day]}</span>
        <strong>${text}</strong>
      </div>`;
    })
    .join("");
}

function persistCart() {
  memoryCart = [...state.cart];
  try {
    window.localStorage?.setItem("realeza-cart", JSON.stringify(state.cart));
  } catch {
    // Alguns ambientes de prévia bloqueiam localStorage. O carrinho segue ativo na sessão.
  }
}

function loadCart() {
  try {
    return JSON.parse(window.localStorage?.getItem("realeza-cart") || "[]") || [];
  } catch {
    return memoryCart || [];
  }
}

function bumpCart() {
  document.querySelector(".cart-button").classList.add("bump");
  document.querySelector(".mobile-cart-bar").classList.add("bump");
  setTimeout(() => {
    document.querySelector(".cart-button").classList.remove("bump");
    document.querySelector(".mobile-cart-bar").classList.remove("bump");
  }, 360);
}

function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function categoryLabel(id) {
  return CONFIG.categories.find((cat) => cat.id === id)?.label || "Cardápio";
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseMoneyInput(value) {
  return Number(String(value || "").replace(/\./g, "").replace(",", "."));
}

function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
