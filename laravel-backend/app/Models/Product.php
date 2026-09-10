<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'name', 'category', 'on_hand', 'available',
        'reorder_point', 'max_stock', 'location', 'velocity',
        'status', 'supplier',
    ];

    public function lots(): HasMany
    {
        return $this->hasMany(Lot::class);
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    public function recommendation(): HasOne
    {
        return $this->hasOne(ReorderRecommendation::class, 'id');
    }

    /** Recomputes status the same way the frontend implicitly expects it. */
    public function refreshStatus(): void
    {
        $this->status = match (true) {
            $this->available <= 0 => 'Critical',
            $this->available < $this->reorder_point => 'Reorder now',
            default => $this->status === 'Expiry watch' ? 'Expiry watch' : 'Healthy',
        };
    }
}
