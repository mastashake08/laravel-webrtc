<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\CallController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/call', [CallController::class, 'call'])->name('call');
Route::post('/answer', [CallController::class, 'answer'])->name('answer');
