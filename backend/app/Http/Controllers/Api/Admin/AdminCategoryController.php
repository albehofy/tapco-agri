<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orderBy('order', 'asc')
            ->get();

        return ApiResponse::success($categories, 'Categories tree retrieved');
    }

    public function all(): JsonResponse
    {
        $categories = Category::with('parent')->orderBy('order', 'asc')->get();
        return ApiResponse::success($categories, 'All categories flat list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'slug' => 'nullable|string|max:191|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'order' => 'nullable|integer',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'icon' => 'nullable|string|max:100',
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['name_en'] ?: $validated['name_ar']);
            $slug = $baseSlug ?: 'category-' . time();
            $count = 1;
            while (Category::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($validated);
        Cache::forget('public_categories_tree');
        ActivityLog::log('create', Category::class, $category->id, ['name' => $category->name_en]);

        return ApiResponse::success($category, 'تم إضافة الفئة بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return ApiResponse::error('Category not found', null, 404);
        }

        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:191',
            'name_en' => 'sometimes|required|string|max:191',
            'slug' => "nullable|string|max:191|unique:categories,slug,{$id}",
            'parent_id' => "nullable|different:id|exists:categories,id",
            'order' => 'nullable|integer',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'icon' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('image')) {
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);
        Cache::forget('public_categories_tree');
        ActivityLog::log('update', Category::class, $category->id, ['name' => $category->name_en]);

        return ApiResponse::success($category, 'تم تحديث الفئة بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);
        if (!$category) {
            return ApiResponse::error('Category not found', null, 404);
        }

        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $name = $category->name_en;
        $category->delete();

        Cache::forget('public_categories_tree');
        ActivityLog::log('delete', Category::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف الفئة بنجاح');
    }

    public function reorder(Request $request): JsonResponse
    {
        $items = $request->input('items', []); // [{id: 1, order: 0, parent_id: null}, ...]

        foreach ($items as $item) {
            if (isset($item['id'])) {
                Category::where('id', $item['id'])->update([
                    'order' => $item['order'] ?? 0,
                    'parent_id' => $item['parent_id'] ?? null,
                ]);
            }
        }

        Cache::forget('public_categories_tree');
        ActivityLog::log('reorder', Category::class, null, ['count' => count($items)]);

        return ApiResponse::success(null, 'تم تحديث ترتيب الفئات بنجاح');
    }
}
