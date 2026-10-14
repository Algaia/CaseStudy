<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Writeoff extends Model
{
    protected $fillable = ['lot_id', 'product_id', 'quantity', 'reason', 'date', 'user_id'];

    protected $casts = ['date' => 'date:Y-m-d'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
