<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Crop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCropController extends Controller
{
    public function index(): JsonResponse
    {
        $crops = Crop::withCount('products')->get();
        return ApiResponse::success($crops, 'Crops list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'slug' => 'nullable|string|max:191|unique:crops,slug',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name_en'] ?: $validated['name_ar']) ?: 'crop-' . time();
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('crops', 'public');
        }

        $crop = Crop::create($validated);
        Cache::forget('public_crops');
        ActivityLog::log('create', Crop::class, $crop->id, ['name' => $crop->name_en]);

        return ApiResponse::success($crop, 'تم إضافة المحصول بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $crop = Crop::find($id);
        if (!$crop) {
            return ApiResponse::error('Crop not found', null, 404);
        }

        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:191',
            'name_en' => 'sometimes|required|string|max:191',
            'slug' => "nullable|string|max:191|unique:crops,slug,{$id}",
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($crop->image && Storage::disk('public')->exists($crop->image)) {
                Storage::disk('public')->delete($crop->image);
            }
            $validated['image'] = $request->file('image')->store('crops', 'public');
        }

        $crop->update($validated);
        Cache::forget('public_crops');
        ActivityLog::log('update', Crop::class, $crop->id, ['name' => $crop->name_en]);

        return ApiResponse::success($crop, 'تم تحديث بيانات المحصول بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $crop = Crop::find($id);
        if (!$crop) {
            return ApiResponse::error('Crop not found', null, 404);
        }

        if ($crop->image && Storage::disk('public')->exists($crop->image)) {
            Storage::disk('public')->delete($crop->image);
        }

        $name = $crop->name_en;
        $crop->delete();

        Cache::forget('public_crops');
        ActivityLog::log('delete', Crop::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف المحصول بنجاح');
    }
}
