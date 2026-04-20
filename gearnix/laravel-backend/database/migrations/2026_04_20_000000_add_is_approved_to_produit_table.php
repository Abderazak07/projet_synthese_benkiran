<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('Produit', function (Blueprint $table) {
            if (!Schema::hasColumn('Produit', 'is_approved')) {
                $table->boolean('is_approved')->default(false)->after('fournisseur_id');
            }
        });
    }

    public function down()
    {
        Schema::table('Produit', function (Blueprint $table) {
            if (Schema::hasColumn('Produit', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};
