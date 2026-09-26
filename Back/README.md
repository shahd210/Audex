# Auth API — Laravel + Sanctum (Complete Project)

This is a **complete** Laravel project — it already has `artisan`, `composer.json`,
`.env`, all config files, and the full authentication system wired in. You do
**not** need to run `laravel new` or `composer create-project` — just unzip
this folder and follow the steps below.

## 1. Unzip
Unzip this into your Laragon `www` folder, e.g.:
```
C:\laragon\www\auth-api
```

## 2. Install PHP dependencies
Open a terminal **inside** the `auth-api` folder (Laragon's built-in terminal
already has PHP + Composer on the PATH) and run:
```bash
composer install
```
This downloads Laravel itself and Sanctum into a `vendor/` folder — it needs
an internet connection and takes a minute or two.

## 3. Generate the app key
```bash
php artisan key:generate
```
This fills in `APP_KEY` inside `.env` — Laravel won't run without it.

## 4. Create the database
In HeidiSQL (bundled with Laragon): right-click → Create New → Database →
name it `auth_api` (matches `DB_DATABASE` already set in `.env`).

If you used a different name, edit `.env` → `DB_DATABASE` to match.

## 5. Run the migrations
```bash
php artisan migrate
```
This creates every table: `users`, `otps`, `personal_access_tokens`,
`sessions`, `cache`, `jobs`, `failed_jobs`.

## 6. Run the server
```bash
php artisan serve
```
Your API is now live at `http://127.0.0.1:8000`, with every route under
`http://127.0.0.1:8000/api/auth/...`.

## 7. (Optional) Run the queue worker
`.env` ships with `MAIL_MAILER=log`, so OTP emails are written straight to
`storage/logs/laravel.log` instead of actually being queued/sent — you don't
need the queue worker just to test the flow. Once you switch to a real mail
driver (`smtp`), start a worker in a second terminal so `SendOtpMailJob`
actually gets processed:
```bash
php artisan queue:work
```

## Connecting your frontend
- Edit `CORS_ALLOWED_ORIGINS` in `.env` to your frontend's URL (e.g.
  `http://localhost:5173` for Vite, `http://localhost:3000` for
  Create React App / Next).
- Every endpoint is under `/api/auth/...` — see the table below.
- Send the token you get back from `register`/`login` as
  `Authorization: Bearer <token>` on any request to a protected route.

## Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/verify-otp` | Public |
| POST | `/api/auth/reset-password` | Public |
| POST | `/api/auth/resend-otp` | Public |
| POST | `/api/auth/logout` | Bearer token |

All responses use one shared shape:
- Success → `{ "success": true, "message": "...", "data": {...} }`
- Error → `{ "success": false, "message": "...", "errors": {...} }`

## If something goes wrong
- **"could not find driver" / DB connection error** → check `DB_DATABASE`,
  `DB_USERNAME`, `DB_PASSWORD` in `.env` match what you created in HeidiSQL,
  and that Laragon's "Start All" is green.
- **"No application encryption key has been specified"** → you skipped step 3
  (`php artisan key:generate`).
- **CORS error in the browser console** → add your frontend's exact origin to
  `CORS_ALLOWED_ORIGINS` in `.env`.
