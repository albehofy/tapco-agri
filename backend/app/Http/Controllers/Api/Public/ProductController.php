<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['category', 'supplier', 'crops', 'pests']);

        // Search in names and active ingredients
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('active_ingredient_ar', 'like', "%{$search}%")
                  ->orWhere('active_ingredient_en', 'like', "%{$search}%");
            });
        }

        // Category filter (slug or ID, including child categories)
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                  ->orWhere('id', $categorySlug)
                  ->orWhereHas('parent', function ($pq) use ($categorySlug) {
                      $pq->where('slug', $categorySlug)->orWhere('id', $categorySlug);
                  });
            });
        }

        // Supplier filter
        if ($supplier = $request->input('supplier')) {
            $query->whereHas('supplier', function ($q) use ($supplier) {
                $q->where('id', $supplier)->orWhere('name', 'like', "%{$supplier}%");
            });
        }

        // Crop filter
        if ($crop = $request->input('crop')) {
            $query->whereHas('crops', function ($q) use ($crop) {
                $q->where('crops.slug', $crop)->orWhere('crops.id', $crop);
            });
        }

        // Pest filter
        if ($pest = $request->input('pest')) {
            $query->whereHas('pests', function ($q) use ($pest) {
                $q->where('pests.slug', $pest)->orWhere('pests.id', $pest);
            });
        }

        // Sorting
        $sort = $request->input('sort', 'order');
        if ($sort === 'latest') {
            $query->latest();
        } elseif ($sort === 'popular') {
            $query->orderBy('views_count', 'desc');
        } else {
            $query->orderBy('order', 'asc')->latest();
        }

        $perPage = min(max((int) $request->input('per_page', 12), 1), 50);
        $products = $query->paginate($perPage);

        return ApiResponse::paginated($products, 'Products retrieved successfully');
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['category.parent', 'supplier', 'images', 'crops', 'pests'])
            ->first();

        if (!$product) {
            return ApiResponse::error('Product not found', null, 404);
        }

        // Increment views
        $product->increment('views_count');

        // Related products in the same category
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->take(4)
            ->get();

        $productData = $product->toArray();
        $productData['related_products'] = $relatedProducts;

        return ApiResponse::success($productData, 'Product details retrieved');
    }

    public function featured(): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with(['category', 'supplier'])
            ->orderBy('order', 'asc')
            ->take(8)
            ->get();

        return ApiResponse::success($products, 'Featured products retrieved');
    }
}
