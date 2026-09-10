<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lots', function (Blueprint $table) {
            $table->string('id')->primary();       // e.g. "F-0417"
            $table->string('product_id');
            $table->date('received');
            $table->date('expires')->nullable();
            $table->unsignedInteger('quantity');
            $table->string('location');
            $table->string('state');               // Available | Queued | Pick first
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->index(['product_id', 'expires']); // fast FEFO ordering
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lots');
    }
};
