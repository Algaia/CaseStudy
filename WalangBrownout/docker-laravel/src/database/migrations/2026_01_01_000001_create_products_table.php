<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('category');
            $table->unsignedInteger('on_hand')->default(0);
            $table->unsignedInteger('available')->default(0);
            $table->unsignedInteger('reorder_point')->default(0);
            $table->unsignedInteger('max_stock')->default(0);
            $table->string('location');
            $table->string('velocity');
            $table->string('status');
            $table->string('supplier');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
