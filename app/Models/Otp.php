<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp_code',
        'type',
        'expires_at',
        'is_used',
        'reset_token',
        'reset_token_expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'reset_token_expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * User this OTP belongs to (matched by email).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'email', 'email');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return ! $this->is_used && ! $this->isExpired();
    }

    public function isResetTokenValid(string $token): bool
    {
        return $this->reset_token
            && hash_equals($this->reset_token, $token)
            && $this->reset_token_expires_at
            && ! $this->reset_token_expires_at->isPast()
            && ! $this->is_used;
    }

    /**
     * Generate a random 6-digit numeric OTP code.
     */
    public static function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate an opaque, unguessable reset token.
     */
    public static function generateResetToken(): string
    {
        return Str::random(64);
    }
}
