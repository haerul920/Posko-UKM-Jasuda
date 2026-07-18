"use client";

import { useState, useTransition, useCallback } from "react";
import {
  History,
  Download,
  Search,
  Filter,
  RefreshCw,
  Package,
  Users,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getActivityLogs, type ActivityLog, type ActivityModule } from "@/lib/actions/activity-log";

// ---------------------------------------------------------------------------
// Types & Helpers
// ---------------------------------------------------------------------------

interface Actor {
  actorId: string;
  actorName: string;
  actorRole: string;
}

interface Props {
  initialLogs: ActivityLog[];
  totalLogs: number;
  actors: Actor[];
}

const MODULE_ICONS: Record<ActivityModule, React.ReactNode> = {
  Produk: <Package className="w-3.5 h-3.5" />,
  Mitra: <Users className="w-3.5 h-3.5" />,
  Staf: <UserCheck className="w-3.5 h-3.5" />,
  Sistem: <Settings className="w-3.5 h-3.5" />,
  Keuangan: <span className="font-extrabold text-[0.7rem] leading-none">Rp</span>,
  Pesanan: <Package className="w-3.5 h-3.5" />,
};

const MODULE_COLORS: Record<ActivityModule, string> = {
  Produk: "bg-blue-50 text-blue-700 border border-blue-100",
  Mitra: "bg-purple-50 text-purple-700 border border-purple-100",
  Staf: "bg-amber-50 text-amber-700 border border-amber-100",
  Sistem: "bg-slate-100 text-slate-700 border border-slate-200",
  Keuangan: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Pesanan: "bg-sky-50 text-sky-700 border border-sky-100",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE_PRODUCT: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  UPDATE_PRODUCT: "bg-blue-50 text-blue-700 border border-blue-200",
  DELETE_PRODUCT: "bg-rose-50 text-rose-700 border border-rose-200",
  TOGGLE_FAVORITE_PRODUCT: "bg-amber-50 text-amber-700 border border-amber-200",
  CREATE_MITRA: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  UPDATE_MITRA: "bg-blue-50 text-blue-700 border border-blue-200",
  DELETE_MITRA: "bg-rose-50 text-rose-700 border border-rose-200",
  TOGGLE_FAVORITE_MITRA: "bg-amber-50 text-amber-700 border border-amber-200",
  CREATE_STAFF: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  UPDATE_STAFF: "bg-blue-50 text-blue-700 border border-blue-200",
  DELETE_STAFF: "bg-rose-50 text-rose-700 border border-rose-200",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE_PRODUCT: "Tambah",
  UPDATE_PRODUCT: "Ubah",
  DELETE_PRODUCT: "Hapus",
  TOGGLE_FAVORITE_PRODUCT: "Favorit",
  CREATE_MITRA: "Tambah",
  UPDATE_MITRA: "Ubah",
  DELETE_MITRA: "Hapus",
  TOGGLE_FAVORITE_MITRA: "Favorit",
  CREATE_STAFF: "Tambah",
  UPDATE_STAFF: "Ubah",
  DELETE_STAFF: "Hapus",
};

const TIME_OPTIONS = [
  { label: "Hari ini", hours: 24 },
  { label: "7 Hari terakhir", hours: 24 * 7 },
  { label: "30 Hari terakhir", hours: 24 * 30 },
  { label: "3 Bulan terakhir", hours: 24 * 90 },
];

