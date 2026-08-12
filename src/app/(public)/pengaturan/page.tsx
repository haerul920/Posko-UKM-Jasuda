"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlobalHeader from "@/components/shared/GlobalHeader";
import GlobalFooter from "@/components/shared/GlobalFooter";
import { useStore } from "@/components/context/StoreContext";
import { getUserProfile, updateUserProfile, updateUserPhoto } from "@/lib/actions/user";
import WilayahSelect, { type WilayahValue } from "@/components/shared/WilayahSelect";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImagePlus,
  Info,
} from "lucide-react";

export default function PengaturanPage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, isEditor, role, updateUser, loading: storeLoading } = useStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Foto profil state ──────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");       // URL tersimpan di DB
  const [photoPreview, setPhotoPreview] = useState<string>(""); // Preview lokal (blob:)
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Redirect admin / pengelola to /admin/akun
  useEffect(() => {
    if (!storeLoading && isLoggedIn && (isAdmin || isEditor || role !== "user")) {
      router.replace("/admin/akun");
    }
  }, [storeLoading, isLoggedIn, isAdmin, isEditor, role, router]);

  // Form state biasa
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  // State khusus untuk cascading wilayah select
  const [wilayah, setWilayah] = useState<WilayahValue>({
    provinceId: "",
    provinceName: "",
    cityId: "",
    cityName: "",
    districtId: "",
    districtName: "",
  });

  // Load profil dari DB saat mount
  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      getUserProfile(user.uid).then((res) => {
        if (res.success && res.profile) {
          const p = res.profile;
          setFormData({
            name: p.name || user.displayName || "",
            email: p.email || user.email || "",
            phone: p.phone || "",
            address: p.address || "",
            postalCode: p.postalCode || "",
          });
          // Restore wilayah yang sudah disimpan sebelumnya
          setWilayah({
            provinceId: p.provinceId || "",
            provinceName: p.province || "",
            cityId: p.cityId || "",
            cityName: p.city || "",
            districtId: p.districtId || "",
            districtName: p.district || "",
          });
          // Restore foto yang sudah tersimpan
          if (p.photo) setPhotoUrl(p.photo);
        }
        setLoading(false);
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  if (isLoggedIn && (isAdmin || isEditor || role !== "user")) {
    return (
      <div className="flex-1 flex flex-col min-h-screen font-body-md bg-surface-bright">
        <GlobalHeader storeName="Posko UKM Jasuda" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border border-white/50 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-rose-950">
              Akses Dibatalkan untuk Pengelola
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Halaman <strong>/pengaturan</strong> ini khusus untuk Akun Pengguna Biasa. Pengaturan akun Admin / Pengelola berada di <strong>/admin/akun</strong>.
            </p>
            <Link
              href="/admin/akun"
              className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-colors w-full block text-center"
            >
              Buka Akun Admin (/admin/akun)
            </Link>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) {
      setMessage({ type: "error", text: "Silakan masuk terlebih dahulu." });
      return;
    }

    // Validasi wilayah wajib diisi
    if (!wilayah.provinceId || !wilayah.cityId || !wilayah.districtId) {
      setMessage({ type: "error", text: "Pilih Provinsi, Kota/Kabupaten, dan Kecamatan terlebih dahulu." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await updateUserProfile(user.uid, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        // Simpan nama & ID kota untuk ongkir
        city: wilayah.cityName,
        cityId: wilayah.cityId,
        province: wilayah.provinceName,
        provinceId: wilayah.provinceId,
        district: wilayah.districtName,
        districtId: wilayah.districtId,
        postalCode: formData.postalCode,
      });

      if (res.success) {
        updateUser({ displayName: formData.name });
        setMessage({
          type: "success",
          text: "Profil berhasil disimpan! Informasi alamat lengkap untuk pemesanan.",
        });
      } else {
        setMessage({ type: "error", text: res.error || "Gagal menyimpan profil." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan saat menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  // ── Handler: pilih file foto ──────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    // Validasi ukuran: max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    setPhotoError(null);
    // Tampilkan preview lokal segera (tanpa menunggu upload)
    const blobUrl = URL.createObjectURL(file);
    setPhotoPreview(blobUrl);
    // Langsung mulai upload
    handlePhotoUpload(file);
  };

  // ── Handler: upload foto ke server ───────────────────────
  const handlePhotoUpload = async (file: File) => {
    if (!user?.uid) return;
    setPhotoUploading(true);
    setPhotoUploadProgress(10);
    setPhotoError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "avatars");

      setPhotoUploadProgress(40);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setPhotoUploadProgress(75);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload gagal");
      }

      const data = await res.json();
      const uploadedUrl: string = data.url;

      setPhotoUploadProgress(90);

      // Simpan URL ke database
      const saveRes = await updateUserPhoto(user.uid, uploadedUrl);
      if (!saveRes.success) throw new Error(saveRes.error || "Gagal menyimpan foto");

      setPhotoUrl(uploadedUrl);
      updateUser({ photoURL: uploadedUrl });
      setPhotoUploadProgress(100);
      setMessage({ type: "success", text: "Foto profil berhasil diperbarui!" });
    } catch (err: any) {
      setPhotoError(err.message || "Terjadi kesalahan saat upload.");
      // Batalkan preview jika upload gagal
      setPhotoPreview("");
    } finally {
      setPhotoUploading(false);
      // Reset file input agar file yang sama bisa dipilih ulang
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Input field style ─────────────────────────────────────
  const inputClass =
    "w-full bg-surface-container/50 border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400";

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      <GlobalHeader storeName="Posko UKM Jasuda" />

      <main className="grow max-w-4xl mx-auto w-full px-6 py-12 flex flex-col gap-8">
        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">
            Pengaturan Profil Pengguna
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            Lengkapi profil Anda untuk dapat melakukan pemesanan &amp; mendapatkan estimasi ongkir yang akurat.
          </p>
        </div>

        {/* ── Info Banner: Kolom baru ── */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
          <span>
            <strong>Pengisian Alamat Diperbarui</strong> — Pilih <strong>Provinsi</strong> dan{" "}
            <strong>Kota/Kabupaten</strong> dari dropdown untuk estimasi ongkir yang tepat.
            Isi <strong>Alamat Lengkap</strong> (nama jalan, nomor, kelurahan, kecamatan) secara manual.
          </span>
        </div>

        {/* ── Alert ── */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="glass-panel rounded-2xl p-8 flex flex-col gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* ── Foto Profil ── */}
            <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelect}
                disabled={photoUploading}
              />

              {/* Avatar + overlay trigger */}
              <button
                type="button"
                disabled={photoUploading}
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer shrink-0 disabled:cursor-not-allowed"
                title="Klik untuk mengubah foto profil"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">
                  {(photoPreview || photoUrl) ? (
                    <img
                      src={photoPreview || photoUrl}
                      alt="Foto profil"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                {/* Upload overlay */}
                {photoUploading ? (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </button>

              {/* Info & controls */}
              <div className="flex flex-col gap-3 text-center sm:text-left grow">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-0.5">Foto Profil</h3>
                  <p className="text-xs text-on-surface-variant">
                    JPG, PNG, atau WebP — maksimal <strong>2MB</strong>. Rasio 1:1 direkomendasikan.
                  </p>
                </div>

                {/* Progress bar saat upload */}
                {photoUploading && (
                  <div className="flex flex-col gap-1">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${photoUploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-primary font-semibold">
                      Mengunggah... {photoUploadProgress}%
                    </p>
                  </div>
                )}

                {/* Error message */}
                {photoError && (
                  <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}

                {/* Tombol trigger */}
                {!photoUploading && (
                  <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      {photoUrl || photoPreview ? "Ganti Foto" : "Unggah Foto"}
                    </button>
                    {(photoUrl || photoPreview) && (
                      <p className="self-center text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Foto tersimpan
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ── Identitas Dasar ── */}
            <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-base font-bold text-on-surface border-b border-outline-variant/20 pb-3">
                Identitas Diri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Email (disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className={inputClass}
                  />
                </div>

                {/* Telepon */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </section>

            {/* ── Alamat Pengiriman ── */}
            <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
              <div className="border-b border-outline-variant/20 pb-3">
                <h3 className="text-base font-bold text-on-surface">Alamat Pengiriman</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Pilih wilayah dari dropdown, lalu isi alamat jalan secara lengkap.
                </p>
              </div>

              {/* ── Cascading Wilayah Select ── */}
              <WilayahSelect
                value={wilayah}
                onChange={setWilayah}
                required
              />

              {/* Preview pilihan wilayah */}
              {wilayah.districtId && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Wilayah terpilih:{" "}
                    <strong>
                      Kec. {wilayah.districtName}, {wilayah.cityName}, {wilayah.provinceName}
                    </strong>
                  </span>
                </div>
              )}

              {/* Alamat lengkap & kode pos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Alamat Lengkap (Jalan, No., Kel., Kec.){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Contoh: Jl. AP Pettarani No. 12 (nama jalan & nomor saja, kecamatan sudah dipilih di atas)"
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Contoh: 90245"
                    maxLength={5}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* ── Submit ── */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-primary to-primary-container text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Memproses..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </main>

      <GlobalFooter />
    </div>
  );
}
