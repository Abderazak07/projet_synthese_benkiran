<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::where('email', 'admin@shop.com')->first();
if ($admin) {
    echo "Hash: " . $admin->password . "\n";
    $info = password_get_info($admin->password);
    echo "Algo ID: " . $info['algo'] . " (" . $info['algoName'] . ")\n";
    
    // Attempt verification
    if (Hash::check('password', $admin->password)) {
        echo "Verification successful!\n";
    } else {
        echo "Verification FAILED!\n";
    }
} else {
    echo "Admin not found.\n";
}
