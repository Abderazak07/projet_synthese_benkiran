<?php
namespace App\Http\Controllers;

use App\Models\Livraison;
use App\Models\Commande;
use Illuminate\Http\Request;

class LivraisonController extends Controller
{
    public function show(Request $request, $commandeId)
    {
        $livraison = Livraison::where('id_commande', $commandeId)->firstOrFail();
        
        if ($request->user()->role === 'CLIENT') {
            $commande = Commande::findOrFail($commandeId);
            if ($commande->id_client !== $request->user()->id) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
        }
        
        return response()->json($livraison);
    }
}
