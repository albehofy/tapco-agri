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
        $categories = Cache::remember('public_categories_tree', 3600, function () {
            return Category::whereNull('parent_id')
                ->with(['children' => function ($query) {
                    $query->withCount('products')->orderBy('order', 'asc');
                }])
                ->withCount('products')
                ->orderBy('order', 'asc')
                ->get();
        });

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
