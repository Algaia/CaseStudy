<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pick_tasks', function (Blueprint $table) {
            $table->string('id')->primary();       // e.g. "PK-1042"
            $table->string('order_number');        // "order" is a reserved-ish word in SQL, renamed
            $table->string('product_id');
            $table->unsignedInteger('quantity');
            $table->string('lot_id');
            $table->string('location');
            $table->string('priority');            // FEFO priority | Standard | Count check
            $table->string('customer');
            $table->unsignedInteger('due_in_minutes');
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('lot_id')->references('id')->on('lots')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pick_tasks');
    }
};
