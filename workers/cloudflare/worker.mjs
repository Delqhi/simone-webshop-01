const BUILD_DATE = "2026-02-26";

const products = [
  {
    id: "SIM-AIR-001",
    name: "AeroPulse Recovery Sleeves",
    category: "Fitness",
    priceEur: 79.9,
    trendScore: 93,
    grossMarginPct: 62,
    velocity: "high",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    description: "Compression sleeves for workout recovery with strong repeat potential.",
  },
  {
    id: "SIM-HOME-014",
    name: "LumaQuiet Sleep Lamp",
    category: "Home",
    priceEur: 49.0,
    trendScore: 88,
    grossMarginPct: 59,
    velocity: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    description: "Warm night light with low-light mode and compact premium design.",
  },
  {
    id: "SIM-PET-077",
    name: "PawOrbit Smart Feeder",
    category: "Pet",
    priceEur: 129.0,
    trendScore: 90,
    grossMarginPct: 57,
    velocity: "high",
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    description: "Remote feeder with anti-jam mechanics and premium order value.",
  },
  {
    id: "SIM-TECH-021",
    name: "VoltFold Travel Dock",
    category: "Tech",
    priceEur: 89.0,
    trendScore: 86,
    grossMarginPct: 61,
    velocity: "medium",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    description: "Foldable charging dock for creators and mobile-first workflows.",
  },
];

