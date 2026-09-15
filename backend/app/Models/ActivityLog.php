<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'admin_user_id',
        'action',
        'model_type',
        'model_id',
        'details',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(AdminUser::class, 'admin_user_id');
    }

    public static function log(string $action, ?string $modelType = null, $modelId = null, $details = null, ?int $userId = null): self
    {
        return static::create([
            'admin_user_id' => $userId ?? auth('sanctum')->id(),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId ? (string) $modelId : null,
            'details' => is_array($details) ? json_encode($details, JSON_UNESCAPED_UNICODE) : $details,
            'created_at' => now(),
        ]);
    }
}
