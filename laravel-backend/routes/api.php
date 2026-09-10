<?php

use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LotController;
use App\Http\Controllers\Api\PickingController;
use App\Http\Controllers\Api\ReceivingController;
use App\Http\Controllers\Api\ReorderController;
use App\Http\Controllers\Api\WorkspaceController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/login', [AuthController::class, 'login']);

// Authenticated (Sanctum) — matches every action App.jsx performs once a user is signed in
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/workspace', [WorkspaceController::class, 'index']); // replaces fetchInventoryWorkspace()

    Route::post('/receive', [ReceivingController::class, 'store']); // receiveStock()

    Route::post('/picks/{task}/complete', [PickingController::class, 'complete']);       // completePick()
    Route::post('/picks/{task}/report-issue', [PickingController::class, 'reportIssue']); // reportPickIssue()

    Route::post('/reorder/{recommendation}/create-po', [ReorderController::class, 'createPurchaseOrder']); // createPurchaseOrder()

    Route::post('/lots/{lot}/writeoff', [LotController::class, 'writeOff']); // writeOffLot()

    Route::patch('/alerts/{alert}/read', [AlertController::class, 'update']); // toggleAlertRead()
    Route::post('/alerts/read-all', [AlertController::class, 'readAll']);      // markAllRead()

    // Note: there's no backend equivalent needed for exportCsv() — that's
    // pure client-side Blob generation in App.jsx and can stay as-is.
});