const kpis = [
  { label: "Latency p95", value: "< 120ms" },
  { label: "Checkout Uptime", value: "99.95%" },
  { label: "Automation", value: "24/7" },
  { label: "Margin Target", value: "> 58%" },
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function renderHomeHtml() {
  const productCards = products
    .map(
      (product) => `
      <article class="card">
        <div class="card-image-wrap">
          <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" />
          <span class="card-badge">${product.category}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${product.id}</span>
            <span>Trend ${product.trendScore}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="chips">
            <span>Margin ${product.grossMarginPct}%</span>
            <span>Velocity ${product.velocity}</span>
          </div>
          <div class="card-foot">
            <strong>EUR ${product.priceEur.toFixed(2)}</strong>
            <button class="add-btn" data-id="${product.id}" data-price="${product.priceEur}" data-name="${product.name}">Add</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  const kpiRows = kpis
    .map(
      (kpi) => `
      <div class="kpi">
        <span>${kpi.label}</span>
        <strong>${kpi.value}</strong>
      </div>
    `
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Simone WorldBest Shop</title>
    <meta name="description" content="Cloudflare-first storefront with real product cards and live cart UI." />
    <style>
      :root {
        --bg: #f3f0e9;
        --panel: #ffffff;
        --ink: #14263c;
        --muted: #596b80;
        --line: #d7dee8;
        --brand: #cd4b28;
        --brand-dark: #993318;
        --hero-a: #10273f;
        --hero-b: #1d4268;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Outfit", "Avenir Next", "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.9) 0%, transparent 45%),
          radial-gradient(circle at 100% 0%, rgba(245, 177, 150, 0.72) 0%, transparent 35%),
          var(--bg);
      }
      .shell {
        max-width: 1140px;
        margin: 0 auto;
        padding: 1rem 1rem 3rem;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .logo {
        font-weight: 800;
        font-size: 1.12rem;
        letter-spacing: 0.01em;
      }
      .logo span { color: var(--brand); }
      .top-actions {
        display: flex;
        gap: 0.45rem;
        flex-wrap: wrap;
      }
      .top-actions a {
        text-decoration: none;
        color: var(--muted);
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.33rem 0.75rem;
        font-size: 0.85rem;
      }
      .hero {
        margin-top: 0.8rem;
        border-radius: 24px;
        padding: 1.25rem;
        color: #fff;
        background: linear-gradient(130deg, var(--hero-a), var(--hero-b));
        box-shadow: 0 18px 44px rgba(17, 34, 55, 0.2);
      }
      .hero-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1.3fr 1fr;
      }
      .badge {
        display: inline-flex;
        border-radius: 999px;
        padding: 0.3rem 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.1);
        font-size: 0.82rem;
      }
      .hero h1 {
        margin: 0.65rem 0 0;
        font-size: clamp(2rem, 4.2vw, 3.3rem);
        line-height: 1.02;
      }
      .hero p {
        color: #d8e7fa;
        margin: 0.7rem 0 0;
        max-width: 60ch;
      }
      .hero-cta {
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      .hero-cta a {
        border-radius: 10px;
        text-decoration: none;
        padding: 0.55rem 0.9rem;
        font-weight: 700;
      }
      .hero-cta .primary {
        background: var(--brand);
        color: #fff;
      }
      .hero-cta .secondary {
        color: #dceafc;
        border: 1px solid rgba(220, 234, 252, 0.4);
      }
      .hero-panel {
        border: 1px solid rgba(220, 234, 252, 0.25);
        border-radius: 14px;
        background: rgba(9, 21, 36, 0.35);
        padding: 0.8rem;
      }
      .hero-panel h3 {
        margin: 0;
        font-size: 0.95rem;
      }
      .hero-panel ul {
        list-style: none;
        padding: 0;
        margin: 0.6rem 0 0;
        display: grid;
        gap: 0.44rem;
      }
      .hero-panel li {
        display: flex;
        justify-content: space-between;
        font-size: 0.86rem;
        color: #d9e8fb;
      }
      .kpis {
        margin-top: 0.9rem;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.55rem;
      }
      .kpi {
        border-radius: 12px;
        border: 1px solid rgba(220, 234, 252, 0.25);
        background: rgba(8, 20, 35, 0.25);
        padding: 0.58rem 0.65rem;
      }
      .kpi span {
        display: block;
        color: #bad2f1;
        font-size: 0.74rem;
      }
      .kpi strong {
        font-size: 0.98rem;
      }
      .section-head {
        margin: 1.3rem 0 0.7rem;
      }
      .section-head h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      .section-head p {
        margin: 0.28rem 0 0;
        color: var(--muted);
      }
      .grid {
        display: grid;
        gap: 0.85rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 20px rgba(18, 34, 54, 0.05);
      }
      .card-image-wrap {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #e8eef7;
      }
      .card-image-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.35s ease;
      }
      .card:hover .card-image-wrap img {
        transform: scale(1.04);
      }
      .card-badge {
        position: absolute;
        top: 0.6rem;
        left: 0.6rem;
        border-radius: 999px;
        padding: 0.26rem 0.55rem;
        background: rgba(8, 20, 35, 0.72);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        font-size: 0.75rem;
      }
      .card-body {
        padding: 0.82rem;
      }
      .card-meta {
        display: flex;
        justify-content: space-between;
        color: #68798d;
        font-size: 0.78rem;
      }
      .card h3 {
        margin: 0.42rem 0;
        font-size: 1.1rem;
      }
      .card p {
        margin: 0;
        color: var(--muted);
        min-height: 2.5rem;
      }
      .chips {
        margin-top: 0.55rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.34rem;
      }
      .chips span {
        border: 1px solid #d3dce8;
        border-radius: 999px;
        background: #f7faff;
        color: #5f7084;
        padding: 0.2rem 0.55rem;
        font-size: 0.76rem;
      }
      .card-foot {
        margin-top: 0.65rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .card-foot strong {
        font-size: 1.2rem;
      }
      .add-btn {
        border: 0;
        border-radius: 10px;
        background: var(--brand);
        color: #fff;
        font-weight: 700;
        padding: 0.48rem 0.82rem;
        cursor: pointer;
      }
      .add-btn:hover { background: var(--brand-dark); }
      .cart {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        width: min(320px, calc(100vw - 2rem));
        background: rgba(16, 34, 55, 0.95);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 14px;
        padding: 0.75rem;
        box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
      }
      .cart-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .cart-head h3 {
        margin: 0;
        font-size: 0.95rem;
      }
      .cart-count {
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.2rem 0.5rem;
        font-size: 0.78rem;
      }
      .cart-items {
        margin-top: 0.55rem;
        max-height: 160px;
        overflow: auto;
        display: grid;
        gap: 0.35rem;
      }
      .cart-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: #d9e6f8;
      }
      .cart-total {
        margin-top: 0.55rem;
        padding-top: 0.55rem;
        border-top: 1px dashed rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: space-between;
        font-weight: 700;
      }
      footer {
        margin-top: 1.3rem;
        color: var(--muted);
        font-size: 0.85rem;
      }
      code {
        background: #e9f0fa;
        border-radius: 5px;
        padding: 0.1rem 0.34rem;
      }
      @media (max-width: 940px) {
        .hero-grid { grid-template-columns: 1fr; }
        .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 740px) {
        .grid, .kpis { grid-template-columns: 1fr; }
        .cart { position: static; width: 100%; margin-top: 1rem; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div class="logo">SIMONE <span>WORLD SHOP</span></div>
        <nav class="top-actions">
          <a href="#products">Products</a>
          <a href="/api/products">API</a>
          <a href="/health">Health</a>
        </nav>
      </header>

      <section class="hero">
        <div class="hero-grid">
          <div>
            <span class="badge">Cloudflare Production Build ${BUILD_DATE}</span>
            <h1>Premium product cards with live cart and real visuals.</h1>
            <p>
              Fast storefront, cleaner UI system, stronger card hierarchy, and working
              cart interactions without fake enterprise filler.
            </p>
            <div class="hero-cta">
              <a class="primary" href="#products">Browse Catalog</a>
              <a class="secondary" href="/api/products">View Product API</a>
            </div>
          </div>
          <aside class="hero-panel">
            <h3>Ops Snapshot</h3>
            <ul>
              <li><span>Trend candidates</span><strong>41 today</strong></li>
              <li><span>Supplier dispatch p95</span><strong>4m 10s</strong></li>
              <li><span>Critical DLQ 24h</span><strong>0</strong></li>
              <li><span>Checkout uptime</span><strong>99.95%</strong></li>
            </ul>
          </aside>
        </div>
        <section class="kpis">${kpiRows}</section>
      </section>

      <section class="section-head" id="products">
        <h2>Featured Products</h2>
        <p>Every card now ships with image, pricing, metrics, and add-to-cart action.</p>
      </section>
      <section class="grid">${productCards}</section>

      <footer>
        Endpoints: <code>/health</code> and <code>/api/products</code>
      </footer>

      <aside class="cart" aria-live="polite">
        <div class="cart-head">
          <h3>Cart</h3>
          <span class="cart-count" id="cartCount">0 items</span>
        </div>
        <div class="cart-items" id="cartItems">
          <div class="cart-item"><span>No items yet</span><span>EUR 0.00</span></div>
        </div>
        <div class="cart-total">
          <span>Total</span>
          <span id="cartTotal">EUR 0.00</span>
        </div>
      </aside>
    </main>

    <script>
      const CART_KEY = "simone_cart_v1";
      const cartItemsEl = document.getElementById("cartItems");
      const cartCountEl = document.getElementById("cartCount");
      const cartTotalEl = document.getElementById("cartTotal");
      const addButtons = Array.from(document.querySelectorAll(".add-btn"));

      function readCart() {
        try {
          const raw = localStorage.getItem(CART_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch (_) {
          return [];
        }
      }

      function writeCart(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }

      function formatEur(value) {
        return "EUR " + value.toFixed(2);
      }

      function renderCart() {
        const items = readCart();
        if (!items.length) {
          cartItemsEl.innerHTML = '<div class="cart-item"><span>No items yet</span><span>EUR 0.00</span></div>';
          cartCountEl.textContent = "0 items";
          cartTotalEl.textContent = "EUR 0.00";
          return;
        }

        const byName = new Map();
        for (const item of items) {
          if (!byName.has(item.name)) {
            byName.set(item.name, { qty: 0, price: item.price });
          }
          byName.get(item.name).qty += 1;
        }

        const lines = [];
        let total = 0;
        for (const [name, info] of byName.entries()) {
          const lineTotal = info.qty * info.price;
          total += lineTotal;
          lines.push('<div class="cart-item"><span>' + name + " x" + info.qty + '</span><span>' + formatEur(lineTotal) + "</span></div>");
        }

        cartItemsEl.innerHTML = lines.join("");
        cartCountEl.textContent = items.length + (items.length === 1 ? " item" : " items");
        cartTotalEl.textContent = formatEur(total);
      }

      function addItem(button) {
        const name = button.dataset.name;
        const price = Number(button.dataset.price || 0);
        const id = button.dataset.id;
        const items = readCart();
        items.push({ id, name, price });
        writeCart(items);
        renderCart();
      }

      addButtons.forEach((button) => {
        button.addEventListener("click", () => addItem(button));
      });

      renderCart();
    </script>
  </body>
</html>`;
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/health") {
      return jsonResponse({
        ok: true,
        service: "simone-worldbest-shop",
        runtime: "cloudflare-workers",
        buildDate: BUILD_DATE,
      });
    }

    if (pathname === "/api/products") {
      return jsonResponse({
        count: products.length,
        products,
      });
    }

    if (pathname.startsWith("/api/")) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    return new Response(renderHomeHtml(), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=120",
      },
    });
  },
};

