"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Shield,
  FileEdit,
  Info,
  X,
  Check,
  Star,
  Phone,
  Edit2,
  Search,
  Mail,
} from "lucide-react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: "Administrator" | "Editor";
  status: "Aktif" | "Nonaktif";
  lastActive: string;
  lastActiveDate: string; // ISO String
  initials: string;
  color: "blue" | "amber" | "emerald" | "purple";
  birthPlace?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
};

export default function AdminRBACPage() {
  const [isRoleInfoOpen, setIsRoleInfoOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const [contactStaff, setContactStaff] = useState<Staff | null>(null);
  const [editStaff, setEditStaff] = useState<Staff | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"Administrator" | "Editor">("Editor");

  const [newStaffBirthPlace, setNewStaffBirthPlace] = useState("");
  const [newStaffBirthDate, setNewStaffBirthDate] = useState("");
  const [newStaffAddress, setNewStaffAddress] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");

  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "1",
      name: "Alice Kim",
      email: "alice@jasuda.com",
      role: "Administrator",
      status: "Aktif",
      lastActive: "Baru saja",
      lastActiveDate: new Date().toISOString(),
      initials: "AK",
      color: "blue",
    },
    {
      id: "2",
      name: "Bob Chen",
      email: "bob@jasuda.com",
      role: "Editor",
      status: "Aktif",
      lastActive: "2 jam lalu",
      lastActiveDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      initials: "BC",
      color: "amber",
    },
    {
      id: "3",
      name: "Charlie Inactive",
      email: "charlie@jasuda.com",
      role: "Editor",
      status: "Nonaktif",
      lastActive: "Lebih dari setahun yang lalu",
      lastActiveDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      initials: "CI",
      color: "purple",
    }
  ]);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const initials = newStaffName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const colors: ("blue" | "amber" | "emerald" | "purple")[] = ["blue", "amber", "emerald", "purple"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newStaff: Staff = {
      id: Date.now().toString(),
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: "Aktif",
      lastActive: "Baru saja",
      lastActiveDate: new Date().toISOString(),
      initials,
      color,
      birthPlace: newStaffBirthPlace,
      birthDate: newStaffBirthDate,
      address: newStaffAddress,
      phone: newStaffPhone,
    };

    setStaffList([...staffList, newStaff]);
    setIsAddStaffOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffRole("Editor");
    setNewStaffBirthPlace("");
    setNewStaffBirthDate("");
    setNewStaffAddress("");
    setNewStaffPhone("");
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaff) return;
    setStaffList(staffList.map((s) => (s.id === editStaff.id ? editStaff : s)));
    setEditStaff(null);
  };

  const filteredAndSortedStaff = staffList
    .filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice()
    .sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Pengaturan Sistem
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Konfigurasi keamanan platform dan kelola peran staf.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Content Area */}
        <section className="space-y-6">
          {/* Section A: Staff Management */}
          <div className="bg-white border border-slate-100/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Manajemen Staf
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Kelola admin dan editor platform.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsRoleInfoOpen(true)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center gap-2"
                >
                  <Info className="w-5 h-5" />
                  Informasi
                </button>
                <button
                  onClick={() => setIsAddStaffOpen(true)}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-sm flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Tambah Pengelola
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative w-full md:w-96">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau email pengelola..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-4 rounded-tl-lg">Pengguna</th>
                    <th className="py-3 px-4">Peran</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Terakhir Aktif</th>
                    <th className="py-3 px-4 text-right rounded-tr-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedStaff.map((staff) => {
                    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                    const isInactive = (new Date().getTime() - new Date(staff.lastActiveDate).getTime()) > oneYearMs;
                    const displayStatus = isInactive ? "Nonaktif" : staff.status;

                    return (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors duration-300 group">
                        <td className="py-4 px-4 flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform ${staff.color === 'blue' ? 'bg-blue-50 text-ocean-light border border-blue-100' :
                              staff.color === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                staff.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  'bg-purple-50 text-purple-600 border border-purple-100'
                            }`}>
                            {staff.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                              {staff.name}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              {staff.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${staff.role === 'Administrator'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {displayStatus === "Aktif" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>{" "}
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium text-sm">
                          {staff.lastActive}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2 transition-opacity duration-300 opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(staff.id);
                              }}
                              className={`p-2 rounded-lg transition-all active:scale-[0.98] shadow-sm ${favorites.includes(staff.id)
                                  ? "text-amber-500 hover:text-slate-400 hover:bg-white"
                                  : "text-slate-400 hover:text-amber-500 hover:bg-white"
                                }`}
                            >
                              <Star
                                className={`w-4 h-4 ${favorites.includes(staff.id) ? "fill-current" : ""
                                  }`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setContactStaff(staff);
                              }}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm"
                              title="Hubungi"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditStaff(staff);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all active:scale-[0.98] shadow-sm"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>

      {/* Role Capabilities Modal */}
      {isRoleInfoOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Kemampuan Peran
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Perbandingan visual izin akses di berbagai peran sistem.
                </p>
              </div>
              <button
                onClick={() => setIsRoleInfoOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin */}
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-700" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Administrator
                    </h4>
                  </div>
                  <ol className="list-decimal pl-5 space-y-3 text-sm font-medium text-slate-700">
                    <li>Kelola semua pengaturan sistem</li>
                    <li>Menambah/Menghapus Akun Pengelola</li>
                    <li>Akses Penuh Keuangan</li>
                    <li>Semua Peran Editor</li>
                  </ol>
                </div>

                {/* Editor */}
                <div className="border border-slate-200 rounded-xl p-6 bg-white opacity-80 shadow-sm">
                  <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <FileEdit className="w-5 h-5 text-slate-600" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Editor</h4>
                  </div>
                  <ol className="list-decimal pl-5 space-y-3 text-sm font-medium text-slate-700">
                    <li>Mengelola Mitra</li>
                    <li>Mengelola Produk</li>
                    <li>Akses Pesanan</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Staff Drawer Overlay */}
      {isAddStaffOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsAddStaffOpen(false)}
        ></div>
      )}

      {/* Add Staff Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isAddStaffOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Tambah Pengelola
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Tambahkan staf baru ke dalam sistem
            </p>
          </div>
          <button
            onClick={() => setIsAddStaffOpen(false)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAddStaff} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Nama Lengkap <span className="text-rose-600">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
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
                placeholder="budi@jasuda.com"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta"
                  value={newStaffBirthPlace}
                  onChange={(e) => setNewStaffBirthPlace(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={newStaffBirthDate}
                  onChange={(e) => setNewStaffBirthDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Nomor Telepon
              </label>
              <input
                type="tel"
                placeholder="Contoh: 08123456789"
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Alamat Rumah
              </label>
              <textarea
                placeholder="Alamat lengkap..."
                rows={2}
                value={newStaffAddress}
                onChange={(e) => setNewStaffAddress(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Peran (Role) <span className="text-rose-600">*</span>
              </label>
              <select
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value as "Administrator" | "Editor")}
                className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm appearance-none"
              >
                <option value="Editor">Editor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-5 flex justify-end gap-3 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => setIsAddStaffOpen(false)}
              className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-slate-800"
            >
              <Check className="w-4 h-4" />
              Simpan Pengelola
            </button>
          </div>
        </form>
      </aside>

      {/* Contact Drawer Overlay */}
      {contactStaff && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setContactStaff(null)}
        ></div>
      )}

      {/* Contact Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${contactStaff ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Hubungi Pengelola
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {contactStaff?.name}
            </p>
          </div>
          <button
            onClick={() => setContactStaff(null)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <a
            href={`mailto:${contactStaff?.email}`}
            className="w-full flex items-center gap-3 bg-white border border-slate-300 hover:border-ocean-light rounded-xl p-4 text-left transition-all group hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Email</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{contactStaff?.email}</p>
            </div>
          </a>

          <a
            href={`tel:${contactStaff?.phone || ""}`}
            className={`w-full flex items-center gap-3 bg-white border border-slate-300 hover:border-ocean-light rounded-xl p-4 text-left transition-all group hover:shadow-md ${!contactStaff?.phone ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => !contactStaff?.phone && e.preventDefault()}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Telepon</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{contactStaff?.phone || "Tidak ada data"}</p>
            </div>
          </a>
        </div>
      </aside>

      {/* Edit Staff Drawer Overlay */}
      {editStaff && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setEditStaff(null)}
        ></div>
      )}

      {/* Edit Staff Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${editStaff ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Edit Pengelola
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Perbarui data staf
            </p>
          </div>
          <button
            onClick={() => setEditStaff(null)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {editStaff && (
          <form onSubmit={handleUpdateStaff} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Nama Lengkap <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={editStaff.name}
                  onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
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
                  placeholder="budi@jasuda.com"
                  value={editStaff.email}
                  onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta"
                    value={editStaff.birthPlace || ""}
                    onChange={(e) => setEditStaff({ ...editStaff, birthPlace: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={editStaff.birthDate || ""}
                    onChange={(e) => setEditStaff({ ...editStaff, birthDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={editStaff.phone || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Alamat Rumah
                </label>
                <textarea
                  placeholder="Alamat lengkap..."
                  rows={2}
                  value={editStaff.address || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  Peran (Role) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={editStaff.role}
                  onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value as "Administrator" | "Editor" })}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm appearance-none"
                >
                  <option value="Editor">Editor</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-5 flex justify-end gap-3 border-t border-slate-100 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setEditStaff(null)}
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-slate-800"
              >
                <Check className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
