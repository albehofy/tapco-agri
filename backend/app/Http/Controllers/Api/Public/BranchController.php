<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class BranchController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = Cache::remember('public_branches', 3600, function () {
            return Branch::orderBy('order', 'asc')->get()->toArray();
        });

        if (!is_array($branches)) {
            Cache::forget('public_branches');
            $branches = Branch::orderBy('order', 'asc')->get()->toArray();
        }

        return ApiResponse::success($branches, 'Branches retrieved successfully');
    }
}
