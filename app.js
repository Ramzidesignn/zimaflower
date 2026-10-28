const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const icon = (id, cls = 'ic') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
const toman = p => fa(Math.round(p / 1000).toLocaleString('en')) + ' هزار تومان';

const toast = (() => {
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t);
  let h; return m => { t.textContent = m; t.classList.add('on'); clearTimeout(h); h = setTimeout(() => t.classList.remove('on'), 2200); };
})();
let cartCount = 0;
const bumpCart = name => { cartCount++; $('#cartN').textContent = fa(cartCount); toast(`«${name}» به سبد اضافه شد`); };

/* ===== Sample data (preview only — real site reads WooCommerce stock) ===== */
const products = [
  { name: 'کوزه‌ی هلو', img: 'p18.jpg', price: 2400000, tags: ['birthday', 'congrats', 'nothing'], cat: 'کوزه‌های زیما' },
  { name: 'شیشه‌ی سفید آرام', img: 'p13.jpg', price: 1800000, tags: ['sorry', 'condolence', 'nothing'], cat: 'شیشه‌های زیما' },
  { name: 'یاسی بلند', img: 'p15.jpg', price: 3200000, tags: ['love', 'birthday'], cat: 'شیشه‌های زیما' },
  { name: 'تور صورتی', img: 'p19.jpg', price: 950000, tags: ['love', 'birthday', 'sorry'], cat: 'دسته‌گل یک‌طرفه' },
  { name: 'نارنجی آفتاب', img: 'p20.jpg', price: 2700000, tags: ['congrats', 'birthday', 'nothing'], cat: 'کوزه‌های زیما' },
  { name: 'رزهای Flower', img: 'p21.jpg', price: 3900000, tags: ['love', 'congrats', 'sorry'], cat: 'رز' },
];
const stems = [
  { id: 'rr', name: 'رز هلندی قرمز', price: 140000, stock: 24, color: '#B3123A' },
  { id: 'rp', name: 'رز صورتی', price: 120000, stock: 18, color: '#EE9DB4' },
  { id: 'rw', name: 'رز سفید', price: 120000, stock: 9, color: '#F4EFE6' },
  { id: 'li', name: 'لیسیانتوس یاسی', price: 95000, stock: 15, color: '#A58BD6' },
  { id: 'an', name: 'آنتوریوم نارنجی', price: 160000, stock: 6, color: '#E8642C' },
  { id: 'sf', name: 'آفتابگردان', price: 110000, stock: 7, color: '#F2B81B' },
  { id: 'or', name: 'ارکیده سفید', price: 280000, stock: 4, color: '#FFFFFF' },
  { id: 'gy', name: 'ژیپسوفیلا (عروس)', price: 70000, stock: 20, color: '#EDEAF4' },
];
const papers = [
  { id: 'kraft', name: 'کرافت', price: 60000, color: '#C9A47A' },
  { id: 'tulle', name: 'توری سفید', price: 90000, color: '#FAFAF7' },
  { id: 'zima', name: 'آبی زیما', price: 80000, color: '#2326A6' },
  { id: 'black', name: 'مشکی مات', price: 80000, color: '#1C1C1E' },
  { id: 'pink', name: 'صورتی پودری', price: 80000, color: '#F2C9D2' },
  { id: 'vase', name: 'کوزه‌ی سفالی', price: 350000, color: '#D9C6A5' },
];
const ribbons = [
  { id: 'none', name: 'بدون روبان', price: 0, color: 'transparent' },
  { id: 'satin', name: 'ساتن سفید', price: 40000, color: '#FFFFFF' },
  { id: 'velvet', name: 'مخمل سرمه‌ای', price: 55000, color: '#1B1E5E' },
  { id: 'jute', name: 'کنفی', price: 30000, color: '#B8956A' },
];
const extras = [
  { id: 'leaf', name: 'برگ اکالیپتوس', price: 60000, icon: 'flower' },
  { id: 'pearl', name: 'مروارید تزئینی', price: 45000, icon: 'sparkle' },
  { id: 'choc', name: 'شکلات', price: 180000, icon: 'sparkle' },
];
const cards = [
  { id: 'none', name: 'بدون کارت', price: 0, icon: 'x' },
  { id: 'post', name: 'کارت پستال', price: 50000, icon: 'card' },
  { id: 'voice', name: 'کارت صوتی QR', price: 90000, icon: 'mic' },
];

/* ===== Shop ===== */
$('#grid').innerHTML = products.map((p, i) => `
  <article class="prod">
    <figure><span class="prod__tag">${p.cat}</span><img src="img/${p.img}" alt="${p.name} — ${p.cat} زیما فلاور" loading="lazy"></figure>
    <div class="prod__meta"><h3>${p.name}</h3><span>${toman(p.price)} (نمونه)</span>
      <button class="icon-btn" data-i="${i}" aria-label="افزودن ${p.name} به سبد">${icon('plus')}</button></div>
  </article>`).join('');
