const BUILD_DATE = "2026-02-27";

const products = [
  {
    id: "AURUM-X1-GRA",
    name: "AURUM X1 - Graphite",
    category: "High-Precision Wireless Headphones",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.9,
    reviewCount: 812,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=90",
    description: "Designed for absolute accuracy, engineered with aerospace-grade materials.",
  },
  {
    id: "AURUM-X1-SIL",
    name: "AURUM X1 - Silver",
    category: "High-Precision Wireless Headphones",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.8,
    reviewCount: 516,
    imageUrl:
      "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?auto=format&fit=crop&w=1600&q=90",
    description: "Reference-grade tuning with premium finish and high comfort.",
  },
  {
    id: "AURUM-X1-MID",
    name: "AURUM X1 - Midnight",
    category: "High-Precision Wireless Headphones",
    priceEur: 599,
    compareAtEur: 749,
    rating: 4.9,
    reviewCount: 1043,
    imageUrl:
      "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=90",
    description: "Built to perform from studio sessions to city commutes.",
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

function renderShopHtml() {
  const productsJson = JSON.stringify(products);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AURUM X1 - Single Product Shop</title>
    <meta name="description" content="AURUM X1 premium single-product storefront." />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      :root {
        --cream: 253 251 247;
        --cream-dark: 245 242 235;
        --ink: 18 18 18;
        --ink-light: 42 42 42;
        --stone: 230 228 223;
        --gold: 212 175 55;
        --emerald: 16 185 129;
      }

      html { scroll-behavior: smooth; }
      body {
        font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background-color: rgb(var(--cream));
        color: rgb(var(--ink));
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.6;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.15;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse-soft {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-reveal { animation: fadeInUp 0.6s ease-out forwards; }
      .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

      .glass-panel {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .glass-card {
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      }
      .text-balance { text-wrap: balance; }

      .cart-drawer {
        transition: transform 280ms ease;
        transform: translateX(100%);
      }
      .cart-drawer.open {
        transform: translateX(0);
      }
      .overlay {
        opacity: 0;
        pointer-events: none;
        transition: opacity 220ms ease;
      }
      .overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .thumb.active {
        outline: 2px solid #000;
        outline-offset: 2px;
      }
    </style>
  </head>
  <body>
    <header id="topHeader" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 bg-transparent">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" class="text-xl sm:text-2xl font-bold tracking-tight">AURUM</a>

        <nav class="hidden md:flex items-center gap-8">
          <a href="#technology" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Technology</a>
          <a href="#specs" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Specs</a>
          <a href="#reviews" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Reviews</a>
          <a href="#sustainability" class="text-sm font-medium text-gray-700 hover:text-black transition-colors">Sustainability</a>
        </nav>

        <div class="flex items-center gap-3">
          <button id="openCartBtn" class="relative p-2 hover:bg-black/5 rounded-full transition-colors" aria-label="Open cart">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 2.2c-.6.6-.2 1.8.7 1.8H17m0 0a2 2 0 110 4 2 2 0 010-4m-8 2a2 2 0 11-4 0 2 2 0 014 0"></path></svg>
            <span id="cartCountBadge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs items-center justify-center rounded-full font-bold">0</span>
          </button>
        </div>
      </div>
    </header>

    <section class="min-h-screen pt-24 pb-16 flex items-center bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div class="order-2 lg:order-1 space-y-8 animate-reveal">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft"></span>
              <span class="text-xs font-semibold text-emerald-700 uppercase tracking-wide">New Release 2026</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-balance">The reference<br/>for pure sound.</h1>
            <p class="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">Designed for absolute accuracy, engineered with aerospace-grade materials, and tuned to deliver studio-level detail anywhere.</p>

            <div class="flex items-center gap-4">
              <span class="text-sm font-medium text-gray-500">Color:</span>
              <div class="flex items-center gap-2" id="variantDots"></div>
              <span class="text-sm font-medium text-gray-900 ml-2" id="variantName">Graphite</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button id="heroAddToCart" class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl">Add to Cart - EUR 599</button>
              <a href="#specs" class="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors">View Specs</a>
            </div>

            <div class="flex flex-wrap items-center gap-6 pt-6 text-sm text-gray-500">
              <div class="flex items-center gap-2"><span class="text-emerald-600">✓</span><span>Free Express Shipping</span></div>
              <div class="flex items-center gap-2"><span class="text-emerald-600">✓</span><span>5-Year Warranty</span></div>
              <div class="flex items-center gap-2"><span class="text-emerald-600">✓</span><span>45-Day Returns</span></div>
            </div>
          </div>

          <div class="order-1 lg:order-2 relative animate-float">
            <div class="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl group">
              <img id="heroImage" src="${products[0].imageUrl}" alt="AURUM X1" class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div class="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Sound Engineering</p>
                  <p class="text-sm font-semibold text-gray-900">Studio-Grade Audio</p>
                </div>
                <button class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">▶</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Gallery</span>
          <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold">Every Angle, Perfected</h2>
        </div>

        <div class="relative aspect-[16/9] rounded-3xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 mb-6 group">
          <img id="galleryMainImage" src="${products[0].imageUrl}" alt="Gallery" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          <div class="absolute top-6 left-6 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"><span class="text-sm font-bold text-gray-900" id="galleryBadge">Award Winning Design</span></div>
          <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <h3 class="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg" id="galleryHeadline">Precision Engineered</h3>
            <p class="text-lg md:text-xl text-white/90 drop-shadow-md" id="gallerySubline">Every curve calculated for acoustic perfection</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="galleryThumbs"></div>
      </div>
    </section>

    <section class="relative py-0">
      <div class="relative h-[70vh] min-h-[500px] bg-gray-900 overflow-hidden">
        <img src="${products[1].imageUrl}" alt="Lifestyle" class="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div class="absolute inset-0 flex items-end">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div class="max-w-2xl">
              <span class="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-widest mb-6">Lifestyle</span>
              <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">Designed for Your World</h2>
              <p class="text-xl text-white/80 leading-relaxed mb-8">From morning commutes to late-night sessions. Built to perform wherever life takes you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="technology" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Technology</span>
          <h2 class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Engineered to reference standards</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Every component is tuned for accuracy, durability, and long-term reliability.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100"><div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-6">01</div><h3 class="text-xl font-bold mb-3">Beryllium-coated drivers</h3><p class="text-gray-600 leading-relaxed">Ultra-light 40mm diaphragms deliver tighter transients and wider dynamic range.</p></div>
          <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100"><div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-6">02</div><h3 class="text-xl font-bold mb-3">Adaptive noise control</h3><p class="text-gray-600 leading-relaxed">Hybrid ANC with 8 microphones and real-time DSP for clean silence.</p></div>
          <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100"><div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-6">03</div><h3 class="text-xl font-bold mb-3">Aerospace aluminum frame</h3><p class="text-gray-600 leading-relaxed">CNC-milled for structural integrity and perfect balance.</p></div>
          <div class="p-8 rounded-2xl bg-gray-50 border border-gray-100"><div class="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg mb-6">04</div><h3 class="text-xl font-bold mb-3">48h battery life</h3><p class="text-gray-600 leading-relaxed">With fast-charge: 10 min = 5 hours of playback.</p></div>
        </div>
      </div>
    </section>

    <section id="specs" class="py-24 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="lg:col-span-1 space-y-6">
            <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Specifications</span>
            <h2 class="text-3xl sm:text-4xl font-bold">Technical Details</h2>
            <p class="text-gray-400 leading-relaxed">Every component is precision-engineered for professional-grade performance.</p>
          </div>
          <div class="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Driver</p><p class="text-lg font-bold text-white">40mm beryllium-coated</p></div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">ANC</p><p class="text-lg font-bold text-white">Hybrid, 8-mic array</p></div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Battery</p><p class="text-lg font-bold text-white">48h playback</p></div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Charging</p><p class="text-lg font-bold text-white">USB-C, fast charge</p></div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Weight</p><p class="text-lg font-bold text-white">295g</p></div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10"><p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Bluetooth</p><p class="text-lg font-bold text-white">5.4 + multipoint</p></div>
          </div>
        </div>
      </div>
    </section>

    <section id="reviews" class="py-24 bg-stone-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Reviews</span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-bold">Loved by 812+ Customers</h2>
          <p class="mt-2 text-gray-600">4.9 out of 5 average rating</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"><h3 class="text-lg font-bold mb-2">Studio accuracy</h3><p class="text-gray-600 mb-6 leading-relaxed">Neutral, detailed tuning. Best noise control I have used.</p><p class="font-semibold">David K. - Berlin</p></div>
          <div class="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"><h3 class="text-lg font-bold mb-2">Built like an instrument</h3><p class="text-gray-600 mb-6 leading-relaxed">Materials and fit feel truly premium. Everything is engineered.</p><p class="font-semibold">Mila S. - Vienna</p></div>
          <div class="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"><h3 class="text-lg font-bold mb-2">Only pair I travel with</h3><p class="text-gray-600 mb-6 leading-relaxed">Battery lasts forever, comfort is excellent for long flights.</p><p class="font-semibold">Oliver R. - Zurich</p></div>
        </div>
      </div>
    </section>

    <section id="sustainability" class="py-24 bg-emerald-950 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sustainability</span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-bold text-white">Designed for Longevity. Built Responsibly.</h2>
          <p class="mt-4 text-lg text-emerald-200/80 max-w-2xl mx-auto">We use recycled materials and plastic-free packaging.</p>
        </div>
      </div>
    </section>

    <footer class="bg-black text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <h3 class="text-2xl font-bold mb-4">AURUM</h3>
            <p class="text-gray-400 max-w-md">Precision audio engineered for reference standards.</p>
          </div>
          <div><h4 class="font-semibold mb-4">Company</h4><ul class="space-y-2 text-sm text-gray-400"><li>About</li><li>Careers</li><li>Press</li></ul></div>
          <div><h4 class="font-semibold mb-4">Support</h4><ul class="space-y-2 text-sm text-gray-400"><li>FAQ</li><li>Shipping</li><li>Returns</li></ul></div>
        </div>
        <p class="text-gray-500 text-sm mt-12">© 2026 AURUM Labs GmbH. Build ${BUILD_DATE}</p>
      </div>
    </footer>

    <div id="cartOverlay" class="overlay fixed inset-0 z-50 bg-black/50"></div>
    <aside id="cartDrawer" class="cart-drawer fixed top-0 right-0 z-[60] h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold">Cart</h3>
        <button id="closeCartBtn" class="w-10 h-10 rounded-full border">✕</button>
      </div>
      <div id="cartItems" class="space-y-3"></div>
      <div class="mt-6 border-t pt-4">
        <div class="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span id="cartTotal">EUR 0</span>
        </div>
        <button class="mt-4 w-full rounded-full bg-black text-white py-3 font-semibold">Checkout</button>
      </div>
    </aside>

    <script>
      const PRODUCTS = ${productsJson};
      const CART_KEY = 'aurum_worker_cart_v1';
      let currentVariantIndex = 0;

      const topHeader = document.getElementById('topHeader');
      const heroImage = document.getElementById('heroImage');
      const variantName = document.getElementById('variantName');
      const variantDots = document.getElementById('variantDots');
      const heroAddToCart = document.getElementById('heroAddToCart');
      const cartCountBadge = document.getElementById('cartCountBadge');
      const openCartBtn = document.getElementById('openCartBtn');
      const closeCartBtn = document.getElementById('closeCartBtn');
      const cartDrawer = document.getElementById('cartDrawer');
      const cartOverlay = document.getElementById('cartOverlay');
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
      const galleryMainImage = document.getElementById('galleryMainImage');
      const galleryThumbs = document.getElementById('galleryThumbs');

      const galleryData = [
        { image: PRODUCTS[0].imageUrl, headline: 'Precision Engineered', subline: 'Every curve calculated for acoustic perfection', badge: 'Award Winning Design' },
        { image: PRODUCTS[1].imageUrl, headline: 'Ergonomic Mastery', subline: 'Designed to feel like an extension of you', badge: 'Ultra Lightweight 295g' },
        { image: PRODUCTS[2].imageUrl, headline: 'Premium Materials', subline: 'Aerospace aluminum meets leather comfort', badge: 'Handcrafted Finish' },
        { image: PRODUCTS[0].imageUrl, headline: 'Designed for Life', subline: 'From studio sessions to city streets', badge: '48h Battery Life' },
      ];

      function readCart() {
        try {
          const raw = localStorage.getItem(CART_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      }

      function writeCart(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }

      function formatPrice(value) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
      }

      function renderVariantDots() {
        variantDots.innerHTML = '';
        PRODUCTS.forEach((product, index) => {
          const btn = document.createElement('button');
          btn.className = 'w-8 h-8 rounded-full transition-all border';
          btn.style.background = index === 0 ? '#2C2F36' : index === 1 ? '#C4C8CF' : '#0B0F14';
          if (index === currentVariantIndex) btn.style.transform = 'scale(1.1)';
          btn.addEventListener('click', () => {
            currentVariantIndex = index;
            heroImage.src = product.imageUrl;
            variantName.textContent = product.name.split(' - ')[1] || product.name;
            renderVariantDots();
          });
          variantDots.appendChild(btn);
        });
      }

      function renderGallery() {
        galleryThumbs.innerHTML = '';
        galleryData.forEach((item, index) => {
          const btn = document.createElement('button');
          btn.className = 'thumb relative aspect-square rounded-2xl overflow-hidden border border-gray-200';
          btn.innerHTML = '<img src="' + item.image + '" alt="Gallery" class="w-full h-full object-cover" />';
          btn.addEventListener('click', () => {
            galleryMainImage.src = item.image;
            document.getElementById('galleryHeadline').textContent = item.headline;
            document.getElementById('gallerySubline').textContent = item.subline;
            document.getElementById('galleryBadge').textContent = item.badge;
            document.querySelectorAll('.thumb').forEach((n) => n.classList.remove('active'));
            btn.classList.add('active');
          });
          if (index === 0) btn.classList.add('active');
          galleryThumbs.appendChild(btn);
        });
      }

      function addCurrentVariantToCart() {
        const product = PRODUCTS[currentVariantIndex];
        const cart = readCart();
        cart.push({ id: product.id, name: product.name, price: product.priceEur });
        writeCart(cart);
        renderCart();
        openCart();
      }

      function renderCart() {
        const cart = readCart();
        cartCountBadge.textContent = String(cart.length);
        if (cart.length > 0) cartCountBadge.classList.remove('hidden');
        if (cart.length === 0) cartCountBadge.classList.add('hidden');

        if (!cart.length) {
          cartItems.innerHTML = '<p class="text-sm text-gray-500">Your cart is empty.</p>';
          cartTotal.textContent = 'EUR 0';
          return;
        }

        const grouped = new Map();
        cart.forEach((item) => {
          const found = grouped.get(item.id);
          if (found) {
            found.qty += 1;
          } else {
            grouped.set(item.id, { ...item, qty: 1 });
          }
        });

        let total = 0;
        cartItems.innerHTML = '';
        grouped.forEach((item) => {
          total += item.price * item.qty;
          const row = document.createElement('div');
          row.className = 'flex items-center justify-between border rounded-xl px-3 py-2';
          row.innerHTML = '<div><p class="font-medium text-sm">' + item.name + '</p><p class="text-xs text-gray-500">x' + item.qty + '</p></div><p class="font-semibold">' + formatPrice(item.price * item.qty) + '</p>';
          cartItems.appendChild(row);
        });

        cartTotal.textContent = formatPrice(total);
      }

      function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
      }
      function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
      }

      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        topHeader.className = scrolled
          ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 glass-panel shadow-sm'
          : 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-5 bg-transparent';
      });

      heroAddToCart.addEventListener('click', addCurrentVariantToCart);
      openCartBtn.addEventListener('click', openCart);
      closeCartBtn.addEventListener('click', closeCart);
      cartOverlay.addEventListener('click', closeCart);

      renderVariantDots();
      renderGallery();
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
      return jsonResponse({ count: products.length, products });
    }

    if (pathname.startsWith("/api/")) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    return new Response(renderShopHtml(), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=120",
      },
    });
  },
};
