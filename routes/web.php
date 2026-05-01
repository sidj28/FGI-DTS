<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\ShipmentController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Resource routes for shipments (handles index, create, store, etc.)
    Route::resource('shipments', ShipmentController::class)->parameters([
        'shipments' => 'shipment:shipment_id',
    ]);

    Route::post('shipments/documents/{shipment_doc_id}/status', [ShipmentController::class, 'updateDocumentStatus'])
        ->name('shipments.documents.status');
    
    Route::patch('shipments/{shipment}/archive', [ShipmentController::class, 'archive'])
    ->name('shipments.archive');
});

require __DIR__.'/settings.php';