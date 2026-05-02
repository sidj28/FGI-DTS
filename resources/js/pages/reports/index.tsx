import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { FileBarChart2 } from 'lucide-react';

import { type Props } from './types';
import { breadcrumbs } from './constants';

import { FilterBar } from '@/components/reports/filter-bar';
import { GaugeMeter } from '@/components/reports/gauge-meter';
import { MetricCard } from '@/components/reports/metric-card';
import { CompletenessChart } from '@/components/reports/completeness-chart';
import { CompleteVsIncompleteChart } from '@/components/reports/complete-vs-incomplete-chart';
import { DocumentStatusChart } from '@/components/reports/document-status-chart';

export default function Reports({ metrics, charts, filterOptions, activeFilters }: Props) {
    const shipmentMetrics = [
        { label: 'Completed Shipments', value: metrics.completedShipments, percentage: metrics.totalShipments ? Math.round((metrics.completedShipments / metrics.totalShipments) * 100) : 0 },
        { label: 'Pending Shipments', value: metrics.pendingShipments, percentage: metrics.totalShipments ? Math.round((metrics.pendingShipments / metrics.totalShipments) * 100) : 0 },
        { label: 'Processing Shipments', value: metrics.processingShipments, percentage: metrics.totalShipments ? Math.round((metrics.processingShipments / metrics.totalShipments) * 100) : 0 },
    ];

    const documentMetrics = [
        { label: 'Required Documents', value: metrics.totalDocs, percentage: 100 },
        { label: 'Approved Documents', value: metrics.approvedDocs, percentage: metrics.totalDocs ? Math.round((metrics.approvedDocs / metrics.totalDocs) * 100) : 0 },
        { label: 'Pending Documents', value: metrics.pendingDocs, percentage: metrics.totalDocs ? Math.round((metrics.pendingDocs / metrics.totalDocs) * 100) : 0 },
        { label: 'Rejected Documents', value: metrics.rejectedDocs, percentage: metrics.totalDocs ? Math.round((metrics.rejectedDocs / metrics.totalDocs) * 100) : 0 },
    ];

    return (
        <>
            <Head title="Reports" />
            <div className="flex min-h-screen flex-col bg-[#EEF2F7] p-6 gap-5">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <FileBarChart2 className="h-6 w-6 text-slate-400" />
                    <h1 className="text-2xl font-black tracking-tighter">Reports</h1>
                </div>

                {/* Filters */}
                <FilterBar filterOptions={filterOptions} activeFilters={activeFilters} />

                {/* Charts */}
                <div className="grid grid-cols-3 gap-4">
                    <CompletenessChart data={charts.completenessOverTime} />
                    <CompleteVsIncompleteChart data={charts.completeVsIncomplete} />
                    <DocumentStatusChart data={charts.documentStatusDist} />
                </div>

                {/* Shipment Metrics */}
                <div>
                    <h2 className="text-base font-black tracking-tight text-slate-700 mb-3">Shipment Metrics</h2>
                    <div className="flex gap-4">
                        {/* Gauge */}
                        <div className="flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm px-6 py-4">
                            <GaugeMeter percent={metrics.completionRate} />
                        </div>
                        {shipmentMetrics.map((m) => (
                            <MetricCard key={m.label} label={m.label} value={m.value} percentage={m.percentage} total={metrics.totalShipments} />
                        ))}
                    </div>
                </div>

                {/* Document Metrics */}
                <div>
                    <h2 className="text-base font-black tracking-tight text-slate-700 mb-3">Document Metrics</h2>
                    <div className="flex gap-4">
                        {/* Gauge */}
                        <div className="flex items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm px-6 py-4">
                            <GaugeMeter percent={metrics.totalDocs ? Math.round((metrics.approvedDocs / metrics.totalDocs) * 100) : 0} />
                        </div>
                        {documentMetrics.map((m) => (
                            <MetricCard key={m.label} label={m.label} value={m.value} percentage={m.percentage} total={metrics.totalDocs} />
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

Reports.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;