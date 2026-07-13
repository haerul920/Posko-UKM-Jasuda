"use client";

import { useState, useEffect } from "react";
import {
  Download,
  UserPlus,
  Users,
  X,
  Mail,
  Edit,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  Phone,
  MapPin,
  Search,
  Trash,
} from "lucide-react";
import { Client } from "@/types/firebase";
import { deleteClient, getAllClients, toggleFavorite } from "@/lib/actions/client";
import AddMitraDrawer from "@/components/mitra/addForm";
import EditMitraDrawer from "@/components/mitra/editForm";
import Loading from "@/components/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns'

// --- Pagination Controls Component ---
function PaginationControls({
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

export default function AdminCRMPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [clientsData, setClientsData] = useState<Client[] | []>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const client = await getAllClients();
      setClientsData(client.clients ?? []);
      setIsLoading(false)
    })();
  }, []);

  const activeClient = clientsData.find((c) => c.id === selectedClient) || null;

  const [contactClient, setContactClient] = useState<string | null>(null);
  const activeContactClient = clientsData.find((c) => c.id === contactClient);

  const filteredAndSortedClients = clientsData
    .filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aFav = a.id ? favorites.includes(a.id) : false;
      const bFav = b.id ? favorites.includes(b.id) : false;
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedClients.length / itemsPerPage));
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDeleteMitra = async (clientId: string) => {
    setIsLoading(true);

    const result = await deleteClient(clientId);

    if (result.success) {
      setClientsData((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );
    } else {
      console.error(result.error);
    }

    setIsLoading(false);
  };

  const handleToggleFavorite = async (client: Client) => {
    setClientsData((prev) =>
      prev.map((c) =>
        c.id === client.id ? { ...c, favorite: !c.favorite } : c
      ).sort((a, b) => Number(b.favorite) - Number(a.favorite))
    );

    const result = await toggleFavorite(client.id ?? "", client.favorite);

    if (!result.success) {
      setClientsData((prev) =>
        prev.map((c) =>
          c.id === client.id ? { ...c, favorite: client.favorite } : c
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
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm cursor-pointer hover:shadow-md"
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
            <p className="text-3xl font-bold text-slate-900">{clientsData.length}</p>
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
            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="h-75">
                    <Loading title="Memuat mitra" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100">
                {paginatedClients.map((client, index) => (
                  <tr
                    key={client.id}
                    className={`hover:bg-slate-50/80 transition-colors duration-300 group cursor-pointer ${client.id && favorites.includes(client.id) ? "bg-amber-50/30" : ""
                      }`}
                  >
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {client.img ? (
                          <img
                            src={client.img}
                            alt={client.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 shadow-sm">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                            {client.name}
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {client.corp}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-slate-900 font-medium text-sm">
                        {client.email}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {client.phone}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                      {format(client.createdAt?.toDateString() || "", "d-M-y")}
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                      {client.productsCount}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (client.id) handleToggleFavorite(client);
                          }}
                          className={`p-2 rounded-lg transition-all active:scale-[0.98] shadow-sm ${client.id && client.favorite
                            ? "text-amber-500 hover:text-slate-400 hover:bg-white"
                            : "text-slate-400 hover:text-amber-500 hover:bg-white"
                            }`}
                        >
                          <Star
                            className={`w-4 h-4 ${client.id && favorites.includes(client.id) ? "fill-current" : ""
                              }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContactClient(client.id || null);
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                          title="Hubungi"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClient(client.id || null);
                          }}
                          className="p-2 text-slate-400 hover:text-ocean-light hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger render={
                            <button
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          } />
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl">Yakin ingin menghapus data <span className="font-bold">{client.name}</span>?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Aksi ini akan menghapus data secara permanen dari database sehingga kamu harus menambahkannya ulang secara manual.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:bg-black/5 transition-all cursor-pointer">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMitra(client.id ?? "")} className="bg-red-600 hover:bg-red-500 transition-all cursor-pointer border border-red-800  text-white">Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
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
              {Math.min(currentPage * itemsPerPage, clientsData.length)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">{clientsData.length}</span>{" "}
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
        isOpen={!!selectedClient}
        client={activeClient}
        onClose={() => setSelectedClient(null)}
        onEditSuccess={(updatedClient) => {
          setClientsData((prev) =>
            prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
          );
        }}
      />

      <AddMitraDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onAddSuccess={(newMitra) => {
          setClientsData((prev) => [...prev, newMitra]);
        }}
      />
      {/* Contact Mitra Drawer Overlay */}
      {contactClient && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setContactClient(null)}
        ></div>
      )}

      {/* Contact Mitra Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${contactClient ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeContactClient && (
          <div className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Hubungi Mitra</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                onClick={() => setContactClient(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-between">
              <div className="space-y-8">
                {/* Profile Card Header */}
                <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  {activeContactClient.img ? (
                    <img
                      src={activeContactClient.img}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-4"
                      alt={activeContactClient.name}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md mb-4">
                      {activeContactClient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {activeContactClient.name}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    {activeContactClient.corp}
                  </p>
                </div>

                {/* Bank Account Info Card */}
                {(activeContactClient.bankName || activeContactClient.bankAccount) && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-left text-sm shadow-inner">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                        Informasi Bank &amp; No. Rekening
                      </p>
                      <p className="font-bold text-slate-800">
                        {activeContactClient.bankName || "-"}
                      </p>
                      <p className="font-mono text-slate-600 text-xs mt-0.5">
                        No. Rek: {activeContactClient.bankAccount || "-"}
                      </p>
                    </div>
                    <span
                      onClick={() => {
                        if (activeContactClient.bankAccount) {
                          navigator.clipboard.writeText(activeContactClient.bankAccount);
                          alert("Nomor rekening berhasil disalin!");
                        }
                      }}
                      className="p-2 bg-white rounded-lg text-slate-500 font-mono text-xs border border-slate-200 shadow-sm hover:bg-slate-50 cursor-pointer select-none"
                      title="Salin No Rekening"
                    >
                      Salin
                    </span>
                  </div>
                )}

                {/* Legal & Business Details Card */}
                <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 text-left space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Legalitas &amp; Jenis Usaha
                  </h4>
                  {activeContactClient.businessDesc && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase">Deskripsi Jenis Usaha</p>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{activeContactClient.businessDesc}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {activeContactClient.siupNumber && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">No. SIUP</p>
                        <p className="text-xs font-medium text-slate-800 mt-0.5">{activeContactClient.siupNumber}</p>
                      </div>
                    )}
                    {activeContactClient.npwpNumber && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">NPWP</p>
                        <p className="text-xs font-medium text-slate-800 mt-0.5">{activeContactClient.npwpNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {activeContactClient.tdpNumber && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">No. TDP</p>
                        <p className="text-xs font-medium text-slate-800 mt-0.5">{activeContactClient.tdpNumber}</p>
                      </div>
                    )}
                    {activeContactClient.pirtNumber && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">No. PIRT</p>
                        <p className="text-xs font-medium text-slate-800 mt-0.5">{activeContactClient.pirtNumber}</p>
                      </div>
                    )}
                  </div>
                  {activeContactClient.googleMapsLink && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <a
                        href={activeContactClient.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-light hover:text-ocean-dark transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Lihat Peta Mitra di Google Maps &rarr;
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Options UI */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 pl-1">
                    Pilih Metode Komunikasi
                  </p>

                  {/* Email Button */}
                  <a
                    href={`mailto:${activeContactClient.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-105 transition-transform shadow-inner">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          Kirim Email Resmi
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {activeContactClient.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Buka &rarr;
                    </span>
                  </a>

                  {/* Phone Button */}
                  <a
                    href={`tel:${activeContactClient.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-105 transition-transform shadow-inner">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Hubungi Telepon / HP
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {activeContactClient.phone}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                      Hubungi &rarr;
                    </span>
                  </a>
                </div>
              </div>

              {/* Close Footer Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setContactClient(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all duration-300 active:scale-[0.98] border border-slate-200"
                >
                  Tutup Kontak
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
