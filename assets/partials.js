// ظلالي — HTML مشترك (ترويسة، تذييل، شريط سفلي، أيقونات). كل النصوص تحوي علامات {city} {brand} {whatsapp} يستبدلها site.js.

export const ICONS = {
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><path d="M3 13l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7" cy="15.5" r="1"/><circle cx="17" cy="15.5" r="1"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><path d="M4 4h16v16H4z"/><path d="M4 9h16M4 14h16M9 4v16M14 4v16"/></svg>',
  fence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><path d="M6 3l2 2v16H4V7zM16 3l2 2v16h-4V7z"/><path d="M2 9h20M2 14h20"/></svg>',
  warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><path d="M3 21V8l9-4 9 4v13"/><path d="M7 21v-7h10v7"/><path d="M7 17h10"/></svg>',
  tent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="26" height="26"><path d="M12 3L3 20h18z"/><path d="M12 3v17"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="24" height="24"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5M21 20a6 6 0 0 0-4-5.6"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M.06 24l1.7-6.2A11.9 11.9 0 1 1 12 24a11.9 11.9 0 0 1-5.7-1.45L.06 24zM6.6 20.1l.37.22a9.9 9.9 0 1 0-3.3-3.28l.24.38-1 3.65 3.7-.97zM17.9 14.3c-.24-.12-1.45-.72-1.67-.8-.22-.08-.38-.12-.55.12s-.63.8-.77.96-.28.18-.52.06a8.1 8.1 0 0 1-2.4-1.48 9 9 0 0 1-1.66-2.06c-.17-.3 0-.46.13-.6l.4-.46c.13-.16.17-.28.26-.46a.5.5 0 0 0 0-.48c-.07-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.75 2.75 0 0 0-.86 2.04c0 1.2.88 2.36 1 2.52s1.73 2.64 4.2 3.7c.58.26 1.04.4 1.4.5.58.2 1.12.16 1.54.1.47-.07 1.45-.6 1.65-1.17.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M13 5l-7 7 7 7M6 12h13" transform="scale(-1,1) translate(-24,0)"/></svg>'
};

const NAV = [
  { href: '{root}index.html', key: 'home', label: 'الرئيسية' },
  { href: '{root}services/index.html', key: 'services', label: 'خدماتنا' },
  { href: '{root}projects/index.html', key: 'projects', label: 'أعمالنا' },
  { href: '{root}pricing/index.html', key: 'pricing', label: 'الأسعار' },
  { href: '{root}blog/index.html', key: 'blog', label: 'المدونة' },
  { href: '{root}contact/index.html', key: 'contact', label: 'تواصل' }
];

function brandMark() {
  return '<svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">' +
    '<rect width="40" height="40" rx="11" fill="oklch(57% 0.235 293)"/>' +
    '<path d="M9 25c4-9 18-9 22 0" stroke="oklch(90% 0.035 85)" stroke-width="2.4" stroke-linecap="round"/>' +
    '<circle cx="20" cy="13" r="3.4" fill="oklch(90% 0.035 85)"/>' +
    '<path d="M11 28h18" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></svg>';
}

export function renderHeader(active, root = '') {
  const links = NAV.map(n =>
    `<a class="nav-link ${n.key === active ? 'active' : ''}" href="${n.href.replace('{root}', root)}">${n.label}</a>`).join('');
  const mobileLinks = NAV.map(n =>
    `<li><a href="${n.href.replace('{root}', root)}" class="${n.key === active ? 'active' : ''}">${n.label}</a></li>`).join('');
  return `
<header class="site-header">
  <div class="container-zi" style="display:flex;align-items:center;justify-content:space-between;height:66px;gap:1rem">
    <a class="brand" href="${root}index.html" aria-label="{brand}">${brandMark()}<span>{brand}</span></a>
    <nav class="hidden lg:flex" style="align-items:center;gap:.2rem" aria-label="التنقّل">${links}</nav>
    <div style="display:flex;align-items:center;gap:.5rem">
      <a class="btn-zi btn-primary hidden sm:inline-flex js-wa" style="min-height:42px;padding:.5rem 1.1rem" href="#">${ICONS.wa}<span>واتساب</span></a>
      <button class="btn-zi btn-ghost lg:hidden" style="min-height:42px;padding:.5rem;width:46px" aria-label="القائمة" onclick="document.getElementById('zi-drawer').showModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  <dialog id="zi-drawer" style="margin:0 0 0 auto;height:100dvh;max-height:100dvh;width:78%;max-width:320px;border:none;padding:0;background:var(--paper-raised)">
    <div style="padding:1.1rem;display:flex;flex-direction:column;gap:.3rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <a class="brand" href="${root}index.html">${brandMark()}<span>{brand}</span></a>
        <button aria-label="إغلاق" onclick="document.getElementById('zi-drawer').close()" style="border:none;background:var(--violet-25);width:40px;height:40px;border-radius:10px;font-size:1.3rem;cursor:pointer">✕</button>
      </div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.25rem">${mobileLinks}</ul>
      <a class="btn-zi btn-whatsapp js-wa" style="margin-top:1rem" href="#">${ICONS.wa}<span>تواصل عبر واتساب</span></a>
    </div>
  </dialog>
</header>`;
}

export function renderFooter(root = '') {
  const col = (head, items) => `<div><div class="footer-head">${head}</div><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.5rem;font-size:.92rem">${items}</ul></div>`;
  const li = (href, label) => `<li><a href="${root}${href}">${label}</a></li>`;
  return `
<footer class="site-footer">
  <div class="container-zi section-tight" style="display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
    <div>
      <a class="brand" style="color:#fff" href="${root}index.html">${brandMark()}<span>{brand}</span></a>
      <p style="color:oklch(82% .03 293);margin-top:.8rem;font-size:.92rem;max-width:32ch">{tagline}. مظلات وسواتر وجلسات خارجية في {city} — تصميم وتركيب باحترافية.</p>
      <div style="margin-top:1rem;display:flex;gap:.6rem">
        <a href="#" aria-label="سناب شات" class="pill">Snapchat</a>
        <a href="#" aria-label="تيك توك" class="pill">TikTok</a>
        <a href="#" aria-label="إنستغرام" class="pill">Instagram</a>
      </div>
    </div>
    ${col('خدماتنا', li('services/car-shades/index.html','مظلات سيارات') + li('services/garden-shades/index.html','مظلات جلسات') + li('services/pergola/index.html','برجولات') + li('services/screens/index.html','سواتر'))}
    ${col('روابط', li('projects/index.html','أعمالنا') + li('pricing/index.html','الأسعار والحاسبة') + li('blog/index.html','المدونة') + li('contact/index.html','تواصل معنا'))}
    ${col('تواصل', '<li>{phone}</li><li style="color:oklch(82% .03 293)">{address}</li><li style="color:oklch(82% .03 293)">{hours}</li>')}
  </div>
  <div style="border-top:1px solid oklch(35% .06 293)">
    <div class="container-zi" style="padding:1rem 1.15rem;display:flex;flex-wrap:wrap;gap:.5rem;justify-content:space-between;color:oklch(78% .03 293);font-size:.85rem">
      <span>© 2026 {brand} — مدينة الخدمة: {city}</span>
      <span>نموذج تجريبي للعرض</span>
    </div>
  </div>
</footer>`;
}

export function renderBottomBar(root = '') {
  return `
<div class="bottom-bar">
  <a class="btn-zi btn-whatsapp js-wa" href="#">${ICONS.wa}<span>واتساب</span></a>
  <a class="btn-zi btn-primary" href="${root}pricing/index.html">احسب سعرك</a>
</div>`;
}
