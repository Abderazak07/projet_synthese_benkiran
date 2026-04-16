<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CommandeProduit extends Pivot
{
    protected $table = 'Commande_Produit';
    // By extending Pivot, Eloquent understands the composite keys inherently better in some edge cases, 
    // but the belongsToMany relationship definitions also handle it.
}
