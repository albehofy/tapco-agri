<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
            return ApiResponse::error('Unauthorized', null, 401);
        }

        if (method_exists($user, 'hasPermission') && !$user->hasPermission($permission)) {
            return ApiResponse::error('Forbidden: Insufficient permissions for this action', null, 403);
        }

        return $next($request);
    }
}
