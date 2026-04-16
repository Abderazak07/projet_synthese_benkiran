<?php
namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;

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
            'stock' => 'required|integer|min:0'
        ]);
        
        $data = $request->all();
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
        if ($request->user()->role === 'FOURNISSEUR' && $produit->fournisseur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        
        $produit->update($request->all());
        return response()->json($produit);
    }

    public function destroy(Request $request, $id)
    {
        $produit = Produit::findOrFail($id);
        if ($request->user()->role === 'FOURNISSEUR' && $produit->fournisseur_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }
        $produit->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}
