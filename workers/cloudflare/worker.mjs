const BUILD_DATE = "2026-02-27";

const PRODUCTS = [
  {
    id: "AURUM-X1-GRA",
    slug: "aurum-x1-graphite",
    name: "AURUM X1 - Graphite",
    category: "Audio",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.9,
    reviewCount: 812,
    stock: 18,
    badge: "Bestseller",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1400&q=85",
    ],
    description:
      "Designed for absolute accuracy, engineered with aerospace-grade materials, and tuned for reference-level detail.",
    longDescription:
      "AURUM X1 Graphite combines neutral studio tuning with premium comfort for long sessions. Hybrid ANC, 8-mic beamforming and high dynamic range make it ideal for creators and travelers.",
    features: [
      "Beryllium-coated 40mm drivers",
      "Hybrid ANC with 8 microphones",
      "48h battery and fast charge",
      "CNC aluminum frame",
    ],
    specs: [
      ["Driver", "40mm beryllium-coated"],
      ["ANC", "Hybrid, 8-mic array"],
      ["Battery", "48h playback"],
      ["Weight", "295g"],
    ],
  },
  {
    id: "AURUM-X1-SIL",
    slug: "aurum-x1-silver",
    name: "AURUM X1 - Silver",
    category: "Audio",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.8,
    reviewCount: 516,
    stock: 10,
    badge: "New",
    imageUrl:
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1600&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1481207727306-1a9f151fca7b?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1400&q=85",
    ],
    description:
      "Reference-grade tuning with premium finish and high comfort for long listening sessions.",
    longDescription:
      "Silver is tuned to the same reference curve as Graphite but with a bright metallic finish. Ideal for clean desktop setups and premium gifting.",
    features: [
      "Neutral studio reference tuning",
      "Premium silver anodized finish",
      "Low-latency wireless mode",
      "Multi-device pairing",
    ],
    specs: [
      ["Bluetooth", "5.4 + multipoint"],
      ["Codec", "AAC / SBC / LC3"],
      ["Charging", "USB-C fast charge"],
      ["Warranty", "5 years"],
    ],
  },
  {
    id: "AURUM-X1-MID",
    slug: "aurum-x1-midnight",
    name: "AURUM X1 - Midnight",
    category: "Audio",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.9,
    reviewCount: 1043,
    stock: 6,
    badge: "Low Stock",
    imageUrl:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=90",
    gallery: [
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=90",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1400&q=85",
    ],
    description:
      "Built to perform from studio sessions to city commutes with strong passive isolation.",
    longDescription:
      "Midnight focuses on a dark matte look with optimized earpad sealing and travel-ready durability. Perfect for daily commuter workflows.",
    features: [
      "Matte anti-scratch finish",
      "Enhanced passive isolation",
      "Travel hard case included",
      "Fast switching between devices",
    ],
    specs: [
      ["Frame", "CNC aluminum"],
      ["Pads", "Protein leather"],
      ["Latency", "Low-latency mode"],
      ["Trial", "45-day home trial"],
    ],
  },
  {
    id: "AURUM-DAC-01",
    slug: "aurum-portable-dac",
    name: "AURUM Portable DAC",
    category: "Accessories",
    priceEur: 189,
    compareAtEur: 229,
    rating: 4.7,
    reviewCount: 289,
    stock: 32,
    badge: "Pro",
    imageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=85",
    ],
    description: "Pocket DAC/AMP for wired reference playback and low-noise output.",
    longDescription:
      "The portable DAC complements AURUM X1 for creators requiring cleaner wired output and stable playback on the go.",
    features: ["Hi-res decoding", "Low-noise amp", "USB-C", "Metal enclosure"],
    specs: [
      ["Output", "2x balanced"],
      ["Resolution", "32-bit / 384kHz"],
      ["Power", "USB-powered"],
      ["Weight", "84g"],
    ],
  },
  {
    id: "AURUM-PADS-01",
    slug: "aurum-replacement-pads",
    name: "AURUM Replacement Ear Pads",
    category: "Accessories",
    priceEur: 39,
    compareAtEur: 49,
    rating: 4.6,
    reviewCount: 198,
    stock: 140,
    badge: "Essential",
    imageUrl:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1400&q=85",
    ],
    description: "Factory-spec comfort pads for long sessions and consistent seal.",
    longDescription:
      "Restore original comfort and tonal balance with official replacement pads made to exact AURUM tolerances.",
    features: ["Factory fit", "Soft memory foam", "Quick swap", "Long durability"],
    specs: [
      ["Material", "Protein leather"],
      ["Foam", "High density"],
      ["Fit", "AURUM X1 series"],
      ["Pack", "1 pair"],
    ],
  },
  {
    id: "AURUM-CASE-01",
    slug: "aurum-premium-case",
    name: "AURUM Premium Hard Case",
    category: "Accessories",
    priceEur: 49,
    compareAtEur: 69,
    rating: 4.8,
    reviewCount: 421,
    stock: 92,
    badge: "Travel",
    imageUrl:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1400&q=85",
    ],
    description: "Shock-protected travel case with cable and adapter compartments.",
    longDescription:
      "Premium hard shell case engineered for airport and everyday carry with anti-scratch lining.",
    features: ["Hard shell", "Accessory pockets", "Water-resistant", "Compact"],
    specs: [
      ["Outer", "EVA shell"],
      ["Inner", "Soft microfiber"],
      ["Weight", "220g"],
      ["Color", "Graphite"],
    ],
  },
  {
    id: "AURUM-CABLE-01",
    slug: "aurum-braided-usb-c-cable",
    name: "AURUM Braided USB-C Cable",
    category: "Accessories",
    priceEur: 29,
    compareAtEur: 39,
    rating: 4.5,
    reviewCount: 164,
    stock: 260,
    badge: "Fast Charge",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1400&q=85",
    ],
    description: "2m braided cable with reinforced connectors for stable charging.",
    longDescription:
      "Durable braided cable optimized for desk and travel charging with high bend resistance.",
    features: ["2 meter length", "Braided jacket", "Reinforced ends", "Fast-charge ready"],
    specs: [
      ["Length", "2m"],
      ["Type", "USB-C to USB-C"],
      ["Power", "Up to 60W"],
      ["Color", "Black"],
    ],
  },
  {
    id: "AURUM-STAND-01",
    slug: "aurum-headphone-stand",
    name: "AURUM Aluminum Headphone Stand",
    category: "Desk",
    priceEur: 79,
    compareAtEur: 99,
    rating: 4.7,
    reviewCount: 203,
    stock: 56,
    badge: "Desk Setup",
    imageUrl:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1400&q=85",
    ],
    description: "Minimal aluminum stand that matches AURUM design language.",
    longDescription:
      "Stabilize your desk setup with a premium weighted stand designed for daily use and clean cable routing.",
    features: ["Weighted base", "Scratch-safe top", "Cable channel", "Aluminum finish"],
    specs: [
      ["Material", "Anodized aluminum"],
      ["Base", "Anti-slip"],
      ["Height", "24cm"],
      ["Weight", "480g"],
    ],
  },
];

