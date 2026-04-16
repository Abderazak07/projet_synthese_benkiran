<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $table = 'Paiement';
    protected $fillable = ['commande_id', 'date', 'montant', 'statut', 'methode'];
    
    public function commande() { 
        return $this->belongsTo(Commande::class, 'commande_id'); 
    }
}
