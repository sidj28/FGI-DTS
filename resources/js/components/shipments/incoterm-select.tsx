import { INCOTERMS } from '@/pages/shipments/constants';

export const IncotermSelect = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        {INCOTERMS.map((t) => (
            <option key={t.code} value={t.code}>
                {t.code} — {t.name}
            </option>
        ))}
    </select>
);