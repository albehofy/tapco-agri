<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminBranchController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = Branch::orderBy('order', 'asc')->get();
        return ApiResponse::success($branches, 'Branches list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'address_ar' => 'required|string|max:255',
            'address_en' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'working_hours_ar' => 'nullable|string|max:191',
            'working_hours_en' => 'nullable|string|max:191',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'order' => 'nullable|integer',
        ]);

        $branch = Branch::create($validated);
        Cache::forget('public_branches');
        ActivityLog::log('create', Branch::class, $branch->id, ['name' => $branch->name_en]);

        return ApiResponse::success($branch, 'تم إضافة الفرع بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return ApiResponse::error('Branch not found', null, 404);
        }

        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:191',
            'name_en' => 'sometimes|required|string|max:191',
            'address_ar' => 'sometimes|required|string|max:255',
            'address_en' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'working_hours_ar' => 'nullable|string|max:191',
            'working_hours_en' => 'nullable|string|max:191',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'order' => 'nullable|integer',
        ]);

        $branch->update($validated);
        Cache::forget('public_branches');
        ActivityLog::log('update', Branch::class, $branch->id, ['name' => $branch->name_en]);

        return ApiResponse::success($branch, 'تم تحديث بيانات الفرع بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $branch = Branch::find($id);
        if (!$branch) {
            return ApiResponse::error('Branch not found', null, 404);
        }

        $name = $branch->name_en;
        $branch->delete();
        Cache::forget('public_branches');
        ActivityLog::log('delete', Branch::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف الفرع بنجاح');
    }
}
