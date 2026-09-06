// ظلالي — التشغيل المشترك لكل الصفحات العامة.
import { Store } from './store.js';
import { renderHeader, renderFooter, renderBottomBar } from '../partials.js';

function rootPrefix() {
  // يحسب البادئة النسبية للجذر من data-root على <html> (مثل "" أو "../" أو "../../")
  return document.documentElement.getAttribute('data-root') || '';
}

function interpolate(str, s) {
  return str
    .replaceAll('{brand}', s.brand)
    .replaceAll('{tagline}', s.tagline)
    .replaceAll('{city}', s.city)
    .replaceAll('{phone}', s.phone)
    .replaceAll('{address}', s.address)
    .replaceAll('{hours}', s.hours)
    .replaceAll('{whatsapp}', s.whatsapp);
}

function interpolateNode(node, s) {
  // يستبدل العلامات في كل عقد النص داخل node
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const targets = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('{')) targets.push(walker.currentNode);
  targets.forEach(t => { t.nodeValue = interpolate(t.nodeValue, s); });
}

function wireWhatsapp(s) {
  const url = 'https://wa.me/' + s.whatsapp;
  document.querySelectorAll('.js-wa').forEach(a => {
    if (!a.dataset.msg) a.setAttribute('href', url);
    else a.setAttribute('href', url + '?text=' + encodeURIComponent(interpolate(a.dataset.msg, s)));
    a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
  });
}

function revealOnScroll() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { const el = e.target; setTimeout(() => el.classList.add('in'), (el.dataset.revealDelay || 0) * 1); io.unobserve(el); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
  // شبكة أمان: لا يبقى أي محتوى مخفياً أبداً حتى لو تعطّل المراقب أو لم يمرّر المستخدم
  setTimeout(() => { document.querySelectorAll('[data-reveal]:not(.in)').forEach(e => e.classList.add('in')); }, 2500);
}

function countUp() {
  const els = document.querySelectorAll('[data-count]');
  const run = (el) => {
    const target = parseFloat(el.dataset.count); const dec = (el.dataset.count.includes('.')) ? 1 : 0;
    const dur = 1200; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1); const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * ease).toLocaleString('ar-EG', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  els.forEach(e => io.observe(e));
}

export function toast(msg) {
  let t = document.querySelector('.toast-zi');
  if (!t) { t = document.createElement('div'); t.className = 'toast-zi'; t.innerHTML = '<div></div>'; document.body.appendChild(t); }
  t.firstElementChild.textContent = msg; t.classList.add('show');
  clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 2600);
}

export function getState() { return Store.load(); }

export function initSite(active) {
  const root = rootPrefix();
  const s = Store.load();
  document.querySelectorAll('[data-slot="header"]').forEach(el => { el.innerHTML = renderHeader(active, root); });
  document.querySelectorAll('[data-slot="footer"]').forEach(el => { el.innerHTML = renderFooter(root); });
  document.body.insertAdjacentHTML('beforeend', renderBottomBar(root));
  interpolateNode(document.body, s.settings);
  wireWhatsapp(s.settings);
  // شارات وضع العرض التجريبي
  if (!s.settings.demo) document.querySelectorAll('.pill-demo').forEach(e => e.remove());
  revealOnScroll();
  countUp();
}
