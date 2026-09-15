<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'product_id',
        'message',
        'source',
        'status',
        'admin_note',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
