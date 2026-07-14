"use client";

import React, { useState } from "react";
import { X, Mail, Phone, Copy, Check, MessageCircle, MapPin, Calendar } from "lucide-react";
import type { StaffUser } from "@/lib/actions/staff";

interface Props {
  staff: StaffUser | null;
  onClose: () => void;
}

const AVATAR_COLORS = ["blue", "amber", "emerald", "purple"] as const;
type AvatarColor = (typeof AVATAR_COLORS)[number];

function getAvatarColor(uid: string): AvatarColor {
  const sum = uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const AVATAR_BG: Record<AvatarColor, string> = {
  blue: "from-blue-400 to-cyan-500",
  amber: "from-amber-400 to-orange-500",
  emerald: "from-emerald-400 to-teal-500",
  purple: "from-purple-400 to-violet-500",
};

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

function formatBirthDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Copy-to-clipboard button with feedback
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
      title="Salin"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export default function DrawerContact({ staff, onClose }: Props) {
  const isOpen = !!staff;
  const color = staff ? getAvatarColor(staff.uid) : "blue";

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-sm active:scale-[0.95]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Hero */}
        <div className={`bg-gradient-to-br ${AVATAR_BG[color]} p-8 pb-10 shrink-0`}>
          <div className="flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {staff ? getInitials(staff.displayName) : ""}
              </span>
            </div>

            {/* Name & Role */}
            <div>
              <h3 className="text-xl font-extrabold text-white leading-tight">
                {staff?.displayName}
              </h3>
              <div className="mt-2 inline-flex">
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30`}>
                  {ROLE_LABEL[staff?.role ?? ""] ?? staff?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact Actions */}
          <div className="p-5 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Hubungi
            </p>

            {/* Email */}
            <a
              href={`mailto:${staff?.email}`}
              className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-xl transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</p>
                <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">
                  {staff?.email}
                </p>
              </div>
              <CopyButton value={staff?.email ?? ""} />
            </a>

            {/* Phone */}
            <a
              href={staff?.phone ? `tel:${staff.phone}` : undefined}
              onClick={(e) => !staff?.phone && e.preventDefault()}
              className={`group flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl transition-all ${
                staff?.phone
                  ? "hover:border-emerald-300 hover:shadow-md cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ${staff?.phone ? "group-hover:bg-emerald-500 group-hover:text-white transition-colors" : ""}`}>
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Telepon</p>
                <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">
                  {staff?.phone || "Tidak ada data"}
                </p>
              </div>
              {staff?.phone && <CopyButton value={staff.phone} />}
            </a>

            {/* WhatsApp */}
            {staff?.phone && (
              <a
                href={`https://wa.me/${staff.phone.replace(/^0/, "62").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-green-300 rounded-xl transition-all hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">WhatsApp</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Kirim Pesan</p>
                </div>
              </a>
            )}
          </div>

          {/* Personal Info */}
          {(staff?.birthPlace || staff?.birthDate || staff?.address) && (
            <div className="px-5 pb-6 space-y-3 border-t border-slate-100 pt-5 mx-5 mt-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Informasi Pribadi
              </p>

              {/* Birth */}
              {(staff?.birthPlace || staff?.birthDate) && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Tempat, Tanggal Lahir
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      {[staff.birthPlace, formatBirthDate(staff.birthDate)]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Address */}
              {staff?.address && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Alamat
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5 leading-relaxed">
                      {staff.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
