"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivityModule =
    | "Produk"
    | "Mitra"
    | "Staf"
    | "Sistem"
    | "Keuangan"
    | "Pesanan";

export type ActivityAction =
    // Produk
    | "CREATE_PRODUCT"
    | "UPDATE_PRODUCT"
    | "DELETE_PRODUCT"
    | "TOGGLE_FAVORITE_PRODUCT"
    // Mitra
    | "CREATE_MITRA"
    | "UPDATE_MITRA"
    | "DELETE_MITRA"
    | "TOGGLE_FAVORITE_MITRA"
    // Staf
    | "CREATE_STAFF"
    | "UPDATE_STAFF"
    | "DELETE_STAFF";

export interface ActivityActor {
    actorId: string;
    actorName: string;
    actorRole: string;
}

export interface ActivityLogInput {
    actor: ActivityActor;
    action: ActivityAction;
    module: ActivityModule;
    description: string;
    targetId?: string;
    targetName?: string;
}

export interface ActivityLog {
    id: string;
    actorId: string;
    actorName: string;
    actorRole: string;
    action: ActivityAction;
    module: ActivityModule;
    description: string;
    targetId?: string;
    targetName?: string;
    createdAt: string; // ISO string (serialisable untuk client)
}

export interface GetActivityLogsFilters {
    module?: ActivityModule;
    actorId?: string;
    /** ISO string — ambil log dari tanggal ini ke atas */
    fromDate?: string;
    limit?: number;
    /** Last document ID untuk cursor-based pagination */
    afterId?: string;
}

// ---------------------------------------------------------------------------
// Write a single activity log (fire-and-forget safe)
// ---------------------------------------------------------------------------

export async function logActivity(input: ActivityLogInput): Promise<void> {
    try {
        await adminDb.collection("activity_logs").add({
            actorId: input.actor.actorId,
            actorName: input.actor.actorName,
            actorRole: input.actor.actorRole,
            action: input.action,
            module: input.module,
            description: input.description,
            targetId: input.targetId ?? null,
            targetName: input.targetName ?? null,
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (err) {
        // Log errors should never crash the main action
        console.error("[logActivity] Failed to write activity log:", err);
    }
}

// ---------------------------------------------------------------------------
// Read activity logs with optional filters
// ---------------------------------------------------------------------------

export async function getActivityLogs(
    filters: GetActivityLogsFilters = {},
): Promise<
    | { success: true; logs: ActivityLog[]; total: number }
    | { success: false; error: string }
> {
    try {
        const pageLimit = filters.limit ?? 20;

        // Base query — always order by createdAt desc
        let query = adminDb
            .collection("activity_logs")
            .orderBy("createdAt", "desc") as FirebaseFirestore.Query;

        if (filters.module) {
            query = query.where("module", "==", filters.module);
        }

        if (filters.actorId) {
            query = query.where("actorId", "==", filters.actorId);
        }

        if (filters.fromDate) {
            query = query.where(
                "createdAt",
                ">=",
                new Date(filters.fromDate),
            );
        }

        // Cursor pagination
        if (filters.afterId) {
            const afterDoc = await adminDb
                .collection("activity_logs")
                .doc(filters.afterId)
                .get();
            if (afterDoc.exists) {
                query = query.startAfter(afterDoc);
            }
        }

        const snapshot = await query.limit(pageLimit).get();

        const logs: ActivityLog[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                actorId: data.actorId ?? "",
                actorName: data.actorName ?? "Unknown",
                actorRole: data.actorRole ?? "",
                action: data.action as ActivityAction,
                module: data.module as ActivityModule,
                description: data.description ?? "",
                targetId: data.targetId ?? undefined,
                targetName: data.targetName ?? undefined,
                createdAt: data.createdAt?.toDate
                    ? (data.createdAt.toDate() as Date).toISOString()
                    : new Date().toISOString(),
            };
        });

        // Total count (unfiltered for the given module/actor)
        let countQuery = adminDb.collection("activity_logs") as FirebaseFirestore.Query;
        if (filters.module) {
            countQuery = countQuery.where("module", "==", filters.module);
        }
        if (filters.actorId) {
            countQuery = countQuery.where("actorId", "==", filters.actorId);
        }
        if (filters.fromDate) {
            countQuery = countQuery.where(
                "createdAt",
                ">=",
                new Date(filters.fromDate),
            );
        }
        const countSnap = await countQuery.count().get();
        const total = countSnap.data().count;

        return { success: true, logs, total };
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Gagal mengambil riwayat aktivitas.";
        console.error("[getActivityLogs]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Get unique actors (for filter dropdown)
// ---------------------------------------------------------------------------

export async function getActivityActors(): Promise<
    | { success: true; actors: { actorId: string; actorName: string; actorRole: string }[] }
    | { success: false; error: string }
> {
    try {
        const snapshot = await adminDb
            .collection("activity_logs")
            .orderBy("actorName", "asc")
            .get();

        const seen = new Set<string>();
        const actors: { actorId: string; actorName: string; actorRole: string }[] = [];

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (!seen.has(data.actorId)) {
                seen.add(data.actorId);
                actors.push({
                    actorId: data.actorId,
                    actorName: data.actorName ?? "Unknown",
                    actorRole: data.actorRole ?? "",
                });
            }
        });

        return { success: true, actors };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil daftar aktor.";
        console.error("[getActivityActors]", err);
        return { success: false, error: message };
    }
}
