<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/register
     */
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success('Registration successful.', [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong during registration.', [], 500);
        }
    }

    /**
     * POST /api/login
     */
    public function login(LoginRequest $request)
    {
        try {
            $email = $request->input('email');

            // One rate-limit bucket per email + IP, so an attacker can't lock
            // out a real user just by guessing their email from another IP,
            // while repeated bad guesses against one account still get throttled.
            $key = $this->throttleKey($request);

            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);

                return $this->error(
                    "Too many failed login attempts. Please try again in {$seconds} seconds.",
                    [],
                    429
                );
            }

            if (! Auth::attempt($request->only('email', 'password'))) {
                RateLimiter::hit($key, 60 * 15); // 15 minute lockout window

                return $this->error('Invalid credentials.', [], 401);
            }

            RateLimiter::clear($key);

            /** @var User $user */
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->success('Login successful.', [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong during login.', [], 500);
        }
    }

    /**
     * POST /api/logout (auth:sanctum)
     */
    public function logout(\Illuminate\Http\Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return $this->success('Logged out successfully.');
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong during logout.', [], 500);
        }
    }

    protected function throttleKey(LoginRequest $request): string
    {
        return Str::lower($request->input('email')).'|'.$request->ip();
    }
}
