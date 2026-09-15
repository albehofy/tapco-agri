<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
        'address_ar',
        'address_en',
        'phone',
        'whatsapp',
        'working_hours_ar',
        'working_hours_en',
        'lat',
        'lng',
        'order',
    ];

    protected $casts = [
        'lat' => 'float',
        'lng' => 'float',
        'order' => 'integer',
    ];
}
