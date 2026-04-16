<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Produit;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'nom' => 'Admin', 
            'email' => 'admin@shop.com', 
            'password' => Hash::make('password'), 
            'role' => 'ADMIN'
        ]);

        // Créer un fournisseur
        $fournisseur = User::create([
            'nom' => 'TechSupply', 
            'email' => 'fournisseur@shop.com', 
            'password' => Hash::make('password'), 
            'role' => 'FOURNISSEUR'
        ]);

        // Créer un client
        User::create([
            'nom' => 'Jean Dupont', 
            'email' => 'client@shop.com', 
            'password' => Hash::make('password'), 
            'role' => 'CLIENT'
        ]);

        // Produits gaming
        $produits = [
            ['nom'=>'Zephyr Wireless Gaming Mouse', 'description'=>'Souris gaming sans fil 25600 DPI, RGB, 70h batterie', 'prix'=>89.99, 'stock'=>50, 'categorie'=>'Gaming Mouse', 'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80'],
            ['nom'=>'Viperasng X Pro Headset', 'description'=>'Casque gaming 7.1 surround, microphone détachable, RGB', 'prix'=>129.99, 'stock'=>30, 'categorie'=>'Headphones', 'image' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'],
            ['nom'=>'Pulsar Phantom Keyboard', 'description'=>'Clavier mécanique 60%, switches Cherry MX Red, RGB', 'prix'=>159.99, 'stock'=>25, 'categorie'=>'Keyboards Gaming', 'image' => 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80'],
            ['nom'=>'Vortex Wireless Gaming Mouse', 'description'=>'Souris gaming légère 61g, capteur PixArt 3370, USB-C', 'prix'=>74.99, 'stock'=>40, 'categorie'=>'Gaming Mouse', 'image' => 'https://images.unsplash.com/photo-1625842268584-88aa3a3390de?w=500&q=80'],
            ['nom'=>'Apex Controller Pro', 'description'=>'Manette gaming PC/Console, vibrations HD, compatibilité universelle', 'prix'=>69.99, 'stock'=>35, 'categorie'=>'Gaming Controllers', 'image' => 'https://images.unsplash.com/photo-1600000000000-000000000000?w=500&q=80'], // Placeholder fallback
            ['nom'=>'Thunderbolt Mechanical Keyboard', 'description'=>'Clavier TKL, switches optiques, anti-ghosting 100%', 'prix'=>119.99, 'stock'=>20, 'categorie'=>'Keyboards Gaming', 'image' => 'https://images.unsplash.com/photo-1511467687858-23d3ce510e1cb?w=500&q=80'],
            ['nom'=>'Specter Wireless Headset', 'description'=>'Casque sans fil, 40h autonomie, son spatial 360°', 'prix'=>99.99, 'stock'=>45, 'categorie'=>'Headphones', 'image' => 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80'],
            ['nom'=>'Phantom Pro Controller', 'description'=>'Manette sans fil, gâchettes adaptatives, grips textured', 'prix'=>89.99, 'stock'=>28, 'categorie'=>'Gaming Controllers', 'image' => 'https://images.unsplash.com/photo-1592839719941-8e2651039d01?w=500&q=80'],
        ];

        foreach ($produits as $p) {
            Produit::create(array_merge($p, ['fournisseur_id' => $fournisseur->id]));
        }
    }
}
