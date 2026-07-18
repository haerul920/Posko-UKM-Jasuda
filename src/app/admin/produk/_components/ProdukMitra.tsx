"use client";

import { useState, useTransition } from "react";
import {
    Download,
    Plus,
    TrendingUp,
    AlertTriangle,
    Store,
    Search,
    Check,
    ChevronDown,
    List,
} from "lucide-react";
import { deleteProduct, toggleProductFavorite } from "@/lib/actions/product";
import type { Product } from "@/lib/actions/product";
import type { MitraSelectOption } from "@/lib/actions/mitra";

import InventarisTable from "./ProdukTable";
import AddProductDrawer from "@/app/admin/produk/_components/AddForm";
import EditProductDrawer from "@/app/admin/produk/_components/EditForm";
import PaginationControls from "@/components/Pagination";

// --- Custom Filter Dropdown ---
function FilterDropdown({
    value,
    onChange,
    label,
    options,
    icon,
}: {
    value: string;
    onChange: (val: string) => void;
    label: string;
    options: { label: string; value: string }[];
    icon?: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label || label;

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`inline-flex items-center justify-between gap-2 bg-white border rounded-xl h-10 px-4 min-w-[120px] text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer focus:outline-none ${isOpen
                    ? "border-ocean-light ring-2 ring-ocean-light/30 text-ocean-dark"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="truncate">{selectedLabel}</span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-ocean-dark" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 z-120 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {label}
                        </span>
                    </div>
                    {options.map((opt) => {
                        const isSelected = value === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold transition-colors hover:bg-slate-50 ${isSelected
                                    ? "text-ocean-dark bg-ocean-light/5"
                                    : "text-slate-600"
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

interface Props {
    initialProducts: Product[];
    initialMitra: MitraSelectOption[];
}

export default function InventarisClient({ initialProducts, initialMitra }: Props) {
    const [productsData, setProductsData] = useState<Product[]>(initialProducts);
    const [activeTab, setActiveTab] = useState<"jasuda" | "tenant">("jasuda");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState<"semua" | "tersedia" | "habis">("semua");
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<string[]>(
        initialProducts.filter((p) => p.favorite).map((p) => p.id)
    );

    const [, startDeleteTransition] = useTransition();

    // --- Derived data ---
    const allProducts = productsData;

    const tabProducts = productsData.filter((p) => {
        if (activeTab === "jasuda") {
            return p.client_id === "jasuda";
        } else {
            return p.client_id !== "jasuda";
        }
    });

    const searchFiltered = tabProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stockFiltered = searchFiltered.filter((p) => {
        if (stockFilter === "tersedia") return p.stock > 0;
        if (stockFilter === "habis") return p.stock === 0;
        return true;
    });

    const sortedProducts = [...stockFiltered].sort((a, b) => {
        const aFav = favorites.includes(a.id);
        const bFav = favorites.includes(b.id);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Handlers ---
    const handleTabChange = (tab: "jasuda" | "tenant") => {
        setActiveTab(tab);
        setCurrentPage(1);
        setSearchQuery("");
    };

    const handleStockFilterChange = (filter: "semua" | "tersedia" | "habis") => {
        setStockFilter(filter);
        setCurrentPage(1);
    };

    const handleToggleFavorite = async (id: string) => {
        const currentStatus = favorites.includes(id);

        // Optimistic update
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );

        try {
            const res = await toggleProductFavorite(id, currentStatus);
            if (!res.success) {
                // Rollback on failure
                setFavorites((prev) =>
                    currentStatus ? [...prev, id] : prev.filter((fid) => fid !== id)
                );
                alert(res.error || "Gagal mengubah status favorit produk.");
            }
        } catch (err) {
            console.error(err);
            // Rollback on failure
            setFavorites((prev) =>
                currentStatus ? [...prev, id] : prev.filter((fid) => fid !== id)
            );
            alert("Terjadi kesalahan saat mengubah status favorit produk.");
        }
    };

    const handleDelete = (product: Product) => {
        // Optimistic update
        setProductsData((prev) => prev.filter((p) => p.id !== product.id));

        startDeleteTransition(async () => {
            const result = await deleteProduct(product.id);
            if (!result.success) {
                // Rollback on failure
                setProductsData((prev) => [product, ...prev]);
                console.error("[handleDelete]", (result as any).error);
            }
        });
    };

    const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock < lowStockThreshold).length;
    const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

    return (
        <>
            {/* Page Header */}
            <header id="inventory-page-header" className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                        Manajemen Produk
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        Kelola katalog utama Anda dan tingkat stok vendor.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
                    <button className="flex h-10 items-center gap-2 bg-white text-slate-700 font-bold text-sm rounded-lg border border-slate-200 px-5 hover:bg-slate-50 hover:text-ocean-dark transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md shrink-0">
                        <Download className="w-4 h-4" />
                        <span className="whitespace-nowrap">Ekspor</span>
                    </button>
                    <button
                        id="btn-tambah-produk"
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white font-bold text-sm rounded-lg px-5 transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="whitespace-nowrap">Tambah Produk</span>
                    </button>
                </div>
            </header>

            {/* Analytics Cards */}
            <section id="inventory-analytics" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                {/* Total Products */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:scale-105 transition-transform">
                            <Store className="text-ocean-light w-6 h-6" />
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> 12%
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Produk</p>
                        <h3 className="text-3xl font-bold text-slate-900">{allProducts.length}</h3>
                    </div>
                </div>

                {/* Low Stock */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-rose-50 rounded-lg group-hover:scale-105 transition-transform">
                            <AlertTriangle className="text-rose-600 w-6 h-6" />
                        </div>
                        <select
                            value={lowStockThreshold}
                            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                            className="bg-white border border-rose-200 rounded-xl py-1.5 px-3 pr-7 text-xs font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300/50 outline-none cursor-pointer transition-all hover:border-rose-300 appearance-none shadow-sm"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23e11d48' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: "right 0.35rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1em 1em",
                            }}
                        >
                            <option value={5}>&lt; 5</option>
                            <option value={10}>&lt; 10</option>
                            <option value={15}>&lt; 15</option>
                            <option value={20}>&lt; 20</option>
                            <option value={25}>&lt; 25</option>
                            <option value={50}>&lt; 50</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Peringatan Stok Rendah</p>
                        <h3 className="text-3xl font-bold text-slate-900">{lowStockCount}</h3>
                    </div>
                </div>

                {/* Out of Stock */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-105 transition-transform">
                            <Store className="text-slate-400 w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Stok Habis</p>
                        <h3 className="text-3xl font-bold text-slate-900">{outOfStockCount}</h3>
                    </div>
                </div>
            </section>

            {/* Data Table Card */}
            <section
                id="inventory-data-table"
                className="bg-white rounded-2xl border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
                {/* Filters */}
                <div className="p-6 border-b border-slate-200 bg-white">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        {/* Search */}
                        <div className="relative w-full sm:w-56 shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                id="inventory-search"
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl h-10 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                            />
                        </div>

                        {/* Right-side filters */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <FilterDropdown
                                value={String(lowStockThreshold)}
                                onChange={(val) => setLowStockThreshold(Number(val))}
                                label="Stok Rendah"
                                options={[
                                    { label: "Stok < 5", value: "5" },
                                    { label: "Stok < 10", value: "10" },
                                    { label: "Stok < 15", value: "15" },
                                    { label: "Stok < 20", value: "20" },
                                    { label: "Stok < 25", value: "25" },
                                    { label: "Stok < 50", value: "50" },
                                ]}
                            />
                            <FilterDropdown
                                value={stockFilter}
                                onChange={(val) =>
                                    handleStockFilterChange(val as "semua" | "tersedia" | "habis")
                                }
                                label="Status Produk"
                                options={[
                                    { label: "Semua", value: "semua" },
                                    { label: "Tersedia", value: "tersedia" },
                                    { label: "Habis", value: "habis" },
                                ]}
                            />
                            <FilterDropdown
                                value={String(itemsPerPage)}
                                onChange={(val) => {
                                    setItemsPerPage(Number(val));
                                    setCurrentPage(1);
                                }}
                                label="Tampilkan"
                                options={[
                                    { label: "10 Baris", value: "10" },
                                    { label: "30 Baris", value: "30" },
                                    { label: "50 Baris", value: "50" },
                                    { label: "100 Baris", value: "100" },
                                ]}
                                icon={<List className="w-4 h-4 text-slate-400" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="flex overflow-x-auto">
                        <button
                            id="tab-jasuda"
                            onClick={() => handleTabChange("jasuda")}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "jasuda"
                                ? "text-ocean-dark border-b-2 border-ocean-dark bg-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-b-2 border-transparent"
                                }`}
                        >
                            Produk Jasuda
                        </button>
                        <button
                            id="tab-mitra"
                            onClick={() => handleTabChange("tenant")}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === "tenant"
                                ? "text-ocean-dark border-b-2 border-ocean-dark bg-white"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-b-2 border-transparent"
                                }`}
                        >
                            Produk Mitra
                        </button>
                    </div>
                    <div className="pr-4">
                        <span className="text-xs font-semibold text-slate-400">
                            {sortedProducts.length} produk
                        </span>
                    </div>
                </div>

                {/* Table */}
                <InventarisTable
                    products={paginatedProducts}
                    activeTab={activeTab}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    lowStockThreshold={lowStockThreshold}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={setEditingProduct}
                    onDelete={handleDelete}
                />

                {/* Pagination Footer */}
                {sortedProducts.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Menampilkan{" "}
                            <span className="font-bold text-slate-700">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>
                            –
                            <span className="font-bold text-slate-700">
                                {Math.min(currentPage * itemsPerPage, sortedProducts.length)}
                            </span>{" "}
                            dari{" "}
                            <span className="font-bold text-slate-700">
                                {sortedProducts.length}
                            </span>{" "}
                            produk
                        </p>
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </section>

            {/* Add Drawer */}
            <AddProductDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                mitra={initialMitra}
                onAddSuccess={(newId, newProductPayload) => {
                    setProductsData((prev) => [
                        {
                            id: newId,
                            ...newProductPayload,
                        } as unknown as Product,
                        ...prev,
                    ]);
                }}
            />

            {/* Edit Drawer */}
            <EditProductDrawer
                isOpen={!!editingProduct}
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                mitra={initialMitra}
                onEditSuccess={(updatedProduct) => {
                    setProductsData((prev) =>
                        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                    );
                    setEditingProduct(null);
                }}
                onDeleteSuccess={(productId) => {
                    if (editingProduct) {
                        handleDelete(editingProduct);
                    }
                    setEditingProduct(null);
                }}
            />

            {/* Animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
}
