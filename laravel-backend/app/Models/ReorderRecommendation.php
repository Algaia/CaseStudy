<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReorderRecommendation extends Model
{
    protected $table = 'reorder_recommendations';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'forecast', 'suggested_order', 'lead_time', 'rule', 'status', 'created'];

    protected $casts = ['created' => 'boolean'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'id');
    }
}
