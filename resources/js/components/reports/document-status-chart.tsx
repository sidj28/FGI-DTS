import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { type DocumentStatusDist } from '@/pages/reports/types';

export function DocumentStatusChart({ data }: { data: DocumentStatusDist[] }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-700 mb-2">Distribution of Document Status</p>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                        {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                {data.map((d) => (
                    <span key={d.name} className="flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span>{d.name}</span>
                        <span className="ml-auto text-slate-400">{d.value.toLocaleString()}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}