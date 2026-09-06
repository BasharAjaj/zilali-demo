// ظلالي — إدارة الحالة فوق localStorage. كل قراءة/كتابة تمرّ من هنا.
import { SEED } from './seed.js';

const KEY = 'zilali:v1';
function clone(o) { return JSON.parse(JSON.stringify(o)); }

export const Store = {
  KEY,
  load() {
    let saved = {};
    try { const raw = localStorage.getItem(KEY); if (raw) saved = JSON.parse(raw); } catch { saved = {}; }
    const base = clone(SEED);
    // دمج سطحي للمفاتيح العليا مع دمج أعمق للكائنات المتداخلة المهمة
    const merged = Object.assign(base, saved);
    merged.settings = Object.assign({}, base.settings, saved.settings || {});
    if (saved.settings) {
      merged.settings.stats = Object.assign({}, base.settings.stats, (saved.settings.stats || {}));
      merged.settings.social = Object.assign({}, base.settings.social, (saved.settings.social || {}));
    }
    merged.pricing = Object.assign({}, base.pricing, saved.pricing || {});
    if (saved.pricing) {
      merged.pricing.cityFactor = Object.assign({}, base.pricing.cityFactor, (saved.pricing.cityFactor || {}));
      merged.pricing.types = saved.pricing.types || base.pricing.types;
    }
    if (!Array.isArray(merged.leads)) merged.leads = [];
    return merged;
  },
  save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ممتلئ أو محظور */ }
    try { window.dispatchEvent(new CustomEvent('zilali:change')); } catch { /* لا window */ }
  },
  get(path) {
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), this.load());
  },
  set(path, value) {
    const s = this.load();
    const ks = path.split('.');
    let o = s;
    for (let i = 0; i < ks.length - 1; i++) {
      if (o[ks[i]] == null || typeof o[ks[i]] !== 'object') o[ks[i]] = {};
      o = o[ks[i]];
    }
    o[ks[ks.length - 1]] = value;
    this.save(s);
    return s;
  },
  reset() {
    try { localStorage.removeItem(KEY); } catch { /* محظور */ }
    try { window.dispatchEvent(new CustomEvent('zilali:change')); } catch { /* لا window */ }
    return clone(SEED);
  }
};
