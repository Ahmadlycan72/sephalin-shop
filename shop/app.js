/* ============================================================
   سفالین — منطق نمونه‌کار (بدون وابستگی)
   ============================================================ */
(() => {
  "use strict";

  /* ---------- ابزارها ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const nf = new Intl.NumberFormat("fa-IR");
  const money = (n) => nf.format(n) + " تومان";

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* حالت خصوصی */ }
    },
  };

  /* ---------- تصاویر (SVG) ---------- */
  function art(kind, id) {
    const g = `g-${id}`, g2 = `g2-${id}`;
    const defs = `
      <defs>
        <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d9a37b"/><stop offset="1" stop-color="#a25a38"/>
        </linearGradient>
        <linearGradient id="${g2}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f3e7d6"/><stop offset="1" stop-color="#ddc6aa"/>
        </linearGradient>
      </defs>`;
    const shadow = `<ellipse cx="100" cy="172" rx="58" ry="8" fill="#3d2818" opacity=".13"/>`;
    const shapes = {
      vaseTall: `
        <path d="M84 40c0 15-6 23-12 35-8 17-14 33-14 53 0 34 20 52 42 52s42-18 42-52c0-20-6-36-14-53-6-12-12-20-12-35Z" fill="url(#${g})"/>
        <path d="M72 128c14 8 30 10 46 5" fill="none" stroke="#f6e9d8" stroke-width="6" opacity=".45" stroke-linecap="round"/>
        <path d="M78 148c12 7 26 9 40 5" fill="none" stroke="#f6e9d8" stroke-width="4" opacity=".3" stroke-linecap="round"/>`,
      vaseRound: `
        <rect x="86" y="30" width="28" height="26" rx="9" fill="url(#${g})"/>
        <path d="M100 52c-32 0-56 27-56 64 0 36 24 58 56 58s56-22 56-58c0-37-24-64-56-64Z" fill="url(#${g})"/>
        <g fill="#f6e9d8" opacity=".4">
          <circle cx="82" cy="110" r="4"/><circle cx="100" cy="110" r="4"/><circle cx="118" cy="110" r="4"/>
          <circle cx="91" cy="128" r="4"/><circle cx="109" cy="128" r="4"/><circle cx="100" cy="146" r="4"/>
        </g>`,
      bowl: `
        <path d="M38 94h124c0 40-28 66-62 66S38 134 38 94Z" fill="url(#${g})"/>
        <ellipse cx="100" cy="94" rx="62" ry="11" fill="url(#${g2})"/>
        <ellipse cx="100" cy="94" rx="48" ry="7" fill="#caa887" opacity=".55"/>
        <path d="M52 120c16 10 34 14 48 14" fill="none" stroke="#f6e9d8" stroke-width="5" opacity=".3" stroke-linecap="round"/>`,
      bowlStem: `
        <path d="M46 84h108c0 34-24 56-54 56S46 118 46 84Z" fill="url(#${g})"/>
        <ellipse cx="100" cy="84" rx="54" ry="10" fill="url(#${g2})"/>
        <path d="M94 138h12v18H94Z" fill="#a25a38"/>
        <ellipse cx="100" cy="158" rx="26" ry="7" fill="url(#${g2})"/>`,
      cups: `
        <g>
          <path d="M34 86h46v26c0 17-10 27-23 27s-23-10-23-27Z" fill="url(#${g})"/>
          <path d="M80 94c14 0 20 6 20 16s-8 16-20 16" fill="none" stroke="#b9714c" stroke-width="7"/>
          <ellipse cx="57" cy="86" rx="23" ry="5" fill="url(#${g2})"/>
        </g>
        <g>
          <path d="M120 96h46v24c0 16-10 26-23 26s-23-10-23-26Z" fill="url(#${g})"/>
          <path d="M166 104c12 0 18 6 18 15s-7 15-18 15" fill="none" stroke="#b9714c" stroke-width="7"/>
          <ellipse cx="143" cy="96" rx="23" ry="5" fill="url(#${g2})"/>
        </g>`,
      planter: `
        <path d="M62 78h76l-9 84H71Z" fill="url(#${g})"/>
        <ellipse cx="100" cy="78" rx="38" ry="8" fill="#6b4a33"/>
        <path d="M100 74c0-18-8-26-8-38" fill="none" stroke="#6b7a5e" stroke-width="4" stroke-linecap="round"/>
        <path d="M96 56c-14-4-20-14-20-26 12 2 20 12 20 26Z" fill="#6b7a5e"/>
        <path d="M104 50c12-6 16-16 14-28-12 4-18 14-14 28Z" fill="#7d8c6f"/>
        <path d="M74 104h52" stroke="#f6e9d8" stroke-width="4" opacity=".3" stroke-linecap="round"/>`,
    }[kind];
    return `<svg viewBox="0 0 200 180" role="img">${defs}${shadow}${shapes}</svg>`;
  }

  /* ---------- داده ---------- */
  const products = [
    { id: "v1", kind: "vaseTall", title: "کوزهٔ بلند نیلوفر", cat: "vase", price: 1480000, meta: "خاک رس · لعاب شفاف", desc: "برای شاخه‌های بلند و گوشهٔ آرام اتاق.", flag: "پرفروش" },
    { id: "b1", kind: "bowl", title: "کاسهٔ عمیق خاکستر", cat: "bowl", price: 620000, meta: "خاک رس · لعاب مات", desc: "برای سوپ، سالاد و هر چیز روزمره." },
    { id: "c1", kind: "cups", title: "فنجان جفتی صبح", cat: "cup", price: 480000, meta: "خاک رس · لعاب کرم", desc: "دو فنجان هم‌خانواده، برای چای و قهوه." },
    { id: "p1", kind: "planter", title: "گلدان استوانه باد", cat: "plant", price: 890000, meta: "خاک رس · بدون لعاب", desc: "بافت خام، مناسب ساکولنت و ریحان." },
    { id: "v2", kind: "vaseRound", title: "کوزهٔ شکم‌گشاد انار", cat: "vase", price: 1120000, meta: "خاک رس · نقش دستی", desc: "بدنهٔ گرد با نقش‌های نقطه‌ای لعاب." },
    { id: "b2", kind: "bowlStem", title: "کاسهٔ پایه‌دار ماه", cat: "bowl", price: 760000, meta: "خاک رس · لعاب شفاف", desc: "برای میوه یا به‌عنوان قطعهٔ تزئینی.", flag: "تازه" },
  ];

  /* ---------- رندر محصولات ---------- */
  const grid = $("#productGrid");
  let filter = "all";

  function renderProducts() {
    const list = filter === "all" ? products : products.filter((p) => p.cat === filter);
    grid.innerHTML = list.map((p) => `
      <article class="card">
        <div class="card__media">
          ${p.flag ? `<span class="card__flag">${p.flag}</span>` : ""}
          ${art(p.kind, p.id)}
        </div>
        <div class="card__body">
          <span class="card__meta">${p.meta}</span>
          <h3 class="card__title">${p.title}</h3>
          <p class="card__desc">${p.desc}</p>
          <div class="card__foot">
            <span class="price">${money(p.price)}</span>
            <button class="add" data-add="${p.id}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              افزودن
            </button>
          </div>
        </div>
      </article>`).join("");
  }

  /* ---------- سبد ---------- */
  let cart = store.get("sephalin_cart", []);
  const findProduct = (id) => products.find((p) => p.id === id);

  const cartEl = $("#cart");
  const overlay = $("#overlay");
  const badge = $("#cartCount");

  function cartItems() {
    return cart.map((line) => ({ ...line, product: findProduct(line.id) })).filter((l) => l.product);
  }
  function cartTotal() {
    return cartItems().reduce((sum, l) => sum + l.product.price * l.qty, 0);
  }
  function cartCount() {
    return cart.reduce((sum, l) => sum + l.qty, 0);
  }

  function renderCart() {
    const items = cartItems();
    const body = $("#cartBody");
    const foot = $("#cartFoot");

    badge.hidden = cartCount() === 0;
    badge.textContent = nf.format(cartCount());

    if (!items.length) {
      body.innerHTML = `
        <div class="cart__empty">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.5 11h9L20 8H7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
          <p>سبد خالی است.</p>
          <a class="btn btn--ghost btn--sm" href="#products" data-close-cart>دیدن محصولات</a>
        </div>`;
      foot.hidden = true;
      return;
    }

    body.innerHTML = items.map((l) => `
      <div class="citem">
        <div class="citem__art">${art(l.product.kind, "c-" + l.id)}</div>
        <div>
          <div class="citem__title">${l.product.title}</div>
          <div class="citem__price">${money(l.product.price)}</div>
        </div>
        <div class="qty">
          <button data-dec="${l.id}" aria-label="کاهش">−</button>
          <b>${nf.format(l.qty)}</b>
          <button data-inc="${l.id}" aria-label="افزایش">+</button>
        </div>
      </div>`).join("");

    foot.hidden = false;
    $("#cartTotal").textContent = money(cartTotal());
  }

  function saveCart() { store.set("sephalin_cart", cart); renderCart(); }

  function addToCart(id) {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart();
    const p = findProduct(id);
    toast(`«${p.title}» به سبد اضافه شد`);
  }

  function changeQty(id, delta) {
    const line = cart.find((l) => l.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter((l) => l.id !== id);
    saveCart();
  }

  /* ---------- کشو ---------- */
  let lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $("#cartClose").focus();
  }
  function closeCart() {
    overlay.classList.remove("is-open");
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    setTimeout(() => { overlay.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- توست ---------- */
  function toast(text) {
    const box = $("#toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = text;
    box.append(el);
    setTimeout(() => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    }, 2400);
  }

  /* ---------- سفارش ---------- */
  $("#checkout").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const note = $("#checkoutNote");
    note.classList.remove("ok");

    const digits = String(data.phone || "").replace(/\D/g, "");
    if (String(data.name || "").trim().length < 3) return fail("نام را کامل وارد کنید.");
    if (digits.length < 10) return fail("شمارهٔ تماس معتبر نیست.");
    if (String(data.address || "").trim().length < 10) return fail("نشانی را کامل‌تر بنویسید.");
    if (!cartItems().length) return fail("سبد خالی است.");

    const code = "SF-" + Math.floor(10000 + Math.random() * 89999);
    const orders = store.get("sephalin_orders", []);
    orders.push({
      code, at: new Date().toISOString(),
      customer: { name: data.name, phone: data.phone, address: data.address },
      items: cartItems().map((l) => ({ title: l.product.title, price: l.product.price, qty: l.qty })),
      total: cartTotal(),
    });
    store.set("sephalin_orders", orders);

    cart = [];
    saveCart();
    form.reset();
    note.classList.add("ok");
    note.textContent = `سفارش ثبت شد. کد پیگیری: ${code}`;
    toast("سفارش با موفقیت ثبت شد");
    setTimeout(closeCart, 1600);
  });

  function fail(message) {
    const note = $("#checkoutNote");
    note.classList.remove("ok");
    note.textContent = message;
    return false;
  }

  /* ---------- خبرنامه ---------- */
  $("#newsletter").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim())) {
      toast("ایمیل معتبر نیست");
      input.focus();
      return;
    }
    toast("عضویت ثبت شد. خوش آمدی!");
    input.value = "";
  });

  /* ---------- رویدادها ---------- */
  grid.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add]");
    if (btn) addToCart(btn.dataset.add);
  });

  $("#cartBody").addEventListener("click", (event) => {
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    const close = event.target.closest("[data-close-cart]");
    if (inc) changeQty(inc.dataset.inc, 1);
    if (dec) changeQty(dec.dataset.dec, -1);
    if (close) closeCart();
  });

  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartEl.classList.contains("is-open")) closeCart();
  });

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      filter = chip.dataset.filter;
      renderProducts();
    });
  });

  /* ---------- ظاهر شدن و هدر ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- شروع ---------- */
  renderProducts();
  renderCart();
})();
