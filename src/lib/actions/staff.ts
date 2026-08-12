"use server";

import pool from "@/lib/db";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StaffRole = "admin" | "editor";

export interface StaffUser {
    uid: string;
    displayName: string;
    email: string;
    role: StaffRole;
    favorite: boolean;
    gender?: "Bpk" | "Ibu";
    phone?: string;
    address?: string;
    city?: string;
    birthPlace?: string;
    birthDate?: string;
    position?: string;
    education?: string;
    photo?: string | null;
    status: "Aktif" | "Nonaktif";
    lastSignInTime: string | null; // ISO string
    createdAt: string | null; // ISO string
}

export interface RegisterStaffInput {
    displayName: string;
    email: string;
    password: string;
    role: StaffRole;
    gender?: "Bpk" | "Ibu";
    phone?: string;
    address?: string;
    city?: string;
    birthPlace?: string;
    birthDate?: string;
    position?: string;
    education?: string;
    photo?: string | null;
    status?: "Aktif" | "Nonaktif";
}

export interface UpdateStaffInput {
    displayName?: string;
    role?: StaffRole;
    gender?: "Bpk" | "Ibu";
    phone?: string;
    address?: string;
    city?: string;
    birthPlace?: string;
    birthDate?: string;
    position?: string;
    education?: string;
    photo?: string | null;
    status?: "Aktif" | "Nonaktif";
}

// ---------------------------------------------------------------------------
// Register a new staff user (operator + pengurus)
// ---------------------------------------------------------------------------

