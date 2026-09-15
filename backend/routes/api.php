<?php

use App\Http\Controllers\Api\Admin\ActivityLogController;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminBlogController;
use App\Http\Controllers\Api\Admin\AdminBranchController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminCertificateController;
use App\Http\Controllers\Api\Admin\AdminCropController;
use App\Http\Controllers\Api\Admin\AdminInquiryController;
use App\Http\Controllers\Api\Admin\AdminPestController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminSupplierController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\DashboardStatsController;
use App\Http\Controllers\Api\Public\BlogController;
use App\Http\Controllers\Api\Public\BranchController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\Public\CertificateController;
use App\Http\Controllers\Api\Public\CropPestController;
use App\Http\Controllers\Api\Public\InquiryController;
use App\Http\Controllers\Api\Public\ProductController;
use App\Http\Controllers\Api\Public\SettingController;
use App\Http\Controllers\Api\Public\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/suppliers', [SupplierController::class, 'index']);
Route::get('/crops', [CropPestController::class, 'crops']);
Route::get('/pests', [CropPestController::class, 'pests']);

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);

Route::get('/branches', [BranchController::class, 'index']);
Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/settings', [SettingController::class, 'index']);

// Public inquiry submission with rate limiting (5 per minute per IP)
Route::post('/inquiries', [InquiryController::class, 'store'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Admin Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| Admin Protected Routes (Sanctum Token Authentication)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::get('/dashboard-stats', [DashboardStatsController::class, 'stats']);

    // Products CRUD
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::get('/products/{id}', [AdminProductController::class, 'show']);
    Route::post('/products/{id}', [AdminProductController::class, 'update']); // for multipart form data
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

    // Categories CRUD & Reorder
    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::get('/categories/all', [AdminCategoryController::class, 'all']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::post('/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);
    Route::post('/categories/reorder', [AdminCategoryController::class, 'reorder']);

    // Suppliers CRUD
    Route::get('/suppliers', [AdminSupplierController::class, 'index']);
    Route::post('/suppliers', [AdminSupplierController::class, 'store']);
    Route::post('/suppliers/{id}', [AdminSupplierController::class, 'update']);
    Route::put('/suppliers/{id}', [AdminSupplierController::class, 'update']);
    Route::delete('/suppliers/{id}', [AdminSupplierController::class, 'destroy']);

    // Crops & Pests CRUD
    Route::get('/crops', [AdminCropController::class, 'index']);
    Route::post('/crops', [AdminCropController::class, 'store']);
    Route::post('/crops/{id}', [AdminCropController::class, 'update']);
    Route::put('/crops/{id}', [AdminCropController::class, 'update']);
    Route::delete('/crops/{id}', [AdminCropController::class, 'destroy']);

    Route::get('/pests', [AdminPestController::class, 'index']);
    Route::post('/pests', [AdminPestController::class, 'store']);
    Route::post('/pests/{id}', [AdminPestController::class, 'update']);
    Route::put('/pests/{id}', [AdminPestController::class, 'update']);
    Route::delete('/pests/{id}', [AdminPestController::class, 'destroy']);

    // Blog CRUD
    Route::get('/blog', [AdminBlogController::class, 'index']);
    Route::post('/blog', [AdminBlogController::class, 'store']);
    Route::get('/blog/{id}', [AdminBlogController::class, 'show']);
    Route::post('/blog/{id}', [AdminBlogController::class, 'update']);
    Route::put('/blog/{id}', [AdminBlogController::class, 'update']);
    Route::delete('/blog/{id}', [AdminBlogController::class, 'destroy']);

    // Branches CRUD
    Route::get('/branches', [AdminBranchController::class, 'index']);
    Route::post('/branches', [AdminBranchController::class, 'store']);
    Route::put('/branches/{id}', [AdminBranchController::class, 'update']);
    Route::delete('/branches/{id}', [AdminBranchController::class, 'destroy']);

    // Certificates CRUD
    Route::get('/certificates', [AdminCertificateController::class, 'index']);
    Route::post('/certificates', [AdminCertificateController::class, 'store']);
    Route::post('/certificates/{id}', [AdminCertificateController::class, 'update']);
    Route::put('/certificates/{id}', [AdminCertificateController::class, 'update']);
    Route::delete('/certificates/{id}', [AdminCertificateController::class, 'destroy']);

    // Inquiries Management
    Route::get('/inquiries', [AdminInquiryController::class, 'index']);
    Route::get('/inquiries/{id}', [AdminInquiryController::class, 'show']);
    Route::put('/inquiries/{id}', [AdminInquiryController::class, 'update']);
    Route::delete('/inquiries/{id}', [AdminInquiryController::class, 'destroy']);

    // Settings
    Route::get('/settings', [AdminSettingController::class, 'index']);
    Route::put('/settings', [AdminSettingController::class, 'update']);

    // Admin Users & Roles
    Route::get('/roles', [AdminUserController::class, 'roles']);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
});
