// La Pannacotta — pedido por WhatsApp, carta, campañas y movimiento
import { waLink } from '../data/negocio';

const $ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => el.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, el: ParentNode = document) => [...el.querySelectorAll<T>(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Productos (leídos de las tarjetas que renderiza Astro) ----------
interface Info { nombre: string; precio: number | null; thumb: string }
const productos = new Map<string, Info>();
$$('[data-product]').forEach((el) => {
  const img = el.querySelector<HTMLImageElement>('img');
  const prev = productos.get(el.dataset.product!);
  productos.set(el.dataset.product!, {
    nombre: el.dataset.nombre!,
    precio: el.dataset.precio ? Number(el.dataset.precio) : null,
    // Preferir la foto de la tarjeta grande si ya existe
    thumb: prev?.thumb || img?.currentSrc || img?.src || '/img/monograma.png',
  });
});
const soles = (n: number) => `S/ ${n.toFixed(2)}`;

// ---------- Pedido (localStorage solo por comodidad) ----------
const KEY = 'lpc-pedido';
let cart: Record<string, number> = {};
try { cart = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { cart = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* sin storage */ } };
const items = () => Object.entries(cart).filter(([id, q]) => q > 0 && productos.has(id));

const drawer = $('#pedido');
const scrim = $('.drawer-scrim');
let lastFocus: HTMLElement | null = null;

function openCart() {
  lastFocus = document.activeElement as HTMLElement;
  scrim.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('is-open'); scrim.classList.add('is-open'); });
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  drawer.focus();
}
function closeCart() {
  drawer.classList.remove('is-open');
  scrim.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { scrim.hidden = true; }, 300);
  lastFocus?.focus();
}
$$('[data-open-cart]').forEach((b) => b.addEventListener('click', openCart));
$$('[data-close-cart]').forEach((b) => b.addEventListener('click', () => {
  closeCart();
  if (b.dataset.goto) document.querySelector(b.dataset.goto)?.scrollIntoView({ behavior: 'smooth' });
}));
document.addEventListener('keydown', (e) => {
  if (!drawer.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeCart();
  // Mantener el foco dentro del panel mientras está abierto
  if (e.key === 'Tab') {
    const focusables = $$<HTMLElement>('button, a[href], input, textarea, select', drawer).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

function renderCart() {
  const list = items();
  const count = list.reduce((n, [, q]) => n + q, 0);
  $$('[data-cart-count]').forEach((el) => { el.textContent = String(count); el.classList.toggle('has-items', count > 0); });
  $('[data-cart-empty]').hidden = list.length > 0;
  $('[data-order-form]').hidden = list.length === 0;
  $('[data-cart-list]').innerHTML = list.map(([id, q]) => {
    const p = productos.get(id)!;
    return `<li class="cart-item">
      <img src="${p.thumb}" alt="" width="56" height="56">
      <div class="ci-info"><strong>${p.nombre}</strong><span>${p.precio ? soles(p.precio * q) : 'Precio a confirmar'}</span></div>
      <div class="qty" role="group" aria-label="Cantidad de ${p.nombre}">
        <button type="button" data-dec="${id}" aria-label="Quitar uno">−</button>
        <output>${q}</output>
        <button type="button" data-inc="${id}" aria-label="Agregar uno">+</button>
      </div>
    </li>`;
  }).join('');
  // El total solo aparece si todos los productos del pedido tienen precio publicado
  const total = $('[data-cart-total]');
  const conPrecio = list.length > 0 && list.every(([id]) => productos.get(id)!.precio);
  total.hidden = !conPrecio;
  if (conPrecio) total.textContent = `Total referencial: ${soles(list.reduce((s, [id, q]) => s + productos.get(id)!.precio! * q, 0))}`;
}

const toastEl = $('[data-toast]');
let toastTimer: ReturnType<typeof setTimeout>;
function toast(msg: string) {
  toastEl.textContent = msg;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
}

document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const add = t.closest<HTMLElement>('[data-add]');
  const inc = t.closest<HTMLElement>('[data-inc]');
  const dec = t.closest<HTMLElement>('[data-dec]');
  if (add) {
    const id = add.dataset.add!;
    cart[id] = (cart[id] || 0) + 1;
    toast(`${productos.get(id)!.nombre} se agregó a tu pedido`);
    add.classList.add('is-added');
    if (add.classList.contains('btn')) {
      add.dataset.label ??= add.textContent!;
      add.textContent = '¡Agregado!';
    }
    clearTimeout(Number(add.dataset.timer));
    add.dataset.timer = String(setTimeout(() => {
      add.classList.remove('is-added');
      if (add.dataset.label) add.textContent = add.dataset.label;
    }, 1100));
    $$('[data-cart-count]').forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
  } else if (inc) {
    cart[inc.dataset.inc!]++;
  } else if (dec) {
    const id = dec.dataset.dec!;
    if (--cart[id] <= 0) delete cart[id];
  } else return;
  save();
  renderCart();
});

// Mostrar dirección solo para delivery
const orderForm = $<HTMLFormElement>('[data-order-form]');
orderForm.addEventListener('change', () => {
  $('[data-direccion]').hidden = new FormData(orderForm).get('entrega') !== 'Delivery';
});

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(orderForm);
  const get = (k: string) => String(f.get(k) || '').trim();
  const lines = items().map(([id, q]) => `• ${q} × ${productos.get(id)!.nombre}`);
  const msg = [
    `¡Hola La Pannacotta! 👋 ${get('nombre') ? `Soy ${get('nombre')}. ` : ''}Quiero hacer este pedido:`,
    '',
    ...lines,
    '',
    `🛍️ Entrega: ${get('entrega')}`,
    get('entrega') === 'Delivery' && get('direccion') && `📍 Dirección: ${get('direccion')}`,
    get('cuando') && `🕒 Para: ${get('cuando')}`,
    get('notas') && `📝 Notas: ${get('notas')}`,
    '',
    '¿Me confirman disponibilidad y precio? Gracias 🍰',
  ].filter((l) => l !== false && l !== undefined).join('\n').replace(/\n{3,}/g, '\n\n');
  window.open(waLink(msg), '_blank', 'noopener');
});

