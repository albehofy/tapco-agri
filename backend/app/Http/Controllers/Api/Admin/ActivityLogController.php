<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('adminUser');

        if ($action = $request->input('action')) {
            $query->where('action', $action);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('admin_user_id', $userId);
        }

        $perPage = (int) $request->input('per_page', 25);
        $logs = $query->latest('created_at')->paginate($perPage);

        return ApiResponse::paginated($logs, 'Activity logs retrieved');
    }
}
