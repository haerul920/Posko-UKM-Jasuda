import { Suspense } from "react";
import { getActivityLogs, getActivityActors } from "@/lib/actions/activity-log";
import RiwayatClient from "./_components/RiwayatClient";
import Loading from "@/components/loading";

export const dynamic = "force-dynamic";

async function RiwayatSection() {
  const [logsResult, actorsResult] = await Promise.all([
    getActivityLogs({ limit: 20 }),
    getActivityActors(),
  ]);

  const initialLogs = logsResult.success ? logsResult.logs : [];
  const totalLogs = logsResult.success ? logsResult.total : 0;
  const actors = actorsResult.success ? actorsResult.actors : [];

  return (
    <RiwayatClient
      initialLogs={initialLogs}
      totalLogs={totalLogs}
      actors={actors}
    />
  );
}

function RiwayatSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse mt-4">
      <div className="flex justify-between items-center">
        <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
        <div className="w-32 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 items-start border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="w-1/3 h-4 bg-slate-200 rounded-md"></div>
              <div className="w-2/3 h-3 bg-slate-100 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminRiwayatPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Riwayat Aktivitas
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Catatan audit (Audit Trail) dari semua aktivitas administratif yang dilakukan oleh admin dan editor.
        </p>
      </div>
      <Suspense fallback={<RiwayatSkeleton />}>
        <RiwayatSection />
      </Suspense>
    </>
  );
}
