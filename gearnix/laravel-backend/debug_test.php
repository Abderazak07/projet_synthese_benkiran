<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    $produits = App\Models\Produit::get();
    echo "OK - Count: " . $produits->count() . "\n";
    if ($produits->count() > 0) {
        echo json_encode($produits->first()->toArray()) . "\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}

try {
    $cats = App\Models\Category::get();
    echo "Categories OK - Count: " . $cats->count() . "\n";
} catch (Exception $e) {
    echo "Categories ERROR: " . $e->getMessage() . "\n";
}
