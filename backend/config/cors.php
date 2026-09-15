<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'https://tapco-agri.com,https://admin.tapco-agri.com,http://localhost:4200,http://localhost:4201,http://127.0.0.1:4200,http://127.0.0.1:4201,http://localhost:8000')))),

    'allowed_origins_patterns' => [
        '#^https?://([a-zA-Z0-9-]+\.)?tapco-agri\.com$#',
        '#^https?://localhost(:[0-9]+)?$#',
        '#^https?://127\.0\.0\.1(:[0-9]+)?$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,

];
