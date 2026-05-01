import { CheckCircle, FileText, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Shipment, type ShipmentDocument } from '@/pages/shipments/types';
import { isApproved, isRejected } from '@/pages/shipments/helpers';
import { DocStatusIndicator } from './doc-status-indicator';
import { MockDocumentPreview } from './mock-document-preview';

interface DocumentDialogProps {
    activeShipment: Shipment;
    selectedDocId: number | null;
    setSelectedDocId: (id: number | null) => void;
    closePanel: () => void;
    handleStatusUpdate: (shipmentDocId: number, statusId: number) => void;
}

export const DocumentDialog = ({
    activeShipment,
    selectedDocId,
    setSelectedDocId,
    closePanel,
    handleStatusUpdate,
}: DocumentDialogProps) => {
    const selectedDoc: ShipmentDocument | null =
        activeShipment.documents.find((d) => d.shipment_doc_id === selectedDocId) ?? null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm"
            onClick={closePanel}
        >
            <div
                className="flex h-[600px] w-[850px] rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Left panel — document list */}
                <div className="flex w-64 flex-shrink-0 flex-col border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/20">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 px-5 py-4">
                        <div>
                            <p className="text-xs font-black tracking-tighter">DOCUMENTS</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase truncate">
                                {activeShipment.brand}
                            </p>
                        </div>
                        <button onClick={closePanel}>
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>

                    <ul className="flex flex-col gap-1 overflow-y-auto p-3 flex-1">
                        {activeShipment.documents.map((doc) => {
                            const isSelected = selectedDocId === doc.shipment_doc_id;
                            return (
                                <li
                                    key={doc.shipment_doc_id}
                                    onClick={() => setSelectedDocId(doc.shipment_doc_id)}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all',
                                        isSelected
                                            ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60'
                                            : 'hover:bg-white/50'
                                    )}
                                >
                                    <DocStatusIndicator doc={doc} />
                                    <span
                                        className={cn(
                                            'text-[10px] font-bold truncate',
                                            isSelected
                                                ? 'text-slate-900 dark:text-white'
                                                : 'text-slate-500'
                                        )}
                                    >
                                        {doc.custom_doc.doc_full_name}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t border-slate-100 dark:border-slate-800/60 px-5 py-4">
                        <button
                            onClick={closePanel}
                            className="w-full rounded-lg bg-slate-900 dark:bg-white py-2 text-[10px] font-black uppercase text-white dark:text-slate-900"
                        >
                            Close Portal
                        </button>
                    </div>
                </div>

                {/* Right panel — preview */}
                <div className="flex flex-1 flex-col bg-white dark:bg-slate-950">
                    <div className="border-b px-6 py-4">
                        <h3 className="text-sm font-black">
                            {selectedDoc ? selectedDoc.custom_doc.doc_full_name : 'PREVIEW PORTAL'}
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-900/20">
                        {selectedDoc ? (
                            <MockDocumentPreview
                                docName={selectedDoc.custom_doc.doc_full_name}
                                brand={activeShipment.brand}
                            />
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-300">
                                <FileText className="size-10" />
                                <p className="text-[10px] font-black uppercase">Select a document</p>
                            </div>
                        )}
                    </div>

                    {selectedDoc && (
                        <div className="border-t px-6 py-4 flex justify-between bg-slate-50 dark:bg-slate-900/40">
                            <div className="text-[10px] font-bold text-slate-400">
                                Current:{' '}
                                <span
                                    className={cn(
                                        isApproved(selectedDoc)
                                            ? 'text-green-600'
                                            : isRejected(selectedDoc)
                                            ? 'text-red-500'
                                            : 'text-blue-500'
                                    )}
                                >
                                    {selectedDoc.current_status?.status?.status_name || 'No status'}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={isApproved(selectedDoc)}
                                    onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 1)}
                                    className="rounded-lg border border-green-500 px-3 py-1 text-[10px] font-bold text-green-600 disabled:opacity-40"
                                >
                                    <CheckCircle className="h-3 w-3 inline mr-1" /> Approve
                                </button>
                                <button
                                    disabled={isRejected(selectedDoc)}
                                    onClick={() => handleStatusUpdate(selectedDoc.shipment_doc_id, 3)}
                                    className="rounded-lg border border-red-500 px-3 py-1 text-[10px] font-bold text-red-600 disabled:opacity-40"
                                >
                                    <XCircle className="h-3 w-3 inline mr-1" /> Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};