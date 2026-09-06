// ظلالي — محرّك التسعير. دالة نقية قابلة للاختبار. المعادلة من مواصفة §8.
const r50 = n => Math.round(n / 50) * 50;

export function estimatePrice(input, pricing) {
  const t = pricing.types[input.typeKey];
  if (!t) throw new Error('نوع غير معروف: ' + input.typeKey);
  const mat = t.materials[input.material];
  if (!mat) throw new Error('خامة غير معروفة: ' + input.material);
  const base = mat.pricePerM2;
  const area = +(input.length * input.width).toFixed(2);
  const factor = pricing.cityFactor[input.city] ?? pricing.cityFactor['أخرى'];
  const subtotal = Math.round(area * base * factor);
  const install = input.withInstall ? t.installFee : 0;
  let estimate = subtotal + install;
  const minApplied = estimate < t.minOrder;
  if (minApplied) estimate = t.minOrder;
  return {
    area, base, subtotal, install, estimate, minApplied,
    low: r50(estimate * (1 - pricing.rangePct)),
    high: r50(estimate * (1 + pricing.rangePct))
  };
}
