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
        return response()->json(Commande::with('client')->orderBy('id', 'desc')->get());
    }

    public function showCommande($id) {
        return response()->json(Commande::with('client', 'produits', 'paiement', 'livraison')->findOrFail($id));
    }

    public function updateStatut(Request $request, $id) {
        $commande = Commande::findOrFail($id);
        $commande->update(['statut' => $request->statut]);
        return response()->json($commande);
    }

    public function paiements() {
        return response()->json(Paiement::orderBy('id', 'desc')->get());
    }

    public function updatePaiementStatut(Request $request, $id) {
        $paiement = Paiement::findOrFail($id);
        $paiement->update(['statut' => $request->statut]);
        return response()->json($paiement);
    }

    public function livraisons() {
        return response()->json(Livraison::orderBy('id', 'desc')->get());
    }

    public function updateLivraisonStatut(Request $request, $id) {
        $livraison = Livraison::findOrFail($id);
        $livraison->update(['statut' => $request->statut]);
        return response()->json($livraison);
    }
    
    public function produits()
    {
        // Admin sees ALL products (approved and unapproved)
        return response()->json(Produit::with('fournisseur')->orderBy('id', 'desc')->get());
    }

    public function approveProduit(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        $produit->is_approved = true;
        $produit->save();
        return response()->json($produit);
    }

    public function rejectProduit($id)
    {
        $produit = Produit::findOrFail($id);
        $produit->delete();
        return response()->json(['message' => 'Produit rejeté et supprimé']);
    }

    public function stats() {
        // Revenu des 7 derniers jours
        $revenueData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->translatedFormat('D');
            $sum = Paiement::where('statut', 'Validé')
                ->whereDate('created_at', $date)
                ->sum('montant');
            $revenueData[] = ['name' => ucfirst($dayName), 'revenue' => $sum];
        }

        return response()->json([
            'total_users' => User::count(),
            'total_produits' => Produit::count(),
            'total_commandes' => Commande::count(),
            'revenue_total' => Paiement::where('statut', 'Validé')->sum('montant'),
            'revenue_chart' => $revenueData,
            'user_breakdown' => [
                'admin' => User::where('role', 'ADMIN')->count(),
                'fournisseur' => User::where('role', 'FOURNISSEUR')->count(),
                'client' => User::where('role', 'CLIENT')->count(),
            ],
            'recent_users' => User::orderBy('id', 'desc')->take(5)->get()
        ]);
    }
}
