// ظلالي — البيانات الأولية (seed). كل الأرقام والنصوص تجريبية للعرض.
export const SEED = {
  version: 1,
  settings: {
    demo: true,
    brand: "ظلالي",
    tagline: "ظلّ يليق ببيتك",
    city: "الرياض",
    cities: ["الرياض", "جدة", "الدمام", "مكة", "أخرى"],
    phone: "0500000000",
    whatsapp: "966500000000",
    address: "الرياض — حي العليا، طريق الملك فهد",
    hours: "السبت – الخميس، 8 ص – 10 م",
    social: { snapchat: "#", tiktok: "#", instagram: "#" },
    stats: { projects: 1240, years: 12, warrantyYears: 5, rating: 4.9, ratingVerified: false },
    promises: [
      { icon: "sun", title: "خامات تتحمّل حرّ الصيف", text: "مواد مختارة لمناخ السعودية تقاوم الأشعة والحرارة العالية." },
      { icon: "shield", title: "ضمان مكتوب", text: "ضمان على التركيب والخامات موثّق في العقد." },
      { icon: "clock", title: "تركيب سريع", text: "من المعاينة إلى التسليم في أيام معدودة." },
      { icon: "team", title: "فريق محلي", text: "فنيون سعوديون وخبرة ميدانية في كل الأحياء." }
    ]
  },
  pricing: {
    rangePct: 0.12,
    cityFactor: { "الرياض": 1.00, "جدة": 1.05, "الدمام": 1.03, "مكة": 1.08, "أخرى": 1.10 },
    types: {
      carShades: {
        name: "مظلات سيارات", installFee: 800, minOrder: 2500,
        materials: {
          pvc: { name: "قماش PVC", pricePerM2: 180, shade: "كثيف" },
          poly: { name: "بولي كربونات", pricePerM2: 260, shade: "جزئي" },
          lexan: { name: "لكسان", pricePerM2: 320, shade: "جزئي" },
          sandwich: { name: "ساندوتش بانل", pricePerM2: 220, shade: "كثيف" }
        }
      },
      gardenShades: {
        name: "مظلات جلسات وحدائق", installFee: 900, minOrder: 3000,
        materials: {
          pvc: { name: "قماش PVC", pricePerM2: 200, shade: "كثيف" },
          poly: { name: "بولي كربونات", pricePerM2: 280, shade: "جزئي" },
          wood: { name: "خشب", pricePerM2: 380, shade: "مخطط" },
          sail: { name: "قماش شراعي", pricePerM2: 240, shade: "ناعم" }
        }
      },
      pergola: {
        name: "برجولات", installFee: 1200, minOrder: 6000,
        materials: {
          wood: { name: "خشب", pricePerM2: 450, shade: "مخطط" },
          steel: { name: "حديد", pricePerM2: 350, shade: "مخطط" },
          wpc: { name: "WPC", pricePerM2: 520, shade: "مخطط" }
        }
      },
      screens: {
        name: "سواتر", installFee: 600, minOrder: 1800,
        materials: {
          steel: { name: "حديد", pricePerM2: 160, shade: "كثيف" },
          fabric: { name: "قماش", pricePerM2: 140, shade: "جزئي" },
          wood: { name: "خشب", pricePerM2: 260, shade: "كثيف" }
        }
      },
      hangars: {
        name: "هناجر", installFee: 2500, minOrder: 15000,
        materials: {
          galv: { name: "حديد مجلفن", pricePerM2: 190, shade: "كثيف" },
          sandwich: { name: "ساندوتش بانل", pricePerM2: 240, shade: "كثيف" }
        }
      },
      tents: {
        name: "بيوت شعر", installFee: 1500, minOrder: 8000,
        materials: {
          classic: { name: "قماش تقليدي", pricePerM2: 300, shade: "كثيف" },
          ac: { name: "مطوّر مع تكييف", pricePerM2: 480, shade: "كثيف" }
        }
      }
    }
  },
  services: [
    { slug: "car-shades", name: "مظلات سيارات", short: "حماية سيارتك من الشمس والأمطار بخامات تدوم.", icon: "car", typeKey: "carShades" },
    { slug: "garden-shades", name: "مظلات جلسات وحدائق", short: "ظلّ أنيق لجلساتك الخارجية وحديقتك.", icon: "sun", typeKey: "gardenShades" },
    { slug: "pergola", name: "برجولات", short: "برجولات خشب وحديد وWPC بتصاميم عصرية.", icon: "grid", typeKey: "pergola" },
    { slug: "screens", name: "سواتر", short: "خصوصية وحماية بسواتر حديد وقماش وخشب.", icon: "fence", typeKey: "screens" },
    { slug: "hangars", name: "هناجر", short: "هناجر ومستودعات بحديد مجلفن وساندوتش بانل.", icon: "warehouse", typeKey: "hangars" },
    { slug: "tents", name: "بيوت شعر", short: "بيوت شعر تقليدية ومطوّرة مع تكييف.", icon: "tent", typeKey: "tents" }
  ],
  projects: [
    { slug: "car-shade-malqa", title: "مظلة سيارتين — حي الملقا", city: "الرياض", district: "الملقا", typeKey: "carShades", material: "قماش PVC", areaM2: 32, days: 3, cover: "p1", summary: "مظلة مزدوجة بقماش PVC مقاوم للأشعة، تركيب خلال ٣ أيام." },
    { slug: "garden-yasmin", title: "جلسة خارجية — حي الياسمين", city: "الرياض", district: "الياسمين", typeKey: "gardenShades", material: "خشب", areaM2: 24, days: 5, cover: "p2", summary: "جلسة عائلية مظلّلة بسطح خشبي وإضاءة مدمجة." },
    { slug: "pergola-narjs", title: "برجولا حديقة — حي النرجس", city: "الرياض", district: "النرجس", typeKey: "pergola", material: "WPC", areaM2: 18, days: 6, cover: "p3", summary: "برجولا WPC بشرائح تمنح ظلاً مخططاً وتهوية." },
    { slug: "screen-sahafa", title: "ساتر حوش — حي الصحافة", city: "الرياض", district: "الصحافة", typeKey: "screens", material: "حديد", areaM2: 40, days: 2, cover: "p4", summary: "ساتر حديد مجدول للخصوصية بارتفاع ٣ أمتار." },
    { slug: "car-shade-jeddah", title: "مظلة مواقف — جدة الشاطئ", city: "جدة", district: "الشاطئ", typeKey: "carShades", material: "بولي كربونات", areaM2: 56, days: 4, cover: "p5", summary: "مظلة مواقف بولي كربونات لأربع سيارات." },
    { slug: "tent-dammam", title: "بيت شعر مطوّر — الدمام", city: "الدمام", district: "الشاطئ", typeKey: "tents", material: "مطوّر مع تكييف", areaM2: 30, days: 7, cover: "p6", summary: "بيت شعر عازل مع تكييف لجلسات الشتاء والصيف." },
    { slug: "garden-hamra", title: "مظلة حديقة — حي الحمراء", city: "الرياض", district: "الحمراء", typeKey: "gardenShades", material: "قماش شراعي", areaM2: 21, days: 3, cover: "p7", summary: "مظلة شراعية بألوان هادئة فوق مسبح منزلي." },
    { slug: "hangar-kharj", title: "هنجر مستودع — الخرج", city: "أخرى", district: "الخرج", typeKey: "hangars", material: "حديد مجلفن", areaM2: 240, days: 14, cover: "p8", summary: "هنجر مستودع بمساحة ٢٤٠م² بحديد مجلفن وساندوتش بانل." }
  ],
  articles: [
    {
      slug: "as3ar-mazallat-jalsat-2026",
      title: "أسعار مظلات الجلسات في الرياض 2026 (بالريال للمتر)",
      metaTitle: "أسعار مظلات الجلسات في الرياض 2026 | ظلالي",
      metaDescription: "دليل أسعار مظلات الجلسات في الرياض لعام 2026 بالريال للمتر المربع حسب الخامة، مع العوامل التي تحدد السعر وطريقة الحساب ونصائح قبل الشراء.",
      keyword: "أسعار مظلات الجلسات الرياض",
      excerpt: "يتراوح سعر مظلة الجلسات في الرياض بين 200 و450 ريالاً للمتر المربع حسب الخامة. إليك التفصيل الكامل.",
      date: "2026-08-20", readMins: 6, published: true, editedInAdmin: false,
      sections: [
        { h2: "ما الذي يحدد سعر مظلة الجلسة؟", html: "<p>يعتمد السعر على الخامة (PVC، بولي كربونات، خشب، قماش شراعي)، والمساحة، وطريقة التثبيت، والمدينة. الخامة وحدها قد تضاعف التكلفة.</p>" },
        { h2: "مقارنة الخامات وأسعارها", html: "<p>قماش PVC هو الأوفر ويعطي ظلاً كثيفاً، بينما الخشب أعلى سعراً ويمنح مظهراً فاخراً بظل مخطط. البولي كربونات وسط بين الاثنين ويمرّر ضوءاً خفيفاً.</p>" },
        { h2: "أخطاء شائعة قبل الشراء", html: "<p>أكثر خطأ هو اختيار خامة رخيصة لا تتحمّل حرّ الصيف فتتلف خلال موسمين. اطلب دائماً ضماناً مكتوباً ومعاينة قبل التسعير النهائي.</p>" }
      ],
      faqs: [
        { q: "كم يبدأ سعر مظلة الجلسة؟", a: "يبدأ عملياً من الحد الأدنى للطلب حتى لو كانت المساحة صغيرة، ويُحسب بعدها بالمتر المربع." },
        { q: "هل السعر يشمل التركيب؟", a: "غالباً يُضاف التركيب كبند منفصل، ويظهر في التقدير المبدئي من الحاسبة." }
      ]
    },
    {
      slug: "pvc-am-poly",
      title: "PVC أم بولي كربونات؟ أيّهما أفضل لحرّ السعودية",
      metaTitle: "PVC أم بولي كربونات لمظلات السعودية؟ | ظلالي",
      metaDescription: "مقارنة عملية بين قماش PVC والبولي كربونات لمظلات السعودية من حيث الظل والحرارة والعمر والسعر، لمساعدتك على اختيار الأنسب لمناخ الرياض.",
      keyword: "PVC أم بولي كربونات",
      excerpt: "الفرق الحقيقي بين الخامتين ليس السعر فقط، بل كثافة الظل ومقاومة الحرارة والعمر.",
      date: "2026-08-12", readMins: 5, published: true, editedInAdmin: false,
      sections: [
        { h2: "كثافة الظل", html: "<p>قماش PVC يعطي ظلاً كثيفاً يحجب الشمس تماماً، بينما البولي كربونات يمرّر ضوءاً خفيفاً مع حجب الأشعة الحارقة.</p>" },
        { h2: "الحرارة والعمر", html: "<p>البولي كربونات أكثر صلابة ويتحمّل الصدمات، وقماش PVC أخفّ وأسهل استبدالاً عند التلف.</p>" },
        { h2: "أيهما أختار؟", html: "<p>للمواقف والجلسات العائلية غالباً PVC أوفر وأعملي. للأسقف الدائمة والإضاءة الطبيعية يُفضّل البولي كربونات.</p>" }
      ],
      faqs: [
        { q: "أيهما أطول عمراً؟", a: "البولي كربونات أصلب، لكن جودة التركيب والخامة تحدد العمر أكثر من نوع المادة." }
      ]
    },
    {
      slug: "hal-tahtaj-tasrih",
      title: "هل تحتاج مظلة الحديقة تصريح بلدية في السعودية؟",
      metaTitle: "هل تحتاج مظلة الحديقة تصريح بلدية؟ | ظلالي",
      metaDescription: "متى تحتاج مظلات وسواتر المنازل إلى تصريح بلدية في السعودية، وما الحالات المعفاة، وكيف تتجنّب المخالفات قبل التركيب.",
      keyword: "تصريح مظلات البلدية",
      excerpt: "بعض المظلات لا تحتاج تصريحاً وبعضها نعم. إليك القاعدة العملية قبل التركيب.",
      date: "2026-07-30", readMins: 4, published: true, editedInAdmin: false,
      sections: [
        { h2: "الحالات التي قد تحتاج تصريحاً", html: "<p>المظلات الثابتة الكبيرة أو التي تمتد على الشارع قد تحتاج مراجعة البلدية، بخلاف المظلات الخفيفة داخل حدود المنزل.</p>" },
        { h2: "كيف تتجنّب المخالفة", html: "<p>استشر مقاولاً خبيراً بالأنظمة المحلية قبل التركيب، والتزم بارتفاعات وحدود الملكية.</p>" }
      ],
      faqs: [
        { q: "هل ساتر الحوش يحتاج تصريحاً؟", a: "غالباً لا داخل حدود ملكيتك، لكن ارتفاعه قد يخضع لأنظمة الحي." }
      ]
    },
    {
      slug: "sianat-al-mazallat",
      title: "كيف تحافظ على مظلتك أطول عمر ممكن؟",
      metaTitle: "صيانة المظلات: دليل عملي لعمر أطول | ظلالي",
      metaDescription: "نصائح عملية لصيانة المظلات والسواتر في السعودية: التنظيف، فحص التثبيت، حماية القماش من العواصف الترابية، وجدول صيانة سنوي بسيط.",
      keyword: "صيانة المظلات",
      excerpt: "خطوات بسيطة تضاعف عمر مظلتك وتحميها من حرّ الصيف والعواصف الترابية.",
      date: "2026-07-15", readMins: 4, published: true, editedInAdmin: false,
      sections: [
        { h2: "التنظيف الدوري", html: "<p>اغسل القماش بماء وصابون خفيف مرتين سنوياً، وتجنّب المواد الكيميائية القوية التي تُضعف الألياف.</p>" },
        { h2: "فحص التثبيت", html: "<p>افحص البراغي والوصلات قبل موسم العواصف، وشدّ أي وصلة مرتخية لتفادي التلف.</p>" }
      ],
      faqs: [
        { q: "كم مرة أنظّف المظلة؟", a: "مرتان في السنة تكفي في الظروف العادية، وأكثر في المناطق كثيرة الغبار." }
      ]
    }
  ],
  leads: [],
  seo: {
    keywords: [
      { term: "مظلات سيارات الرياض", position: 8, change: 3 },
      { term: "مظلات جلسات الرياض", position: 5, change: 2 },
      { term: "برجولات الرياض", position: 12, change: -1 },
      { term: "سواتر الرياض", position: 9, change: 4 },
      { term: "أسعار مظلات الجلسات", position: 6, change: 5 },
      { term: "مظلة حديقة الرياض", position: 4, change: 1 },
      { term: "بيوت شعر الرياض", position: 15, change: 0 },
      { term: "هناجر الرياض", position: 18, change: 2 },
      { term: "مظلات مواقف السيارات", position: 7, change: 3 },
      { term: "ساتر حوش الرياض", position: 11, change: 1 }
    ]
  }
};
