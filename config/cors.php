<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Replace with your actual frontend origin(s) in production.
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // true only if you're using Sanctum's SPA cookie auth; false is fine
    // for pure token (Bearer) auth as specified here.
    'supports_credentials' => false,

];
