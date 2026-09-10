<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Run this BEFORE the other migrations (timestamp is earliest) since every
// other table references users.id via activity_log / writeoffs.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('initials', 4)->after('name');
            $table->enum('role', [
                'Inventory Manager',
                'Warehouse Staff',
                'Picking Staff',
                'Purchasing Manager',
                'Administrator',
            ])->after('initials');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['initials', 'role']);
        });
    }
};
