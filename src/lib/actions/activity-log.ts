"use server";

import pool from "@/lib/db";
import crypto from "crypto";

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
        const id = "log_" + Date.now() + "_" + crypto.randomBytes(4).toString("hex");
        await pool.query(
            `INSERT INTO activity_logs (id, actor_id, actor_name, actor_role, action, module, description, target_id, target_name, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                input.actor.actorId,
                input.actor.actorName,
                input.actor.actorRole,
                input.action,
                input.module,
                input.description,
                input.targetId ?? null,
                input.targetName ?? null,
                new Date()
            ]
        );
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
        const whereClauses: string[] = [];
        const params: any[] = [];

        if (filters.module) {
            whereClauses.push("module = ?");
            params.push(filters.module);
        }

        if (filters.actorId) {
            whereClauses.push("actor_id = ?");
            params.push(filters.actorId);
        }

        if (filters.fromDate) {
            whereClauses.push("created_at >= ?");
            params.push(new Date(filters.fromDate));
        }

        const whereSql = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

        // Query count
        const [countRows]: any = await pool.query(
            `SELECT COUNT(*) as total FROM activity_logs ${whereSql}`,
            params
        );
        const total = countRows[0]?.total ?? 0;

        // Query logs
        const [rows]: any = await pool.query(
            `SELECT * FROM activity_logs ${whereSql} ORDER BY created_at DESC LIMIT ?`,
            [...params, pageLimit]
        );

        const logs: ActivityLog[] = rows.map((row: any) => ({
            id: String(row.id),
            actorId: row.actor_id ?? "",
            actorName: row.actor_name ?? "Unknown",
            actorRole: row.actor_role ?? "",
            action: row.action as ActivityAction,
            module: row.module as ActivityModule,
            description: row.description ?? "",
            targetId: row.target_id ?? undefined,
            targetName: row.target_name ?? undefined,
            createdAt: row.created_at
                ? (row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString())
                : new Date().toISOString(),
        }));

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
        const [rows]: any = await pool.query(
            `SELECT DISTINCT actor_id, actor_name, actor_role FROM activity_logs ORDER BY actor_name ASC`
        );

        const actors = rows.map((row: any) => ({
            actorId: String(row.actor_id),
            actorName: row.actor_name ?? "Unknown",
            actorRole: row.actor_role ?? "",
        }));

        return { success: true, actors };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil daftar aktor.";
        console.error("[getActivityActors]", err);
        return { success: false, error: message };
    }
}
