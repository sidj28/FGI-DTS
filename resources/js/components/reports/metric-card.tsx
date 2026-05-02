import { FileBarChart2 } from 'lucide-react';

interface Props {
    label: string;
    value: number;
    percentage: number;
    total: number;
}

export function MetricCard({ label, value, percentage, total }: Props) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 shadow-sm px-5 py-4 flex-1">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <FileBarChart2 className="h-3.5 w-3.5 text-blue-400" />
                {label}
            </div>
            <p className="text-[32px] font-black text-slate-900 dark:text-blue-400 tracking-tighter leading-none">{value}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                <span className="text-slate-600 dark:text-slate-300">{percentage}%</span> of all {total} shipments
            </p>
        </div>
    );
}