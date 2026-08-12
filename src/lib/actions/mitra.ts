"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";

export interface Mitra {
    id: string;
    name: string;
    corp: string;
    gender?: "Bpk" | "Ibu";
    mentorName?: string;
    establishedYear?: string;
    memberCount?: number;
    address?: string;
    city?: string;
    phone: string;
    email: string;
    img: string | null;
    logo?: string | null;
    businessType?: string;
    businessDetailType?: string;
    businessDesc: string;
    siupNumber?: string;
    npwpNumber?: string;
    tdpNumber?: string;
    pirtNumber?: string;
    bankName: string;
    bankAccount: string;
    bankAccountName?: string;
    googleMapsLink: string;
    initialCapital?: number;
    customerSegment?: string;
    channel?: string;
    favorite: boolean;
    productsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function getAllMitra() {
    try {
        const [rows]: any = await pool.query(
            `SELECT p.*, kd.modal_awal, kd.customer_segment, kd.channel, 
                    (SELECT COUNT(*) FROM produk pr WHERE pr.id_posko = p.id_posko) as productsCount 
             FROM klien_posko p 
             LEFT JOIN klien_detail kd ON kd.id_posko = p.id_posko 
             ORDER BY p.is_favorite DESC, p.id_posko DESC`
        );

        const mitra: Mitra[] = rows.map((row: any) => ({
            id: String(row.id_posko),
            name: row.nama_penerima || row.nama_usaha || "",
            corp: row.nama_usaha || "",
            gender: (row.jenis_kelamin === "Ibu" ? "Ibu" : "Bpk") as "Bpk" | "Ibu",
            mentorName: row.nama_pendamping || "",
            establishedYear: row.mulai_berdiri || "",
            memberCount: Number(row.jumlah_anggota) || 0,
            address: row.alamat || "",
            city: row.kabupaten || "",
            phone: row.telepon || "",
            email: row.email || "",
            img: row.photo || null,
            logo: row.logo || null,
            businessType: row.jenis_usaha || "Produk",
            businessDetailType: row.jenis_usaha_rinci || "",
            businessDesc: row.deskripsi_jenis_usaha || "",
            siupNumber: row.siup || "",
            npwpNumber: row.npwp || "",
            tdpNumber: row.tdp || "",
            pirtNumber: row.pirt || "",
            bankName: row.nama_bank || "",
            bankAccount: row.no_rek_bank || "",
            bankAccountName: row.nama_di_rek || "",
            googleMapsLink: row.peta_google || "",
            initialCapital: Number(row.modal_awal) || 0,
            customerSegment: row.customer_segment || "",
            channel: row.channel || "",
            productsCount: Number(row.productsCount) || 0,
            favorite: Boolean(row.is_favorite ?? false),
            createdAt: row.tgl_inp ? new Date(row.tgl_inp) : new Date(),
            updatedAt: new Date(),
        }));

        const [totalMitraProdRows]: any = await pool.query(
            `SELECT COUNT(*) as total FROM produk WHERE id_posko NOT IN (78, 24)`
        );
        const totalMitraProducts = Number(totalMitraProdRows[0]?.total || 0);

        return {
            success: true,
            mitra,
            totalMitraProducts,
        };
    } catch (error) {
        console.error("Error fetching mitras with count:", error);
        return {
            success: false,
            error: "Failed to fetch mitras.",
        };
    }
}

// Lightweight fetch for use in dropdowns/selects
export interface MitraSelectOption {
    id: string;
    name: string;
    corp: string;
}

export async function getMitraForSelect(): Promise<
    | { success: true; mitra: MitraSelectOption[] }
    | { success: false; error: string }
> {
    try {
        const [rows]: any = await pool.query(
            `SELECT id_posko, nama_penerima, nama_usaha FROM klien_posko ORDER BY nama_usaha ASC`
        );

        const mitra: MitraSelectOption[] = rows.map((row: any) => ({
            id: String(row.id_posko),
            name: row.nama_penerima || row.nama_usaha || "",
            corp: row.nama_usaha || "",
        }));

        return { success: true, mitra };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil data klien.";
        console.error("[getMitraForSelect]", err);
        return { success: false, error: message };
    }
}

export async function addMitra(
    mitraData: Omit<Mitra, "id" | "createdAt" | "updatedAt" | "productsCount">,
    actor?: ActivityActor,
) {
    try {
        const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // 1. Insert into klien_posko
        const [result]: any = await pool.query(
            `INSERT INTO klien_posko 
             (nama_usaha, nama_penerima, jenis_kelamin, nama_pendamping, mulai_berdiri, jumlah_anggota, 
              alamat, kabupaten, telepon, email, photo, logo, jenis_usaha, jenis_usaha_rinci, 
              deskripsi_jenis_usaha, siup, npwp, tdp, pirt, nama_bank, no_rek_bank, nama_di_rek, peta_google, is_favorite, tgl_inp, log) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                mitraData.corp,
                mitraData.name,
                mitraData.gender || "Bpk",
                mitraData.mentorName || "-",
                mitraData.establishedYear || "-",
                mitraData.memberCount || 0,
                mitraData.address || "-",
                mitraData.city || "-",
                mitraData.phone,
                mitraData.email,
                mitraData.img ?? null,
                mitraData.logo ?? null,
                mitraData.businessType || "Produk",
                mitraData.businessDetailType || "-",
                mitraData.businessDesc ?? "-",
                mitraData.siupNumber ?? "-",
                mitraData.npwpNumber ?? "-",
                mitraData.tdpNumber ?? "-",
                mitraData.pirtNumber ?? "-",
                mitraData.bankName ?? "-",
                mitraData.bankAccount ?? "-",
                mitraData.bankAccountName ?? mitraData.name,
                mitraData.googleMapsLink ?? "-",
                mitraData.favorite ? 1 : 0,
                nowStr,
                actor?.actorName ?? "System",
            ]
        );

        const newId = String(result.insertId);

        // 2. Insert into klien_detail if BMC/Detail provided
        if (mitraData.initialCapital || mitraData.customerSegment || mitraData.channel) {
            await pool.query(
                `INSERT INTO klien_detail 
                 (id_posko, modal_awal, customer_segment, channel, tgl_inp, log) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    newId,
                    mitraData.initialCapital || 0,
                    mitraData.customerSegment || "",
                    mitraData.channel || "",
                    nowStr,
                    actor?.actorName ?? "System",
                ]
            );
        }

