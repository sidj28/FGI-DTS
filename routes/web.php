<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');

    // These MUST be above Route::resource
    Route::post('shipments/documents/{shipment_doc_id}/upload', [ShipmentController::class, 'uploadDocument'])
        ->name('shipments.documents.upload');

    Route::get('shipments/documents/{shipment_doc_id}/file', [ShipmentController::class, 'viewDocument'])
        ->name('shipments.documents.file');

    Route::post('shipments/documents/{shipment_doc_id}/status', [ShipmentController::class, 'updateDocumentStatus'])
        ->name('shipments.documents.status');

    Route::patch('shipments/{shipment}/archive', [ShipmentController::class, 'archive'])
        ->name('shipments.archive');

    // Resource route LAST
    Route::resource('shipments', ShipmentController::class)->parameters([
        'shipments' => 'shipment:shipment_id',
    ]);
});
require __DIR__ . '/settings.php';