<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
use App\Models\Produit;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $id = 14;
    $p = Produit::find($id);
    if ($p) {
        echo "Found product: " . $p->nom . "\n";
        $p->delete();
        echo "DELETE SUCCESSFUL\n";
    } else {
        echo "Product $id not found\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
