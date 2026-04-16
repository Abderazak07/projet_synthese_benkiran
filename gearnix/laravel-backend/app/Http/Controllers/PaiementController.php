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
            'commande_id' => 'required|exists:Commande,id',
            'montant' => 'required|numeric',
            'methode' => 'required|string'
        ]);

        $commande = Commande::findOrFail($request->commande_id);
        if ($commande->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $paiement = Paiement::create([
            'commande_id' => $commande->id,
            'montant' => $request->montant,
            'methode' => $request->methode,
            'statut' => 'Validé' // Simulons un paiement direct
        ]);
        
        $commande->update(['statut' => 'Payée']);

        return response()->json($paiement, 201);
    }

    public function show(Request $request, $commandeId)
    {
        $paiement = Paiement::where('commande_id', $commandeId)->firstOrFail();
        
        if ($request->user()->role === 'CLIENT') {
            $commande = Commande::findOrFail($commandeId);
            if ($commande->client_id !== $request->user()->id) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
        }
        
        return response()->json($paiement);
    }
}
