import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Download, Eye, FileText, Package, Pencil, Printer, Trash2, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shipments', href: '/shipments' },
];

const allDocuments = [
    'Bill of Lading',
    'Commercial Invoice',
    'Packing List',
    'Certificate of Origin',
    'Import Permit',
    'Insurance Certificate',
    'Arrival Notice',
    'Customs Declaration',
    'Delivery Order',
    'Inspection Certificate',
    'Tax Invoice',
];

const shipments = [
    { id: '2025-SKDEVAN-408', brand: 'Brumate', incoterm: 'EXW', ata: '09/25/03', broker: 'Grab Philippines', bm: 'Matthew Andre Corral', status: 'processing', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 3 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Fendi Casa', incoterm: 'FCA', ata: '12/120/03', broker: 'Lalamove', bm: 'Shannen Salvatera', status: 'processing', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 1 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Hunter Douglas', incoterm: 'FCA', ata: '05/27/03', broker: 'Angkas', bm: 'Terrenz Cubacub', status: 'processing', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 4 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'TechnoGym', incoterm: 'EXW', ata: '05/23/02', broker: 'MoveIt', bm: 'Gavin Lorenzo Castro', status: 'pending', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 2 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Philips Personal Care', incoterm: 'FOB', ata: '12/22/03', broker: 'Joyride', bm: 'Jaslein Zynah Dueñas', status: 'pending', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 5 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Villeroy & Boch', incoterm: 'FCA', ata: '04/28/04', broker: 'Grab Philippines', bm: 'Christian Jerard Abella', status: 'completed', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name) => ({ name, checked: true }))
    },
    { id: '2025-SKDEVAN-408', brand: 'B&B Italia', incoterm: 'FOB', ata: '04/04/04', broker: 'Joyride', bm: 'Angela Luisse Briones', status: 'completed', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 8 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'DMC', incoterm: 'EXW', ata: '04/17/04', broker: 'LBC', bm: 'Reich Alexandria Balubal', status: 'completed', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name, i) => ({ name, checked: i < 6 }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Boffi', incoterm: 'EXW', ata: '12/29/03', broker: 'MoveIt', bm: 'Anvil Dumaual', status: 'completed', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name) => ({ name, checked: true }))
    },
    { id: '2025-SKDEVAN-408', brand: 'Philips Personal Care', incoterm: 'EXW', ata: '05/11/04', broker: 'Grab Philippines', bm: 'XXXXXXXX', status: 'failed', created: '04/24/26', archived: '04/24/26',
        documents: allDocuments.map((name) => ({ name, checked: false }))
    },
];

const statusIcon = (status: string) => {
    if (status === 'processing') return <span className="text-blue-500 text-lg">✳</span>;
    if (status === 'pending') return <span className="text-yellow-500 text-lg">◎</span>;
    if (status === 'completed') return <span className="text-green-500 text-lg">✔</span>;
    if (status === 'failed') return <span className="text-red-500 text-lg">✘</span>;
};

const MockDocumentPreview = ({ docName, brand }: { docName: string; brand: string }) => (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-inner text-xs text-gray-700 font-mono h-full">
        {/* Mock letterhead */}
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

        {/* Title */}
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-800">
            {docName}
        </p>

        {/* Mock content lines */}
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

        {/* Mock footer */}
        <div className="mt-auto border-t pt-2 text-gray-300 text-center">
            — MOCK PREVIEW — NOT AN OFFICIAL DOCUMENT —
        </div>
    </div>
);

export default function Shipments() {
    const [activeDocPanel, setActiveDocPanel] = useState<number | null>(null);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);

    const activeShipment = activeDocPanel !== null ? shipments[activeDocPanel] : null;

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
                                const checkedCount = s.documents.filter(d => d.checked).length;
                                const totalCount = s.documents.length;

                                return (
                                    <tr key={i} className="border-t hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <input type="checkbox" defaultChecked={s.status !== 'failed'} className="h-4 w-4 rounded border" />
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                                        <td className="px-4 py-3">{s.brand}</td>
                                        <td className="px-4 py-3">{s.incoterm}</td>
                                        <td className="px-4 py-3">{s.ata}</td>
                                        <td className="px-4 py-3">{s.broker}</td>
                                        <td className="px-4 py-3">{s.bm}</td>
                                        <td className="px-4 py-3 text-center">{statusIcon(s.status)}</td>
                                        <td className="px-4 py-3">{s.created}</td>
                                        <td className="px-4 py-3">{s.archived}</td>

                                        {/* Documents Column */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-medium ${checkedCount === totalCount ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {checkedCount}/{totalCount}
                                                </span>
                                                <button
                                                    onClick={() => { setActiveDocPanel(i); setPreviewDoc(null); }}
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
                    <span><strong className="text-foreground">Documents Selected:</strong> 9 out of 1000</span>
                </div>
            </div>

            {/* Document Dialog */}
            {activeShipment !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => { setActiveDocPanel(null); setPreviewDoc(null); }}
                >
                    <div
                        className="flex h-[520px] w-[720px] rounded-xl border bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Left — Checklist */}
                        <div className="flex w-56 flex-shrink-0 flex-col border-r">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold">Documents</p>
                                    <p className="text-xs text-muted-foreground">{activeShipment.brand}</p>
                                </div>
                                <button onClick={() => { setActiveDocPanel(null); setPreviewDoc(null); }}>
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-1 overflow-y-auto p-3 flex-1">
                                {activeShipment.documents.map((doc, di) => (
                                    <li
                                        key={di}
                                        onClick={() => setPreviewDoc(doc.name)}
                                        className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                                            previewDoc === doc.name
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'hover:bg-muted/50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={doc.checked}
                                            readOnly
                                            className="h-4 w-4 rounded border"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <FileText className={`h-3.5 w-3.5 flex-shrink-0 ${doc.checked ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={`text-xs leading-tight ${doc.checked ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {doc.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t px-4 py-3 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {activeShipment.documents.filter(d => d.checked).length} of {activeShipment.documents.length}
                                </span>
                                <button
                                    onClick={() => { setActiveDocPanel(null); setPreviewDoc(null); }}
                                    className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Right — Preview */}
                        <div className="flex flex-1 flex-col">
                            <div className="border-b px-4 py-3">
                                <p className="text-sm font-semibold text-gray-700">
                                    {previewDoc ?? 'Select a document to preview'}
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {previewDoc ? (
                                    <MockDocumentPreview docName={previewDoc} brand={activeShipment.brand} />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-300">
                                        <FileText className="h-16 w-16" />
                                        <p className="text-sm">Click a document on the left to preview</p>
                                    </div>
                                )}
                            </div>
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