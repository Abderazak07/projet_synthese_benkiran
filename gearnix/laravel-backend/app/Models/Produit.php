<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    protected $table = 'Produit';
    protected $fillable = ['nom', 'description', 'prix', 'stock', 'image', 'image2', 'image3', 'image4', 'categorie', 'fournisseur_id', 'is_approved'];
    protected $casts = [
        'is_approved' => 'boolean',
    ];
    
    public function fournisseur() { 
        return $this->belongsTo(User::class, 'fournisseur_id'); 
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
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

    public function getImage2Attribute($value)
    {
        if (!$value) {
            return null;
        }

        if (preg_match('/^https?:\/\//', $value)) {
            return $value;
        }

        return url($value);
    }

    public function getImage3Attribute($value)
    {
        if (!$value) {
            return null;
        }

        if (preg_match('/^https?:\/\//', $value)) {
            return $value;
        }

        return url($value);
    }

    public function getImage4Attribute($value)
    {
        if (!$value) {
            return null;
        }

        if (preg_match('/^https?:\/\//', $value)) {
            return $value;
        }

        return url($value);
    }

    // Helper method to get all images as an array
    public function getImages()
    {
        $images = [];
        if ($this->image) $images[] = $this->image;
        if ($this->image2) $images[] = $this->image2;
        if ($this->image3) $images[] = $this->image3;
        if ($this->image4) $images[] = $this->image4;
        return $images;
    }
    
    public function commandes() { 
        return $this->belongsToMany(Commande::class, 'Commande_Produit', 'produit_id', 'commande_id')
                    ->withPivot('quantite', 'prix_unitaire')
                    ->withTimestamps(); 
    }
}