// ---------- Cotizador de tortas ----------
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const encargo = document.querySelector<HTMLFormElement>('[data-encargo-form]');
if (encargo) {
  $<HTMLInputElement>('[name="fecha"]', encargo).min = today;
  encargo.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(encargo);
    const get = (k: string) => String(f.get(k) || '').trim();
    let fecha = '';
    if (get('fecha')) { const [y, m, d] = get('fecha').split('-'); fecha = `${d}/${m}/${y}`; }
    const msg = [
      '¡Hola La Pannacotta! 👋 Quiero cotizar un postre entero 🎂',
      '',
      `🎉 Ocasión: ${get('ocasion')}`,
      `🍰 Sabor: ${get('sabor') || 'Quiero que me recomienden'}`,
      fecha && `📅 Fecha: ${fecha}`,
      get('personas') && `👥 Personas: ${get('personas')}`,
      get('detalles') && `📝 Detalles: ${get('detalles')}`,
    ].filter((l, i) => l || i === 1).join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
  });
}

// ---------- Campañas: se ocultan solas fuera de sus fechas (hora de Lima) ----------
const hoyLima = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date());
const campanas = $$('[data-desde]');
campanas.forEach((c) => { c.hidden = hoyLima < c.dataset.desde! || hoyLima > c.dataset.hasta!; });
const vacia = document.querySelector<HTMLElement>('[data-campana-vacia]');
if (vacia) vacia.hidden = campanas.some((c) => !c.hidden);

// ---------- Pestañas de la carta ----------
const tabs = $$<HTMLButtonElement>('[data-tab]');
function selectTab(tab: HTMLButtonElement) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $(`#panel-${t.dataset.tab}`).hidden = !on;
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    selectTab(next); next.focus();
  });
});

// ---------- Slider de favoritos ----------
const track = document.querySelector<HTMLElement>('[data-track]');
$$('[data-slide]').forEach((b) => b.addEventListener('click', () => {
  if (!track) return;
  const card = track.querySelector<HTMLElement>('.fav-card');
  const step = card ? card.offsetWidth + 24 : 320;
  track.scrollBy({ left: Number(b.dataset.slide) * step * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
}));

// ---------- Header con fondo al hacer scroll ----------
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Parallax suave del hero ----------
const stage = document.querySelector<HTMLElement>('[data-parallax]');
if (stage && !reduceMotion && matchMedia('(pointer: fine)').matches) {
  const floats = $$('[data-depth]', stage);
  // Al hacer scroll, los postres de arriba suben y los de abajo bajan: siempre se alejan del nombre
  const title = $('.wordmark', stage);
  const dirs = floats.map((f) => (f.offsetTop + f.offsetHeight / 2 < title.offsetTop + title.offsetHeight / 2 ? -1 : 1));
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const apply = () => floats.forEach((f, i) => {
    const d = Number(f.dataset.depth);
    f.style.translate = `${cx * d * 14}px ${cy * d * 10 + dirs[i] * scrollY * d * 0.1}px`;
  });
  const tick = () => {
    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    apply();
    raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  stage.closest('section')!.addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  addEventListener('scroll', () => { if (scrollY < innerHeight * 1.2 && !raf) apply(); }, { passive: true });
}

// ---------- Aparición al hacer scroll ----------
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.section-head, .statement, .fav-card, .campana, .opcion, .encargos-card, .plato, .momento').forEach((el) => {
    el.classList.add('reveal'); io.observe(el);
  });
}

renderCart();
