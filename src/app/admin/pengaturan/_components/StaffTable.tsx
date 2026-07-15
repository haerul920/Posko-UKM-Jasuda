"use client";

import TableActionButtons from "@/components/TableActionButtons";
import { type StaffUser } from "@/lib/actions/staff";

interface Props {
  staff: StaffUser[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleFavorite: (uid: string, currentStatus: boolean) => void;
  onContact: (staff: StaffUser) => void;
  onEdit: (staff: StaffUser) => void;
  onDelete: (uid: string) => void;
}

// Derive initials from a display name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

// Derive a deterministic avatar color from uid
const AVATAR_COLORS = ["blue", "amber", "emerald", "purple"] as const;
type AvatarColor = (typeof AVATAR_COLORS)[number];

function getAvatarColor(uid: string): AvatarColor {
  const sum = uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const AVATAR_STYLES: Record<AvatarColor, string> = {
  blue: "bg-blue-50 text-ocean-light border border-blue-100",
  amber: "bg-amber-50 text-amber-600 border border-amber-100",
  emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  purple: "bg-purple-50 text-purple-600 border border-purple-100",
};

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  editor: "Editor",
};

function formatLastActive(isoString: string | null): string {
  if (!isoString) return "Belum pernah masuk";
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (minutes < 2) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  if (days < 365) return `${Math.floor(days / 7)} minggu lalu`;
  return "Lebih dari setahun yang lalu";
}

export default function StaffTable({
  staff,
  searchQuery,
  onSearchChange,
  onToggleFavorite,
  onContact,
  onEdit,
  onDelete,
}: Props) {
  const filtered = staff
    .filter(
      (s) =>
        s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice()
    .sort((a, b) => {
      const aFav = staff.some(member => member.uid === a.uid);;
      const bFav = staff.some(member => member.uid === b.uid);;
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });

  return (
    <>
      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau email pengelola..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-light/50 focus:border-ocean-light transition-all duration-300 shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50">
              <th className="py-3 px-4 rounded-tl-lg">Pengguna</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Terakhir Aktif</th>
              <th className="py-3 px-4 text-center rounded-tr-lg">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm font-medium text-slate-400"
                >
                  {searchQuery
                    ? "Tidak ada pengelola yang sesuai pencarian."
                    : "Belum ada pengelola terdaftar."}
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const color = getAvatarColor(s.uid);

                const tableItem = {
                  id: s.uid,
                  name: s.displayName,
                  favorite: s.favorite,
                  _original: s,
                };

                return (
                  <tr
                    key={s.uid}
                    className="hover:bg-slate-50/80 transition-colors duration-300 group"
                  >
                    {/* User */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform ${AVATAR_STYLES[color]}`}
                        >
                          {getInitials(s.displayName)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-ocean-light transition-colors">
                            {s.displayName}
                          </div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">
                            {s.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${s.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                      >
                        {ROLE_LABEL[s.role] ?? s.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Aktif
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4 text-slate-500 font-medium text-sm">
                      {formatLastActive(s.lastSignInTime)}
                    </td>

                    {/* Actions — using shared TableActionButtons */}
                    <td className="py-4 px-4">
                      <TableActionButtons
                        item={tableItem}
                        onToggleFavorite={() => onToggleFavorite(s.uid, s.favorite)}
                        onContact={() => onContact(s)}
                        onEdit={() => onEdit(s)}
                        onDelete={() => onDelete(s.uid)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
