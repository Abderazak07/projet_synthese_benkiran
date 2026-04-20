<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add only missing columns with better error handling
        if (Schema::hasTable('categories')) {
            Schema::table('categories', function (Blueprint $table) {
                if (!Schema::hasColumn('categories', 'description')) {
                    $table->text('description')->nullable();
                }
                if (!Schema::hasColumn('categories', 'is_featured')) {
                    $table->boolean('is_featured')->default(false);
                }
                if (!Schema::hasColumn('categories', 'display_order')) {
                    $table->integer('display_order')->default(0);
                }
            });
        }
    }

    public function down()
    {
        // Intentionally empty for safety
    }
};

