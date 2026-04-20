<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Category;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    /**
     * Return all dynamic data needed for the homepage in a single call.
     */
    public function index()
    {
        // 1. All categories with product count
        $allCategories = Category::orderBy('display_order')->orderBy('nom')->get();

        $categories = $allCategories->map(function ($cat) {
            // If category has its own image, use it; otherwise find a product image
            $catImage = $cat->image;
            if (!$catImage) {
                $sampleProduct = Produit::where('categorie', $cat->nom)
                    ->whereNotNull('image')
                    ->where('image', '!=', '')
                    ->first();
                $catImage = $sampleProduct ? $sampleProduct->image : null;
            }

            return [
                'id' => $cat->id,
                'nom' => $cat->nom,
                'description' => $cat->description,
                'image' => $catImage,
                'is_featured' => (bool) $cat->is_featured,
                'display_order' => $cat->display_order,
                'product_count' => Produit::where('categorie', $cat->nom)->count(),
            ];
        });

        // 2. Featured collections (only those marked is_featured)
        $featuredCollections = $categories->filter(fn($c) => $c['is_featured'])->values();

        // If none are featured, fall back to all categories (max 6)
        if ($featuredCollections->isEmpty()) {
            $featuredCollections = $categories->take(6)->values();
        }

        // 3. Featured products (latest 6)
        $featuredProducts = Produit::orderBy('id', 'desc')->limit(6)->get();

        // 4. Hero product — newest product that has an image
        $heroProduct = Produit::whereNotNull('image')
            ->where('image', '!=', '')
            ->orderBy('id', 'desc')
            ->first();

        // 5. Quick stats
        $totalProducts = Produit::count();
        $totalCategories = $categories->count();

        return response()->json([
            'categories' => $categories,
            'featuredCollections' => $featuredCollections,
            'featuredProducts' => $featuredProducts,
            'heroProduct' => $heroProduct,
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
            ],
        ]);
    }
}
