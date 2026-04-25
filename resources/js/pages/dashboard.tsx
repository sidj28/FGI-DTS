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
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('All tasks');

    const shipments = [
        { date: '09/25/2003', ref: '2025-SKDEVAN-411', brand: 'Boffi', incoterm: 'EXW', type: 'Airplane', broker: 'LBC', status: 'Completed' },
        { date: '12/12/2003', ref: '2025-ADBBBFFCTGITVAN-01', brand: 'ADO', incoterm: 'FCA', type: 'Ship', broker: 'Grab', status: 'Incomplete' },
        { date: '05/23/2002', ref: '2025-HDVNCL-01', brand: 'Fendi Casa', incoterm: 'FCA', type: 'Container', broker: 'Lalamove', status: 'In Progress' },
        { date: '04/17/2004', ref: '2025-SKDEVAN-409', brand: 'Louis Poulsen', incoterm: 'FOB', broker: 'Lalamove', type: 'Courier', status: 'Pending' },
        { date: '04/27/2003', ref: '2025-BXCHAIR-01', brand: 'Orama', incoterm: 'EXW', type: 'Courier', broker: 'Grab', status: 'Archived' },
        { date: '04/27/2003', ref: '2025-BXCHAIR-02', brand: 'B&B Italia', incoterm: 'EXW', type: 'Courier', broker: 'Grab', status: 'Completed' },
    ];

    return (
        <div className="flex h-full flex-col bg-[#F9FAFB] dark:bg-[#030712] p-4 font-sans text-slate-900 dark:text-slate-100">
            <Head title="Dashboard" />
            
            {/* Minimal Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Overview</h2>

                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
                    <Input 
                        className="bg-white dark:bg-slate-900/40 pl-9 h-9 border-slate-200 dark:border-slate-800 rounded-lg text-xs" 
                        placeholder="Quick search..."
                    />
                </div>
            </div>

            {/* Sophisticated Totals Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Totals</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                            17 April 2026 - 27 April 2025 <Calendar className="size-3.5 text-slate-400" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                            Last 30 Days <Calendar className="size-3.5 text-slate-400" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold border-slate-200 dark:border-slate-800 rounded-lg gap-2 px-3 bg-white dark:bg-slate-900/50">
                            <Download className="size-3.5" /> Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column: Stacked Mini-Stats */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                        {/* Completion Rate Half-Circle */}
                        <div className="bg-white dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center h-[140px] shadow-sm">
                            <div className="relative size-32">
                                <svg viewBox="0 0 100 55" className="size-full">
                                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="12" strokeLinecap="round" />
                                    {/* Multi-colored Arc Segments */}
                                    <path d="M 10 50 A 40 40 0 0 1 30 16" fill="none" stroke="#22C55E" strokeWidth="12" /> {/* Green */}
                                    <path d="M 30 16 A 40 40 0 0 1 50 10" fill="none" stroke="#EF4444" strokeWidth="12" /> {/* Red */}
                                    <path d="M 50 10 A 40 40 0 0 1 70 16" fill="none" stroke="#3B82F6" strokeWidth="12" /> {/* Blue */}
                                    <path d="M 70 16 A 40 40 0 0 1 85 36" fill="none" stroke="#EAB308" strokeWidth="12" /> {/* Yellow */}
                                </svg>
                                <div className="absolute bottom-2 inset-x-0 flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">75%</span>
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Completion Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Shipments Mini Card */}
                        <div className="bg-white dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center h-[140px] shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Ship className="size-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Shipments</span>
                            </div>
                            <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">900</h4>
                            <p className="text-xs text-slate-400 font-medium">out of 1100</p>
                        </div>
                    </div>

                    {/* Right Column: Combined Accuracy & Docs */}
                    <div className="col-span-12 lg:col-span-9 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center p-6 shadow-sm">
                        {/* Accuracy Rate Donut */}
                        <div className="w-1/3 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800/60">
                            <div className="relative size-40">
                                <svg viewBox="0 0 100 100" className="size-full">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="12" />
                                    {/* Multi-colored donut segments */}
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#EAB308" strokeWidth="12" strokeDasharray="66 263.89" strokeDashoffset="0" /> {/* Yellow */}
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="66 263.89" strokeDashoffset="-66" /> {/* Blue */}
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray="33 263.89" strokeDashoffset="-132" /> {/* Red */}
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray="66 263.89" strokeDashoffset="-165" /> {/* Green */}
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">75%</span>
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Accuracy Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* Document List */}
                        <div className="flex-1 pl-10 flex flex-col justify-center">
                            {[
                                { label: 'Active Documents', value: 579, color: 'text-slate-900 dark:text-white' },
                                { label: 'Uploaded Documents', value: 50, color: 'text-slate-900 dark:text-white' },
                                { label: 'Invalid Documents', value: 30, color: 'text-slate-900 dark:text-white' },
                                { label: 'Missing Documents', value: 6, color: 'text-slate-900 dark:text-white' },
                                { label: 'Archived Documents', value: 3, color: 'text-slate-900 dark:text-white' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors px-2 rounded">
                                    <span className="text-3xl font-black tracking-tighter text-[#1e293b] dark:text-blue-400">{stat.value}</span>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Compressed Table Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900/30 rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
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
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold px-3 rounded-md gap-1">
                            <Download className="size-3" /> Export
                        </Button>
                        <div className="flex border-l border-slate-200 dark:border-slate-800 ml-2 pl-2">
                            <Button variant="ghost" size="icon" className="size-7 text-slate-300"><ChevronLeft className="size-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="size-7 text-slate-600"><ChevronRight className="size-3.5" /></Button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-0">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Date</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Reference</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-left">Brand</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Incoterm</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Type</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Broker</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">Status</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {shipments.map((ship, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group cursor-default">
                                    <td className="px-4 py-2.5 text-[11px] font-medium text-slate-500">{ship.date}</td>
                                    <td className="px-4 py-2.5 text-[11px] font-bold text-blue-900 dark:text-blue-300 tracking-tight">{ship.ref}</td>
                                    <td className="px-4 py-2.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">{ship.brand}</td>
                                    <td className="px-4 py-2.5 text-[10px] font-bold text-slate-500 text-center">{ship.incoterm}</td>
                                    <td className="px-4 py-2.5 text-[10px] font-medium text-slate-500 text-center capitalize">{ship.type}</td>
                                    <td className="px-4 py-2.5 text-[10px] font-medium text-slate-500 text-center">{ship.broker}</td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex justify-center">
                                            <Badge 
                                                variant="outline" 
                                                className={cn(
                                                    "h-5 rounded px-2 text-[9px] font-bold uppercase tracking-tight border-none",
                                                    ship.status === 'Completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
                                                    ship.status === 'Incomplete' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                                                    ship.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                                                    ship.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                                                    'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                                )}
                                            >
                                                {ship.status}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <Button variant="ghost" size="icon" className="size-6 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                                            <Eye className="size-3" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Visual Footer/Pager info */}
                <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium italic">Showing 1-20 of 142 total shipments</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 mr-2">Page 1 of 8</span>
                        {[1, 2, 3].map(p => (
                            <button key={p} className={cn("size-5 rounded text-[9px] font-bold transition-all", p === 1 ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800")}>{p}</button>
                        ))}
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
