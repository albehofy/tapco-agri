<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\BlogPost;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\Crop;
use App\Models\Inquiry;
use App\Models\Pest;
use App\Models\Product;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $adminRole = Role::create([
            'name' => 'Admin',
            'permissions' => ['*'],
        ]);

        $editorRole = Role::create([
            'name' => 'Editor',
            'permissions' => [
                'products.view', 'products.create', 'products.edit',
                'categories.manage', 'blog.manage', 'inquiries.manage',
            ],
        ]);

        // 2. Admin Users
        AdminUser::create([
            'name' => 'TAPCO Admin',
            'email' => 'admin@tapco-agri.com',
            'password' => Hash::make('admin123'),
            'role_id' => $adminRole->id,
            'is_active' => true,
        ]);

        AdminUser::create([
            'name' => 'Agronomist Lead',
            'email' => 'editor@tapco-agri.com',
            'password' => Hash::make('editor123'),
            'role_id' => $editorRole->id,
            'is_active' => true,
        ]);

        // 3. Settings
        $settings = [
            'whatsapp_number' => ['ar' => '+201012345678', 'en' => '+201012345678', 'type' => 'text'],
            'phone_number' => ['ar' => '+20223456789', 'en' => '+20223456789', 'type' => 'text'],
            'email_contact' => ['ar' => 'info@tapco-agri.com', 'en' => 'info@tapco-agri.com', 'type' => 'text'],
            'facebook_url' => ['ar' => 'https://facebook.com/tapcoagri', 'en' => 'https://facebook.com/tapcoagri', 'type' => 'text'],
            'linkedin_url' => ['ar' => 'https://linkedin.com/company/tapco-agri', 'en' => 'https://linkedin.com/company/tapco-agri', 'type' => 'text'],
            'instagram_url' => ['ar' => 'https://instagram.com/tapcoagri', 'en' => 'https://instagram.com/tapcoagri', 'type' => 'text'],
            'stats_years_experience' => ['ar' => '25+', 'en' => '25+', 'type' => 'text'],
            'stats_products_count' => ['ar' => '120+', 'en' => '120+', 'type' => 'text'],
            'stats_suppliers_count' => ['ar' => '15+', 'en' => '15+', 'type' => 'text'],
            'stats_branches_count' => ['ar' => '6', 'en' => '6', 'type' => 'text'],
            'about_short' => [
                'ar' => 'شركة TAPCO هي صرح صناعي وتجاري رائد في تصنيع وتوزيع المبيدات الزراعية، الأسمدة المتخصصة، والمخصبات الحيوية المسجلة والمعتمدة عالميًا، نعمل بشراكة وثيقة مع كبرى الشركات الدولية لتوفير حلول زراعية مستدامة وفعالة تحقق أعلى مردود وجودة للمحاصيل.',
                'en' => 'TAPCO is a premier industrial manufacturer and distributor of certified crop protection pesticides, specialty foliar nutrients, and advanced soil enhancers, partnering with global chemical leaders to deliver sustainable, high-yield agricultural solutions.',
                'type' => 'text',
            ],
            'home_hero_title' => [
                'ar' => 'حلول زراعية مبتكرة لحماية وإنتاجية المحاصيل',
                'en' => 'Advanced Crop Protection & High-Performance Agriculture',
                'type' => 'text',
            ],
            'home_hero_subtitle' => [
                'ar' => 'نصنع ونوزع أحدث المبيدات الفطرية، الحشرية، النيماتودية، والمغذيات الورقية بأعلى معايير الجودة العالمية لحماية استثمارك الزراعي.',
                'en' => 'Manufacturing and distributing cutting-edge insecticides, fungicides, nematicides, and specialty nutrients engineered to secure higher farm productivity.',
                'type' => 'text',
            ],
        ];

        foreach ($settings as $k => $vals) {
            Setting::create([
                'key' => $k,
                'value_ar' => $vals['ar'],
                'value_en' => $vals['en'],
                'type' => $vals['type'],
            ]);
        }

        // 4. Categories Hierarchy
        // Parent 1: المبيدات
        $pesticidesCat = Category::create([
            'name_ar' => 'مبيدات وقاية المزروعات',
            'name_en' => 'Crop Protection Pesticides',
            'slug' => 'pesticides',
            'parent_id' => null,
            'icon' => 'shield-alert',
            'order' => 1,
        ]);

        $insecticides = Category::create([
            'name_ar' => 'مبيدات حشرية',
            'name_en' => 'Insecticides',
            'slug' => 'insecticides',
            'parent_id' => $pesticidesCat->id,
            'icon' => 'bug',
            'order' => 1,
        ]);

        $fungicides = Category::create([
            'name_ar' => 'مبيدات فطرية',
            'name_en' => 'Fungicides',
            'slug' => 'fungicides',
            'parent_id' => $pesticidesCat->id,
            'icon' => 'sprout',
            'order' => 2,
        ]);

        $herbicides = Category::create([
            'name_ar' => 'مبيدات حشائش',
            'name_en' => 'Herbicides',
            'slug' => 'herbicides',
            'parent_id' => $pesticidesCat->id,
            'icon' => 'scissors',
            'order' => 3,
        ]);

        $acaricides = Category::create([
            'name_ar' => 'مبيدات أكاروسية',
            'name_en' => 'Acaricides',
            'slug' => 'acaricides',
            'parent_id' => $pesticidesCat->id,
            'icon' => 'activity',
            'order' => 4,
        ]);

        $nematicides = Category::create([
            'name_ar' => 'مبيدات نيماتودية',
            'name_en' => 'Nematicides',
            'slug' => 'nematicides',
            'parent_id' => $pesticidesCat->id,
            'icon' => 'dna',
            'order' => 5,
        ]);

        // Parent 2: الأسمدة والمغذيات
        $fertilizersCat = Category::create([
            'name_ar' => 'الأسمدة والمغذيات المتخصصة',
            'name_en' => 'Specialty Fertilizers & Nutrients',
            'slug' => 'fertilizers-nutrients',
            'parent_id' => null,
            'icon' => 'droplet',
            'order' => 2,
        ]);

        $foliar = Category::create([
            'name_ar' => 'مغذيات ورقية ومخلبيات',
            'name_en' => 'Foliar Nutrients & Chelates',
            'slug' => 'foliar-nutrients',
            'parent_id' => $fertilizersCat->id,
            'icon' => 'droplets',
            'order' => 1,
        ]);

        $biostimulants = Category::create([
            'name_ar' => 'محفزات حيوية وأحماض أمينية',
            'name_en' => 'Biostimulants & Amino Acids',
            'slug' => 'biostimulants',
            'parent_id' => $fertilizersCat->id,
            'icon' => 'zap',
            'order' => 2,
        ]);

        $soilConditioners = Category::create([
            'name_ar' => 'مصححات تربة وهوميك',
            'name_en' => 'Soil Conditioners & Humic',
            'slug' => 'soil-conditioners',
            'parent_id' => $fertilizersCat->id,
            'icon' => 'layers',
            'order' => 3,
        ]);

        // 5. Suppliers
        $supTapco = Supplier::create([
            'name' => 'TAPCO Agri-Synthesis Labs',
            'website' => 'https://tapco-agri.com',
            'order' => 1,
        ]);
        $supBayer = Supplier::create([
            'name' => 'Bayer Crop Science',
            'website' => 'https://cropscience.bayer.com',
            'order' => 2,
        ]);
        $supSyngenta = Supplier::create([
            'name' => 'Syngenta Agro',
            'website' => 'https://syngenta.com',
            'order' => 3,
        ]);
        $supBasf = Supplier::create([
            'name' => 'BASF Agricultural',
            'website' => 'https://agriculture.basf.com',
            'order' => 4,
        ]);
        $supUpl = Supplier::create([
            'name' => 'UPL OpenAg',
            'website' => 'https://upl-ltd.com',
            'order' => 5,
        ]);

        // 6. Crops
        $cropTomatoes = Crop::create(['name_ar' => 'طماطم وبطاطس (باذنجانية)', 'name_en' => 'Tomatoes & Potatoes (Solanaceae)', 'slug' => 'tomatoes-potatoes']);
        $cropCitrus = Crop::create(['name_ar' => 'موالح وحمضيات (برتقال، يوسفي، ليمون)', 'name_en' => 'Citrus Orchards', 'slug' => 'citrus']);
        $cropGrapes = Crop::create(['name_ar' => 'عنب وفاكهة متساقطة', 'name_en' => 'Grapes & Deciduous Fruits', 'slug' => 'grapes']);
        $cropWheat = Crop::create(['name_ar' => 'قمح وحبوب غلال', 'name_en' => 'Wheat & Cereals', 'slug' => 'wheat-cereals']);
        $cropCotton = Crop::create(['name_ar' => 'قطن ومحاصيل حقلية', 'name_en' => 'Cotton & Field Crops', 'slug' => 'cotton']);
        $cropCucurbits = Crop::create(['name_ar' => 'خيار، بطيخ وكوسة (قرعيات)', 'name_en' => 'Cucurbits (Cucumber, Melon)', 'slug' => 'cucurbits']);

        // 7. Pests
        $pestLeafworm = Pest::create(['name_ar' => 'دودة ورق القطن ودودة الحشد', 'name_en' => 'Cotton Leafworm & Spodoptera', 'slug' => 'cotton-leafworm', 'type' => 'insect']);
        $pestWhitefly = Pest::create(['name_ar' => 'الذبابة البيضاء والتربس والمن', 'name_en' => 'Whitefly, Thrips & Aphids', 'slug' => 'whitefly-thrips', 'type' => 'insect']);
        $pestMildew = Pest::create(['name_ar' => 'البياض الدقيقي واللفحة المبكرة', 'name_en' => 'Powdery Mildew & Early Blight', 'slug' => 'powdery-mildew', 'type' => 'fungus']);
        $pestDowny = Pest::create(['name_ar' => 'البياض الزغبي وعفن الجذور', 'name_en' => 'Downy Mildew & Root Rot', 'slug' => 'downy-mildew', 'type' => 'fungus']);
        $pestMites = Pest::create(['name_ar' => 'العنكبوت الأحمر والأكاروسات', 'name_en' => 'Red Spider Mites', 'slug' => 'spider-mites', 'type' => 'insect']);
        $pestNema = Pest::create(['name_ar' => 'نيماتودا تعقد الجذور', 'name_en' => 'Root-Knot Nematodes', 'slug' => 'root-knot-nematodes', 'type' => 'nematode']);
        $pestWeeds = Pest::create(['name_ar' => 'الحشائش الحولية عريضة ورفيعة الأوراق', 'name_en' => 'Annual Broadleaf & Grass Weeds', 'slug' => 'annual-weeds', 'type' => 'weed']);

        // 8. Products
        $p1 = Product::create([
            'category_id' => $insecticides->id,
            'supplier_id' => $supTapco->id,
            'name_ar' => 'تابكونور 20% إس إل',
            'name_en' => 'Tapconor 20% SL',
            'slug' => 'tapconor-20-sl',
            'active_ingredient_ar' => 'أسيتامبريد (Acetamiprid)',
            'active_ingredient_en' => 'Acetamiprid 200 g/L',
            'concentration' => '20% SL',
            'formulation_code' => 'SL',
            'chemical_group_ar' => 'نيونيكوتينويد (Neonicotinoids)',
            'chemical_group_en' => 'Neonicotinoid',
            'description_ar' => 'مبيد حشري جهازي فائق الكفاءة يعمل بالملامسة وعن طريق المعدة، ذو تأثير سريع وممتد لمكافحة الحشرات الثاقبة الماصة وصانعات الأنفاق بكفاءة عالية دون إجهاد النبات.',
            'description_en' => 'High-efficacy systemic insecticide with contact and stomach action, providing rapid knockdown and prolonged residual control against sucking pests and leafminers.',
            'usage_instructions_ar' => 'يُستخدم بمعدل 25 سم3 / 100 لتر ماء رشًا متجانسًا عند ظهور بدايات الإصابة الحشرية. يُراعى تغطية المجموع الخضري جيدًا.',
            'usage_instructions_en' => 'Apply at 25 ml / 100 Liters of water upon initial infestation signs, ensuring complete foliar coverage.',
            'pre_harvest_interval' => 7,
            'toxicity_class' => 'III',
            'hazard_signal_word_ar' => 'احترس',
            'hazard_signal_word_en' => 'Caution',
            'packaging_sizes' => '250 مل، 500 مل، 1 لتر',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 342,
            'order' => 1,
        ]);
        $p1->crops()->attach([
            $cropTomatoes->id => ['dosage_note_ar' => '25 سم3 / 100 لتر ماء', 'dosage_note_en' => '25 ml / 100 L water'],
            $cropCitrus->id => ['dosage_note_ar' => '30 سم3 / 100 لتر ماء', 'dosage_note_en' => '30 ml / 100 L water'],
            $cropCotton->id => ['dosage_note_ar' => '100 سم3 / فدان', 'dosage_note_en' => '100 ml / Feddan'],
        ]);
        $p1->pests()->attach([$pestWhitefly->id, $pestLeafworm->id]);

        $p2 = Product::create([
            'category_id' => $fungicides->id,
            'supplier_id' => $supSyngenta->id,
            'name_ar' => 'تابكوسيد 72% دبليو بي',
            'name_en' => 'Tapcoside 72% WP',
            'slug' => 'tapcoside-72-wp',
            'active_ingredient_ar' => 'مانكوزيب 64% + سيموكسانيل 8%',
            'active_ingredient_en' => 'Mancozeb 64% + Cymoxanil 8%',
            'concentration' => '72% WP',
            'formulation_code' => 'WP',
            'chemical_group_ar' => 'دايثيوكاربامات + سيانوأسيتاميد أكسيم',
            'chemical_group_en' => 'Dithiocarbamate + Cyanoacetamide Oxime',
            'description_ar' => 'مبيد فطري مركب وقائي وعلاجي ذو فعالية مزدوجة وسريعة لاختراق الأنسجة النباتية والقضاء على جراثيم الفطريات البيضية والبياض الزغبي والندوات.',
            'description_en' => 'Dual-action protective and curative compound fungicide designed to penetrate plant tissue rapidly, eradicating oomycetes, downy mildews, and late blights.',
            'usage_instructions_ar' => 'يُستخدم بمعدل 250 جم / 100 لتر ماء ويكرر الرش كل 7 إلى 10 أيام في الظروف المناسبة لانتشار الأمراض.',
            'usage_instructions_en' => 'Apply at 250 g / 100 Liters of water; repeat every 7 to 10 days under disease-favorable weather.',
            'pre_harvest_interval' => 3,
            'toxicity_class' => 'III',
            'hazard_signal_word_ar' => 'تحذير',
            'hazard_signal_word_en' => 'Warning',
            'packaging_sizes' => '250 جم، 1 كجم',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 518,
            'order' => 2,
        ]);
        $p2->crops()->attach([
            $cropTomatoes->id => ['dosage_note_ar' => '250 جم / 100 لتر', 'dosage_note_en' => '250 g / 100 L'],
            $cropGrapes->id => ['dosage_note_ar' => '200 جم / 100 لتر', 'dosage_note_en' => '200 g / 100 L'],
            $cropCucurbits->id => ['dosage_note_ar' => '250 جم / 100 لتر', 'dosage_note_en' => '250 g / 100 L'],
        ]);
        $p2->pests()->attach([$pestDowny->id, $pestMildew->id]);

        $p3 = Product::create([
            'category_id' => $acaricides->id,
            'supplier_id' => $supBayer->id,
            'name_ar' => 'تابكو-أكارين 10% إي سي',
            'name_en' => 'Tapco-Acarin 10% EC',
            'slug' => 'tapco-acarin-10-ec',
            'active_ingredient_ar' => 'هيكسيثيازوكس 10%',
            'active_ingredient_en' => 'Hexythiazox 100 g/L',
            'concentration' => '10% EC',
            'formulation_code' => 'EC',
            'chemical_group_ar' => 'ثيازيدينات (Thiazolidinones)',
            'chemical_group_en' => 'Thiazolidinone',
            'description_ar' => 'مبيد أكاروسي متقدم لمكافحة بيض ويرقات وحوريات العنكبوت الأحمر والأكاروسات على أشجار الفاكهة والخضار، يتميز بفترة حماية طويلة الأمد وأمان تام على الأعداء الحيوية.',
            'description_en' => 'Advanced ovicidal and larvicidal miticide for controlling eggs and nymphs of red spider mites with long residual action and high crop safety.',
            'usage_instructions_ar' => 'يُستخدم بمعدل 30 سم3 / 100 لتر ماء مع ملامسة السطح السفلي للأوراق جيدًا.',
            'usage_instructions_en' => 'Use at 30 ml / 100 Liters of water ensuring underside coverage of foliage.',
            'pre_harvest_interval' => 14,
            'toxicity_class' => 'IV',
            'hazard_signal_word_ar' => 'احترس',
            'hazard_signal_word_en' => 'Caution',
            'packaging_sizes' => '200 مل، 1 لتر',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 280,
            'order' => 3,
        ]);
        $p3->crops()->attach([
            $cropCitrus->id => ['dosage_note_ar' => '30 سم3 / 100 لتر', 'dosage_note_en' => '30 ml / 100 L'],
            $cropGrapes->id => ['dosage_note_ar' => '30 سم3 / 100 لتر', 'dosage_note_en' => '30 ml / 100 L'],
        ]);
        $p3->pests()->attach([$pestMites->id]);

        $p4 = Product::create([
            'category_id' => $nematicides->id,
            'supplier_id' => $supTapco->id,
            'name_ar' => 'تابكوماكس نيماتودا 10% جي',
            'name_en' => 'Tapcomax Nema 10% G',
            'slug' => 'tapcomax-nema-10-g',
            'active_ingredient_ar' => 'فوستيازات 10% حبيبات',
            'active_ingredient_en' => 'Fosthiazate 10% Granules',
            'concentration' => '10% GR',
            'formulation_code' => 'GR',
            'chemical_group_ar' => 'مركبات الفوسفور العضوية',
            'chemical_group_en' => 'Organophosphate',
            'description_ar' => 'مبيد نيماتودي حبيبي عالي النقاء لمكافحة نيماتودا تعقد الجذور ونيماتودا التقرح على محاصيل الطماطم، البطاطس، والموالح، يعمل على شل حركة النيماتودا ومنع اختراقها للجذور.',
            'description_en' => 'High-purity granular nematicide controlling root-knot and lesion nematodes, protecting root systems throughout critical development stages.',
            'usage_instructions_ar' => 'يُضاف بمعدل 10 إلى 15 كجم / فدان مع تقليب التربة جيدًا قبل الزراعة أو حول جذور الأشجار متبوعًا برية مشبعة.',
            'usage_instructions_en' => 'Incorporate 10-15 kg / Feddan into soil prior to planting or around tree canopy followed by thorough irrigation.',
            'pre_harvest_interval' => 30,
            'toxicity_class' => 'II',
            'hazard_signal_word_ar' => 'خطر',
            'hazard_signal_word_en' => 'Danger',
            'packaging_sizes' => '5 كجم، 20 كجم',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 410,
            'order' => 4,
        ]);
        $p4->crops()->attach([
            $cropTomatoes->id => ['dosage_note_ar' => '12 كجم / فدان', 'dosage_note_en' => '12 kg / Feddan'],
            $cropCitrus->id => ['dosage_note_ar' => '50 جم / شجرة', 'dosage_note_en' => '50 g / tree'],
        ]);
        $p4->pests()->attach([$pestNema->id]);

        $p5 = Product::create([
            'category_id' => $foliar->id,
            'supplier_id' => $supTapco->id,
            'name_ar' => 'تابكو-فولير زنك وبورون بلس',
            'name_en' => 'Tapco-Foliar Zn + B Plus',
            'slug' => 'tapco-foliar-zn-b-plus',
            'active_ingredient_ar' => 'زنك مخلبي 8% + بورون عضوي 3% + أحماض كربوكسيلية',
            'active_ingredient_en' => 'Chelated Zinc 8% + Organic Boron 3%',
            'concentration' => 'Liquid chelated',
            'formulation_code' => 'SL',
            'chemical_group_ar' => 'عناصر مخلبية سائلة',
            'chemical_group_en' => 'Liquid Chelated Micronutrients',
            'description_ar' => 'مركب تغذية ورقية فائق الامتصاص مخصص لتحفيز التزهير وتثبيت العقد ومنع تساقط الثمار في الموالح والخضروات وأشجار الفاكهة، يرفع من مناعة النبات ومقاومة التقلبات المناخية.',
            'description_en' => 'Advanced foliar formulation boosting pollination, fruit set, and anti-drop defense across citrus, orchard trees, and fruiting vegetables.',
            'usage_instructions_ar' => 'يُرش بمعدل 1 لتر / 600 لتر ماء قبل وأثناء مرحلة التزهير ويكرر بعد تمام العقد.',
            'usage_instructions_en' => 'Spray 1 Liter per 600 Liters of water during flower pre-bloom and post-fruit setting.',
            'pre_harvest_interval' => 0,
            'toxicity_class' => 'IV',
            'hazard_signal_word_ar' => 'آمن زراعيًا',
            'hazard_signal_word_en' => 'Safe / Eco-friendly',
            'packaging_sizes' => '1 لتر، 5 لتر',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 625,
            'order' => 5,
        ]);
        $p5->crops()->attach([
            $cropCitrus->id => ['dosage_note_ar' => '1.5 لتر / 600 لتر', 'dosage_note_en' => '1.5 L / 600 L'],
            $cropGrapes->id => ['dosage_note_ar' => '1 لتر / 600 لتر', 'dosage_note_en' => '1 L / 600 L'],
            $cropTomatoes->id => ['dosage_note_ar' => '1 لتر / 400 لتر', 'dosage_note_en' => '1 L / 400 L'],
        ]);

        $p6 = Product::create([
            'category_id' => $soilConditioners->id,
            'supplier_id' => $supTapco->id,
            'name_ar' => 'تابكو-جرين بوتاسيوم هومات 85%',
            'name_en' => 'Tapco-Green Potassium Humate 85%',
            'slug' => 'tapco-green-potassium-humate-85',
            'active_ingredient_ar' => 'حمض الهوميك 70% + حمض الفولفيك 15% + بوتاسيوم 12%',
            'active_ingredient_en' => 'Humic Acid 70% + Fulvic Acid 15% + K2O 12%',
            'concentration' => '85% Powder / Flakes',
            'formulation_code' => 'SP',
            'chemical_group_ar' => 'مركبات المواد الدبالية الطبيعية',
            'chemical_group_en' => 'Organic Humic Substances',
            'description_ar' => 'مصلح تربة بيولوجي نقي قابل للذوبان الكامل 100%، يفكك ملوحة التربة، ينشط الشعيرات الجذرية، ويزيد كفاءة امتصاص الأسمدة الكيماوية بمعدلات قياسية.',
            'description_en' => '100% water-soluble biological soil conditioner combating soil salinity, stimulating root elongation, and maximizing fertilizer uptake efficacy.',
            'usage_instructions_ar' => 'يُحقن مع مياه الري بمعدل 1 إلى 2 كجم / فدان كل أسبوعين طوال موسم النمو الخضري والثمري.',
            'usage_instructions_en' => 'Fertigate at 1-2 kg / Feddan bi-weekly through drip irrigation systems throughout the vegetative season.',
            'pre_harvest_interval' => 0,
            'toxicity_class' => 'IV',
            'hazard_signal_word_ar' => 'طبيعي وآمن',
            'hazard_signal_word_en' => 'Natural / Organic',
            'packaging_sizes' => '1 كجم، 5 كجم، 25 كجم',
            'is_featured' => true,
            'is_active' => true,
            'views_count' => 740,
            'order' => 6,
        ]);
        $p6->crops()->attach([
            $cropTomatoes->id => ['dosage_note_ar' => '1.5 كجم / فدان', 'dosage_note_en' => '1.5 kg / Feddan'],
            $cropCitrus->id => ['dosage_note_ar' => '2 كجم / فدان', 'dosage_note_en' => '2 kg / Feddan'],
            $cropWheat->id => ['dosage_note_ar' => '1 كجم / فدان', 'dosage_note_en' => '1 kg / Feddan'],
        ]);

        // 9. Branches
        Branch::create([
            'name_ar' => 'المقر الرئيسي والمجمع الصناعي - مدينة السادات',
            'name_en' => 'Headquarters & Manufacturing Complex - Sadat City',
            'address_ar' => 'المنطقة الصناعية الخامسة، مجمع TAPCO للصناعات الكيماوية والزراعية، مدينة السادات، المنوفية',
            'address_en' => '5th Industrial Zone, TAPCO Chemical & Agri Complex, Sadat City, Egypt',
            'phone' => '+20482601111',
            'whatsapp' => '+201012345678',
            'working_hours_ar' => 'السبت - الخميس: 8:00 ص - 5:00 م',
            'working_hours_en' => 'Sat - Thu: 8:00 AM - 5:00 PM',
            'lat' => 30.3756,
            'lng' => 30.5050,
            'order' => 1,
        ]);

        Branch::create([
            'name_ar' => 'مركز توزيع الدلتا والبحيرة - النوبارية',
            'name_en' => 'Delta & Nubariya Distribution Hub',
            'address_ar' => 'طريق مصر إسكندرية الصحراوي، الكيلو 75، مركز توزيع النوبارية',
            'address_en' => 'Alexandria Desert Road, KM 75, Nubariya Logistics Hub',
            'phone' => '+20452632222',
            'whatsapp' => '+201012345679',
            'working_hours_ar' => 'السبت - الخميس: 8:30 ص - 6:00 م',
            'working_hours_en' => 'Sat - Thu: 8:30 AM - 6:00 PM',
            'lat' => 30.6667,
            'lng' => 30.0667,
            'order' => 2,
        ]);

        Branch::create([
            'name_ar' => 'فرع الصعيد والمنيا',
            'name_en' => 'Upper Egypt Branch - Minya',
            'address_ar' => 'المنطقة الصناعية بالمطاهرة، المنيا الجديدة',
            'address_en' => 'El-Matahra Industrial Zone, New Minya',
            'phone' => '+20862343333',
            'whatsapp' => '+201012345680',
            'working_hours_ar' => 'السبت - الخميس: 9:00 ص - 5:00 م',
            'working_hours_en' => 'Sat - Thu: 9:00 AM - 5:00 PM',
            'lat' => 28.1099,
            'lng' => 30.7503,
            'order' => 3,
        ]);

        // 10. Certificates
        Certificate::create([
            'title_ar' => 'شهادة نظام إدارة الجودة ISO 9001:2015 لتصنيع المبيدات',
            'title_en' => 'ISO 9001:2015 Quality Management Certification',
            'image' => 'certificates/iso-9001.png',
            'order' => 1,
        ]);

        Certificate::create([
            'title_ar' => 'شهادة السلامة البيئية والمصنعية ISO 14001:2015',
            'title_en' => 'ISO 14001:2015 Environmental Safety Standard',
            'image' => 'certificates/iso-14001.png',
            'order' => 2,
        ]);

        Certificate::create([
            'title_ar' => 'اعتماد وتسجيل لجنة مبيدات الآفات الزراعية - وزارة الزراعة',
            'title_en' => 'Ministry of Agriculture Pesticide Committee Registration',
            'image' => 'certificates/ministry-cert.png',
            'order' => 3,
        ]);

        // 11. Blog Posts
        BlogPost::create([
            'title_ar' => 'دليل المزارع المتكامل لمكافحة صانعات الأنفاق في الطماطم المحمية والمكشوفة',
            'title_en' => 'Integrated Guide for Leafminer Management in Protected & Open-Field Tomatoes',
            'slug' => 'leafminer-management-tomatoes',
            'excerpt_ar' => 'صانعات الأنفاق (Tuta absoluta) تعد من أخطر الآفات المدمرة لمحصول الطماطم، إليك بروتوكول مكافحة جهازي ووقائي يحافظ على سلامة العرش ونقاء الثمار.',
            'excerpt_en' => 'Leafminers pose a destructive risk to tomato harvests. Discover our proven systemic and preventative protocol ensuring crop longevity and fruit perfection.',
            'content_ar' => '<p>تعتبر حشرة صانعة أنفاق الطماطم من أشرس الآفات الحشرية التي تواجه مزارع الخضر الحديثة. تتغذى اليرقات بين بشرتي الورقة فتصنع أنفاقاً شفافة تؤدي إلى جفاف الأوراق وسقوطها، كما تخترق الثمار وتحدث ثقوباً غير قابلة للتسويق.</p><h3>خطوات المكافحة المتكاملة:</h3><ul><li>المراقبة الدورية عبر المصائد الفيرومونية لمتابعة أعداد الفراشات البالغة.</li><li>استخدام المبيدات الجهازية مثل <strong>تابكونور 20% SL</strong> في أوقات الصباح الباكر لضمان امتصاص مثالي.</li><li>التناوب بين المجموعات الكيميائية لمنع تكوّن سلالات مقاومة.</li><li>الالتزام بفترة ما قبل الحصاد (PHI) بدقة لضمان محاصيل آمنة ومطابقة للمواصفات التصديرية.</li></ul>',
            'content_en' => '<p>Tuta absoluta is among the most threatening pests in modern vegetable farming. Larvae feed internally between leaf epidermis, producing translucent galleries that cause foliar necrosis and fruit damage.</p><h3>Integrated Management Steps:</h3><ul><li>Regular monitoring using pheromone traps.</li><li>Systemic applications of <strong>Tapconor 20% SL</strong> in early morning for optimum translaminar uptake.</li><li>Rotating chemical modes of action to avert resistance development.</li><li>Strict adherence to Pre-Harvest Intervals (PHI) for export compliance.</li></ul>',
            'author_name' => 'د. حسام عبد الرازق - استشاري وقاية النبات',
            'published_at' => now()->subDays(5),
            'is_published' => true,
            'meta_title_ar' => 'مكافحة صانعات الأنفاق في الطماطم | TAPCO الزراعية',
            'meta_title_en' => 'Leafminer Control in Tomatoes | TAPCO Agri',
            'meta_description_ar' => 'أفضل بروتوكول زراعي لمكافحة صانعات الأنفاق وحشرة التوتا أبسوليوتا في حقول الطماطم بالجرعات ومواعيد الرش الموصى بها.',
            'meta_description_en' => 'Top agricultural protocol to control tomato leafminers with recommended dosages and application timings.',
        ]);

        BlogPost::create([
            'title_ar' => 'أهمية التغذية الورقية بعنصري الزنك والبورون خلال مرحلة التزهير والعقد',
            'title_en' => 'The Critical Role of Foliar Zinc and Boron During Flowering and Fruit Set',
            'slug' => 'zinc-boron-flowering-fruit-set',
            'excerpt_ar' => 'لماذا يُعتبر الجمع المتوازن بين الزنك المخلبي والبورون العضوي هو السر في الحصول على عقد ثمار ممتاز ومنع ظاهرة تساقط الأزهار الفسيولوجي؟',
            'excerpt_en' => 'Why the precise synergy between chelated zinc and organic boron is the key to preventing premature blossom drop and securing superior fruit sizing.',
            'content_ar' => '<p>يلعب عنصرا الزنك والبورون دوراً حيوياً لا غنى عنه في فترات التحول الفسيولوجي للنبات. حيث يقوم الزنك بتنشيط هرمون الأوكسين الطبيعي المسؤول عن استطالة الخلايا، بينما يُعد البورون المنظم الأساسي لإنبات حبوب اللقاح واستطالة الأنبوبة اللقاحية داخل مبيض الزهرة.</p><h3>فوائد الرش بمركب تابكو-فولير Zn+B:</h3><ul><li>منع ظاهرة "الموت الرجعي" وتشوهات الأوراق القمية.</li><li>زيادة نسبة العقد الفعلي وتقليل تساقط العقد الصغير الناتج عن الإجهاد الحراري.</li><li>تحسين انتظام حجم الثمار وزيادة محتواها من السكريات والمواد الصلبة الذائبة.</li></ul>',
            'content_en' => '<p>Zinc and boron play pivotal roles during crop reproductive cycles. Zinc stimulates natural auxin synthesis, whereas boron is mandatory for pollen tube elongation and fertilization.</p><h3>Key Benefits of Tapco-Foliar Zn+B:</h3><ul><li>Mitigates terminal bud dieback and foliar deformities.</li><li>Significantly enhances fruit set percentage and minimizes heat-stress drop.</li><li>Promotes uniform fruit caliper and higher brix levels.</li></ul>',
            'author_name' => 'م. مصطفى العيسوي - خبير التغذية النباتية',
            'published_at' => now()->subDays(12),
            'is_published' => true,
            'meta_title_ar' => 'التغذية الورقية بالزنك والبورون | TAPCO',
            'meta_title_en' => 'Foliar Zinc and Boron Nutrition | TAPCO',
            'meta_description_ar' => 'تعرف على دور الزنك والبورون في رفع كفاءة التزهير والعقد وزيادة محصول الموالح والعنب والخضار.',
            'meta_description_en' => 'Discover how chelated zinc and boron boost flowering, fruit set, and quality in citrus, vineyards, and field vegetables.',
        ]);

        // 12. Sample Inquiries
        Inquiry::create([
            'name' => 'الحاج إبراهيم منصور (مزارع موالح - النوبارية)',
            'phone' => '+201099887766',
            'email' => 'mansour.farms@gmail.com',
            'product_id' => $p1->id,
            'message' => 'السلام عليكم، نحتاج عرض سعر لكمية 50 لتر من تابكونور 20% لمكافحة الذبابة البيضاء في مزرعة موالح 30 فدان، وهل يوجد شحن لموقع المزرعة؟',
            'source' => 'product_page',
            'status' => 'new',
            'admin_note' => null,
        ]);

        Inquiry::create([
            'name' => 'شركة الدلتا للاستصلاح الزراعي',
            'phone' => '+201234509876',
            'email' => 'procurement@delta-agri.com',
            'product_id' => $p4->id,
            'message' => 'نطلب عرض أسعار رسمي لمبيد النيماتودا تابكوماكس 10% حبيبات عبوات 20 كجم، الكمية المطلوبة 2 طن للموسم الشتوي.',
            'source' => 'contact_form',
            'status' => 'contacted',
            'admin_note' => 'تم الاتصال بالمهندس المسؤول وإرسال عرض السعر الفني والمالي عبر الواتساب والبريد.',
        ]);
    }
}
