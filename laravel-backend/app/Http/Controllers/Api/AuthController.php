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
     * Mirrors LoginPage.jsx's onLogin(selectedUser).
     *
     * NOTE: the current frontend demo just picks a user from a dropdown with a
     * shared placeholder password ("warehouse2026") — there's no real per-user
     * password yet. This endpoint expects real credentials once you add a
     * password field to the login form; swap the dropdown for an email +
     * password input to match. Uses Sanctum for token issuing — run
     * `composer require laravel/sanctum` if it's not already installed.
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
