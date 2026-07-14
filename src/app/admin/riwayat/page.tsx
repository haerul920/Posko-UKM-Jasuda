"use client";

import { useState } from 'react';
import { History, Download, Search, Filter } from 'lucide-react';
import PaginationControls from '@/components/pagination';

export default function AdminHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeFilterPopup, setActiveFilterPopup] = useState<"user" | "action" | "time" | null>(null);
  const [userFilter, setUserFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");

  const activities = [
    {
      id: 1,
      user: 'Super Admin',
      action: 'Tambah Produk',
      timestamp: 'Baru saja',
    },
    {
      id: 2,
      user: 'Super Admin',
      action: 'Tambah Mitra',
      timestamp: '2 jam yang lalu',
    },
    {
      id: 3,
      user: 'Staff Admin 1',
      action: 'Ubah Harga Produk',
      timestamp: 'Kemarin, 14:30',
    },
    {
      id: 4,
      user: 'Super Admin',
      action: 'Hapus Mitra',
      timestamp: '2 hari yang lalu',
    },
    {
      id: 5,
      user: 'Super Admin',
      action: 'Ubah Pengaturan Sistem',
      timestamp: '2 hari yang lalu',
    }
  ];

  const uniqueUsers = Array.from(new Set(activities.map(a => a.user)));
  const actionCategories = ["Produk", "Mitra", "Pengaturan sistem"];
  const timeOptions = [
    "Hari ini",
    "Kemarin",
    "3 Hari lalu",
    "7 Hari lalu",
    "14 Hari lalu",
    "1 Bulan lalu",
    "6 Bulan lalu",
  ];

  const filteredActivities = activities.filter((act) => {
    const matchSearch = act.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchUser = userFilter ? act.user === userFilter : true;

    let matchAction = true;
    if (actionFilter === "Produk") matchAction = act.action.toLowerCase().includes("produk");
    else if (actionFilter === "Mitra") matchAction = act.action.toLowerCase().includes("mitra");
    else if (actionFilter === "Pengaturan sistem") matchAction = act.action.toLowerCase().includes("pengaturan");

    let matchTime = true;
    if (timeFilter === "Hari ini") matchTime = act.timestamp.toLowerCase().includes("baru") || act.timestamp.toLowerCase().includes("jam") || act.timestamp.toLowerCase().includes("hari ini");
    else if (timeFilter === "Kemarin") matchTime = act.timestamp.toLowerCase().includes("kemarin");
    else if (timeFilter === "3 Hari lalu") matchTime = act.timestamp.toLowerCase().includes("hari");
    else if (timeFilter === "7 Hari lalu") matchTime = false;
    else if (timeFilter === "14 Hari lalu") matchTime = false;
    else if (timeFilter === "1 Bulan lalu") matchTime = false;
    else if (timeFilter === "6 Bulan lalu") matchTime = false;

    return matchSearch && matchUser && matchAction && matchTime;
  });

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-6 mb-8 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <History className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Riwayat Aktivitas</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-2">Catatan audit (Audit Trail) dari semua aktivitas administratif di dalam sistem (Data Demonstrasi).</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button className="flex items-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm shrink-0">
            <Download className="w-5 h-5" />
            <span className="text-sm font-bold">Unduh Log</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari user pengelola..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setActiveFilterPopup(activeFilterPopup === "time" ? null : "time")}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 hover:bg-slate-50 transition-all duration-300 shadow-sm active:scale-[0.98] w-full sm:w-auto justify-between sm:justify-start"
          >
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${timeFilter ? 'text-ocean-light' : 'text-slate-500'}`} />
              <span className="text-sm font-bold">{timeFilter || "Semua Waktu"}</span>
            </div>
          </button>

          {activeFilterPopup === "time" && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setActiveFilterPopup(null)}></div>
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-50 overflow-hidden">
                <button
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${!timeFilter ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                  onClick={() => { setTimeFilter(""); setActiveFilterPopup(null); }}
                >
                  Semua Waktu
                </button>
                {timeOptions.map(t => (
                  <button
                    key={t}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${timeFilter === t ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                    onClick={() => { setTimeFilter(t); setActiveFilterPopup(null); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl transition-all duration-300 relative z-10 pb-2">
        <div className="w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider relative">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveFilterPopup(activeFilterPopup === "user" ? null : "user")}>
                    Oleh (User)
                    <Filter className={`w-3.5 h-3.5 ${userFilter ? 'text-ocean-light' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
                  </div>
                  {activeFilterPopup === "user" && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveFilterPopup(null)}></div>
                      <div className="absolute top-full mt-2 left-4 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-50 overflow-hidden">
                        <button
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${!userFilter ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                          onClick={() => { setUserFilter(""); setActiveFilterPopup(null); }}
                        >
                          Semua Pengelola
                        </button>
                        {uniqueUsers.map(u => (
                          <button
                            key={u}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${userFilter === u ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                            onClick={() => { setUserFilter(u); setActiveFilterPopup(null); }}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider relative">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveFilterPopup(activeFilterPopup === "action" ? null : "action")}>
                    Aktifitas
                    <Filter className={`w-3.5 h-3.5 ${actionFilter ? 'text-ocean-light' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`} />
                  </div>
                  {activeFilterPopup === "action" && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveFilterPopup(null)}></div>
                      <div className="absolute top-full mt-2 left-4 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-50 overflow-hidden">
                        <button
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${!actionFilter ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                          onClick={() => { setActionFilter(""); setActiveFilterPopup(null); }}
                        >
                          Semua Aktifitas
                        </button>
                        {actionCategories.map(a => (
                          <button
                            key={a}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${actionFilter === a ? 'font-bold text-ocean-light bg-blue-50/50' : 'text-slate-700'}`}
                            onClick={() => { setActionFilter(a); setActiveFilterPopup(null); }}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedActivities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/80 transition-colors duration-300 group">
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-900">{act.user}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">{act.action}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-medium text-slate-500">{act.timestamp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-5 flex items-center justify-between rounded-b-2xl">
          <p className="text-sm font-medium text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {filteredActivities.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>
            –
            <span className="font-bold text-slate-700">
              {Math.min(currentPage * itemsPerPage, filteredActivities.length)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">
              {filteredActivities.length}
            </span>{" "}
            aktivitas
          </p>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
