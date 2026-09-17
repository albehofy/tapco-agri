<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SupplierController extends Controller
{
    public function index(): JsonResponse
    {
        $suppliers = Cache::remember('public_suppliers', 3600, function () {
            return Supplier::orderBy('order', 'asc')
                ->withCount(['products' => function ($q) {
                    $q->where('is_active', true);
                }])
                ->get()
                ->toArray();
        });

        if (!is_array($suppliers)) {
            Cache::forget('public_suppliers');
            $suppliers = Supplier::orderBy('order', 'asc')
                ->withCount(['products' => function ($q) {
                    $q->where('is_active', true);
                }])
                ->get()
                ->toArray();
        }

        return ApiResponse::success($suppliers, 'Suppliers retrieved successfully');
    }
}
