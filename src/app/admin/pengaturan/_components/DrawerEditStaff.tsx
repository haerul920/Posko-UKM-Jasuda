"use client";

import React, { useState, useTransition } from "react";
import { X, Check, Loader2, AlertCircle } from "lucide-react";
import { updateStaffUser } from "@/lib/actions/staff";
import type { StaffRole, StaffUser } from "@/lib/actions/staff";
import { useStore } from "@/components/context/StoreContext";

interface Props {
  staff: StaffUser | null;
  onClose: () => void;
  onUpdated: (updated: StaffUser) => void;
}

const INPUT_CLASS =
  "w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm";

const LABEL_CLASS = "block text-sm font-bold text-slate-900 mb-1.5";

export default function DrawerEditStaff({ staff, onClose, onUpdated }: Props) {
  const { user, role } = useStore();
  const isOpen = !!staff;
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Local editable copy of the staff data
  const [form, setForm] = useState<Partial<StaffUser>>({});

  // Merge staff with local edits
  const merged: StaffUser | null = staff ? { ...staff, ...form } : null;

  const setField = <K extends keyof StaffUser>(key: K, value: StaffUser[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    if (isPending) return;
    setForm({});
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;
    setError(null);

    startTransition(async () => {
      const actor = user
        ? { actorId: user.uid, actorName: user.displayName ?? user.email ?? "Unknown", actorRole: role ?? "admin" }
        : undefined;

      const result = await updateStaffUser(staff.uid, {
        displayName: merged?.displayName,
        role: merged?.role,
        phone: merged?.phone,
        address: merged?.address,
        birthPlace: merged?.birthPlace,
        birthDate: merged?.birthDate,
      }, actor);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onUpdated(merged!);
      setForm({});
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Edit Pengelola</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Perbarui data staf
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95] disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {merged && (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className={LABEL_CLASS}>
                  Nama Lengkap <span className="text-rose-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={merged.displayName}
                  onChange={(e) => setField("displayName", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className={LABEL_CLASS}>Alamat Email</label>
                <input
                  type="email"
                  value={merged.email}
                  readOnly
                  className={`${INPUT_CLASS} bg-slate-50 text-slate-400 cursor-not-allowed`}
                />
                <p className="mt-1.5 text-xs text-slate-400 font-medium">
                  Email tidak dapat diubah dari sini.
                </p>
              </div>

              {/* Birth Place + Birth Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta"
                    value={merged.birthPlace ?? ""}
                    onChange={(e) => setField("birthPlace", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Tanggal Lahir</label>
                  <input
                    type="date"
                    value={merged.birthDate ?? ""}
                    onChange={(e) => setField("birthDate", e.target.value)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={LABEL_CLASS}>Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={merged.phone ?? ""}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Address */}
              <div>
                <label className={LABEL_CLASS}>Alamat Rumah</label>
                <textarea
                  placeholder="Alamat lengkap..."
                  rows={2}
                  value={merged.address ?? ""}
                  onChange={(e) => setField("address", e.target.value)}
                  className={`${INPUT_CLASS} resize-none`}
                />
              </div>

              {/* Role */}
              <div>
                <label className={LABEL_CLASS}>
                  Peran (Role) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={merged.role}
                  onChange={(e) =>
                    setField("role", e.target.value as StaffRole)
                  }
                  className={`${INPUT_CLASS} appearance-none`}
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 flex justify-end gap-3 border-t border-slate-100 bg-white shrink-0">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white rounded-lg px-5 py-2.5 font-bold text-sm transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
