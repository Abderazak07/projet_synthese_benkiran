<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('nom')->pluck('nom');

        if ($categories->isEmpty()) {
            return response()->json(Produit::distinct()->pluck('categorie')->filter()->sort()->values());
        }

        return response()->json($categories);
    }

    public function adminIndex()
    {
        return response()->json(Category::orderBy('nom')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('categories', 'nom')],
        ]);

        $category = Category::create(['nom' => $request->nom]);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('categories', 'nom')->ignore($category->id)],
        ]);

        $category->nom = $request->nom;
        $category->save();

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée']);
    }
}
