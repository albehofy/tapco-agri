<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value_ar',
        'value_en',
        'type',
    ];

    public static function getByKey(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) {
            return $default;
        }

        return [
            'ar' => $setting->value_ar,
            'en' => $setting->value_en,
        ];
    }
}
