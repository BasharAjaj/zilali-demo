// ظلالي — توليد sitemap.xml من الصفحات الموجودة.
import { SEED as S } from '../assets/js/seed.js';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
const ROOT = join(dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const BASE = 'https://zilali.example/';
const urls = [
  '', 'services/', 'projects/', 'blog/', 'pricing/', 'contact/',
  ...S.services.map(s => `services/${s.slug}/`),
  ...S.projects.map(p => `projects/${p.slug}/`),
  ...S.articles.map(a => `blog/${a.slug}/`)
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${BASE}${u}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>\n`;
writeFileSync(join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log('sitemap.xml: ' + urls.length + ' urls');
