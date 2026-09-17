const WHATSAPP_NUMBER = "5511990073671";

// Painel de configuração: altere aqui dados do estabelecimento, horários, taxas,
// cupons, adicionais, bordas e produtos. Itens marcados como demo
// devem ser confirmados antes da publicação comercial definitiva.
const CONFIG = {
  business: {
    name: "Pizzaria Realeza",
    phone: "(11) 99007-3671",
    whatsapp: "(11) 99007-3671",
    instagram: "@pizzariarealeza",
    address: "Endereço a confirmar",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pizzaria%20Realeza",
    deliveryTime: "45 a 70 min",
    minimumOrder: 25,
    allowScheduledWhenClosed: true,
    hoursNote: "Terça a quinta 18h-23h; sexta e sábado 18h-23h30; domingo 18h-23h",
    hours: {
      0: [{ open: "18:00", close: "23:00" }],
      1: [],
      2: [{ open: "18:00", close: "23:00" }],
      3: [{ open: "18:00", close: "23:00" }],
      4: [{ open: "18:00", close: "23:00" }],
      5: [{ open: "18:00", close: "23:30" }],
      6: [{ open: "18:00", close: "23:30" }]
    }
  },
  neighborhoods: [
    { name: "Centro", fee: 5 },
    { name: "Bairro A", fee: 7, demo: true },
    { name: "Bairro B", fee: 9, demo: true },
    { name: "Demais bairros - consultar", fee: 0, consult: true }
  ],
  coupons: [
    { code: "RETIRADA5", type: "percent", value: 5, pickupOnly: true, demo: true },
    { code: "REALEZA10", type: "fixed", value: 10, minimum: 80, demo: true }
  ],
  sizes: [
    { id: "small", name: "Pequena", multiplier: 0.78 },
    { id: "medium", name: "Média", multiplier: 1 },
    { id: "large", name: "Grande", multiplier: 1.22 },
    { id: "family", name: "Família", multiplier: 1.48 }
  ],
  doughs: [
    { id: "traditional", name: "Tradicional", price: 0 },
    { id: "thin", name: "Massa fina", price: 0 },
    { id: "crispy", name: "Bem assada", price: 0 }
  ],
  crusts: [
    { id: "none", name: "Sem borda recheada", price: 0 },
    { id: "catupiry", name: "Catupiry", price: 8 },
    { id: "mussarela", name: "Mussarela", price: 8 },
    { id: "cheddar", name: "Cheddar", price: 8 },
    { id: "chocolate", name: "Chocolate", price: 9 }
  ],
  extras: [
    { id: "queijo-extra", name: "Queijo extra", price: 6 },
    { id: "bacon-extra", name: "Bacon extra", price: 7 },
    { id: "catupiry-extra", name: "Catupiry extra", price: 6 },
    { id: "azeitona", name: "Azeitona", price: 3 },
    { id: "milho", name: "Milho", price: 3 },
    { id: "cebola", name: "Cebola", price: 2 },
    { id: "molho-adicional", name: "Molho adicional", price: 2 }
  ],
  categories: [
    { id: "savory", label: "Pizzas salgadas" },
    { id: "brotos", label: "Brotos" },
    { id: "sweet", label: "Pizzas doces" },
    { id: "fogazza", label: "Fogazzas" },
    { id: "drinks", label: "Bebidas" }
  ],
};

const IMAGES = {
  pizza: "https://images.unsplash.com/photo-1544982560-63ad67a35c23?auto=format&fit=crop&w=900&q=80",
  pizzaAlt: "https://images.unsplash.com/photo-1632641730239-fd127af7d679?auto=format&fit=crop&w=900&q=80",
  sweet: "assets/pizza-doce.jpg",
  drink: "https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=900&q=80",
  fogazza: "assets/fogazza.jpg"
};

