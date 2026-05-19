<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $table = 'paiement';
    protected $primaryKey = 'id_paiement';
    public $timestamps = false;
    protected $fillable = ['id_commande', 'date', 'montant', 'statut'];
    protected $appends = ['methode'];

    public function getMethodeAttribute()
    {
        return 'Carte bancaire';
    }
    
    public function commande() { 
        return $this->belongsTo(Commande::class, 'id_commande'); 
    }
}
