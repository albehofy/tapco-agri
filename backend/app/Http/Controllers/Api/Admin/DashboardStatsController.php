<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;

class DashboardStatsController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $totalCategories = Category::count();
        $totalSuppliers = Supplier::count();
        $totalArticles = BlogPost::count();

        $totalInquiries = Inquiry::count();
        $newInquiries = Inquiry::where('status', 'new')->count();
        $newThisWeekInquiries = Inquiry::where('created_at', '>=', now()->subDays(7))->count();

        $recentInquiries = Inquiry::with('product')
            ->latest()
            ->take(5)
            ->get();

        $recentProducts = Product::with('category')
            ->latest()
            ->take(5)
            ->get();

        $recentActivities = ActivityLog::with('adminUser')
            ->latest()
            ->take(8)
            ->get();

        return ApiResponse::success([
            'counts' => [
                'products' => $totalProducts,
                'active_products' => $activeProducts,
                'categories' => $totalCategories,
                'suppliers' => $totalSuppliers,
                'articles' => $totalArticles,
                'inquiries_total' => $totalInquiries,
                'inquiries_new' => $newInquiries,
                'inquiries_week' => $newThisWeekInquiries,
            ],
            'recent_inquiries' => $recentInquiries,
            'recent_products' => $recentProducts,
            'recent_activities' => $recentActivities,
        ], 'Dashboard stats retrieved');
    }
}
