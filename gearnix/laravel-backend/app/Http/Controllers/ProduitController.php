<?php
namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::query();
        
        if ($request->has('categorie')) {
            $query->where('categorie', $request->categorie);
        }
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }
        
        if ($request->has('limit')) {
            $query->limit($request->limit);
        }
        
        return response()->json($query->orderBy('id_produit', 'desc')->get());
    }

    public function show($id)
    {
        return response()->json(Produit::findOrFail($id));
    }

    public function categories()
    {
        $categories = Produit::distinct()->pluck('categorie')->filter()->values();
        return response()->json($categories);
    }
    
    // Pour fournisseur / admin
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);
        
        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = Storage::url($request->file('image')->store('produits', 'public'));
        }

        // Si c'est un fournisseur, on force son ID
        if ($request->user()->role === 'FOURNISSEUR') {
            $data['id_fournisseur'] = $request->user()->id;
        }

        $produit = Produit::create($data);
        return response()->json($produit, 201);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        
        // Check permission if Fournisseur
        if ($request->user()->role === 'FOURNISSEUR' && $produit->id_fournisseur && $produit->id_fournisseur !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé : ce produit ne vous appartient pas.'], 403);
        }
        
        $request->validate([
            'nom' => 'sometimes|string',
            'prix' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->has('prix')) {
            $newPrice = floatval($request->prix);
            $currentPrice = floatval($produit->prix);
            if ($newPrice < $currentPrice) {
                // Diminution du prix : on garde l'ancien prix
                $produit->prix_original = $produit->prix_original ?? $currentPrice;
            } else if ($newPrice >= ($produit->prix_original ?? $currentPrice)) {
                // Remontée du prix au-dessus ou égal à l'original : on annule la promotion
                $produit->prix_original = null;
            }
            $produit->prix = $newPrice;
        }

        if ($request->hasFile('image')) {
            $produit->image = Storage::url($request->file('image')->store('produits', 'public'));
        }

        // Fill all other fields except technical ones
        $produit->fill($request->except(['image', '_method', 'prix_original', 'prix']));
        $produit->save();

        return response()->json($produit);
    }

    public function destroy(Request $request, $id)
    {
        \Log::info("Request to delete product ID: " . $id);
        
        $produit = Produit::find($id);
        
        if (!$produit) {
            return response()->json(['message' => 'Produit déjà supprimé ou introuvable.'], 404);
        }

        // Check permission if Fournisseur
        if ($request->user()->role === 'FOURNISSEUR' && $produit->id_fournisseur) {
            if ($produit->id_fournisseur !== $request->user()->id) {
                return response()->json(['message' => 'Non autorisé : vous n\'êtes pas le propriétaire de ce produit.'], 403);
            }
        }
        
        try {
            $produit->delete();
            return response()->json(['message' => 'Produit supprimé avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur technique lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
