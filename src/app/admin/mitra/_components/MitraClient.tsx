"use client";

import { useState } from "react";
import {
    Download,
    UserPlus,
    Users,
    Package,
    Search,
} from "lucide-react";

import { deleteMitra, Mitra, toggleFavorite } from "@/lib/actions/mitra";
import AddMitraDrawer from "@/app/admin/mitra/_components/AddForm";
import EditMitraDrawer from "@/app/admin/mitra/_components/EditForm";
import { format } from 'date-fns'
import PaginationControls from "@/components/Pagination";
import TableActionButtons from "@/components/TableActionButtons";
import MitraDetailSidebar from "@/app/admin/mitra/_components/MitraDetailSidebar";
import { useStore } from "@/components/context/StoreContext";

interface Props {
    initialMitra: Mitra[];
}

export default function Mitramitra({ initialMitra }: Props) {
    const { user, role } = useStore();
    const [mitra, setmitra] = useState<Mitra[]>(initialMitra);


    const [selectedmitra, setSelectedmitra] = useState<string | null>(null);
    const [favorites, _] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

    const activeMitra = mitra.find((c) => c.id === selectedmitra);

    const [contactMitra, setContactMitra] = useState<string | null>(null);
    const activeContactmitra = mitra.find((c) => c.id === contactMitra);

    const filteredAndSortedMitra = mitra
        .filter((mitra) =>
            mitra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mitra.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aFav = a.id ? favorites.includes(a.id) : false;
            const bFav = b.id ? favorites.includes(b.id) : false;
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            return 0;
        });

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedMitra.length / itemsPerPage));
    const paginatedmitra = filteredAndSortedMitra.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
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
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-900 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer hover:shadow-md">
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
                            +5.2% bulan ini
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-ocean-light group-hover:scale-105 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
                    <div>
                        <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                            Total Produk
                        </p>
                        <p className="text-3xl font-bold text-slate-900">20</p>
                        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            +1.8% bulan ini
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                        <Package className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email mitra..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
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
                                    Klien
                                </th>
                                <th className="py-4 px-6 text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                                    Kontak
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
                            {paginatedmitra.map((mitra, index) => (
                                <tr
                                    key={mitra.id}
                                    onClick={() => {
                                        setContactMitra(mitra.id);
                                    }}
                                    className={`hover:bg-slate-50/80 transition-colors duration-300 group cursor-pointer ${favorites.includes(mitra.id) ? "bg-amber-50/30" : ""
                                        }`}
                                >
                                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            {mitra.img ? (
                                                <img
                                                    src={mitra.img}
                                                    alt={mitra.name}
                                                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-sm">
                                                    {mitra.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                                                    {mitra.name}
                                                </p>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">
                                                    {mitra.corp}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-slate-900 font-medium text-sm">
                                            {mitra.email}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                                            {mitra.phone}
                                        </p>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                                        {format(mitra.createdAt?.toDateString() || "", "d-M-y")}
                                    </td>
                                    <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                                        {mitra.productsCount}
                                    </td>
                                    <td className="py-4 px-6">
                                        <TableActionButtons
                                            onToggleFavorite={(item) => handleToggleFavorite(item)}
                                            onDelete={(item) => handleDeleteMitra(item.id)}
                                            onEdit={(item) => setSelectedmitra(item.id)}
                                            onContact={(item) => setSelectedmitra(item.id)}
                                            item={mitra}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-700">
                            {(currentPage - 1) * itemsPerPage + 1}
                        </span>
                        –
                        <span className="font-bold text-slate-700">
                            {Math.min(currentPage * itemsPerPage, mitra.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-700">{mitra.length}</span>{" "}
                        mitra
                    </p>
                    <PaginationControls
                        currentPage={currentPage}
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
                    setmitra((prev) => [...prev, newMitra]);
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
