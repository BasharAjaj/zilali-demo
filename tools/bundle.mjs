// ظلالي — مُجمِّع نسخة ملف-واحد للنشر كـ Artifact.
// يدمج CSS داخل <style>، ويحوّل وحدات ES إلى سكربت واحد (بإزالة import/export)،
// لأن الـ Artifact يمنع ملفات CSS/JS المحلية الخارجية.
// التشغيل: node tools/bundle.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
const ROOT = join(dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const R = p => readFileSync(join(ROOT, p), 'utf8');

const daisy = R('assets/css/daisyui.css');
const site = R('assets/css/site.css');

// إزالة سطور import وكلمة export من وحدة
function strip(src) {
  return src
    .replace(/^\s*import[^\n;]*;?\s*$/gm, '')       // سطور الاستيراد
    .replace(/^\s*export\s+(const|function|let|var|class)\b/gm, '$1') // export decl
    .replace(/^\s*export\s*\{[^}]*\};?\s*$/gm, '');  // export { ... }
}

// وحدات مشتركة بترتيب التبعية
const MODS = {
  seed: strip(R('assets/js/seed.js')),
  store: strip(R('assets/js/store.js')),
  pricing: strip(R('assets/js/pricing.js')),
  partials: strip(R('assets/partials.js')),
  site: strip(R('assets/js/site.js')),
  calculator: strip(R('assets/js/calculator.js')),
  admin: strip(R('assets/js/admin.js'))
};

function inlineHead(html) {
  return html
    .replace(/<link rel="stylesheet" href="[^"]*daisyui\.css">/, `<style id="daisy">\n${daisy}\n</style>`)
    .replace(/<link rel="stylesheet" href="[^"]*site\.css">/, `<style id="site">\n${site}\n</style>`)
    // أزل روابط الأصول المحلية التي لا تعمل في Artifact (favicon/manifest) لتفادي 404
    .replace(/<link rel="icon"[^>]*>/g, '')
    .replace(/<link rel="manifest"[^>]*>/g, '');
}

// بناء الرئيسية
function bundleIndex() {
  let html = R('index.html');
  html = inlineHead(html);
  // استخرج سكربت الصفحة المضمّن
  const m = html.match(/<script type="module">([\s\S]*?)<\/script>\s*<\/body>/);
  const pageBody = strip(m[1]);
  const combined = [MODS.seed, MODS.store, MODS.pricing, MODS.partials, MODS.site, MODS.calculator, pageBody].join('\n');
  html = html.replace(/<script type="module">[\s\S]*?<\/script>\s*<\/body>/, `<script>\n${combined}\n</script>\n</body>`);
  return html;
}

// بناء لوحة التحكم
function bundleAdmin() {
  let html = R('admin/index.html');
  html = inlineHead(html);
  html = html.replace(/<script type="module" src="[^"]*admin\.js"><\/script>/, `<script>\n${MODS.seed}\n${MODS.store}\n${MODS.admin}\n</script>`);
  // صحّح روابط الموقع النسبية (../) لأن الملف المفرد ليس داخل مجلد admin
  html = html.replace(/href="\.\.\/index\.html"/g, 'href="#"').replace(/href="\.\.\/pricing\/index\.html"/g, 'href="#"');
  return html;
}

// نسخة Artifact: بلا وسوم doctype/html/head/body (المنصة تلفّها)، وRTL يُضبط وقت التشغيل.
function toArtifact(fullHtml, dataRoot) {
  const title = (fullHtml.match(/<title>([\s\S]*?)<\/title>/) || [, 'ظلالي'])[1];
  const headInner = (fullHtml.match(/<head>([\s\S]*?)<\/head>/) || [, ''])[1];
  const bodyInner = (fullHtml.match(/<body>([\s\S]*?)<\/body>/) || [, ''])[1];
  // أزل <title> من الهيدر (سنضعه في الأعلى) واترك الباقي (fonts, tailwind, styles, meta, jsonld)
  const headNoTitle = headInner.replace(/<title>[\s\S]*?<\/title>/, '');
  const setup = `<script>document.documentElement.setAttribute('dir','rtl');document.documentElement.setAttribute('lang','ar');document.documentElement.setAttribute('data-theme','zilali');document.documentElement.setAttribute('data-root','${dataRoot}');</script>`;
  return `<title>${title}</title>\n${setup}\n${headNoTitle}\n${bodyInner}`;
}

mkdirSync(join(ROOT, 'dist'), { recursive: true });
const idx = bundleIndex(), adm = bundleAdmin();
writeFileSync(join(ROOT, 'dist/index.html'), idx, 'utf8');
writeFileSync(join(ROOT, 'dist/admin.html'), adm, 'utf8');
writeFileSync(join(ROOT, 'dist/artifact-index.html'), toArtifact(idx, ''), 'utf8');
writeFileSync(join(ROOT, 'dist/artifact-admin.html'), toArtifact(adm, '../'), 'utf8');
['index.html', 'admin.html', 'artifact-index.html', 'artifact-admin.html'].forEach(f =>
  console.log('dist/' + f + ': ' + Math.round(readFileSync(join(ROOT, 'dist/' + f)).length / 1024) + 'KB'));