const PROMO_CARDS = [
  {
    title: "Launch Offer",
    subtitle: "Save up to 20%",
    text: "Bundle AURUM X1 with official accessories and unlock launch pricing.",
  },
  {
    title: "Express Delivery",
    subtitle: "24-48h DACH",
    text: "Fast shipping and transparent tracking from warehouse to doorstep.",
  },
  {
    title: "Risk-Free Trial",
    subtitle: "45 days",
    text: "Test at home and return free if it does not match your expectations.",
  },
];

const REVIEWS = [
  {
    title: "Studio accuracy",
    body: "Neutral, detailed tuning. Best noise control I have used.",
    author: "David K. - Berlin",
  },
  {
    title: "Built like an instrument",
    body: "Materials and fit feel truly premium. Everything is engineered.",
    author: "Mila S. - Vienna",
  },
  {
    title: "Only pair I travel with",
    body: "Battery lasts forever, comfort is excellent for long flights.",
    author: "Oliver R. - Zurich",
  },
];

const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((product) => [product.slug, product]));
const PRODUCT_BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));
const CATEGORIES = [...new Set(PRODUCTS.map((product) => product.category))];

function formatPrice(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function discountPercent(product) {
  if (!product.compareAtEur || product.compareAtEur <= product.priceEur) {
    return 0;
  }
  return Math.round(((product.compareAtEur - product.priceEur) / product.compareAtEur) * 100);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function isActive(pathname, href) {
  return pathname === href;
}

function renderHeader(pathname) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Technology", href: "/#technology" },
    { label: "Reviews", href: "/#reviews" },
  ];

  return `
<header id="siteHeader" class="site-header">
  <div class="shell nav-row">
    <a href="/" class="logo">AURUM <span>Premium Audio</span></a>

    <nav class="desktop-nav" aria-label="Primary">
      ${navItems
        .map((item) => {
          const active = isActive(pathname, item.href)
            ? "nav-link active"
            : "nav-link";
          return `<a href="${item.href}" class="${active}">${item.label}</a>`;
        })
        .join("")}
    </nav>

    <div class="nav-actions">
      <a href="/products" class="mini-pill">New Drops</a>
      <a href="/cart" class="cart-link" aria-label="Open cart">
        <span>Cart</span>
        <span class="cart-count" data-cart-count>0</span>
      </a>
    </div>
  </div>
</header>`;
}

function renderFooter() {
  return `
<footer class="site-footer">
  <div class="shell footer-grid">
    <section>
      <h3>AURUM</h3>
      <p>Precision audio engineered for reference standards and daily reliability.</p>
      <div class="trust-row">
        <span>Free Express Shipping</span>
        <span>45-Day Returns</span>
        <span>5-Year Warranty</span>
      </div>
    </section>

    <section>
      <h4>Shop</h4>
      <ul>
        <li><a href="/products">All Products</a></li>
        <li><a href="/cart">Cart</a></li>
        <li><a href="/checkout">Checkout</a></li>
      </ul>
    </section>

    <section>
      <h4>Support</h4>
      <ul>
        <li><a href="/products">FAQ</a></li>
        <li><a href="/products">Shipping</a></li>
        <li><a href="/products">Returns</a></li>
      </ul>
    </section>

    <section>
      <h4>Company</h4>
      <ul>
        <li><a href="/">About</a></li>
        <li><a href="/">Press</a></li>
        <li><a href="/">Careers</a></li>
      </ul>
    </section>
  </div>
  <div class="shell footer-meta">© 2026 AURUM Labs GmbH · Build ${BUILD_DATE}</div>
</footer>`;
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(`<span class="star ${i < rounded ? "filled" : ""}">★</span>`);
  }
  return stars.join("");
}

function renderProductCard(product, options = {}) {
  const {
    compact = false,
    showCategory = true,
    showDescription = true,
  } = options;

  const cardClass = compact ? "product-card compact" : "product-card";

  return `
<article class="${cardClass}" data-product-card data-name="${escapeHtml(
    (product.name + " " + product.description).toLowerCase(),
  )}" data-category="${escapeHtml(product.category)}">
  <a href="/products/${product.slug}" class="product-image-wrap">
    <img src="${product.imageUrl}" alt="${escapeHtml(product.name)}" loading="lazy" />
    <span class="product-badge">${escapeHtml(product.badge || "Featured")}</span>
  </a>

  <div class="product-body">
    ${showCategory ? `<p class="product-category">${escapeHtml(product.category)}</p>` : ""}
    <a class="product-title" href="/products/${product.slug}">${escapeHtml(product.name)}</a>

    ${
      showDescription
        ? `<p class="product-copy">${escapeHtml(product.description)}</p>`
        : ""
    }

    <div class="product-rating">
      <span class="stars">${renderStars(product.rating)}</span>
      <span>${product.rating.toFixed(1)} (${product.reviewCount})</span>
    </div>

    <div class="product-price-row">
      <div>
        <span class="old-price">${formatPrice(product.compareAtEur)}</span>
        <strong>${formatPrice(product.priceEur)}</strong>
      </div>
      <button type="button" class="btn-primary js-add-to-cart" data-product-id="${product.id}" aria-label="Add ${escapeHtml(
    product.name,
  )} to cart">Add to Cart</button>
    </div>
  </div>
</article>`;
}

function renderHero() {
  const hero = PRODUCTS[0];
  return `
<section class="hero-wrap">
  <div class="shell hero-grid">
    <div class="hero-copy animate-reveal">
      <p class="kicker-badge">New Release 2026</p>
      <h1>The reference<br/>for pure sound.</h1>
      <p>${escapeHtml(hero.description)}</p>

      <div class="hero-actions">
        <a class="btn-primary hero-btn" href="/products/${hero.slug}">Buy AURUM X1</a>
        <a class="btn-secondary hero-btn" href="/products">View Catalog</a>
      </div>

      <div class="hero-trust">
        <span>Free Express Shipping</span>
        <span>5-Year Warranty</span>
        <span>45-Day Returns</span>
      </div>

      <div class="hero-stats">
        <article><p>48h</p><span>Battery</span></article>
        <article><p>4.9</p><span>Rating</span></article>
        <article><p>8 Mic</p><span>Hybrid ANC</span></article>
      </div>
    </div>

    <div class="hero-visual animate-float">
      <img src="${hero.imageUrl}" alt="${escapeHtml(hero.name)}" />
      <div class="floating-note">
        <p>Studio-Grade Audio</p>
        <span>Reference tuned. Creator approved.</span>
      </div>
    </div>
  </div>
</section>`;
}

