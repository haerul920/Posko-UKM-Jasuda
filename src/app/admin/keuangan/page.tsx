"use client";

import React, { useState, useRef } from "react";
import { Calendar, Download, TrendingUp, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const monthsList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function CustomMonthSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialYear = parseInt(value.split(' ')[1]) || 2026;
  const [viewYear, setViewYear] = useState(initialYear);

  const handleOpen = () => {
    setViewYear(parseInt(value.split(' ')[1]) || 2026);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left w-44">
      <button
        type="button"
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light shadow-sm transition-all duration-300 cursor-pointer hover:bg-slate-50"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <button 
              type="button"
              onClick={() => setViewYear(v => v - 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="font-bold text-slate-700">{viewYear}</span>
            <button 
              type="button"
              onClick={() => setViewYear(v => v + 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="p-3 grid grid-cols-3 gap-2">
            {monthsList.map((m) => {
              const optionValue = `${m} ${viewYear}`;
              const isSelected = value === optionValue;
              return (
                <button
                  key={m}
                  onClick={() => {
                    onChange(optionValue);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center ${
                    isSelected 
                      ? 'bg-ocean-light text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomRowSelect({ value, onChange }: { value: number, onChange: (val: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [5, 10, 30, 50];

  return (
    <div className="relative inline-block text-left w-28">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light shadow-sm transition-all duration-300 cursor-pointer hover:bg-slate-50"
      >
        <span>{value} baris</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-full origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col p-1.5 gap-1">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md text-left transition-all ${
                  value === opt 
                    ? 'bg-ocean-light/10 text-ocean-light font-bold backdrop-blur-md border border-ocean-light/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {opt} baris
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const dummyJasudaProducts = Array.from({ length: 125 }).map((_, i) => {
  const names = ["Premium Kombu Strips", "Liquid Kelp Extract", "Dried Sugar Kelp", "Organic Seaweed Snack", "Roasted Nori Sheets"];
  const prod = `${names[i % 5]} - Batch ${i + 1}`;
  const soldNum = Math.max(100, 3000 - i * 20);
  const stokNum = Math.floor(soldNum * 1.5);
  const grossNum = (soldNum * 15000).toLocaleString("id-ID");
  const netNum = (soldNum * 12500).toLocaleString("id-ID");
  return { id: i, prod, stok: stokNum.toLocaleString("id-ID"), sold: soldNum.toLocaleString("id-ID"), gross: `Rp ${grossNum}`, net: `Rp ${netNum}` };
});

const dummyMitraProducts = Array.from({ length: 160 }).map((_, i) => {
  const prodNames = ["Rumput Laut Kering Grade A", "Kerupuk Nori Renyah", "Ekstrak Karagenan Murni", "Bumbu Tabur Nori", "Mie Seaweed Sehat"];
  const mitNames = ["Koperasi Nelayan Sejahtera", "UMKM Mandiri", "Alga Tech", "Berkah Bahari", "Nusantara Kelp"];
  const prod = `${prodNames[i % 5]} #${i + 1}`;
  const mit = mitNames[i % 5];
  const soldNum = Math.max(50, 2000 - i * 10);
  const stokNum = Math.floor(soldNum * 1.2);
  const komisiNum = (soldNum * 1500).toLocaleString("id-ID");
  const netNum = (soldNum * 13500).toLocaleString("id-ID");
  return { id: i, prod, mit, stok: stokNum.toLocaleString("id-ID"), sold: soldNum.toLocaleString("id-ID"), komisi: `Rp ${komisiNum}`, rate: "10%", net: `Rp ${netNum}` };
});

export default function AdminSettlementPage() {
  const [jasudaSearch, setJasudaSearch] = useState("");
  const [mitraSearch, setMitraSearch] = useState("");
  const [jasudaMonth, setJasudaMonth] = useState("Januari 2026");
  const [mitraMonth, setMitraMonth] = useState("Januari 2026");

  const [jasudaPage, setJasudaPage] = useState(1);
  const [mitraPage, setMitraPage] = useState(1);
  const [jasudaItemsPerPage, setJasudaItemsPerPage] = useState(10);
  const [mitraItemsPerPage, setMitraItemsPerPage] = useState(10);

  const jasudaTableRef = useRef<HTMLDivElement>(null);
  const mitraTableRef = useRef<HTMLDivElement>(null);

  const handleJasudaPageChange = (newPage: number) => {
    setJasudaPage(newPage);
    setTimeout(() => {
      if (jasudaTableRef.current) {
        jasudaTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 10);
  };

  const handleMitraPageChange = (newPage: number) => {
    setMitraPage(newPage);
    setTimeout(() => {
      if (mitraTableRef.current) {
        mitraTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 10);
  };

  const filteredJasuda = dummyJasudaProducts.filter(p => p.prod.toLowerCase().includes(jasudaSearch.toLowerCase()));
  const jasudaTotalPages = Math.ceil(filteredJasuda.length / jasudaItemsPerPage) || 1;
  const currentJasudaData = filteredJasuda.slice((jasudaPage - 1) * jasudaItemsPerPage, jasudaPage * jasudaItemsPerPage);

  const filteredMitra = dummyMitraProducts.filter(m => m.prod.toLowerCase().includes(mitraSearch.toLowerCase()) || m.mit.toLowerCase().includes(mitraSearch.toLowerCase()));
  const mitraTotalPages = Math.ceil(filteredMitra.length / mitraItemsPerPage) || 1;
  const currentMitraData = filteredMitra.slice((mitraPage - 1) * mitraItemsPerPage, mitraPage * mitraItemsPerPage);

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Keuangan
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Kelola komisi mitra dan pantau total pendapatan bersih Jasuda.
          </p>
        </div>
      </div>

      {/* =========================================================
          BAGIAN JASUDA
         ========================================================= */}
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
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md whitespace-nowrap h-full max-h-[38px]">
              <Download className="w-4 h-4" />
              Ekspor
            </button>
          </div>
        </div>

        {/* Metric Card Jasuda */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md border border-slate-800 transition-all duration-300">
            <div className="absolute right-0 top-0 w-64 h-64 bg-linear-to-bl from-emerald-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Total Pendapatan Bersih Jasuda
                </h3>
                <p className="text-5xl font-bold text-white">
                  Rp 385.500.000
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
                      +9.1% vs bulan lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Produk Jasuda */}
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Stok
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Terjual
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Pendapatan Kotor
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Pendapatan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentJasudaData.map((row, i) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors duration-300 group"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                      {((jasudaPage - 1) * jasudaItemsPerPage) + i + 1}.
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Jasuda */}
          <div ref={jasudaTableRef} className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 scroll-mb-6">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan {filteredJasuda.length === 0 ? 0 : ((jasudaPage - 1) * jasudaItemsPerPage) + 1}-{Math.min(jasudaPage * jasudaItemsPerPage, filteredJasuda.length)} dari {filteredJasuda.length} produk
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleJasudaPageChange(Math.max(1, jasudaPage - 1))}
                disabled={jasudaPage === 1}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => handleJasudaPageChange(Math.min(jasudaTotalPages, jasudaPage + 1))}
                disabled={jasudaPage === jasudaTotalPages}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BAGIAN MITRA
         ========================================================= */}
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
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md whitespace-nowrap h-full max-h-[38px]">
              <Download className="w-4 h-4" />
              Ekspor
            </button>
          </div>
        </div>

        {/* Metric Card Mitra */}
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
                <p className="text-5xl font-bold text-white">
                  Rp 2.450.890.000
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 border-t md:border-t-0 md:border-l border-slate-700 pt-6 md:pt-0 md:pl-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Tenant Aktif
                  </p>
                  <p className="text-2xl font-bold text-white">142</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    Pertumbuhan Komisi
                  </p>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      +12.4% vs bulan lalu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Produk Mitra */}
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Stok
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Terjual
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Komisi
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Rate
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Pendapatan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentMitraData.map((row, i) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors duration-300 group"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                      {((mitraPage - 1) * mitraItemsPerPage) + i + 1}.
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
                    <td className="py-4 px-6 text-right text-sm font-bold text-blue-600">
                      {row.rate}
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-bold text-emerald-600">
                      {row.net}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Mitra */}
          <div ref={mitraTableRef} className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 scroll-mb-6">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan {filteredMitra.length === 0 ? 0 : ((mitraPage - 1) * mitraItemsPerPage) + 1}-{Math.min(mitraPage * mitraItemsPerPage, filteredMitra.length)} dari {filteredMitra.length} produk
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handleMitraPageChange(Math.max(1, mitraPage - 1))}
                disabled={mitraPage === 1}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => handleMitraPageChange(Math.min(mitraTotalPages, mitraPage + 1))}
                disabled={mitraPage === mitraTotalPages}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 hover:text-ocean-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
