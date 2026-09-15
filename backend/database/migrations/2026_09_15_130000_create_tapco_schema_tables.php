<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Admin, Editor
            $table->json('permissions')->nullable();
            $table->timestamps();
        });

        // 2. Admin Users
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        // 3. Categories (self-referencing parent_id)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 4. Suppliers
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 5. Crops
        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // 6. Pests
        Schema::create('pests', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('type')->default('insect'); // insect, fungus, weed, nematode
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // 7. Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained('suppliers')->nullOnDelete();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->string('active_ingredient_ar')->nullable();
            $table->string('active_ingredient_en')->nullable();
            $table->string('concentration')->nullable(); // e.g. "10.8%"
            $table->string('formulation_code')->nullable(); // EC, WP, SC, SL, WG, SG
            $table->string('chemical_group_ar')->nullable();
            $table->string('chemical_group_en')->nullable();
            $table->longText('description_ar')->nullable();
            $table->longText('description_en')->nullable();
            $table->longText('usage_instructions_ar')->nullable();
            $table->longText('usage_instructions_en')->nullable();
            $table->integer('pre_harvest_interval')->nullable(); // Days (PHI)
            $table->string('toxicity_class')->nullable(); // I, II, III, IV
            $table->string('hazard_signal_word_ar')->nullable(); // خطر / تحذير / احترس
            $table->string('hazard_signal_word_en')->nullable(); // Danger / Warning / Caution
            $table->string('packaging_sizes')->nullable(); // 1L, 5L, 20L
            $table->string('main_image')->nullable();
            $table->string('datasheet_pdf')->nullable();
            $table->string('msds_pdf')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 8. Product Images
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('image');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 9. Product Crops Pivot
        Schema::create('product_crops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('crop_id')->constrained('crops')->cascadeOnDelete();
            $table->string('dosage_note_ar')->nullable();
            $table->string('dosage_note_en')->nullable();
        });

        // 10. Product Pests Pivot
        Schema::create('product_pests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('pest_id')->constrained('pests')->cascadeOnDelete();
        });

        // 11. Blog Posts
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('slug')->unique();
            $table->text('excerpt_ar')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->longText('content_ar')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('author_name')->default('TAPCO Agriculture');
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_published')->default(true);
            $table->string('meta_title_ar')->nullable();
            $table->string('meta_title_en')->nullable();
            $table->text('meta_description_ar')->nullable();
            $table->text('meta_description_en')->nullable();
            $table->timestamps();
        });

        // 12. Inquiries
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->text('message');
            $table->string('source')->default('contact_form'); // contact_form, product_page, whatsapp_click
            $table->string('status')->default('new'); // new, contacted, closed
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });

        // 13. Branches
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('address_ar');
            $table->string('address_en');
            $table->string('phone');
            $table->string('whatsapp')->nullable();
            $table->string('working_hours_ar')->nullable();
            $table->string('working_hours_en')->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 14. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('image');
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // 15. Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value_ar')->nullable();
            $table->text('value_en')->nullable();
            $table->string('type')->default('text'); // text, number, boolean, json
            $table->timestamps();
        });

        // 16. Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->nullable()->constrained('admin_users')->nullOnDelete();
            $table->string('action'); // create, update, delete, login
            $table->string('model_type')->nullable();
            $table->string('model_id')->nullable();
            $table->text('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('product_pests');
        Schema::dropIfExists('product_crops');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('pests');
        Schema::dropIfExists('crops');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('admin_users');
        Schema::dropIfExists('roles');
    }
};
