"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Download,
  MoreVertical,
  Store,
  User,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  Mail,
  Phone,
  Clock,
  Package,
  FileText,
  List,
} from "lucide-react";

const monthsList = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function RowsPerPageSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [10, 30, 50, 100];

  return (
    <div className="relative flex text-left group/select">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="h-10 flex items-center justify-between gap-2 bg-slate-50/80 border border-slate-200/80 rounded-lg px-4 text-slate-700 hover:text-ocean-dark hover:bg-ocean-light/5 hover:border-ocean-light/30 transition-all duration-300 active:scale-[0.98] shadow-sm"
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 opacity-70 group-hover/select:text-ocean-dark transition-colors" />
          <span className="text-sm font-bold whitespace-nowrap">{value} Baris</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover/select:text-ocean-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden py-1"
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${
                  isSelected ? "text-ocean-dark bg-ocean-light/5" : "text-slate-600"
                }`}
              >
                {opt} Baris
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
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
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
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
            className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all duration-200 active:scale-[0.95] ${
              isActive
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

function CustomMonthSelect({

  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const initialYear = parseInt(value.split(" ")[1]) || 2026;
  const [viewYear, setViewYear] = useState(initialYear);

  const handleOpen = () => {
    setViewYear(parseInt(value.split(" ")[1]) || 2026);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex text-left w-56 group/select">
      <button
        type="button"
        onClick={handleOpen}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full h-10 flex items-center justify-between gap-2 bg-slate-50/80 border border-slate-200/80 rounded-lg px-4 text-slate-700 hover:text-ocean-dark hover:bg-ocean-light/5 hover:border-ocean-light/30 transition-all duration-300 active:scale-[0.98] shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 opacity-70 group-hover/select:text-ocean-dark transition-colors" />
          <span className="text-sm font-bold whitespace-nowrap">{value}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover/select:text-ocean-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 origin-top-right bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setViewYear((v) => v - 1)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="font-bold text-slate-700">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((v) => v + 1)}
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
                      ? "bg-ocean-gradient text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
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

function CopyableOrderId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent row click if there is any
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Salin ID Pesanan"
      className="flex items-center gap-2 group/copy text-left focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light rounded-sm transition-all active:scale-95"
    >
      <span className="text-sm font-bold text-slate-900 group-hover/copy:text-ocean-light transition-colors">
        {id}
      </span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500 animate-in fade-in zoom-in" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

function ColumnFilterDropdown({
  value,
  onChange,
  label,
  options,
}: {
  value: string | null;
  onChange: (val: string | null) => void;
  label: string;
  options: { label: string; value: string | null }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="inline-flex items-center justify-center gap-1.5 hover:text-ocean-dark transition-colors focus:outline-none"
      >
        <span className="uppercase tracking-wider">
          {value
            ? options.find((o) => o.value === value)?.label || label
            : label}
        </span>
        <Filter
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "text-ocean-dark" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 z-120 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Filter {label}
            </span>
          </div>
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${
                  isSelected ? "text-ocean-dark" : "text-slate-600"
                }`}
              >
                {opt.label}
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type OrderItem = {
  name: string;
  qty: number;
  price: string;
};

export type Order = {
  id: string;
  dateStr: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeName: string;
  storeType: "flagship" | "tenant";
  totalAmount: string;
  paymentMethod: string;
  status: "Selesai" | "Diproses" | "Dibatalkan";
  items: OrderItem[];
};

const baseOrders: Order[] = [
  {
    id: "#ORD-9921-A",
    dateStr: "12 Okt 2026, 14:32",
    customerName: "Alex Johnson",
    customerEmail: "alex.j@example.com",
    customerPhone: "+62 812-3456-7890",
    storeName: "Jasuda",
    storeType: "flagship",
    totalAmount: "Rp 2.450.000",
    paymentMethod: "BCA Virtual Account",
    status: "Selesai",
    items: [
      { name: "Premium Seaweed Extract 500g", qty: 2, price: "Rp 1.000.000" },
      { name: "Ocean Minerals Set", qty: 1, price: "Rp 450.000" },
    ],
  },
  {
    id: "#ORD-9920-B",
    dateStr: "12 Okt 2026, 13:15",
    customerName: "Sarah Miller",
    customerEmail: "sarah.m@koperasi.id",
    customerPhone: "+62 856-7890-1234",
    storeName: "Koperasi Nelayan",
    storeType: "tenant",
    totalAmount: "Rp 1.299.000",
    paymentMethod: "QRIS",
    status: "Diproses",
    items: [
      { name: "Pupuk Rumput Laut Organik", qty: 10, price: "Rp 129.900" },
    ],
  },
  {
    id: "#ORD-9919-C",
    dateStr: "11 Okt 2026, 11:05",
    customerName: "David Ross",
    customerEmail: "david.ross@mandiri.com",
    customerPhone: "+62 811-2233-4455",
    storeName: "UMKM Mandiri",
    storeType: "tenant",
    totalAmount: "Rp 350.000",
    paymentMethod: "BCA Virtual Account",
    status: "Dibatalkan",
    items: [
      {
        name: "Bibit Rumput Laut Gracilaria (Paket A)",
        qty: 5,
        price: "Rp 70.000",
      },
    ],
  },
];

