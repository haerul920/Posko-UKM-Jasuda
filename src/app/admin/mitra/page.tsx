"use client";

import React, { useState, useRef } from "react";
import {
  Download,
  UserPlus,
  Users,
  Wallet,
  Activity,
  X,
  Mail,
  Edit,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
  Camera,
  Phone,
  Check,
  MapPin,
  Search,
} from "lucide-react";

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

interface Client {
  id: string;
  name: string;
  corp: string;
  email: string;
  phone: string;
  productsCount: number;
  status: string;
  img: string | null;
  bankName: string;
  bankAccount: string;
  businessDesc: string;
  siupNumber: string;
  npwpNumber: string;
  tdpNumber: string;
  pirtNumber: string;
  googleMapsLink: string;
}

const initialClients: Client[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    corp: "Horizon Tech",
    email: "s.jenkins@horizon.io",
    phone: "+1 (555) 019-2834",
    productsCount: 8,
    status: "VIP",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1yMXQzeigm_M3a9IlDAD1ulc2bUe_a60__sB9kpNUJFK4DX2LkyT1sPLe0njbh5JcCfd6cXSy1T1tx1POI6jvqImmEHASQtHZBA_BGJrR0WBXMxvQThy6Mr7CKj3ZAWy07UVO0iL3EGekpaeXJQR2btKiDtm1C35Wa9OtizJ7CMfbUw9octrwPBJPUM3bsf255zbnZ6RvKFPLutmpiyEDAaOb0NIlypkOHiT-S3ID1O1Ukz1U-ynaWw",
    bankName: "Bank BNI",
    bankAccount: "0123456789",
    businessDesc: "Supplier bahan pangan seaweed berkualitas tinggi untuk industri kosmetik dan makanan.",
    siupNumber: "SIUP/2026/099812",
    npwpNumber: "09.254.123.4-012.000",
    tdpNumber: "TDP-9988112233",
    pirtNumber: "P-IRT No. 202673019283-21",
    googleMapsLink: "https://maps.google.com/?q=Horizon+Tech",
  },
  {
    id: "2",
    name: "Marcus Reyes",
    corp: "Retail Customer",
    email: "mreyes88@gmail.com",
    phone: "+1 (555) 832-1104",
    productsCount: 4,
    status: "Aktif",
    img: null,
    bankName: "Bank Mandiri",
    bankAccount: "1122334455",
    businessDesc: "Distributor lokal seaweed kering dan olahan pangan sehat.",
    siupNumber: "SIUP/2025/110948",
    npwpNumber: "81.992.881.3-401.000",
    tdpNumber: "TDP-8877112244",
    pirtNumber: "P-IRT No. 509283748291-23",
    googleMapsLink: "https://maps.google.com/?q=Retail+Customer",
  },
  {
    id: "3",
    name: "David Chen",
    corp: "Apex Logistics",
    email: "d.chen@apex.com",
    phone: "+1 (555) 443-9092",
    productsCount: 12,
    status: "Enterprise",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBupViQX8D_W3HbIvJC7TpJ3ymBvsr68r2-X7ADLtiEe5Pt6lfF0OYQVGikeBbyN-58a4vIoapyKEQFi_xeG5FpTHZBNBaOjgD8PDK0clKFCyHBPAKW199cJuM5ysEQukBpvuBuOpJiivt6fP13rhaBbsyb_MxqoPnjopKCFilO7v-6I4iFraaxdVP5wRy57dIoCjeWBGHYNBjGmVc3ZnMUeKycBOrlO3vcXh9lAAuQ0TocMHk9d72bGw",
    bankName: "Bank BCA",
    bankAccount: "888223344",
    businessDesc: "Penyedia logistik seaweed skala ekspor dengan fasilitas cold storage modern.",
    siupNumber: "SIUP/2026/001928",
    npwpNumber: "02.345.678.9-012.000",
    tdpNumber: "TDP-0011223344",
    pirtNumber: "P-IRT No. 102938475610-22",
    googleMapsLink: "https://maps.google.com/?q=Apex+Logistics",
  },
];

