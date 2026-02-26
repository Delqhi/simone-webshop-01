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
    description: "Adaptive compression sleeves with high repeat-buy potential.",
  },
  {
    id: "SIM-HOME-014",
    name: "LumaQuiet Sleep Lamp",
    category: "Home",
    priceEur: 49.0,
    trendScore: 88,
    grossMarginPct: 59,
    velocity: "medium",
    description: "Circadian bedside lamp optimized for low-return gifting.",
  },
  {
    id: "SIM-PET-077",
    name: "PawOrbit Smart Feeder",
    category: "Pet",
    priceEur: 129.0,
    trendScore: 90,
    grossMarginPct: 57,
    velocity: "high",
    description: "Remote feeder with anti-jam mechanics and premium AOV profile.",
  },
  {
    id: "SIM-TECH-021",
    name: "VoltFold Travel Dock",
    category: "Tech",
    priceEur: 89.0,
    trendScore: 86,
    grossMarginPct: 61,
    velocity: "medium",
    description: "Compact creator dock designed for cross-border travel workflows.",
  },
];

const kpis = [
  { label: "Latency p95", value: "< 120ms" },
  { label: "Checkout Uptime", value: "99.95%" },
  { label: "Automation Coverage", value: "24/7" },
  { label: "Gross Margin Target", value: "> 58%" },
];

const channels = ["TikTok", "Meta", "Google", "Pinterest", "Snap", "Affiliate"];

