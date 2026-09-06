import assert from 'node:assert';
import { SEED } from '../assets/js/seed.js';
import { estimatePrice } from '../assets/js/pricing.js';

const P = SEED.pricing;

// مظلة جلسات PVC 6×5 = 30م² بالرياض مع تركيب: 30*200*1.00 + 900 = 6900
let r = estimatePrice({ typeKey: 'gardenShades', material: 'pvc', length: 6, width: 5, city: 'الرياض', withInstall: true }, P);
assert.equal(r.area, 30, 'المساحة');
assert.equal(r.subtotal, 6000, 'المجموع الفرعي');
assert.equal(r.install, 900, 'التركيب');
assert.equal(r.estimate, 6900, 'التقدير');
assert.equal(r.minApplied, false, 'لا حد أدنى');
assert.equal(r.low, 6050, 'الحد الأدنى للنطاق (6072→6050)');
assert.equal(r.high, 7750, 'الحد الأعلى للنطاق (7728→7750)');

// الحد الأدنى: سواتر قماش 2×2 = 4م² *140 = 560 < 1800 → estimate=1800
let m = estimatePrice({ typeKey: 'screens', material: 'fabric', length: 2, width: 2, city: 'الرياض', withInstall: false }, P);
assert.equal(m.minApplied, true, 'طُبّق الحد الأدنى');
assert.equal(m.estimate, 1800, 'التقدير = الحد الأدنى');

// معامل المدينة: مكة 1.08 على 30م² PVC جلسات بلا تركيب
let c = estimatePrice({ typeKey: 'gardenShades', material: 'pvc', length: 6, width: 5, city: 'مكة', withInstall: false }, P);
assert.equal(c.subtotal, Math.round(30 * 200 * 1.08), 'معامل مكة');

// مدينة غير مذكورة تسقط على "أخرى" (1.10)
let o = estimatePrice({ typeKey: 'screens', material: 'steel', length: 10, width: 3, city: 'حائل', withInstall: true }, P);
assert.equal(o.subtotal, Math.round(30 * 160 * 1.10), 'مدينة غير مذكورة → أخرى');

console.log('pricing: PASS');