export async function registerStaffUser(
    input: RegisterStaffInput,
    actor?: ActivityActor,
): Promise<{ success: true; uid: string } | { success: false; error: string }> {
    try {
        const md5Pass = crypto.createHash("md5").update(input.password).digest("hex");
        const dateStr = new Date().toISOString().slice(0, 10);
        const levelVal = input.role === "admin" ? "Admin" : "Editor";
        const publishVal = input.status === "Nonaktif" ? "N" : "Y";

        // 1. Insert into operator table
        const [result]: any = await pool.query(
            `INSERT INTO operator (username, password, level, is_favorite, tgl_inp, log) VALUES (?, ?, ?, 0, ?, ?)`,
            [input.email, md5Pass, levelVal, dateStr, actor?.actorName || "Admin"]
        );

        const newId = String(result.insertId);

        // 2. Insert detail into pengurus table
        await pool.query(
            `INSERT INTO pengurus (
                nama_pengurus, tempat_lahir, tgl_lahir, jenis_kelamin, 
                alamat_rumah, kab_kota, telepon, email, jabatan, 
                pendidikan_terakhir, photo, publish, urut, is_favorite, tgl_inp, log
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
            [
                input.displayName,
                input.birthPlace || null,
                input.birthDate ? new Date(input.birthDate) : null,
                input.gender || "Bpk",
                input.address || null,
                input.city || null,
                input.phone || null,
                input.email,
                input.position || "Pengelola",
                input.education || null,
                input.photo || null,
                publishVal,
                5,
                dateStr,
                actor?.actorName || "Admin",
            ]
        );

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_STAFF",
                module: "Staf",
                description: `Menambah pengelola baru "${input.displayName}" (${input.role})`,
                targetId: newId,
                targetName: input.displayName,
            });
        }

        return { success: true, uid: newId };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal membuat pengguna.";
        console.error("[registerStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Fetch all staff users (operator + pengurus)
// ---------------------------------------------------------------------------

export async function getStaffUsers(): Promise<
    { success: true; staff: StaffUser[] } | { success: false; error: string }
> {
    try {
        const [opRows]: any = await pool.query(
            `SELECT o.*, p.id_agt, p.nama_pengurus, p.jenis_kelamin, p.telepon, 
                    p.alamat_rumah, p.kab_kota, p.tempat_lahir, p.tgl_lahir, 
                    p.jabatan, p.pendidikan_terakhir, p.photo, p.publish, p.last_login 
             FROM operator o 
             LEFT JOIN pengurus p ON p.email = o.username 
             ORDER BY o.is_favorite DESC, o.id_opr DESC`
        );

        const staff: StaffUser[] = opRows.map((op: any) => ({
            uid: String(op.id_opr),
            displayName: op.nama_pengurus || op.username.split("@")[0] || "Staf",
            email: op.username,
            role: (op.level?.toLowerCase() === "admin" ? "admin" : "editor") as StaffRole,
            favorite: Boolean(op.is_favorite ?? false),
            gender: (op.jenis_kelamin === "Ibu" ? "Ibu" : "Bpk") as "Bpk" | "Ibu",
            phone: op.telepon || "",
            address: op.alamat_rumah || "",
            city: op.kab_kota || "",
            birthPlace: op.tempat_lahir || "",
            birthDate: op.tgl_lahir ? new Date(op.tgl_lahir).toISOString().slice(0, 10) : "",
            position: op.jabatan || "Pengelola",
            education: op.pendidikan_terakhir || "",
            photo: op.photo || null,
            status: op.publish === "N" ? ("Nonaktif" as const) : ("Aktif" as const),
            lastSignInTime: op.last_login || null,
            createdAt: op.tgl_inp || null,
        }));

        return { success: true, staff };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil data staf.";
        console.error("[getStaffUsers]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Update existing staff user info (operator + pengurus)
// ---------------------------------------------------------------------------

export async function updateStaffUser(
    uid: string,
    input: UpdateStaffInput,
    actor?: ActivityActor,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        // Fetch existing operator email
        const [opRows]: any = await pool.query(`SELECT username FROM operator WHERE id_opr = ?`, [uid]);
        const email = opRows[0]?.username;
        const nowStr = new Date().toISOString().slice(0, 10);

        if (input.role) {
            await pool.query(
                `UPDATE operator SET level = ?, tgl_edt = ?, log = ? WHERE id_opr = ?`,
                [input.role === "admin" ? "Admin" : "Editor", nowStr, actor?.actorName || "Admin", uid]
            );
        }

        if (email) {
            const updates: string[] = [];
            const values: any[] = [];

            if (input.displayName !== undefined) {
                updates.push("nama_pengurus = ?");
                values.push(input.displayName);
            }
            if (input.gender !== undefined) {
                updates.push("jenis_kelamin = ?");
                values.push(input.gender);
            }
            if (input.phone !== undefined) {
                updates.push("telepon = ?");
                values.push(input.phone);
            }
            if (input.address !== undefined) {
                updates.push("alamat_rumah = ?");
                values.push(input.address);
            }
            if (input.city !== undefined) {
                updates.push("kab_kota = ?");
                values.push(input.city);
            }
            if (input.birthPlace !== undefined) {
                updates.push("tempat_lahir = ?");
                values.push(input.birthPlace);
            }
            if (input.birthDate !== undefined) {
                updates.push("tgl_lahir = ?");
                values.push(input.birthDate ? new Date(input.birthDate) : null);
            }
            if (input.position !== undefined) {
                updates.push("jabatan = ?");
                values.push(input.position);
            }
            if (input.education !== undefined) {
                updates.push("pendidikan_terakhir = ?");
                values.push(input.education);
            }
            if (input.photo !== undefined) {
                updates.push("photo = ?");
                values.push(input.photo);
            }
            if (input.status !== undefined) {
                updates.push("publish = ?");
                values.push(input.status === "Nonaktif" ? "N" : "Y");
            }

            updates.push("tgl_edt = ?");
            values.push(nowStr);

            updates.push("log = ?");
            values.push(actor?.actorName || "Admin");

            if (updates.length > 0) {
                values.push(email);
                await pool.query(`UPDATE pengurus SET ${updates.join(", ")} WHERE email = ?`, values);
            }
        }

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "UPDATE_STAFF",
                module: "Staf",
                description: `Memperbarui data pengelola "${input.displayName ?? uid}"`,
                targetId: uid,
                targetName: input.displayName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal memperbarui data staf.";
        console.error("[updateStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Delete a staff user
// ---------------------------------------------------------------------------

export async function deleteStaffUser(
    uid: string,
    actor?: ActivityActor,
    staffName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const [opRows]: any = await pool.query(`SELECT username FROM operator WHERE id_opr = ?`, [uid]);
        const email = opRows[0]?.username;

        await pool.query(`DELETE FROM operator WHERE id_opr = ?`, [uid]);
        if (email) {
            await pool.query(`DELETE FROM pengurus WHERE email = ?`, [email]);
        }

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "DELETE_STAFF",
                module: "Staf",
                description: `Menghapus pengelola "${staffName ?? uid}"`,
                targetId: uid,
                targetName: staffName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal menghapus pengguna.";
        console.error("[deleteStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Toggle favorite status for a staff user
// ---------------------------------------------------------------------------

export async function toggleStaffFavorite(
    uid: string,
    currentStatus: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const nextStatus = !currentStatus ? 1 : 0;
        await pool.query(`UPDATE operator SET is_favorite = ? WHERE id_opr = ?`, [nextStatus, uid]);

        const [opRows]: any = await pool.query(`SELECT username FROM operator WHERE id_opr = ?`, [uid]);
        const email = opRows[0]?.username;
        if (email) {
            await pool.query(`UPDATE pengurus SET is_favorite = ? WHERE email = ?`, [nextStatus, email]);
        }

        revalidatePath("/admin/pengaturan");
        return { success: true };
    } catch (err: unknown) {
        console.error("[toggleStaffFavorite]", err);
        return { success: false, error: "Gagal memperbarui status favorit." };
    }
}
