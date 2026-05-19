<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commande';
    protected $primaryKey = 'id_commande';
    public $timestamps = false;
    protected $fillable = ['id_client', 'id_admin', 'statut'];
    protected $appends = ['id', 'total'];
    
    public function getIdAttribute()
    {
        return $this->id_commande;
    }

    public function getTotalAttribute()
    {
        return $this->paiement ? floatval($this->paiement->montant) : 0;
    }

    public function client() { 
        return $this->belongsTo(User::class, 'id_client'); 
    }
    
    public function produits() { 
        return $this->belongsToMany(Produit::class, 'commande_produit', 'id_commande', 'id_produit')
                    ->withPivot('quantite', 'prix_unitaire'); 
    }
    
    public function paiement() { 
        return $this->hasOne(Paiement::class, 'id_commande'); 
    }
    
    public function livraison() { 
        return $this->hasOne(Livraison::class, 'id_commande'); 
    }
}
