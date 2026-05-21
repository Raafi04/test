<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TimelineController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/tokens/{tokenId}', [AuthController::class, 'revokeToken']);
    Route::get('/timelines', [TimelineController::class, 'index']);
    Route::post('/timelines', [TimelineController::class, 'store']);
    Route::put('/timelines/{id}', [TimelineController::class, 'update']);
    Route::delete('/timelines/{id}', [TimelineController::class, 'destroy']);
});
