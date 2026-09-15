<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AdminCertificateController extends Controller
{
    public function index(): JsonResponse
    {
        $certs = Certificate::orderBy('order', 'asc')->get();
        return ApiResponse::success($certs, 'Certificates list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title_ar' => 'required|string|max:191',
            'title_en' => 'required|string|max:191',
            'order' => 'nullable|integer',
            'image' => 'required|file|image|mimes:jpeg,jpg,png,webp,pdf|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('certificates', 'public');
        }

        $cert = Certificate::create($validated);
        Cache::forget('public_certificates');
        ActivityLog::log('create', Certificate::class, $cert->id, ['title' => $cert->title_en]);

        return ApiResponse::success($cert, 'تم إضافة الشهادة بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $cert = Certificate::find($id);
        if (!$cert) {
            return ApiResponse::error('Certificate not found', null, 404);
        }

        $validated = $request->validate([
            'title_ar' => 'sometimes|required|string|max:191',
            'title_en' => 'sometimes|required|string|max:191',
            'order' => 'nullable|integer',
            'image' => 'nullable|file|image|mimes:jpeg,jpg,png,webp,pdf|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($cert->image && Storage::disk('public')->exists($cert->image)) {
                Storage::disk('public')->delete($cert->image);
            }
            $validated['image'] = $request->file('image')->store('certificates', 'public');
        }

        $cert->update($validated);
        Cache::forget('public_certificates');
        ActivityLog::log('update', Certificate::class, $cert->id, ['title' => $cert->title_en]);

        return ApiResponse::success($cert, 'تم تحديث الشهادة بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $cert = Certificate::find($id);
        if (!$cert) {
            return ApiResponse::error('Certificate not found', null, 404);
        }

        if ($cert->image && Storage::disk('public')->exists($cert->image)) {
            Storage::disk('public')->delete($cert->image);
        }

        $title = $cert->title_en;
        $cert->delete();
        Cache::forget('public_certificates');
        ActivityLog::log('delete', Certificate::class, $id, ['title' => $title]);

        return ApiResponse::success(null, 'تم حذف الشهادة بنجاح');
    }
}