function renderPromoCards() {
  return `
<section class="shell section-gap">
  <div class="promo-grid">
    ${PROMO_CARDS.map(
      (card) => `
      <article class="promo-card">
        <p class="promo-subtitle">${escapeHtml(card.subtitle)}</p>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.text)}</p>
      </article>`,
    ).join("")}
  </div>
</section>`;
}

function renderTechnologySections() {
  return `
<section id="technology" class="shell section-gap">
  <div class="section-header">
    <p class="eyebrow">Technology</p>
    <h2>Engineered to reference standards</h2>
    <p>Every component is tuned for accuracy, durability and long-term reliability.</p>
  </div>
  <div class="feature-grid">
    <article><h3>Beryllium-coated drivers</h3><p>Ultra-light diaphragms deliver tighter transients and wider dynamic range.</p></article>
    <article><h3>Hybrid ANC</h3><p>8 microphones with real-time DSP for clean, stable silence in transit.</p></article>
    <article><h3>CNC aluminum frame</h3><p>Structural integrity and perfect balance for daily wear.</p></article>
    <article><h3>Fast-charge battery</h3><p>10 minutes charge delivers up to 5 hours playback.</p></article>
  </div>
</section>

<section id="reviews" class="reviews-block">
  <div class="shell">
    <div class="section-header centered">
      <p class="eyebrow">Reviews</p>
      <h2>Loved by 800+ customers</h2>
      <p>Verified buyer feedback from DACH creators and professionals.</p>
    </div>

    <div class="review-grid">
      ${REVIEWS.map(
        (item) => `
        <article>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <span>${escapeHtml(item.author)}</span>
        </article>`,
      ).join("")}
    </div>
  </div>
</section>`;
}

function renderHomePage(pathname) {
  const featured = PRODUCTS.slice(0, 4);

  const content = `
${renderHero()}
${renderPromoCards()}

<section class="shell section-gap" id="offers">
  <div class="section-header">
    <p class="eyebrow">Featured Products</p>
    <h2>Product cards with image, rating and direct checkout flow</h2>
    <p>Same visual language as the single-product design, expanded for full shop operation.</p>
  </div>

  <div class="product-grid">
    ${featured.map((product) => renderProductCard(product)).join("")}
  </div>

  <div class="section-cta-row">
    <a class="btn-primary" href="/products">Browse all products</a>
    <a class="btn-secondary" href="/cart">Go to cart</a>
  </div>
</section>

${renderTechnologySections()}
`;

  return renderDocument({
    pathname,
    title: "AURUM Shop - Premium Audio Storefront",
    description: "High-conversion premium storefront with full catalog, product detail, cart and checkout.",
    content,
  });
}

function renderProductsPage(pathname) {
  const content = `
<section class="shell page-hero">
  <p class="kicker-badge">Catalog</p>
  <h1>All Products</h1>
  <p>Use category chips and search to quickly find matching products.</p>

  <div class="catalog-controls" role="search">
    <input id="catalogSearch" class="catalog-search" type="search" placeholder="Search products..." aria-label="Search products" />
    <div class="category-chips" id="categoryChips">
      <button type="button" class="chip active" data-category-filter="all" aria-pressed="true">All</button>
      ${CATEGORIES.map(
        (category) =>
          `<button type="button" class="chip" data-category-filter="${escapeHtml(category)}" aria-pressed="false">${escapeHtml(
            category,
          )}</button>`,
      ).join("")}
    </div>
  </div>

  <p class="result-count" id="catalogCount">${PRODUCTS.length} products</p>
</section>

<section class="shell section-gap-tight">
  <div class="product-grid" id="catalogGrid">
    ${PRODUCTS.map((product) => renderProductCard(product)).join("")}
  </div>
</section>
`;

  return renderDocument({
    pathname,
    title: "Products - AURUM Shop",
    description: "Complete AURUM catalog with premium product cards and quick cart actions.",
    content,
  });
}

function renderProductDetailPage(pathname, product) {
  const related = PRODUCTS.filter((entry) => entry.id !== product.id).slice(0, 4);

  const content = `
<section class="shell product-page-top">
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span>/</span>
    <a href="/products">Products</a>
    <span>/</span>
    <span>${escapeHtml(product.name)}</span>
  </nav>

  <div class="product-detail-grid">
    <article>
      <div class="detail-main-image-wrap">
        <img id="detailMainImage" src="${product.gallery[0]}" alt="${escapeHtml(product.name)}" />
      </div>
      <div class="detail-thumb-grid" id="detailThumbGrid">
        ${product.gallery
          .map(
            (imageUrl, index) => `
          <button type="button" class="detail-thumb ${
            index === 0 ? "active" : ""
          }" data-gallery-image="${imageUrl}" aria-label="Open product image ${index + 1}">
            <img src="${imageUrl}" alt="${escapeHtml(product.name)} image ${index + 1}" />
          </button>`,
          )
          .join("")}
      </div>
    </article>

    <article class="detail-panel" data-detail-product-id="${product.id}">
      <p class="detail-category">${escapeHtml(product.category)}</p>
      <h1>${escapeHtml(product.name)}</h1>
      <p class="detail-copy">${escapeHtml(product.longDescription)}</p>

      <div class="detail-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span>${product.rating.toFixed(1)} (${product.reviewCount})</span>
      </div>

      <div class="detail-price">
        <div>
          <span class="old-price">${formatPrice(product.compareAtEur)}</span>
          <strong>${formatPrice(product.priceEur)}</strong>
        </div>
        <span class="stock-pill">${product.stock} in stock</span>
      </div>

      <ul class="detail-feature-list">
        ${product.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>

      <div class="detail-actions">
        <label for="detailQty" class="sr-only">Quantity</label>
        <input id="detailQty" class="qty-input" type="number" min="1" max="20" value="1" />
        <button type="button" id="detailAddButton" class="btn-primary" data-product-id="${product.id}">Add to cart</button>
      </div>

      <div class="trust-inline">
        <span>Free Express Shipping</span>
        <span>45-Day Returns</span>
        <span>5-Year Warranty</span>
      </div>
    </article>
  </div>
</section>

<section class="shell section-gap">
  <div class="section-header">
    <p class="eyebrow">Technical Specs</p>
    <h2>What you get</h2>
  </div>
  <div class="spec-table">
    ${product.specs
      .map(
        (spec) => `
      <div class="spec-row">
        <span>${escapeHtml(spec[0])}</span>
        <strong>${escapeHtml(spec[1])}</strong>
      </div>`,
      )
      .join("")}
  </div>
</section>

<section class="shell section-gap">
  <div class="section-header">
    <p class="eyebrow">Related Products</p>
    <h2>Complete your setup</h2>
  </div>
  <div class="product-grid">
    ${related.map((entry) => renderProductCard(entry, { compact: true })).join("")}
  </div>
</section>
`;

  return renderDocument({
    pathname,
    title: `${product.name} - AURUM Shop`,
    description: product.description,
    content,
  });
}

