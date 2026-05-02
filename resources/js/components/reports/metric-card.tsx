import { FileBarChart2 } from 'lucide-react';

interface Props {
    label: string;
    value: number;
    percentage: number;
    total: number;
}

export function MetricCard({ label, value, percentage, total }: Props) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 flex-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
                <FileBarChart2 className="h-4 w-4 text-blue-400" />
                {label}
            </div>
            <p className="text-3xl font-black text-slate-800">{value}</p>
            <p className="text-xs text-slate-400">
                <span className="font-bold text-slate-600">{percentage}%</span> of all {total} shipments
            </p>
        </div>
    );
}