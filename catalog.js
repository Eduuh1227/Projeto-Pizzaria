const WHATSAPP_NUMBER = "5511990073671";

// Painel de configuração: altere aqui dados do estabelecimento, horários, taxas,
// cupons, adicionais, bordas e produtos. Itens marcados como demo
// devem ser confirmados antes da publicação comercial definitiva.
const CONFIG = {
  business: {
    name: "Pizzaria Realeza",
    siteUrl: "https://projeto-pizzaria-mu.vercel.app/",
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
  const safeLabel = String(label).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
    <rect width="900" height="520" rx="32" fill="#fff8ec"/>
    <rect x="90" y="54" width="720" height="412" rx="36" fill="${background}"/>
    <circle cx="742" cy="128" r="44" fill="rgba(255,255,255,.2)"/>
    <path d="M160 378c118-58 232-58 342 0 78 40 152 42 238 4" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="24" stroke-linecap="round"/>
    <text x="450" y="254" text-anchor="middle" fill="${foreground}" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800">${safeLabel}</text>
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


if (typeof module !== "undefined") module.exports = { CONFIG, PRODUCTS };
