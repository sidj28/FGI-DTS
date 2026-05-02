import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { type ChartDataPoint } from '@/pages/reports/types';

export function CompleteVsIncompleteChart({ data }: { data: ChartDataPoint[] }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-700 mb-4">Complete vs Incomplete Shipments</p>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} barSize={14}>
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#93c5fd" name="Completed" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="incomplete" fill="#1d4ed8" name="Incomplete" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-300" /> Completed</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-blue-700" /> Incomplete</span>
            </div>
        </div>
    );
}