        revalidatePath("/admin/mitra");

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_MITRA",
                module: "Mitra",
                description: `Menambah mitra baru "${mitraData.name}" (${mitraData.corp})`,
                targetId: newId,
                targetName: mitraData.name,
            });
        }

        return {
            success: true,
            productId: newId,
            message: "Mitra added successfully!",
        };
    } catch (error) {
        console.error("Error adding mitra to MySQL:", error);
        return {
            success: false,
            error: "Failed to add mitra. Please try again.",
        };
    }
}

export async function updateMitra(
    mitraId: string,
    data: Partial<
        Omit<Mitra, "id" | "favorite" | "createdAt" | "productsCount">
    >,
    actor?: ActivityActor,
) {
    try {
        const fieldMap: Record<string, string> = {
            name: "nama_penerima",
            corp: "nama_usaha",
            gender: "jenis_kelamin",
            mentorName: "nama_pendamping",
            establishedYear: "mulai_berdiri",
            memberCount: "jumlah_anggota",
            address: "alamat",
            city: "kabupaten",
            email: "email",
            phone: "telepon",
            img: "photo",
            logo: "logo",
            businessType: "jenis_usaha",
            businessDetailType: "jenis_usaha_rinci",
            businessDesc: "deskripsi_jenis_usaha",
            bankName: "nama_bank",
            bankAccount: "no_rek_bank",
            bankAccountName: "nama_di_rek",
            siupNumber: "siup",
            npwpNumber: "npwp",
            tdpNumber: "tdp",
            pirtNumber: "pirt",
            googleMapsLink: "peta_google",
        };

        const updates: string[] = [];
        const values: any[] = [];

        Object.entries(data).forEach(([key, val]) => {
            if (fieldMap[key] && val !== undefined) {
                updates.push(`${fieldMap[key]} = ?`);
                values.push(val);
            }
        });

        if (updates.length > 0) {
            values.push(mitraId);
            await pool.query(
                `UPDATE klien_posko SET ${updates.join(", ")} WHERE id_posko = ?`,
                values
            );
        }

        // Update klien_detail
        if (data.initialCapital !== undefined || data.customerSegment !== undefined || data.channel !== undefined) {
            const [detailRows]: any = await pool.query(`SELECT id_klien_det FROM klien_detail WHERE id_posko = ?`, [mitraId]);
            const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

            if (detailRows && detailRows.length > 0) {
                const dUpdates: string[] = [];
                const dVals: any[] = [];
                if (data.initialCapital !== undefined) {
                    dUpdates.push("modal_awal = ?");
                    dVals.push(data.initialCapital);
                }
                if (data.customerSegment !== undefined) {
                    dUpdates.push("customer_segment = ?");
                    dVals.push(data.customerSegment);
                }
                if (data.channel !== undefined) {
                    dUpdates.push("channel = ?");
                    dVals.push(data.channel);
                }
                if (dUpdates.length > 0) {
                    dVals.push(mitraId);
                    await pool.query(`UPDATE klien_detail SET ${dUpdates.join(", ")} WHERE id_posko = ?`, dVals);
                }
            } else {
                await pool.query(
                    `INSERT INTO klien_detail (id_posko, modal_awal, customer_segment, channel, tgl_inp, log) VALUES (?, ?, ?, ?, ?, ?)`,
                    [mitraId, data.initialCapital || 0, data.customerSegment || "", data.channel || "", nowStr, actor?.actorName || "System"]
                );
            }
        }

        if (actor) {
            await logActivity({
                actor,
                action: "UPDATE_MITRA",
                module: "Mitra",
                description: `Memperbarui data mitra "${data.name ?? mitraId}"`,
                targetId: mitraId,
                targetName: data.name,
            });
        }

        return {
            success: true,
            message: "Mitra updated successfully!",
        };
    } catch (error) {
        console.error("Error updating mitra:", error);
        return {
            success: false,
            error: "Failed to update mitra.",
        };
    }
}

