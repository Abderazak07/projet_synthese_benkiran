<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'Produit';
    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'categorie', 'fournisseur_id'];
    
    public function fournisseur() { 
        return $this->belongsTo(User::class, 'fournisseur_id'); 
    }

    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        if (preg_match('/^https?:\/\//', $value)) {
            return $value;
        }

        return url($value);
    }
    
    public function commandes() { 
        return $this->belongsToMany(Commande::class, 'Commande_Produit', 'produit_id', 'commande_id')
                    ->withPivot('quantite', 'prix_unitaire')
                    ->withTimestamps(); 
    }
}
