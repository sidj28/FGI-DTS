import { router } from '@inertiajs/react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { type FilterOptions, type ActiveFilters } from '@/pages/reports/types';

interface Props {
    filterOptions: FilterOptions;
    activeFilters: ActiveFilters;
}

export function FilterBar({ filterOptions, activeFilters }: Props) {
    const [brand, setBrand] = useState(activeFilters.brand ?? '');
    const [brandManager, setBrandManager] = useState(activeFilters.brandManager ?? '');
    const [serviceType, setServiceType] = useState(activeFilters.serviceType ?? '');
    const [dateFrom, setDateFrom] = useState(activeFilters.dateFrom ?? '');
    const [dateTo, setDateTo] = useState(activeFilters.dateTo ?? '');

    const apply = () => {
        router.get('/reports', {
            brand: brand || undefined,
            brand_manager: brandManager || undefined,
            service_type: serviceType || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, { preserveState: true });
    };

    const reset = () => {
        setBrand(''); setBrandManager(''); setServiceType('');
        setDateFrom(''); setDateTo('');
        router.get('/reports');
    };

    return (
        <div className="flex flex-wrap items-end gap-3">
            {/* Date range */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none" />
            </div>

            {/* Brand */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand</label>
                <select value={brand} onChange={e => setBrand(e.target.value)}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none">
                    <option value="">All Brands</option>
                    {filterOptions.brands.map(b => <option key={b}>{b}</option>)}
                </select>
            </div>

            {/* Brand Manager */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Manager</label>
                <select value={brandManager} onChange={e => setBrandManager(e.target.value)}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none">
                    <option value="">All Brand Managers</option>
                    {filterOptions.brandManagers.map(b => <option key={b}>{b}</option>)}
                </select>
            </div>

            {/* Service Type */}
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</label>
                <select value={serviceType} onChange={e => setServiceType(e.target.value)}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-3 py-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none">
                    <option value="">All Types</option>
                    {filterOptions.serviceTypes.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            <div className="flex gap-2 ml-auto">
                <button onClick={apply}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-[11px] font-bold text-white hover:bg-blue-700 shadow-sm transition-colors">
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Apply Filters
                </button>
                <button onClick={reset}
                    className="flex items-center gap-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40 px-4 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors">
                    Reset Filters <RotateCcw className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}