const MOCK_ORDERS: Order[] = Array.from({ length: 100 }, (_, i) => {
  const base = baseOrders[i % 3];
  const idNum = 9921 - i;
  return {
    ...base,
    id: `#ORD-${idNum}-${String.fromCharCode(65 + (i % 26))}`,
    dateStr: `${12 - Math.floor(i / 10)} Okt 2026, ${String(Math.floor(Math.random() * 12) + 8).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
  };
});

function OrderDetailsSidebar({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-101 flex flex-col animate-in slide-in-from-right fade-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ocean-light/10 text-ocean-dark rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Detail Pesanan
              </h2>
              <p className="text-sm font-medium text-slate-500">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Nominal */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Nominal
              </p>
              <p className="text-xl font-bold text-slate-900">
                {order.totalAmount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                  order.status === "Selesai"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : order.status === "Diproses"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-rose-100 text-rose-700 border-rose-200"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Informasi Pelanggan
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Nama</span>
                <span className="text-sm font-bold text-slate-900">
                  {order.customerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-semibold text-slate-700">
                  {order.customerEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">No. Telepon</span>
                <span className="text-sm font-semibold text-slate-700">
                  {order.customerPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-400" />
              Informasi Toko & Waktu
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Toko</span>
                <span
                  className={`text-sm font-bold flex items-center gap-1.5 ${order.storeType === "flagship" ? "text-ocean-dark" : "text-slate-700"}`}
                >
                  {order.storeName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Waktu Pesanan</span>
                <span className="text-sm font-semibold text-slate-700">
                  {order.dateStr}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Pembayaran</span>
                <span className="text-sm font-semibold text-slate-700">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              Produk Dipesan
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {item.qty} x {item.price}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [orderMonth, setOrderMonth] = useState("Oktober 2026");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, paymentFilter, statusFilter, storeFilter, rowsPerPage]);

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.storeName.toLowerCase().includes(search.toLowerCase());
    const matchPayment = paymentFilter
      ? order.paymentMethod === paymentFilter
      : true;
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    const matchStore = storeFilter ? order.storeType === storeFilter : true;
    return matchSearch && matchPayment && matchStatus && matchStore;
  });

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Riwayat Pesanan
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Kelola dan lacak semua transaksi dari Jasuda maupun Mitra dalam satu
            tempat.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm hover:shadow-md border border-slate-100/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pb-4 px-6 pt-6 border-b border-slate-100 bg-white relative z-50">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              autoComplete="off"
              placeholder="Pencarian"
              className="w-full h-10 pl-9 pr-4 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light focus:bg-white text-sm font-medium text-slate-900 shadow-sm transition-all duration-300 placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <RowsPerPageSelect value={rowsPerPage} onChange={setRowsPerPage} />
            <CustomMonthSelect value={orderMonth} onChange={setOrderMonth} />

            <button className="flex h-10 items-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0">
              <Download className="w-4 h-4 text-white" />
              <span className="text-sm font-bold whitespace-nowrap text-white">
                Ekspor Laporan
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <ColumnFilterDropdown
                    label="Toko"
                    value={storeFilter}
                    onChange={setStoreFilter}
                    options={[
                      { label: "Semua Toko", value: null },
                      { label: "Jasuda", value: "flagship" },
                      { label: "Mitra / Tenant", value: "tenant" },
                    ]}
                  />
                </th>

                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Nominal
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  <ColumnFilterDropdown
                    label="Pembayaran"
                    value={paymentFilter}
                    onChange={setPaymentFilter}
                    options={[
                      { label: "Semua Metode", value: null },
                      { label: "BCA VA", value: "BCA Virtual Account" },
                      { label: "QRIS", value: "QRIS" },
                    ]}
                  />
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                  <ColumnFilterDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { label: "Semua Status", value: null },
                      { label: "Selesai", value: "Selesai" },
                      { label: "Diproses", value: "Diproses" },
                      { label: "Dibatalkan", value: "Dibatalkan" },
                    ]}
                  />
                </th>
                <th className="py-4 px-6 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition-colors duration-300 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <CopyableOrderId id={order.id} />
                      <span className="text-xs font-medium text-slate-500 mt-1">
                        {order.dateStr}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-900">
                      {order.customerName}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-sm font-bold ${order.storeType === "flagship" ? "text-ocean-dark" : "text-slate-700"}`}
                    >
                      {order.storeName}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right text-sm text-slate-900 font-bold">
                    {order.totalAmount}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                        order.paymentMethod === "QRIS"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                        order.status === "Selesai"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : order.status === "Diproses"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-rose-100 text-rose-700 border-rose-200"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-slate-400 hover:text-ocean-light transition-all duration-300 active:scale-[0.98] opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white hover:shadow-sm"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {filteredOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
            </span>
            –
            <span className="font-bold text-slate-700">
              {Math.min(currentPage * rowsPerPage, filteredOrders.length)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">{filteredOrders.length}</span>{" "}
            pesanan
          </p>
          <PaginationControls
            currentPage={currentPage}
            totalPages={Math.ceil(filteredOrders.length / rowsPerPage) || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsSidebar
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
