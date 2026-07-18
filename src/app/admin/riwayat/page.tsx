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
      <Suspense
        fallback={
          <div className="w-full h-screen">
            <Loading title="Memuat riwayat aktivitas..." />
          </div>
        }
      >
        <RiwayatSection />
      </Suspense>
    </>
  );
}