const playbook = [
  {
    title: "Trend Radar",
    detail: "Signals are scored every hour and only high-confidence candidates move to launch.",
  },
  {
    title: "Margin Guardrails",
    detail: "Ad spend is throttled if projected MER drops below policy thresholds.",
  },
  {
    title: "Ops Automation",
    detail: "Payment, supplier dispatch, and comms status are idempotent and queue-backed.",
  },
  {
    title: "Channel Control",
    detail: "Campaign changes are centralized via admin endpoints and near-real-time events.",
  },
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
      (product, index) => `
        <article class="product-card" style="--delay:${index * 70}ms">
          <div class="product-meta">
            <span>${product.category}</span>
            <span>${product.id}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="chip-row">
            <span class="chip">Trend ${product.trendScore}</span>
            <span class="chip">Margin ${product.grossMarginPct}%</span>
            <span class="chip">Velocity ${product.velocity}</span>
          </div>
          <div class="product-footer">
            <strong class="price">€${product.priceEur.toFixed(2)}</strong>
            <button type="button" class="cta">Add to Cart</button>
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

  const channelRow = channels
    .map((channel) => `<span class="channel-pill">${channel}</span>`)
    .join("");

  const playbookCards = playbook
    .map(
      (item) => `
        <article class="ops-card">
          <h4>${item.title}</h4>
          <p>${item.detail}</p>
        </article>
      `
    )
    .join("");

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Simone WorldBest Shop</title>
    <meta name="description" content="Cloudflare-first commerce runtime for Simone WorldBest Shop." />
    <style>
      :root {
        --bg: #f4f0e8;
        --ink: #10243d;
        --ink-soft: #4c6077;
        --paper: #ffffff;
        --line: #dde3ec;
        --brand: #d14f2c;
        --brand-dark: #9f371d;
        --hero-a: #0f243d;
        --hero-b: #1d4064;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; }
      body {
        font-family: "Outfit", "Space Grotesk", "Avenir Next", "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at 15% 0%, rgba(255, 255, 255, 0.92) 0%, transparent 40%),
          radial-gradient(circle at 100% 0%, rgba(255, 195, 173, 0.72) 0%, transparent 35%),
          var(--bg);
      }
      .shell {
        max-width: 1120px;
        margin: 0 auto;
        padding: 1rem 1rem 3rem;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.8rem;
      }
      .logo {
        font-weight: 800;
        letter-spacing: 0.01em;
      }
      .logo span {
        color: var(--brand);
      }
      .toplinks {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .toplinks a {
        color: var(--ink-soft);
        text-decoration: none;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.3rem 0.7rem;
        font-size: 0.86rem;
      }
      .hero {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 1rem;
        background: linear-gradient(132deg, var(--hero-a), var(--hero-b));
        color: #fff;
        border-radius: 24px;
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(14, 31, 53, 0.22);
      }
      .hero::after {
        content: "";
        position: absolute;
        width: 300px;
        height: 300px;
        top: -110px;
        right: -60px;
        background: radial-gradient(circle, rgba(209, 79, 44, 0.65), rgba(209, 79, 44, 0));
      }
      .badge {
        display: inline-flex;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.24);
        background: rgba(255, 255, 255, 0.1);
        padding: 0.35rem 0.65rem;
        font-size: 0.82rem;
        margin-bottom: 0.8rem;
      }
      .hero h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.25rem);
        line-height: 1.03;
      }
      .hero p {
        max-width: 58ch;
        color: #d6e5fb;
        margin: 0.7rem 0;
      }
      .hero-actions {
        margin-top: 0.85rem;
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .hero-actions a {
        text-decoration: none;
        border-radius: 10px;
        padding: 0.55rem 0.95rem;
        font-weight: 700;
      }
      .hero-actions .primary {
        background: var(--brand);
        color: white;
      }
      .hero-actions .secondary {
        border: 1px solid rgba(214, 229, 251, 0.42);
        color: #d6e5fb;
      }
      .hero-panel {
        border: 1px solid rgba(214, 229, 251, 0.26);
        border-radius: 16px;
        background: rgba(9, 20, 35, 0.28);
        padding: 0.9rem;
        backdrop-filter: blur(4px);
        align-self: end;
      }
      .hero-panel h3 {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
        color: #d9e8ff;
      }
      .hero-panel ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 0.45rem;
      }
      .hero-panel li {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed rgba(214, 229, 251, 0.18);
        padding-bottom: 0.35rem;
        font-size: 0.87rem;
        color: #d9e8ff;
      }
      .hero-panel li strong {
        color: #ffffff;
      }
      .channels {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin: 1rem 0 0.3rem;
      }
      .channel-pill {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.3rem 0.7rem;
        background: #fff;
        font-size: 0.83rem;
        color: var(--ink-soft);
      }
      .kpis {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0.6rem;
      }
      .kpi {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 0.65rem 0.75rem;
        display: grid;
        gap: 0.2rem;
      }
      .kpi span {
        color: var(--ink-soft);
        font-size: 0.77rem;
      }
      .kpi strong {
        font-size: 1.02rem;
      }
      .section-head {
        margin: 1.3rem 0 0.7rem;
      }
      .section-head h2 {
        margin: 0;
        font-size: 1.4rem;
      }
      .section-head p {
        margin: 0.2rem 0 0;
        color: var(--ink-soft);
      }
      .product-grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .product-card {
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--paper);
        padding: 0.95rem;
        display: grid;
        gap: 0.55rem;
        animation: cardIn 450ms ease both;
        animation-delay: var(--delay);
      }
      .product-meta {
        display: flex;
        justify-content: space-between;
        color: #6c7e93;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .product-card h3 {
        margin: 0;
      }
      .product-card p {
        margin: 0;
        min-height: 2.6rem;
        color: var(--ink-soft);
      }
      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .chip {
        border-radius: 999px;
        border: 1px solid #d6deea;
        padding: 0.2rem 0.58rem;
        font-size: 0.78rem;
        color: #5f6f83;
        background: #f7faff;
      }
      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .price {
        font-size: 1.24rem;
      }
      .cta {
        border: 0;
        border-radius: 10px;
        background: var(--brand);
        color: white;
        font-weight: 700;
        padding: 0.48rem 0.78rem;
        cursor: pointer;
      }
      .cta:hover {
        background: var(--brand-dark);
      }
      .ops-grid {
        margin-top: 0.5rem;
        display: grid;
        gap: 0.7rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .ops-card {
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 0.8rem;
      }
      .ops-card h4 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
      }
      .ops-card p {
        margin: 0;
        color: var(--ink-soft);
        font-size: 0.9rem;
      }
      footer {
        margin-top: 1.3rem;
        color: #576a80;
        font-size: 0.85rem;
      }
      code {
        background: #ecf2fb;
        border-radius: 6px;
        padding: 0.08rem 0.35rem;
      }
      @media (max-width: 880px) {
        .hero {
          grid-template-columns: 1fr;
        }
        .kpis {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 720px) {
        .product-grid,
        .ops-grid,
        .kpis {
          grid-template-columns: 1fr;
        }
      }
      @keyframes cardIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <header class="topbar">
        <div class="logo">SIMONE <span>COMMERCE OS</span></div>
        <nav class="toplinks">
          <a href="#products">Products</a>
          <a href="#operations">Operations</a>
          <a href="/api/products">API</a>
        </nav>
      </header>

      <section class="hero">
        <div>
          <span class="badge">Cloudflare Production · Build ${BUILD_DATE}</span>
          <h1>WorldBest-ready storefront with enterprise execution.</h1>
          <p>
            Free-first, edge-fast commerce runtime: trend products, policy-aware scaling,
            and measurable operational control in one surface.
          </p>
          <div class="hero-actions">
            <a class="primary" href="#products">Open Catalog</a>
            <a class="secondary" href="/health">Runtime Health</a>
          </div>
        </div>
        <aside class="hero-panel">
          <h3>Control Feed</h3>
          <ul>
            <li><span>Trend candidates</span><strong>+41 today</strong></li>
            <li><span>Campaign health</span><strong>green</strong></li>
            <li><span>Supplier dispatch p95</span><strong>4m 10s</strong></li>
            <li><span>Critical DLQ (24h)</span><strong>0</strong></li>
          </ul>
        </aside>
      </section>

      <div class="channels">${channelRow}</div>
      <section class="kpis">${kpiRows}</section>

      <section class="section-head" id="products">
        <h2>High-velocity Product Stack</h2>
        <p>Curated candidates for margin, velocity, and trend durability.</p>
      </section>
      <section class="product-grid">${productCards}</section>

      <section class="section-head" id="operations">
        <h2>Enterprise Execution Layer</h2>
        <p>No vanity claims: every launch is bounded by operational guardrails.</p>
      </section>
      <section class="ops-grid">${playbookCards}</section>

      <footer>
        API endpoints: <code>/health</code>, <code>/api/products</code>
      </footer>
    </main>
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
