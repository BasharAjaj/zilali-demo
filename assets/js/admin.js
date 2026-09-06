// ظلالي — لوحة التحكم. توجيه hash + 8 صفحات + مزامنة حية مع الحاسبة.
import { Store } from './store.js';

const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const view = document.getElementById('admin-view');
const money = n => (+n || 0).toLocaleString('ar-EG');

const STATUS = {
  new: 'جديد', contacted: 'تم التواصل', scheduled: 'تم تحديد موعد',
  visited: 'تمت المعاينة', quoted: 'تم إرسال العرض', won: 'تم التنفيذ', lost: 'مغلق'
};
const STATUS_KEYS = Object.keys(STATUS);

function toast(msg) {
  let t = document.querySelector('.toast-zi');
  if (!t) { t = document.createElement('div'); t.className = 'toast-zi'; t.innerHTML = '<div></div>'; document.body.appendChild(t); }
  t.firstElementChild.textContent = msg; t.classList.add('show');
  clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 2200);
}

function sparkline(vals, color = 'var(--violet-500)') {
  const w = 120, h = 34, max = Math.max(...vals, 1), min = Math.min(...vals, 0);
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none" style="margin-top:.5rem"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
}

// ---------- الصفحات ----------
function overview() {
  const s = Store.load();
  const leads = s.leads;
  const byStatus = k => leads.filter(l => l.status === k).length;
  const topKw = s.seo.keywords.filter(k => k.position <= 10).length;
  const cards = [
    { label: 'طلبات التسعير', val: leads.length, spark: [3,5,4,6,5,8, leads.length || 1] },
    { label: 'نقرات واتساب', val: 87, spark: [40,52,48,60,71,80,87] },
    { label: 'زيارات الموقع', val: 1240, spark: [700,820,900,1000,1100,1180,1240] },
    { label: 'كلمات في الصفحة الأولى', val: topKw, spark: [2,3,4,5,6,7,topKw] }
  ];
  view.innerHTML = `
  <h1 style="font-size:1.5rem;margin:0 0 .3rem">نظرة عامة</h1>
  <p class="text-soft" style="margin:0 0 1.2rem">مرحباً، هذه آخر مؤشرات موقعك <span class="pill pill-demo" style="font-size:.62rem">أرقام تجريبية</span></p>
  <div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    ${cards.map(c => `<div class="stat-card"><div class="text-soft" style="font-size:.85rem">${c.label}</div>
      <div style="font-size:1.9rem;font-weight:700;color:var(--violet-600)">${money(c.val)}</div>${sparkline(c.spark)}</div>`).join('')}
  </div>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr;margin-top:1.2rem" class="lg:grid-cols-2">
    <div class="stat-card"><div style="font-weight:700;margin-bottom:.7rem">حالة الطلبات</div>
      ${STATUS_KEYS.map(k => `<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid var(--line);font-size:.9rem"><span>${STATUS[k]}</span><b>${byStatus(k)}</b></div>`).join('')}
    </div>
    <div class="stat-card"><div style="font-weight:700;margin-bottom:.7rem">آخر الطلبات</div>
      ${leads.slice(-5).reverse().map(l => `<div style="display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid var(--line);font-size:.85rem"><span>${esc(l.name || l.type)} • ${esc(l.city)}</span><span class="pill">${STATUS[l.status] || 'جديد'}</span></div>`).join('') || '<div class="text-faint" style="font-size:.85rem">لا طلبات بعد — جرّب الحاسبة في الموقع.</div>'}
    </div>
  </div>`;
}

function leadsPage() {
  const s = Store.load();
  let filter = 'all';
  function render() {
    const rows = s.leads.filter(l => filter === 'all' || l.status === filter);
    const counts = STATUS_KEYS.map(k => `<button class="pill ${filter===k?'sel':''}" data-f="${k}">${STATUS[k]} (${s.leads.filter(l=>l.status===k).length})</button>`).join('');
    view.innerHTML = `
    <h1 style="font-size:1.5rem;margin:0 0 .3rem">طلبات التسعير</h1>
    <p class="text-soft" style="margin:0 0 1rem">تصل من الحاسبة ونموذج التواصل في الموقع.</p>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1rem"><button class="pill ${filter==='all'?'sel':''}" data-f="all">الكل (${s.leads.length})</button>${counts}</div>
    <div class="scroll-x"><table class="a-table" style="min-width:720px">
      <thead><tr><th>التاريخ</th><th>الاسم/الجوال</th><th>النوع</th><th>المقاس</th><th>المدينة</th><th>التقدير</th><th>الحالة</th><th></th></tr></thead>
      <tbody>${rows.length ? rows.slice().reverse().map(l => `<tr>
        <td>${esc(l.createdAt)}</td>
        <td>${esc(l.name || '-')}<div class="text-faint" style="font-size:.75rem">${esc(l.phone || '')}</div></td>
        <td>${esc(l.type)}${l.material && l.material !== '-' ? '<div class="text-faint" style="font-size:.72rem">' + esc(l.material) + '</div>' : ''}</td>
        <td>${l.area ? l.length + '×' + l.width + ' م' : '-'}</td>
        <td>${esc(l.city)}</td>
        <td>${l.low ? money(l.low) + '–' + money(l.high) : '-'}</td>
        <td><select class="a-input js-status" data-id="${esc(l.id)}" style="padding:.35rem;font-size:.8rem">${STATUS_KEYS.map(k => `<option value="${k}" ${l.status===k?'selected':''}>${STATUS[k]}</option>`).join('')}</select></td>
        <td><a class="pill pill-ok js-wa-lead" data-phone="${esc(l.phone||'')}" href="#" style="cursor:pointer">واتساب</a></td>
      </tr>`).join('') : '<tr><td colspan="8" class="text-faint" style="text-align:center;padding:1.5rem">لا طلبات بعد. افتح الموقع واستخدم الحاسبة ← «طلب معاينة».</td></tr>'}</tbody>
    </table></div>`;
    view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; render(); });
    view.querySelectorAll('.js-status').forEach(sel => sel.onchange = () => {
      const st = Store.load(); const lead = st.leads.find(x => x.id === sel.dataset.id);
      if (lead) { lead.status = sel.value; Store.set('leads', st.leads); s.leads = st.leads; toast('حُدّثت الحالة'); }
    });
    view.querySelectorAll('.js-wa-lead').forEach(a => a.onclick = e => {
      e.preventDefault(); const ph = a.dataset.phone.replace(/^0/, '966'); if (ph) window.open('https://wa.me/' + ph, '_blank');
    });
  }
  render();
}

function pricingPage() {
  const s = Store.load();
  function render() {
    view.innerHTML = `
    <h1 style="font-size:1.5rem;margin:0 0 .3rem">الأسعار</h1>
    <p class="text-soft" style="margin:0 0 .3rem">عدّل الأسعار وستتغيّر حاسبة الموقع فوراً. <span class="pill pill-demo" style="font-size:.62rem">أسعار تجريبية</span></p>
    <div class="card-zi" style="background:var(--violet-25);margin-bottom:1rem;font-size:.85rem">💡 جرّب: افتح <a href="../pricing/index.html" target="_blank" style="color:var(--violet-700);font-weight:700">صفحة الحاسبة</a> في تبويب آخر، غيّر سعراً هنا وشاهد الحاسبة تتحدّث.</div>
    <div style="display:grid;gap:.7rem;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-bottom:1rem">
      <label style="font-size:.82rem">نسبة نطاق السعر ±
        <input class="a-input js-range" type="number" step="0.01" value="${s.pricing.rangePct}"></label>
      ${Object.entries(s.pricing.cityFactor).map(([c, f]) => `<label style="font-size:.82rem">معامل ${esc(c)}
        <input class="a-input js-city" data-city="${esc(c)}" type="number" step="0.01" value="${f}"></label>`).join('')}
    </div>
    ${Object.entries(s.pricing.types).map(([tk, t]) => `
      <div class="card-zi" style="margin-bottom:.8rem">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;align-items:center;margin-bottom:.6rem">
          <b>${esc(t.name)}</b>
          <div style="display:flex;gap:.6rem;font-size:.8rem">
            <label>تركيب <input class="a-input js-install" data-t="${tk}" type="number" value="${t.installFee}" style="width:90px;display:inline-block"></label>
            <label>حد أدنى <input class="a-input js-min" data-t="${tk}" type="number" value="${t.minOrder}" style="width:90px;display:inline-block"></label>
          </div>
        </div>
        <div style="display:grid;gap:.5rem;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">
          ${Object.entries(t.materials).map(([mk, m]) => `<label style="font-size:.8rem">${esc(m.name)} (ريال/م²)
            <input class="a-input js-price" data-t="${tk}" data-m="${mk}" type="number" value="${m.pricePerM2}"></label>`).join('')}
        </div>
      </div>`).join('')}`;
    // ربط
    const save = (path, val) => { Store.set(path, val); toast('تم الحفظ — الحاسبة تحدّثت'); };
    view.querySelector('.js-range').onchange = e => save('pricing.rangePct', +e.target.value);
    view.querySelectorAll('.js-city').forEach(i => i.onchange = e => save('pricing.cityFactor.' + e.target.dataset.city, +e.target.value));
    view.querySelectorAll('.js-install').forEach(i => i.onchange = e => save(`pricing.types.${e.target.dataset.t}.installFee`, +e.target.value));
    view.querySelectorAll('.js-min').forEach(i => i.onchange = e => save(`pricing.types.${e.target.dataset.t}.minOrder`, +e.target.value));
    view.querySelectorAll('.js-price').forEach(i => i.onchange = e => save(`pricing.types.${e.target.dataset.t}.materials.${e.target.dataset.m}.pricePerM2`, +e.target.value));
  }
  render();
}

function seoScore(a) {
  let sc = 0;
  const tl = (a.metaTitle || '').length; if (tl >= 40 && tl <= 70) sc += 20;
  const dl = (a.metaDescription || '').length; if (dl >= 120 && dl <= 170) sc += 20;
  const body = a.sections.map(x => x.h2 + ' ' + x.html).join(' ');
  if (a.keyword && (a.title || '').includes(a.keyword.split(' ')[0])) sc += 15;
  if (a.keyword && body.includes(a.keyword.split(' ')[0])) sc += 10;
  if (a.sections.length >= 3) sc += 15;
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).length; if (words >= 120) sc += 10;
  if (a.faqs && a.faqs.length) sc += 10;
  return sc;
}

function articlesPage() {
  const s = Store.load();
  let editing = null;
  function render() {
    const list = s.articles.map((a, i) => {
      const sc = seoScore(a);
      const col = sc >= 80 ? 'var(--success)' : sc >= 50 ? 'var(--warning)' : 'var(--danger)';
      return `<tr><td>${esc(a.title)}</td><td>${esc(a.keyword)}</td><td><span class="pill" style="background:${col}22;color:${col}">${sc}/100</span></td><td>${esc(a.date)}</td><td><button class="pill js-edit" data-i="${i}">تحرير</button></td></tr>`;
    }).join('');
    view.innerHTML = `
    <h1 style="font-size:1.5rem;margin:0 0 .3rem">المقالات</h1>
    <p class="text-soft" style="margin:0 0 1rem">حرّر المقال وتابع مؤشر السيو الحي. الحفظ ينعكس على الموقع.</p>
    <div class="scroll-x"><table class="a-table" style="min-width:600px"><thead><tr><th>العنوان</th><th>الكلمة المفتاحية</th><th>مؤشر السيو</th><th>التاريخ</th><th></th></tr></thead><tbody>${list}</tbody></table></div>
    <div id="art-editor" style="margin-top:1rem"></div>`;
    view.querySelectorAll('.js-edit').forEach(b => b.onclick = () => { editing = +b.dataset.i; editor(); });
  }
  function editor() {
    const a = s.articles[editing];
    const box = view.querySelector('#art-editor');
    const draw = () => {
      const sc = seoScore(a);
      const checks = [
        ['طول العنوان 40-70', (a.metaTitle || '').length >= 40 && (a.metaTitle || '').length <= 70],
        ['طول الوصف 120-170', (a.metaDescription || '').length >= 120 && (a.metaDescription || '').length <= 170],
        ['الكلمة في العنوان', a.keyword && (a.title || '').includes(a.keyword.split(' ')[0])],
        ['3 عناوين H2 أو أكثر', a.sections.length >= 3],
        ['أسئلة شائعة', a.faqs && a.faqs.length > 0]
      ];
      box.innerHTML = `
      <div class="card-zi">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem"><b>تحرير: ${esc(a.title)}</b>
          <span class="pill" style="background:var(--violet-50);color:var(--violet-700)">مؤشر السيو ${sc}/100</span></div>
        <div style="display:grid;gap:.7rem">
          <label style="font-size:.82rem">العنوان<input class="a-input" id="e-title" value="${esc(a.title)}"></label>
          <label style="font-size:.82rem">Meta title (<span id="c-mt">${(a.metaTitle||'').length}</span>)<input class="a-input" id="e-mt" value="${esc(a.metaTitle)}"></label>
          <label style="font-size:.82rem">Meta description (<span id="c-md">${(a.metaDescription||'').length}</span>)<textarea class="a-input" id="e-md" rows="2">${esc(a.metaDescription)}</textarea></label>
          <label style="font-size:.82rem">الكلمة المفتاحية<input class="a-input" id="e-kw" value="${esc(a.keyword)}"></label>
        </div>
        <div style="margin-top:.8rem;display:grid;gap:.3rem">${checks.map(([t, ok]) => `<div style="font-size:.82rem;color:${ok?'var(--success)':'var(--ink-faint)'}">${ok?'✓':'○'} ${t}</div>`).join('')}</div>
        <div style="margin-top:.9rem;display:flex;gap:.5rem"><button class="btn-zi btn-primary" id="e-save" style="min-height:40px">حفظ</button><button class="btn-zi btn-ghost" id="e-cancel" style="min-height:40px">إغلاق</button></div>
        <p class="text-faint" style="font-size:.75rem;margin:.6rem 0 0">الحفظ يجعل الموقع يعرض النسخة المعدّلة (editedInAdmin).</p>
      </div>`;
      box.querySelector('#e-title').oninput = e => { a.title = e.target.value; };
      box.querySelector('#e-mt').oninput = e => { a.metaTitle = e.target.value; box.querySelector('#c-mt').textContent = e.target.value.length; };
      box.querySelector('#e-md').oninput = e => { a.metaDescription = e.target.value; box.querySelector('#c-md').textContent = e.target.value.length; };
      box.querySelector('#e-kw').oninput = e => { a.keyword = e.target.value; };
      box.querySelector('#e-save').onclick = () => { a.editedInAdmin = true; Store.set('articles', s.articles); toast('حُفظ المقال'); render(); };
      box.querySelector('#e-cancel').onclick = () => { box.innerHTML = ''; };
      // إعادة رسم مؤشر السيو عند التغيير
      box.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', () => { clearTimeout(box._t); box._t = setTimeout(draw, 500); }));
    };
    draw();
  }
  render();
}

function projectsPage() {
  const s = Store.load();
  function render() {
    view.innerHTML = `
    <h1 style="font-size:1.5rem;margin:0 0 .3rem">المشاريع</h1>
    <p class="text-soft" style="margin:0 0 1rem">أضف مشروعاً فيظهر في معرض الموقع.</p>
    <div class="card-zi" style="margin-bottom:1rem"><b>مشروع جديد</b>
      <div style="display:grid;gap:.5rem;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));margin-top:.6rem">
        <input class="a-input" id="p-title" placeholder="العنوان">
        <input class="a-input" id="p-city" placeholder="المدينة">
        <input class="a-input" id="p-district" placeholder="الحي">
        <select class="a-input" id="p-type">${Object.entries(s.pricing.types).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}</select>
        <input class="a-input" id="p-area" type="number" placeholder="المساحة م²">
        <input class="a-input" id="p-days" type="number" placeholder="أيام">
      </div>
      <button class="btn-zi btn-primary" id="p-add" style="margin-top:.6rem;min-height:40px">إضافة</button></div>
    <div class="grid-auto">${s.projects.slice().reverse().map(p => `<div class="card-zi"><b>${esc(p.title)}</b><div class="text-soft" style="font-size:.82rem;margin-top:.3rem">${esc(p.city)} • ${esc(p.district)} • ${p.areaM2} م²</div></div>`).join('')}</div>`;
    view.querySelector('#p-add').onclick = () => {
      const title = view.querySelector('#p-title').value.trim(); if (!title) { toast('أدخل العنوان'); return; }
      const tk = view.querySelector('#p-type').value;
      s.projects.push({ slug: 'p' + Date.now(), title, city: view.querySelector('#p-city').value || s.settings.city,
        district: view.querySelector('#p-district').value, typeKey: tk, material: '-', areaM2: +view.querySelector('#p-area').value || 0,
        days: +view.querySelector('#p-days').value || 0, cover: 'p1', summary: title });
      Store.set('projects', s.projects); toast('أُضيف المشروع'); render();
    };
  }
  render();
}

function servicesPage() {
  const s = Store.load();
  view.innerHTML = `
  <h1 style="font-size:1.5rem;margin:0 0 .3rem">الخدمات</h1>
  <p class="text-soft" style="margin:0 0 1rem">عدّل الوصف القصير لكل خدمة.</p>
  ${s.services.map((sv, i) => `<div class="card-zi" style="margin-bottom:.6rem"><b>${esc(sv.name)}</b>
    <textarea class="a-input js-svc" data-i="${i}" rows="2" style="margin-top:.4rem">${esc(sv.short)}</textarea></div>`).join('')}`;
  view.querySelectorAll('.js-svc').forEach(t => t.onchange = e => {
    s.services[e.target.dataset.i].short = e.target.value; Store.set('services', s.services); toast('حُفظ');
  });
}

function seoPage() {
  const s = Store.load();
  const pages = [
    ['الرئيسية', 'HomeAndConstructionBusiness · WebSite · FAQPage'],
    ['صفحات الخدمات (6)', 'Service · BreadcrumbList · FAQPage'],
    ['صفحات المقالات (4)', 'Article · BreadcrumbList · FAQPage'],
    ['صفحات المشاريع (8)', 'CreativeWork · BreadcrumbList'],
    ['الأسعار', 'Service · Offer · BreadcrumbList']
  ];
  view.innerHTML = `
  <h1 style="font-size:1.5rem;margin:0 0 .3rem">تقرير السيو</h1>
  <p class="text-soft" style="margin:0 0 1rem">حالة التهيئة التقنية وترتيب الكلمات.</p>
  <div style="display:grid;gap:1rem;grid-template-columns:1fr" class="lg:grid-cols-2">
    <div class="stat-card"><b>البيانات المنظمة (Schema)</b>
      ${pages.map(([p, sch]) => `<div style="padding:.4rem 0;border-bottom:1px solid var(--line);font-size:.85rem"><span style="color:var(--success)">✓</span> <b>${p}</b><div class="text-faint" style="font-size:.75rem">${sch}</div></div>`).join('')}
    </div>
    <div class="stat-card"><b>بنية Silo</b>
      <pre style="font-size:.78rem;line-height:1.8;color:var(--ink-soft);margin:.5rem 0 0;font-family:inherit">الرئيسية
├─ الخدمات ← 6 صفحات
├─ الأعمال ← 8 مشاريع
├─ المدونة ← 4 مقالات
├─ الأسعار
└─ تواصل</pre>
    </div>
    <div class="stat-card"><b>ترتيب الكلمات <span class="pill pill-demo" style="font-size:.6rem">تجريبي</span></b>
      <div class="scroll-x"><table class="a-table" style="min-width:280px;margin-top:.5rem"><thead><tr><th>الكلمة</th><th>المركز</th><th>التغيّر</th></tr></thead>
      <tbody>${s.seo.keywords.map(k => `<tr><td>${esc(k.term)}</td><td>${k.position}</td><td style="color:${k.change>0?'var(--success)':k.change<0?'var(--danger)':'var(--ink-faint)'}">${k.change>0?'▲':k.change<0?'▼':'–'} ${Math.abs(k.change)}</td></tr>`).join('')}</tbody></table></div>
    </div>
    <div class="stat-card"><b>Core Web Vitals (الرئيسية)</b>
      <div style="display:grid;gap:.4rem;margin-top:.5rem;font-size:.88rem">
        <div style="display:flex;justify-content:space-between"><span>Accessibility</span><b style="color:var(--success)">100</b></div>
        <div style="display:flex;justify-content:space-between"><span>Best Practices</span><b style="color:var(--success)">100</b></div>
        <div style="display:flex;justify-content:space-between"><span>SEO</span><b style="color:var(--success)">100</b></div>
        <div style="display:flex;justify-content:space-between"><span>CLS</span><b style="color:var(--warning)">0.149</b></div>
      </div>
    </div>
  </div>`;
}

function settingsPage() {
  const s = Store.load();
  const f = (label, path, val, type = 'text') => `<label style="font-size:.82rem">${label}<input class="a-input js-set" data-path="${path}" type="${type}" value="${esc(val)}"></label>`;
  view.innerHTML = `
  <h1 style="font-size:1.5rem;margin:0 0 .3rem">الإعدادات</h1>
  <p class="text-soft" style="margin:0 0 1rem">تنعكس على كل صفحات الموقع.</p>
  <div class="card-zi" style="display:grid;gap:.7rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
    ${f('اسم النشاط', 'settings.brand', s.settings.brand)}
    ${f('الشعار النصي', 'settings.tagline', s.settings.tagline)}
    ${f('المدينة الأساسية', 'settings.city', s.settings.city)}
    ${f('الجوال', 'settings.phone', s.settings.phone)}
    ${f('واتساب (دولي)', 'settings.whatsapp', s.settings.whatsapp)}
    ${f('العنوان', 'settings.address', s.settings.address)}
    ${f('ساعات العمل', 'settings.hours', s.settings.hours)}
  </div>
  <div class="card-zi" style="margin-top:.8rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.6rem">
    <label style="display:flex;align-items:center;gap:.5rem;font-size:.9rem"><input type="checkbox" id="s-demo" ${s.settings.demo?'checked':''} style="width:20px;height:20px;accent-color:var(--violet-500)"> وضع العرض التجريبي (يُظهر شارات «تجريبي»)</label>
    <button class="btn-zi btn-ghost" id="s-reset" style="min-height:40px;color:var(--danger);border-color:var(--danger)">إعادة ضبط كل البيانات</button>
  </div>`;
  view.querySelectorAll('.js-set').forEach(i => i.onchange = e => { Store.set(e.target.dataset.path, e.target.value); toast('حُفظ'); });
  view.querySelector('#s-demo').onchange = e => { Store.set('settings.demo', e.target.checked); document.getElementById('demo-banner').style.display = e.target.checked ? '' : 'none'; toast('حُفظ'); };
  view.querySelector('#s-reset').onclick = () => { if (confirm('إعادة ضبط كل البيانات إلى الافتراضي؟')) { Store.reset(); toast('أُعيد الضبط'); location.reload(); } };
}

// ---------- التوجيه ----------
const routes = { overview, leads: leadsPage, pricing: pricingPage, articles: articlesPage, projects: projectsPage, services: servicesPage, seo: seoPage, settings: settingsPage };

function route() {
  const r = (location.hash.replace('#', '') || 'overview');
  document.querySelectorAll('.side-link[data-route]').forEach(l => l.classList.toggle('active', l.dataset.route === r));
  (routes[r] || overview)();
  document.querySelector('.admin-side')?.classList.remove('open');
  window.scrollTo(0, 0);
}

document.querySelectorAll('.side-link[data-route]').forEach(l => l.onclick = () => { location.hash = l.dataset.route; });
window.addEventListener('hashchange', route);

// شارة الوضع التجريبي
if (!Store.load().settings.demo) document.getElementById('demo-banner').style.display = 'none';

route();
