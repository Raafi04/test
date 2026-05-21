<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $path = public_path('index.html');

    if (!file_exists($path)) {
        return response(
            'Frontend not built yet. Run "npm run build" inside the frontend folder.',
            503
        );
    }

    return response(file_get_contents($path), 200, ['Content-Type' => 'text/html']);
});

Route::fallback(function () {
    $path = public_path('index.html');

    if (!file_exists($path)) {
        return response(
            'Frontend not built yet. Run "npm run build" inside the frontend folder.',
            503
        );
    }

    return response(file_get_contents($path), 200, ['Content-Type' => 'text/html']);
});
