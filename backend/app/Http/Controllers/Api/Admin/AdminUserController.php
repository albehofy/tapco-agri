<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\AdminUser;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = AdminUser::with('role')->get();
        return ApiResponse::success($users, 'Admin users list');
    }

    public function roles(): JsonResponse
    {
        $roles = Role::all();
        return ApiResponse::success($roles, 'Roles list');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'email' => 'required|email|unique:admin_users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = $validated['is_active'] ?? true;

        $user = AdminUser::create($validated);
        ActivityLog::log('create_user', AdminUser::class, $user->id, ['email' => $user->email]);

        return ApiResponse::success($user->load('role'), 'تم إضافة المستخدم بنجاح', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = AdminUser::find($id);
        if (!$user) {
            return ApiResponse::error('User not found', null, 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:191',
            'email' => "sometimes|required|email|unique:admin_users,email,{$id}",
            'password' => 'nullable|string|min:6',
            'role_id' => 'sometimes|required|exists:roles,id',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        ActivityLog::log('update_user', AdminUser::class, $user->id, ['email' => $user->email]);

        return ApiResponse::success($user->load('role'), 'تم تحديث بيانات المستخدم بنجاح');
    }

    public function destroy(int $id): JsonResponse
    {
        $user = AdminUser::find($id);
        if (!$user) {
            return ApiResponse::error('User not found', null, 404);
        }

        if ($user->id === auth('sanctum')->id()) {
            return ApiResponse::error('لا يمكن حذف حسابك الحالي أثناء تسجيل الدخول', null, 400);
        }

        $email = $user->email;
        $user->delete();
        ActivityLog::log('delete_user', AdminUser::class, $id, ['email' => $email]);

        return ApiResponse::success(null, 'تم حذف المستخدم بنجاح');
    }
}
