<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResendOtpRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Jobs\SendOtpMailJob;
use App\Models\Otp;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Throwable;

class PasswordResetController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/forgot-password
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        return $this->issueOtp($request->input('email'));
    }

    /**
     * POST /api/resend-otp
     */
    public function resendOtp(ResendOtpRequest $request)
    {
        return $this->issueOtp($request->input('email'));
    }

    /**
     * POST /api/verify-otp
     */
    public function verifyOtp(VerifyOtpRequest $request)
    {
        try {
            $email = $request->input('email');
            $code = $request->input('otp_code');

            $otp = Otp::where('email', $email)
                ->where('type', 'password_reset')
                ->latest('id')
                ->first();

            if (! $otp || $otp->otp_code !== $code) {
                return $this->error('Invalid OTP code.', [], 422);
            }

            if ($otp->is_used) {
                return $this->error('This OTP has already been used.', [], 422);
            }

            if ($otp->isExpired()) {
                return $this->error('This OTP has expired. Please request a new one.', [], 422);
            }

            $resetToken = Otp::generateResetToken();

            $otp->update([
                'reset_token' => $resetToken,
                'reset_token_expires_at' => now()->addMinutes(10),
            ]);

            return $this->success('OTP verified successfully.', [
                'reset_token' => $resetToken,
                'expires_in_minutes' => 10,
            ]);
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong while verifying the OTP.', [], 500);
        }
    }

    /**
     * POST /api/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $email = $request->input('email');
            $resetToken = $request->input('reset_token');

            $otp = Otp::where('email', $email)
                ->where('type', 'password_reset')
                ->latest('id')
                ->first();

            if (! $otp || ! $otp->isResetTokenValid($resetToken)) {
                return $this->error('Invalid or expired reset token. Please verify the OTP again.', [], 422);
            }

            $user = User::where('email', $email)->first();

            if (! $user) {
                return $this->error('No account found with this email address.', [], 404);
            }

            DB::transaction(function () use ($user, $request, $otp) {
                $user->update([
                    'password' => Hash::make($request->input('password')),
                ]);

                $otp->update(['is_used' => true]);

                // Log the user out of every device once the password changes.
                $user->tokens()->delete();
            });

            return $this->success('Password has been reset successfully. Please log in again.');
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong while resetting the password.', [], 500);
        }
    }

    /**
     * Shared logic for forgot-password and resend-otp: generate a fresh OTP,
     * persist it, and dispatch the email — subject to a 60 second cooldown.
     */
    protected function issueOtp(string $email)
    {
        try {
            $throttleKey = 'otp-request:'.$email;

            if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
                $seconds = RateLimiter::availableIn($throttleKey);

                return $this->error(
                    "Please wait {$seconds} seconds before requesting another OTP.",
                    [],
                    429
                );
            }

            $otpCode = Otp::generateCode();

            Otp::create([
                'email' => $email,
                'otp_code' => $otpCode,
                'type' => 'password_reset',
                'expires_at' => now()->addMinutes(5),
                'is_used' => false,
            ]);

            RateLimiter::hit($throttleKey, 60);

            SendOtpMailJob::dispatch($email, $otpCode);

            return $this->success('An OTP has been sent to your email address.', [
                'expires_in_minutes' => 5,
            ]);
        } catch (Throwable $e) {
            report($e);

            return $this->error('Something went wrong while sending the OTP.', [], 500);
        }
    }
}
