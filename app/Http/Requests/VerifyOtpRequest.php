<?php

namespace App\Http\Requests;

class VerifyOtpRequest extends ApiFormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'exists:users,email'],
            'otp_code' => ['required', 'digits:6'],
        ];
    }
}
