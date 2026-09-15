<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminInquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Inquiry::with('product');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($source = $request->input('source')) {
            $query->where('source', $source);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 20);
        $inquiries = $query->latest()->paginate($perPage);

        return ApiResponse::paginated($inquiries, 'Inquiries retrieved');
    }

    public function show(int $id): JsonResponse
    {
        $inquiry = Inquiry::with('product')->find($id);
        if (!$inquiry) {
            return ApiResponse::error('Inquiry not found', null, 404);
        }
        return ApiResponse::success($inquiry, 'Inquiry details');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $inquiry = Inquiry::find($id);
        if (!$inquiry) {
            return ApiResponse::error('Inquiry not found', null, 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:new,contacted,closed',
            'admin_note' => 'nullable|string',
        ]);

        $inquiry->update($validated);
        ActivityLog::log('update_status', Inquiry::class, $inquiry->id, [
            'status' => $validated['status'],
        ]);

        return ApiResponse::success($inquiry, 'تم تحديث حالة الرسالة بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $inquiry = Inquiry::find($id);
        if (!$inquiry) {
            return ApiResponse::error('Inquiry not found', null, 404);
        }

        $inquiry->delete();
        ActivityLog::log('delete', Inquiry::class, $id, null);

        return ApiResponse::success(null, 'تم حذف الرسالة بنجاح');
    }
}
