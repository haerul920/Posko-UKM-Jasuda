import { Suspense } from "react";
import { getActivityLogs, getActivityActors } from "@/lib/actions/activity-log";
import RiwayatClient from "./_components/RiwayatClient";

export const dynamic = "force-dynamic";

export default async function AdminRiwayatPage() {
  const [logsResult, actorsResult] = await Promise.all([
    getActivityLogs({ limit: 20 }),
    getActivityActors(),
  ]);

  const initialLogs = logsResult.success ? logsResult.logs : [];
  const totalLogs = logsResult.success ? logsResult.total : 0;
  const actors = actorsResult.success ? actorsResult.actors : [];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Riwayat Aktivitas
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-3xl">
          Pantau log sistem dan jejak audit staf secara real-time.
        </p>
      </div>
      <RiwayatClient
        initialLogs={initialLogs}
        totalLogs={totalLogs}
        actors={actors}
      />
    </>
  );
}
