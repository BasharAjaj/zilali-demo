// ظلالي — مولّد الصفحات الثابتة من seed.js. ينتج HTML بمحتوى سيو ثابت (لا localStorage).
// التشغيل: node tools/generate.mjs
import { SEED as S } from '../assets/js/seed.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const city = S.settings.city;
const brand = S.settings.brand;

function w(rel, html) { const p = join(ROOT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, html, 'utf8'); console.log('· ' + rel); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function typeName(k) { return S.pricing.types[k]?.name || 'أخرى'; }

// رأس مشترك بوسوم السيو. root = بادئة الجذر (مثل "../" أو "../../")
function head({ title, desc, canonical, root, jsonld = [], active }) {
  const ld = jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!doctype html>
<html lang="ar" dir="rtl" data-theme="zilali" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="https://zilali.example/${canonical}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_SA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="https://zilali.example/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}assets/img/favicon.svg">
<link rel="manifest" href="${root}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<link rel="stylesheet" href="${root}assets/css/daisyui.css">
<link rel="stylesheet" href="${root}assets/css/site.css">
${ld}
</head>
<body>
<div data-slot="header"></div>
<main>`;
}
function foot({ root, active }) {
  return `</main>
<div data-slot="footer"></div>
<script type="module">import { initSite } from '${root}assets/js/site.js'; initSite('${active}');</script>
</body></html>`;
}
function breadcrumb(items) { // [{name,url}]
  return { "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement": items.map((it,i)=>({"@type":"ListItem","position":i+1,"name":it.name,"item":"https://zilali.example/"+it.url})) };
}
function crumbHtml(items) {
  return `<nav aria-label="مسار التنقّل" class="container-zi" style="padding-top:1rem;font-size:.85rem;color:var(--ink-soft)">${items.map((it,i)=>i<items.length-1?`<a href="${it.href}">${it.name}</a> / `:`<span>${it.name}</span>`).join('')}</nav>`;
}
function ctaBlock(root) {
  return `<section class="section"><div class="container-zi"><div class="card-zi" style="background:linear-gradient(150deg,var(--violet-500),var(--violet-700));color:#fff;text-align:center">
    <h2 style="color:#fff;font-size:1.5rem">جاهز لتبدأ مشروعك؟</h2>
    <p style="color:oklch(92% .04 293);margin-bottom:1.2rem">احصل على تقدير مبدئي فوري أو تواصل معنا مباشرة.</p>
    <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
      <a class="btn-zi" style="background:#fff;color:var(--violet-700)" href="${root}pricing/index.html">احسب سعرك</a>
      <a class="btn-zi btn-whatsapp js-wa" href="#">تواصل عبر واتساب</a>
    </div></div></div></section>`;
}

// ---------- صفحة خدمة ----------
function servicePage(sv) {
  const root = '../../';
  const t = S.pricing.types[sv.typeKey];
  const mats = Object.values(t.materials);
  const priceRows = mats.map(m => `<tr><td style="padding:.6rem;border-bottom:1px solid var(--line)">${m.name}</td><td style="padding:.6rem;border-bottom:1px solid var(--line)">${m.pricePerM2} ريال/م²</td><td style="padding:.6rem;border-bottom:1px solid var(--line)">${m.shade==='كثيف'?'ظل كثيف':m.shade==='جزئي'?'ظل جزئي':m.shade==='مخطط'?'ظل مخطط':'ظل ناعم'}</td></tr>`).join('');
  const lo = Math.min(...mats.map(m=>m.pricePerM2)), hi = Math.max(...mats.map(m=>m.pricePerM2));
  const faqs = [
    { q: `كم يبدأ سعر ${sv.name} في ${city}؟`, a: `يبدأ سعر المتر من ${lo} ريال ويعتمد على الخامة والمساحة والتركيب. الحد الأدنى للطلب ${t.minOrder} ريال.` },
    { q: 'هل يشمل السعر التركيب؟', a: `التركيب بند منفصل (يبدأ من ${t.installFee} ريال) ويظهر في التقدير المبدئي من الحاسبة.` },
    { q: 'كم مدة التنفيذ؟', a: 'غالباً من يومين إلى أسبوع بعد المعاينة حسب المساحة.' }
  ];
  const jsonld = [
    { "@context":"https://schema.org","@type":"Service","name":`${sv.name} في ${city}`,"serviceType":sv.name,
      "provider":{"@type":"HomeAndConstructionBusiness","name":brand},"areaServed":{"@type":"City","name":city},
      "offers":{"@type":"Offer","priceCurrency":"SAR","priceRange":`${lo}-${hi} SAR/m2`} },
    breadcrumb([{name:'الرئيسية',url:''},{name:'خدماتنا',url:'services/'},{name:sv.name,url:`services/${sv.slug}/`}]),
    { "@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}})) }
  ];
  const html = head({ title:`${sv.name} في ${city} — تركيب وأسعار | ${brand}`,
    desc:`${sv.name} في ${city}: ${sv.short} خامات متعددة تبدأ من ${lo} ريال للمتر، ضمان مكتوب وتقدير سعر فوري قبل المعاينة.`,
    canonical:`services/${sv.slug}/`, root, jsonld, active:'services' })
  + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'خدماتنا',href:root+'services/index.html'},{name:sv.name}])
  + `<section class="section-tight"><div class="container-zi">
      <span class="eyebrow">${sv.name}</span>
      <h1 style="font-size:clamp(1.8rem,5vw,2.8rem)">${sv.name} في ${city}</h1>
      <p class="section-sub" style="font-size:1.08rem;max-width:60ch">${sv.short} نصمّم ونركّب بخامات مختارة لمناخ ${city} مع ضمان مكتوب.</p>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem">
        <a class="btn-zi btn-primary" href="${root}pricing/index.html">احسب سعر ${sv.name}</a>
        <a class="btn-zi btn-whatsapp js-wa" href="#">استشارة مجانية</a>
      </div></div></section>
      <section class="section-tight"><div class="container-zi">
        <h2 class="section-title" style="font-size:1.6rem">الخامات والأسعار</h2>
        <div class="scroll-x"><table style="width:100%;border-collapse:collapse;min-width:420px;background:var(--paper-raised);border:1px solid var(--line);border-radius:12px;overflow:hidden">
          <thead><tr style="background:var(--violet-50)"><th style="padding:.7rem;text-align:right">الخامة</th><th style="padding:.7rem;text-align:right">السعر التقريبي</th><th style="padding:.7rem;text-align:right">نوع الظل</th></tr></thead>
          <tbody>${priceRows}</tbody></table></div>
        <p class="text-faint" style="font-size:.82rem;margin-top:.6rem">* أسعار تقريبية للعرض، والسعر النهائي بعد المعاينة المجانية.</p>
      </div></section>
      <section class="section-tight"><div class="container-zi">
        <h2 class="section-title" style="font-size:1.6rem">لماذا ظلالي لـ${sv.name}؟</h2>
        <div class="grid-auto">
          ${S.settings.promises.map(p=>`<div class="card-zi"><h3 style="font-size:1.05rem">${p.title}</h3><p class="text-soft" style="font-size:.9rem;margin:0">${p.text}</p></div>`).join('')}
        </div></div></section>
      <section class="section-tight"><div class="container-zi" style="max-width:760px">
        <h2 class="section-title" style="font-size:1.6rem">أسئلة شائعة</h2>
        ${faqs.map(f=>`<details class="card-zi" style="margin-bottom:.6rem"><summary style="cursor:pointer;font-weight:700;list-style:none">${f.q}</summary><p class="text-soft" style="margin:.6rem 0 0">${f.a}</p></details>`).join('')}
      </div></section>`
  + ctaBlock(root) + foot({ root, active:'services' });
  w(`services/${sv.slug}/index.html`, html);
}

// ---------- صفحة مقال ----------
function articlePage(a) {
  const root = '../../';
  const secHtml = a.sections.map(s=>`<h2>${s.h2}</h2>${s.html}`).join('\n');
  const wordCount = (a.sections.map(s=>s.html).join(' ').replace(/<[^>]+>/g,' ')).split(/\s+/).length;
  const jsonld = [
    { "@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.metaDescription,
      "author":{"@type":"Person","name":`${brand} — فريق المحتوى`},"datePublished":a.date,
      "image":"https://zilali.example/assets/img/og.png","publisher":{"@type":"Organization","name":brand} },
    breadcrumb([{name:'الرئيسية',url:''},{name:'المدونة',url:'blog/'},{name:a.title,url:`blog/${a.slug}/`}]),
    { "@context":"https://schema.org","@type":"FAQPage","mainEntity":a.faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}})) }
  ];
  const html = head({ title:a.metaTitle, desc:a.metaDescription, canonical:`blog/${a.slug}/`, root, jsonld, active:'blog' })
  + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'المدونة',href:root+'blog/index.html'},{name:a.title}])
  + `<article class="section-tight"><div class="container-zi" style="max-width:760px">
      <div class="pill pill-sand" style="margin-bottom:.5rem">${a.readMins} دقائق قراءة</div>
      <h1 style="font-size:clamp(1.7rem,5vw,2.5rem)">${a.title}</h1>
      <div style="display:flex;align-items:center;gap:.6rem;margin:.8rem 0 1.4rem;color:var(--ink-soft);font-size:.9rem">
        <span style="width:36px;height:36px;border-radius:999px;background:var(--violet-100);display:grid;place-items:center;font-weight:700;color:var(--violet-700)">ظ</span>
        <span>فريق ${brand} · ${a.date}</span>
      </div>
      <p style="font-size:1.1rem;font-weight:600;color:var(--ink)">${a.excerpt}</p>
      <div class="article-body" style="line-height:1.9">${secHtml}</div>
      <div class="card-zi" style="margin-top:1.5rem;background:var(--violet-25)">
        <h2 style="font-size:1.2rem">أسئلة شائعة</h2>
        ${a.faqs.map(f=>`<details style="margin-bottom:.5rem"><summary style="cursor:pointer;font-weight:700">${f.q}</summary><p class="text-soft" style="margin:.5rem 0 0">${f.a}</p></details>`).join('')}
      </div>
      <p class="text-faint" style="font-size:.78rem;margin-top:1rem">محتوى تجريبي للعرض — يُستبدل بمحتوى العميل ويُوقّع باسمه.</p>
      <div style="margin-top:1.4rem;display:flex;gap:.6rem;flex-wrap:wrap">
        <a class="btn-zi btn-primary" href="${root}pricing/index.html">احسب سعرك الآن</a>
        <a class="btn-zi btn-ghost" href="${root}blog/index.html">مقالات أخرى</a>
      </div>
    </div></article>`
  + foot({ root, active:'blog' });
  w(`blog/${a.slug}/index.html`, html);
}

// ---------- صفحة مشروع ----------
function projectPage(p) {
  const root = '../../';
  const related = S.projects.filter(x=>x.typeKey===p.typeKey && x.slug!==p.slug).slice(0,3);
  const jsonld = [
    { "@context":"https://schema.org","@type":"CreativeWork","name":p.title,"about":typeName(p.typeKey),
      "locationCreated":{"@type":"Place","name":`${p.city} — ${p.district}`},"description":p.summary },
    breadcrumb([{name:'الرئيسية',url:''},{name:'أعمالنا',url:'projects/'},{name:p.title,url:`projects/${p.slug}/`}])
  ];
  const fact = (k,v)=>`<div><div class="text-faint" style="font-size:.8rem">${k}</div><div style="font-weight:700">${v}</div></div>`;
  const html = head({ title:`${p.title} — ${typeName(p.typeKey)} في ${p.city} | ${brand}`, desc:`${p.summary} مشروع ${typeName(p.typeKey)} من تنفيذ ظلالي في ${p.city} — حي ${p.district} بمساحة ${p.areaM2} م² وخامة ${p.material}، مُنجز خلال ${p.days} أيام مع ضمان مكتوب.`,
    canonical:`projects/${p.slug}/`, root, jsonld, active:'projects' })
  + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'أعمالنا',href:root+'projects/index.html'},{name:p.title}])
  + `<section class="section-tight"><div class="container-zi">
      <h1 style="font-size:clamp(1.6rem,4.5vw,2.4rem)">${p.title}</h1>
      <div style="aspect-ratio:16/8;background:linear-gradient(135deg,var(--violet-100),var(--sand-200));border-radius:var(--radius);display:grid;place-items:center;color:var(--violet-700);font-weight:700;margin:1rem 0">${typeName(p.typeKey)} — صورة تجريبية</div>
      <div class="card-zi" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:1rem">
        ${fact('النوع',typeName(p.typeKey))}${fact('الخامة',p.material)}${fact('المدينة',p.city+' — '+p.district)}${fact('المساحة',p.areaM2+' م²')}${fact('مدة التنفيذ',p.days+' أيام')}
      </div>
      <p style="margin-top:1.2rem;font-size:1.05rem">${p.summary}</p>
    </div></section>
    ${related.length?`<section class="section-tight"><div class="container-zi"><h2 class="section-title" style="font-size:1.4rem">مشاريع مشابهة</h2><div class="grid-auto">${related.map(r=>`<a class="card-zi card-hover" href="${root}projects/${r.slug}/index.html" style="display:block"><div style="font-weight:700">${r.title}</div><div class="text-soft" style="font-size:.85rem;margin-top:.3rem">${r.city} • ${r.areaM2} م²</div></a>`).join('')}</div></div></section>`:''}`
  + ctaBlock(root) + foot({ root, active:'projects' });
  w(`projects/${p.slug}/index.html`, html);
}

// ---------- الفهارس ----------
function servicesIndex() {
  const root = '../';
  const cards = S.services.map(sv=>`<a class="card-zi card-hover" href="${root}services/${sv.slug}/index.html" style="display:block"><h2 style="font-size:1.2rem;margin:0 0 .3rem">${sv.name}</h2><p class="text-soft" style="font-size:.92rem;margin:0">${sv.short}</p></a>`).join('');
  const jsonld = [ breadcrumb([{name:'الرئيسية',url:''},{name:'خدماتنا',url:'services/'}]) ];
  w('services/index.html', head({ title:`خدمات المظلات والسواتر في ${city} | ${brand}`, desc:`كل خدمات ظلالي في ${city}: مظلات سيارات وجلسات وبرجولات وسواتر وهناجر وبيوت شعر بخامات تتحمّل الحر مع ضمان مكتوب.`, canonical:'services/', root, jsonld, active:'services' })
    + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'خدماتنا'}])
    + `<section class="section"><div class="container-zi"><h1 class="section-title">خدماتنا في ${city}</h1><p class="section-sub">اختر الخدمة لعرض الخامات والأسعار التقريبية.</p><div class="grid-auto" style="margin-top:1.5rem">${cards}</div></div></section>`
    + ctaBlock(root) + foot({ root, active:'services' }));
}
function projectsIndex() {
  const root = '../';
  const cards = S.projects.map(p=>`<a class="card-zi card-hover" href="${root}projects/${p.slug}/index.html" style="display:block;padding:0;overflow:hidden"><div style="aspect-ratio:16/10;background:linear-gradient(135deg,var(--violet-100),var(--sand-200));display:grid;place-items:center;color:var(--violet-700);font-weight:700">${typeName(p.typeKey)}</div><div style="padding:1rem"><div style="font-weight:700">${p.title}</div><div class="text-soft" style="font-size:.85rem;margin-top:.3rem">${p.city} • ${p.district} • ${p.areaM2} م²</div></div></a>`).join('');
  const jsonld = [ breadcrumb([{name:'الرئيسية',url:''},{name:'أعمالنا',url:'projects/'}]) ];
  w('projects/index.html', head({ title:`أعمال ومشاريع المظلات والسواتر في ${city} | ${brand}`, desc:`معرض مشاريع ظلالي المنفّذة في ${city} وغيرها من المدن: مظلات سيارات وجلسات وبرجولات وسواتر وبيوت شعر بمقاسات وخامات مختلفة مع صور وتفاصيل كل مشروع.`, canonical:'projects/', root, jsonld, active:'projects' })
    + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'أعمالنا'}])
    + `<section class="section"><div class="container-zi"><h1 class="section-title">أعمالنا</h1><p class="section-sub">مشاريع حقيقية نفّذناها — اضغط أي مشروع للتفاصيل.</p><div class="grid-auto" style="margin-top:1.5rem">${cards}</div></div></section>`
    + ctaBlock(root) + foot({ root, active:'projects' }));
}
function blogIndex() {
  const root = '../';
  const cards = S.articles.map(a=>`<a class="card-zi card-hover" href="${root}blog/${a.slug}/index.html" style="display:block"><div class="pill pill-sand" style="font-size:.7rem">${a.readMins} دقائق</div><h2 style="font-size:1.1rem;margin:.5rem 0 .3rem">${a.title}</h2><p class="text-soft" style="font-size:.9rem;margin:0">${a.excerpt}</p></a>`).join('');
  const jsonld = [ breadcrumb([{name:'الرئيسية',url:''},{name:'المدونة',url:'blog/'}]) ];
  w('blog/index.html', head({ title:`مدونة المظلات والسواتر — نصائح وأسعار | ${brand}`, desc:`مقالات ظلالي حول اختيار المظلات والسواتر وأسعارها في ${city}: مقارنات بين الخامات، أسعار المتر لكل نوع، تصاريح البلدية، ونصائح الصيانة قبل الشراء.`, canonical:'blog/', root, jsonld, active:'blog' })
    + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'المدونة'}])
    + `<section class="section"><div class="container-zi"><h1 class="section-title">المدونة</h1><p class="section-sub">دليلك قبل شراء المظلات والسواتر.</p><div class="grid-auto" style="margin-top:1.5rem">${cards}</div></div></section>`
    + foot({ root, active:'blog' }));
}
function contactPage() {
  const root = '../';
  const opts = Object.entries(S.pricing.types).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');
  const jsonld = [
    breadcrumb([{name:'الرئيسية',url:''},{name:'تواصل',url:'contact/'}]),
    { "@context":"https://schema.org","@type":"HomeAndConstructionBusiness","name":brand,"telephone":"+"+S.settings.whatsapp,"address":{"@type":"PostalAddress","addressLocality":city,"addressCountry":"SA"},"openingHours":"Sa-Th 08:00-22:00" }
  ];
  w('contact/index.html', head({ title:`تواصل مع ظلالي — معاينة مجانية في ${city} | ${brand}`, desc:`تواصل مع ظلالي لطلب معاينة مجانية للمظلات والسواتر والجلسات الخارجية في ${city}. اتصل بنا أو راسلنا على واتساب واترك رقمك ونوع مشروعك لنعاود التواصل خلال ساعات العمل.`, canonical:'contact/', root, jsonld, active:'contact' })
    + crumbHtml([{name:'الرئيسية',href:root+'index.html'},{name:'تواصل'}])
    + `<section class="section"><div class="container-zi" style="display:grid;gap:2rem;grid-template-columns:1fr" >
        <div class="lg:grid-cols-2" style="display:grid;gap:2rem">
          <div>
            <h1 class="section-title">اطلب معاينة مجانية</h1>
            <p class="section-sub">اترك رقمك ونوع المشروع ونتواصل معك خلال ساعات العمل.</p>
            <div style="margin-top:1.2rem;display:flex;flex-direction:column;gap:.6rem;color:var(--ink-soft)">
              <div>📞 ${S.settings.phone}</div><div>📍 ${S.settings.address}</div><div>🕒 ${S.settings.hours}</div>
            </div>
          </div>
          <form class="card-zi" id="contact-form" style="display:flex;flex-direction:column;gap:.8rem">
            <label style="font-weight:600;font-size:.9rem">الاسم<input required name="name" style="width:100%;margin-top:.3rem;padding:.7rem;border:1px solid var(--line-strong);border-radius:10px" placeholder="اسمك"></label>
            <label style="font-weight:600;font-size:.9rem">رقم الجوال<input required name="phone" inputmode="tel" style="width:100%;margin-top:.3rem;padding:.7rem;border:1px solid var(--line-strong);border-radius:10px" placeholder="05xxxxxxxx"></label>
            <label style="font-weight:600;font-size:.9rem">نوع المشروع<select name="type" id="contact-type" style="width:100%;margin-top:.3rem;padding:.7rem;border:1px solid var(--line-strong);border-radius:10px">${opts}</select></label>
            <button class="btn-zi btn-primary btn-block" type="submit">إرسال الطلب</button>
          </form>
        </div></div></section>
      <script type="module">
        import { getState, toast } from '${root}assets/js/site.js';
        import { Store } from '${root}assets/js/store.js';
        document.getElementById('contact-form').addEventListener('submit', e => {
          e.preventDefault(); const fd = new FormData(e.target); const st = Store.load();
          st.leads.push({ id:'L'+(st.leads.length+1), createdAt:new Date().toISOString().slice(0,10), name:fd.get('name'), phone:fd.get('phone'), type:st.pricing.types[fd.get('type')].name, material:'-', length:0,width:0,area:0, city:st.settings.city, low:0,high:0, source:'contact', status:'new' });
          Store.set('leads', st.leads); e.target.reset(); toast('وصل طلبك — سنتواصل معك خلال ساعات العمل');
        });
      </script>`
    + foot({ root, active:'contact' }));
}

// تشغيل
S.services.forEach(servicePage);
S.articles.forEach(articlePage);
S.projects.forEach(projectPage);
servicesIndex(); projectsIndex(); blogIndex(); contactPage();
console.log('تم توليد كل الصفحات.');
