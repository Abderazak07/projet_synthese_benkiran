<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    // Public: returns category names only (for filters)
    public function index()
    {
        $categories = Category::orderBy('nom')->pluck('nom');

        if ($categories->isEmpty()) {
            return response()->json(Produit::distinct()->pluck('categorie')->filter()->sort()->values());
        }

        return response()->json($categories);
    }

    // Admin: returns full category objects with all fields
    public function adminIndex()
    {
        $categories = Category::orderBy('nom')->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('categories', 'nom')],
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $data = $request->only(['nom', 'description', 'is_featured']);

        if ($request->hasFile('image')) {
            $data['image'] = Storage::url($request->file('image')->store('collections', 'public'));
        }

        $data['is_featured'] = $request->boolean('is_featured', false);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'nom' => ['required', 'string', 'max:255', Rule::unique('categories', 'nom')->ignore($category->id)],
            'description' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:2048',
            'is_featured' => 'nullable',
        ]);

        $category->nom = $request->nom;

        if ($request->has('description')) {
            $category->description = $request->description;
        }

        if ($request->hasFile('image')) {
            $category->image = Storage::url($request->file('image')->store('collections', 'public'));
        }

        if ($request->has('is_featured')) {
            $category->is_featured = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
        }

        $category->save();

        return response()->json($category);
    }

    // Toggle featured status
    public function toggleFeatured($id)
    {
        $category = Category::findOrFail($id);
        $category->is_featured = !$category->is_featured;
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