export default function AdminCRMPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [clientsData, setClientsData] = useState<Client[]>(initialClients);

  // Add Form State
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [addMitraImg, setAddMitraImg] = useState<string | null>(null);
  const [addMitraName, setAddMitraName] = useState("");
  const [addMitraCorp, setAddMitraCorp] = useState("");
  const [addMitraEmail, setAddMitraEmail] = useState("");
  const [addMitraPhone, setAddMitraPhone] = useState("");
  const [addMitraStatus, setAddMitraStatus] = useState("Aktif");
  const [addMitraBankName, setAddMitraBankName] = useState("");
  const [addMitraBankAccount, setAddMitraBankAccount] = useState("");
  const [addMitraBusinessDesc, setAddMitraBusinessDesc] = useState("");
  const [addMitraSiupNumber, setAddMitraSiupNumber] = useState("");
  const [addMitraNpwpNumber, setAddMitraNpwpNumber] = useState("");
  const [addMitraTdpNumber, setAddMitraTdpNumber] = useState("");
  const [addMitraPirtNumber, setAddMitraPirtNumber] = useState("");
  const [addMitraGoogleMapsLink, setAddMitraGoogleMapsLink] = useState("");

  const addMitraFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Form State
  const [editMitraImg, setEditMitraImg] = useState<string | null>(null);
  const [editMitraName, setEditMitraName] = useState("");
  const [editMitraCorp, setEditMitraCorp] = useState("");
  const [editMitraEmail, setEditMitraEmail] = useState("");
  const [editMitraPhone, setEditMitraPhone] = useState("");
  const [editMitraStatus, setEditMitraStatus] = useState("");
  const [editMitraBankName, setEditMitraBankName] = useState("");
  const [editMitraBankAccount, setEditMitraBankAccount] = useState("");
  const [editMitraBusinessDesc, setEditMitraBusinessDesc] = useState("");
  const [editMitraSiupNumber, setEditMitraSiupNumber] = useState("");
  const [editMitraNpwpNumber, setEditMitraNpwpNumber] = useState("");
  const [editMitraTdpNumber, setEditMitraTdpNumber] = useState("");
  const [editMitraPirtNumber, setEditMitraPirtNumber] = useState("");
  const [editMitraGoogleMapsLink, setEditMitraGoogleMapsLink] = useState("");

  const mitraFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMitraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddMitraImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMitra = (e: React.FormEvent) => {
    e.preventDefault();
    const newMitra: Client = {
      id: String(clientsData.length + 1),
      name: addMitraName,
      corp: addMitraCorp,
      email: addMitraEmail,
      phone: addMitraPhone,
      productsCount: 0,
      status: addMitraStatus,
      img: addMitraImg,
      bankName: addMitraBankName,
      bankAccount: addMitraBankAccount,
      businessDesc: addMitraBusinessDesc,
      siupNumber: addMitraSiupNumber,
      npwpNumber: addMitraNpwpNumber,
      tdpNumber: addMitraTdpNumber,
      pirtNumber: addMitraPirtNumber,
      googleMapsLink: addMitraGoogleMapsLink,
    };
    setClientsData((prev) => [...prev, newMitra]);
    setIsAddDrawerOpen(false);
  };

  const startEditingMitra = (client: Client) => {
    setSelectedClient(client.id);
    setEditMitraImg(client.img);
    setEditMitraName(client.name);
    setEditMitraCorp(client.corp);
    setEditMitraEmail(client.email);
    setEditMitraPhone(client.phone);
    setEditMitraStatus(client.status);
    setEditMitraBankName(client.bankName || "");
    setEditMitraBankAccount(client.bankAccount || "");
    setEditMitraBusinessDesc(client.businessDesc || "");
    setEditMitraSiupNumber(client.siupNumber || "");
    setEditMitraNpwpNumber(client.npwpNumber || "");
    setEditMitraTdpNumber(client.tdpNumber || "");
    setEditMitraPirtNumber(client.pirtNumber || "");
    setEditMitraGoogleMapsLink(client.googleMapsLink || "");
  };

  const handleMitraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMitraImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMitra = (e: React.FormEvent) => {
    e.preventDefault();
    setClientsData((prev) =>
      prev.map((c) =>
        c.id === selectedClient
          ? {
              ...c,
              name: editMitraName,
              corp: editMitraCorp,
              email: editMitraEmail,
              phone: editMitraPhone,
              status: editMitraStatus,
              img: editMitraImg,
              bankName: editMitraBankName,
              bankAccount: editMitraBankAccount,
              businessDesc: editMitraBusinessDesc,
              siupNumber: editMitraSiupNumber,
              npwpNumber: editMitraNpwpNumber,
              tdpNumber: editMitraTdpNumber,
              pirtNumber: editMitraPirtNumber,
              googleMapsLink: editMitraGoogleMapsLink,
            }
          : c,
      ),
    );
    setSelectedClient(null);
  };

  const activeClient = clientsData.find((c) => c.id === selectedClient);

  const [contactClient, setContactClient] = useState<string | null>(null);
  const activeContactClient = clientsData.find((c) => c.id === contactClient);

  const toggleFavorite = (clientId: string) => {
    if (favorites.includes(clientId)) {
      setFavorites(favorites.filter((id) => id !== clientId));
    } else {
      setFavorites([...favorites, clientId]);
    }
  };

  const filteredAndSortedClients = clientsData
    .filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedClients.length / itemsPerPage));
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-900 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md">
            <Download className="w-4 h-4" /> Ekspor
          </button>
          <button
            onClick={() => {
              setAddMitraImg(null);
              setAddMitraName("");
              setAddMitraCorp("");
              setAddMitraEmail("");
              setAddMitraPhone("");
              setAddMitraStatus("Aktif");
              setAddMitraBankName("");
              setAddMitraBankAccount("");
              setAddMitraBusinessDesc("");
              setAddMitraSiupNumber("");
              setAddMitraNpwpNumber("");
              setAddMitraTdpNumber("");
              setAddMitraPirtNumber("");
              setAddMitraGoogleMapsLink("");
              setIsAddDrawerOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow-md"
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
          <table className="w-full text-left border-collapse min-w-[900px]">
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
              {paginatedClients.map((client, index) => (
                <tr
                  key={client.id}
                  onClick={() => startEditingMitra(client)}
                  className={`hover:bg-slate-50/80 transition-colors duration-300 group cursor-pointer ${
                    favorites.includes(client.id) ? "bg-amber-50/30" : ""
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
                    Okt 12, 2022
                  </td>
                  <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                    {client.productsCount}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(client.id);
                        }}
                        className={`p-2 rounded-lg transition-all active:scale-[0.98] shadow-sm ${
                          favorites.includes(client.id)
                            ? "text-amber-500 hover:text-slate-400 hover:bg-white"
                            : "text-slate-400 hover:text-amber-500 hover:bg-white"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(client.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContactClient(client.id);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm"
                        title="Hubungi"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingMitra(client);
                        }}
                        className="p-2 text-slate-400 hover:text-ocean-light hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
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

      {/* Drawer Overlay */}
      {selectedClient && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSelectedClient(null)}
        ></div>
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${selectedClient ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeClient && (
          <form onSubmit={handleSaveMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Edit Profil Mitra</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                onClick={() => setSelectedClient(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center mb-6">
                <div
                  onClick={() => mitraFileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                >
                  {editMitraImg ? (
                    <img
                      src={editMitraImg}
                      className="w-full h-full object-cover"
                      alt="Profile Preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-4xl">
                      {editMitraName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={mitraFileInputRef}
                  onChange={handleMitraFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs font-medium text-slate-500">
                  Klik untuk mengganti foto profil
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nama Mitra <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraName}
                    onChange={(e) => setEditMitraName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Perusahaan / Institusi <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraCorp}
                    onChange={(e) => setEditMitraCorp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Alamat Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={editMitraEmail}
                    onChange={(e) => setEditMitraEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nomor Telepon <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editMitraPhone}
                    onChange={(e) => setEditMitraPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Nama Bank <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Bank BNI"
                      value={editMitraBankName}
                      onChange={(e) => setEditMitraBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. Rekening <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Nomor rekening"
                      value={editMitraBankAccount}
                      onChange={(e) => setEditMitraBankAccount(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Deskripsi Jenis Usaha <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Deskripsi jenis usaha..."
                    rows={3}
                    value={editMitraBusinessDesc}
                    onChange={(e) => setEditMitraBusinessDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. SIUP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor SIUP"
                      value={editMitraSiupNumber}
                      onChange={(e) => setEditMitraSiupNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      NPWP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor NPWP"
                      value={editMitraNpwpNumber}
                      onChange={(e) => setEditMitraNpwpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. TDP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor TDP"
                      value={editMitraTdpNumber}
                      onChange={(e) => setEditMitraTdpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. PIRT
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor PIRT"
                      value={editMitraPirtNumber}
                      onChange={(e) => setEditMitraPirtNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Link Peta Mitra di Google Maps <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={editMitraGoogleMapsLink}
                    onChange={(e) => setEditMitraGoogleMapsLink(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
                onClick={() => setSelectedClient(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0"
              >
                <Check className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </aside>
      {/* Add Mitra Drawer Overlay */}
      {isAddDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsAddDrawerOpen(false)}
        ></div>
      )}

      {/* Add Mitra Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isAddDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {isAddDrawerOpen && (
          <form onSubmit={handleAddMitra} className="flex-1 flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">Tambah Mitra Baru</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
                onClick={() => setIsAddDrawerOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col items-center mb-6">
                <div
                  onClick={() => addMitraFileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer hover:border-ocean-light transition-colors shadow-sm"
                >
                  {addMitraImg ? (
                    <img
                      src={addMitraImg}
                      className="w-full h-full object-cover"
                      alt="Profile Preview"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 text-slate-400 flex flex-col items-center justify-center">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-bold">Pilih Foto</span>
                    </div>
                  )}
                  {addMitraImg && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={addMitraFileInputRef}
                  onChange={handleAddMitraFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs font-medium text-slate-500">
                  Tarik atau pilih foto profil
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nama Mitra <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nama lengkap mitra"
                    value={addMitraName}
                    onChange={(e) => setAddMitraName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Perusahaan / Institusi <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nama instansi/mitra"
                    value={addMitraCorp}
                    onChange={(e) => setAddMitraCorp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Alamat Email <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="mitra@email.com"
                    value={addMitraEmail}
                    onChange={(e) => setAddMitraEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Nomor Telepon <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="+62 8xx-xxxx-xxxx"
                    value={addMitraPhone}
                    onChange={(e) => setAddMitraPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Nama Bank <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Bank BNI"
                      value={addMitraBankName}
                      onChange={(e) => setAddMitraBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. Rekening <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Nomor rekening"
                      value={addMitraBankAccount}
                      onChange={(e) => setAddMitraBankAccount(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Deskripsi Jenis Usaha <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Deskripsi jenis usaha..."
                    rows={3}
                    value={addMitraBusinessDesc}
                    onChange={(e) => setAddMitraBusinessDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. SIUP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor SIUP"
                      value={addMitraSiupNumber}
                      onChange={(e) => setAddMitraSiupNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      NPWP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor NPWP"
                      value={addMitraNpwpNumber}
                      onChange={(e) => setAddMitraNpwpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. TDP
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor TDP"
                      value={addMitraTdpNumber}
                      onChange={(e) => setAddMitraTdpNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      No. PIRT
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor PIRT"
                      value={addMitraPirtNumber}
                      onChange={(e) => setAddMitraPirtNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Link Peta Mitra di Google Maps <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={addMitraGoogleMapsLink}
                    onChange={(e) => setAddMitraGoogleMapsLink(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
                onClick={() => setIsAddDrawerOpen(false)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex h-10 items-center justify-center gap-2 bg-linear-to-r from-ocean-light to-seaweed-dark text-white rounded-lg px-5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-ocean-light/20 shrink-0"
              >
                <Check className="w-4 h-4" />
                Simpan Mitra
              </button>
            </div>
          </form>
        )}
      </aside>
      {/* Contact Mitra Drawer Overlay */}
      {contactClient && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setContactClient(null)}
        ></div>
      )}

      {/* Contact Mitra Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${contactClient ? "translate-x-0" : "translate-x-full"}`}
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
