<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Cache::remember('public_settings', 3600, function () {
            $all = Setting::all();
            $map = [];
            foreach ($all as $item) {
                $map[$item->key] = [
                    'ar' => $item->value_ar,
                    'en' => $item->value_en,
                ];
            }
            return $map;
        });

        return ApiResponse::success($settings, 'Settings retrieved successfully');
    }
}
