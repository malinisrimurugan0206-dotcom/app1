/* ==========================================================
   QuickBite – interactive food delivery prototype
   Pure HTML / CSS / JavaScript. No backend, no paid APIs.
   ========================================================== */
(() => {
  'use strict';

  /* ---------- tiny helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;

  const ICON = {
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    cart: svg('<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
    trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    minus: svg('<path d="M5 12h14"/>'),
    home: svg('<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>'),
    receipt: svg('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>')
  };

  /* ---------- data ---------- */
  const photo = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
  const d = (id, name, desc, price, pic, emoji, o = {}) => ({
    id, name, desc, price, pic, emoji,
    veg: !!o.veg, cal: o.cal || 350, mins: o.mins || 15, rating: o.rating || 4.5, popular: !!o.popular
  });

  const CATEGORIES = [
    { id: 'all', name: 'All', emoji: '🍽️' },
    { id: 'burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'sushi', name: 'Sushi', emoji: '🍣' },
    { id: 'indian', name: 'Indian', emoji: '🍛' },
    { id: 'healthy', name: 'Healthy', emoji: '🥗' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' }
  ];

  const RESTAURANTS = [
    {
      id: 'burger-barn', name: 'Burger Barn', category: 'burgers', cuisine: 'Burgers · American · Fast food',
      pic: '1568901346375-23c9450c58cd', emoji: '🍔', rating: 4.6, reviews: '2.1k', time: '20–25 min', fee: 30, offer: '20% OFF',
      menu: [
        d('bb1', 'Classic Cheeseburger', 'Juicy grilled patty, melted cheddar, crisp lettuce, tomato and our smoky house sauce in a toasted brioche bun.', 179, '1568901346375-23c9450c58cd', '🍔', { cal: 520, mins: 15, rating: 4.7, popular: true }),
        d('bb2', 'Crispy Chicken Burger', 'Golden buttermilk-fried chicken, tangy slaw and spicy mayo layered in a soft sesame bun.', 199, '1550547660-d9450f859349', '🍔', { cal: 560, mins: 18, rating: 4.6 }),
        d('bb3', 'Veggie Supreme Burger', 'Hand-pressed veggie and corn patty with avocado spread, pickles and fresh greens.', 159, '1571091718767-18b5b1457add', '🍔', { veg: true, cal: 430, rating: 4.4 }),
        d('bb4', 'Loaded Cheese Fries', 'Crispy fries smothered in warm cheese sauce, jalapeños and herbs.', 119, '1573080496219-bb080dd4f877', '🍟', { veg: true, cal: 480, mins: 12, rating: 4.5, popular: true }),
        d('bb5', 'Chocolate Thick Shake', 'Creamy, hand-spun chocolate shake topped with whipped cream.', 129, null, '🥤', { veg: true, cal: 390, mins: 8, rating: 4.5 })
      ]
    },
    {
      id: 'napoli', name: 'Napoli Wood Fire', category: 'pizza', cuisine: 'Pizza · Italian · Pasta',
      pic: '1513104890138-7c749659a591', emoji: '🍕', rating: 4.7, reviews: '3.4k', time: '25–30 min', fee: 30, offer: 'Free garlic bread',
      menu: [
        d('np1', 'Margherita Pizza', 'Stone-baked thin crust with San Marzano tomato sauce, fresh mozzarella and basil.', 249, '1574071318508-1cdbab80d002', '🍕', { veg: true, cal: 780, mins: 22, rating: 4.8, popular: true }),
        d('np2', 'Pepperoni Feast', 'Double pepperoni, bubbling mozzarella and a drizzle of chilli honey.', 329, '1565299624946-b28f40a0ae38', '🍕', { cal: 910, mins: 24, rating: 4.7 }),
        d('np3', 'Farmhouse Veg Pizza', 'Capsicum, mushrooms, sweet corn, onions and olives on a herby tomato base.', 299, '1513104890138-7c749659a591', '🍕', { veg: true, cal: 820, mins: 24, rating: 4.5 }),
        d('np4', 'Cheesy Garlic Bread', 'Oven-toasted bread with garlic butter and a molten cheese crown.', 99, null, '🥖', { veg: true, cal: 340, mins: 10, rating: 4.4 }),
        d('np5', 'Tiramisu Cup', 'Espresso-soaked sponge layered with mascarpone cream and cocoa.', 149, null, '🍰', { veg: true, cal: 360, mins: 5, rating: 4.6 })
      ]
    },
    {
      id: 'sakura', name: 'Sakura Sushi House', category: 'sushi', cuisine: 'Japanese · Sushi · Asian',
      pic: '1579871494447-9811cf80d66c', emoji: '🍣', rating: 4.8, reviews: '1.2k', time: '30–35 min', fee: 40, offer: 'Chef’s special',
      menu: [
        d('sk1', 'Salmon Nigiri (6 pcs)', 'Silky fresh salmon draped over hand-pressed seasoned sushi rice.', 399, '1579871494447-9811cf80d66c', '🍣', { cal: 310, mins: 20, rating: 4.9, popular: true }),
        d('sk2', 'California Roll (8 pcs)', 'Crab, cucumber and avocado rolled in toasted sesame.', 349, null, '🍣', { cal: 380, mins: 20, rating: 4.6 }),
        d('sk3', 'Veg Maki Roll (8 pcs)', 'Cucumber, carrot and avocado in nori with pickled ginger and wasabi.', 279, null, '🥒', { veg: true, cal: 290, mins: 18, rating: 4.4 }),
        d('sk4', 'Miso Soup', 'Comforting dashi broth with tofu, wakame and spring onion.', 129, null, '🍜', { veg: true, cal: 90, mins: 8, rating: 4.5 }),
        d('sk5', 'Steamed Edamame', 'Warm soybeans tossed in sea salt and a hint of chilli.', 149, null, '🌱', { veg: true, cal: 120, mins: 8, rating: 4.3 })
      ]
    },
    {
      id: 'spice-route', name: 'Spice Route', category: 'indian', cuisine: 'North Indian · Curries · Biryani',
      pic: '1631452180519-c014fe946bc7', emoji: '🍛', rating: 4.5, reviews: '4.0k', time: '30–40 min', fee: 30, offer: 'Flat ₹60 OFF',
      menu: [
        d('sp1', 'Butter Chicken', 'Tandoori chicken simmered in a velvety tomato-butter gravy with kasuri methi.', 329, '1631452180519-c014fe946bc7', '🍛', { cal: 640, mins: 25, rating: 4.7, popular: true }),
        d('sp2', 'Paneer Tikka Masala', 'Char-grilled paneer cubes in a rich, smoky onion-tomato masala.', 289, '1589302168068-964664d93dc0', '🍛', { veg: true, cal: 590, mins: 22, rating: 4.6 }),
        d('sp3', 'Chicken Dum Biryani', 'Fragrant basmati slow-cooked with marinated chicken, saffron and spices.', 299, null, '🍚', { cal: 720, mins: 30, rating: 4.6 }),
        d('sp4', 'Garlic Butter Naan', 'Soft tandoor-baked bread brushed with garlic butter.', 49, null, '🍞', { veg: true, cal: 210, mins: 10, rating: 4.5 }),
        d('sp5', 'Gulab Jamun (2 pcs)', 'Warm milk dumplings soaked in cardamom-rose syrup.', 99, null, '🍮', { veg: true, cal: 280, mins: 5, rating: 4.6 })
      ]
    },
    {
      id: 'green-bowl', name: 'Green Bowl Kitchen', category: 'healthy', cuisine: 'Salads · Bowls · Smoothies',
      pic: '1546069901-ba9599a7e63c', emoji: '🥗', rating: 4.4, reviews: '860', time: '15–20 min', fee: 0, offer: 'Free delivery',
      menu: [
        d('gb1', 'Quinoa Power Bowl', 'Quinoa, roasted chickpeas, avocado, kale and lemon-tahini dressing.', 249, '1546069901-ba9599a7e63c', '🥗', { veg: true, cal: 430, mins: 12, rating: 4.6, popular: true }),
        d('gb2', 'Greek Salad', 'Cucumber, tomato, olives and feta with oregano and olive oil.', 199, '1540420773420-3366772f4999', '🥗', { veg: true, cal: 260, mins: 8, rating: 4.4 }),
        d('gb3', 'Avocado Toast', 'Multigrain sourdough with smashed avocado, cherry tomatoes and seeds.', 179, '1482049016688-2d3e1b311543', '🍞', { veg: true, cal: 340, mins: 10, rating: 4.5 }),
        d('gb4', 'Fresh Orange Juice', 'Cold-pressed oranges, nothing added.', 99, null, '🍊', { veg: true, cal: 110, mins: 5, rating: 4.5 }),
        d('gb5', 'Berry Protein Smoothie', 'Mixed berries, banana, yoghurt and a scoop of whey.', 159, null, '🍓', { veg: true, cal: 280, mins: 6, rating: 4.4 })
      ]
    },
    {
      id: 'sweet-tooth', name: 'Sweet Tooth Studio', category: 'desserts', cuisine: 'Desserts · Bakery · Ice cream',
      pic: '1565958011703-44f9829ba187', emoji: '🍰', rating: 4.9, reviews: '5.2k', time: '15–25 min', fee: 30, offer: 'Buy 1 get 1 shake',
      menu: [
        d('st1', 'Chocolate Lava Cake', 'Warm cocoa cake with a molten dark chocolate centre.', 169, '1565958011703-44f9829ba187', '🍫', { veg: true, cal: 450, mins: 14, rating: 4.9, popular: true }),
        d('st2', 'Glazed Donuts (4 pcs)', 'Fluffy ring donuts with vanilla glaze and sprinkles.', 149, '1551024601-bec78aea704b', '🍩', { veg: true, cal: 520, mins: 8, rating: 4.7 }),
        d('st3', 'Belgian Waffle', 'Crisp golden waffle with maple syrup, berries and cream.', 189, '1562376552-0d160a2f238d', '🧇', { veg: true, cal: 480, mins: 12, rating: 4.7 }),
        d('st4', 'Vanilla Ice Cream Sundae', 'Two scoops of Madagascar vanilla with chocolate sauce and nuts.', 129, '1563805042-7684c019e1cb', '🍨', { veg: true, cal: 330, mins: 6, rating: 4.6 }),
        d('st5', 'Fluffy Pancakes', 'Stack of buttermilk pancakes with honey and butter.', 159, '1567620905732-2d1ec7ab7445', '🥞', { veg: true, cal: 450, mins: 12, rating: 4.6 })
      ]
    },
    {
      id: 'big-smoke', name: 'Big Smoke Grill', category: 'burgers', cuisine: 'BBQ · Burgers · Wraps',
      pic: '1550547660-d9450f859349', emoji: '🍖', rating: 4.3, reviews: '780', time: '25–30 min', fee: 30, offer: '10% OFF',
      menu: [
        d('bs1', 'BBQ Bacon Burger', 'Flame-grilled beef patty, crispy bacon, onion rings and smoky BBQ glaze.', 249, '1550547660-d9450f859349', '🍔', { cal: 690, mins: 20, rating: 4.5, popular: true }),
        d('bs2', 'Smoky Chicken Wrap', 'Grilled chicken, charred peppers and chipotle yoghurt in a warm tortilla.', 169, null, '🌯', { cal: 480, mins: 15, rating: 4.3 }),
        d('bs3', 'Onion Rings', 'Beer-battered, golden and crunchy with a zesty dip.', 109, null, '🧅', { veg: true, cal: 330, mins: 10, rating: 4.2 }),
        d('bs4', 'Classic Cola Float', 'Ice-cold cola crowned with a scoop of vanilla ice cream.', 119, null, '🥤', { veg: true, cal: 260, mins: 5, rating: 4.4 })
      ]
    },
    {
      id: 'curry-leaf', name: 'Curry Leaf Kitchen', category: 'indian', cuisine: 'South Indian · Dosa · Thali',
      pic: '1589302168068-964664d93dc0', emoji: '🥘', rating: 4.6, reviews: '1.9k', time: '20–30 min', fee: 20, offer: 'Free filter coffee',
      menu: [
        d('cl1', 'Crispy Masala Dosa', 'Paper-thin rice crepe filled with spiced potato, served with chutneys and sambar.', 129, null, '🥘', { veg: true, cal: 410, mins: 15, rating: 4.7, popular: true }),
        d('cl2', 'Chicken Chettinad', 'Fiery pepper-roasted chicken curry with fresh ground spices and curry leaves.', 279, null, '🍗', { cal: 560, mins: 25, rating: 4.5 }),
        d('cl3', 'Veg Meals Thali', 'Rice, sambar, rasam, two poriyals, curd, papad and payasam.', 199, '1589302168068-964664d93dc0', '🍛', { veg: true, cal: 720, mins: 20, rating: 4.6 }),
        d('cl4', 'Filter Coffee', 'Strong South Indian decoction coffee with frothy milk.', 59, null, '☕', { veg: true, cal: 90, mins: 5, rating: 4.7 })
      ]
    }
  ];

  const ITEMS = {};
  RESTAURANTS.forEach(r => r.menu.forEach(m => { m.rid = r.id; ITEMS[m.id] = m; }));
  const REST = id => RESTAURANTS.find(r => r.id === id);

  const ADDRESSES = [
    { id: 'home', icon: '🏠', title: 'Home', text: '12 Orchard Lane, Greenfield · 560001' },
    { id: 'work', icon: '🏢', title: 'Work', text: 'Tower B, 5th Floor, Tech Park Road · 560066' }
  ];
  const PAYMENTS = [
    { id: 'upi', icon: '📲', title: 'UPI', text: 'Pay with GPay, PhonePe or Paytm' },
    { id: 'card', icon: '💳', title: 'Credit / Debit card', text: 'Visa, Mastercard, RuPay' },
    { id: 'cod', icon: '💵', title: 'Cash on delivery', text: 'Pay when your food arrives' }
  ];
  const FREE_AT = 499;
  const TAX_RATE = 0.05;
  const STEPS = ['Order confirmed', 'Preparing your food', 'Out for delivery', 'Delivered'];

  /* ---------- state ---------- */
  const state = {
    cart: [], cartRid: null,
    category: 'all', query: '',
    stack: ['home'], current: 'home',
    restaurantId: null, itemId: null, qty: 1,
    address: 'home', payment: 'upi',
    lastOrder: null, stage: 0
  };
  let trackTimers = [];
  let pending = null;
  let toastTimer = null;

  const KEY = 'quickbite_cart_v1';
  function saveCart() { try { localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, rid: state.cartRid })); } catch (e) { /* storage may be blocked */ } }
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && Array.isArray(raw.cart)) {
        state.cart = raw.cart.filter(l => ITEMS[l.id] && l.qty > 0).map(l => ({ id: l.id, qty: Math.min(10, l.qty) }));
        state.cartRid = state.cart.length ? ITEMS[state.cart[0].id].rid : null;
      }
    } catch (e) { /* ignore */ }
  }

  function totals() {
    const count = state.cart.reduce((s, l) => s + l.qty, 0);
    const subtotal = state.cart.reduce((s, l) => s + ITEMS[l.id].price * l.qty, 0);
    const fee = state.cartRid ? REST(state.cartRid).fee : 0;
    const delivery = subtotal === 0 || subtotal >= FREE_AT ? 0 : fee;
    const tax = Math.round(subtotal * TAX_RATE);
    return { count, subtotal, delivery, tax, total: subtotal + delivery + tax };
  }

  /* ---------- media (photo with emoji fallback) ---------- */
  const hue = s => 18 + ([...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 28);
  const media = (pic, emoji, key) =>
    `<div class="media" style="background:linear-gradient(135deg,hsl(${hue(key)} 95% 90%),hsl(${hue(key)} 95% 74%))">` +
    `<span class="media-emoji">${emoji}</span>` +
    (pic ? `<img src="${photo(pic)}" alt="" loading="lazy" onload="this.style.opacity=1" onerror="this.remove()">` : '') +
    `</div>`;

  /* ---------- navigation ---------- */
  const screens = {};
  $$('.screen').forEach(s => { screens[s.id.replace('screen-', '')] = s; });
  const NAV_SCREENS = new Set(['home', 'cart', 'confirm']);
  const TAB_OF = { home: 'home', restaurant: 'home', item: 'home', cart: 'cart', checkout: 'cart', confirm: 'track' };
  const onEnter = { cart: () => renderCart(), checkout: () => renderCheckout(), confirm: () => renderConfirm() };

  function show(name, dir) {
    if (name === state.current) return;
    const next = screens[name], prev = screens[state.current];
    if (onEnter[name]) onEnter[name]();
    next.classList.add('no-anim');
    next.classList.remove('active');
    next.classList.toggle('left', dir === 'back');
    void next.offsetWidth; // commit starting position without animating
    next.classList.remove('no-anim');
    prev.classList.remove('active');
    prev.classList.toggle('left', dir === 'forward');
    next.classList.remove('left');
    next.classList.add('active');
    if (dir === 'forward') $('.scroll', next).scrollTop = 0;
    state.current = name;
    $('#bottomNav').classList.toggle('hidden', !NAV_SCREENS.has(name));
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === TAB_OF[name]));
  }
  function navigate(name) {
    if (state.stack[state.stack.length - 1] === name) return;
    state.stack.push(name);
    show(name, 'forward');
  }
  function goBack() {
    if (state.stack.length < 2) return;
    state.stack.pop();
    show(state.stack[state.stack.length - 1], 'back');
  }
  function setStack(stack, dir) {
    state.stack = stack;
    show(stack[stack.length - 1], dir);
  }
  function navTab(tab) {
    hideToast();
    if (tab === 'home') {
      if (state.current === 'home') $('#screen-home .scroll').scrollTo({ top: 0, behavior: 'smooth' });
      else setStack(['home'], 'back');
    } else if (tab === 'cart') {
      if (state.current !== 'cart') setStack(['home', 'cart'], 'forward');
    } else if (tab === 'track') {
      if (state.lastOrder) { if (state.current !== 'confirm') setStack(['home', 'confirm'], 'forward'); }
      else toast('No orders yet — place one from your cart!', { icon: 'i' });
    }
  }

  /* ---------- toast + modal ---------- */
  function toast(msg, opts = {}) {
    const t = $('#toast');
    t.innerHTML =
      `<div class="t-msg"><span class="t-check ${opts.tone === 'warn' ? 'warn' : ''}">${opts.icon || '✓'}</span><span>${esc(msg)}</span></div>` +
      (opts.action ? `<button data-action="go" data-go="cart">View cart</button>` : '');
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, opts.ms || 2600);
  }
  function hideToast() { $('#toast').classList.remove('show'); }

  const modal = $('#modal');
  const modalOpen = () => modal.classList.contains('open');
  function openModal(newName) {
    $('#modalText').textContent = `Your cart has items from ${REST(state.cartRid).name}. Adding from ${newName} will clear your current cart.`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* ---------- cart logic ---------- */
  function flash(btn) {
    if (!btn) return;
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 1300);
  }
  function addToCart(id, qty, btn) {
    const it = ITEMS[id];
    if (state.cart.length && state.cartRid !== it.rid) {
      pending = { id, qty, btn };
      openModal(REST(it.rid).name);
      return false;
    }
    state.cartRid = it.rid;
    const line = state.cart.find(l => l.id === id);
    if (line) line.qty = Math.min(10, line.qty + qty); else state.cart.push({ id, qty });
    saveCart();
    updateCartUI(true);
    flash(btn);
    toast(`${qty > 1 ? qty + ' × ' : ''}${it.name} added`, { action: true });
    return true;
  }
  function removeLine(id) {
    const it = ITEMS[id];
    state.cart = state.cart.filter(l => l.id !== id);
    if (!state.cart.length) state.cartRid = null;
    saveCart();
    updateCartUI();
    renderCart();
    toast(`${it.name} removed`, { icon: '✕', tone: 'warn' });
  }
  function animateRemove(id) {
    const row = $(`[data-row="${id}"]`);
    if (!row) return removeLine(id);
    if (row.classList.contains('removing')) return;
    row.classList.add('removing');
    setTimeout(() => removeLine(id), 340);
  }
  function changeQty(id, delta) {
    const line = state.cart.find(l => l.id === id);
    if (!line) return;
    if (delta < 0 && line.qty === 1) return animateRemove(id);
    line.qty = Math.max(1, Math.min(10, line.qty + delta));
    saveCart();
    updateCartUI();
    renderCart();
  }

  function updateCartUI(bump) {
    const { count } = totals();
    $$('[data-cart-count]').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hide', count === 0);
      if (bump && count) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
    renderCartBar();
  }
  function renderCartBar() {
    const wrap = $('#restCartBar');
    const t = totals();
    if (!t.count || state.restaurantId !== state.cartRid) { wrap.innerHTML = ''; return; }
    const html = `<span>${t.count} item${t.count > 1 ? 's' : ''}<small>${esc(REST(state.cartRid).name)}</small></span>` +
      `<span class="go">View cart · ${money(t.subtotal)} <span class="ic">${ICON.cart}</span></span>`;
    const bar = $('.cart-bar', wrap);
    if (bar) bar.innerHTML = html;
    else wrap.innerHTML = `<button class="cart-bar" data-action="go" data-go="cart">${html}</button>`;
  }

  /* ---------- renderers ---------- */
  function renderCategories() {
    $('#categoryList').innerHTML = CATEGORIES.map(c =>
      `<button class="chip ${state.category === c.id ? 'active' : ''}" data-action="cat" data-id="${c.id}"><span>${c.emoji}</span>${c.name}</button>`).join('');
  }
  function renderTrending() {
    const items = Object.values(ITEMS).filter(i => i.popular);
    $('#trendingList').innerHTML = items.map(it =>
      `<div class="tcard" role="button" tabindex="0" data-action="open-item" data-id="${it.id}">` +
      `<div class="timg">${media(it.pic, it.emoji, it.id)}</div>` +
      `<div class="tbody"><h3>${esc(it.name)}</h3><p>${esc(REST(it.rid).name)}</p><div class="tprice">${money(it.price)}</div></div></div>`).join('');
  }
  function renderRestaurants() {
    const q = state.query.trim().toLowerCase();
    const list = RESTAURANTS.filter(r =>
      (state.category === 'all' || r.category === state.category) &&
      (!q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.menu.some(m => m.name.toLowerCase().includes(q))));
    $('#resCount').textContent = `${list.length} place${list.length === 1 ? '' : 's'}`;
    $('#trendingWrap').hidden = !!q || state.category !== 'all';
    $('#restaurantList').innerHTML = list.length ? list.map((r, i) =>
      `<article class="rcard" role="button" tabindex="0" data-action="open-restaurant" data-id="${r.id}" style="animation-delay:${i * 60}ms">` +
      `<div class="rimg">${media(r.pic, r.emoji, r.id)}<span class="offer">${esc(r.offer)}</span><span class="rating"><b>★</b> ${r.rating} <span class="muted">(${r.reviews})</span></span></div>` +
      `<div class="rbody"><h3>${esc(r.name)}</h3><p class="cuisine">${esc(r.cuisine)}</p>` +
      `<div class="meta"><span><span class="ic">${ICON.clock}</span>${r.time}</span><span>🛵 ${r.fee ? money(r.fee) + ' delivery' : 'Free delivery'}</span></div></div></article>`).join('')
      : `<div class="empty"><div class="big">🔍</div><h3>No matches found</h3><p>Try a different dish, cuisine or category.</p><button class="btn ghost" data-action="clear-filters">Clear filters</button></div>`;
  }

  function renderRestaurant() {
    const r = REST(state.restaurantId);
    $('#restaurantContent').innerHTML =
      `<div class="hero">${media(r.pic, r.emoji, r.id)}<div class="hero-shade"></div>` +
      `<button class="icon-btn float-l" data-action="back" aria-label="Back">${ICON.back}</button>` +
      `<button class="icon-btn float-r" data-action="go" data-go="cart" aria-label="Open cart">${ICON.cart}<span class="badge" data-cart-count>0</span></button></div>` +
      `<div class="info-card"><h1>${esc(r.name)}</h1><p class="cuisine">${esc(r.cuisine)}</p>` +
      `<div class="stats"><div class="stat"><b>★ ${r.rating}</b><span>${r.reviews} ratings</span></div>` +
      `<div class="stat"><b>${r.time}</b><span>Delivery time</span></div>` +
      `<div class="stat"><b>${r.fee ? money(r.fee) : 'Free'}</b><span>Delivery fee</span></div></div></div>` +
      `<h2 class="section-title">Menu <small>${r.menu.length} items</small></h2>` +
      `<div class="menu">${r.menu.map((m, i) =>
        `<div class="mrow" role="button" tabindex="0" data-action="open-item" data-id="${m.id}" style="animation-delay:${i * 55}ms">` +
        `<div class="mrow-text"><span class="vegdot ${m.veg ? '' : 'nonveg'}" title="${m.veg ? 'Vegetarian' : 'Non-vegetarian'}"></span>` +
        `<h3>${esc(m.name)}</h3><p class="desc">${esc(m.desc)}</p><div class="price">${money(m.price)}</div></div>` +
        `<div class="mrow-media">${media(m.pic, m.emoji, m.id)}` +
        `<button class="quick-add has-ok" data-action="quick-add" data-id="${m.id}" aria-label="Add ${esc(m.name)} to cart"><span class="lbl">ADD +</span><span class="ok">✓ ADDED</span></button></div></div>`).join('')}</div>`;
    updateCartUI();
  }

  function renderItem(id) {
    const it = ITEMS[id], r = REST(it.rid);
    state.itemId = id; state.qty = 1;
    $('#itemContent').innerHTML =
      `<div class="hero tall">${media(it.pic, it.emoji, it.id)}<div class="hero-shade"></div>` +
      `<button class="icon-btn float-l" data-action="back" aria-label="Back">${ICON.back}</button>` +
      `<button class="icon-btn float-r" data-action="go" data-go="cart" aria-label="Open cart">${ICON.cart}<span class="badge" data-cart-count>0</span></button></div>` +
      `<div class="sheet"><div class="row-between"><h1>${esc(it.name)}</h1><span class="price-lg">${money(it.price)}</span></div>` +
      `<p class="from muted">from <b>${esc(r.name)}</b></p>` +
      `<div class="tags"><span class="tag"><span class="vegdot ${it.veg ? '' : 'nonveg'}"></span>${it.veg ? 'Veg' : 'Non-veg'}</span>` +
      `<span class="tag">★ ${it.rating}</span><span class="tag">⏱ ${it.mins} min</span><span class="tag">🔥 ${it.cal} kcal</span></div>` +
      `<p class="desc-lg">${esc(it.desc)}</p>` +
      `<h3>Quantity</h3><div class="stepper lg"><button id="itemDec" data-action="item-dec" aria-label="Decrease quantity" disabled>${ICON.minus}</button>` +
      `<span id="itemQty">1</span><button data-action="item-inc" aria-label="Increase quantity">${ICON.plus}</button></div></div>`;
    $('#itemFooter').innerHTML =
      `<button class="btn primary block has-ok" id="addMain" data-action="add-item"><span class="lbl">Add to cart · <span id="itemTotal">${money(it.price)}</span></span><span class="ok">✓ Added to cart</span></button>`;
    updateCartUI();
  }
  function setItemQty(n) {
    state.qty = Math.max(1, Math.min(10, n));
    const q = $('#itemQty');
    q.textContent = state.qty;
    q.classList.remove('pop'); void q.offsetWidth; q.classList.add('pop');
    $('#itemTotal').textContent = money(ITEMS[state.itemId].price * state.qty);
    $('#itemDec').disabled = state.qty <= 1;
  }

  function summaryRows(t, extra = '') {
    return `<div class="sum-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>` +
      `<div class="sum-row"><span>Delivery fee</span>${t.delivery ? `<span>${money(t.delivery)}</span>` : '<span class="free">FREE</span>'}</div>` +
      `<div class="sum-row"><span>GST (5%)</span><span>${money(t.tax)}</span></div>` +
      `<div class="sum-row total"><span>${extra || 'Total'}</span><span>${money(t.total)}</span></div>`;
  }

  function renderCart() {
    const box = $('#cartContent');
    const t = totals();
    if (!t.count) {
      box.innerHTML = `<div class="empty"><div class="big">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven’t added anything yet. Hungry? Let’s fix that!</p><button class="btn primary" data-action="nav" data-tab="home">Browse restaurants</button></div>`;
      return;
    }
    const r = REST(state.cartRid);
    const remain = Math.max(0, FREE_AT - t.subtotal);
    const pct = Math.min(100, (t.subtotal / FREE_AT) * 100);
    box.innerHTML =
      `<div style="margin:8px 20px 0"><p class="muted tiny">Ordering from</p><p style="font-weight:700;color:var(--ink)">${esc(r.name)}</p></div>` +
      `<div class="clist">${state.cart.map(l => {
        const it = ITEMS[l.id];
        return `<div class="crow" data-row="${it.id}"><div class="cimg">${media(it.pic, it.emoji, it.id)}</div>` +
          `<div class="cinfo"><div class="crow-top"><div style="min-width:0"><h3>${esc(it.name)}</h3><p class="sub">${money(it.price)} each</p></div>` +
          `<button class="remove-btn" data-action="cart-remove" data-id="${it.id}" aria-label="Remove ${esc(it.name)}">${ICON.trash}</button></div>` +
          `<div class="crow-bottom"><div class="stepper"><button data-action="cart-dec" data-id="${it.id}" aria-label="Decrease quantity">${ICON.minus}</button>` +
          `<span>${l.qty}</span><button data-action="cart-inc" data-id="${it.id}" aria-label="Increase quantity">${ICON.plus}</button></div>` +
          `<span class="line-price">${money(it.price * l.qty)}</span></div></div></div>`;
      }).join('')}</div>` +
      `<div class="free-note">${remain > 0 ? `Add <b>${money(remain)}</b> more for <b>free delivery</b>` : '🎉 You’ve unlocked <b>free delivery</b>!'}<div class="progress"><i style="width:${pct}%"></i></div></div>` +
      `<div class="summary"><h3>Bill details</h3>${summaryRows(t, 'To pay')}</div>` +
      `<div class="cta-wrap"><button class="btn primary block" data-action="checkout">Proceed to checkout · ${money(t.total)}</button></div>`;
  }

  function renderCheckout() {
    const t = totals();
    const content = $('#checkoutContent'), footer = $('#checkoutFooter');
    if (!t.count) {
      content.innerHTML = `<div class="empty"><div class="big">🧾</div><h3>Nothing to check out</h3><p>Add something tasty to your cart first.</p><button class="btn primary" data-action="nav" data-tab="home">Browse restaurants</button></div>`;
      footer.innerHTML = '';
      return;
    }
    const opt = (kind, o) =>
      `<div class="opt ${state[kind] === o.id ? 'selected' : ''}" role="button" tabindex="0" data-action="pick-${kind === 'address' ? 'address' : 'pay'}" data-id="${o.id}">` +
      `<span class="oicon">${o.icon}</span><div class="otext"><b>${o.title}</b><span>${o.text}</span></div><span class="radio"></span>` +
      (kind === 'payment' && o.id === 'upi' ? `<div class="opt-fields"><input class="field" id="upiId" placeholder="yourname@upi" autocomplete="off" inputmode="email"><p class="err" id="errUpi">Enter a valid UPI ID, e.g. name@upi</p></div>` : '') +
      (kind === 'payment' && o.id === 'card' ? `<div class="opt-fields"><input class="field" id="cardNo" placeholder="Card number" inputmode="numeric" maxlength="19" autocomplete="off"><div class="row2"><input class="field" id="cardExp" placeholder="MM/YY" inputmode="numeric" maxlength="5" autocomplete="off"><input class="field" id="cardCvv" placeholder="CVV" inputmode="numeric" maxlength="3" type="password" autocomplete="off"></div><p class="err" id="errCard">Check the card number (16 digits), expiry (MM/YY) and CVV (3 digits).</p><p class="note">🔒 Prototype only — please don’t enter real card details.</p></div>` : '') +
      `</div>`;
    content.innerHTML =
      `<div class="section" style="margin-top:6px"><span class="eta-pill">🛵 Estimated delivery · 25–30 min</span></div>` +
      `<div class="section"><h2>Delivery address</h2>${ADDRESSES.map(a => opt('address', a)).join('')}` +
      `<div class="opt ${state.address === 'new' ? 'selected' : ''}" role="button" tabindex="0" data-action="pick-address" data-id="new"><span class="oicon">➕</span><div class="otext"><b>Add new address</b><span>Deliver somewhere else</span></div><span class="radio"></span>` +
      `<div class="opt-fields"><textarea class="field" id="newAddress" placeholder="House no., street, area, pincode"></textarea><p class="err" id="errAddress">Please enter a complete address.</p></div></div></div>` +
      `<div class="section"><h2>Payment method</h2>${PAYMENTS.map(p => opt('payment', p)).join('')}</div>` +
      `<div class="summary"><h3>Order summary · ${esc(REST(state.cartRid).name)}</h3>` +
      state.cart.map(l => `<div class="sum-row"><span>${l.qty} × ${esc(ITEMS[l.id].name)}</span><span>${money(ITEMS[l.id].price * l.qty)}</span></div>`).join('') +
      `<div style="border-top:1px dashed var(--line);margin:6px 0"></div>${summaryRows(t, 'To pay')}</div><div style="height:16px"></div>`;
    footer.innerHTML = `<button class="btn primary block" id="placeBtn" data-action="place-order">Place order · ${money(t.total)}</button>`;
  }

  function validate() {
    $$('#checkoutContent .err').forEach(e => e.classList.remove('show'));
    $$('#checkoutContent .field').forEach(f => f.classList.remove('invalid'));
    let first = null;
    const bad = (inputId, errId) => {
      const i = $('#' + inputId);
      if (i) i.classList.add('invalid');
      $('#' + errId).classList.add('show');
      if (!first) first = i;
    };
    if (state.address === 'new' && $('#newAddress').value.trim().length < 10) bad('newAddress', 'errAddress');
    if (state.payment === 'upi' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test($('#upiId').value.trim())) bad('upiId', 'errUpi');
    if (state.payment === 'card') {
      const n = $('#cardNo').value.replace(/\s/g, ''), ex = $('#cardExp').value, cv = $('#cardCvv').value;
      if (!/^\d{16}$/.test(n)) bad('cardNo', 'errCard');
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(ex)) bad('cardExp', 'errCard');
      else if (!/^\d{3}$/.test(cv)) bad('cardCvv', 'errCard');
    }
    if (first) { first.focus(); first.scrollIntoView({ block: 'center', behavior: 'smooth' }); return false; }
    return true;
  }

  function placeOrder() {
    const btn = $('#placeBtn');
    if (!validate()) {
      btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
      toast('Please fix the highlighted fields', { icon: '!', tone: 'warn' });
      return;
    }
    const t = totals();
    const addrObj = state.address === 'new'
      ? { title: 'New address', text: $('#newAddress').value.trim() }
      : ADDRESSES.find(a => a.id === state.address);
    let payment = 'Cash on delivery';
    if (state.payment === 'upi') payment = 'UPI · ' + $('#upiId').value.trim();
    if (state.payment === 'card') payment = 'Card ending ' + $('#cardNo').value.replace(/\s/g, '').slice(-4);
    const order = {
      id: 'QB' + (1000 + Math.floor(Math.random() * 9000)),
      restaurant: REST(state.cartRid).name,
      lines: state.cart.map(l => ({ id: l.id, qty: l.qty })),
      totals: t, address: `${addrObj.title} — ${addrObj.text}`, payment,
      eta: '25–30 min'
    };
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span> Placing order…';
    setTimeout(() => {
      state.lastOrder = order;
      state.cart = []; state.cartRid = null;
      saveCart();
      updateCartUI();
      startTracking();
      setStack(['home', 'confirm'], 'forward');
    }, 1400);
  }

  function startTracking() {
    trackTimers.forEach(clearTimeout);
    state.stage = 0;
    trackTimers = [4000, 9000, 15000].map((ms, i) => setTimeout(() => { state.stage = i + 1; paintStage(); }, ms));
  }
  function paintStage() {
    const lis = $$('#tracker li');
    lis.forEach((li, i) => {
      li.classList.toggle('done', i < state.stage || (state.stage === 3 && i === 3));
      li.classList.toggle('current', i === state.stage && state.stage < 3);
    });
  }

  function renderConfirm() {
    const box = $('#confirmContent');
    const o = state.lastOrder;
    if (!o) {
      box.innerHTML = `<div class="empty"><div class="big">🍽️</div><h3>No orders yet</h3><p>Your confirmed orders will show up here.</p><button class="btn primary" data-action="nav" data-tab="home">Order something</button></div>`;
      return;
    }
    box.innerHTML =
      `<div class="success"><div class="check-circle">${ICON.check}</div><h1>Order confirmed!</h1><p>${esc(o.restaurant)} is getting your food ready.</p></div>` +
      `<div class="order-card"><div class="order-top"><div><small>Order ID</small><b>#${o.id}</b></div><div class="eta"><small>Arriving in</small><b>${o.eta}</b></div></div>` +
      `<ul class="tracker" id="tracker">${STEPS.map(s => `<li>${s}</li>`).join('')}</ul></div>` +
      `<div class="summary"><h3>Order summary</h3>` +
      o.lines.map(l => `<div class="sum-row"><span>${l.qty} × ${esc(ITEMS[l.id].name)}</span><span>${money(ITEMS[l.id].price * l.qty)}</span></div>`).join('') +
      `<div style="border-top:1px dashed var(--line);margin:6px 0"></div>${summaryRows(o.totals, 'Total paid')}` +
      `<div class="sum-row" style="margin-top:8px"><span class="muted">Payment</span><span style="text-align:right">${esc(o.payment)}</span></div>` +
      `<div class="sum-row"><span class="muted">Delivering to</span><span style="text-align:right;max-width:60%">${esc(o.address)}</span></div></div>` +
      `<div class="confirm-actions"><button class="btn primary block" data-action="nav" data-tab="home">Back to home</button>` +
      `<button class="btn ghost block" data-action="reorder">Order again</button></div>`;
    paintStage();
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const id = el.dataset.id;
    switch (el.dataset.action) {
      case 'go': hideToast(); navigate(el.dataset.go); break;
      case 'back': goBack(); break;
      case 'nav': navTab(el.dataset.tab); break;
      case 'cat':
        state.category = id;
        $$('.chip').forEach(c => c.classList.toggle('active', c.dataset.id === id));
        renderRestaurants();
        break;
      case 'clear-filters':
        state.query = ''; state.category = 'all';
        $('#searchInput').value = '';
        renderCategories(); renderRestaurants();
        break;
      case 'open-restaurant': state.restaurantId = id; renderRestaurant(); navigate('restaurant'); break;
      case 'open-item': renderItem(id); navigate('item'); break;
      case 'quick-add': addToCart(id, 1, el); break;
      case 'item-inc': setItemQty(state.qty + 1); break;
      case 'item-dec': setItemQty(state.qty - 1); break;
      case 'add-item': addToCart(state.itemId, state.qty, el); break;
      case 'cart-inc': changeQty(id, +1); break;
      case 'cart-dec': changeQty(id, -1); break;
      case 'cart-remove': animateRemove(id); break;
      case 'checkout': navigate('checkout'); break;
      case 'pick-address':
        state.address = id;
        $$('[data-action="pick-address"]').forEach(o => o.classList.toggle('selected', o.dataset.id === id));
        break;
      case 'pick-pay':
        state.payment = id;
        $$('[data-action="pick-pay"]').forEach(o => o.classList.toggle('selected', o.dataset.id === id));
        break;
      case 'place-order': placeOrder(); break;
      case 'reorder':
        if (state.lastOrder) {
          state.cart = state.lastOrder.lines.map(l => ({ id: l.id, qty: l.qty }));
          state.cartRid = ITEMS[state.cart[0].id].rid;
          saveCart(); updateCartUI(true);
          setStack(['home', 'cart'], 'forward');
          toast('Items added back to your cart');
        }
        break;
      case 'modal-cancel': pending = null; closeModal(); break;
      case 'modal-confirm': {
        const p = pending;
        state.cart = []; state.cartRid = null;
        closeModal(); pending = null;
        if (p) addToCart(p.id, p.qty, p.btn);
        break;
      }
    }
  });

  document.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'searchInput') { state.query = t.value; renderRestaurants(); return; }
    if (t.id === 'cardNo') t.value = t.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    if (t.id === 'cardExp') {
      let v = t.value.replace(/\D/g, '').slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      t.value = v;
    }
    if (t.id === 'cardCvv') t.value = t.value.replace(/\D/g, '').slice(0, 3);
    if (t.classList && t.classList.contains('field')) t.classList.remove('invalid');
  });

  document.addEventListener('keydown', e => {
    const t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t.matches && t.matches('[role="button"][data-action]')) {
      e.preventDefault();
      t.click();
    } else if (e.key === 'Escape') {
      if (modalOpen()) { pending = null; closeModal(); }
      else if (!(t.matches && t.matches('input, textarea'))) goBack();
    }
  });

  /* ---------- init ---------- */
  $$('[data-icon]').forEach(el => { el.innerHTML = ICON[el.dataset.icon]; });
  loadCart();
  renderCategories();
  renderTrending();
  renderRestaurants();
  updateCartUI();
})();
