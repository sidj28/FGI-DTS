import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { type ChartDataPoint } from '@/pages/reports/types';

export function CompletenessChart({ data }: { data: ChartDataPoint[] }) {
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-bold text-slate-700 mb-4">Completeness Rate over Time</p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="documents" stroke="#ef4444" dot={{ r: 3 }} strokeWidth={2} name="Documents" />
                    <Line yAxisId="right" type="monotone" dataKey="shipments" stroke="#3b82f6" dot={{ r: 3 }} strokeWidth={2} name="Shipments" />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-red-400" /> Shipments Completeness Rate</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-blue-400" /> Documents Completeness Rate</span>
            </div>
        </div>
    );
}