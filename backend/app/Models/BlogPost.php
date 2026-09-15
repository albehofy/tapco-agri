<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_ar',
        'title_en',
        'slug',
        'excerpt_ar',
        'excerpt_en',
        'content_ar',
        'content_en',
        'cover_image',
        'author_name',
        'published_at',
        'is_published',
        'meta_title_ar',
        'meta_title_en',
        'meta_description_ar',
        'meta_description_en',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['cover_image_url'];

    public function getCoverImageUrlAttribute(): ?string
    {
        if (!$this->cover_image) {
            return null;
        }
        if (str_starts_with($this->cover_image, 'http://') || str_starts_with($this->cover_image, 'https://')) {
            return $this->cover_image;
        }
        return url('storage/' . ltrim($this->cover_image, '/'));
    }
}
