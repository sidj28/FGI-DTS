<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\DocumentStatus;
use App\Models\ShipmentType;

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
            'shipmentTypes' => ShipmentType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipment_reference'     => 'required|string|max:255',
            'brand'                  => 'required|string|max:255',
            'incoterm'               => 'required|string|max:255',
            'actual_time_of_arrival' => 'nullable|date',
            'broker'                 => 'nullable|string|max:255',
            'brand_manager'          => 'nullable|string|max:255',
            'shipment_type_id'       => 'required|exists:shipment_types,shipment_type_id',
        ]);

        // Derive year and month from ATA if provided, otherwise use current date
        $ata = $validated['actual_time_of_arrival']
            ? \Carbon\Carbon::parse($validated['actual_time_of_arrival'])
            : now();

        $validated['year']      = $ata->year;
        $validated['month']     = $ata->month;
        $validated['status_id'] = 2; // Pending by default

        $shipment = Shipment::create($validated);

        // Auto-assign all custom docs to the new shipment
        $customDocIds = \App\Models\CustomDoc::pluck('custom_doc_id');
        foreach ($customDocIds as $docId) {
            \App\Models\ShipmentDocument::create([
                'shipment_id'   => $shipment->shipment_id,
                'custom_doc_id' => $docId,
            ]);
        }

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

        // ── Auto-update shipment status ──
        // 1. Get the shipment_id from the document
        $shipmentDoc = \App\Models\ShipmentDocument::find($shipment_doc_id);

        // 2. Load the shipment with all its documents and their current statuses
        $shipment = Shipment::with('documents.currentStatus.status')
            ->find($shipmentDoc->shipment_id);

        // 3. Count approved documents
        $totalDocs    = $shipment->documents->count();
        $approvedDocs = $shipment->documents->filter(function ($doc) {
            return $doc->currentStatus?->status?->status_name === 'Approved';
        })->count();

        // 4. All approved → Completed (4), otherwise → Pending (2)
        $newStatusId = ($totalDocs > 0 && $approvedDocs === $totalDocs) ? 4 : 2;
        $shipment->update(['status_id' => $newStatusId]);

        return redirect()->route('shipments.index');
    }

    public function update(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'year'                   => 'sometimes|integer',
            'month'                  => 'sometimes|integer',
            'shipment_reference'     => 'sometimes|string|max:255',
            'brand'                  => 'sometimes|string|max:255',
            'incoterm'               => 'sometimes|string|max:255',
            'actual_time_of_arrival' => 'nullable|date',
            'broker'                 => 'nullable|string|max:255',
            'brand_manager'          => 'nullable|string|max:255',
            'shipment_type_id'       => 'sometimes|exists:shipment_types,shipment_type_id',
            // status_id removed — handled automatically
        ]);

        $shipment->update($validated);

        return redirect()->route('shipments.index');
    }

    public function archive(Shipment $shipment)
    {
        $shipment->update(['archived_at' => now()]);

        return redirect()->route('shipments.index');
    }
}