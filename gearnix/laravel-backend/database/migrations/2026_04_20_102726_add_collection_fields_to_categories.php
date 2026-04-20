<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image')->nullable()->after('nom');
            $table->text('description')->nullable()->after('image');
            $table->boolean('is_featured')->default(false)->after('description');
            $table->integer('display_order')->default(0)->after('is_featured');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['image', 'description', 'is_featured', 'display_order']);
        });
    }
};
