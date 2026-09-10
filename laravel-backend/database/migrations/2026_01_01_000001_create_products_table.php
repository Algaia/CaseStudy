<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            // SKU is the natural primary key (e.g. "PAC-12000") to match the frontend exactly.
            $table->string('id')->primary();
            $table->string('name');
            $table->string('category');
            $table->unsignedInteger('on_hand')->default(0);
            $table->unsignedInteger('available')->default(0);
            $table->unsignedInteger('reorder_point')->default(0);
            $table->unsignedInteger('max_stock')->default(0);
            $table->string('location');
            $table->string('velocity');           // Seasonal | Steady
            $table->string('status');              // Healthy | Expiry watch | Reorder now | Critical
            $table->string('supplier');
            $table->timestamps();                  // used to derive "lastUpdated" (e.g. "2 min ago")
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