$('#grid').addEventListener('click', e => { const b = e.target.closest('.icon-btn'); if (b) bumpCart(products[b.dataset.i].name); });

/* ===== Finder ===== */
const budgets = { 1: [0, 1000000], 2: [1000000, 3000000], 3: [3000000, 1e12] };
function runFinder() {
  const why = $('#fWhy').value, [lo, hi] = budgets[$('#fBudget').value];
  const inB = p => p.price >= lo && p.price < hi;
  let res = products.filter(p => p.tags.includes(why) && inB(p));
  if (!res.length) res = products.filter(inB);
  if (!res.length) res = products.filter(p => p.tags.includes(why));
  $('#finderOut').innerHTML = res.slice(0, 3).map(p => `
    <div class="pick"><img src="img/${p.img}" alt="${p.name}"><div><b>${p.name}</b><small>${toman(p.price)}</small></div>
    <button class="icon-btn" type="button" data-n="${p.name}" aria-label="افزودن ${p.name}">${icon('plus')}</button></div>`).join('');
  const who = $('#fWho').value, whyTxt = $('#fWhy').selectedOptions[0].text;
  $('#cardMsg').innerHTML = `برای ${who}،<br>${why === 'nothing' ? 'بی‌هیچ بهانه‌ای.' : 'به مناسبت ' + whyTxt + '.'}`;
}
$('#finder').addEventListener('change', runFinder);
$('#finderOut').addEventListener('click', e => { const b = e.target.closest('[data-n]'); if (b) bumpCart(b.dataset.n); });
runFinder();

/* ===== Builder ===== */
const order = { qty: {}, paper: 'kraft', ribbon: 'satin', extras: new Set(), card: 'post' };

$$('.tabs button').forEach(t => t.addEventListener('click', () => {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', b === t));
  $$('.panel').forEach(p => p.hidden = p.dataset.p !== t.dataset.s);
}));

$('#stock').innerHTML = stems.map(s => `
  <li class="stem" data-id="${s.id}">
    <span class="stem__dot" style="background:${s.color};${s.color === '#FFFFFF' ? 'box-shadow:inset 0 0 0 1px var(--line)' : ''}">${icon('flower')}</span>
    <div><b>${s.name}</b><small>${toman(s.price)} · <span class="left">${fa(s.stock)}</span> شاخه موجود</small></div>
    <div class="qty"><button type="button" data-d="1" aria-label="یک شاخه بیشتر">${icon('plus')}</button><output>۰</output><button type="button" data-d="-1" aria-label="یک شاخه کمتر" disabled>${icon('minus')}</button></div>
  </li>`).join('');
$('#stock').addEventListener('click', e => {
  const b = e.target.closest('button[data-d]'); if (!b) return;
  const li = b.closest('.stem'), s = stems.find(x => x.id === li.dataset.id);
  const q = Math.min(s.stock, Math.max(0, (order.qty[s.id] || 0) + +b.dataset.d));
  order.qty[s.id] = q;
  li.querySelector('output').textContent = fa(q);
  li.querySelector('.left').textContent = fa(s.stock - q);
  li.querySelector('[data-d="1"]').disabled = q >= s.stock;
  li.querySelector('[data-d="-1"]').disabled = q <= 0;
  li.classList.toggle('on', q > 0);
  update();
});

const swatchGroup = (el, list, key) => {
  $(el).setAttribute('role', 'radiogroup');
  $(el).innerHTML = list.map(x => `<button type="button" class="sw" role="radio" aria-checked="${order[key] === x.id}" data-id="${x.id}">
    <i style="background:${x.color === 'transparent' ? 'repeating-linear-gradient(45deg,#fff 0 6px,#eee 6px 12px)' : x.color}"></i>${x.name}<small>${x.price ? toman(x.price) : 'رایگان'}</small></button>`).join('');
  $(el).addEventListener('click', e => {
    const b = e.target.closest('.sw'); if (!b) return;
    order[key] = b.dataset.id;
    $$(el + ' .sw').forEach(s => s.setAttribute('aria-checked', s === b)); update();
  });
};
swatchGroup('#papers', papers, 'paper');
swatchGroup('#ribbons', ribbons, 'ribbon');