const DRINK_PHOTOS = {
  "coca-2l": "assets/drinks/coca-2l.webp",
  "coca-zero-2l": "assets/drinks/coca-zero-2l.jpg",
  "guarana-antartica-2l": "assets/drinks/guarana-antartica-2l.webp",
  "fanta-laranja-2l": "assets/drinks/fanta-laranja-2l.jpg",
  "fanta-uva-2l": "assets/drinks/fanta-uva-2l.jpg",
  "guarana-antartica-1l": "assets/drinks/guarana-antartica-1l.jpg",
  "dolly-guarana": "assets/drinks/dolly-guarana.jpg",
  "dolly-limao": "assets/drinks/dolly-limao.webp",
  "coca-lata-350": "assets/drinks/coca-lata-350.jpg",
  "cerveja-lata": "assets/drinks/cerveja-brahma.png",
  "vinho-suave-realeza": "assets/drinks/vinho-suave-realeza.png",
  "suco-natural-1l-goiaba": "assets/drinks/suco-goiaba.png",
  "suco-natural-500-goiaba": "assets/drinks/suco-goiaba.png",
  "suco-natural-1l-maracuja": "assets/drinks/suco-maracuja.png",
  "suco-natural-500-maracuja": "assets/drinks/suco-maracuja.png"
};

const DRINK_STYLES = {
  "coca-2l": ["#b5121b", "#ffffff", "Coca-Cola"],
  "coca-zero-2l": ["#171717", "#ffffff", "Coca Zero"],
  "guarana-antartica-2l": ["#009b4e", "#ffffff", "Guarana Antarctica"],
  "fanta-laranja-2l": ["#f58220", "#ffffff", "Fanta Laranja"],
  "fanta-uva-2l": ["#6f3fa0", "#ffffff", "Fanta Uva"],
  "guarana-antartica-1l": ["#009b4e", "#ffffff", "Guarana Antarctica"],
  "dolly-guarana": ["#1aa34a", "#ffffff", "Dolly Guarana"],
  "dolly-limao": ["#7ac143", "#17330f", "Dolly Limao"],
  "coca-lata-350": ["#b5121b", "#ffffff", "Coca-Cola Lata"],
  "cerveja-lata": ["#f6c243", "#2e1b0f", "Cerveja Lata"],
  "suco-natural-1l-goiaba": ["#e76f51", "#ffffff", "Suco Goiaba 1L"],
  "suco-natural-1l-maracuja": ["#f7b801", "#3a2200", "Suco Maracuja 1L"],
  "suco-natural-500-goiaba": ["#e76f51", "#ffffff", "Suco Goiaba 500ml"],
  "suco-natural-500-maracuja": ["#f7b801", "#3a2200", "Suco Maracuja 500ml"],
  "vinho-suave-realeza": ["#6d1127", "#ffffff", "Vinho Suave"]
};

function productLabelImage(label, background, foreground) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
    <rect width="900" height="520" rx="32" fill="#fff8ec"/>
    <rect x="90" y="54" width="720" height="412" rx="36" fill="${background}"/>
    <circle cx="742" cy="128" r="44" fill="rgba(255,255,255,.2)"/>
    <path d="M160 378c118-58 232-58 342 0 78 40 152 42 238 4" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="24" stroke-linecap="round"/>
    <text x="450" y="254" text-anchor="middle" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800">${escapeHtml(label)}</text>
    <text x="450" y="316" text-anchor="middle" fill="${foreground}" opacity=".9" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">Pizzaria Realeza</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function drinkImage(id) {
  if (DRINK_PHOTOS[id]) return DRINK_PHOTOS[id];
  const [background, foreground, label] = DRINK_STYLES[id] || ["#4f2a1d", "#ffffff", "Bebida"];
  return productLabelImage(label, background, foreground);
}

