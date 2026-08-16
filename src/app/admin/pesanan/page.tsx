"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Filter,
  Download,
  Store,
  User,
  Search,
  Copy,
  Check,
  X,
  Package,
  FileText,
} from "lucide-react";
import PaginationControls from "@/components/pagination";
import { getAllTransaksi, type Order, type OrderItem } from "../../../lib/actions/transaksi";
import { CustomMonthSelect } from "@/components/admin/CustomMonthSelect";
import { CustomRowSelect } from "@/components/admin/CustomRowSelect";
import { exportToExcel } from "@/lib/export";

const monthsList = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const CopyableOrderId = React.memo(function CopyableOrderId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  return (
    <button
      onClick={handleCopy}
      title="Salin ID Pesanan"
      className="flex items-center gap-2 group/copy text-left focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light rounded-sm transition-all active:scale-95 cursor-pointer"
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
});

const ColumnFilterDropdown = React.memo(function ColumnFilterDropdown({
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
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="inline-flex items-center justify-center gap-1.5 hover:text-ocean-dark transition-colors focus:outline-none cursor-pointer"
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
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-3 py-2 border-b border-slate-100 mb-1 sticky top-0 bg-white z-10">
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
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors hover:bg-slate-50 cursor-pointer ${
                  isSelected ? "text-ocean-dark bg-ocean-light/5" : "text-slate-600"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-ocean-dark" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

const OrderDetailsSidebar = React.memo(function OrderDetailsSidebar({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-112.5 bg-white shadow-2xl z-101 flex flex-col animate-in slide-in-from-right fade-in duration-300">
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
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-slate-500 shrink-0">Alamat Pengiriman</span>
                <span className="text-sm font-semibold text-slate-700 text-right">
                  {order.customerAddress || "-"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4 text-slate-400" />
              Informasi Toko & Waktu
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Toko</span>
                <span
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    order.storeType === "flagship" ? "text-ocean-dark" : "text-slate-700"
                  }`}
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

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
              Produk Dipesan
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100">
              {order.items.map((item: OrderItem, idx: number) => (
                <div key={idx} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {item.qty} x {item.price}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </>
  );
});

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [orderMonth, setOrderMonth] = useState(
    `${monthsList[new Date().getMonth()]} ${new Date().getFullYear()}`
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await getAllTransaksi();
        if (res.success && res.orders && res.orders.length > 0) {
          setOrders(res.orders as Order[]);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, paymentFilter, statusFilter, storeFilter, rowsPerPage]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.storeName.toLowerCase().includes(search.toLowerCase());
      const matchPayment = paymentFilter
        ? order.paymentMethod.toLowerCase().includes(paymentFilter.toLowerCase())
        : true;
      const matchStatus = statusFilter ? order.status === statusFilter : true;
      const matchStore = storeFilter ? order.storeType === storeFilter : true;
      return matchSearch && matchPayment && matchStatus && matchStore;
    });
  }, [orders, search, paymentFilter, statusFilter, storeFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const handleExport = useCallback(() => {
    const data = filteredOrders.map((order, index) => ({
      "No": index + 1,
      "ID Pesanan": order.id,
      "Tanggal": order.dateStr,
      "Pelanggan": order.customerName,
      "Toko": order.storeName,
      "Tipe Toko": order.storeType === "flagship" ? "Jasuda" : "Mitra",
      "Nominal": order.totalAmount,
      "Pembayaran": order.paymentMethod,
      "Status": order.status,
    }));
    exportToExcel(data, `Laporan_Pesanan_${orderMonth.replace(" ", "_")}`);
  }, [filteredOrders, orderMonth]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  }, [filteredOrders.length, rowsPerPage]);

  const handleCloseSidebar = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Riwayat Pesanan
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Kelola dan lacak semua transaksi dari Jasuda maupun Mitra dalam satu tempat.
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
            <CustomRowSelect value={rowsPerPage} onChange={setRowsPerPage} options={[10, 30, 50, 100]} className="w-32" />
            <CustomMonthSelect value={orderMonth} onChange={setOrderMonth} className="w-56" />

            <button 
              onClick={handleExport}
              className="flex h-10 items-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span className="text-sm font-bold whitespace-nowrap text-white">
                Ekspor Laporan
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-95">
          <table className="w-full text-left border-collapse min-w-175">
            <thead className="relative z-20">
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
                  Pembayaran
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 relative z-10">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-80 align-middle text-center text-slate-500 font-bold text-sm">
                    <div className="flex flex-col items-center justify-center gap-2.5 h-full">
                      <Package className="w-12 h-12 text-slate-300 stroke-[1.5]" />
                      <span className="text-slate-500 font-bold text-sm">Data tidak ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/80 transition-colors duration-300 group cursor-pointer"
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
                        className={`text-sm font-bold ${
                          order.storeType === "flagship" ? "text-ocean-dark" : "text-slate-700"
                        }`}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsSidebar order={selectedOrder} onClose={handleCloseSidebar} />
      )}
    </>
  );
}