$('#extras').innerHTML = extras.map(x => `<button type="button" class="chip" aria-pressed="false" data-id="${x.id}">${icon(x.icon)}${x.name} · ${toman(x.price)}</button>`).join('');
$('#extras').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  const on = !order.extras.has(b.dataset.id);
  on ? order.extras.add(b.dataset.id) : order.extras.delete(b.dataset.id);
  b.setAttribute('aria-pressed', on); update();
});
$('#cards').setAttribute('role', 'radiogroup');
$('#cards').innerHTML = cards.map(x => `<button type="button" class="chip" role="radio" aria-checked="${order.card === x.id}" data-id="${x.id}">${icon(x.icon)}${x.name}${x.price ? ' · ' + toman(x.price) : ''}</button>`).join('');
$('#cards').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  order.card = b.dataset.id; $$('#cards .chip').forEach(c => c.setAttribute('aria-checked', c === b)); update();
});

function lines() {
  const L = [];
  stems.forEach(s => { const q = order.qty[s.id]; if (q) L.push([`${fa(q)} شاخه ${s.name}`, s.price * q]); });
  const p = papers.find(x => x.id === order.paper), r = ribbons.find(x => x.id === order.ribbon), c = cards.find(x => x.id === order.card);
  L.push([p.name, p.price]);
  if (r.price) L.push([`روبان ${r.name}`, r.price]);
  extras.forEach(x => order.extras.has(x.id) && L.push([x.name, x.price]));
  if (c.price) L.push([c.name, c.price]);
  return L;
}
const stemCount = () => Object.values(order.qty).reduce((a, b) => a + b, 0);

// Bouquet drawing: paper cone + flower heads placed on a golden-angle spiral
function draw() {
  const p = papers.find(x => x.id === order.paper), r = ribbons.find(x => x.id === order.ribbon);
  const heads = []; stems.forEach(s => { for (let i = 0; i < (order.qty[s.id] || 0); i++) heads.push(s); });
  const isVase = p.id === 'vase';
  let svg = '';
  heads.slice(0, 40).forEach((s, i) => {
    const a = i * 2.39996, rad = 9 * Math.sqrt(i + 1), x = 120 + rad * Math.cos(a), y = 108 + rad * Math.sin(a) * .8;
    const big = ['or', 'an', 'sf'].includes(s.id) ? 15 : s.id === 'gy' ? 6 : 12;
    svg += `<line x1="${x}" y1="${y}" x2="120" y2="210" stroke="#5E7A4A" stroke-width="1.4"/>`;
    svg += `<circle cx="${x}" cy="${y}" r="${big}" fill="${s.color}" stroke="rgba(17,18,58,.18)"/><circle cx="${x}" cy="${y}" r="${big * .35}" fill="rgba(17,18,58,.12)"/>`;
  });
  if (order.extras.has('leaf')) svg = `<path d="M70 120q-30-40 10-70M170 120q30-40-10-70" stroke="#6E8F6A" stroke-width="6" fill="none" stroke-linecap="round"/>` + svg;
  if (order.extras.has('pearl')) for (let i = 0; i < 10; i++) svg += `<circle cx="${80 + (i * 37) % 80}" cy="${80 + (i * 53) % 60}" r="2.5" fill="#fff" stroke="#ccc"/>`;
  const cone = isVase
    ? `<path d="M78 170h84l-8 90h-68z" fill="${p.color}" stroke="rgba(17,18,58,.2)"/>`
    : `<path d="M50 130l70 140 70-140q-70 26-140 0z" fill="${p.color}" stroke="rgba(17,18,58,.2)"/>`;
  const bow = r.id === 'none' || isVase ? '' : `<path d="M120 212c-14-14-34-10-26 4 6 10 20 2 26-4zm0 0c14-14 34-10 26 4-6 10-20 2-26-4zm0 0l-10 26m10-26l10 26" fill="${r.color}" stroke="rgba(17,18,58,.35)"/>`;
  const empty = heads.length ? '' : `<text x="120" y="110" text-anchor="middle" font-size="12" fill="#11123A" opacity=".5">از موجودی گل انتخاب کن</text>`;
  $('#bq').innerHTML = svg + cone + bow + empty;
}

function update() {
  const L = lines(), total = L.reduce((a, l) => a + l[1], 0), n = stemCount();
  $('#sumList').innerHTML = L.map(l => `<li><span>${l[0]}</span><span>${toman(l[1])}</span></li>`).join('');
  $('#sumTotal').textContent = toman(total);
  $('#orderBtn').disabled = n === 0;
  $('#orderBtn').lastChild.textContent = n ? `ثبت سفارش · ${fa(n)} شاخه` : 'اول گل انتخاب کن';
  draw();
}
update();