const savoryPizzas = [
  ["moda-daniel", "À Moda Daniel", 40, "Frango, calabresa, ovo, cebola, pimenta, mussarela e bacon.", ["Mais pedido", "Bacon"], true],
  ["americana", "Americana", 38, "Mussarela, presunto, parmesão, azeitona e orégano.", ["Mais pedido"], true],
  ["atum", "Atum", 40, "Atum, cebola, azeitona e orégano.", [], true],
  ["bacon", "Bacon", 40, "Mussarela, bacon, azeitona e orégano.", ["Bacon"], true],
  ["baiana", "Baiana", 38, "Mussarela, calabresa moída, cebola e pimenta em flocos.", [], true],
  ["caipira", "Caipira", 38, "Mussarela, calabresa, frango, milho, azeitona e orégano.", ["Frango"], true],
  ["calabresa", "Calabresa", 38, "Calabresa, cebola, azeitona e orégano.", ["Mais pedido"], true],
  ["calamussa", "Calamussa", 38, "Mussarela, calabresa fatiada, azeitona e orégano.", [], true],
  ["lombo-catupiry", "Lombo com Catupiry", 39, "Lombo, catupiry, azeitona e orégano.", [], true],
  ["lombo-mussarela", "Lombo com Mussarela", 40, "Lombo, mussarela, azeitona e orégano.", [], true],
  ["dijoni", "Dijoni", 42, "Mussarela, champignon, palmito, bacon, ovo, ervilha, presunto, azeitona e orégano.", ["Bacon"], true],
  ["escarola", "Escarola", 39, "Mussarela, escarola, bacon, azeitona e orégano.", ["Bacon"], true],
  ["felipo", "Felipo", 38, "Frango, presunto, catupiry, azeitona e orégano.", ["Frango"], true],
  ["frango-catupiry", "Frango com Catupiry", 38, "Frango, catupiry, azeitona e orégano.", ["Frango", "Mais pedido"], true],
  ["jardineira", "Jardineira", 39, "Presunto, atum, cebola, mussarela, ovo, azeitona e orégano.", [], true],
  ["milho-verde", "Milho Verde", 38, "Catupiry, milho, bacon, azeitona e orégano.", ["Bacon"], true],
  ["moda-casa", "Moda da Casa", 40, "Mussarela, atum, palmito, ovo, azeitona e orégano.", [], true],
  ["mussarela", "Mussarela", 39, "Mussarela, azeitona e orégano.", ["Vegetariana"], true],
  ["napolitana", "Napolitana", 40, "Mussarela, tomate, parmesão e orégano.", ["Vegetariana"], true],
  ["batata-palha", "Batata Palha", 39, "Mussarela coberta com batata palha e azeitona.", ["Vegetariana"], true],
  ["pizzaiollo", "Pizzaiollo", 38, "Mussarela, calabresa moída, ovo, azeitona e orégano.", [], true],
  ["portuguesa", "Portuguesa", 38, "Mussarela, presunto, ervilha, cebola, ovo e azeitona.", [], true],
  ["quatro-queijos", "Quatro Queijos", 39, "Mussarela, catupiry, provolone, parmesão e azeitona.", ["Vegetariana"], true],
  ["toscana", "Toscana", 38, "Calabresa moída, catupiry, azeitona e orégano.", [], true],
  ["vegetariana", "Vegetariana", 40, "Mussarela, tomate, milho, ervilha, palmito, azeitona e orégano.", ["Vegetariana"], true],
  ["realeza", "Realeza", 39, "Presunto, catupiry, champignon, bacon, azeitona e orégano.", ["Mais pedido", "Bacon"], true],
  ["marguerita", "Marguerita", 40, "Mussarela, tomate, parmesão, manjericão, azeitona e orégano.", ["Vegetariana"], true],
  ["carne-seca", "Carne Seca", 42, "Mussarela, carne seca, azeitona e orégano.", ["Novo"], true],
  ["peito-peru", "Peito de Peru", 39, "Mussarela, peito de peru, tomate, azeitona e orégano.", [], true],
  ["frango-especial", "Frango Especial", 40, "Frango, mussarela, catupiry e bacon.", ["Frango", "Bacon"], true],
  ["presunto-especial", "Presunto Especial", 40, "Presunto, mussarela, catupiry e bacon.", ["Bacon"], true],
  ["bauru", "Bauru", 38, "Mussarela, presunto, tomate, azeitona e orégano.", [], true],
  ["alho", "Alho", 39, "Mussarela e alho frito.", ["Vegetariana"], true],
  ["adventista", "Adventista", 40, "Mussarela, champignon, escarola, palmito, ervilha, azeitona e orégano.", ["Vegetariana"], true],
  ["peperone", "Peperone", 41, "Mussarela, peperone, azeitona e orégano.", [], true],
  ["siciliana", "Siciliana", 40, "Mussarela, champignon, bacon, azeitona e orégano.", ["Bacon"], true],
  ["brocolis-bacon", "Brócolis com Bacon", 39, "Brócolis, mussarela e bacon.", ["Bacon"], true],
  ["brocolis-alho", "Brócolis com Alho", 39, "Brócolis, mussarela e alho.", ["Vegetariana"], true]
];

