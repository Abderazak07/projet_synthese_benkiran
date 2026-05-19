<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 0. Categories
        DB::table('categories')->insert([
            ['nom' => 'AirPods', 'description' => 'Écouteurs sans fil', 'is_featured' => true],
            ['nom' => 'Chargeurs', 'description' => 'Accessoires de charge', 'is_featured' => true],
            ['nom' => 'Casques', 'description' => 'Casques Bluetooth premium', 'is_featured' => true],
        ]);

        // 0. Users (For Laravel Auth)
        DB::table('User')->insert([
            ['nom' => 'Admin', 'prenom' => 'Super', 'email' => 'admin@shop.com', 'password' => bcrypt('password'), 'role' => 'ADMIN', 'telephone' => '0600000000', 'genre' => 'Homme', 'sms_verified_at' => now()],
            ['nom' => 'Client', 'prenom' => 'Test', 'email' => 'client@shop.com', 'password' => bcrypt('password'), 'role' => 'CLIENT', 'telephone' => '0600000001', 'genre' => 'Femme', 'sms_verified_at' => now()],
            ['nom' => 'Fournisseur', 'prenom' => 'Test', 'email' => 'fournisseur@shop.com', 'password' => bcrypt('password'), 'role' => 'FOURNISSEUR', 'telephone' => '0600000002', 'genre' => 'Homme', 'sms_verified_at' => now()],
        ]);

        // 1. Clients
        DB::table('client')->insert([
            ['nom' => 'Ahmed Benali', 'email' => 'ahmed@email.com', 'password' => hash('sha256', 'pass123'), 'adresse' => 'Casablanca, Maarif', 'telephone' => '0661234567'],
            ['nom' => 'Sara Idrissi', 'email' => 'sara@email.com', 'password' => hash('sha256', 'pass456'), 'adresse' => 'Rabat, Agdal', 'telephone' => '0672345678'],
            ['nom' => 'Youssef Tahiri', 'email' => 'youssef@email.com', 'password' => hash('sha256', 'pass789'), 'adresse' => 'Marrakech, Guéliz', 'telephone' => '0683456789'],
        ]);

        // 2. Admins
        DB::table('admin')->insert([
            ['nom' => 'Admin Principal', 'email' => 'admin@ecommerce.ma', 'password' => hash('sha256', 'admin2025'), 'niveau' => 'super'],
            ['nom' => 'Admin Support', 'email' => 'support@ecommerce.ma', 'password' => hash('sha256', 'support2025'), 'niveau' => 'standard'],
        ]);

        // 3. Fournisseurs
        DB::table('fournisseur')->insert([
            ['nom' => 'Mohamed Alami', 'email' => 'alami@fourni.ma', 'password' => hash('sha256', 'fourni1'), 'entreprise' => 'TechSupply Maroc', 'telephone' => '0521234567'],
            ['nom' => 'Karim Zouiten', 'email' => 'zouiten@fourni.ma', 'password' => hash('sha256', 'fourni2'), 'entreprise' => 'ElecPro SARL', 'telephone' => '0532345678'],
        ]);

        // 4. Produits
        DB::table('produit')->insert([
            ['nom' => 'Câble USB-C 2m', 'description' => 'Câble charge rapide USB-C', 'categorie' => 'Chargeurs', 'prix' => 49.90, 'stock' => 150, 'id_fournisseur' => 3],
            ['nom' => 'Coque iPhone 15', 'description' => 'Coque silicone transparente', 'categorie' => 'Coques iPhone', 'prix' => 79.00, 'stock' => 80, 'id_fournisseur' => 3],
            ['nom' => 'Chargeur sans fil', 'description' => 'Chargeur Qi 15W compatible', 'categorie' => 'Chargeurs', 'prix' => 199.00, 'stock' => 60, 'id_fournisseur' => 3],
            ['nom' => 'Écouteurs Bluetooth', 'description' => 'TWS avec réduction de bruit', 'categorie' => 'AirPods', 'prix' => 349.00, 'stock' => 40, 'id_fournisseur' => 3],
            ['nom' => 'Support téléphone auto', 'description' => 'Support magnétique ventilation', 'categorie' => 'Accessoires', 'prix' => 89.00, 'stock' => 120, 'id_fournisseur' => 3],
            ['nom' => 'Casque Sans Fil Pro', 'description' => 'Casque circum-auriculaire', 'categorie' => 'Casques', 'prix' => 599.00, 'stock' => 20, 'id_fournisseur' => 3],
        ]);

        // 5. Commandes
        DB::table('commande')->insert([
            ['statut' => 'confirmee', 'id_client' => 2, 'id_admin' => 1],
            ['statut' => 'en_cours', 'id_client' => 2, 'id_admin' => 1],
            ['statut' => 'en_attente', 'id_client' => 2, 'id_admin' => null],
        ]);

        // 6. Commande_Produit
        DB::table('commande_produit')->insert([
            ['id_commande' => 1, 'id_produit' => 1, 'quantite' => 2, 'prix_unitaire' => 49.90],
            ['id_commande' => 1, 'id_produit' => 3, 'quantite' => 1, 'prix_unitaire' => 199.00],
            ['id_commande' => 2, 'id_produit' => 4, 'quantite' => 1, 'prix_unitaire' => 349.00],
            ['id_commande' => 2, 'id_produit' => 5, 'quantite' => 2, 'prix_unitaire' => 89.00],
            ['id_commande' => 3, 'id_produit' => 2, 'quantite' => 1, 'prix_unitaire' => 79.00],
        ]);

        // 7. Paiements
        DB::table('paiement')->insert([
            ['montant' => 298.80, 'statut' => 'valide', 'id_commande' => 1],
            ['montant' => 527.00, 'statut' => 'en_attente', 'id_commande' => 2],
        ]);

        // 8. Livraisons
        DB::table('livraison')->insert([
            ['adresse' => 'Casablanca, Maarif', 'statut' => 'livree', 'type_livraison' => 'standard', 'id_commande' => 1],
            ['adresse' => 'Rabat, Agdal', 'statut' => 'en_transit', 'type_livraison' => 'express', 'id_commande' => 2],
        ]);
    }
}
