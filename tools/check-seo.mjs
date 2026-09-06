// ظلالي — فاحص السيو. يفحص كل صفحات HTML العامة (عدا admin, dist).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
const ROOT = join(dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (['admin', 'dist', 'node_modules', '.git', '.superpowers', 'tools', 'tests', 'docs', 'assets'].includes(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let errors = 0, checked = 0;
for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const errs = [];
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errs.push(`H1 = ${h1} (يجب 1)`);
  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1];
  if (!title) errs.push('لا title');
  else if (title.length < 30 || title.length > 70) errs.push(`طول title=${title.length} (المفضّل 50-60)`);
  const desc = (html.match(/<meta name="description" content="(.*?)"/s) || [])[1];
  if (!desc) errs.push('لا description');
  else if (desc.length < 110 || desc.length > 180) errs.push(`طول description=${desc.length} (المفضّل 140-160)`);
  if (!/rel="canonical"/.test(html)) errs.push('لا canonical');
  if (!/lang="ar"/.test(html) || !/dir="rtl"/.test(html)) errs.push('لا lang/dir');
  if (/aggregateRating/.test(html)) errs.push('يحتوي aggregateRating (ممنوع)');
  // صلاحية JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  blocks.forEach((b, i) => { try { JSON.parse(b[1]); } catch { errs.push(`JSON-LD #${i + 1} غير صالح`); } });
  checked++;
  if (errs.length) { errors += errs.length; console.log(`✗ ${rel}\n   - ${errs.join('\n   - ')}`); }
  else console.log(`✓ ${rel}`);
}
console.log(`\nفُحصت ${checked} صفحة، ${errors} خطأ.`);
process.exit(errors ? 1 : 0);
