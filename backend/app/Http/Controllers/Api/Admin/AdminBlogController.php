<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminBlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $posts = $query->latest('published_at')->paginate($perPage);

        return ApiResponse::paginated($posts, 'Blog posts list');
    }

    public function show(int $id): JsonResponse
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return ApiResponse::error('Post not found', null, 404);
        }
        return ApiResponse::success($post, 'Post details');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:191',
            'title_en' => 'required|string|max:191',
            'slug' => 'nullable|string|max:191|unique:blog_posts,slug',
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'content_ar' => 'required|string',
            'content_en' => 'required|string',
            'author_name' => 'nullable|string|max:100',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'meta_title_ar' => 'nullable|string|max:191',
            'meta_title_en' => 'nullable|string|max:191',
            'meta_description_ar' => 'nullable|string',
            'meta_description_en' => 'nullable|string',
            'cover_image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title_en'] ?: $validated['title_ar']) ?: 'post-' . time();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = BlogPost::create($validated);
        ActivityLog::log('create', BlogPost::class, $post->id, ['title' => $post->title_en]);

        return ApiResponse::success($post, 'تم إنشاء المقال بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return ApiResponse::error('Post not found', null, 404);
        }

        $validated = $request->validate([
            'title_ar' => 'sometimes|required|string|max:191',
            'title_en' => 'sometimes|required|string|max:191',
            'slug' => "nullable|string|max:191|unique:blog_posts,slug,{$id}",
            'excerpt_ar' => 'nullable|string',
            'excerpt_en' => 'nullable|string',
            'content_ar' => 'sometimes|required|string',
            'content_en' => 'sometimes|required|string',
            'author_name' => 'nullable|string|max:100',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'meta_title_ar' => 'nullable|string|max:191',
            'meta_title_en' => 'nullable|string|max:191',
            'meta_description_ar' => 'nullable|string',
            'meta_description_en' => 'nullable|string',
            'cover_image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($post->cover_image && Storage::disk('public')->exists($post->cover_image)) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('blog', 'public');
        }

        $post->update($validated);
        ActivityLog::log('update', BlogPost::class, $post->id, ['title' => $post->title_en]);

        return ApiResponse::success($post, 'تم تحديث المقال بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return ApiResponse::error('Post not found', null, 404);
        }

        if ($post->cover_image && Storage::disk('public')->exists($post->cover_image)) {
            Storage::disk('public')->delete($post->cover_image);
        }

        $title = $post->title_en;
        $post->delete();
        ActivityLog::log('delete', BlogPost::class, $id, ['title' => $title]);

        return ApiResponse::success(null, 'تم حذف المقال بنجاح');
    }
}
