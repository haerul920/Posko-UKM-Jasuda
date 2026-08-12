"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserCircle, Mail, Lock, Camera, ShieldCheck, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useStore } from "@/components/context/StoreContext";
import { getAdminAccount, updateAdminAccount } from "@/lib/actions/user";

// Derive initials from name (same style as /admin/pengaturan StaffTable)
function getInitials(name: string): string {
  if (!name || !name.trim()) return "A";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Derive a deterministic avatar color from uid or name
const AVATAR_COLORS = ["blue", "amber", "emerald", "purple"] as const;
type AvatarColor = (typeof AVATAR_COLORS)[number];

function getAvatarColor(key: string): AvatarColor {
  const sum = (key || "admin").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const AVATAR_STYLES: Record<AvatarColor, string> = {
  blue: "bg-blue-50 text-ocean-light border border-blue-100",
  amber: "bg-amber-50 text-amber-600 border border-amber-100",
  emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  purple: "bg-purple-50 text-purple-600 border border-purple-100",
};

export default function AdminAccountPage() {
  const { user, role, updateUser } = useStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminId, setAdminId] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadActiveAdminSession() {
      setLoading(true);
      const activeId = user?.uid || "";
      const activeEmail = user?.email || "";

      const adminRes = await getAdminAccount(activeId, activeEmail);
      if (adminRes.success && adminRes.profile) {
        setAdminId(adminRes.profile.id);
        setName(adminRes.profile.name || user?.displayName || "Admin");
        setEmail(adminRes.profile.email || user?.email || "");
        setPhoto(adminRes.profile.photo || user?.photoURL || null);
      } else {
        setAdminId(activeId || "");
        setName(user?.displayName || "Admin");
        setEmail(user?.email || "");
        setPhoto(user?.photoURL || null);
      }
      setLoading(false);
    }

    loadActiveAdminSession();
  }, [user]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMsg(null);
      setErrorMsg(null);

      if (!name.trim()) {
        const err = "Nama lengkap tidak boleh kosong.";
        setErrorMsg(err);
        toast.add({ title: "Validasi Gagal", description: err, type: "error" });
        return;
      }

      if (!email.trim()) {
        const err = "Alamat email tidak boleh kosong.";
        setErrorMsg(err);
        toast.add({ title: "Validasi Gagal", description: err, type: "error" });
        return;
      }

      if (password) {
        if (password.length < 6) {
          const err = "Kata sandi baru minimal 6 karakter.";
          setErrorMsg(err);
          toast.add({ title: "Validasi Gagal", description: err, type: "error" });
          return;
        }
        if (password !== confirmPassword) {
          const err = "Konfirmasi kata sandi tidak cocok dengan kata sandi baru.";
          setErrorMsg(err);
          toast.add({ title: "Validasi Gagal", description: err, type: "error" });
          return;
        }
      }

      setSaving(true);
      try {
        const targetId = adminId || user?.uid || "11";
        const res = await updateAdminAccount(targetId, {
          name,
          email,
          password: password ? password : undefined,
        });

        if (res.success) {
          const success = "Profil & akun admin berhasil diperbarui.";
          setSuccessMsg(success);
          toast.add({ title: "Akun Admin Diperbarui", description: success, type: "success" });
          setPassword("");
          setConfirmPassword("");
          updateUser({ displayName: name.trim(), email: email.trim(), photoURL: photo || user?.photoURL || undefined });

          if (typeof window !== "undefined") {
            const currentSession = localStorage.getItem("jasuda_user");
            if (currentSession) {
              try {
                const parsed = JSON.parse(currentSession);
                const updatedSession = {
                  ...parsed,
                  name: name.trim(),
                  displayName: name.trim(),
                  email: email.trim(),
                };
                localStorage.setItem("jasuda_user", JSON.stringify(updatedSession));
              } catch (e) {
                // ignore JSON parse error
              }
            }
          }
        } else {
          const err = res.error || "Gagal menyimpan perubahan akun.";
          setErrorMsg(err);
          toast.add({ title: "Gagal Menyimpan", description: err, type: "error" });
        }
      } catch (err: any) {
        const errMsg = err.message || "Terjadi kesalahan saat menyimpan akun.";
        setErrorMsg(errMsg);
        toast.add({ title: "Gagal Menyimpan", description: errMsg, type: "error" });
      } finally {
        setSaving(false);
      }
    },
    [adminId, name, email, password, confirmPassword, user]
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-6 mb-8 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <UserCircle className="w-8 h-8 text-slate-900" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Kelola profil sesi Anda, alamat email, dan kata sandi untuk mengamankan akun Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-ocean-light text-sm font-bold border border-blue-100 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
            Peran: {role === "admin" ? "Super Admin" : role === "editor" ? "Editor" : "Admin / Pengelola"}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300">
          <div className="relative group cursor-pointer mb-6">
            {(photo || user?.photoURL) ? (
              <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <img src={photo || user?.photoURL} alt={name || "Admin"} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center font-extrabold text-3xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 ${
                  AVATAR_STYLES[getAvatarColor(adminId || name || "admin")]
                }`}
              >
                {getInitials(name || user?.displayName || "Admin")}
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-9 h-9 bg-slate-900 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{loading ? "Memuat..." : (name || "Akun Saya")}</h3>
          <p className="text-xs font-medium text-slate-500 mt-2 mb-6 leading-relaxed">
            Format yang didukung: JPG, PNG, atau GIF. Ukuran maksimum 2MB.
          </p>
          <button
            type="button"
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 active:scale-[0.98] shadow-sm w-full cursor-pointer"
          >
            Unggah Foto Baru
          </button>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-100/50 shadow-sm hover:shadow-md rounded-2xl p-8 transition-all duration-300">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-5">
            Informasi Sesi Akun & Keamanan
          </h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    disabled={loading || saving}
                    placeholder="Nama Lengkap Admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm disabled:opacity-60"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    disabled={loading || saving}
                    placeholder="email@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm disabled:opacity-60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-5">Ubah Kata Sandi</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      disabled={loading || saving}
                      placeholder="Kosongkan jika tidak ingin diubah"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm disabled:opacity-60"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Konfirmasi Kata Sandi Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      disabled={loading || saving}
                      placeholder="Ketik ulang kata sandi baru"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light text-slate-900 font-medium transition-all shadow-sm disabled:opacity-60"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || saving}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