/* ===== Checkout ===== */
const slots = [[10, 13], [13, 16], [16, 19], [19, 22]];
const hourNow = new Date().getHours();
const slotOpen = a => hourNow + 2 <= a;
const dlg = $('#checkout'), coBody = $('#coBody').innerHTML;
$('#orderBtn').addEventListener('click', () => {
  $('#coBody').innerHTML = coBody;
  const L = lines();
  $('#coList').innerHTML = L.map(l => `<li>${l[0]}</li>`).join('');
  $('#coTotal').textContent = toman(L.reduce((a, l) => a + l[1], 0));
  $('#coSlot').innerHTML = slots.map(([a, b]) => `<option>${slotOpen(a) ? 'امروز' : 'فردا'} ${fa(a)} تا ${fa(b)}</option>`).join('');
  dlg.showModal();
});
$('#coForm').addEventListener('submit', e => {
  if (e.submitter?.value !== 'pay') return;
  e.preventDefault();
  if (!e.target.checkValidity()) return e.target.reportValidity();
  const id = 'ZM-' + fa(Math.floor(1000 + Math.random() * 9000));
  $('#coBody').innerHTML = `<div class="done-msg">${icon('check')}<b>سفارش ${id} ثبت شد</b><p>قبل از ارسال، عکس واقعی دسته‌گل برایت پیامک می‌شود.</p></div>`;
  cartCount++; $('#cartN').textContent = fa(cartCount);
});

/* ===== Same-day countdown + slots (cutoff 19:00 — assumption in brief) ===== */
const CUTOFF = 19;
function tick() {
  const now = new Date(), end = new Date(now);
  end.setHours(CUTOFF, 0, 0, 0);
  const tomorrow = now >= end; if (tomorrow) end.setDate(end.getDate() + 1);
  const s = Math.floor((end - now) / 1000);
  $('#cd').textContent = fa([s / 3600, (s % 3600) / 60, s % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':'));
  $('#cdDay').textContent = tomorrow ? 'فردا صبح' : 'امروز';
}
tick(); setInterval(tick, 1000);

$('#slots').innerHTML = slots.map(([a, b], i) => `<button class="slot" role="radio" aria-checked="false" data-i="${i}" ${slotOpen(a) ? '' : 'disabled'}>
  <b>${fa(a)}–${fa(b)}</b><small>${icon(slotOpen(a) ? 'truck' : 'clock')}${slotOpen(a) ? 'امروز' : 'گذشت'}</small></button>`).join('');
const pickSlot = btn => {
  $$('.slot').forEach(s => s.setAttribute('aria-checked', s === btn));
  const [a, b] = slots[btn.dataset.i];
  $('#slotNote').innerHTML = `${icon('camera')}تحویل امروز بین ساعت ${fa(a)} تا ${fa(b)} — قبل از ارسال، عکس واقعی گل برایتان فرستاده می‌شود.`;
};
const firstFree = $('#slots .slot:not(:disabled)');
if (firstFree) pickSlot(firstFree); else $('#slotNote').innerHTML = `${icon('clock')}بازه‌های امروز تمام شد؛ اولین بازه‌ی فردا ساعت ۱۰ است.`;
$('#slots').addEventListener('click', e => { const b = e.target.closest('.slot'); if (b && !b.disabled) pickSlot(b); });

/* ===== Voice card (demo state + decorative QR) ===== */
(function qr() {
  let seed = 7; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; let out = '';
  const fp = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#11123A"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#11123A"/>`;
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
    if (!inF && r() > .52) out += `<rect x="${x}" y="${y}" width="1" height="1" fill="#2326A6"/>`;
  }
  $('#qr').innerHTML = out + fp(0, 0) + fp(14, 0) + fp(0, 14);
})();
let recT, secs = 0;
$('#recBtn').addEventListener('click', e => {
  const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', on); clearInterval(recT);
  if (on) {
    secs = 0; $('#recState').textContent = 'در حال ضبط…';
    recT = setInterval(() => { secs++; $('#recTime').textContent = `۰:${fa(String(secs).padStart(2, '0'))} از ۱:۰۰`; if (secs >= 60) b.click(); }, 1000);
  } else {
    $('#recState').textContent = `پیام ${fa(secs)} ثانیه‌ای آماده است`;
    $('#recTime').textContent = 'QR روی کارت چاپ می‌شود (نمایشی)';
  }
});

/* ===== Reminder (Shamsi; preview stores locally — real site sends SMS) ===== */
const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
$('#rDay').innerHTML = Array.from({ length: 31 }, (_, i) => `<option>${fa(i + 1)}</option>`).join('');
$('#rMonth').innerHTML = months.map(m => `<option>${m}</option>`).join('');
const KEY = 'zima-reminders';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const render = () => { $('#remList').innerHTML = load().map(r => `<li>${icon('bell')}${r.n} — ${r.d} ${r.m}</li>`).join(''); };
$('#remForm').addEventListener('submit', e => {
  e.preventDefault();
  const list = load(); list.push({ n: $('#rName').value.trim(), d: $('#rDay').value, m: $('#rMonth').value });
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  render(); toast('ثبت شد؛ سه روز قبل پیامک می‌گیرید'); e.target.reset();
});
render();
