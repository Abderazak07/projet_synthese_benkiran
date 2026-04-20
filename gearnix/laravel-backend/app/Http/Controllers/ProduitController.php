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
        
        return response()->json($query->orderBy('id', 'desc')->get());
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
            $data['image'] = url(Storage::url($request->file('image')->store('produits', 'public')));
        }

        // Si c'est un fournisseur, on force son ID
        if ($request->user()->role === 'FOURNISSEUR') {
            $data['fournisseur_id'] = $request->user()->id;
        }

        $produit = Produit::create($data);
        return response()->json($produit, 201);
    }

    public function update(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        
        // Check permission if Fournisseur
        if ($request->user()->role === 'FOURNISSEUR' && $produit->fournisseur_id && $produit->fournisseur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé : ce produit ne vous appartient pas.'], 403);
        }
        
        $request->validate([
            'nom' => 'sometimes|string',
            'prix' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $produit->image = url(Storage::url($request->file('image')->store('produits', 'public')));
        }

        // On exclut les champs techniques et l'image déjà traitée
        $produit->update($request->except(['image', '_method']));
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
        if ($request->user()->role === 'FOURNISSEUR' && $produit->fournisseur_id) {
            if ($produit->fournisseur_id !== $request->user()->id) {
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
