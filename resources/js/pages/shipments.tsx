import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Download, Eye, FileText, Package, Pencil, Plus, Printer, Trash2, Archive, X, XCircle, Search } from 'lucide-react';
import { type ReactNode, useState, useMemo } from 'react';

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
    shipmentTypes: ShipmentType[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shipments', href: '/shipments' },
];

const INCOTERMS = [
    { code: 'EXW', name: 'Ex Works' },
    { code: 'FCA', name: 'Free Carrier' },
    { code: 'CPT', name: 'Carriage Paid To' },
    { code: 'CIP', name: 'Carriage and Insurance Paid To' },
    { code: 'DAP', name: 'Delivered at Place' },
    { code: 'DPU', name: 'Delivered at Place Unloaded' },
    { code: 'DDP', name: 'Delivered Duty Paid' },
    { code: 'FAS', name: 'Free Alongside Ship' },
    { code: 'FOB', name: 'Free on Board' },
    { code: 'CFR', name: 'Cost and Freight' },
    { code: 'CIF', name: 'Cost, Insurance and Freight' },
];

const BRAND_MANAGERS = [
    'Jenevev Dela Cruz',
    'Jonnel Dimagiba',
    'Richard Gomez',
    'Kate Santos',
];

const incotermName = (code: string) =>
    INCOTERMS.find((i) => i.code === code)?.name ?? code;

const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
    });
};

const toDatetimeLocal = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
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

// ─── Shared form fields default ───────────────────────────────────────────────

const emptyForm = {
    shipment_reference:     '',
    brand:                  '',
    incoterm:               'EXW',
    actual_time_of_arrival: '',
    broker:                 '',
    brand_manager:          '',
    shipment_type_id:       '',
};

// ─── Doc Status Indicator ─────────────────────────────────────────────────────

const DocStatusIndicator = ({ doc }: { doc: ShipmentDocument }) => {
    if (isApproved(doc)) return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
    if (isRejected(doc)) return <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />;
    return <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300 inline-block" />;
};

// ─── Incoterm Select ──────────────────────────────────────────────────────────

const IncotermSelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
        {INCOTERMS.map((t) => (
            <option key={t.code} value={t.code}>
                {t.code} — {t.name}
            </option>
        ))}
    </select>
);

// ─── Shipment Form Fields ─────────────────────────────────────────────────────

