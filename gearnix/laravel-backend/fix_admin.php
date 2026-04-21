<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::where('email', 'admin@shop.com')->first();
if ($admin) {
    $admin->password = Hash::make('password');
    $admin->save();
    echo "Admin password updated and hashed successfully.\n";
    echo "New Hash: " . $admin->password . "\n";
} else {
    echo "Admin not found.\n";
}
