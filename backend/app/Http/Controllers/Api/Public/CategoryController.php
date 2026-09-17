<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $fetchCategories = function () {
            $categories = Category::whereNull('parent_id')
                ->with(['children' => function ($query) {
                    $query->withCount('products')->orderBy('order', 'asc');
                }])
                ->withCount('products')
                ->orderBy('order', 'asc')
                ->get();

            $categories->each(function ($cat) {
                $childrenSum = $cat->children ? $cat->children->sum('products_count') : 0;
                $cat->setAttribute('total_products_count', ($cat->products_count ?? 0) + $childrenSum);
            });

            return $categories->toArray();
        };

        $categories = Cache::remember('public_categories_tree', 3600, $fetchCategories);

        if (!is_array($categories)) {
            Cache::forget('public_categories_tree');
            $categories = $fetchCategories();
        }

        return ApiResponse::success($categories, 'Categories retrieved successfully');
    }

    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->with(['children' => function ($query) {
                $query->withCount('products');
            }, 'parent'])
            ->withCount('products')
            ->first();

        if (!$category) {
            return ApiResponse::error('Category not found', null, 404);
        }

        return ApiResponse::success($category, 'Category details retrieved');
    }
}
