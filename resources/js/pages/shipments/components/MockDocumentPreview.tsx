export const MockDocumentPreview = ({
    docName,
    brand,
}: {
    docName: string;
    brand: string;
}) => (
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
                <div
                    key={label}
                    className="flex justify-between border-b border-dashed border-slate-100 dark:border-slate-800/40 pb-1.5"
                >
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