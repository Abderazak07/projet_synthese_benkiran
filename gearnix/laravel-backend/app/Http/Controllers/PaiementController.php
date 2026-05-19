<?php
namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Commande;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'commande_id' => 'required|exists:commande,id_commande',
            'montant' => 'required|numeric',
            'methode' => 'required|string'
        ]);

        $commande = Commande::findOrFail($request->commande_id);
        if ($commande->id_client !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $paiement = Paiement::create([
            'id_commande' => $commande->id_commande,
            'montant' => $request->montant,
            'statut' => 'valide' // Simulons un paiement direct (valide dans l'enum)
        ]);
        
        $commande->update(['statut' => 'confirmee']);

        return response()->json($paiement, 201);
    }

    public function show(Request $request, $commandeId)
    {
        $paiement = Paiement::where('id_commande', $commandeId)->firstOrFail();
        
        if ($request->user()->role === 'CLIENT') {
            $commande = Commande::findOrFail($commandeId);
            if ($commande->id_client !== $request->user()->id) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
        }
        
        return response()->json($paiement);
    }
}
