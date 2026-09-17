<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CertificateController extends Controller
{
    public function index(): JsonResponse
    {
        $certificates = Cache::remember('public_certificates', 3600, function () {
            return Certificate::orderBy('order', 'asc')->get()->toArray();
        });

        if (!is_array($certificates)) {
            Cache::forget('public_certificates');
            $certificates = Certificate::orderBy('order', 'asc')->get()->toArray();
        }

        return ApiResponse::success($certificates, 'Certificates retrieved successfully');
    }
}
