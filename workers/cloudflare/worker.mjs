const BUILD_DATE = "2026-02-26";

const products = [
  {
    id: "SIM-AIR-001",
    name: "AeroPulse Recovery Sleeves",
    category: "Fitness",
    priceEur: 79.9,
    description: "Hot-trend Recovery Sleeves with adaptive compression for daily performance.",
  },
  {
    id: "SIM-HOME-014",
    name: "LumaQuiet Sleep Lamp",
    category: "Home",
    priceEur: 49.0,
    description: "Circadian-friendly bedside light with quiet haptic wake mode.",
  },
  {
    id: "SIM-PET-077",
    name: "PawOrbit Smart Feeder",
    category: "Pet",
    priceEur: 129.0,
    description: "Remote scheduler + anti-jam feeder for consistent pet routines.",
  },
  {
    id: "SIM-TECH-021",
    name: "VoltFold Travel Dock",
    category: "Tech",
    priceEur: 89.0,
    description: "Ultra-compact charging dock for mobile-first creator workflows.",
  },
];

const kpis = [
  { label: "Latency p95", value: "< 120ms" },
  { label: "Checkout Uptime", value: "99.95%" },
  { label: "Automation Coverage", value: "24/7" },
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
          <div class="meta">${product.category} · ${product.id}</div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price">€${product.priceEur.toFixed(2)}</div>
          <button type="button" class="cta">Add to Cart</button>
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
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Simone WorldBest Shop</title>
    <meta name="description" content="Cloudflare-first commerce runtime for Simone WorldBest Shop." />
    <style>
      :root {
        --bg: #f5f4ee;
        --ink: #13243b;
        --ink-soft: #3f526a;
        --accent: #de4a2f;
        --accent-dark: #ac351f;
        --panel: #ffffff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Space Grotesk", "Avenir Next", "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at 0% 0%, #ffffff 0%, transparent 45%),
          radial-gradient(circle at 100% 0%, #ffe0d4 0%, transparent 35%),
          var(--bg);
      }
      main {
        max-width: 1080px;
        margin: 0 auto;
        padding: 2rem 1rem 3rem;
      }
      .hero {
        background: linear-gradient(130deg, #112339, #203c5e);
        color: #fff;
        border-radius: 22px;
        padding: 2rem;
        box-shadow: 0 16px 40px rgba(12, 27, 42, 0.22);
        position: relative;
        overflow: hidden;
      }
      .hero::after {
        content: "";
        position: absolute;
        inset: -30% -25% auto auto;
        width: 260px;
        height: 260px;
        background: radial-gradient(circle, rgba(222, 74, 47, 0.45), rgba(222, 74, 47, 0));
        transform: rotate(-8deg);
        pointer-events: none;
      }
      .hero h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.06;
      }
      .hero p {
        color: #d8e7ff;
        max-width: 60ch;
      }
      .badge {
        display: inline-flex;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 0.86rem;
        margin-bottom: 0.85rem;
      }
      .kpis {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.65rem;
        margin-top: 1rem;
      }
      .hero-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .hero-actions a {
        text-decoration: none;
        padding: 0.55rem 0.9rem;
        border-radius: 11px;
        font-weight: 700;
        transition: transform 0.18s ease, background 0.18s ease;
      }
      .hero-actions .primary {
        background: #de4a2f;
        color: white;
      }
      .hero-actions .secondary {
        color: #d3e6ff;
        border: 1px solid rgba(211, 230, 255, 0.4);
      }
      .hero-actions a:hover {
        transform: translateY(-1px);
      }
      .kpi {
        background: rgba(255, 255, 255, 0.09);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 12px;
        padding: 0.7rem 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .kpi span { color: #b8d3ff; font-size: 0.8rem; }
      .kpi strong { font-size: 1.05rem; }
      .grid {
        margin-top: 1.2rem;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.85rem;
      }
      .card {
        border: 1px solid #e4e0d6;
        border-radius: 16px;
        padding: 1rem;
        background: var(--panel);
        animation: cardIn 420ms ease both;
      }
      .card:nth-child(2) { animation-delay: 60ms; }
      .card:nth-child(3) { animation-delay: 120ms; }
      .card:nth-child(4) { animation-delay: 180ms; }
      .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 22px rgba(20, 33, 52, 0.08);
      }
      .card h3 { margin: 0.25rem 0 0.4rem; font-size: 1.12rem; }
      .card p { margin: 0; color: var(--ink-soft); min-height: 3rem; }
      .meta { color: #7b8798; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; }
      .price { margin-top: 0.8rem; font-size: 1.35rem; font-weight: 700; }
      .cta {
        margin-top: 0.7rem;
        border: 0;
        border-radius: 10px;
        background: var(--accent);
        color: white;
        padding: 0.55rem 0.8rem;
        font-weight: 700;
        cursor: pointer;
      }
      .cta:hover { background: var(--accent-dark); }
      footer {
        margin-top: 1.2rem;
        color: #5f6a79;
        font-size: 0.87rem;
      }
      code {
        background: #eef3fa;
        padding: 0.1rem 0.35rem;
        border-radius: 6px;
      }
      @media (max-width: 780px) {
        .kpis,
        .grid {
          grid-template-columns: 1fr;
        }
      }
      @keyframes cardIn {
        from {
          opacity: 0;
          transform: translateY(7px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <span class="badge">Cloudflare Production · Build ${BUILD_DATE}</span>
        <h1>Simone WorldBest Shop</h1>
        <p>
          Free-first, edge-fast Commerce Runtime: trendbasierte Produkte, schnelle Auslieferung
          und klare KPI-Steuerung statt Marketing-Behauptungen.
        </p>
        <div class="hero-actions">
          <a class="primary" href="/api/products">Trend-Produkte live</a>
          <a class="secondary" href="/health">Runtime-Health</a>
        </div>
        <div class="kpis">${kpiRows}</div>
      </section>
      <section class="grid">${productCards}</section>
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
