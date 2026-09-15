<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ActivityLog;
use App\Models\AdminUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = AdminUser::with('role')->where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'],
            ]);
        }

        if (!$admin->is_active) {
            return ApiResponse::error('هذا الحساب معطّل. يرجى مراجعة المسؤول.', null, 403);
        }

        // Create token
        $token = $admin->createToken('admin-dashboard', ['*'], now()->addDays(7))->plainTextToken;

        ActivityLog::log('login', AdminUser::class, $admin->id, [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ], $admin->id);

        return ApiResponse::success([
            'token' => $token,
            'user' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role?->name ?? 'Admin',
                'permissions' => $admin->role?->permissions ?? ['*'],
            ],
        ], 'تم تسجيل الدخول بنجاح');
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            ActivityLog::log('logout', AdminUser::class, $user->id, null, $user->id);
            $user->currentAccessToken()->delete();
        }

        return ApiResponse::success(null, 'تم تسجيل الخروج بنجاح');
    }

    public function me(Request $request): JsonResponse
    {
        $admin = $request->user()->load('role');

        return ApiResponse::success([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => $admin->role?->name ?? 'Admin',
            'permissions' => $admin->role?->permissions ?? ['*'],
        ], 'Admin profile');
    }
}
