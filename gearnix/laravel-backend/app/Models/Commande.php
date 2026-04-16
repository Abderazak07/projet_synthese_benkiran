<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'Commande';
    protected $fillable = ['client_id', 'statut', 'total'];
    
    public function client() { 
        return $this->belongsTo(User::class, 'client_id'); 
    }
    
    public function produits() { 
        return $this->belongsToMany(Produit::class, 'Commande_Produit', 'commande_id', 'produit_id')
                    ->withPivot('quantite', 'prix_unitaire')
                    ->withTimestamps(); 
    }
    
    public function paiement() { 
        return $this->hasOne(Paiement::class, 'commande_id'); 
    }
    
    public function livraison() { 
        return $this->hasOne(Livraison::class, 'commande_id'); 
    }
}
