<?php

namespace Tests\Feature;

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
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FullApiAndIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed database
        $this->seed(DatabaseSeeder::class);
    }

    /*
    |--------------------------------------------------------------------------
    | 1. PUBLIC API TESTS
    |--------------------------------------------------------------------------
    */

    public function test_public_categories_list(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name_ar',
                        'name_en',
                        'slug',
                        'parent_id',
                        'order',
                        'children',
                    ]
                ],
                'message'
            ]);
    }

    public function test_public_category_by_slug(): void
    {
        $response = $this->getJson('/api/categories/pesticides');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'pesticides',
                ]
            ]);

        $invalid = $this->getJson('/api/categories/non-existent-category-slug');
        $invalid->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_public_products_list_pagination_and_filters(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name_ar',
                        'name_en',
                        'slug',
                        'is_active',
                        'category',
                        'supplier',
                    ]
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
                'message'
            ]);

        // Test search filter
        $searchRes = $this->getJson('/api/products?search=Tapconor');
        $searchRes->assertStatus(200);
        $this->assertGreaterThanOrEqual(1, count($searchRes->json('data')));

        // Test category filter
        $catRes = $this->getJson('/api/products?category=insecticides');
        $catRes->assertStatus(200);

        // Test sorting
        $sortRes = $this->getJson('/api/products?sort=popular');
        $sortRes->assertStatus(200);
    }

    public function test_public_featured_products(): void
    {
        $response = $this->getJson('/api/products/featured');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
        $data = $response->json('data');
        $this->assertIsArray($data);
        foreach ($data as $prod) {
            $this->assertTrue((bool)$prod['is_featured']);
        }
    }

    public function test_public_product_by_slug(): void
    {
        $response = $this->getJson('/api/products/tapconor-20-sl');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'tapconor-20-sl',
                ]
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name_ar',
                    'name_en',
                    'slug',
                    'category',
                    'crops',
                    'pests',
                    'related_products',
                ]
            ]);

        $invalid = $this->getJson('/api/products/unknown-product-xyz');
        $invalid->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_public_suppliers(): void
    {
        $response = $this->getJson('/api/suppliers');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'website', 'order']
                ]
            ]);
    }

    public function test_public_crops_and_pests(): void
    {
        $cropsRes = $this->getJson('/api/crops');
        $cropsRes->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name_ar', 'name_en', 'slug']
                ]
            ]);

        $pestsRes = $this->getJson('/api/pests');
        $pestsRes->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name_ar', 'name_en', 'slug', 'type']
                ]
            ]);
    }

    public function test_public_blog(): void
    {
        $response = $this->getJson('/api/blog');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title_ar', 'title_en', 'slug', 'content_ar']
                ],
                'meta' => ['current_page', 'last_page', 'total']
            ]);

        $postRes = $this->getJson('/api/blog/leafminer-management-tomatoes');
        $postRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'leafminer-management-tomatoes',
                ]
            ]);

        $invalid = $this->getJson('/api/blog/missing-blog-post');
        $invalid->assertStatus(404);
    }

    public function test_public_branches_and_certificates(): void
    {
        $branchesRes = $this->getJson('/api/branches');
        $branchesRes->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name_ar', 'name_en', 'address_ar', 'phone']
                ]
            ]);

        $certsRes = $this->getJson('/api/certificates');
        $certsRes->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title_ar', 'title_en', 'image']
                ]
            ]);
    }

    public function test_public_settings(): void
    {
        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $data = $response->json('data');
        $this->assertArrayHasKey('phone_number', $data);
        $this->assertArrayHasKey('email_contact', $data);
    }

    public function test_public_inquiry_submission_validation_and_success(): void
    {
        // Missing required fields
        $badRes = $this->postJson('/api/inquiries', []);
        $badRes->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'phone', 'message']);

        // Valid submission
        $product = Product::first();
        $goodRes = $this->postJson('/api/inquiries', [
            'name' => 'Ahmed Test',
            'phone' => '+201011223344',
            'email' => 'ahmed.test@example.com',
            'product_id' => $product->id,
            'message' => 'I would like to inquire about price for 100 liters.',
            'source' => 'product_page'
        ]);

        $goodRes->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('inquiries', [
            'name' => 'Ahmed Test',
            'phone' => '+201011223344',
            'product_id' => $product->id,
            'status' => 'new',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 2. ADMIN AUTHENTICATION & SECURITY TESTS
    |--------------------------------------------------------------------------
    */

    public function test_admin_login_validation_and_failures(): void
    {
        // Missing credentials
        $this->postJson('/api/admin/login', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);

        // Wrong password
        $this->postJson('/api/admin/login', [
            'email' => 'admin@tapco-agri.com',
            'password' => 'wrongpass'
        ])->assertStatus(422);

        // Disabled user
        $inactiveAdmin = AdminUser::create([
            'name' => 'Inactive User',
            'email' => 'inactive@tapco-agri.com',
            'password' => bcrypt('password123'),
            'role_id' => Role::first()->id,
            'is_active' => false,
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'inactive@tapco-agri.com',
            'password' => 'password123'
        ])->assertStatus(403);
    }

    public function test_admin_login_and_token_generation(): string
    {
        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@tapco-agri.com',
            'password' => 'admin123'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'admin@tapco-agri.com',
                    ]
                ]
            ]);

        $token = $response->json('data.token');
        $this->assertNotEmpty($token);

        return $token;
    }

    public function test_admin_protected_routes_unauthenticated(): void
    {
        $this->getJson('/api/admin/dashboard-stats')->assertStatus(401);
        $this->getJson('/api/admin/products')->assertStatus(401);
        $this->getJson('/api/admin/categories')->assertStatus(401);
        $this->getJson('/api/admin/users')->assertStatus(401);
        $this->getJson('/api/admin/settings')->assertStatus(401);
    }

    /*
    |--------------------------------------------------------------------------
    | 3. ADMIN PROTECTED CRUD & OPERATIONS TESTS
    |--------------------------------------------------------------------------
    */

    private function getAuthHeader(): array
    {
        $admin = AdminUser::where('email', 'admin@tapco-agri.com')->first();
        $token = $admin->createToken('test-token')->plainTextToken;
        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_admin_me(): void
    {
        $headers = $this->getAuthHeader();
        $response = $this->getJson('/api/admin/me', $headers);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'admin@tapco-agri.com',
                ]
            ]);
    }

    public function test_admin_dashboard_stats(): void
    {
        $headers = $this->getAuthHeader();
        $response = $this->getJson('/api/admin/dashboard-stats', $headers);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'counts' => [
                        'products',
                        'active_products',
                        'categories',
                        'suppliers',
                        'articles',
                        'inquiries_total',
                        'inquiries_new',
                        'inquiries_week',
                    ],
                    'recent_inquiries',
                    'recent_products',
                    'recent_activities',
                ]
            ]);
    }

    public function test_admin_products_crud_cycle(): void
    {
        $headers = $this->getAuthHeader();
        Storage::fake('public');

        $category = Category::first();
        $supplier = Supplier::first();
        $crop = Crop::first();
        $pest = Pest::first();

        // 1. Index
        $indexRes = $this->getJson('/api/admin/products', $headers);
        $indexRes->assertStatus(200)
            ->assertJson(['success' => true]);

        // 2. Store with image
        $createData = [
            'name_ar' => 'منتج اختباري جديد',
            'name_en' => 'Test Product New',
            'category_id' => $category->id,
            'supplier_id' => $supplier->id,
            'active_ingredient_ar' => 'مادة فعالة',
            'active_ingredient_en' => 'Active Ingredient',
            'concentration' => '10% EC',
            'crop_ids' => [$crop->id],
            'pest_ids' => [$pest->id],
            'main_image' => UploadedFile::fake()->image('test_product.jpg'),
            'is_active' => '1',
            'is_featured' => '0',
            'order' => '10',
        ];

        $storeRes = $this->postJson('/api/admin/products', $createData, $headers);
        $storeRes->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name_en' => 'Test Product New',
                ]
            ]);

        $productId = $storeRes->json('data.id');
        $this->assertDatabaseHas('products', ['id' => $productId, 'name_en' => 'Test Product New']);

        // 3. Show
        $showRes = $this->getJson("/api/admin/products/{$productId}", $headers);
        $showRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $productId,
                    'name_en' => 'Test Product New',
                ]
            ]);

        // 4. Update
        $updateRes = $this->postJson("/api/admin/products/{$productId}", [
            'name_ar' => 'منتج اختباري محدث',
            'name_en' => 'Test Product Updated',
            'category_id' => $category->id,
            'is_featured' => '1',
        ], $headers);

        $updateRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'name_en' => 'Test Product Updated',
                ]
            ]);

        // 5. Delete
        $deleteRes = $this->deleteJson("/api/admin/products/{$productId}", [], $headers);
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_admin_categories_crud_and_reorder(): void
    {
        $headers = $this->getAuthHeader();

        // 1. Index & All
        $this->getJson('/api/admin/categories', $headers)->assertStatus(200);
        $this->getJson('/api/admin/categories/all', $headers)->assertStatus(200);

        // 2. Store
        $storeRes = $this->postJson('/api/admin/categories', [
            'name_ar' => 'تصنيف تجريبي',
            'name_en' => 'Test Category',
            'slug' => 'test-category',
            'order' => 99,
        ], $headers);

        $storeRes->assertStatus(201);
        $catId = $storeRes->json('data.id');

        // 3. Update
        $this->postJson("/api/admin/categories/{$catId}", [
            'name_ar' => 'تصنيف تجريبي محدث',
            'name_en' => 'Test Category Updated',
            'slug' => 'test-category-updated',
        ], $headers)->assertStatus(200);

        // 4. Reorder
        $this->postJson('/api/admin/categories/reorder', [
            'items' => [
                ['id' => $catId, 'order' => 1, 'parent_id' => null]
            ]
        ], $headers)->assertStatus(200);

        // 5. Delete
        $this->deleteJson("/api/admin/categories/{$catId}", [], $headers)->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $catId]);
    }

    public function test_admin_suppliers_crud(): void
    {
        $headers = $this->getAuthHeader();

        // Store
        $res = $this->postJson('/api/admin/suppliers', [
            'name' => 'New Agro Supplier',
            'website' => 'https://newsupplier.com',
            'order' => 5,
        ], $headers);

        $res->assertStatus(201);
        $id = $res->json('data.id');

        // Update
        $this->postJson("/api/admin/suppliers/{$id}", [
            'name' => 'Updated Agro Supplier',
            'website' => 'https://updatedsupplier.com',
        ], $headers)->assertStatus(200);

        // Delete
        $this->deleteJson("/api/admin/suppliers/{$id}", [], $headers)->assertStatus(200);
    }

    public function test_admin_crops_and_pests_crud(): void
    {
        $headers = $this->getAuthHeader();

        // Crop CRUD
        $cropRes = $this->postJson('/api/admin/crops', [
            'name_ar' => 'محصول تجريبي',
            'name_en' => 'Test Crop',
            'slug' => 'test-crop',
        ], $headers);
        $cropRes->assertStatus(201);
        $cropId = $cropRes->json('data.id');

        $this->postJson("/api/admin/crops/{$cropId}", [
            'name_ar' => 'محصول تجريبي معدل',
            'name_en' => 'Test Crop Updated',
        ], $headers)->assertStatus(200);

        $this->deleteJson("/api/admin/crops/{$cropId}", [], $headers)->assertStatus(200);

        // Pest CRUD
        $pestRes = $this->postJson('/api/admin/pests', [
            'name_ar' => 'آفة تجريبية',
            'name_en' => 'Test Pest',
            'slug' => 'test-pest',
            'type' => 'insect',
        ], $headers);
        $pestRes->assertStatus(201);
        $pestId = $pestRes->json('data.id');

        $this->postJson("/api/admin/pests/{$pestId}", [
            'name_ar' => 'آفة تجريبية معدلة',
            'name_en' => 'Test Pest Updated',
            'type' => 'fungus',
        ], $headers)->assertStatus(200);

        $this->deleteJson("/api/admin/pests/{$pestId}", [], $headers)->assertStatus(200);
    }

    public function test_admin_blog_crud(): void
    {
        $headers = $this->getAuthHeader();

        $res = $this->postJson('/api/admin/blog', [
            'title_ar' => 'مقال تجريبي عن الزراعة',
            'title_en' => 'Test Agriculture Article',
            'slug' => 'test-agriculture-article',
            'content_ar' => 'محتوى المقال العربي بالتفصيل',
            'content_en' => 'Article English content in detail',
            'author_name' => 'Admin Author',
            'is_published' => true,
        ], $headers);

        $res->assertStatus(201);
        $id = $res->json('data.id');

        $this->getJson("/api/admin/blog/{$id}", $headers)->assertStatus(200);

        $this->postJson("/api/admin/blog/{$id}", [
            'title_ar' => 'مقال تجريبي محدث',
            'title_en' => 'Test Agriculture Article Updated',
        ], $headers)->assertStatus(200);

        $this->deleteJson("/api/admin/blog/{$id}", [], $headers)->assertStatus(200);
    }

    public function test_admin_branches_and_certificates_crud(): void
    {
        $headers = $this->getAuthHeader();

        // Branch
        $bRes = $this->postJson('/api/admin/branches', [
            'name_ar' => 'فرع طنطا',
            'name_en' => 'Tanta Branch',
            'address_ar' => 'طنطا، الغربية',
            'address_en' => 'Tanta, Gharbia',
            'phone' => '+20401122334',
            'order' => 4,
        ], $headers);
        $bRes->assertStatus(201);
        $bId = $bRes->json('data.id');

        $this->putJson("/api/admin/branches/{$bId}", [
            'name_ar' => 'فرع طنطا المحدث',
            'name_en' => 'Tanta Branch Updated',
            'address_ar' => 'طنطا، الغربية',
            'address_en' => 'Tanta, Gharbia',
            'phone' => '+20401122334',
        ], $headers)->assertStatus(200);

        $this->deleteJson("/api/admin/branches/{$bId}", [], $headers)->assertStatus(200);

        // Certificate
        Storage::fake('public');
        $cRes = $this->postJson('/api/admin/certificates', [
            'title_ar' => 'شهادة تجريبية',
            'title_en' => 'Test Certificate',
            'image' => UploadedFile::fake()->image('cert.png'),
            'order' => 1,
        ], $headers);
        $cRes->assertStatus(201);
        $cId = $cRes->json('data.id');

        $this->deleteJson("/api/admin/certificates/{$cId}", [], $headers)->assertStatus(200);
    }

    public function test_admin_inquiries_management(): void
    {
        $headers = $this->getAuthHeader();
        $inquiry = Inquiry::first();

        // List
        $this->getJson('/api/admin/inquiries', $headers)->assertStatus(200);

        // Show
        $this->getJson("/api/admin/inquiries/{$inquiry->id}", $headers)
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $inquiry->id,
                ]
            ]);

        // Update status & admin note
        $this->putJson("/api/admin/inquiries/{$inquiry->id}", [
            'status' => 'contacted',
            'admin_note' => 'Called client on phone',
        ], $headers)
            ->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'contacted',
                    'admin_note' => 'Called client on phone',
                ]
            ]);

        // Delete
        $this->deleteJson("/api/admin/inquiries/{$inquiry->id}", [], $headers)->assertStatus(200);
        $this->assertDatabaseMissing('inquiries', ['id' => $inquiry->id]);
    }

    public function test_admin_settings_management(): void
    {
        $headers = $this->getAuthHeader();

        $this->getJson('/api/admin/settings', $headers)->assertStatus(200);

        $this->putJson('/api/admin/settings', [
            'settings' => [
                'phone_number' => [
                    'ar' => '+20111111111',
                    'en' => '+20111111111',
                ]
            ]
        ], $headers)->assertStatus(200);
    }

    public function test_admin_users_and_roles(): void
    {
        $headers = $this->getAuthHeader();

        // Roles
        $rolesRes = $this->getJson('/api/admin/roles', $headers);
        $rolesRes->assertStatus(200);
        $editorRole = Role::where('name', 'Editor')->first();

        // User Create
        $uRes = $this->postJson('/api/admin/users', [
            'name' => 'New Staff User',
            'email' => 'newstaff@tapco-agri.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => $editorRole->id,
            'is_active' => true,
        ], $headers);

        $uRes->assertStatus(201);
        $userId = $uRes->json('data.id');

        // User Update
        $this->putJson("/api/admin/users/{$userId}", [
            'name' => 'New Staff User Updated',
            'is_active' => false,
        ], $headers)->assertStatus(200);

        // User Delete
        $this->deleteJson("/api/admin/users/{$userId}", [], $headers)->assertStatus(200);
    }

    public function test_admin_activity_logs(): void
    {
        $headers = $this->getAuthHeader();
        $this->getJson('/api/admin/activity-logs', $headers)
            ->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_admin_logout(): void
    {
        $headers = $this->getAuthHeader();
        $this->postJson('/api/admin/logout', [], $headers)
            ->assertStatus(200)
            ->assertJson(['success' => true]);
    }
}