const sweetPizzas = [
  ["banana-mussa", "Banana Mussa", 38, "Mussarela, banana, leite condensado e canela."],
  ["brigadeiro", "Brigadeiro", 38, "Chocolate granulado."],
  ["prestigio", "Prestígio", 38, "Chocolate e coco ralado."],
  ["romeu-julieta", "Romeu e Julieta", 39, "Mussarela e goiabada."],
  ["mms", "M&M's", 38, "Chocolate e M&M's."],
  ["doce-leite-pacoca", "Doce de Leite com Paçoca", 38, "Doce de leite e paçoca."],
  ["banana-nevada", "Banana Nevada", 39, "Banana, chocolate branco e canela."]
];

const fogazzas = [
  ["fogazza-moda-daniel", "Fogazza À Moda Daniel", 14, "Frango, calabresa, ovo, cebola, pimenta, mussarela e bacon."],
  ["fogazza-adventista", "Fogazza Adventista", 14, "Mussarela, champignon, escarola, palmito, ervilha, azeitona e orégano."],
  ["fogazza-alho", "Fogazza Alho", 14, "Mussarela e alho frito."],
  ["fogazza-americana", "Fogazza Americana", 14, "Mussarela, presunto, parmesão, azeitona e orégano."],
  ["fogazza-atum", "Fogazza Atum", 14, "Atum, cebola, azeitona e orégano."],
  ["fogazza-bacon", "Fogazza Bacon", 14, "Mussarela, bacon, azeitona e orégano."],
  ["fogazza-baiana", "Fogazza Baiana", 14, "Mussarela, calabresa moída, cebola, pimenta em flocos."],
  ["fogazza-batata-palha", "Fogazza Batata Palha", 14, "Mussarela coberta com batata palha e azeitona."],
  ["fogazza-bauru", "Fogazza Bauru", 14, "Mussarela, presunto, tomate, azeitonas e orégano."],
  ["fogazza-brocolis-alho", "Fogazza Brócolis com Alho", 14, "Brócolis, mussarela e alho."],
  ["fogazza-brocolis-bacon", "Fogazza Brócolis com Bacon", 14, "Brócolis, mussarela e bacon."],
  ["fogazza-caipira", "Fogazza Caipira", 14, "Mussarela, calabresa, frango, milho, azeitona e orégano."],
  ["fogazza-calabresa", "Fogazza Calabresa", 14, "Calabresa, cebola, azeitonas e orégano."],
  ["fogazza-calamussa", "Fogazza Calamussa", 14, "Mussarela, calabresa fatiada, azeitona e orégano."],
  ["fogazza-carne-seca", "Fogazza Carne Seca", 15, "Mussarela, carne seca, azeitona e orégano."],
  ["fogazza-dijon", "Fogazza Dijon", 15, "Mussarela, champignon, palmito, bacon, ovo, ervilha, presunto, azeitona e orégano."],
  ["fogazza-escarola", "Fogazza Escarola", 14, "Mussarela, escarola, bacon, azeitona e orégano."],
  ["fogazza-felipo", "Fogazza Felipo", 14, "Frango, presunto, catupiry, azeitona e orégano."],
  ["fogazza-frango-catupiry", "Fogazza Frango c/ Catupiry", 14, "Frango, catupiry, azeitonas e orégano."],
  ["fogazza-frango-especial", "Fogazza Frango Especial", 14, "Frango, mussarela, catupiry e bacon."],
  ["fogazza-jardineira", "Fogazza Jardineira", 14, "Presunto, atum, cebola, mussarela, ovo, azeitonas e orégano."],
  ["fogazza-lombo-catupiry", "Fogazza Lombo com Catupiry", 14, "Lombo, catupiry, azeitona e orégano."],
  ["fogazza-lombo-mussarela", "Fogazza Lombo com Mussarela", 14, "Lombo, mussarela, azeitonas e orégano."],
  ["fogazza-marguerita", "Fogazza Marguerita", 14, "Mussarela, tomate, parmesão, manjericão, azeitona e orégano."],
  ["fogazza-milho-verde", "Fogazza Milho Verde", 14, "Catupiry, milho, bacon, azeitonas e orégano."],
  ["fogazza-moda-casa", "Fogazza Moda da Casa", 14, "Mussarela, atum, palmito, ovo, azeitonas e orégano."],
  ["fogazza-morango", "Fogazza Morango", 15, "Doce de morango."],
  ["fogazza-mussarela", "Fogazza Mussarela", 14, "Mussarela, azeitona e orégano."],
  ["fogazza-napolitana", "Fogazza Napolitana", 14, "Mussarela, tomate, parmesão e orégano."],
  ["fogazza-peito-peru", "Fogazza Peito de Peru", 14, "Mussarela, peito de peru, tomate, azeitona e orégano."],
  ["fogazza-peperone", "Fogazza Peperone", 14, "Mussarela, peperone, azeitona e orégano."],
  ["fogazza-pizzaiollo", "Fogazza Pizzaiollo", 14, "Mussarela, calabresa moída, ovo, azeitona e orégano."],
  ["fogazza-portuguesa", "Fogazza Portuguesa", 14, "Mussarela, presunto, ervilha, cebola, ovo e azeitona."],
  ["fogazza-presunto-especial", "Fogazza Presunto Especial", 14, "Presunto, mussarela, catupiry e bacon."],
  ["fogazza-quatro-queijos", "Fogazza Quatro Queijos", 14, "Mussarela, catupiry, provolone, parmesão e azeitonas."],
  ["fogazza-realeza", "Fogazza Realeza", 14, "Presunto, catupiry, champignon, bacon, azeitona e orégano."],
  ["fogazza-siciliana", "Fogazza Siciliana", 14, "Mussarela, champignon, bacon, azeitona e orégano."],
  ["fogazza-toscana", "Fogazza Toscana", 14, "Calabresa moída, catupiry, azeitonas e orégano."],
  ["fogazza-uva-verde", "Fogazza Uva Verde", 15, "Doce de uva verde."],
  ["fogazza-vegetariana", "Fogazza Vegetariana", 14, "Mussarela, tomate, milho, ervilha, palmito, azeitona e orégano."]
];

