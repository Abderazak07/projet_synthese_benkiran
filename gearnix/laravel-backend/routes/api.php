<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\LivraisonController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomepageController;

// Auth publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Produits publics (lecture)
Route::get('/produits', [ProduitController::class, 'index']);
Route::get('/produits/{id}', [ProduitController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Homepage data (public)
Route::get('/homepage', [HomepageController::class, 'index']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // CLIENT - Commandes
    Route::get('/commandes', [CommandeController::class, 'index']);
    Route::post('/commandes', [CommandeController::class, 'store']);
    Route::get('/commandes/{id}', [CommandeController::class, 'show']);
    Route::get('/commandes/{id}/livraison', [LivraisonController::class, 'show']);
    
    // CLIENT - Paiements
    Route::post('/paiements', [PaiementController::class, 'store']);
    Route::get('/paiements/{commandeId}', [PaiementController::class, 'show']);
    
    // FOURNISSEUR & ADMIN - Partage des ressources
    Route::middleware('role:FOURNISSEUR,ADMIN')->group(function () {
        Route::post('/produits', [ProduitController::class, 'store']);
        Route::put('/produits/{id}', [ProduitController::class, 'update']);
        Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);
        Route::get('/fournisseur/commandes', [CommandeController::class, 'fournisseurCommandes']);
        Route::get('/admin/categories', [CategoryController::class, 'adminIndex']);
    });
    
    // ADMIN - Gestion globale
    Route::middleware('role:ADMIN')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        
        Route::get('/admin/commandes', [AdminController::class, 'commandes']);
        Route::get('/admin/commandes/{id}', [AdminController::class, 'showCommande']);
        Route::put('/admin/commandes/{id}/statut', [AdminController::class, 'updateStatut']);
        
        Route::get('/admin/paiements', [AdminController::class, 'paiements']);
        Route::put('/admin/paiements/{id}/statut', [AdminController::class, 'updatePaiementStatut']);
        
        Route::get('/admin/livraisons', [AdminController::class, 'livraisons']);
        Route::put('/admin/livraisons/{id}/statut', [AdminController::class, 'updateLivraisonStatut']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::put('/categories/{id}/featured', [CategoryController::class, 'toggleFeatured']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        
        Route::get('/admin/stats', [AdminController::class, 'stats']);
    });
});
