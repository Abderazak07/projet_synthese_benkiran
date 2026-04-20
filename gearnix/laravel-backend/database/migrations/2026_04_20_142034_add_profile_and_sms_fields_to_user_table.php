<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('User', function (Blueprint $table) {
            $table->string('prenom', 50)->nullable()->after('nom');
            $table->string('telephone', 20)->nullable()->after('password');
            $table->string('genre', 20)->nullable()->after('telephone');
            $table->string('sms_code', 10)->nullable();
            $table->timestamp('sms_verified_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('User', function (Blueprint $table) {
            $table->dropColumn(['prenom', 'telephone', 'genre', 'sms_code', 'sms_verified_at']);
        });
    }
};
