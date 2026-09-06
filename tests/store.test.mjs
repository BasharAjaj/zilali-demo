import assert from 'node:assert';
// polyfill بسيط قبل استيراد الوحدة
globalThis.localStorage = (() => { let m = {}; return {
  getItem: k => (k in m ? m[k] : null),
  setItem: (k, v) => { m[k] = String(v); },
  removeItem: k => { delete m[k]; },
  clear: () => { m = {}; }
}; })();
globalThis.window = { dispatchEvent() {} };

const { Store } = await import('../assets/js/store.js');

Store.reset();
const s = Store.load();
assert.equal(s.settings.city, 'الرياض', 'المدينة الافتراضية');
assert.equal(s.pricing.rangePct, 0.12, 'نسبة النطاق');
assert.equal(s.settings.stats.ratingVerified, false, 'التقييم غير موثّق افتراضياً');
assert.ok(Array.isArray(s.leads), 'leads مصفوفة');

Store.set('pricing.rangePct', 0.2);
assert.equal(Store.load().pricing.rangePct, 0.2, 'الكتابة بمسار نقطي تُحفظ');
assert.equal(Store.get('settings.brand'), 'ظلالي', 'get بمسار');

Store.set('pricing.types.carShades.materials.pvc.pricePerM2', 260);
assert.equal(Store.get('pricing.types.carShades.materials.pvc.pricePerM2'), 260, 'تعديل سعر خامة يُحفظ');

// إضافة lead
const leads = Store.load().leads;
leads.push({ id: '1', status: 'new' });
Store.set('leads', leads);
assert.equal(Store.load().leads.length, 1, 'حفظ lead');

Store.reset();
assert.equal(Store.load().pricing.rangePct, 0.12, 'reset يعيد الافتراضي');

console.log('store: PASS');
