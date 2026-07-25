export default function Loading({ title }: { title?: string }) {
    return (
        <div className="w-full h-full min-h-[300px] flex flex-col gap-6 p-6 animate-pulse bg-white/50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
                <div className="h-6 w-36 bg-slate-200 rounded-md"></div>
                <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="h-24 bg-slate-100 rounded-xl"></div>
                <div className="h-24 bg-slate-100 rounded-xl"></div>
                <div className="h-24 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="h-40 bg-slate-100 rounded-xl mt-2"></div>
            {title && (
                <div className="flex items-center gap-2 self-center text-slate-400 text-xs font-semibold mt-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></div>
                    <span>{title}</span>
                </div>
            )}
        </div>
    );
}