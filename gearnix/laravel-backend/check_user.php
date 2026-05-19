<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@shop.com')->first();
if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Check password 'password': " . (Hash::check('password', $user->password) ? "OK" : "FAIL") . "\n";
    echo "Verified: " . ($user->sms_verified_at ? "Yes" : "No") . "\n";
} else {
    echo "User not found\n";
}
