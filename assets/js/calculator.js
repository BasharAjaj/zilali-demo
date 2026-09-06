// ظلالي — الحاسبة التفاعلية. مستقلة عن الثري دي. معاينة SVG ثنائية خفيفة.
import { estimatePrice } from './pricing.js';
import { Store } from './store.js';
import { toast } from './site.js';

const shadeText = { 'كثيف': 'ظل كثيف', 'جزئي': 'ظل جزئي', 'مخطط': 'ظل مخطط', 'ناعم': 'ظل ناعم' };

export function mountCalculator(root) {
  if (!root) return;
  let s = Store.load();
  const typeKeys = Object.keys(s.pricing.types);

  const state = {
    length: 6, width: 5,
    typeKey: 'gardenShades',
    material: 'pvc',
    city: s.settings.city,
    withInstall: true
  };

  root.innerHTML = `
  <div class="calc-shell">
    <div class="card-zi" style="display:flex;flex-direction:column;gap:1.15rem">
      <div style="display:flex;gap:.4rem;justify-content:center" id="calc-dots"></div>

      <div>
        <div style="font-weight:700;margin-bottom:.5rem">1 · كم مساحة تريد تظليلها؟</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.9rem">
          <label style="font-size:.85rem;color:var(--ink-soft)">الطول: <b id="lbl-len">6</b> م
            <input class="range-zi" type="range" min="2" max="20" step="0.5" value="6" id="in-len"></label>
          <label style="font-size:.85rem;color:var(--ink-soft)">العرض: <b id="lbl-wid">5</b> م
            <input class="range-zi" type="range" min="2" max="20" step="0.5" value="5" id="in-wid"></label>
        </div>
        <div style="text-align:center;margin-top:.5rem;font-weight:700;color:var(--violet-600)">= <span id="lbl-area">30</span> م²</div>
      </div>

      <div>
        <div style="font-weight:700;margin-bottom:.5rem">2 · ما الحل المناسب؟ <span id="suggest" class="pill pill-sand" style="font-size:.68rem"></span></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem" id="type-grid"></div>
      </div>

      <div>
        <div style="font-weight:700;margin-bottom:.5rem">3 · اختر الخامة</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.55rem" id="mat-grid"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr auto;gap:.9rem;align-items:end">
        <label style="font-size:.85rem;color:var(--ink-soft)">المدينة
          <select id="in-city" style="width:100%;margin-top:.3rem;padding:.6rem;border:1px solid var(--line-strong);border-radius:10px"></select></label>
        <label style="font-size:.85rem;color:var(--ink-soft);display:flex;align-items:center;gap:.5rem;padding-bottom:.6rem">
          <input type="checkbox" id="in-install" checked style="width:20px;height:20px;accent-color:var(--violet-500)"> يشمل التركيب</label>
      </div>
    </div>

    <div class="calc-preview-wrap">
      <div class="calc-preview" id="calc-preview"></div>
      <div class="result-card" style="margin-top:1rem">
        <div style="opacity:.85;font-size:.9rem">التقدير المبدئي</div>
        <div class="result-num"><span id="res-low">0</span> – <span id="res-high">0</span> <span style="font-size:1rem">ريال</span></div>
        <div id="res-note" style="font-size:.82rem;opacity:.9;margin-top:.3rem">السعر النهائي بعد المعاينة المجانية.</div>
        <div style="display:grid;gap:.5rem;margin-top:1rem">
          <a class="btn-zi btn-whatsapp btn-block js-wa-calc" href="#" target="_blank" rel="noopener">فتح واتساب وإرسال التفاصيل</a>
          <button class="btn-zi btn-ghost btn-block" id="btn-visit" style="background:#fff;color:var(--violet-700)">طلب معاينة</button>
        </div>
      </div>
    </div>
  </div>

  <dialog id="visit-dialog" style="border:none;border-radius:16px;padding:0;max-width:420px;width:92%">
    <form id="visit-form" style="padding:1.4rem;display:flex;flex-direction:column;gap:.7rem">
      <div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">طلب معاينة مجانية</h3>
        <button type="button" onclick="this.closest('dialog').close()" style="border:none;background:var(--violet-25);width:36px;height:36px;border-radius:9px;cursor:pointer">✕</button></div>
      <p class="text-soft" style="font-size:.85rem;margin:0" id="visit-summary"></p>
      <input required name="name" placeholder="الاسم" style="padding:.7rem;border:1px solid var(--line-strong);border-radius:10px">
      <input required name="phone" inputmode="tel" placeholder="رقم الجوال" style="padding:.7rem;border:1px solid var(--line-strong);border-radius:10px">
      <input name="district" placeholder="الحي (اختياري)" style="padding:.7rem;border:1px solid var(--line-strong);border-radius:10px">
      <textarea name="note" placeholder="ملاحظة (اختياري)" rows="2" style="padding:.7rem;border:1px solid var(--line-strong);border-radius:10px"></textarea>
      <button class="btn-zi btn-primary btn-block" type="submit">إرسال الطلب</button>
    </form>
  </dialog>`;

  const $ = id => root.querySelector('#' + id) || document.getElementById(id);
  const dialog = root.querySelector('#visit-dialog');

  // المدن
  $('in-city').innerHTML = s.settings.cities.map(c => `<option ${c === state.city ? 'selected' : ''}>${c}</option>`).join('');

  // النقاط
  $('calc-dots').innerHTML = [0,1,2,3].map(i => `<span class="step-dot ${i===0?'on':''}"></span>`).join('');

  function suggestType(area) {
    if (area <= 12) return 'screens';
    if (area <= 25) return 'gardenShades';
    if (area <= 45) return 'carShades';
    if (area <= 120) return 'pergola';
    return 'hangars';
  }

  function renderTypes() {
    const area = state.length * state.width;
    const sug = suggestType(area);
    $('suggest').textContent = 'الأكثر طلباً: ' + s.pricing.types[sug].name;
    $('type-grid').innerHTML = typeKeys.map(k => `
      <div class="choice ${k===state.typeKey?'sel':''}" data-type="${k}">
        <span>${s.pricing.types[k].name}</span>${k===sug?'<span style="font-size:.62rem;color:var(--sand-700)">مُقترح</span>':''}
      </div>`).join('');
  }
  function renderMaterials() {
    const mats = s.pricing.types[state.typeKey].materials;
    if (!mats[state.material]) state.material = Object.keys(mats)[0];
    $('mat-grid').innerHTML = Object.entries(mats).map(([k,v]) => `
      <div class="choice ${k===state.material?'sel':''}" data-mat="${k}">
        <span>${v.name}</span><span style="font-size:.68rem;color:var(--ink-faint)">${shadeText[v.shade]||''}</span>
      </div>`).join('');
  }

  function shadePattern(shade, color) {
    // نمط تعبئة المعاينة حسب كثافة الظل
    if (shade === 'مخطط') return `<defs><pattern id="pp" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${color}" opacity=".18"/><rect width="7" height="14" fill="${color}" opacity=".55"/></pattern></defs>`;
    if (shade === 'جزئي') return '';
    if (shade === 'ناعم') return '';
    return '';
  }
  function fillFor(shade, color) {
    if (shade === 'مخطط') return 'url(#pp)';
    if (shade === 'جزئي') return color + '55';
    if (shade === 'ناعم') return color + '99';
    return color; // كثيف
  }

  function renderPreview(r) {
    const t = s.pricing.types[state.typeKey];
    const shade = t.materials[state.material].shade;
    const color = 'oklch(57% 0.235 293)';
    // مستطيل منظور علوي متناسب مع الأبعاد
    const maxW = 260, maxH = 150, pad = 30;
    const ratio = state.width / state.length;
    let w = maxW - pad*2, h = w * ratio;
    if (h > maxH - pad*2) { h = maxH - pad*2; w = h / ratio; }
    const x = (maxW - w)/2, y = (maxH - h)/2;
    root.querySelector('#calc-preview').innerHTML = `
    <svg viewBox="0 0 ${maxW} ${maxH}" style="width:100%;display:block" role="img" aria-label="معاينة مقاس ${state.length} في ${state.width} متر">
      ${shadePattern(shade, color)}
      <rect width="${maxW}" height="${maxH}" fill="transparent"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fillFor(shade,color)}" stroke="${color}" stroke-width="2"/>
      <text x="${maxW/2}" y="${y-8}" text-anchor="middle" font-size="11" fill="var(--ink-soft)">${state.length} م</text>
      <text x="${x-8}" y="${maxH/2}" text-anchor="middle" font-size="11" fill="var(--ink-soft)" transform="rotate(-90 ${x-8} ${maxH/2})">${state.width} م</text>
      <text x="${maxW/2}" y="${maxH/2+4}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${r.area} م²</text>
    </svg>
    <div style="text-align:center;padding:.5rem;font-size:.8rem;color:var(--ink-soft)">${t.name} • ${shadeText[shade]}</div>`;
  }

  let lastLow = 0, lastHigh = 0;
  function tween(el, from, to) {
    const t0 = performance.now(), dur = 320;
    const step = t => { const p = Math.min((t-t0)/dur,1); const e = 1-Math.pow(1-p,3);
      el.textContent = Math.round(from + (to-from)*e).toLocaleString('ar-EG'); if (p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  function recompute() {
    s = Store.load(); // يلتقط أي تعديل من لوحة التحكم
    const r = estimatePrice(state, s.pricing);
    tween($('res-low'), lastLow, r.low); tween($('res-high'), lastHigh, r.high);
    lastLow = r.low; lastHigh = r.high;
    $('res-note').textContent = r.minApplied ? 'تم تطبيق الحد الأدنى للطلب. السعر النهائي بعد المعاينة.' : 'السعر النهائي بعد المعاينة المجانية.';
    renderPreview(r);
    // رسالة واتساب
    const t = s.pricing.types[state.typeKey];
    const msg = `مرحباً ${s.settings.brand}، أرغب في ${t.name} (${t.materials[state.material].name}) بمقاس ${state.length}×${state.width} م (${r.area} م²) في ${state.city}. التقدير المبدئي من الموقع ${r.low}–${r.high} ريال. أود طلب معاينة.`;
    root.querySelector('.js-wa-calc').setAttribute('href', 'https://wa.me/' + s.settings.whatsapp + '?text=' + encodeURIComponent(msg));
    root.querySelector('#visit-summary').textContent = `${t.name} • ${t.materials[state.material].name} • ${state.length}×${state.width} م • ${state.city} • تقدير ${r.low}–${r.high} ريال`;
    return r;
  }

  // الأحداث
  $('in-len').addEventListener('input', e => { state.length = +e.target.value; $('lbl-len').textContent = state.length; $('lbl-area').textContent = (state.length*state.width); renderTypes(); recompute(); });
  $('in-wid').addEventListener('input', e => { state.width = +e.target.value; $('lbl-wid').textContent = state.width; $('lbl-area').textContent = (state.length*state.width); renderTypes(); recompute(); });
  $('in-city').addEventListener('change', e => { state.city = e.target.value; recompute(); });
  $('in-install').addEventListener('change', e => { state.withInstall = e.target.checked; recompute(); });
  root.querySelector('#type-grid').addEventListener('click', e => {
    const c = e.target.closest('[data-type]'); if (!c) return;
    state.typeKey = c.dataset.type; renderTypes(); renderMaterials(); recompute();
  });
  root.querySelector('#mat-grid').addEventListener('click', e => {
    const c = e.target.closest('[data-mat]'); if (!c) return;
    state.material = c.dataset.mat; renderMaterials(); recompute();
  });
  $('btn-visit').addEventListener('click', () => dialog.showModal());
  root.querySelector('#visit-form').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target); const r = estimatePrice(state, Store.load().pricing);
    const st = Store.load();
    st.leads.push({ id: 'L' + (st.leads.length+1), createdAt: new Date().toISOString().slice(0,10),
      name: fd.get('name'), phone: fd.get('phone'), district: fd.get('district')||'', note: fd.get('note')||'',
      type: st.pricing.types[state.typeKey].name, material: st.pricing.types[state.typeKey].materials[state.material].name,
      length: state.length, width: state.width, area: r.area, city: state.city, low: r.low, high: r.high,
      source: 'calculator', status: 'new' });
    Store.set('leads', st.leads);
    dialog.close(); e.target.reset(); toast('وصل طلبك — سنتواصل معك خلال ساعات العمل');
  });

  // المزامنة الحية مع لوحة التحكم
  window.addEventListener('zilali:change', recompute);
  window.addEventListener('storage', e => { if (e.key === Store.KEY) recompute(); });

  renderTypes(); renderMaterials(); recompute();
}
