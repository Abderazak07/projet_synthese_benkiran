<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    protected $table = 'Livraison';
    protected $fillable = ['commande_id', 'date', 'adresse', 'statut'];
    
    public function commande() { 
        return $this->belongsTo(Commande::class, 'commande_id'); 
    }
}
