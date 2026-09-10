<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id();
            $table->string('event');               // e.g. "Shipment received"
            $table->string('reference')->nullable(); // e.g. "F-0614 - 72 units"
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kind');                // receive | pick | order | settings | warning
            $table->timestamps();                  // "time" derived from created_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};
