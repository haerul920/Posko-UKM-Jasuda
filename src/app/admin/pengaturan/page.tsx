import { getStaffUsers } from "@/lib/actions/staff";
import PengaturanClient from "./_components/PengaturanClient";
import { Suspense } from "react";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function StaffListSection() {
  const result = await getStaffUsers();
  const initialStaff = result.success ? result.staff : [];

  return (
    <PengaturanClient initialStaff={initialStaff} />
  );
}

function PengaturanSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse mt-4">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col gap-4">
        <div className="w-40 h-6 bg-slate-200 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-xl"></div>
          <div className="h-10 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
        <div className="w-48 h-6 bg-slate-200 rounded-md"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center justify-between">
            <div className="w-32 h-4 bg-slate-200 rounded-md"></div>
            <div className="w-20 h-6 bg-slate-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPengaturanPage() {
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
      <Suspense fallback={<PengaturanSkeleton />}>
        <StaffListSection />
      </Suspense>
    </>
  );
}
