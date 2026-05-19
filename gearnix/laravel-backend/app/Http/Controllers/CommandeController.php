<?php
namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Produit;
use App\Models\Livraison;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->commandes()->with('produits', 'paiement', 'livraison')->orderBy('id_commande','desc')->get());
    }

    public function show(Request $request, $id)
    {
        $commande = Commande::with('produits', 'paiement', 'livraison')->where('id_client', $request->user()->id)->findOrFail($id);
        return response()->json($commande);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produits' => 'required|array',
            'produits.*.id' => 'required|exists:produit,id_produit',
            'produits.*.quantite' => 'required|integer|min:1',
            'adresse_livraison' => 'required|string'
        ]);

        $total = 0;
        $items = [];
        
        foreach ($request->produits as $item) {
            $produit = Produit::findOrFail($item['id']);
            if ($produit->stock < $item['quantite']) {
                return response()->json(['message' => "Stock insuffisant pour {$produit->nom}"], 422);
            }
            $total += $produit->prix * $item['quantite'];
            $items[] = ['produit' => $produit, 'quantite' => $item['quantite']];
        }

        $commande = Commande::create([
            'id_client' => $request->user()->id,
            'statut' => 'en_attente'
        ]);

        foreach ($items as $item) {
            $commande->produits()->attach($item['produit']->id_produit, [
                'quantite' => $item['quantite'],
                'prix_unitaire' => $item['produit']->prix
            ]);
            $item['produit']->decrement('stock', $item['quantite']);
        }

        Livraison::create([
            'id_commande' => $commande->id_commande,
            'adresse' => $request->adresse_livraison,
            'statut' => 'planifiee'
        ]);

        return response()->json($commande->load('produits', 'livraison'), 201);
    }
    
    public function fournisseurCommandes(Request $request)
    {
        // Pour le fournisseur, on veut les commandes contenant ses produits
        $produitsIds = $request->user()->produits()->pluck('id_produit');
        $commandes = Commande::whereHas('produits', function($q) use ($produitsIds) {
            $q->whereIn('produit.id_produit', $produitsIds);
        })->with('produits')->orderBy('id_commande','desc')->get();
        
        return response()->json($commandes);
    }
}