function renderCartPage(pathname) {
  const content = `
<section class="shell page-hero">
  <p class="kicker-badge">Cart</p>
  <h1>Your Cart</h1>
  <p>Review items, adjust quantities and continue to secure checkout.</p>
</section>

<section class="shell section-gap-tight" id="cartPage">
  <div class="cart-layout" id="cartLayout" hidden>
    <section>
      <div class="cart-items" id="cartItemsList"></div>
    </section>

    <aside class="cart-summary">
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><strong id="cartSubtotal">€0</strong></div>
      <div class="summary-row"><span>Shipping</span><strong id="cartShipping">€0</strong></div>
      <div class="summary-row total"><span>Total</span><strong id="cartGrandTotal">€0</strong></div>
      <a href="/checkout" class="btn-primary full">Proceed to checkout</a>
      <p class="summary-note">Secure checkout with transparent pricing and no hidden fees.</p>
    </aside>
  </div>

  <div class="cart-empty" id="cartEmpty" hidden>
    <h2>Your cart is empty</h2>
    <p>Add products and continue to checkout in a few clicks.</p>
    <a href="/products" class="btn-primary">Browse products</a>
  </div>
</section>
`;

  return renderDocument({
    pathname,
    title: "Cart - AURUM Shop",
    description: "Review cart items and proceed to checkout.",
    content,
  });
}

function renderCheckoutPage(pathname) {
  const content = `
<section class="shell page-hero">
  <p class="kicker-badge">Checkout</p>
  <h1>Secure Checkout</h1>
  <p>Enter shipping details and place your order.</p>
</section>

<section class="shell section-gap-tight">
  <div id="checkoutPage" class="checkout-layout" hidden>
    <form id="checkoutForm" class="checkout-form" novalidate>
      <h2>Shipping Details</h2>
      <div class="form-grid two">
        <label>First name<input required name="firstName" autocomplete="given-name" /></label>
        <label>Last name<input required name="lastName" autocomplete="family-name" /></label>
      </div>
      <label>Email<input required type="email" name="email" autocomplete="email" /></label>
      <label>Street<input required name="street" autocomplete="address-line1" /></label>
      <div class="form-grid two">
        <label>ZIP<input required name="zip" autocomplete="postal-code" /></label>
        <label>City<input required name="city" autocomplete="address-level2" /></label>
      </div>

      <label>Payment method
        <select name="paymentMethod" required>
          <option value="card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="klarna">Klarna</option>
        </select>
      </label>

      <button type="submit" class="btn-primary full">Place order</button>
      <p class="form-note">By placing the order you accept terms and return policy.</p>
    </form>

    <aside class="cart-summary">
      <h2>Checkout Summary</h2>
      <div id="checkoutItems" class="checkout-item-list"></div>
      <div class="summary-row"><span>Subtotal</span><strong id="checkoutSubtotal">€0</strong></div>
      <div class="summary-row"><span>Shipping</span><strong id="checkoutShipping">€0</strong></div>
      <div class="summary-row total"><span>Total</span><strong id="checkoutTotal">€0</strong></div>
    </aside>
  </div>

  <div id="checkoutEmpty" class="cart-empty" hidden>
    <h2>No items for checkout</h2>
    <p>Add products first before starting the checkout process.</p>
    <a href="/products" class="btn-primary">Go to products</a>
  </div>
</section>
`;

  return renderDocument({
    pathname,
    title: "Checkout - AURUM Shop",
    description: "Secure checkout for AURUM products.",
    content,
  });
}

function renderOrderSuccessPage(pathname) {
  const content = `
<section class="shell page-hero">
  <p class="kicker-badge">Order Confirmed</p>
  <h1>Thank you for your purchase</h1>
  <p>Your order is confirmed and currently being processed.</p>
</section>

<section class="shell section-gap-tight">
  <article class="success-card" id="successCard">
    <h2>Order details</h2>
    <p id="successOrderId">Order ID: -</p>
    <p id="successOrderMeta">Items: 0 · Total: €0</p>
    <div class="success-actions">
      <a href="/products" class="btn-secondary">Continue shopping</a>
      <a href="/" class="btn-primary">Back to home</a>
    </div>
  </article>
</section>
`;

  return renderDocument({
    pathname,
    title: "Order Success - AURUM Shop",
    description: "Order confirmation and summary.",
    content,
  });
}

function renderNotFoundPage(pathname) {
  const content = `
<section class="shell page-hero">
  <p class="kicker-badge">404</p>
  <h1>Page not found</h1>
  <p>The requested page does not exist. Continue with catalog or home.</p>
  <div class="section-cta-row">
    <a href="/" class="btn-primary">Home</a>
    <a href="/products" class="btn-secondary">Products</a>
  </div>
</section>`;

  return renderDocument({
    pathname,
    title: "404 - AURUM Shop",
    description: "Page not found",
    content,
    status: 404,
  });
}

