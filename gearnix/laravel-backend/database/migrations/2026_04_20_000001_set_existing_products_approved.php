<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Set all existing products as approved (they were approved before this feature)
        DB::table('Produit')->update(['is_approved' => true]);
    }

    public function down()
    {
        // No-op
    }
};
