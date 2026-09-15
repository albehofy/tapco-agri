<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
        'slug',
        'type', // insect, fungus, weed, nematode
        'image',
    ];

    protected $appends = ['image_url'];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_pests');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }
        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }
        return url('storage/' . ltrim($this->image, '/'));
    }
}
