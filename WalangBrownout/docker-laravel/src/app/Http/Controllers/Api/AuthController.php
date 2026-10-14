<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Mirrors LoginPage.jsx's onLogin(email, password).
     * Uses Sanctum for token issuing — run `composer require laravel/sanctum`
     * and `php artisan install:api` if not already set up.
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($data)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $user = User::where('email', $data['email'])->firstOrFail();
        $token = $user->createToken('workspace')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    /** POST /api/logout */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['status' => 'ok']);
    }
}