function renderGlobalStyles() {
  return `
:root {
  --cream: #fdfbf7;
  --cream-dark: #f5f2eb;
  --ink: #121212;
  --ink-muted: #5d6470;
  --line: #e5ded2;
  --line-strong: #d7ccba;
  --shadow-soft: 0 12px 30px rgba(18, 18, 18, 0.08);
  --shadow-heavy: 0 22px 55px rgba(18, 18, 18, 0.14);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.94) 0%, transparent 40%),
    radial-gradient(circle at 100% 10%, rgba(212, 175, 55, 0.12) 0%, transparent 42%),
    var(--cream);
  color: var(--ink);
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
}

h1, h2, h3, h4 {
  margin: 0;
  font-family: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-reveal {
  animation: reveal-up 640ms ease-out both;
}

.animate-float {
  animation: hero-float 6s ease-in-out infinite;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

.shell {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 60;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.82);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: box-shadow 220ms ease;
}

.site-header.scrolled {
  box-shadow: 0 8px 28px rgba(18, 18, 18, 0.08);
}

.nav-row {
  min-height: 5.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-weight: 700;
  font-size: 1.3rem;
}

.logo span {
  display: block;
  font-size: 0.64rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.desktop-nav {
  margin-left: 1rem;
  display: none;
  align-items: center;
  gap: 0.35rem;
}

.nav-link {
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  color: var(--ink-muted);
  font-size: 0.87rem;
  font-weight: 600;
  transition: all 180ms ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
}

.nav-link.active {
  background: #111;
  color: #fff;
}

.nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.mini-pill {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.9);
}

.cart-link {
  border: 1px solid #111;
  border-radius: 999px;
  min-height: 2.6rem;
  padding: 0.45rem 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #111;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
}

.cart-count {
  min-width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: #fff;
  color: #111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0 0.25rem;
}

.hero-wrap {
  padding: 1.15rem 0 0;
}

.hero-grid {
  border: 1px solid var(--line);
  border-radius: 2rem;
  background: linear-gradient(130deg, #f8f5ef 0%, #ffffff 48%, #f4eee5 100%);
  box-shadow: var(--shadow-heavy);
  padding: 1.5rem;
  display: grid;
  gap: 1.2rem;
}

.kicker-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 999px;
  background: rgba(236, 253, 245, 0.88);
  color: #047857;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.38rem 0.7rem;
}

.hero-copy h1 {
  margin-top: 0.8rem;
  font-size: clamp(2rem, 4.5vw, 4rem);
}

.hero-copy p {
  margin: 0.82rem 0 0;
  color: var(--ink-muted);
  max-width: 60ch;
}

.hero-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.hero-btn {
  min-height: 3rem;
  padding: 0.75rem 1.05rem;
}

.hero-trust {
  margin-top: 0.9rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.hero-trust span {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.32rem 0.62rem;
  font-size: 0.75rem;
  color: var(--ink-muted);
}

.hero-stats {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
}

.hero-stats article {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.58rem 0.68rem;
}

.hero-stats p {
  margin: 0;
  color: var(--ink);
  font-size: 1.03rem;
  font-weight: 700;
}

.hero-stats span {
  color: var(--ink-muted);
  font-size: 0.72rem;
}

.hero-visual {
  position: relative;
  border-radius: 1.6rem;
  overflow: hidden;
  min-height: 310px;
  box-shadow: var(--shadow-soft);
}

.hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.floating-note {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 0.95rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.68);
  padding: 0.75rem;
}

.floating-note p {
  margin: 0;
  font-size: 0.83rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.floating-note span {
  margin-top: 0.2rem;
  display: block;
  font-size: 0.92rem;
  font-weight: 600;
}

.section-gap { margin-top: 3rem; }
.section-gap-tight { margin-top: 1.6rem; }

.section-header .eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: var(--ink-muted);
}

.section-header h2 {
  margin-top: 0.38rem;
  font-size: clamp(1.65rem, 3.4vw, 2.6rem);
}

.section-header p {
  margin: 0.48rem 0 0;
  color: var(--ink-muted);
}

.section-header.centered {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.promo-grid {
  display: grid;
  gap: 0.7rem;
}

.promo-card {
  border: 1px solid var(--line);
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-soft);
  padding: 1rem;
}

.promo-subtitle {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0f766e;
}

.promo-card h3 {
  margin-top: 0.3rem;
  font-size: 1.3rem;
}

.promo-card p:not(.promo-subtitle) {
  margin: 0.38rem 0 0;
  color: var(--ink-muted);
}

.product-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.8rem;
}

.product-card {
  border: 1px solid var(--line);
  border-radius: 1.45rem;
  background: rgba(255, 255, 255, 0.92);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
}

.product-card.compact .product-copy {
  display: none;
}

.product-image-wrap {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--cream-dark);
}

.product-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease;
}

.product-image-wrap:hover img {
  transform: scale(1.04);
}

.product-badge {
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.3rem 0.58rem;
}

.product-body {
  padding: 0.85rem;
}

.product-category {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.7rem;
  color: var(--ink-muted);
  font-weight: 700;
}

.product-title {
  margin-top: 0.2rem;
  display: block;
  font-size: 1.14rem;
  font-weight: 700;
  line-height: 1.3;
}

.product-copy {
  margin: 0.45rem 0 0;
  color: var(--ink-muted);
  font-size: 0.9rem;
}

.product-rating {
  margin-top: 0.46rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--ink-muted);
  font-size: 0.8rem;
}

.stars { display: inline-flex; gap: 0.05rem; }
.star { color: #d1d5db; font-size: 0.76rem; }
.star.filled { color: #d4af37; }

.product-price-row {
  margin-top: 0.62rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.45rem;
}

.old-price {
  display: block;
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 0.74rem;
}

.product-price-row strong {
  font-size: 1.28rem;
}

.btn-primary,
.btn-secondary {
  border-radius: 999px;
  min-height: 2.75rem;
  padding: 0.55rem 0.95rem;
  border: 1px solid transparent;
  font-size: 0.83rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.btn-primary {
  border-color: #111;
  background: #111;
  color: #fff;
}

.btn-primary:hover {
  background: #2a2a2a;
}

.btn-secondary {
  border-color: var(--line-strong);
  background: rgba(255, 255, 255, 0.95);
  color: var(--ink);
}

.btn-secondary:hover {
  border-color: #9ca3af;
}

.btn-primary.full,
.btn-secondary.full { width: 100%; }

.feature-grid {
  margin-top: 1rem;
  display: grid;
  gap: 0.65rem;
}

.feature-grid article {
  border: 1px solid var(--line);
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
}

.feature-grid h3 {
  font-size: 1.1rem;
}

.feature-grid p {
  margin: 0.34rem 0 0;
  color: var(--ink-muted);
}

.reviews-block {
  margin-top: 3rem;
  padding: 3rem 0;
  background: #f4f0e8;
}

.review-grid {
  margin-top: 1.2rem;
  display: grid;
  gap: 0.65rem;
}

.review-grid article {
  border: 1px solid var(--line);
  border-radius: 1.15rem;
  background: rgba(255, 255, 255, 0.92);
  padding: 1rem;
}

.review-grid h3 {
  font-size: 1.05rem;
}

.review-grid p {
  margin: 0.4rem 0 0;
  color: var(--ink-muted);
}

.review-grid span {
  margin-top: 0.6rem;
  display: block;
  font-size: 0.84rem;
  color: var(--ink);
  font-weight: 700;
}

.section-cta-row {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.page-hero {
  margin-top: 1.2rem;
  border: 1px solid var(--line);
  border-radius: 1.6rem;
  background: linear-gradient(130deg, #f8f5ef 0%, #ffffff 48%, #f4eee5 100%);
  padding: 1.2rem;
}

.page-hero h1 {
  margin-top: 0.55rem;
  font-size: clamp(1.8rem, 4vw, 3rem);
}

.page-hero p {
  margin: 0.55rem 0 0;
  color: var(--ink-muted);
}

.catalog-controls {
  margin-top: 0.9rem;
  display: grid;
  gap: 0.55rem;
}

.catalog-search {
  width: 100%;
  min-height: 2.8rem;
  border: 1px solid var(--line-strong);
  border-radius: 0.95rem;
  background: #fff;
  padding: 0.55rem 0.75rem;
  font-size: 0.92rem;
}

.catalog-search:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  border: 1px solid var(--line);
  border-radius: 999px;
  min-height: 2.4rem;
  background: #fff;
  color: var(--ink);
  padding: 0.4rem 0.74rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.chip.active {
  background: #111;
  color: #fff;
  border-color: #111;
}

.result-count {
  margin-top: 0.7rem;
  font-size: 0.84rem;
  color: var(--ink-muted);
  font-weight: 700;
}

.product-page-top {
  margin-top: 1.05rem;
}

.breadcrumbs {
  color: var(--ink-muted);
  font-size: 0.84rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.product-detail-grid {
  margin-top: 0.85rem;
  display: grid;
  gap: 1rem;
}

.detail-main-image-wrap {
  border: 1px solid var(--line);
  border-radius: 1.45rem;
  background: #fff;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  aspect-ratio: 1;
}

.detail-main-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-thumb-grid {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.35rem;
}

.detail-thumb {
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  overflow: hidden;
  aspect-ratio: 1;
  padding: 0;
  background: #fff;
  cursor: pointer;
}

.detail-thumb.active {
  outline: 2px solid #111;
  outline-offset: 1px;
}

.detail-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-panel {
  border: 1px solid var(--line);
  border-radius: 1.45rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-soft);
  padding: 1rem;
}

.detail-category {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  color: var(--ink-muted);
  font-weight: 700;
}

.detail-panel h1 {
  margin-top: 0.32rem;
  font-size: clamp(1.8rem, 3.2vw, 2.8rem);
}

.detail-copy {
  margin-top: 0.6rem;
  color: var(--ink-muted);
}

.detail-rating {
  margin-top: 0.52rem;
  display: flex;
  align-items: center;
  gap: 0.42rem;
  color: var(--ink-muted);
  font-size: 0.85rem;
}

.detail-price {
  margin-top: 0.7rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.45rem;
}

.detail-price strong {
  display: block;
  font-size: 1.55rem;
}

.stock-pill {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--ink-muted);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
}

.detail-feature-list {
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.36rem;
}

.detail-feature-list li {
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.82);
  padding: 0.4rem 0.62rem;
  font-size: 0.88rem;
}

.detail-actions {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.45rem;
}

.qty-input {
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  min-height: 2.75rem;
  width: 5rem;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
}

.qty-input:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.trust-inline {
  margin-top: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.trust-inline span {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--ink-muted);
  font-size: 0.74rem;
  padding: 0.3rem 0.58rem;
}

.spec-table {
  margin-top: 0.9rem;
  border: 1px solid var(--line);
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
}

.spec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.62rem 0.75rem;
  border-bottom: 1px solid var(--line);
}

.spec-row:last-child {
  border-bottom: 0;
}

.spec-row span {
  color: var(--ink-muted);
}

.cart-layout {
  display: grid;
  gap: 0.85rem;
}

.cart-items {
  display: grid;
  gap: 0.55rem;
}

.cart-item {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.7rem;
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 0.55rem;
  align-items: center;
}

.cart-item-image {
  width: 90px;
  height: 90px;
  border-radius: 0.75rem;
  object-fit: cover;
}

.cart-item-name {
  font-weight: 700;
  font-size: 0.95rem;
}

.cart-item-sub {
  color: var(--ink-muted);
  font-size: 0.82rem;
}

.qty-control {
  margin-top: 0.4rem;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
}

.qty-control button {
  min-width: 2.2rem;
  min-height: 2.2rem;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
}

.qty-control span {
  min-width: 2rem;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 700;
}

.remove-btn {
  margin-top: 0.35rem;
  border: 0;
  background: transparent;
  color: #be123c;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0;
}

.cart-item-line-total {
  font-size: 1rem;
  font-weight: 700;
}

.cart-summary {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-soft);
  padding: 0.95rem;
  height: fit-content;
}

.cart-summary h2 {
  font-size: 1.35rem;
}

.summary-row {
  margin-top: 0.52rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.summary-row.total {
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--line);
}

.summary-note {
  margin-top: 0.58rem;
  color: var(--ink-muted);
  font-size: 0.78rem;
}

.cart-empty {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-soft);
  padding: 1.2rem;
  text-align: center;
}

.cart-empty h2 {
  font-size: 1.7rem;
}

.cart-empty p {
  margin: 0.45rem auto 0;
  color: var(--ink-muted);
  max-width: 52ch;
}

.cart-empty .btn-primary {
  margin-top: 0.75rem;
}

.checkout-layout {
  display: grid;
  gap: 0.85rem;
}

.checkout-form {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-soft);
  padding: 0.95rem;
}

.checkout-form h2 {
  font-size: 1.35rem;
}

.form-grid {
  display: grid;
  gap: 0.55rem;
}

.form-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.checkout-form label {
  margin-top: 0.6rem;
  display: block;
  font-size: 0.84rem;
  font-weight: 700;
}

.checkout-form input,
.checkout-form select {
  margin-top: 0.25rem;
  width: 100%;
  min-height: 2.7rem;
  border: 1px solid var(--line-strong);
  border-radius: 0.8rem;
  background: #fff;
  padding: 0.5rem 0.62rem;
  font-size: 0.92rem;
}

.checkout-form input:focus-visible,
.checkout-form select:focus-visible {
  outline: 2px solid #111;
  outline-offset: 2px;
}

.form-note {
  margin-top: 0.55rem;
  color: var(--ink-muted);
  font-size: 0.78rem;
}

.checkout-item-list {
  margin-top: 0.55rem;
  display: grid;
  gap: 0.4rem;
}

.checkout-item {
  border: 1px solid var(--line);
  border-radius: 0.8rem;
  background: #fff;
  padding: 0.45rem 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
}

.success-card {
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow-soft);
  padding: 1rem;
}

.success-card h2 {
  font-size: 1.45rem;
}

.success-card p {
  margin: 0.45rem 0 0;
  color: var(--ink-muted);
}

.success-actions {
  margin-top: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.site-footer {
  margin-top: 3rem;
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
}

.footer-grid {
  padding-top: 2rem;
  padding-bottom: 1.2rem;
  display: grid;
  gap: 0.9rem;
}

.footer-grid h3 {
  font-size: 1.45rem;
}

.footer-grid h4 {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  color: var(--ink-muted);
}

.footer-grid p {
  margin: 0.45rem 0 0;
  color: var(--ink-muted);
}

.footer-grid ul {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.32rem;
}

.footer-grid li a {
  color: var(--ink-muted);
  font-size: 0.86rem;
}

.footer-grid li a:hover {
  color: var(--ink);
}

.trust-row {
  margin-top: 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.trust-row span {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: var(--ink-muted);
  font-size: 0.74rem;
  padding: 0.28rem 0.54rem;
}

.footer-meta {
  padding-bottom: 1.6rem;
  color: var(--ink-muted);
  font-size: 0.8rem;
}

.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1rem;
  z-index: 80;
  border: 1px solid #111;
  border-radius: 999px;
  background: #111;
  color: #fff;
  padding: 0.58rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.toast.visible {
  opacity: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}

@media (min-width: 840px) {
  .desktop-nav { display: flex; }
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
  .promo-grid,
  .feature-grid,
  .review-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .product-detail-grid {
    grid-template-columns: 1.05fr 0.95fr;
  }
  .cart-layout,
  .checkout-layout {
    grid-template-columns: 1.3fr 0.7fr;
    align-items: start;
  }
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}

@media (min-width: 1120px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .mini-pill { display: none; }
  .cart-item {
    grid-template-columns: 1fr;
  }
  .cart-item-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/10;
  }
  .form-grid.two {
    grid-template-columns: 1fr;
  }
}
`;
}

