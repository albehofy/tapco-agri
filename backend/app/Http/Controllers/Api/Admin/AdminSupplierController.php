<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AdminSupplierController extends Controller
{
    public function index(): JsonResponse
    {
        $suppliers = Supplier::withCount('products')->orderBy('order', 'asc')->get();
        return ApiResponse::success($suppliers, 'Suppliers list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'website' => 'nullable|url|max:191',
            'order' => 'nullable|integer',
            'logo' => 'nullable|file|image|mimes:jpeg,jpg,png,webp,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        $supplier = Supplier::create($validated);
        Cache::forget('public_suppliers');
        ActivityLog::log('create', Supplier::class, $supplier->id, ['name' => $supplier->name]);

        return ApiResponse::success($supplier, 'تم إضافة المورد بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return ApiResponse::error('Supplier not found', null, 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:191',
            'website' => 'nullable|url|max:191',
            'order' => 'nullable|integer',
            'logo' => 'nullable|file|image|mimes:jpeg,jpg,png,webp,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($supplier->logo && Storage::disk('public')->exists($supplier->logo)) {
                Storage::disk('public')->delete($supplier->logo);
            }
            $validated['logo'] = $request->file('logo')->store('suppliers', 'public');
        }

        $supplier->update($validated);
        Cache::forget('public_suppliers');
        ActivityLog::log('update', Supplier::class, $supplier->id, ['name' => $supplier->name]);

        return ApiResponse::success($supplier, 'تم تحديث بيانات المورد بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $supplier = Supplier::find($id);
        if (!$supplier) {
            return ApiResponse::error('Supplier not found', null, 404);
        }

        if ($supplier->logo && Storage::disk('public')->exists($supplier->logo)) {
            Storage::disk('public')->delete($supplier->logo);
        }

        $name = $supplier->name;
        $supplier->delete();

        Cache::forget('public_suppliers');
        ActivityLog::log('delete', Supplier::class, $id, ['name' => $name]);

        return ApiResponse::success(null, 'تم حذف المورد بنجاح');
    }
}
