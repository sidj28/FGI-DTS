<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\DocumentStatus;

class ShipmentController extends Controller
{
    public function index()
    {
        $shipments = Shipment::with([
            'status',
            'shipmentType',
            'documents.customDoc',
            'documents.currentStatus.status',
        ])->get();

        return Inertia::render('shipments', [
            'shipments' => $shipments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'year'                    => 'required|integer',
            'month'                   => 'required|integer',
            'shipment_reference'      => 'required|string|max:255',
            'brand'                   => 'required|string|max:255',
            'incoterm'                => 'required|string|max:255',
            'actual_time_of_arrival'  => 'nullable|date',
            'broker'                  => 'nullable|string|max:255',
            'brand_manager'           => 'nullable|string|max:255',
            'shipment_type_id'        => 'required|exists:shipment_types,shipment_type_id',
            'status_id'               => 'required|exists:shipment_status_list,status_id',
        ]);

        $shipment = Shipment::create($validated);

        return redirect()->route('shipments.index');
    }

    public function update(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'year'                    => 'sometimes|integer',
            'month'                   => 'sometimes|integer',
            'shipment_reference'      => 'sometimes|string|max:255',
            'brand'                   => 'sometimes|string|max:255',
            'incoterm'                => 'sometimes|string|max:255',
            'actual_time_of_arrival'  => 'nullable|date',
            'broker'                  => 'nullable|string|max:255',
            'brand_manager'           => 'nullable|string|max:255',
            'shipment_type_id'        => 'sometimes|exists:shipment_types,shipment_type_id',
            'status_id'               => 'sometimes|exists:shipment_status_list,status_id',
        ]);

        $shipment->update($validated);

        return redirect()->route('shipments.index');
    }

    public function destroy(Shipment $shipment)
    {
        $shipment->delete();

        return redirect()->route('shipments.index');
    }


    

public function updateDocumentStatus(Request $request, $shipment_doc_id)
{
    $request->validate([
        'status_id' => 'required|exists:document_status_list,status_id',
    ]);

    // Set all previous statuses for this doc to not current
    DocumentStatus::where('shipment_doc_id', $shipment_doc_id)
        ->update(['is_current' => false]);

    // Insert new current status
    DocumentStatus::create([
        'shipment_doc_id' => $shipment_doc_id,
        'status_id'       => $request->status_id,
        'is_current'      => true,
        'changed_at'      => now(),
        'changed_by'      => Auth::id(),
    ]);

    return redirect()->route('shipments.index');
}
}