function renderGlobalScript() {
  const publicProducts = PRODUCTS.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    priceEur: product.priceEur,
    imageUrl: product.imageUrl,
  }));

  return `
<script>
(() => {
  const SHOP_PRODUCTS = ${JSON.stringify(publicProducts)};
  const PRODUCT_BY_ID = new Map(SHOP_PRODUCTS.map((product) => [product.id, product]));
  const CART_KEY = 'aurum_shop_cart_v1';
  const LAST_ORDER_KEY = 'aurum_shop_last_order_v1';

  function formatPrice(value) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter((item) => PRODUCT_BY_ID.has(item.id) && Number(item.qty) > 0).map((item) => ({ id: item.id, qty: Number(item.qty) }));
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function cartCount(items) {
    return items.reduce((sum, item) => sum + item.qty, 0);
  }

  function cartSubtotal(items) {
    return items.reduce((sum, item) => {
      const product = PRODUCT_BY_ID.get(item.id);
      if (!product) {
        return sum;
      }
      return sum + product.priceEur * item.qty;
    }, 0);
  }

  function shippingCost(subtotal) {
    return subtotal >= 50 ? 0 : 4.99;
  }

  function syncCartBadges() {
    const items = readCart();
    const count = cartCount(items);
    document.querySelectorAll('[data-cart-count]').forEach((node) => {
      node.textContent = String(count);
    });
  }

  function showToast(message) {
    let toast = document.getElementById('shopToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'shopToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(window.__aurumToastTimer);
    window.__aurumToastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 1800);
  }

  function addToCart(productId, qty = 1) {
    const product = PRODUCT_BY_ID.get(productId);
    if (!product) {
      return;
    }

    const items = readCart();
    const existing = items.find((item) => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty });
    }
    writeCart(items);
    syncCartBadges();
    showToast(product.name + ' added to cart');
  }

  function updateCartItem(productId, nextQty) {
    const items = readCart();
    const target = items.find((item) => item.id === productId);
    if (!target) {
      return;
    }

    if (nextQty <= 0) {
      const filtered = items.filter((item) => item.id !== productId);
      writeCart(filtered);
    } else {
      target.qty = nextQty;
      writeCart(items);
    }
    syncCartBadges();
    renderCartPage();
    renderCheckoutSummary();
  }

  function removeCartItem(productId) {
    const filtered = readCart().filter((item) => item.id !== productId);
    writeCart(filtered);
    syncCartBadges();
    renderCartPage();
    renderCheckoutSummary();
  }

  function bindAddButtons() {
    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-product-id');
        if (!id) {
          return;
        }
        addToCart(id, 1);
      });
    });
  }

  function bindDetailAdd() {
    const button = document.getElementById('detailAddButton');
    const qtyInput = document.getElementById('detailQty');
    if (!button || !qtyInput) {
      return;
    }

    button.addEventListener('click', () => {
      const id = button.getAttribute('data-product-id');
      const qty = Math.max(1, Number.parseInt(qtyInput.value || '1', 10));
      if (!id) {
        return;
      }
      addToCart(id, qty);
    });
  }

  function bindGalleryThumbs() {
    const detailMainImage = document.getElementById('detailMainImage');
    const grid = document.getElementById('detailThumbGrid');
    if (!detailMainImage || !grid) {
      return;
    }

    grid.querySelectorAll('.detail-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const image = thumb.getAttribute('data-gallery-image');
        if (!image) {
          return;
        }
        detailMainImage.setAttribute('src', image);
        grid.querySelectorAll('.detail-thumb').forEach((node) => node.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  function bindCatalogFilters() {
    const search = document.getElementById('catalogSearch');
    const countNode = document.getElementById('catalogCount');
    const chips = document.querySelectorAll('[data-category-filter]');
    const cards = Array.from(document.querySelectorAll('[data-product-card]'));

    if (!search || cards.length === 0 || chips.length === 0) {
      return;
    }

    let activeCategory = 'all';

    function runFilter() {
      const query = (search.value || '').trim().toLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const category = card.getAttribute('data-category') || '';
        const haystack = card.getAttribute('data-name') || '';
        const categoryOk = activeCategory === 'all' || category === activeCategory;
        const queryOk = query.length === 0 || haystack.includes(query);
        const show = categoryOk && queryOk;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = visible + ' products';
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeCategory = chip.getAttribute('data-category-filter') || 'all';
        chips.forEach((node) => {
          node.classList.remove('active');
          node.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        runFilter();
      });
    });

    search.addEventListener('input', runFilter);
    runFilter();
  }

  function renderCartPage() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) {
      return;
    }

    const layout = document.getElementById('cartLayout');
    const empty = document.getElementById('cartEmpty');
    const list = document.getElementById('cartItemsList');
    const subtotalNode = document.getElementById('cartSubtotal');
    const shippingNode = document.getElementById('cartShipping');
    const totalNode = document.getElementById('cartGrandTotal');

    if (!layout || !empty || !list || !subtotalNode || !shippingNode || !totalNode) {
      return;
    }

    const items = readCart();
    if (items.length === 0) {
      layout.hidden = true;
      empty.hidden = false;
      list.innerHTML = '';
      subtotalNode.textContent = formatPrice(0);
      shippingNode.textContent = formatPrice(0);
      totalNode.textContent = formatPrice(0);
      return;
    }

    layout.hidden = false;
    empty.hidden = true;

    list.innerHTML = '';
    items.forEach((item) => {
      const product = PRODUCT_BY_ID.get(item.id);
      if (!product) {
        return;
      }

      const article = document.createElement('article');
      article.className = 'cart-item';
      article.setAttribute('data-cart-id', product.id);
      article.innerHTML =
        '<img class="cart-item-image" src="' + product.imageUrl + '" alt="' + product.name + '">' +
        '<div>' +
        '  <a class="cart-item-name" href="/products/' + product.slug + '">' + product.name + '</a>' +
        '  <p class="cart-item-sub">' + product.category + '</p>' +
        '  <div class="qty-control">' +
        '    <button type="button" data-cart-action="decrease" aria-label="Decrease quantity">-</button>' +
        '    <span>' + item.qty + '</span>' +
        '    <button type="button" data-cart-action="increase" aria-label="Increase quantity">+</button>' +
        '  </div>' +
        '  <button type="button" class="remove-btn" data-cart-action="remove">Remove</button>' +
        '</div>' +
        '<div class="cart-item-line-total">' + formatPrice(product.priceEur * item.qty) + '</div>';

      list.appendChild(article);
    });

    const subtotal = cartSubtotal(items);
    const shipping = shippingCost(subtotal);
    subtotalNode.textContent = formatPrice(subtotal);
    shippingNode.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    totalNode.textContent = formatPrice(subtotal + shipping);

    list.querySelectorAll('[data-cart-action]').forEach((control) => {
      control.addEventListener('click', () => {
        const row = control.closest('[data-cart-id]');
        if (!row) {
          return;
        }
        const id = row.getAttribute('data-cart-id');
        if (!id) {
          return;
        }

        const action = control.getAttribute('data-cart-action');
        const cart = readCart();
        const current = cart.find((entry) => entry.id === id);
        if (!current) {
          return;
        }

        if (action === 'increase') {
          updateCartItem(id, current.qty + 1);
        } else if (action === 'decrease') {
          updateCartItem(id, current.qty - 1);
        } else if (action === 'remove') {
          removeCartItem(id);
        }
      });
    });
  }

  function renderCheckoutSummary() {
    const checkoutPage = document.getElementById('checkoutPage');
    const checkoutEmpty = document.getElementById('checkoutEmpty');
    const checkoutItems = document.getElementById('checkoutItems');
    const subtotalNode = document.getElementById('checkoutSubtotal');
    const shippingNode = document.getElementById('checkoutShipping');
    const totalNode = document.getElementById('checkoutTotal');

    if (!checkoutPage || !checkoutEmpty || !checkoutItems || !subtotalNode || !shippingNode || !totalNode) {
      return;
    }

    const items = readCart();
    if (items.length === 0) {
      checkoutPage.hidden = true;
      checkoutEmpty.hidden = false;
      checkoutItems.innerHTML = '';
      subtotalNode.textContent = formatPrice(0);
      shippingNode.textContent = formatPrice(0);
      totalNode.textContent = formatPrice(0);
      return;
    }

    checkoutPage.hidden = false;
    checkoutEmpty.hidden = true;

    checkoutItems.innerHTML = '';
    items.forEach((item) => {
      const product = PRODUCT_BY_ID.get(item.id);
      if (!product) {
        return;
      }

      const line = document.createElement('div');
      line.className = 'checkout-item';
      line.innerHTML =
        '<span>' + product.name + ' x' + item.qty + '</span>' +
        '<strong>' + formatPrice(product.priceEur * item.qty) + '</strong>';
      checkoutItems.appendChild(line);
    });

    const subtotal = cartSubtotal(items);
    const shipping = shippingCost(subtotal);
    subtotalNode.textContent = formatPrice(subtotal);
    shippingNode.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    totalNode.textContent = formatPrice(subtotal + shipping);
  }

  function bindCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const items = readCart();
      if (items.length === 0) {
        renderCheckoutSummary();
        return;
      }

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const subtotal = cartSubtotal(items);
      const shipping = shippingCost(subtotal);
      const total = subtotal + shipping;

      const order = {
        id: 'AUR-' + Date.now(),
        createdAt: new Date().toISOString(),
        items,
        subtotal,
        shipping,
        total,
        customer: {
          firstName: String(data.get('firstName') || ''),
          lastName: String(data.get('lastName') || ''),
          email: String(data.get('email') || ''),
          street: String(data.get('street') || ''),
          zip: String(data.get('zip') || ''),
          city: String(data.get('city') || ''),
          paymentMethod: String(data.get('paymentMethod') || 'card'),
        },
      };

      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      writeCart([]);
      syncCartBadges();
      window.location.href = '/order-success';
    });
  }

  function renderSuccessPage() {
    const orderIdNode = document.getElementById('successOrderId');
    const orderMetaNode = document.getElementById('successOrderMeta');
    if (!orderIdNode || !orderMetaNode) {
      return;
    }

    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      if (!raw) {
        orderIdNode.textContent = 'Order ID: not available';
        orderMetaNode.textContent = 'No recent order was found in this browser session.';
        return;
      }

      const order = JSON.parse(raw);
      const totalItems = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0)
        : 0;
      orderIdNode.textContent = 'Order ID: ' + (order.id || '-');
      orderMetaNode.textContent = 'Items: ' + totalItems + ' · Total: ' + formatPrice(Number(order.total || 0));
    } catch {
      orderIdNode.textContent = 'Order ID: not available';
      orderMetaNode.textContent = 'Could not load order information.';
    }
  }

  function bindHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) {
      return;
    }

    function syncHeaderState() {
      header.classList.toggle('scrolled', window.scrollY > 18);
    }

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncCartBadges();
    bindAddButtons();
    bindDetailAdd();
    bindGalleryThumbs();
    bindCatalogFilters();
    renderCartPage();
    renderCheckoutSummary();
    bindCheckoutForm();
    renderSuccessPage();
    bindHeaderScroll();
  });
})();
</script>
`;
}

