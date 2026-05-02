<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\ShipmentDocument;
use App\Models\DocumentStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        $brand = $request->input('brand');
        $brandManager = $request->input('brand_manager');
        $serviceType = $request->input('service_type');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // ── Base shipment query with filters ──────────────────────────────
        $shipments = Shipment::query()
            ->with(['status', 'shipmentType', 'documents.currentStatus.status'])
            ->when($brand, fn($q) => $q->where('brand', $brand))
            ->when($brandManager, fn($q) => $q->where('brand_manager', $brandManager))
            ->when($serviceType, fn($q) => $q->whereHas('shipmentType', fn($q2) => $q2->where('shipment_type_name', $serviceType)))
            ->when($dateFrom, fn($q) => $q->where('actual_time_of_arrival', '>=', $dateFrom))
            ->when($dateTo, fn($q) => $q->where('actual_time_of_arrival', '<=', $dateTo))
            ->get();

        // ── Shipment Metrics ──────────────────────────────────────────────
        $totalShipments = $shipments->count();
        $completedShipments = $shipments->filter(fn($s) => $s->status?->status_name === 'Completed')->count();
        $pendingShipments = $shipments->filter(fn($s) => $s->status?->status_name === 'Pending')->count();
        $processingShipments = $shipments->filter(fn($s) => $s->status?->status_name === 'Processing')->count();
        $failedShipments = $shipments->filter(fn($s) => $s->status?->status_name === 'Failed')->count();

        // ── Document Metrics ──────────────────────────────────────────────
        // ── Document Metrics ──────────────────────────────────────────────
        $allDocIds = $shipments->pluck('shipment_id');

        $allShipmentDocIds = ShipmentDocument::whereIn('shipment_id', $allDocIds)
            ->pluck('shipment_doc_id');

        $totalDocs = $allShipmentDocIds->count();

        $docStatusCounts = DocumentStatus::query()
            ->where('is_current', true)
            ->whereIn('shipment_doc_id', $allShipmentDocIds)
            ->join('document_status_list', 'document_statuses.status_id', '=', 'document_status_list.status_id')
            ->select('document_status_list.status_name', DB::raw('count(*) as count'))
            ->groupBy('document_status_list.status_name')
            ->get()
            ->pluck('count', 'status_name');

        $approvedDocs = $docStatusCounts->get('Approved', 0);
        $rejectedDocs = $docStatusCounts->get('Rejected', 0);
        $explicitPendingDocs = $docStatusCounts->get('Pending', 0);

        $docsWithAnyStatus = DocumentStatus::where('is_current', true)
            ->whereIn('shipment_doc_id', $allShipmentDocIds)
            ->distinct('shipment_doc_id')
            ->count('shipment_doc_id');

        $docsWithNoStatus = $totalDocs - $docsWithAnyStatus;

        $pendingDocs = $explicitPendingDocs + $docsWithNoStatus;

        $completionRate = $totalDocs > 0
            ? round(($approvedDocs / $totalDocs) * 100)
            : 0;
        // ── Complete vs Incomplete by Month ───────────────────────────────
        $completeVsIncomplete = Shipment::query()
            ->selectRaw("DATE_FORMAT(actual_time_of_arrival, '%b') as month,
                         MONTH(actual_time_of_arrival) as month_num,
                         SUM(CASE WHEN status_id = (SELECT status_id FROM shipment_status_list WHERE status_name = 'Completed') THEN 1 ELSE 0 END) as completed,
                         SUM(CASE WHEN status_id != (SELECT status_id FROM shipment_status_list WHERE status_name = 'Completed') THEN 1 ELSE 0 END) as incomplete")
            ->whereNotNull('actual_time_of_arrival')
            ->groupByRaw("MONTH(actual_time_of_arrival), DATE_FORMAT(actual_time_of_arrival, '%b')")
            ->orderByRaw("MONTH(actual_time_of_arrival)")
            ->get()
            ->map(fn($r) => [
                'month' => $r->month,
                'completed' => (int) $r->completed,
                'incomplete' => (int) $r->incomplete,
            ]);

        // ── Completeness Rate over Time ───────────────────────────────────
        $completenessOverTime = Shipment::query()
            ->selectRaw("DATE_FORMAT(actual_time_of_arrival, '%b') as month,
                         MONTH(actual_time_of_arrival) as month_num,
                         COUNT(*) as total_shipments")
            ->whereNotNull('actual_time_of_arrival')
            ->groupByRaw("MONTH(actual_time_of_arrival), DATE_FORMAT(actual_time_of_arrival, '%b')")
            ->orderByRaw("MONTH(actual_time_of_arrival)")
            ->get()
            ->map(fn($r) => [
                'month' => $r->month,
                'shipments' => (int) $r->total_shipments,
                'documents' => (int) $r->total_shipments * 11,
            ]);

        // ── Filter options ────────────────────────────────────────────────
        $brands = Shipment::distinct()->pluck('brand')->sort()->values();
        $brandManagers = Shipment::distinct()->pluck('brand_manager')->sort()->values();
        $serviceTypes = DB::table('shipment_types')->pluck('shipment_type_name')->sort()->values();

        return Inertia::render('reports/index', [
            'metrics' => [
                'totalShipments' => $totalShipments,
                'completedShipments' => $completedShipments,
                'pendingShipments' => $pendingShipments,
                'processingShipments' => $processingShipments,
                'failedShipments' => $failedShipments,
                'totalDocs' => $totalDocs,
                'approvedDocs' => $approvedDocs,
                'pendingDocs' => $pendingDocs,
                'rejectedDocs' => $rejectedDocs,
                'completionRate' => $completionRate,
            ],
            'charts' => [
                'completeVsIncomplete' => $completeVsIncomplete,
                'completenessOverTime' => $completenessOverTime,
                'documentStatusDist' => [
                    ['name' => 'Approved', 'value' => $approvedDocs, 'color' => '#22c55e'],
                    ['name' => 'Pending', 'value' => $pendingDocs, 'color' => '#eab308'],
                    ['name' => 'Rejected', 'value' => $rejectedDocs, 'color' => '#ef4444'],
                ],
            ],
            'filterOptions' => [
                'brands' => $brands,
                'brandManagers' => $brandManagers,
                'serviceTypes' => $serviceTypes,
            ],
            'activeFilters' => [
                'brand' => $brand,
                'brandManager' => $brandManager,
                'serviceType' => $serviceType,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo,
            ],
        ]);
    }
}