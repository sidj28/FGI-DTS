import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Download, Eye, FileText, Package, Pencil, Printer, Trash2, X, XCircle } from 'lucide-react';
import { type ReactNode, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocumentStatusList {
    status_id: number;
    status_name: string;
}

interface DocumentStatus {
    doc_status_id: number;
    is_current: boolean;
    status: DocumentStatusList;
}

interface CustomDoc {
    custom_doc_id: number;
    doc_name: string;
    doc_full_name: string;
}

interface ShipmentDocument {
    shipment_doc_id: number;
    custom_doc: CustomDoc;
    current_status: DocumentStatus | null;
}

interface ShipmentStatus {
    status_id: number;
    status_name: string;
}

interface ShipmentType {
    shipment_type_id: number;
    shipment_type_name: string;
}

interface Shipment {
    shipment_id: number;
    shipment_reference: string;
    brand: string;
    incoterm: string;
    actual_time_of_arrival: string | null;
    broker: string;
    brand_manager: string;
    created_at: string | null;
    archived_at: string | null;
    status: ShipmentStatus;
    shipment_type: ShipmentType;
    documents: ShipmentDocument[];
}

interface Props {
    shipments: Shipment[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shipments', href: '/shipments' },
];

const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
    });
};

const statusIcon = (statusName: string) => {
    const s = statusName.toLowerCase();
    if (s === 'processing') return <span className="text-blue-500 text-lg">✳</span>;
    if (s === 'pending')    return <span className="text-yellow-500 text-lg">◎</span>;
    if (s === 'completed')  return <span className="text-green-500 text-lg">✔</span>;
    if (s === 'failed')     return <span className="text-red-500 text-lg">✘</span>;
    return null;
};

const isApproved = (doc: ShipmentDocument) =>
    doc.current_status?.status?.status_name?.toLowerCase() === 'approved';

const isRejected = (doc: ShipmentDocument) =>
    doc.current_status?.status?.status_name?.toLowerCase() === 'rejected';

// ─── Doc Status Indicator ─────────────────────────────────────────────────────

const DocStatusIndicator = ({ doc }: { doc: ShipmentDocument }) => {
    if (isApproved(doc)) return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
    if (isRejected(doc)) return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />;
    return <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300 inline-block" />;
};

// ─── Mock Preview ─────────────────────────────────────────────────────────────

