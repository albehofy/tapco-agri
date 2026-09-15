<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::all();
        $formatted = [];
        foreach ($settings as $setting) {
            $formatted[$setting->key] = [
                'ar' => $setting->value_ar,
                'en' => $setting->value_en,
                'type' => $setting->type,
            ];
        }

        return ApiResponse::success($formatted, 'All settings retrieved');
    }

    public function update(Request $request): JsonResponse
    {
        $settingsData = $request->input('settings', []);

        foreach ($settingsData as $key => $values) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value_ar' => is_array($values) ? ($values['ar'] ?? null) : $values,
                    'value_en' => is_array($values) ? ($values['en'] ?? null) : $values,
                ]
            );
        }

        Cache::forget('public_settings');
        ActivityLog::log('update_settings', Setting::class, null, ['keys' => array_keys($settingsData)]);

        return ApiResponse::success(null, 'تم حفظ الإعدادات بنجاح');
    }
}
