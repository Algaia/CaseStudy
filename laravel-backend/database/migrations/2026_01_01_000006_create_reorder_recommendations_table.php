<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reorder_recommendations', function (Blueprint $table) {
            $table->string('id')->primary();       // matches the product id it recommends for
            $table->unsignedInteger('forecast');
            $table->unsignedInteger('suggested_order');
            $table->string('lead_time');           // e.g. "14 days" (kept as display string, matches frontend)
            $table->string('rule');
            $table->string('status');              // Act now | Monitor
            $table->boolean('created')->default(false); // whether a PO has been created from this rec
            $table->timestamps();

            $table->foreign('id')->references('id')->on('products')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reorder_recommendations');
    }
};
