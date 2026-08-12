"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
    Download,
    UserPlus,
    Users,
    Package,
    Search,
    ChevronDown,
    Check,
    List,
} from "lucide-react";

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
    const [isOpen, useStateIsOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label || label;

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => useStateIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => useStateIsOpen(false), 200)}
                className={`inline-flex items-center justify-between gap-2 bg-white border rounded-xl h-10 px-4 min-w-30 text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer focus:outline-none ${isOpen
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
                <div 
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200"
                    onMouseDown={(e) => e.preventDefault()}
                >
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
                                    useStateIsOpen(false);
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

import { deleteMitra, Mitra, toggleFavorite } from "@/lib/actions/mitra";
import AddMitraDrawer from "@/app/admin/mitra/_components/addForm";
import EditMitraDrawer from "@/app/admin/mitra/_components/editForm";
import { formatClientDate } from "@/lib/date";
import PaginationControls from "@/components/pagination";
import TableActionButtons from "@/components/tableActionButtons";
import MitraDetailSidebar from "@/app/admin/mitra/_components/MitraDetailSidebar";
import { useStore } from "@/components/context/StoreContext";

interface Props {
    initialMitra: Mitra[];
    totalMitraProducts?: number;
}

export default function Mitramitra({ initialMitra, totalMitraProducts }: Props) {
    const { user, role } = useStore();
    const [mitra, setmitra] = useState<Mitra[]>(initialMitra);

    const [selectedmitra, setSelectedmitra] = useState<string | null>(null);
    const [favorites, _] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

    const activeMitra = mitra.find((c) => c.id === selectedmitra);

    const [contactMitra, setContactMitra] = useState<string | null>(null);
    const activeContactmitra = mitra.find((c) => c.id === contactMitra);

    // Reset current page when searching
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const filteredAndSortedMitra = mitra
        .filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.corp.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.phone && item.phone.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const aFav = a.id ? favorites.includes(a.id) : false;
            const bFav = b.id ? favorites.includes(b.id) : false;
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedMitra.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);

    // Auto-adjust page if current page exceeds available total pages
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const paginatedmitra = filteredAndSortedMitra.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage,
    );

    const handleDeleteMitra = async (mitraId: string) => {
        const mitraToDelete = mitra.find((m) => m.id === mitraId);
        const actor = user
            ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
            : undefined;
        const result = await deleteMitra(mitraId, actor, mitraToDelete?.name);

        if (result.success) {
            setmitra((prevMitra) =>
                prevMitra.filter((mitra) => mitra.id !== mitraId)
            );
        } else {
            console.error(result.error);
        }
    };

    const handleToggleFavorite = async (mitra: Mitra) => {
        setmitra((prev) =>
            prev.map((c) =>
                c.id === mitra.id ? { ...c, favorite: !c.favorite } : c
            ).sort((a, b) => Number(b.favorite) - Number(a.favorite))
        );

        const result = await toggleFavorite(mitra.id, mitra.favorite);

        if (!result.success) {
            setmitra((prev) =>
                prev.map((c) =>
                    c.id === mitra.id ? { ...c, favorite: mitra.favorite } : c
                )
            );
        }
    };

    const handleExport = () => {
        const exportData = filteredAndSortedMitra.map((m, index) => ({
            "No": index + 1,
            "Nama Usaha": m.corp || m.name,
            "Nama Pemilik": m.name,
            "Email": m.email || "-",
            "No Telepon": m.phone || "-",
            "Kota/Lokasi": m.city || "-",
            "Alamat Lengkap": m.address || "-",
            "Deskripsi Bisnis": m.businessDesc || "-",
            "Jumlah Produk": m.productsCount,
            "Tanggal Registrasi": formatClientDate(m.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Mitra");

        worksheet["!cols"] = [
            { wch: 5 },  // No
            { wch: 30 }, // Nama Usaha
            { wch: 25 }, // Pemilik
            { wch: 30 }, // Email
            { wch: 20 }, // Telepon
            { wch: 20 }, // Kota
            { wch: 40 }, // Alamat
            { wch: 50 }, // Deskripsi
            { wch: 15 }, // Produk
            { wch: 20 }  // Registrasi
        ];

        XLSX.writeFile(workbook, "Data_Mitra_Jasuda.xlsx");
    };

    return (
        <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                        Direktori Mitra
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Kelola klien dan analisis seluruh jaringan mitra Anda.
                    </p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-900 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer hover:shadow-md"
                    >
                        <Download className="w-4 h-4" /> Ekspor
                    </button>
                    <button
                        onClick={() => setIsAddDrawerOpen(true)}
                        className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white font-bold text-sm rounded-lg px-5 transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0 cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah Mitra
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                            Total Mitra
                        </p>
                        <p className="text-3xl font-bold text-slate-900">{mitra.length}</p>
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            Aktif di Sistem Posko UKM
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-ocean-light group-hover:scale-105 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                            Total Produk Mitra
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                            {totalMitraProducts ?? 214}
                        </p>
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            Terdaftar &amp; Terhubung
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                        <Package className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, usaha, kota, atau email..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light focus:bg-white transition-all duration-300"
                    />
                </div>
                <div className="w-full md:w-auto flex flex-wrap gap-3">
                    <FilterDropdown
                        label="Baris"
                        value={itemsPerPage.toString()}
                        onChange={(val) => {
                            setItemsPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                        options={[
                            { label: "10 Baris", value: "10" },
                            { label: "30 Baris", value: "30" },
                            { label: "50 Baris", value: "50" },
                        ]}
                        icon={<List className="w-4 h-4 text-slate-400" />}
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-100/50 rounded-2xl shadow-sm hover:shadow-md overflow-hidden flex-1 flex flex-col transition-all duration-300">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-225">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                                    No
                                </th>
                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                                    Klien / UKM
                                </th>

                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                                    Registrasi
                                </th>
                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-right">
                                    Produk
                                </th>
                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedmitra.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-sm font-medium text-slate-400">
                                        {searchQuery
                                            ? "Tidak ada mitra yang cocok dengan kata kunci pencarian."
                                            : "Belum ada data mitra terdaftar."}
                                    </td>
                                </tr>
                            ) : (
                                paginatedmitra.map((mitraItem, index) => (
                                    <tr
                                        key={mitraItem.id}
                                        className={`hover:bg-slate-50/80 transition-colors duration-300 group ${favorites.includes(mitraItem.id) ? "bg-amber-50/30" : ""
                                            }`}
                                    >
                                        <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                            {(safePage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {mitraItem.img ? (
                                                    <img
                                                        src={mitraItem.img}
                                                        alt={mitraItem.name}
                                                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-xs">
                                                        {mitraItem.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors flex items-center gap-1">
                                                        {mitraItem.gender && (
                                                            <span className="text-xs text-slate-400 font-normal">{mitraItem.gender}.</span>
                                                        )}
                                                        {mitraItem.name}
                                                    </p>
                                                    <p className="text-xs font-semibold text-ocean-light mt-0.5">
                                                        {mitraItem.corp}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Registrasi Date using Client Local Timezone */}
                                        <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                            {formatClientDate(mitraItem.createdAt)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                                            {mitraItem.productsCount}
                                        </td>
                                        <td className="py-4 px-6">
                                            <TableActionButtons
                                                onToggleFavorite={(item) => handleToggleFavorite(item)}
                                                onDelete={(item) => handleDeleteMitra(item.id)}
                                                onEdit={(item) => setSelectedmitra(item.id)}
                                                onContact={(item) => setContactMitra(item.id)}
                                                item={mitraItem}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-700">
                            {filteredAndSortedMitra.length === 0 ? 0 : (safePage - 1) * itemsPerPage + 1}
                        </span>
                        –
                        <span className="font-bold text-slate-700">
                            {Math.min(safePage * itemsPerPage, filteredAndSortedMitra.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-700">{filteredAndSortedMitra.length}</span>{" "}
                        mitra
                    </p>
                    <PaginationControls
                        currentPage={safePage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>

            <EditMitraDrawer
                isOpen={!!selectedmitra}
                mitra={activeMitra}
                onClose={() => setSelectedmitra(null)}
                onEditSuccess={(updatedmitra) => {
                    setmitra((prev) =>
                        prev.map((c) => (c.id === updatedmitra.id ? updatedmitra : c))
                    );
                }}
            />

            <AddMitraDrawer
                isOpen={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                onAddSuccess={(newMitra) => {
                    setmitra((prev) => [newMitra, ...prev]);
                }}
            />
            {/* Contact Mitra Drawer Overlay */}
            {contactMitra && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setContactMitra(null)}
                ></div>
            )}

            {/* Contact Mitra Drawer */}
            <MitraDetailSidebar isOpen={contactMitra} activeContactMitra={activeContactmitra} onClose={() => setContactMitra(null)} />
        </div>
    );
}
