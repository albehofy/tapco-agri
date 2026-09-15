<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Pest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminPestController extends Controller
{
    public function index(): JsonResponse
    {
        $pests = Pest::withCount('products')->get();
        return ApiResponse::success($pests, 'Pests list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'slug' => 'nullable|string|max:191|unique:pests,slug',
            'type' => 'required|string|in:insect,fungus,weed,nematode,other',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name_en'] ?: $validated['name_ar']) ?: 'pest-' . time();
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('pests', 'public');
        }

        $pest = Pest::create($validated);
        Cache::forget('public_pests');
        ActivityLog::log('create', Pest::class, $pest->id, ['name' => $pest->name_en]);

        return ApiResponse::success($pest, 'تم إضافة الآفة/المرض بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $pest = Pest::find($id);
        if (!$pest) {
            return ApiResponse::error('Pest not found', null, 404);
        }

        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:191',
            'name_en' => 'sometimes|required|string|max:191',
            'slug' => "nullable|string|max:191|unique:pests,slug,{$id}",
            'type' => 'sometimes|required|string|in:insect,fungus,weed,nematode,other',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($pest->image && Storage::disk('public')->exists($pest->image)) {
                Storage::disk('public')->delete($pest->image);
            }
            $validated['image'] = $request->file('image')->store('pests', 'public');
        }

        $pest->update($validated);
        Cache::forget('public_pests');
        ActivityLog::log('update', Pest::class, $pest->id, ['name' => $pest->name_en]);

        return ApiResponse::success($pest, 'تم تحديث بيانات الآفة بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $pest = Pest::find($id);
        if (!$pest) {
            return ApiResponse::error('Pest not found', null, 404);
        }

        if ($pest->image && Storage::disk('public')->exists($pest->image)) {
            Storage::disk('public')->delete($pest->image);
        }

        $name = $pest->name_en;
        $pest->delete();

        Cache::forget('public_pests');
        ActivityLog::log('delete', Pest::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف الآفة بنجاح');
    }
}
