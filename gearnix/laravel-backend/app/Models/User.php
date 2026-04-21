<?php
namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;
    
    protected $table = 'User';
    protected $fillable = ['nom', 'prenom', 'email', 'password', 'role', 'telephone', 'genre', 'sms_code', 'sms_verified_at'];
    protected $hidden = ['password', 'remember_token'];
    
    public function commandes() { 
        return $this->hasMany(Commande::class, 'client_id'); 
    }
    public function produits() { 
        return $this->hasMany(Produit::class, 'fournisseur_id'); 
    }

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
