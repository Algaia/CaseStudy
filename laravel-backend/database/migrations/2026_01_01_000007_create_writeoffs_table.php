<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('writeoffs', function (Blueprint $table) {
            $table->id();
            $table->string('lot_id')->nullable(); // lot is deleted on write-off, so keep as plain string, not FK
            $table->string('product_id');
            $table->unsignedInteger('quantity');
            $table->text('reason');
            $table->date('date');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('writeoffs');
    }
};