export async function deleteMitra(
    mitraId: string,
    actor?: ActivityActor,
    mitraName?: string,
) {
    try {
        await pool.query(`DELETE FROM klien_posko WHERE id_posko = ?`, [mitraId]);
        await pool.query(`DELETE FROM klien_detail WHERE id_posko = ?`, [mitraId]);
        await pool.query(`DELETE FROM klien_perk_usaha WHERE id_posko = ?`, [mitraId]);
        await pool.query(`DELETE FROM klien_renc_usaha WHERE id_posko = ?`, [mitraId]);

        if (actor) {
            await logActivity({
                actor,
                action: "DELETE_MITRA",
                module: "Mitra",
                description: `Menghapus mitra "${mitraName ?? mitraId}"`,
                targetId: mitraId,
                targetName: mitraName,
            });
        }

        return {
            success: true,
            message: "Mitra deleted successfully!",
        };
    } catch (error) {
        console.error("Error deleting mitra:", error);
        return {
            success: false,
            error: "Failed to delete mitra.",
        };
    }
}

export async function toggleFavorite(mitraId: string, currentStatus: boolean) {
    try {
        const nextStatus = !currentStatus ? 1 : 0;
        await pool.query(
            `UPDATE klien_posko SET is_favorite = ? WHERE id_posko = ?`,
            [nextStatus, mitraId]
        );
        revalidatePath("/admin/mitra");
        return { success: true };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite." };
    }
}
