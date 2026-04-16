<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('User', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50);
            $table->string('email', 50)->unique();
            $table->string('password');
            $table->enum('role', ['CLIENT', 'ADMIN', 'FOURNISSEUR'])->default('CLIENT');
            // Adding default laravel fields required by session/auth sometimes
            $table->rememberToken();
            $table->timestamps();
        });

        // The default password_reset_tokens table required by auth?
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        Schema::create('Produit', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50);
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->string('categorie', 50)->nullable();
            $table->unsignedBigInteger('fournisseur_id')->nullable();
            $table->foreign('fournisseur_id')->references('id')->on('User')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('Commande', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->dateTime('date')->useCurrent();
            $table->string('statut', 20)->default('En attente');
            $table->decimal('total', 10, 2)->default(0);
            $table->foreign('client_id')->references('id')->on('User')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('Commande_Produit', function (Blueprint $table) {
            $table->unsignedBigInteger('commande_id');
            $table->unsignedBigInteger('produit_id');
            $table->integer('quantite')->default(1);
            $table->decimal('prix_unitaire', 10, 2);
            $table->primary(['commande_id', 'produit_id']);
            $table->foreign('commande_id')->references('id')->on('Commande')->onDelete('cascade');
            $table->foreign('produit_id')->references('id')->on('Produit')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('Paiement', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('commande_id');
            $table->dateTime('date')->useCurrent();
            $table->decimal('montant', 10, 2);
            $table->string('statut', 20)->default('En attente');
            $table->string('methode', 50)->default('Carte bancaire');
            $table->foreign('commande_id')->references('id')->on('Commande')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('Livraison', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('commande_id');
            $table->dateTime('date')->useCurrent();
            $table->string('adresse', 255);
            $table->string('statut', 20)->default('En préparation');
            $table->foreign('commande_id')->references('id')->on('Commande')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('Livraison');
        Schema::dropIfExists('Paiement');
        Schema::dropIfExists('Commande_Produit');
        Schema::dropIfExists('Commande');
        Schema::dropIfExists('Produit');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('User');
    }
};
