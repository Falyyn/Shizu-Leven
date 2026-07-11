<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\MasterDataController;
use App\Http\Controllers\Api\V1\AIChatController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::get('/dashboard/stats', [DashboardController::class, 'index']);
        
        Route::apiResource('inventory', InventoryController::class);
        
        Route::get('/master-data', [MasterDataController::class, 'index']);
        Route::post('/master-data/category', [MasterDataController::class, 'storeCategory']);
        Route::post('/master-data/location', [MasterDataController::class, 'storeLocation']);
        Route::delete('/master-data/category/{id}', [MasterDataController::class, 'destroyCategory']);
        Route::delete('/master-data/location/{id}', [MasterDataController::class, 'destroyLocation']);
        
        Route::post('/profile', [AuthController::class, 'updateProfile']);
        Route::post('/ai/chat', [AIChatController::class, 'chat']);
    });
});
