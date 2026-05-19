<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('livraison');
        Schema::dropIfExists('paiement');
        Schema::dropIfExists('commande_produit');
        Schema::dropIfExists('commande');
        Schema::dropIfExists('produit');
        Schema::dropIfExists('fournisseur');
        Schema::dropIfExists('admin');
        Schema::dropIfExists('client');
        Schema::dropIfExists('User');
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('categories');
        Schema::enableForeignKeyConstraints();

        // 0. USER & TOKENS (For Laravel Auth)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->string('description', 500)->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        Schema::create('User', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50);
            $table->string('prenom', 50)->nullable();
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->string('role')->default('CLIENT');
            $table->string('telephone', 20)->nullable();
            $table->string('genre', 20)->nullable();
            $table->string('sms_code')->nullable();
            $table->timestamp('sms_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 1. CLIENT
        Schema::create('client', function (Blueprint $table) {
            $table->increments('id_client');
            $table->string('nom', 100);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->string('adresse', 255)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->dateTime('created_at')->useCurrent();
        });

        // 2. ADMIN
        Schema::create('admin', function (Blueprint $table) {
            $table->increments('id_admin');
            $table->string('nom', 100);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->string('niveau', 50)->default('standard');
            $table->dateTime('created_at')->useCurrent();
        });

        // 3. FOURNISSEUR
        Schema::create('fournisseur', function (Blueprint $table) {
            $table->increments('id_fournisseur');
            $table->string('nom', 100);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->string('entreprise', 150)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->dateTime('created_at')->useCurrent();
        });

        // 4. PRODUIT
        Schema::create('produit', function (Blueprint $table) {
            $table->increments('id_produit');
            $table->string('nom', 150);
            $table->text('description')->nullable();
            $table->string('categorie', 100)->nullable();
            $table->decimal('prix', 10, 2);
            $table->decimal('prix_original', 10, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->unsignedBigInteger('id_fournisseur');
            $table->timestamps();

            $table->foreign('id_fournisseur')->references('id')->on('User')
                  ->onUpdate('cascade')->onDelete('restrict');
        });

        // 5. COMMANDE
        Schema::create('commande', function (Blueprint $table) {
            $table->increments('id_commande');
            $table->dateTime('date')->useCurrent();
            $table->enum('statut', ['en_attente', 'confirmee', 'en_cours', 'livree', 'annulee'])->default('en_attente');
            $table->unsignedBigInteger('id_client');
            $table->unsignedBigInteger('id_admin')->nullable();

            $table->foreign('id_client')->references('id')->on('User')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_admin')->references('id')->on('User')
                  ->onUpdate('cascade')->onDelete('set null');

            $table->index('id_client', 'idx_commande_client');
            $table->index('statut', 'idx_commande_statut');
        });

        // 6. COMMANDE_PRODUIT
        Schema::create('commande_produit', function (Blueprint $table) {
            $table->unsignedInteger('id_commande');
            $table->unsignedInteger('id_produit');
            $table->integer('quantite')->default(1);
            $table->decimal('prix_unitaire', 10, 2);

            $table->primary(['id_commande', 'id_produit']);

            $table->foreign('id_commande')->references('id_commande')->on('commande')
                  ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_produit')->references('id_produit')->on('produit')
                  ->onUpdate('cascade')->onDelete('restrict');
        });

        // 7. PAIEMENT
        Schema::create('paiement', function (Blueprint $table) {
            $table->increments('id_paiement');
            $table->decimal('montant', 10, 2);
            $table->dateTime('date')->useCurrent();
            $table->enum('statut', ['en_attente', 'valide', 'refuse', 'rembourse'])->default('en_attente');
            $table->unsignedInteger('id_commande')->unique();

            $table->foreign('id_commande')->references('id_commande')->on('commande')
                  ->onUpdate('cascade')->onDelete('cascade');

            $table->index('statut', 'idx_paiement_statut');
        });

        // 8. LIVRAISON
        Schema::create('livraison', function (Blueprint $table) {
            $table->increments('id_livraison');
            $table->string('adresse', 255);
            $table->dateTime('date')->nullable();
            $table->enum('statut', ['planifiee', 'en_transit', 'livree', 'echouee'])->default('planifiee');
            $table->string('type_livraison', 80)->nullable();
            $table->unsignedInteger('id_commande');

            $table->foreign('id_commande')->references('id_commande')->on('commande')
                  ->onUpdate('cascade')->onDelete('cascade');

            $table->index('id_commande', 'idx_livraison_commande');
        });

        // CREATE VIEWS
        DB::statement("
            CREATE OR REPLACE VIEW vue_commandes AS
            SELECT
                c.id_commande,
                cl.nom          AS client,
                cl.email        AS email_client,
                c.date,
                c.statut        AS statut_commande,
                p.statut        AS statut_paiement,
                p.montant,
                l.statut        AS statut_livraison,
                l.type_livraison
            FROM commande c
            JOIN User     cl ON c.id_client   = cl.id
            LEFT JOIN paiement  p  ON p.id_commande  = c.id_commande
            LEFT JOIN livraison l  ON l.id_commande  = c.id_commande;
        ");

        DB::statement("
            CREATE OR REPLACE VIEW vue_stock_fournisseur AS
            SELECT
                f.nom           AS fournisseur,
                p.nom           AS produit,
                p.prix,
                p.stock
            FROM produit p
            JOIN User f ON p.id_fournisseur = f.id
            ORDER BY f.nom, p.nom;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS vue_stock_fournisseur");
        DB::statement("DROP VIEW IF EXISTS vue_commandes");

        Schema::dropIfExists('livraison');
        Schema::dropIfExists('paiement');
        Schema::dropIfExists('commande_produit');
        Schema::dropIfExists('commande');
        Schema::dropIfExists('produit');
        Schema::dropIfExists('fournisseur');
        Schema::dropIfExists('admin');
        Schema::dropIfExists('client');
    }
};
