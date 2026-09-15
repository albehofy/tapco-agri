<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'supplier_id',
        'name_ar',
        'name_en',
        'slug',
        'active_ingredient_ar',
        'active_ingredient_en',
        'concentration',
        'formulation_code',
        'chemical_group_ar',
        'chemical_group_en',
        'description_ar',
        'description_en',
        'usage_instructions_ar',
        'usage_instructions_en',
        'pre_harvest_interval',
        'toxicity_class',
        'hazard_signal_word_ar',
        'hazard_signal_word_en',
        'packaging_sizes',
        'main_image',
        'datasheet_pdf',
        'msds_pdf',
        'is_featured',
        'is_active',
        'views_count',
        'order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'pre_harvest_interval' => 'integer',
        'views_count' => 'integer',
        'order' => 'integer',
    ];

    protected $appends = [
        'main_image_url',
        'datasheet_pdf_url',
        'msds_pdf_url',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('order', 'asc');
    }

    public function crops(): BelongsToMany
    {
        return $this->belongsToMany(Crop::class, 'product_crops')
            ->withPivot('dosage_note_ar', 'dosage_note_en');
    }

    public function pests(): BelongsToMany
    {
        return $this->belongsToMany(Pest::class, 'product_pests');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function getMainImageUrlAttribute(): ?string
    {
        if (!$this->main_image) {
            return null;
        }
        if (str_starts_with($this->main_image, 'http://') || str_starts_with($this->main_image, 'https://')) {
            return $this->main_image;
        }
        return url('storage/' . ltrim($this->main_image, '/'));
    }

    public function getDatasheetPdfUrlAttribute(): ?string
    {
        if (!$this->datasheet_pdf) {
            return null;
        }
        if (str_starts_with($this->datasheet_pdf, 'http://') || str_starts_with($this->datasheet_pdf, 'https://')) {
            return $this->datasheet_pdf;
        }
        return url('storage/' . ltrim($this->datasheet_pdf, '/'));
    }

    public function getMsdsPdfUrlAttribute(): ?string
    {
        if (!$this->msds_pdf) {
            return null;
        }
        if (str_starts_with($this->msds_pdf, 'http://') || str_starts_with($this->msds_pdf, 'https://')) {
            return $this->msds_pdf;
        }
        return url('storage/' . ltrim($this->msds_pdf, '/'));
    }
}
