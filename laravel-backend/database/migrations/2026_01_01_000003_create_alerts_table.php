<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->string('type');                // critical | expiry | seasonal | mismatch | overstock
            $table->string('product_id');
            $table->string('title');
            $table->text('detail');
            $table->string('action')->nullable();       // e.g. "Create PO"
            $table->string('action_target')->nullable(); // e.g. "reorder"
            $table->boolean('read')->default(false);
            $table->timestamps();                  // "time" (e.g. "2 min ago") derived from created_at

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
