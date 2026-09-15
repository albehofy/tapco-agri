<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'supplier', 'crops', 'pests']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('active_ingredient_ar', 'like', "%{$search}%")
                  ->orWhere('active_ingredient_en', 'like', "%{$search}%");
            });
        }

        if ($catId = $request->input('category_id')) {
            $query->where('category_id', $catId);
        }

        if ($supId = $request->input('supplier_id')) {
            $query->where('supplier_id', $supId);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = (int) $request->input('per_page', 15);
        $products = $query->orderBy('order', 'asc')->latest()->paginate($perPage);

        return ApiResponse::paginated($products, 'Products retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with(['category', 'supplier', 'images', 'crops', 'pests'])->find($id);

        if (!$product) {
            return ApiResponse::error('Product not found', null, 404);
        }

        return ApiResponse::success($product, 'Product details');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'slug' => 'nullable|string|max:191|unique:products,slug',
            'active_ingredient_ar' => 'nullable|string|max:191',
            'active_ingredient_en' => 'nullable|string|max:191',
            'concentration' => 'nullable|string|max:100',
            'formulation_code' => 'nullable|string|max:50',
            'chemical_group_ar' => 'nullable|string|max:191',
            'chemical_group_en' => 'nullable|string|max:191',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'usage_instructions_ar' => 'nullable|string',
            'usage_instructions_en' => 'nullable|string',
            'pre_harvest_interval' => 'nullable|integer|min:0',
            'toxicity_class' => 'nullable|string|max:20',
            'hazard_signal_word_ar' => 'nullable|string|max:50',
            'hazard_signal_word_en' => 'nullable|string|max:50',
            'packaging_sizes' => 'nullable|string|max:191',
            'main_image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'datasheet_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'msds_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'crop_ids' => 'nullable|array',
            'crop_ids.*' => 'exists:crops,id',
            'pest_ids' => 'nullable|array',
            'pest_ids.*' => 'exists:pests,id',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // Slug generation
            if (empty($validated['slug'])) {
                $baseSlug = Str::slug($validated['name_en'] ?: $validated['name_ar']);
                $slug = $baseSlug ?: 'product-' . time();
                $count = 1;
                while (Product::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $count++;
                }
                $validated['slug'] = $slug;
            }

            // File uploads
            if ($request->hasFile('main_image')) {
                $validated['main_image'] = $request->file('main_image')->store('products', 'public');
            }

            if ($request->hasFile('datasheet_pdf')) {
                $validated['datasheet_pdf'] = $request->file('datasheet_pdf')->store('datasheets', 'public');
            }

            if ($request->hasFile('msds_pdf')) {
                $validated['msds_pdf'] = $request->file('msds_pdf')->store('msds', 'public');
            }

            // Create product
            $productData = collect($validated)->except(['crop_ids', 'pest_ids', 'gallery_images'])->toArray();
            $product = Product::create($productData);

            // Sync crops
            if (!empty($validated['crop_ids'])) {
                $product->crops()->sync($validated['crop_ids']);
            }

            // Sync pests
            if (!empty($validated['pest_ids'])) {
                $product->pests()->sync($validated['pest_ids']);
            }

            // Handle gallery images
            if ($request->hasFile('gallery_images')) {
                foreach ($request->file('gallery_images') as $idx => $imgFile) {
                    $imgPath = $imgFile->store('products/gallery', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imgPath,
                        'order' => $idx,
                    ]);
                }
            }

            DB::commit();

            Cache::forget('public_categories_tree');
            ActivityLog::log('create', Product::class, $product->id, ['name' => $product->name_en]);

            $product->load(['category', 'supplier', 'images', 'crops', 'pests']);
            return ApiResponse::success($product, 'تم إنشاء المنتج بنجاح', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('فشل حفظ المنتج: ' . $e->getMessage(), null, 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return ApiResponse::error('Product not found', null, 404);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name_ar' => 'sometimes|required|string|max:191',
            'name_en' => 'sometimes|required|string|max:191',
            'slug' => "nullable|string|max:191|unique:products,slug,{$id}",
            'active_ingredient_ar' => 'nullable|string|max:191',
            'active_ingredient_en' => 'nullable|string|max:191',
            'concentration' => 'nullable|string|max:100',
            'formulation_code' => 'nullable|string|max:50',
            'chemical_group_ar' => 'nullable|string|max:191',
            'chemical_group_en' => 'nullable|string|max:191',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'usage_instructions_ar' => 'nullable|string',
            'usage_instructions_en' => 'nullable|string',
            'pre_harvest_interval' => 'nullable|integer|min:0',
            'toxicity_class' => 'nullable|string|max:20',
            'hazard_signal_word_ar' => 'nullable|string|max:50',
            'hazard_signal_word_en' => 'nullable|string|max:50',
            'packaging_sizes' => 'nullable|string|max:191',
            'main_image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'datasheet_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'msds_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer',
            'crop_ids' => 'nullable|array',
            'crop_ids.*' => 'exists:crops,id',
            'pest_ids' => 'nullable|array',
            'pest_ids.*' => 'exists:pests,id',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'delete_gallery_image_ids' => 'nullable|array',
        ]);

        DB::beginTransaction();
        try {
            // Main image upload & replace
            if ($request->hasFile('main_image')) {
                if ($product->main_image && Storage::disk('public')->exists($product->main_image)) {
                    Storage::disk('public')->delete($product->main_image);
                }
                $validated['main_image'] = $request->file('main_image')->store('products', 'public');
            }

            // Datasheet PDF upload
            if ($request->hasFile('datasheet_pdf')) {
                if ($product->datasheet_pdf && Storage::disk('public')->exists($product->datasheet_pdf)) {
                    Storage::disk('public')->delete($product->datasheet_pdf);
                }
                $validated['datasheet_pdf'] = $request->file('datasheet_pdf')->store('datasheets', 'public');
            }

            // MSDS PDF upload
            if ($request->hasFile('msds_pdf')) {
                if ($product->msds_pdf && Storage::disk('public')->exists($product->msds_pdf)) {
                    Storage::disk('public')->delete($product->msds_pdf);
                }
                $validated['msds_pdf'] = $request->file('msds_pdf')->store('msds', 'public');
            }

            $productData = collect($validated)->except(['crop_ids', 'pest_ids', 'gallery_images', 'delete_gallery_image_ids'])->toArray();
            $product->update($productData);

            if ($request->has('crop_ids')) {
                $product->crops()->sync($validated['crop_ids'] ?? []);
            }

            if ($request->has('pest_ids')) {
                $product->pests()->sync($validated['pest_ids'] ?? []);
            }

            // Remove selected gallery images
            if (!empty($validated['delete_gallery_image_ids'])) {
                $imgsToDelete = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $validated['delete_gallery_image_ids'])
                    ->get();
                foreach ($imgsToDelete as $img) {
                    if (Storage::disk('public')->exists($img->image)) {
                        Storage::disk('public')->delete($img->image);
                    }
                    $img->delete();
                }
            }

            // Add new gallery images
            if ($request->hasFile('gallery_images')) {
                $currentMaxOrder = (int) $product->images()->max('order');
                foreach ($request->file('gallery_images') as $idx => $imgFile) {
                    $imgPath = $imgFile->store('products/gallery', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imgPath,
                        'order' => $currentMaxOrder + $idx + 1,
                    ]);
                }
            }

            DB::commit();

            Cache::forget('public_categories_tree');
            ActivityLog::log('update', Product::class, $product->id, ['name' => $product->name_en]);

            $product->load(['category', 'supplier', 'images', 'crops', 'pests']);
            return ApiResponse::success($product, 'تم تحديث المنتج بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::error('فشل تحديث المنتج: ' . $e->getMessage(), null, 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::with('images')->find($id);
        if (!$product) {
            return ApiResponse::error('Product not found', null, 404);
        }

        // Delete associated files
        if ($product->main_image && Storage::disk('public')->exists($product->main_image)) {
            Storage::disk('public')->delete($product->main_image);
        }
        if ($product->datasheet_pdf && Storage::disk('public')->exists($product->datasheet_pdf)) {
            Storage::disk('public')->delete($product->datasheet_pdf);
        }
        if ($product->msds_pdf && Storage::disk('public')->exists($product->msds_pdf)) {
            Storage::disk('public')->delete($product->msds_pdf);
        }
        foreach ($product->images as $img) {
            if (Storage::disk('public')->exists($img->image)) {
                Storage::disk('public')->delete($img->image);
            }
        }

        $name = $product->name_en;
        $product->delete();

        Cache::forget('public_categories_tree');
        ActivityLog::log('delete', Product::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف المنتج بنجاح');
    }
}