const MockDocumentPreview = ({ docName, brand }: { docName: string; brand: string }) => (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-inner text-xs text-gray-700 font-mono">
        <div className="flex items-center justify-between border-b pb-2">
            <div>
                <p className="text-sm font-bold text-gray-900">{brand}</p>
                <p className="text-gray-400">123 Trade Street, Manila, PH</p>
            </div>
            <div className="text-right text-gray-400">
                <p>Doc No: MOCK-0042</p>
                <p>Date: 04/24/26</p>
            </div>
        </div>
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-800">
            {docName}
        </p>
        <div className="flex flex-col gap-2 text-gray-500">
            {[
                ['Shipper', brand],
                ['Consignee', 'SK Devan Trading Co.'],
                ['Port of Loading', 'Shanghai, CN'],
                ['Port of Discharge', 'Manila, PH'],
                ['Vessel / Flight', 'MV ORIENT STAR 12'],
                ['B/L Number', 'BL-2025-00408'],
                ['Gross Weight', '1,240 KGS'],
                ['Measurement', '8.5 CBM'],
            ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-dashed border-gray-100 pb-1">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-medium text-gray-700">{value}</span>
                </div>
            ))}
        </div>
        <div className="mt-2 border-t pt-2 text-gray-300 text-center">
            — MOCK PREVIEW — NOT AN OFFICIAL DOCUMENT —
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Shipments({ shipments }: Props) {
    const [activeDocPanel, setActiveDocPanel] = useState<number | null>(null);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

    const activeShipment = activeDocPanel !== null ? shipments[activeDocPanel] : null;
    const selectedDoc = activeShipment?.documents.find(d => d.shipment_doc_id === selectedDocId) ?? null;

    const handleStatusUpdate = (shipmentDocId: number, statusId: number) => {
        router.post(
            `/shipments/documents/${shipmentDocId}/status`,
            { status_id: statusId },
            { preserveScroll: true }
        );
    };

    const closePanel = () => {
        setActiveDocPanel(null);
        setSelectedDocId(null);
    };

    return (
        <>
            <Head title="Shipments" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                    <Package className="h-6 w-6" />
                    <h1 className="text-2xl font-semibold">Shipment Details</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm hover:bg-muted">
                        <Eye className="h-4 w-4" /> View All
                    </button>
                    <button className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm hover:bg-muted">
                        <Calendar className="h-4 w-4" /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm hover:bg-muted">
                        <Download className="h-4 w-4" /> Export
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-4">
                {/* Tabs */}
                <div className="flex gap-6 border-b text-sm">
                    {['All tasks', 'Completed', 'In Progress', 'Pending Approval', 'Incomplete'].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-2 ${tab === 'All tasks' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Select</th>
                                <th className="px-4 py-3">SR#</th>
                                <th className="px-4 py-3">Brand</th>
                                <th className="px-4 py-3">Incoterm</th>
                                <th className="px-4 py-3">ATA</th>
                                <th className="px-4 py-3">Broker</th>
                                <th className="px-4 py-3">BM</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Created</th>
                                <th className="px-4 py-3">Archived</th>
                                <th className="px-4 py-3">Documents</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((s, i) => {
                                const approvedCount = s.documents.filter(isApproved).length;
                                const totalCount = s.documents.length;

                                return (
                                    <tr key={s.shipment_id} className="border-t hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="h-4 w-4 rounded border" />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{s.shipment_reference}</td>
                                        <td className="px-4 py-3">{s.brand}</td>
                                        <td className="px-4 py-3">{s.incoterm}</td>
                                        <td className="px-4 py-3">{formatDate(s.actual_time_of_arrival)}</td>
                                        <td className="px-4 py-3">{s.broker}</td>
                                        <td className="px-4 py-3">{s.brand_manager}</td>
                                        <td className="px-4 py-3 text-center">{statusIcon(s.status.status_name)}</td>
                                        <td className="px-4 py-3">{formatDate(s.created_at)}</td>
                                        <td className="px-4 py-3">{formatDate(s.archived_at)}</td>

                                        {/* Documents Column */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium ${approvedCount === totalCount && totalCount > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {approvedCount}/{totalCount}
                                                </span>
                                                <button
                                                    onClick={() => { setActiveDocPanel(i); setSelectedDocId(null); }}
                                                    className="flex items-center gap-1 rounded-md border border-purple-500 px-2 py-1 text-xs text-purple-600 hover:bg-purple-50"
                                                >
                                                    <Eye className="h-3 w-3" /> View
                                                </button>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button className="flex items-center gap-1 rounded-md border border-blue-500 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50">
                                                    <Printer className="h-3 w-3" /> Print
                                                </button>
                                                <button className="flex items-center gap-1 rounded-md border border-yellow-500 px-2 py-1 text-xs text-yellow-600 hover:bg-yellow-50">
                                                    <Pencil className="h-3 w-3" /> Edit
                                                </button>
                                                <button className="flex items-center gap-1 rounded-md border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span><strong className="text-foreground">Total Shipments:</strong> {shipments.length}</span>
                </div>
            </div>

            {/* Document Dialog */}
            {activeShipment !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={closePanel}
                >
                    <div
                        className="flex h-[560px] w-[760px] rounded-xl border bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left — Document List */}
                        <div className="flex w-56 flex-shrink-0 flex-col border-r">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold">Documents</p>
                                    <p className="text-xs text-muted-foreground">{activeShipment.brand}</p>
                                </div>
                                <button onClick={closePanel}>
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-1 overflow-y-auto p-3 flex-1">
                                {activeShipment.documents.map((doc) => {
                                    const fullName = doc.custom_doc.doc_full_name;
                                    const isSelected = selectedDocId === doc.shipment_doc_id;

                                    return (
                                        <li
                                            key={doc.shipment_doc_id}
                                            onClick={() => setSelectedDocId(doc.shipment_doc_id)}
                                            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                                                isSelected
                                                    ? 'bg-purple-50 text-purple-700'
                                                    : 'hover:bg-muted/50'
                                            }`}
                                        >
                                            <DocStatusIndicator doc={doc} />
                                            <FileText className={`h-3.5 w-3.5 flex-shrink-0 ${isApproved(doc) ? 'text-green-500' : isRejected(doc) ? 'text-red-400' : 'text-gray-300'}`} />
                                            <span className={`text-xs leading-tight ${isApproved(doc) ? 'text-gray-800' : isRejected(doc) ? 'text-red-400' : 'text-gray-400'}`}>
                                                {fullName}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="border-t px-4 py-3 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {activeShipment.documents.filter(isApproved).length} of {activeShipment.documents.length} approved
                                </span>
                                <button
                                    onClick={closePanel}
                                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Right — Preview + Actions */}
                        <div className="flex flex-1 flex-col">
                            <div className="border-b px-4 py-3">
                                <p className="text-sm font-semibold text-gray-700">
                                    {selectedDoc ? selectedDoc.custom_doc.doc_full_name : 'Select a document to preview'}
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {selectedDoc ? (
                                    <MockDocumentPreview
                                        docName={selectedDoc.custom_doc.doc_full_name}
                                        brand={activeShipment.brand}
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300">
                                        <FileText className="h-16 w-16" />
                                        <p className="text-sm">Click a document on the left to preview</p>
                                    </div>
                                )}
                            </div>

                            {/* Approve / Reject Actions */}
                            {selectedDoc && (
                                <div className="border-t px-4 py-3 flex items-center justify-between bg-gray-50">
                                    <div className="text-xs text-muted-foreground">
                                        {selectedDoc.current_status
                                            ? <>Current: <span className={`font-medium ${isApproved(selectedDoc) ? 'text-green-600' : isRejected(selectedDoc) ? 'text-red-500' : 'text-yellow-600'}`}>
                                                {selectedDoc.current_status.status.status_name}
                                              </span></>
                                            : 'No status yet'
                                        }
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={isApproved(selectedDoc)}
                                            onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 1)}
                                            className="flex items-center gap-1 rounded-md border border-green-500 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                                        </button>
                                        <button
                                            disabled={isRejected(selectedDoc)}
                                            onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 3)}
                                            className="flex items-center gap-1 rounded-md border border-red-500 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="h-3.5 w-3.5" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Shipments.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);