const ShipmentFormFields = ({
    form,
    setForm,
    shipmentTypes,
}: {
    form: typeof emptyForm;
    setForm: (f: typeof emptyForm) => void;
    shipmentTypes: ShipmentType[];
}) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-4">
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Shipment Reference</label>
            <input
                type="text"
                value={form.shipment_reference}
                onChange={(e) => setForm({ ...form, shipment_reference: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 2025-SKDEVAN-001"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Brand</label>
            <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Brumate"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Incoterm</label>
            <IncotermSelect
                value={form.incoterm}
                onChange={(val) => setForm({ ...form, incoterm: val })}
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Shipment Type</label>
            <select
                value={form.shipment_type_id}
                onChange={(e) => setForm({ ...form, shipment_type_id: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="" disabled>Select type</option>
                {shipmentTypes.map((t) => (
                    <option key={t.shipment_type_id} value={t.shipment_type_id}>
                        {t.shipment_type_name}
                    </option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Broker</label>
            <input
                type="text"
                value={form.broker}
                onChange={(e) => setForm({ ...form, broker: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Grab Philippines"
            />
        </div>

        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Brand Manager</label>
            <select
                value={form.brand_manager}
                onChange={(e) => setForm({ ...form, brand_manager: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <option value="" disabled>Select Brand Manager</option>
                {BRAND_MANAGERS.map((bm) => (
                    <option key={bm} value={bm}>{bm}</option>
                ))}
            </select>
        </div>

        <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Actual Time of Arrival</label>
            <input
                type="datetime-local"
                value={form.actual_time_of_arrival}
                onChange={(e) => setForm({ ...form, actual_time_of_arrival: e.target.value })}
                className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    </div>
);

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
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-800">{docName}</p>
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

// ─── Highlight matching text ──────────────────────────────────────────────────

const Highlight = ({ text, query }: { text: string; query: string }) => {
    if (!query.trim()) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Shipments({ shipments, shipmentTypes }: Props) {
    const [activeDocPanel, setActiveDocPanel]       = useState<number | null>(null);
    const [selectedDocId, setSelectedDocId]         = useState<number | null>(null);
    const [editingShipment, setEditingShipment]     = useState<Shipment | null>(null);
    const [archivingShipment, setArchivingShipment] = useState<Shipment | null>(null);
    const [showAddModal, setShowAddModal]           = useState(false);
    const [searchQuery, setSearchQuery]             = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const [editForm, setEditForm] = useState({ ...emptyForm });
    const [addForm, setAddForm]   = useState({ ...emptyForm });

    // ── Search / filter ───────────────────────────────────────────────────────

    // const filteredShipments = useMemo(() => {
    //     const q = searchQuery.trim().toLowerCase();
    //     if (!q) return shipments;
    //     return shipments.filter((s) =>
    //         [
    //             s.shipment_reference,
    //             s.brand,
    //             s.incoterm,
    //             incotermName(s.incoterm),
    //             s.broker,
    //             s.brand_manager,
    //             s.status.status_name,
    //             s.shipment_type.shipment_type_name,
    //         ]
    //             .join(' ')
    //             .toLowerCase()
    //             .includes(q)
    //     );
    // }, [shipments, searchQuery]);

    // activeDocPanel is an index into `shipments`, keep it stable
    const activeShipment = activeDocPanel !== null ? shipments[activeDocPanel] : null;
    const selectedDoc    = activeShipment?.documents.find(d => d.shipment_doc_id === selectedDocId) ?? null;

    // ── Search / filter ───────────────────────────────────────────────────────
    const filteredShipments = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let result = shipments;
        if (q) {
            result = shipments.filter((s) =>
                [
                    s.shipment_reference,
                    s.brand,
                    s.incoterm,
                    incotermName(s.incoterm),
                    s.broker,
                    s.brand_manager,
                    s.status.status_name,
                    s.shipment_type.shipment_type_name,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(q)
            );
        }
        // Apply sorting
        if (sortConfig) {
            result = [...result].sort((a, b) => {
                let aVal: any;
                let bVal: any;
                switch (sortConfig.key) {
                    case 'shipment_reference':
                    case 'brand':
                    case 'broker':
                    case 'brand_manager':
                        aVal = a[sortConfig.key];
                        bVal = b[sortConfig.key];
                        break;
                    case 'incoterm':
                        aVal = incotermName(a.incoterm);
                        bVal = incotermName(b.incoterm);
                        break;
                    case 'actual_time_of_arrival':
                    case 'created_at':
                    case 'archived_at':
                        aVal = a[sortConfig.key] ? new Date(a[sortConfig.key]!).getTime() : 0;
                        bVal = b[sortConfig.key] ? new Date(b[sortConfig.key]!).getTime() : 0;
                        break;
                    case 'status':
                        aVal = a.status.status_name;
                        bVal = b.status.status_name;
                        break;
                    case 'shipment_type':
                        aVal = a.shipment_type.shipment_type_name;
                        bVal = b.shipment_type.shipment_type_name;
                        break;
                    default:
                        aVal = a[sortConfig.key as keyof Shipment];
                        bVal = b[sortConfig.key as keyof Shipment];
                }
                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;
                const comparison = aVal < bVal ? -1 : 1;
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }
        return result;
    }, [shipments, searchQuery, sortConfig]);

    // ── Add ──────────────────────────────────────────────────────────────────

    const openAddModal = () => {
        setAddForm({ ...emptyForm, shipment_type_id: String(shipmentTypes[0]?.shipment_type_id ?? '') });
        setShowAddModal(true);
    };

    const closeAddModal = () => setShowAddModal(false);

    const handleAddSubmit = () => {
        router.post('/shipments', addForm, { onSuccess: closeAddModal });
    };

    // ── Edit ─────────────────────────────────────────────────────────────────

    const openEditModal = (shipment: Shipment) => {
        setEditingShipment(shipment);
        setEditForm({
            shipment_reference:     shipment.shipment_reference,
            brand:                  shipment.brand,
            incoterm:               shipment.incoterm,
            actual_time_of_arrival: toDatetimeLocal(shipment.actual_time_of_arrival),
            broker:                 shipment.broker,
            brand_manager:          shipment.brand_manager,
            shipment_type_id:       String(shipment.shipment_type.shipment_type_id),
        });
    };

    const closeEditModal = () => setEditingShipment(null);

    const handleEditSubmit = () => {
        if (!editingShipment) return;
        router.put(`/shipments/${editingShipment.shipment_id}`, editForm, {
            onSuccess: closeEditModal,
        });
    };

    // ── Document status ───────────────────────────────────────────────────────

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

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                if (prev.direction === 'asc') return { key, direction: 'desc' };
                return null; // remove sort on third click
            }
            return { key, direction: 'asc' };
        });
    };

    // ── Modal wrapper ─────────────────────────────────────────────────────────

    const ModalShell = ({
        title,
        subtitle,
        onClose,
        onSubmit,
        submitLabel,
        children,
    }: {
        title: string;
        subtitle?: string;
        onClose: () => void;
        onSubmit: () => void;
        submitLabel: string;
        children: ReactNode;
    }) => (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="w-[520px] rounded-xl border bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <div>
                        <p className="text-sm font-semibold">{title}</p>
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>
                    <button onClick={onClose}>
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                </div>
                {children}
                <div className="flex justify-end gap-2 border-t px-5 py-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );

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
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" /> Add Shipment
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-4">
                {/* Tabs + Search row */}
                <div className="flex items-end justify-between border-b">
                    <div className="flex gap-6 text-sm">
                        {['All tasks', 'Completed', 'In Progress', 'Pending Approval', 'Incomplete'].map((tab) => (
                            <button
                                key={tab}
                                className={`pb-2 ${tab === 'All tasks' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search reference, brand, broker…"
                            className="w-72 rounded-md border bg-white pl-8 pr-8 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3">Select</th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('shipment_reference')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        SR#
                                        {sortConfig?.key === 'shipment_reference' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('brand')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Brand
                                        {sortConfig?.key === 'brand' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('incoterm')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Incoterm
                                        {sortConfig?.key === 'incoterm' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('actual_time_of_arrival')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        ATA
                                        {sortConfig?.key === 'actual_time_of_arrival' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('broker')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Broker
                                        {sortConfig?.key === 'broker' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('brand_manager')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        BM
                                        {sortConfig?.key === 'brand_manager' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('status')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Status
                                        {sortConfig?.key === 'status' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('created_at')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Created
                                        {sortConfig?.key === 'created_at' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('archived_at')}>
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        Archived
                                        {sortConfig?.key === 'archived_at' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3">Documents</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShipments.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                        No shipments match <span className="font-medium text-gray-700">"{searchQuery}"</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredShipments.map((s) => {
                                    // find original index for the doc panel (panel uses shipments[], not filtered)
                                    const originalIndex = shipments.indexOf(s);
                                    const approvedCount = s.documents.filter(isApproved).length;
                                    const totalCount    = s.documents.length;

                                    return (
                                        <tr key={s.shipment_id} className="border-t hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" className="h-4 w-4 rounded border" />
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">
                                                <Highlight text={s.shipment_reference} query={searchQuery} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Highlight text={s.brand} query={searchQuery} />
                                            </td>

                                            {/* Incoterm with tooltip */}
                                            <td className="px-4 py-3">
                                                <span
                                                    title={incotermName(s.incoterm)}
                                                    className="cursor-help underline decoration-dotted decoration-gray-400 underline-offset-2"
                                                >
                                                    <Highlight text={s.incoterm} query={searchQuery} />
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">{formatDate(s.actual_time_of_arrival)}</td>
                                            <td className="px-4 py-3">
                                                <Highlight text={s.broker} query={searchQuery} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Highlight text={s.brand_manager} query={searchQuery} />
                                            </td>
                                            <td className="px-4 py-3 text-center">{statusIcon(s.status.status_name)}</td>
                                            <td className="px-4 py-3">{formatDate(s.created_at)}</td>
                                            <td className="px-4 py-3">{formatDate(s.archived_at)}</td>

                                            {/* Documents */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-medium ${approvedCount === totalCount && totalCount > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {approvedCount}/{totalCount}
                                                    </span>
                                                    <button
                                                        onClick={() => { setActiveDocPanel(originalIndex); setSelectedDocId(null); }}
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
                                                    <button
                                                        onClick={() => openEditModal(s)}
                                                        className="flex items-center gap-1 rounded-md border border-yellow-500 px-2 py-1 text-xs text-yellow-600 hover:bg-yellow-50"
                                                    >
                                                        <Pencil className="h-3 w-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setArchivingShipment(s)}
                                                        disabled={!!s.archived_at}
                                                        className="flex items-center gap-1 rounded-md border border-orange-500 px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <Archive className="h-3 w-3" /> {s.archived_at ? 'Archived' : 'Archive'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        <strong className="text-foreground">Total Shipments:</strong>{' '}
                        {filteredShipments.length}
                        {searchQuery && filteredShipments.length !== shipments.length && (
                            <span className="ml-1 text-xs">
                                (filtered from {shipments.length})
                            </span>
                        )}
                    </span>
                </div>
            </div>

            {/* ── Add Modal ────────────────────────────────────────────────── */}
            {showAddModal && (
                <ModalShell
                    title="Add Shipment"
                    onClose={closeAddModal}
                    onSubmit={handleAddSubmit}
                    submitLabel="Create Shipment"
                >
                    <ShipmentFormFields
                        form={addForm}
                        setForm={setAddForm}
                        shipmentTypes={shipmentTypes}
                    />
                </ModalShell>
            )}

            {/* ── Edit Modal ───────────────────────────────────────────────── */}
            {editingShipment !== null && (
                <ModalShell
                    title="Edit Shipment"
                    subtitle={editingShipment.shipment_reference}
                    onClose={closeEditModal}
                    onSubmit={handleEditSubmit}
                    submitLabel="Save Changes"
                >
                    <ShipmentFormFields
                        form={editForm}
                        setForm={setEditForm}
                        shipmentTypes={shipmentTypes}
                    />
                </ModalShell>
            )}

            {archivingShipment !== null && (
                <ModalShell
                    title="Archive Shipment"
                    subtitle={`Confirm archive for ${archivingShipment.shipment_reference}`}
                    onClose={() => setArchivingShipment(null)}
                    onSubmit={() => {
                        router.patch(`/shipments/${archivingShipment.shipment_id}/archive`, undefined, {
                            onSuccess: () => setArchivingShipment(null),
                        });
                    }}
                    submitLabel="Archive"
                >
                    <div className="px-5 py-4 text-sm text-gray-600">
                        Are you sure you want to archive this shipment? This action can be reverted later.
                    </div>
                </ModalShell>
            )}

            {/* ── Document Dialog ──────────────────────────────────────────── */}
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
                                    const fullName   = doc.custom_doc.doc_full_name;
                                    const isSelected = selectedDocId === doc.shipment_doc_id;

                                    return (
                                        <li
                                            key={doc.shipment_doc_id}
                                            onClick={() => setSelectedDocId(doc.shipment_doc_id)}
                                            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                                                isSelected ? 'bg-purple-50 text-purple-700' : 'hover:bg-muted/50'
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

                            {/* Approve / Reject */}
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