function renderDocument({
  pathname,
  title,
  description,
  content,
  status = 200,
}) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <style>${renderGlobalStyles()}</style>
  </head>
  <body>
    ${renderHeader(pathname)}
    <main>
      ${content}
    </main>
    ${renderFooter()}
    ${renderGlobalScript()}
  </body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=120",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);

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
        count: PRODUCTS.length,
        items: PRODUCTS,
      });
    }

    if (pathname.startsWith("/api/products/")) {
      const slug = pathname.replace("/api/products/", "");
      const product = PRODUCT_BY_SLUG.get(slug);
      if (!product) {
        return jsonResponse({ error: "not_found" }, 404);
      }
      return jsonResponse(product);
    }

    if (pathname.startsWith("/api/")) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    if (pathname === "/") {
      return renderHomePage(pathname);
    }

    if (pathname === "/products") {
      return renderProductsPage(pathname);
    }

    if (pathname.startsWith("/products/")) {
      const slug = pathname.replace("/products/", "");
      const product = PRODUCT_BY_SLUG.get(slug);
      if (!product) {
        return renderNotFoundPage(pathname);
      }
      return renderProductDetailPage(pathname, product);
    }

    if (pathname === "/cart") {
      return renderCartPage(pathname);
    }

    if (pathname === "/checkout") {
      return renderCheckoutPage(pathname);
    }

    if (pathname === "/order-success") {
      return renderOrderSuccessPage(pathname);
    }

    return renderNotFoundPage(pathname);
  },
};
