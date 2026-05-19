<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'produit';
    protected $primaryKey = 'id_produit';
    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'categorie', 'id_fournisseur', 'prix_original'];
    protected $appends = ['id'];
    
    public function fournisseur() { 
        return $this->belongsTo(User::class, 'id_fournisseur'); 
    }

    public function getIdAttribute()
    {
        return $this->id_produit;
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
        return $this->belongsToMany(Commande::class, 'commande_produit', 'id_produit', 'id_commande')
                    ->withPivot('quantite', 'prix_unitaire'); 
    }
}
