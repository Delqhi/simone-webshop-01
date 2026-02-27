const BUILD_DATE = "2026-02-27";

const products = [
  {
    id: "SIM-AIR-001",
    name: "AeroPulse Recovery Sleeves",
    category: "Fitness",
    priceEur: 79.9,
    compareAtEur: 109.0,
    trendScore: 93,
    grossMarginPct: 62,
    velocity: "high",
    rating: 4.9,
    reviewCount: 842,
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    description: "Compression sleeves for workout recovery with strong repeat potential.",
  },
  {
    id: "SIM-HOME-014",
    name: "LumaQuiet Sleep Lamp",
    category: "Home",
    priceEur: 49.0,
    compareAtEur: 69.0,
    trendScore: 88,
    grossMarginPct: 59,
    velocity: "medium",
    rating: 4.7,
    reviewCount: 516,
    imageUrl:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    description: "Warm night light with low-light mode and compact premium design.",
  },
  {
    id: "SIM-PET-077",
    name: "PawOrbit Smart Feeder",
    category: "Pet",
    priceEur: 129.0,
    compareAtEur: 169.0,
    trendScore: 90,
    grossMarginPct: 57,
    velocity: "high",
    rating: 4.8,
    reviewCount: 1204,
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
    description: "Remote feeder with anti-jam mechanics and premium order value.",
  },
  {
    id: "SIM-TECH-021",
    name: "VoltFold Travel Dock",
    category: "Tech",
    priceEur: 89.0,
    compareAtEur: 119.0,
    trendScore: 86,
    grossMarginPct: 61,
    velocity: "medium",
    rating: 4.6,
    reviewCount: 477,
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

function formatEur(value) {
  return `EUR ${value.toFixed(2)}`;
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return Array.from({ length: 5 })
    .map((_, idx) =>
      idx < rounded
        ? '<span class="star star-filled">★</span>'
        : '<span class="star">★</span>'
    )
    .join("");
}

function renderHomeHtml() {
  const productCards = products
    .map((product) => {
      const discount = Math.max(0, Math.round(((product.compareAtEur - product.priceEur) / product.compareAtEur) * 100));
      return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" />
          <span class="product-badge">-${discount}%</span>
        </div>
        <div class="product-body">
          <p class="product-category">${product.category}</p>
          <h3>${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-rating">
            <span class="stars">${renderStars(product.rating)}</span>
            <span>${product.rating.toFixed(1)} (${product.reviewCount})</span>
          </div>
          <div class="product-chips">
            <span>Trend ${product.trendScore}</span>
            <span>Margin ${product.grossMarginPct}%</span>
            <span>${product.velocity} velocity</span>
          </div>
          <div class="product-foot">
            <div>
              <span class="old-price">${formatEur(product.compareAtEur)}</span>
              <strong>${formatEur(product.priceEur)}</strong>
            </div>
            <button class="add-btn" data-id="${product.id}" data-price="${product.priceEur}" data-name="${product.name}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  const kpiRows = kpis
    .map(
      (kpi) => `
      <div class="kpi-card">
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
    <meta name="description" content="Single-product inspired storefront with premium product cards and live cart." />
    <style>
      :root {
        --cream: #fdfbf7;
        --cream-dark: #f5f2eb;
        --ink: #121212;
        --ink-light: #4b5563;
        --line: #e5ded2;
        --gold: #d4af37;
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        color: var(--ink);
        font-family: "Inter", "Avenir Next", "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.95) 0%, transparent 42%),
          radial-gradient(circle at 100% 12%, rgba(212, 175, 55, 0.12) 0%, transparent 42%),
          var(--cream);
      }
      h1, h2, h3 {
        margin: 0;
        font-family: "Space Grotesk", "Inter", sans-serif;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      .shell {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 1rem 4rem;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 25;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 4.2rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: rgba(255, 255, 255, 0.82);
        backdrop-filter: blur(12px);
      }
      .logo {
        font-size: 1.28rem;
        font-weight: 700;
      }
      .logo span { color: var(--ink-light); font-size: 0.75em; letter-spacing: 0.06em; }
      .top-actions {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
      }
      .top-actions a {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.45rem 0.78rem;
        text-decoration: none;
        color: var(--ink-light);
        font-size: 0.82rem;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.7);
      }
      .hero {
        margin-top: 0.85rem;
        border: 1px solid var(--line);
        border-radius: 34px;
        padding: 1.4rem;
        background: linear-gradient(135deg, #f8f5ef 0%, #ffffff 50%, #f3ede3 100%);
        box-shadow: 0 22px 52px rgba(16, 16, 16, 0.1);
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 1.2rem;
        align-items: center;
      }
      .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.42rem;
        border-radius: 999px;
        border: 1px solid rgba(16, 185, 129, 0.36);
        background: rgba(236, 253, 245, 0.9);
        color: #047857;
        font-size: 0.74rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 0.38rem 0.7rem;
      }
      .hero-badge::before {
        content: "";
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 999px;
        background: #10b981;
      }
      .hero h1 {
        margin-top: 0.8rem;
        font-size: clamp(2rem, 4.3vw, 3.85rem);
      }
      .hero p {
        margin: 0.85rem 0 0;
        color: var(--ink-light);
        line-height: 1.7;
        max-width: 60ch;
      }
      .hero-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
      }
      .hero-actions a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.84rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.75rem 1rem;
      }
      .hero-actions .primary {
        border: 1px solid #111;
        background: #111;
        color: #fff;
      }
      .hero-actions .secondary {
        border: 1px solid #d1d5db;
        background: rgba(255, 255, 255, 0.85);
        color: var(--ink);
      }
      .hero-trust {
        margin-top: 0.95rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.48rem;
      }
      .hero-trust span {
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.8);
        color: var(--ink-light);
        font-size: 0.74rem;
        padding: 0.33rem 0.62rem;
      }
      .hero-visual {
        position: relative;
        aspect-ratio: 1;
        border-radius: 28px;
        overflow: hidden;
        background: #ddd;
      }
      .hero-visual img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.01);
      }
      .visual-card {
        position: absolute;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.48);
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(10px);
        padding: 0.8rem;
        box-shadow: 0 12px 32px rgba(12, 12, 12, 0.14);
      }
      .visual-card p {
        margin: 0;
      }
      .visual-card .muted {
        font-size: 0.7rem;
        color: var(--ink-light);
        letter-spacing: 0.09em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .visual-card .strong {
        margin-top: 0.2rem;
        font-size: 0.95rem;
        font-weight: 700;
      }
      .kpis {
        margin-top: 0.95rem;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.5rem;
      }
      .kpi-card {
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.74);
        padding: 0.65rem 0.72rem;
      }
      .kpi-card span {
        display: block;
        color: var(--ink-light);
        font-size: 0.74rem;
      }
      .kpi-card strong {
        margin-top: 0.12rem;
        display: block;
        font-size: 1rem;
      }
      .section-head {
        margin: 1.45rem 0 0.75rem;
      }
      .section-head .eyebrow {
        margin: 0;
        color: var(--ink-light);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 700;
      }
      .section-head h2 {
        margin-top: 0.35rem;
        font-size: clamp(1.7rem, 3.2vw, 2.55rem);
      }
      .section-head p {
        margin: 0.45rem 0 0;
        color: var(--ink-light);
      }
      .product-grid {
        display: grid;
        gap: 0.9rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .product-card {
        border: 1px solid var(--line);
        border-radius: 24px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 12px 28px rgba(18, 18, 18, 0.08);
      }
      .product-image-wrap {
        position: relative;
        aspect-ratio: 1;
        background: var(--cream-dark);
        overflow: hidden;
      }
      .product-image-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      .product-card:hover .product-image-wrap img {
        transform: scale(1.06);
      }
      .product-badge {
        position: absolute;
        left: 0.7rem;
        top: 0.7rem;
        border-radius: 999px;
        background: #111;
        color: #fff;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0.3rem 0.6rem;
      }
      .product-body {
        padding: 0.9rem;
      }
      .product-category {
        margin: 0;
        color: var(--ink-light);
        text-transform: uppercase;
        letter-spacing: 0.09em;
        font-size: 0.7rem;
        font-weight: 700;
      }
      .product-card h3 {
        margin-top: 0.25rem;
        font-size: 1.23rem;
      }
      .product-desc {
        margin: 0.42rem 0 0;
        min-height: 2.45rem;
        color: var(--ink-light);
        font-size: 0.92rem;
        line-height: 1.5;
      }
      .product-rating {
        margin-top: 0.55rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--ink-light);
        font-size: 0.8rem;
      }
      .stars {
        display: inline-flex;
        gap: 0.05rem;
      }
      .star {
        color: #d1d5db;
        font-size: 0.78rem;
      }
      .star-filled {
        color: var(--gold);
      }
      .product-chips {
        margin-top: 0.58rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
      }
      .product-chips span {
        border: 1px solid var(--line);
        border-radius: 999px;
        background: #fff;
        color: var(--ink-light);
        font-size: 0.72rem;
        padding: 0.24rem 0.52rem;
      }
      .product-foot {
        margin-top: 0.72rem;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .product-foot .old-price {
        display: block;
        font-size: 0.77rem;
        text-decoration: line-through;
        color: #9ca3af;
      }
      .product-foot strong {
        display: block;
        font-size: 1.28rem;
      }
      .add-btn {
        border: 1px solid #111;
        border-radius: 999px;
        background: #111;
        color: #fff;
        font-weight: 700;
        font-size: 0.78rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 0.6rem 0.86rem;
        cursor: pointer;
      }
      .add-btn:hover { background: #2a2a2a; }
      .cart {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        width: min(340px, calc(100vw - 2rem));
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(18, 18, 18, 0.92);
        color: #fff;
        backdrop-filter: blur(12px);
        box-shadow: 0 20px 38px rgba(0, 0, 0, 0.3);
        padding: 0.82rem;
      }
      .cart-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .cart-head h3 {
        margin: 0;
        font-size: 0.98rem;
      }
      .cart-count {
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.34);
        padding: 0.2rem 0.52rem;
        font-size: 0.78rem;
      }
      .cart-items {
        margin-top: 0.52rem;
        max-height: 168px;
        overflow: auto;
        display: grid;
        gap: 0.34rem;
      }
      .cart-item {
        display: flex;
        justify-content: space-between;
        color: #e8e8e8;
        font-size: 0.82rem;
      }
      .cart-total {
        margin-top: 0.62rem;
        padding-top: 0.6rem;
        border-top: 1px dashed rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: space-between;
        font-weight: 700;
      }
      footer {
        margin-top: 1.2rem;
        color: var(--ink-light);
        font-size: 0.85rem;
      }
      code {
        border-radius: 5px;
        background: rgba(0, 0, 0, 0.07);
        padding: 0.1rem 0.34rem;
      }
      @media (max-width: 980px) {
        .hero-grid { grid-template-columns: 1fr; }
        .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 760px) {
        .product-grid,
        .kpis {
          grid-template-columns: 1fr;
        }
        .cart {
          position: static;
          margin-top: 1rem;
          width: 100%;
        }
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
            <span class="hero-badge">Production Build ${BUILD_DATE}</span>
            <h1>Single-product inspired commerce look. Fast, clear, premium.</h1>
            <p>
              Product-first layout, premium cards with real imagery, and direct cart interactions
              on a Cloudflare Worker runtime.
            </p>
            <div class="hero-actions">
              <a class="primary" href="#products">Browse Catalog</a>
              <a class="secondary" href="/api/products">View Product API</a>
            </div>
            <div class="hero-trust">
              <span>Free Express Shipping</span>
              <span>2-Year Warranty</span>
              <span>30-Day Returns</span>
            </div>
          </div>

          <div class="hero-visual">
            <img src="${products[0].imageUrl}" alt="Featured product visual" />
            <div class="visual-card">
              <p class="muted">Sound Engineering</p>
              <p class="strong">Studio-grade quality UI + cart flow</p>
            </div>
          </div>
        </div>
        <section class="kpis">${kpiRows}</section>
      </section>

      <section class="section-head" id="products">
        <p class="eyebrow">Featured Products</p>
        <h2>Product cards with images, pricing, ratings, and real add-to-cart.</h2>
        <p>Design language aligned to your single-product-shop reference.</p>
      </section>
      <section class="product-grid">${productCards}</section>

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
