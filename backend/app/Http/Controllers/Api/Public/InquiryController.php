<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:191',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:191',
            'product_id' => 'nullable|exists:products,id',
            'message' => 'required|string|max:3000',
            'source' => 'nullable|string|in:contact_form,product_page,whatsapp_click',
        ]);

        $inquiry = Inquiry::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'product_id' => $validated['product_id'] ?? null,
            'message' => $validated['message'],
            'source' => $validated['source'] ?? 'contact_form',
            'status' => 'new',
        ]);

        // Eager load product if present
        if ($inquiry->product_id) {
            $inquiry->load('product');
        }

        // Notify admin via log/mail
        try {
            $adminEmail = env('ADMIN_NOTIFICATION_EMAIL', 'info@tapco-agri.com');
            Log::info("New inquiry received #{$inquiry->id} from {$inquiry->name} ({$inquiry->phone}) for: " . ($inquiry->product?->name_ar ?? 'General Inquiry'));
        } catch (\Exception $e) {
            Log::error('Inquiry notification error: ' . $e->getMessage());
        }

        return ApiResponse::success($inquiry, 'Your inquiry has been submitted successfully', 201);
    }
}
