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

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('All tasks');
    const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date } | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, dateRange, searchQuery]);

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
        const statuses: ('completed' | 'pending' | 'warning' | 'error')[] = ['completed', 'pending', 'warning', 'error'];
        const status = statuses[i % 4];
        const date = new Date(2026, Math.floor(i / 33), (i % 28) + 1).toISOString().split('T')[0];

        return {
            date,
            ref: `2025-SKDEVAN-${408 + i}`,
            incoterm: ['EXW', 'FOB', 'CIF', 'DDP', 'FCA'][i % 5],
            status,
            docs: {
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
            }
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
        switch (type) {
            case 'ok':
            case 'completed': return <div className="size-5 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 border border-green-100 dark:border-green-800/30"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>;
            case 'error': return <div className="size-5 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-800/30"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>;
            case 'warning': return <div className="size-5 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-800/30 border-dashed"><div className="size-2.5 rounded-full border-2 border-amber-400 border-dotted animate-spin-slow" /></div>;
            case 'pending': return <div className="size-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-800/30"><div className="size-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" /></div>;
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
                                        <Button variant="ghost" size="icon" className="size-8 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all shadow-none">
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
