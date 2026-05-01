import { Head } from '@inertiajs/react';
import {
    Search,
    Calendar,
    Download,
    Ship,
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    X,
    FileText,
    Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AccuracyChart } from '@/components/dashboard/accuracy-chart';
import { CompletionChart } from '@/components/dashboard/completion-chart';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

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

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('All tasks');
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date } | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeShipmentIndex, setActiveShipmentIndex] = useState<number | null>(null);
    const [selectedDocKey, setSelectedDocKey] = useState<string | null>(null);
    const itemsPerPage = 20;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, dateRange, searchQuery]);

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (activeShipmentIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [activeShipmentIndex]);

    const stats = {
        active: 579,
        uploaded: 50,
        invalid: 30,
        missing: 6,
        archived: 3,
    };

    const columns = [
        { key: 'sh', label: 'SH' },
        { key: 'ssdt', label: 'SSDT' },
        { key: 'fan', label: 'FAN' },
        { key: 'tan', label: 'TAN' },
        { key: 'sad', label: 'SAD' },
        { key: 'bl', label: 'BL' },
        { key: 'fe', label: 'FE' },
        { key: 'iv', label: 'IV' },
        { key: 'pl', label: 'PL' },
        { key: 'ci', label: 'CI' },
        { key: 'dh', label: 'DH' },
    ];

    const shipments = Array.from({ length: 100 }).map((_, i) => {
        const date = new Date(2026, Math.floor(i / 33), (i % 28) + 1).toISOString().split('T')[0];
        
        const docs = {
            sh: i % 10 === 0 ? 'error' : 'ok',
            ssdt: i % 15 === 0 ? 'pending' : 'ok',
            fan: i % 8 === 0 ? 'warning' : 'ok',
            tan: 'ok',
            sad: 'ok',
            bl: i % 12 === 0 ? 'pending' : 'ok',
            fe: 'ok',
            iv: 'ok',
            pl: 'ok',
            ci: 'ok',
            dh: i % 20 === 0 ? 'warning' : 'ok',
        };

        // Derive status from docs
        const docStatuses = Object.values(docs);
        let status: 'completed' | 'pending' | 'warning' | 'error' = 'completed';
        
        if (docStatuses.includes('error')) {
            status = 'error';
        } else if (docStatuses.includes('warning')) {
            status = 'warning';
        } else if (docStatuses.includes('pending')) {
            status = 'pending';
        }

        return {
            date,
            ref: `2025-SKDEVAN-${408 + i}`,
            incoterm: ['EXW', 'FOB', 'CIF', 'DDP', 'FCA'][i % 5],
            status,
            docs
        };
    });

    const filteredShipments = shipments.filter(shipment => {
        // Search Filter
        if (searchQuery && !shipment.ref.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Status Tab Filter
        if (activeTab !== 'All tasks') {
            const tabMapping: Record<string, string> = {
                'Completed': 'completed',
                'In Progress': 'warning',
                'Pending': 'pending',
                'Incomplete': 'error'
            };
            if (shipment.status !== tabMapping[activeTab]) return false;
        }

        // Date Range Filter
        if (!dateRange?.from) return true;
        const sDate = new Date(shipment.date);
        const from = dateRange.from;
        const to = dateRange.to || dateRange.from;
        return sDate >= from && sDate <= to;
    });

    const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
    const paginatedShipments = filteredShipments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const StatusIcon = ({ type }: { type: string }) => {
        switch (type.toLowerCase()) {
            case 'ok':
            case 'completed': return <div className="size-5 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 border border-green-100 dark:border-green-800/30"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>;
            case 'error': return <div className="size-5 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-800/30"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>;
            case 'warning': return <div className="size-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-800/30 border-dashed"><div className="size-2.5 rounded-full border-2 border-amber-400 border-dotted animate-spin-slow" /></div>;
            case 'pending':
            case 'loading': return <div className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-800/30"><div className="size-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" /></div>;
            default: return null;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F9FAFB] dark:bg-[#030712] p-6 font-sans text-slate-900 dark:text-slate-100">
            <Head title="Dashboard" />


            {/* Sophisticated Totals Section */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Totals</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64 mr-2">
                            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                className="bg-white dark:bg-slate-900/40 pl-9 h-8 border-slate-200 dark:border-slate-800 rounded-lg text-[10px]"
                                placeholder="Search Reference..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <DatePickerWithRange onRangeChange={setDateRange} />
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                            <Download className="size-3.5" /> Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column: Stacked Mini-Stats */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                        {/* Completion Rate Chart */}
                        <CompletionChart />

                        {/* Active Shipments Mini Card */}
                        <div className="bg-white dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center h-[130px] shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Ship className="size-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Shipments</span>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">900</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">out of 1100</p>
                        </div>
                    </div>

                    {/* Right Column: Combined Accuracy & Docs */}
                    <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center shadow-sm">
                        {/* Accuracy Rate Donut */}
                        <div className="w-[50%] min-w-0 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800/60 p-6">
                            <div className="w-full max-w-[280px]">
                                <AccuracyChart data={stats} />
                            </div>
                        </div>

                        {/* Document List */}
                        <div className="flex-1 pl-6 flex flex-col justify-center pr-6">
                            {[
                                { label: 'Active Documents', value: stats.active },
                                { label: 'Uploaded Documents', value: stats.uploaded },
                                { label: 'Invalid Documents', value: stats.invalid },
                                { label: 'Missing Documents', value: stats.missing },
                                { label: 'Archived Documents', value: stats.archived },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors px-2 rounded">
                                    <span className="text-xl font-black tracking-tighter text-[#1e293b] dark:text-blue-400">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compressed Table Area */}
            <div className="flex flex-col bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm mb-8">
                <div className="px-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-6">
                        {['All tasks', 'Completed', 'In Progress', 'Pending', 'Incomplete'].map((tab) => (
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
                    <div className="flex items-center gap-2 -mt-1 sm:mb-0">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold px-3 rounded-md mb-2 gap-1">
                            <Download className="size-3" /> Export
                        </Button>
                        <div className="flex border-l border-slate-200 dark:border-slate-800 ml-2 pl-2 mb-2">
                            <Button variant="ghost" size="icon" className="size-7 text-slate-300"><ChevronLeft className="size-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="size-7 text-slate-600"><ChevronRight className="size-3.5" /></Button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">ATA</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">SR#</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Incoterm</th>
                                {columns.map(col => (
                                    <th key={col.key} className="px-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">{col.label}</th>
                                ))}
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Status</th>
                                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {paginatedShipments.map((shipment, index) => (
                                <tr key={index} className="border-b border-slate-50 dark:border-slate-800/40 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                    <td className="py-3 px-6 text-[11px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{new Date(shipment.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}</td>
                                    <td className="px-6 py-3 text-xs font-black text-blue-900 dark:text-blue-300 tracking-tighter">{shipment.ref}</td>
                                    <td className="px-6 py-3 text-[11px] font-bold text-slate-500">{shipment.incoterm}</td>
                                    {columns.map(col => (
                                        <td key={col.key} className="px-2 py-3">
                                            <div className="flex justify-center">
                                                <StatusIcon type={shipment.docs[col.key as keyof typeof shipment.docs]} />
                                            </div>
                                        </td>
                                    ))}
                                    <td className="px-6 py-3">
                                        <div className="flex justify-center">
                                            <StatusIcon type={shipment.status} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => {
                                                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                                                setActiveShipmentIndex(globalIndex);
                                                setSelectedDocKey(null);
                                            }}
                                            className="size-8 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all shadow-none"
                                        >
                                            <Eye className="size-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing <span className="text-blue-600 dark:text-blue-400">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredShipments.length)}</span> of {filteredShipments.length} shipments
                        </span>
                        <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Page <span className="text-slate-900 dark:text-slate-100 font-black">{currentPage}</span> of {totalPages}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="size-3.5" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                // Simple sliding window for pagination if totalPages > 5
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={cn(
                                            "size-8 rounded-lg text-[11px] font-bold transition-all",
                                            currentPage === pageNum
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg border-slate-200 dark:border-slate-800 disabled:opacity-30"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Document Dialog — Premium Glassmorphic */}
            {activeShipmentIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setActiveShipmentIndex(null)}
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
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[140px]">{filteredShipments[activeShipmentIndex]?.ref}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="size-7 text-slate-400" onClick={() => setActiveShipmentIndex(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <ul className="flex flex-col gap-1 overflow-y-auto p-3 flex-1 custom-scrollbar">
                                {Object.entries(filteredShipments[activeShipmentIndex]?.docs || {}).map(([key, status]) => {
                                    const isSelected = selectedDocKey === key;
                                    const label = columns.find(c => c.key === key)?.label || key;

                                    return (
                                        <li
                                            key={key}
                                            onClick={() => setSelectedDocKey(key)}
                                            className={cn(
                                                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
                                                isSelected
                                                    ? "bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
                                                    : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <StatusIcon type={status as string} />
                                            <div className="flex flex-col min-w-0">
                                                <span className={cn(
                                                    "text-[10px] font-bold leading-tight truncate transition-colors",
                                                    isSelected ? "text-slate-900 dark:text-white" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                                                )}>
                                                    {label}
                                                </span>
                                            </div>
                                            {isSelected && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-l-full" />}
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="border-t border-slate-100 dark:border-slate-800/60 px-5 py-4 bg-white/50 dark:bg-slate-900/40">
                                <Button
                                    onClick={() => setActiveShipmentIndex(null)}
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
                                        {selectedDocKey ? (columns.find(c => c.key === selectedDocKey)?.label || selectedDocKey) : 'PREVIEW PORTAL'}
                                    </h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Digital Document Verification</p>
                                </div>
                                {selectedDocKey && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800">
                                            <Printer className="size-3 mr-1" /> Print
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-900/20 custom-scrollbar">
                                {selectedDocKey ? (
                                    <div className="max-w-2xl mx-auto">
                                        <MockDocumentPreview
                                            docName={columns.find(c => c.key === selectedDocKey)?.label || selectedDocKey}
                                            brand={filteredShipments[activeShipmentIndex]?.ref}
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Overview',
            href: dashboard(),
        },
    ],
};
