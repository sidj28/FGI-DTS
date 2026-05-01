import { Head, router } from '@inertiajs/react';
import {
    Search,
    Calendar,
    Download,
    Eye,
    FileText,
    Package,
    Pencil,
    Printer,
    Trash2,
    X,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Search as SearchIcon,
} from 'lucide-react';
import { type ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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

const StatusIcon = ({ type, className }: { type: string; className?: string }) => {
    switch (type.toLowerCase()) {
        case 'ok':
        case 'completed':
        case 'approved':
            return (
                <div className={cn("size-5 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 border border-green-100 dark:border-green-800/30", className)}>
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            );
        case 'error':
        case 'failed':
        case 'rejected':
            return (
                <div className={cn("size-5 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-800/30", className)}>
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            );
        case 'warning':
        case 'processing':
        case 'in progress':
            return (
                <div className={cn("size-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-800/30 border-dashed", className)}>
                    <div className="size-2.5 rounded-full border-2 border-amber-400 border-dotted animate-spin-slow" />
                </div>
            );
        case 'pending':
        case 'pending approval':
            return (
                <div className={cn("size-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-800/30", className)}>
                    <div className="size-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                </div>
            );
        default:
            return <div className={cn("size-5 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-100 dark:border-slate-700", className)} />;
    }
};

const isApproved = (doc: ShipmentDocument) =>
    doc.current_status?.status?.status_name?.toLowerCase() === 'approved';

const isRejected = (doc: ShipmentDocument) =>
    doc.current_status?.status?.status_name?.toLowerCase() === 'rejected';

// ─── Doc Status Indicator ─────────────────────────────────────────────────────

const DocStatusIndicator = ({ doc }: { doc: ShipmentDocument }) => {
    const status = doc.current_status?.status?.status_name?.toLowerCase() || 'pending';
    return <StatusIcon type={status} className="size-4" />;
};

// ─── Mock Preview ─────────────────────────────────────────────────────────────

const MockDocumentPreview = ({ docName, brand }: { docName: string; brand: string }) => (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 p-5 shadow-inner text-xs text-slate-700 dark:text-slate-300 font-mono relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{brand}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">123 Trade Street, Manila, PH</p>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                <p>Doc No: MOCK-0042</p>
                <p>Date: 04/24/26</p>
            </div>
        </div>
        <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 py-2">
            {docName}
        </p>
        <div className="flex flex-col gap-2">
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
                <div key={label} className="flex justify-between border-b border-dashed border-slate-100 dark:border-slate-800/40 pb-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{label}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300 tracking-tight">{value}</span>
                </div>
            ))}
        </div>
        <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-slate-300 dark:text-slate-700 text-center text-[9px] font-bold uppercase tracking-[0.3em]">
            — MOCK PREVIEW — NOT AN OFFICIAL DOCUMENT —
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Shipments({ shipments }: Props) {
    const [activeDocPanel, setActiveDocPanel] = useState<number | null>(null);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('All tasks');
    const [searchQuery, setSearchQuery] = useState('');

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

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (activeDocPanel !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [activeDocPanel]);

    const filteredShipments = shipments.filter(s => {
        if (searchQuery && !s.shipment_reference.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (activeTab !== 'All tasks') {
            const status = s.status.status_name.toLowerCase();
            if (activeTab === 'Completed' && status !== 'completed') return false;
            if (activeTab === 'In Progress' && status !== 'processing') return false;
            if (activeTab === 'Pending Approval' && status !== 'pending') return false;
            if (activeTab === 'Incomplete' && status !== 'failed') return false;
        }
        return true;
    });

    return (
        <div className="flex min-h-screen flex-col bg-[#F9FAFB] dark:bg-[#030712] p-6 font-sans text-slate-900 dark:text-slate-100">
            <Head title="Shipments" />

            {/* Premium Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Package className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Shipment Details</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage and track all logistics</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-64 mr-2">
                        <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="bg-white dark:bg-slate-900/40 pl-9 h-8 border-slate-200 dark:border-slate-800 rounded-lg text-[10px]"
                            placeholder="Search Reference..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                        <Calendar className="size-3.5" /> Last 30 Days
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                        <Download className="size-3.5" /> Export
                    </Button>
                </div>
            </div>

            {/* Compressed Table Area */}
            <div className="flex flex-col bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
                <div className="px-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-6">
                        {['All tasks', 'Completed', 'In Progress', 'Pending Approval', 'Incomplete'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-3 text-xs font-bold tracking-tight relative transition-all",
                                    activeTab === tab ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 -mt-1 mb-2 sm:mb-0">
                        <div className="flex border-l border-slate-200 dark:border-slate-800 ml-2 pl-2">
                            <Button variant="ghost" size="icon" className="size-7 text-slate-300"><ChevronLeft className="size-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="size-7 text-slate-600"><ChevronRight className="size-3.5" /></Button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">SR#</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Brand</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Incoterm</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">ATA</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Broker</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">BM</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Status</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Documents</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredShipments.map((s, index) => {
                                const approvedCount = s.documents.filter(isApproved).length;
                                const totalCount = s.documents.length;

                                return (
                                    <tr key={s.shipment_id} className="border-b border-slate-50 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-3 text-xs font-black text-blue-900 dark:text-blue-300 tracking-tighter">{s.shipment_reference}</td>
                                        <td className="px-6 py-3 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{s.brand}</td>
                                        <td className="px-6 py-3 text-[11px] font-bold text-slate-500">{s.incoterm}</td>
                                        <td className="px-6 py-3 text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{formatDate(s.actual_time_of_arrival)}</td>
                                        <td className="px-6 py-3 text-[11px] font-bold text-slate-500">{s.broker}</td>
                                        <td className="px-6 py-3 text-[11px] font-bold text-slate-500">{s.brand_manager}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex justify-center">
                                                <StatusIcon type={s.status.status_name} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] font-black tracking-tighter",
                                                    approvedCount === totalCount && totalCount > 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                                                )}>
                                                    {approvedCount}/{totalCount}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { setActiveDocPanel(index); setSelectedDocId(null); }}
                                                    className="size-7 text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="size-8 text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                    <Printer className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Shipments: <span className="text-slate-900 dark:text-white font-black">{shipments.length}</span>
                    </span>
                </div>
            </div>

            {/* Document Dialog — Premium Glassmorphic */}
            {activeShipment !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={closePanel}
                >
                    <div
                        className="flex h-[600px] w-[850px] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left — Document List */}
                        <div className="flex w-64 flex-shrink-0 flex-col border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/20">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 px-5 py-4">
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white tracking-tighter">DOCUMENTS</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[140px]">{activeShipment.brand}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="size-7 text-slate-400" onClick={closePanel}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <ul className="flex flex-col gap-1 overflow-y-auto p-3 flex-1 custom-scrollbar">
                                {activeShipment.documents.map((doc) => {
                                    const fullName = doc.custom_doc.doc_full_name;
                                    const isSelected = selectedDocId === doc.shipment_doc_id;

                                    return (
                                        <li
                                            key={doc.shipment_doc_id}
                                            onClick={() => setSelectedDocId(doc.shipment_doc_id)}
                                            className={cn(
                                                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
                                                isSelected
                                                    ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                                                    : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <DocStatusIndicator doc={doc} />
                                            <div className="flex flex-col min-w-0">
                                                <span className={cn(
                                                    "text-[10px] font-bold leading-tight truncate transition-colors",
                                                    isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                                                )}>
                                                    {fullName}
                                                </span>
                                            </div>
                                            {isSelected && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-l-full" />}
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="border-t border-slate-100 dark:border-slate-800/60 px-5 py-4 bg-white/50 dark:bg-slate-900/40">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    {activeShipment.documents.filter(isApproved).length} / {activeShipment.documents.length} APPROVED
                                </p>
                                <Button
                                    onClick={closePanel}
                                    className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                                >
                                    Close Portal
                                </Button>
                            </div>
                        </div>

                        {/* Right — Preview + Actions */}
                        <div className="flex flex-1 flex-col bg-white dark:bg-slate-950">
                            <div className="border-b border-slate-100 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">
                                        {selectedDoc ? selectedDoc.custom_doc.doc_full_name : 'PREVIEW PORTAL'}
                                    </h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digital Document Verification</p>
                                </div>
                                {selectedDoc && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800">
                                            <Printer className="size-3 mr-1" /> Print
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-900/20 custom-scrollbar">
                                {selectedDoc ? (
                                    <div className="max-w-2xl mx-auto">
                                        <MockDocumentPreview
                                            docName={selectedDoc.custom_doc.doc_full_name}
                                            brand={activeShipment.brand}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-200 dark:text-slate-800">
                                        <div className="size-20 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                                            <FileText className="size-10" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Select Document to Initialize</p>
                                    </div>
                                )}
                            </div>

                            {/* Approve / Reject Actions */}
                            {selectedDoc && (
                                <div className="border-t border-slate-100 dark:border-slate-800/60 px-6 py-5 flex items-center justify-between bg-white dark:bg-slate-950">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Protocol</span>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon type={selectedDoc.current_status?.status.status_name || 'pending'} className="size-3.5" />
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-tight",
                                                isApproved(selectedDoc) ? "text-green-600" : isRejected(selectedDoc) ? "text-red-500" : "text-amber-500"
                                            )}>
                                                {selectedDoc.current_status?.status.status_name || 'Awaiting Review'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            disabled={isApproved(selectedDoc)}
                                            onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 1)}
                                            className="h-10 px-6 bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg shadow-green-500/20 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                                        >
                                            Approve Document
                                        </Button>
                                        <Button
                                            disabled={isRejected(selectedDoc)}
                                            onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 3)}
                                            variant="outline"
                                            className="h-10 px-6 border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Shipments.layout = (page: ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);