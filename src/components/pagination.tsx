import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            );
        } else {
            pages.push(
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages,
            );
        }
    }

    return (
        <div className="flex items-center gap-1.5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-slate-400 bg-transparent disabled:opacity-50 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            {pages.map((p, i) => {
                if (p === "...") {
                    return (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-slate-400 font-bold tracking-widest"
                        >
                            ...
                        </span>
                    );
                }
                const num = p as number;
                const isActive = num === currentPage;
                return (
                    <button
                        key={num}
                        onClick={() => onPageChange(num)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 active:scale-[0.95] ${isActive
                            ? "bg-ocean-dark text-white shadow-md shadow-ocean-dark/20"
                            : "text-slate-600 hover:bg-ocean-light/10 hover:text-ocean-dark"
                            }`}
                    >
                        {num}
                    </button>
                );
            })}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-ocean-light/10 hover:text-ocean-dark transition-colors active:scale-[0.95] disabled:opacity-50"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}