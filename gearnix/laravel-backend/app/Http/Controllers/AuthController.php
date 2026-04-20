<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:50',
            'prenom' => 'required|string|max:50',
            'email' => 'required|email|unique:User',
            'telephone' => 'required|string|max:20',
            'genre' => 'required|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'in:CLIENT,FOURNISSEUR'
        ]);

        $smsCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'telephone' => $request->telephone,
            'genre' => $request->genre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'CLIENT',
            'sms_code' => null,
            'sms_verified_at' => now()
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email ou mot de passe incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifySms(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $user = User::find($request->user()->id);

        if ($user->sms_code === $request->code) {
            $user->sms_verified_at = now();
            $user->sms_code = null;
            $user->save();
            return response()->json(['message' => 'Téléphone vérifié avec succès.', 'user' => $user]);
        }

        throw ValidationException::withMessages([
            'code' => ['Code de vérification incorrect.']
        ]);
    }
}
