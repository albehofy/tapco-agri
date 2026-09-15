<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::where('is_published', true)
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('excerpt_ar', 'like', "%{$search}%")
                  ->orWhere('excerpt_en', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate((int) $request->input('per_page', 9));

        return ApiResponse::paginated($posts, 'Blog posts retrieved');
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)
            ->where('is_published', true)
            ->first();

        if (!$post) {
            return ApiResponse::error('Article not found', null, 404);
        }

        $recentPosts = BlogPost::where('is_published', true)
            ->where('id', '!=', $post->id)
            ->orderBy('published_at', 'desc')
            ->take(3)
            ->get();

        $data = $post->toArray();
        $data['recent_posts'] = $recentPosts;

        return ApiResponse::success($data, 'Article details retrieved');
    }
}
