<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Code</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f5; padding:24px;">
    <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:8px; padding:32px;">
        <tr>
            <td>
                <h2 style="margin-top:0; color:#1f2937;">Password Reset Request</h2>
                <p style="color:#374151;">Use the code below to reset your password. This code expires in {{ $expiresInMinutes }} minutes.</p>
                <div style="font-size:32px; font-weight:bold; letter-spacing:8px; text-align:center; padding:16px; background:#f3f4f6; border-radius:6px; margin:24px 0;">
                    {{ $otpCode }}
                </div>
                <p style="color:#6b7280; font-size:13px;">If you did not request this, you can safely ignore this email.</p>
            </td>
        </tr>
    </table>
</body>
</html>
