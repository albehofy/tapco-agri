<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Crop;
use App\Models\Pest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CropPestController extends Controller
{
    public function crops(): JsonResponse
    {
        $crops = Cache::remember('public_crops', 3600, function () {
            return Crop::withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])->get();
        });

        return ApiResponse::success($crops, 'Crops retrieved successfully');
    }

    public function pests(): JsonResponse
    {
        $pests = Cache::remember('public_pests', 3600, function () {
            return Pest::withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])->get();
        });

        return ApiResponse::success($pests, 'Pests retrieved successfully');
    }
}