const drinks = [
  ["coca-2l", "Coca-Cola 2L", 15, "Refrigerante Coca-Cola garrafa 2 litros."],
  ["coca-zero-2l", "Coca Zero 2L", 16, "Refrigerante Coca-Cola Zero garrafa 2 litros."],
  ["guarana-antartica-2l", "Guaraná Antarctica 2L", 13, "Refrigerante Guaraná Antarctica garrafa 2 litros."],
  ["fanta-laranja-2l", "Fanta Laranja 2L", 13, "Refrigerante Fanta Laranja garrafa 2 litros."],
  ["fanta-uva-2l", "Fanta Uva 2L", 13, "Refrigerante Fanta Uva garrafa 2 litros."],
  ["guarana-antartica-1l", "Guaraná Antarctica 1L", 8, "Refrigerante Guaraná Antarctica garrafa 1 litro."],
  ["dolly-guarana", "Dolly Guaraná", 9, "Refrigerante Dolly Guaraná garrafa 2 litros."],
  ["dolly-limao", "Dolly Limão", 9, "Refrigerante Dolly Limão garrafa 2 litros."],
  ["coca-lata-350", "Coca-Cola lata 350ml", 6, "Refrigerante Coca-Cola lata 350 ml."],
  ["cerveja-lata", "Cerveja lata", 5, "Cerveja lata."],
  ["suco-natural-1l-goiaba", "Suco Natural 1L Goiaba", 15, "Suco natural de goiaba, 1 litro."],
  ["suco-natural-1l-maracuja", "Suco Natural 1L Maracujá", 15, "Suco natural de maracujá, 1 litro."],
  ["suco-natural-500-goiaba", "Suco Natural 500ml Goiaba", 8, "Suco natural de goiaba, 500 ml."],
  ["suco-natural-500-maracuja", "Suco Natural 500ml Maracujá", 8, "Suco natural de maracujá, 500 ml."],
  ["vinho-suave-realeza", "Vinho Suave Realeza", 22, "Vinho suave Realeza."]
];

