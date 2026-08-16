"use client";

import React, { useState } from "react";
import { X, Copy, Check, ShieldCheck, Mail, Phone, MapPin, Calendar, BookOpen } from "lucide-react";
import type { StaffUser } from "@/lib/actions/staff";
import { formatClientDate } from "@/lib/date";

interface Props {
  staff: StaffUser | null;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  editor: "Editor",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 border border-purple-200",
  editor: "bg-slate-100 text-slate-600 border border-slate-200",
};

// Copy-to-clipboard button with feedback
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin"
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300 active:scale-[0.95]"
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

export default function DrawerContact({ staff, onClose }: Props) {
  const isOpen = !!staff;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Detail &amp; Kontak Staf
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Informasi lengkap akun dan profil staf
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors active:scale-[0.95]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {staff && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Avatar & Header Info */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              {staff.photo ? (
                <img
                  src={staff.photo}
                  alt={staff.displayName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-50 text-ocean-light border-4 border-white shadow-md flex items-center justify-center font-bold text-2xl mb-3">
                  {getInitials(staff.displayName)}
                </div>
              )}
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                {staff.gender && <span className="text-xs text-slate-400 font-normal">{staff.gender}.</span>}
                {staff.displayName}
              </h4>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    ROLE_BADGE[staff.role] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {ROLE_LABEL[staff.role] ?? staff.role}
                </span>
              </div>
            </div>

            {/* General Info Card */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Informasi Kontak &amp; Akun
              </p>

              {/* Email */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Alamat Email
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {staff.email}
                    </p>
                  </div>
                </div>
                <CopyButton value={staff.email} />
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Nomor Telepon
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {staff.phone || "—"}
                    </p>
                  </div>
                </div>
                {staff.phone && <CopyButton value={staff.phone} />}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Identitas Tambahan
              </p>

              {/* Birth Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Tempat Lahir</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {staff.birthPlace || "—"}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Tanggal Lahir</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {formatClientDate(staff.birthDate)}
                  </p>
                </div>
              </div>

              {/* Education & City */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Pendidikan</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {staff.education || "—"}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Kab / Kota</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">
                    {staff.city || "—"}
                  </p>
                </div>
              </div>

              {/* Address */}
              {staff.address && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Alamat Rumah
                  </p>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    {staff.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-all duration-300 active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </aside>
    </>
  );
}
