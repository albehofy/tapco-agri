import { Injectable, signal, computed } from '@angular/core';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly STORAGE_KEY = 'tapco_lang';
  
  readonly currentLang = signal<Language>('ar');
  readonly isRtl = computed(() => this.currentLang() === 'ar');

  private readonly translations: Record<Language, Record<string, string>> = {
    ar: {
      'nav.home': 'الرئيسية',
      'nav.about': 'من نحن',
      'nav.products': 'منتجاتنا',
      'nav.solutions': 'حلول زراعية',
      'nav.blog': 'المدونة الزراعية',
      'nav.contact': 'تواصل معنا',
      'nav.quote': 'طلب عرض سعر',
      'nav.all_categories': 'جميع الفئات',
      
      'hero.badge': 'جودة تصنيع عالمية • حلول متكاملة للمحاصيل',
      'hero.cta_products': 'تصفح المنتجات',
      'hero.cta_quote': 'طلب استشارة أو تسعير',

      'stats.experience': 'سنوات من الخبرة والبحث',
      'stats.products': 'مركب مسجل ومعتمد',
      'stats.suppliers': 'شريك ومورد دولي',
      'stats.branches': 'فروع ومراكز توزيع',

      'home.categories_title': 'فئات المنتجات والحلول',
      'home.categories_subtitle': 'مجموعة شاملة من مبيدات وقاية النبات والمغذيات المتخصصة المعتمدة.',
      'home.featured_title': 'منتجات بارزة ومختارة',
      'home.featured_subtitle': 'أحدث التركيبات الزراعية ذات الكفاءة المثبتة حقليًا.',
      'home.suppliers_title': 'شركاء النجاح والتوريد العالمي',
      'home.suppliers_subtitle': 'نتعاون مع أرقى الكيانات العالمية لتوفير خامات ومركبات نقية.',
      'home.certs_title': 'شهادات الجودة والتسجيل',
      'home.certs_subtitle': 'نلتزم بأعلى معايير الإدارة البيئية، الجودة المصنعية، ومطابقة وزارة الزراعة.',
      'home.about_tag': 'عن مصنع TAPCO',
      'home.about_title': 'ريادة صناعية وحلول وقائية مدروسة',
      'home.about_btn': 'تعرف أكثر علينا',
      'home.cta_box_title': 'هل تبحث عن بروتوكول مكافحة متخصص لمحصولك؟',
      'home.cta_box_desc': 'فريق المهندسين والدعم الفني في TAPCO جاهز لتقديم المشورة وتوريد الكميات المطلوبة لمزرعتك.',
      'home.cta_box_btn': 'تحدث مع الدعم الفني عبر واتساب',

      'catalog.title': 'دليل المنتجات الزراعية',
      'catalog.subtitle': 'ابحث في قائمتنا المعتمدة من المبيدات الحشرية، الفطرية، النيماتودية، والمغذيات الورقية.',
      'catalog.search_placeholder': 'ابحث بالاسم التجاري أو المادة الفعالة...',
      'catalog.filter_category': 'الفئة',
      'catalog.filter_supplier': 'المورد / الشركة',
      'catalog.filter_crop': 'المحصول المستهدف',
      'catalog.filter_pest': 'الآفة أو المرض',
      'catalog.all': 'الكل',
      'catalog.clear_filters': 'إعادة ضبط الفلاتر',
      'catalog.results_count': 'منتج متاح',
      'catalog.no_results': 'لم نجد أي منتجات تطابق معايير البحث الحالية.',
      'catalog.details': 'تفاصيل المنتج',
      'catalog.sort': 'الترتيب',
      'catalog.sort_order': 'الترتيب الافتراضي',
      'catalog.sort_latest': 'الأحدث',
      'catalog.sort_popular': 'الأكثر مشاهدة',

      'product.active_ingredient': 'المادة الفعالة',
      'product.concentration': 'التركيز والنوع',
      'product.chemical_group': 'المجموعة الكيميائية',
      'product.formulation': 'كود الصياغة',
      'product.phi': 'فترة ما قبل الحصاد (PHI)',
      'product.days': 'يوم',
      'product.toxicity': 'تصنيف السمّية',
      'product.hazard_word': 'إشارة التحذير',
      'product.packaging': 'العبوات المتوفرة',
      'product.description': 'الوصف والخصائص',
      'product.usage': 'طريقة الاستخدام والجرعات',
      'product.crops_table': 'المحاصيل الموصى بها',
      'product.pests_table': 'الآفات والأمراض المستهدفة',
      'product.crop': 'المحصول',
      'product.dosage_note': 'ملاحظة الجرعة والرش',
      'product.pest': 'الآفة / المسبب',
      'product.pest_type': 'النوع',
      'product.download_datasheet': 'تحميل نشرة المنتج الفنية (PDF)',
      'product.download_msds': 'صحيفة بيانات السلامة MSDS (PDF)',
      'product.request_quote': 'طلب عرض سعر لهذا المنتج',
      'product.whatsapp_inquiry': 'استفسار عبر واتساب',
      'product.related': 'منتجات ذات صلة في نفس الفئة',

      'solutions.title': 'مركز الحلول والتشخيص الزراعي',
      'solutions.subtitle': 'اختر نوع المحصول والمشكلة التي تواجهها للحصول على المركب الزراعي المناسب مباشرة.',
      'solutions.step1': '1. اختر المحصول',
      'solutions.step2': '2. اختر الآفة أو المشكلة',
      'solutions.recommended': 'المنتجات والحلول الموصى بها لمشكلتك',
      'solutions.no_match': 'يرجى اختيار المحصول والآفة لعرض المنتجات المناسبة.',

      'about.title': 'عن شركة ومصنع TAPCO',
      'about.subtitle': 'رحلة التميز في وقاية النبات وتطوير الإنتاجية الزراعية في مصر والشرق الأوسط.',
      'about.story_title': 'قصتنا ورؤيتنا',
      'about.story_p1': 'تأسست TAPCO لتكون ركيزة وطنية موثوقة في قطاع الصناعات الكيماوية والزراعية. نعمل على مدار أكثر من 25 عامًا لتزويد المزارعين والشركات الزراعية الكبرى بأحدث مركبات وقاية المزروعات والمغذيات التخصصية وفق المواصفات الدولية لمنظمة الأغذية والزراعة (FAO) ومنظمة الصحة العالمية (WHO).',
      'about.story_p2': 'يضم مجمعنا الصناعي خطوط تصنيع وتعبئة متطورة للمستحلبات (EC)، المعلقات المركزة (SC)، والمساحيق القابلة للبلل (WP)، إلى جانب مختبر رقابة جودة متقدم لفحص المواد الفعالة ونسب الشوائب بدقة فائقة.',
      'about.mission_title': 'رسالتنا',
      'about.mission_desc': 'تمكين المزارع من تحقيق أعلى إنتاجية وأجود محصول بأقل تكلفة وأعلى معايير الأمان البيئي والصحي.',
      'about.vision_title': 'رؤيتنا',
      'about.vision_desc': 'أن نكون الخيار الزراعي الأول في الشرق الأوسط وأفريقيا للحلول المتكاملة لوقاية وتغذية المحاصيل.',
      'about.branches_title': 'شبكة فروعنا ومراكز التوزيع',
      'about.branches_subtitle': 'فروع مجهزة وموزعون معتمدون يغطون أهم المناطق الزراعية في مصر.',

      'blog.title': 'المدونة والإرشاد الزراعي',
      'blog.subtitle': 'مقالات توعوية، بروتوكولات مكافحة، ونصائح موسمية يقدمها نخبة من خبراء واستشاريي الزراعة.',
      'blog.read_more': 'قراءة المقال بالكامل',
      'blog.author': 'الكاتب',
      'blog.date': 'تاريخ النشر',
      'blog.recent': 'أحدث المقالات',

      'contact.title': 'تواصل مع فريق TAPCO',
      'contact.subtitle': 'يسعدنا استقبال استفساراتكم، طلبات عروض الأسعار، واستشاراتكم الفنية على مدار الأسبوع.',
      'contact.form_title': 'أرسل رسالة أو طلب تسعير',
      'contact.name': 'الاسم بالكامل',
      'contact.phone': 'رقم الهاتف / الواتساب',
      'contact.email': 'البريد الإلكتروني (اختياري)',
      'contact.message': 'تفاصيل الاستفسار أو الكميات المطلوبة',
      'contact.submit': 'إرسال الرسالة الآن',
      'contact.submitting': 'جاري الإرسال...',
      'contact.success': 'تم استلام استفسارك بنجاح! سيتواصل معك أحد مهندسينا في أقرب وقت.',
      'contact.error': 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر الواتساب مباشرة.',
      'contact.info_title': 'بيانات الاتصال المباشر',
      'contact.working_hours': 'ساعات العمل الرسمية',

      'footer.desc': 'صرح صناعي مصري متخصص في تصنيع وتوزيع مبيدات وقاية المزروعات، الأسمدة التخصصية، ومغذيات النبات وفق المعايير الدولية.',
      'footer.quick_links': 'روابط سريعة',
      'footer.products_cat': 'فئات المنتجات',
      'footer.contact_info': 'معلومات التواصل',
      'footer.rights': 'جميع الحقوق محفوظة لشركة TAPCO للحلول والمستلزمات الزراعية © 2026',

      'whatsapp.chat': 'تواصل معنا مباشرة عبر واتساب',
      'whatsapp.prefill': 'مرحبًا شركة TAPCO، أود الاستفسار عن حلولكم ومنتجاتكم الزراعية.',

      'modal.close': 'إغلاق',
      'modal.quote_title': 'طلب تسعير لمنتج',
      'modal.quote_product': 'المنتج المختار',
      'modal.submit': 'إرسال طلب التسعير',
      'modal.success': 'تم إرسال طلبك بنجاح! سنتواصل معك بعرض السعر في أقرب وقت.',

      'notfound.title': '404 - الصفحة غير موجودة',
      'notfound.desc': 'عذرًا، الصفحة التي تبحث عنها قد تم نقلها أو أنها غير متوفرة حاليًا.',
      'notfound.btn': 'العودة للصفحة الرئيسية',
    },
    en: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.products': 'Our Products',
      'nav.solutions': 'Agri Solutions',
      'nav.blog': 'Agri Blog',
      'nav.contact': 'Contact Us',
      'nav.quote': 'Request Quote',
      'nav.all_categories': 'All Categories',

      'hero.badge': 'World-Class Manufacturing • Integrated Crop Protection',
      'hero.cta_products': 'Explore Products',
      'hero.cta_quote': 'Request Technical Advice',

      'stats.experience': 'Years of Industrial Expertise',
      'stats.products': 'Certified Formulations',
      'stats.suppliers': 'Global Supply Partners',
      'stats.branches': 'Distribution Hubs',

      'home.categories_title': 'Product Categories & Solutions',
      'home.categories_subtitle': 'Comprehensive range of registered crop protection chemicals and specialty nutrients.',
      'home.featured_title': 'Featured Formulations',
      'home.featured_subtitle': 'Field-proven crop protection solutions engineered for maximum efficacy.',
      'home.suppliers_title': 'Global Supply & Synthesis Partners',
      'home.suppliers_subtitle': 'Partnering with premier global leaders for purest active ingredients and formulation aids.',
      'home.certs_title': 'Certifications & Accreditations',
      'home.certs_subtitle': 'Dedicated to environmental safety, ISO standards, and Ministry of Agriculture compliances.',
      'home.about_tag': 'About TAPCO Industry',
      'home.about_title': 'Manufacturing Excellence & Proven Crop Defense',
      'home.about_btn': 'Discover Our Story',
      'home.cta_box_title': 'Looking for a Tailored Protection Protocol for Your Farm?',
      'home.cta_box_desc': 'Our specialized agronomists are ready to design seasonal treatment schedules and quote bulk orders.',
      'home.cta_box_btn': 'Chat With Technical Support on WhatsApp',

      'catalog.title': 'Agricultural Products Catalog',
      'catalog.subtitle': 'Browse our certified insecticides, fungicides, nematicides, and foliar formulations.',
      'catalog.search_placeholder': 'Search by trade name or active ingredient...',
      'catalog.filter_category': 'Category',
      'catalog.filter_supplier': 'Supplier / Origin',
      'catalog.filter_crop': 'Target Crop',
      'catalog.filter_pest': 'Target Pest / Disease',
      'catalog.all': 'All',
      'catalog.clear_filters': 'Reset Filters',
      'catalog.results_count': 'products available',
      'catalog.no_results': 'No products match your current filtering criteria.',
      'catalog.details': 'Product Details',
      'catalog.sort': 'Sort By',
      'catalog.sort_order': 'Default Order',
      'catalog.sort_latest': 'Latest Formulations',
      'catalog.sort_popular': 'Most Viewed',

      'product.active_ingredient': 'Active Ingredient',
      'product.concentration': 'Concentration & Type',
      'product.chemical_group': 'Chemical Family',
      'product.formulation': 'Formulation Code',
      'product.phi': 'Pre-Harvest Interval (PHI)',
      'product.days': 'days',
      'product.toxicity': 'Toxicity Classification',
      'product.hazard_word': 'Signal Word',
      'product.packaging': 'Available Packaging',
      'product.description': 'Description & Mechanism',
      'product.usage': 'Application Guidelines & Dosages',
      'product.crops_table': 'Recommended Target Crops',
      'product.pests_table': 'Controlled Pests & Pathogens',
      'product.crop': 'Crop',
      'product.dosage_note': 'Dosage & Application Notes',
      'product.pest': 'Pest / Pathogen',
      'product.pest_type': 'Type',
      'product.download_datasheet': 'Technical Datasheet (PDF)',
      'product.download_msds': 'Safety Data Sheet MSDS (PDF)',
      'product.request_quote': 'Request Quote for Product',
      'product.whatsapp_inquiry': 'Direct WhatsApp Inquiry',
      'product.related': 'Related Products in Same Category',

      'solutions.title': 'Agricultural Diagnosis & Problem Solver',
      'solutions.subtitle': 'Select your crop and the issue you are facing to discover recommended TAPCO products.',
      'solutions.step1': '1. Choose Crop',
      'solutions.step2': '2. Choose Pest or Symptom',
      'solutions.recommended': 'Recommended Formulations & Protocols',
      'solutions.no_match': 'Please select a crop and pest to reveal matching treatments.',

      'about.title': 'About TAPCO Agricultural Industry',
      'about.subtitle': 'A legacy of excellence in plant protection and high-yield farming in Egypt and the Middle East.',
      'about.story_title': 'Our Journey & Vision',
      'about.story_p1': 'TAPCO was established as a trusted national pillar in agricultural and chemical manufacturing. For over 25 years, we have empowered growers and large commercial agribusinesses with high-standard crop protection chemicals conforming strictly to FAO and WHO quality specifications.',
      'about.story_p2': 'Our manufacturing facility houses advanced blending and synthesis units for Emulsifiable Concentrates (EC), Suspension Concentrates (SC), and Wettable Powders (WP), complemented by an analytical QA/QC laboratory monitoring purity at molecular precision.',
      'about.mission_title': 'Our Mission',
      'about.mission_desc': 'Enabling farmers to achieve peak productivity and premium yields while maintaining highest environmental safety standards.',
      'about.vision_title': 'Our Vision',
      'about.vision_desc': 'To be the pre-eminent partner in the Middle East and Africa for integrated plant health and nutrition solutions.',
      'about.branches_title': 'Our Branches & Distribution Hubs',
      'about.branches_subtitle': 'Strategic regional centers serving key agricultural basins across Egypt.',

      'blog.title': 'Agricultural Extension & Insights',
      'blog.subtitle': 'Technical advisories, seasonal protection schedules, and agronomic insights from leading field specialists.',
      'blog.read_more': 'Read Full Article',
      'blog.author': 'Author',
      'blog.date': 'Published',
      'blog.recent': 'Recent Insights',

      'contact.title': 'Contact the TAPCO Team',
      'contact.subtitle': 'We welcome your commercial inquiries, price quotation requests, and technical consultations.',
      'contact.form_title': 'Send an Inquiry or Quote Request',
      'contact.name': 'Full Name',
      'contact.phone': 'Phone / WhatsApp',
      'contact.email': 'Email Address (optional)',
      'contact.message': 'Inquiry Details or Requested Quantities',
      'contact.submit': 'Submit Message Now',
      'contact.submitting': 'Sending...',
      'contact.success': 'Your inquiry was sent successfully! Our agronomists will contact you shortly.',
      'contact.error': 'An error occurred while sending. Please try again or reach out on WhatsApp directly.',
      'contact.info_title': 'Direct Communication',
      'contact.working_hours': 'Official Working Hours',

      'footer.desc': 'Egyptian industrial enterprise specializing in certified crop protection agrochemicals, specialty fertilizers, and plant biostimulants.',
      'footer.quick_links': 'Quick Navigation',
      'footer.products_cat': 'Categories',
      'footer.contact_info': 'Head Office & Factory',
      'footer.rights': 'All Rights Reserved. TAPCO Agricultural Solutions & Manufacturing © 2026',

      'whatsapp.chat': 'Direct WhatsApp Support',
      'whatsapp.prefill': 'Hello TAPCO, I would like to inquire about your agricultural solutions and products.',

      'modal.close': 'Close',
      'modal.quote_title': 'Request Price Quotation',
      'modal.quote_product': 'Selected Product',
      'modal.submit': 'Submit Quote Request',
      'modal.success': 'Quote request received! We will send you pricing details shortly.',

      'notfound.title': '404 - Page Not Found',
      'notfound.desc': 'The requested resource may have been relocated or is currently unavailable.',
      'notfound.btn': 'Return to Homepage',
    }
  };

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    const initialLang = saved === 'en' ? 'en' : 'ar';
    this.setLanguage(initialLang);
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    
    // Dynamically update document properties immediately without reload
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  toggleLanguage(): void {
    const nextLang: Language = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.setLanguage(nextLang);
  }

  t(key: string): string {
    const lang = this.currentLang();
    return this.translations[lang][key] || key;
  }

  /**
   * Helper to retrieve bilingual property from DB models (e.g. name_ar vs name_en)
   */
  getLocalized(item: any, fieldPrefix: string): string {
    if (!item) return '';
    const lang = this.currentLang();
    const primary = item[`${fieldPrefix}_${lang}`];
    if (primary) return primary;
    const fallback = lang === 'ar' ? item[`${fieldPrefix}_en`] : item[`${fieldPrefix}_ar`];
    return fallback || item[fieldPrefix] || '';
  }
}