const MODULES: ActivityModule[] = ["Produk", "Mitra", "Staf", "Sistem", "Keuangan", "Pesanan"];
const ITEMS_PER_PAGE = 20;

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return "Kemarin";
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFullTime(isoString: string): string {
  return new Date(isoString).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoleLabel(role: string): string {
  if (role === "admin") return "Administrator";
  if (role === "editor") return "Editor";
  return role;
}

function getRoleBadge(role: string): string {
  if (role === "admin") return "bg-ocean-light/10 text-ocean-light border border-ocean-light/20";
  if (role === "editor") return "bg-seaweed-dark/10 text-seaweed-dark border border-seaweed-dark/20";
  return "bg-slate-100 text-slate-600 border border-slate-200";
}

// ---------------------------------------------------------------------------
// CSV Export helper
// ---------------------------------------------------------------------------

function exportToCSV(logs: ActivityLog[]) {
  const headers = ["Waktu", "Pengelola", "Peran", "Modul", "Aksi", "Deskripsi", "Target"];
  const rows = logs.map((log) => [
    formatFullTime(log.createdAt),
    log.actorName,
    getRoleLabel(log.actorRole),
    log.module,
    ACTION_LABELS[log.action] ?? log.action,
    log.description,
    log.targetName ?? "-",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `riwayat-aktivitas-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function RiwayatClient({ initialLogs, totalLogs, actors }: Props) {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [total, setTotal] = useState(totalLogs);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<ActivityModule | "">("");
  const [actorFilter, setActorFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  // UI state
  const [activePopup, setActivePopup] = useState<"module" | "actor" | "time" | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const fetchLogs = useCallback(
    (page: number, module?: ActivityModule | "", actor?: string, time?: string) => {
      startTransition(async () => {
        const fromDate = time
          ? new Date(
              Date.now() - (TIME_OPTIONS.find((t) => t.label === time)?.hours ?? 24) * 3_600_000,
            ).toISOString()
          : undefined;

        const result = await getActivityLogs({
          module: module || undefined,
          actorId: actor || undefined,
          fromDate,
          limit: ITEMS_PER_PAGE,
        });

        if (result.success) {
          setLogs(result.logs);
          setTotal(result.total);
          setCurrentPage(page);
        }
      });
    },
    [],
  );

  const handleModuleFilter = (mod: ActivityModule | "") => {
    setModuleFilter(mod);
    setActivePopup(null);
    setCurrentPage(1);
    fetchLogs(1, mod, actorFilter, timeFilter);
  };

  const handleActorFilter = (actorId: string) => {
    setActorFilter(actorId);
    setActivePopup(null);
    setCurrentPage(1);
    fetchLogs(1, moduleFilter, actorId, timeFilter);
  };

  const handleTimeFilter = (time: string) => {
    setTimeFilter(time);
    setActivePopup(null);
    setCurrentPage(1);
    fetchLogs(1, moduleFilter, actorFilter, time);
  };

  const handlePageChange = (page: number) => {
    fetchLogs(page, moduleFilter, actorFilter, timeFilter);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setModuleFilter("");
    setActorFilter("");
    setTimeFilter("");
    fetchLogs(1, "", "", "");
  };

  // Client-side search filter
  const filteredLogs = searchQuery
    ? logs.filter(
        (log) =>
          log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (log.targetName ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : logs;

  const activeActor = actors.find((a) => a.actorId === actorFilter);
  const hasActiveFilter = moduleFilter || actorFilter || timeFilter;

  return (
    <>
      {/* Header Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white border border-slate-100/50 shadow-sm rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-ocean-light/10 to-seaweed-dark/10 rounded-xl border border-ocean-light/20">
            <History className="w-7 h-7 text-ocean-light" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">Log Aktivitas</h3>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
                {total.toLocaleString("id-ID")} entri
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Semua aksi dicatat secara real-time dari Firebase Firestore.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm text-sm font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
            Muat Ulang
          </button>
          <button
            onClick={() => exportToCSV(filteredLogs)}
            disabled={filteredLogs.length === 0}
            className="flex items-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm text-sm font-bold disabled:opacity-40 shrink-0"
          >
            <Download className="w-4 h-4" />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3 relative z-20">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengelola, deskripsi, atau target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/30 focus:border-ocean-light transition-all duration-300 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Module Filter */}
        <div className="relative">
          <button
            onClick={() => setActivePopup(activePopup === "module" ? null : "module")}
            className={`flex items-center gap-2 bg-white border rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] shadow-sm whitespace-nowrap ${
              moduleFilter
                ? "border-ocean-light text-ocean-light bg-ocean-light/5"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            {moduleFilter || "Semua Modul"}
          </button>

          {activePopup === "module" && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActivePopup(null)} />
              <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-xl shadow-xl w-44 py-1.5 z-50">
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${!moduleFilter ? "font-bold text-ocean-light" : "text-slate-700"}`}
                  onClick={() => handleModuleFilter("")}
                >
                  Semua Modul
                </button>
                {MODULES.map((mod) => (
                  <button
                    key={mod}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                      moduleFilter === mod ? "font-bold text-ocean-light" : "text-slate-700"
                    }`}
                    onClick={() => handleModuleFilter(mod)}
                  >
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${MODULE_COLORS[mod]}`}>
                      {MODULE_ICONS[mod]}
                    </span>
                    {mod}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actor Filter */}
        {actors.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setActivePopup(activePopup === "actor" ? null : "actor")}
              className={`flex items-center gap-2 bg-white border rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] shadow-sm whitespace-nowrap ${
                actorFilter
                  ? "border-ocean-light text-ocean-light bg-ocean-light/5"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {activeActor ? activeActor.actorName : "Semua Pengelola"}
            </button>

            {activePopup === "actor" && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setActivePopup(null)} />
                <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-xl shadow-xl w-52 py-1.5 z-50">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${!actorFilter ? "font-bold text-ocean-light" : "text-slate-700"}`}
                    onClick={() => handleActorFilter("")}
                  >
                    Semua Pengelola
                  </button>
                  {actors.map((actor) => (
                    <button
                      key={actor.actorId}
                      className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                        actorFilter === actor.actorId ? "bg-ocean-light/5" : ""
                      }`}
                      onClick={() => handleActorFilter(actor.actorId)}
                    >
                      <p className={`text-sm font-bold ${actorFilter === actor.actorId ? "text-ocean-light" : "text-slate-900"}`}>
                        {actor.actorName}
                      </p>
                      <p className="text-xs text-slate-500">{getRoleLabel(actor.actorRole)}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Time Filter */}
        <div className="relative">
          <button
            onClick={() => setActivePopup(activePopup === "time" ? null : "time")}
            className={`flex items-center gap-2 bg-white border rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] shadow-sm whitespace-nowrap ${
              timeFilter
                ? "border-ocean-light text-ocean-light bg-ocean-light/5"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            {timeFilter || "Semua Waktu"}
          </button>

          {activePopup === "time" && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActivePopup(null)} />
              <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-1.5 z-50">
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${!timeFilter ? "font-bold text-ocean-light" : "text-slate-700"}`}
                  onClick={() => handleTimeFilter("")}
                >
                  Semua Waktu
                </button>
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      timeFilter === opt.label ? "font-bold text-ocean-light" : "text-slate-700"
                    }`}
                    onClick={() => handleTimeFilter(opt.label)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clear filters */}
        {hasActiveFilter && (
          <button
            onClick={() => {
              setModuleFilter("");
              setActorFilter("");
              setTimeFilter("");
              fetchLogs(1, "", "", "");
            }}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors whitespace-nowrap px-2"
          >
            <X className="w-4 h-4" />
            Hapus Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 overflow-hidden">
        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-lg">
              <RefreshCw className="w-4 h-4 text-ocean-light animate-spin" />
              <span className="text-sm font-bold text-slate-700">Memuat data...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pengelola
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Modul
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Deskripsi Aktivitas
                </th>
                <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-100 rounded-2xl">
                        <History className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">
                        {hasActiveFilter || searchQuery
                          ? "Tidak ada log yang cocok dengan filter."
                          : "Belum ada aktivitas yang tercatat."}
                      </p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilter || searchQuery
                          ? "Coba ubah atau hapus filter yang aktif."
                          : "Log akan muncul saat admin/editor melakukan aksi."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 transition-colors duration-200 group"
                  >
                    {/* Actor */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {log.actorName}
                        </span>
                        <span
                          className={`inline-flex w-fit items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getRoleBadge(log.actorRole)}`}
                        >
                          {getRoleLabel(log.actorRole)}
                        </span>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${MODULE_COLORS[log.module]}`}
                        >
                          {MODULE_ICONS[log.module]}
                          {log.module}
                        </span>
                        <span
                          className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md w-fit ${ACTION_COLORS[log.action] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-4 px-5">
                      <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
                        {log.description}
                      </p>
                      {log.targetName && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Target: <span className="font-medium text-slate-500">{log.targetName}</span>
                        </p>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium text-slate-500">
                          {formatRelativeTime(log.createdAt)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatFullTime(log.createdAt)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-2xl">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">{filteredLogs.length}</span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">{total.toLocaleString("id-ID")}</span>{" "}
            aktivitas
            {hasActiveFilter && (
              <span className="ml-1 text-ocean-light">(terfilter)</span>
            )}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isPending}
                      className={`w-8 h-8 text-sm font-bold rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isPending}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
