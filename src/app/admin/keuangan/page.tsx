"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Download, TrendingUp, Search, Package } from "lucide-react";
import { getFinancialSummary, type FinancialSummary } from "@/lib/actions/keuangan";
import { CustomMonthSelect } from "@/components/admin/CustomMonthSelect";
import { CustomRowSelect } from "@/components/admin/CustomRowSelect";
import { exportToExcel } from "@/lib/export";

const monthsList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function AdminSettlementPage() {
  const [loadingData, setLoadingData] = useState(true);
  const [financeData, setFinanceData] = useState<FinancialSummary | null>(null);

  const [jasudaSearch, setJasudaSearch] = useState("");
  const [mitraSearch, setMitraSearch] = useState("");
  const [jasudaMonth, setJasudaMonth] = useState(`${monthsList[new Date().getMonth()]} ${new Date().getFullYear()}`);
  const [mitraMonth, setMitraMonth] = useState(`${monthsList[new Date().getMonth()]} ${new Date().getFullYear()}`);

  const [jasudaPage, setJasudaPage] = useState(1);
  const [mitraPage, setMitraPage] = useState(1);
  const [jasudaItemsPerPage, setJasudaItemsPerPage] = useState(10);
  const [mitraItemsPerPage, setMitraItemsPerPage] = useState(10);

  const jasudaTableRef = useRef<HTMLDivElement>(null);
  const mitraTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadFinance() {
      setLoadingData(true);
      const res = await getFinancialSummary();
      if (res.success && res.data) {
        setFinanceData(res.data);
      }
      setLoadingData(false);
    }
    loadFinance();
  }, []);

  const handleJasudaPageChange = useCallback((newPage: number) => {
    setJasudaPage(newPage);
    setTimeout(() => {
      if (jasudaTableRef.current) {
        jasudaTableRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 10);
  }, []);

  const handleMitraPageChange = useCallback((newPage: number) => {
    setMitraPage(newPage);
    setTimeout(() => {
      if (mitraTableRef.current) {
        mitraTableRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 10);
  }, []);

  const filteredJasuda = useMemo(() => {
    const jasudaProducts = financeData?.jasudaProducts || [];
    return jasudaProducts.filter((p) => p.prod.toLowerCase().includes(jasudaSearch.toLowerCase()));
  }, [financeData?.jasudaProducts, jasudaSearch]);

  const jasudaTotalPages = useMemo(() => {
    return Math.ceil(filteredJasuda.length / jasudaItemsPerPage) || 1;
  }, [filteredJasuda.length, jasudaItemsPerPage]);

  const currentJasudaData = useMemo(() => {
    const start = (jasudaPage - 1) * jasudaItemsPerPage;
    return filteredJasuda.slice(start, start + jasudaItemsPerPage);
  }, [filteredJasuda, jasudaPage, jasudaItemsPerPage]);

  const filteredMitra = useMemo(() => {
    const mitraProducts = financeData?.mitraProducts || [];
    return mitraProducts.filter(
      (m) =>
        m.prod.toLowerCase().includes(mitraSearch.toLowerCase()) ||
        m.mit.toLowerCase().includes(mitraSearch.toLowerCase())
    );
  }, [financeData?.mitraProducts, mitraSearch]);

  const mitraTotalPages = useMemo(() => {
    return Math.ceil(filteredMitra.length / mitraItemsPerPage) || 1;
  }, [filteredMitra.length, mitraItemsPerPage]);

  const currentMitraData = useMemo(() => {
    const start = (mitraPage - 1) * mitraItemsPerPage;
    return filteredMitra.slice(start, start + mitraItemsPerPage);
  }, [filteredMitra, mitraPage, mitraItemsPerPage]);

  const handleExportJasuda = useCallback(() => {
    const data = filteredJasuda.map((item, index) => ({
      "No": index + 1,
      "Nama Produk": item.prod,
      "Stok": Number(item.stok.replace(/\D/g, "")),
      "Terjual": Number(item.sold.replace(/\D/g, "")),
      "Pendapatan Kotor": item.rawGross,
      "Pendapatan Bersih": item.rawNet,
    }));
    exportToExcel(data, `Keuangan_Jasuda_${jasudaMonth.replace(" ", "_")}`);
  }, [filteredJasuda, jasudaMonth]);

  const handleExportMitra = useCallback(() => {
    const data = filteredMitra.map((item, index) => ({
      "No": index + 1,
      "Nama Produk": item.prod,
      "Mitra": item.mit,
      "Stok": Number(item.stok.replace(/\D/g, "")),
      "Terjual": Number(item.sold.replace(/\D/g, "")),
      "Komisi (Jasuda)": item.rawKomisi,
      "Pendapatan Bersih (Mitra)": item.rawNet,
    }));
    exportToExcel(data, `Keuangan_Mitra_${mitraMonth.replace(" ", "_")}`);
  }, [filteredMitra, mitraMonth]);

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Keuangan
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Kelola komisi mitra dan pantau total pendapatan bersih Jasuda secara real-time dari database.
          </p>
        </div>
      </div>

      {/* Jasuda Finance Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-slate-900 rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-900">
              Keuangan Jasuda
            </h3>
          </div>
          <div className="flex gap-3 items-center z-20">
            <span className="text-sm font-medium text-slate-500 hidden md:block">
              Pilih Bulan:
            </span>
            <CustomMonthSelect value={jasudaMonth} onChange={setJasudaMonth} />
            <button 
              onClick={handleExportJasuda}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md whitespace-nowrap h-full max-h-9.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Ekspor
            </button>
          </div>
        </div>

        {/* Jasuda Metric Card */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-800 transition-all duration-300">
            <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-bl from-emerald-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Total Pendapatan Bersih Jasuda
                </h3>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {loadingData ? "Memuat..." : (financeData?.jasudaNetTotal || "Rp 0")}
                </p>
              </div>

              <div className="flex gap-6 border-t md:border-t-0 md:border-l border-slate-700 pt-6 md:pt-0 md:pl-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Pertumbuhan Pendapatan
                  </p>
                  <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full px-3 py-1 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      {financeData?.jasudaGrowthPercentage || "+9.4%"} vs bulan lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jasuda Products Table */}
        <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              Daftar Produk Jasuda
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap hidden sm:block">Tampilkan:</span>
                <CustomRowSelect
                  value={jasudaItemsPerPage}
                  onChange={(v) => {
                    setJasudaItemsPerPage(v);
                    setJasudaPage(1);
                  }}
                />
              </div>
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari Produk Jasuda..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-sm text-slate-900 shadow-sm transition-all duration-300"
                  value={jasudaSearch}
                  onChange={(e) => {
                    setJasudaSearch(e.target.value);
                    setJasudaPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-175 table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[35%]">
                    Nama Produk
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[15%]">
                    Stok
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[15%]">
                    Terjual
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[15%]">
                    Pendapatan Kotor
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[15%]">
                    Pendapatan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentJasudaData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-64 align-middle text-center text-slate-500 font-bold text-sm">
                      <div className="flex flex-col items-center justify-center gap-2.5 h-full">
                        <Package className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <span>Data tidak ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentJasudaData.map((row, i) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors duration-300 group"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-slate-500">
                        {(jasudaPage - 1) * jasudaItemsPerPage + i + 1}.
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                        {row.prod}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        {row.stok}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        {row.sold}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        {row.gross}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-emerald-600">
                        {row.net}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div ref={jasudaTableRef} className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 scroll-mb-6">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan {filteredJasuda.length === 0 ? 0 : (jasudaPage - 1) * jasudaItemsPerPage + 1}-{Math.min(jasudaPage * jasudaItemsPerPage, filteredJasuda.length)} dari {filteredJasuda.length} produk
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleJasudaPageChange(Math.max(1, jasudaPage - 1))}
                disabled={jasudaPage === 1}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => handleJasudaPageChange(Math.min(jasudaTotalPages, jasudaPage + 1))}
                disabled={jasudaPage === jasudaTotalPages}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mitra Finance Section */}
      <div className="mb-8 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-ocean-light rounded-full"></div>
            <h3 className="text-2xl font-bold text-slate-900">
              Keuangan Mitra
            </h3>
          </div>
          <div className="flex gap-3 items-center z-10">
            <span className="text-sm font-medium text-slate-500 hidden md:block">
              Pilih Bulan:
            </span>
            <CustomMonthSelect value={mitraMonth} onChange={setMitraMonth} />
            <button 
              onClick={handleExportMitra}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md whitespace-nowrap h-full max-h-9.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Ekspor
            </button>
          </div>
        </div>

        {/* Mitra Metric Card */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-ocean-gradient rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-800 transition-all duration-300 h-full">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-ocean-light/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-ocean-light/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Total Komisi Diraih Jasuda
                </h3>
                <p className="text-4xl md:text-5xl font-bold text-white">
                  {loadingData ? "Memuat..." : (financeData?.mitraKomisiTotal || "Rp 0")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 border-t md:border-t-0 md:border-l border-slate-700 pt-6 md:pt-0 md:pl-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Mitra Aktif
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {loadingData ? "..." : (financeData?.mitraCount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Pertumbuhan Komisi
                  </p>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      {financeData?.mitraGrowthPercentage || "+12.8%"} vs bulan lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mitra Products Table */}
        <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
            <h3 className="text-lg font-bold text-slate-900">
              Daftar Produk Mitra
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap hidden sm:block">Tampilkan:</span>
                <CustomRowSelect
                  value={mitraItemsPerPage}
                  onChange={(v) => {
                    setMitraItemsPerPage(v);
                    setMitraPage(1);
                  }}
                />
              </div>
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari Mitra / Produk..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-sm text-slate-900 shadow-sm transition-all duration-300"
                  value={mitraSearch}
                  onChange={(e) => {
                    setMitraSearch(e.target.value);
                    setMitraPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-200 table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[35%]">
                    Nama Produk & Mitra
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[10%]">
                    Stok
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[10%]">
                    Terjual
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[20%]">
                    Komisi
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-[20%]">
                    Pendapatan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentMitraData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-64 align-middle text-center text-slate-500 font-bold text-sm">
                      <div className="flex flex-col items-center justify-center gap-2.5 h-full">
                        <Package className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <span>Data tidak ditemukan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentMitraData.map((row, i) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors duration-300 group"
                    >
                      <td className="py-4 px-6 text-sm font-medium text-slate-500">
                        {(mitraPage - 1) * mitraItemsPerPage + i + 1}.
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                            {row.prod}
                          </span>
                          <span className="text-xs font-medium text-ocean-light mt-0.5">
                            {row.mit}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        {row.stok}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        {row.sold}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-rose-600">
                        {row.komisi}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-emerald-600">
                        {row.net}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div ref={mitraTableRef} className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 scroll-mb-6">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan {filteredMitra.length === 0 ? 0 : (mitraPage - 1) * mitraItemsPerPage + 1}-{Math.min(mitraPage * mitraItemsPerPage, filteredMitra.length)} dari {filteredMitra.length} produk
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleMitraPageChange(Math.max(1, mitraPage - 1))}
                disabled={mitraPage === 1}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => handleMitraPageChange(Math.min(mitraTotalPages, mitraPage + 1))}
                disabled={mitraPage === mitraTotalPages}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
