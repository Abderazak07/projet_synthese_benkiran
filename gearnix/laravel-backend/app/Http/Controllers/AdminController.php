<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Livraison;
use App\Models\Produit;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users() {
        return response()->json(User::orderBy('id', 'desc')->get());
    }

    public function updateUser(Request $request, $id) {
        $user = User::findOrFail($id);
        if ($request->has('role')) $user->role = $request->role;
        // other fields
        $user->save();
        return response()->json($user);
    }

    public function deleteUser($id) {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    public function commandes() {
        return response()->json(Commande::with('client', 'produits', 'paiement', 'livraison')->orderBy('id', 'desc')->get());
    }

    public function updateStatut(Request $request, $id) {
        $commande = Commande::findOrFail($id);
        $commande->update(['statut' => $request->statut]);
        return response()->json($commande);
    }

    public function paiements() {
        return response()->json(Paiement::with('commande.client')->orderBy('id', 'desc')->get());
    }

    public function updatePaiementStatut(Request $request, $id) {
        $paiement = Paiement::findOrFail($id);
        $paiement->update(['statut' => $request->statut]);
        return response()->json($paiement);
    }

    public function livraisons() {
        return response()->json(Livraison::with('commande.client')->orderBy('id', 'desc')->get());
    }

    public function updateLivraisonStatut(Request $request, $id) {
        $livraison = Livraison::findOrFail($id);
        $livraison->update(['statut' => $request->statut]);
        return response()->json($livraison);
    }
    
    public function stats() {
        return response()->json([
            'total_users' => User::count(),
            'total_produits' => Produit::count(),
            'total_commandes' => Commande::count(),
            'revenue_total' => Paiement::where('statut', 'Validé')->sum('montant')
        ]);
    }
}