const PRODUCTS = [
  ...savoryPizzas.map(([id, name, price, description, tags, popular], index) => ({
    id,
    name,
    price,
    description,
    category: "savory",
    type: "pizza",
    image: index % 4 === 0 ? IMAGES.pizzaAlt : IMAGES.pizza,
    tags,
    popular,
    available: true
  })),
  ...savoryPizzas.map(([id, name, , description, tags], index) => ({
    id: `broto-${id}`,
    name: `Broto ${name}`,
    price: 30,
    description,
    category: "brotos",
    type: "pizza",
    image: index % 4 === 0 ? IMAGES.pizzaAlt : IMAGES.pizza,
    tags,
    available: true
  })),
  ...sweetPizzas.map(([id, name, price, description], index) => ({
    id,
    name,
    price,
    description,
    category: "sweet",
    type: "pizza",
    image: IMAGES.sweet,
    tags: index === 0 ? ["Doce", "Mais pedido"] : ["Doce"],
    popular: index < 2,
    available: true
  })),
  ...fogazzas.map(([id, name, price, description]) => ({
    id,
    name,
    price,
    description: `${description} Sabores e valores de fogazza devem ser confirmados no código.`,
    category: "fogazza",
    type: "single",
    image: IMAGES.fogazza,
    tags: price > 14 ? ["Novo", "Revisar valor"] : ["Revisar"],
    available: true,
    needsReview: true
  })),
  ...drinks.map(([id, name, price, description]) => ({
    id,
    name,
    price,
    description,
    category: "drinks",
    type: "simple",
    image: drinkImage(id),
    tags: [],
    popular: id.includes("2l") || id.includes("lata"),
    available: true,
    needsReview: false
  }))
];

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
  els.checkoutForm.addEventListener("submit", handleCheckout);

  document.querySelector("[data-close-success]").addEventListener("click", () => els.successModal.close());
  document.querySelector("[data-new-order]").addEventListener("click", () => {
    state.cart = [];
    persistCart();
    renderCart();
    els.successModal.close();
    location.hash = "cardapio";
  });
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
  els.cartCount.textContent = count;
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

function handleCheckout(event) {
  event.preventDefault();
  const totals = calculateTotals();
  const data = Object.fromEntries(new FormData(els.checkoutForm).entries());
  if (data.payment === "Dinheiro") {
    const change = parseMoneyInput(data.changeFor);
    if (Number.isNaN(change) || change < totals.total) {
      toast(`Informe um valor de troco igual ou maior que ${money(totals.total)}.`);
      return;
    }
  }
  if (!CONFIG.business.allowScheduledWhenClosed && !getOpenStatus().isOpen) {
    toast("Estamos fechados no momento.");
    return;
  }
  const orderId = generateOrderId();
  const message = buildWhatsappMessage(orderId, data, totals);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  state.lastWhatsappUrl = url;
  document.body.dataset.lastWhatsappUrl = url;
  els.reopenWhatsapp.href = url;
  const testMode = new URLSearchParams(window.location.search).get("test") === "1";
  if (!testMode) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  els.checkoutModal.close();
  els.successModal.showModal();
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
