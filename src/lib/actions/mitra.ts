"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";

export interface Mitra {
    id: string;
    name: string;
    corp: string;
    email: string;
    phone: string;
    img: string | null;
    productsCount: number;
    bankName: string;
    bankAccount: string;
    businessDesc: string;
    siupNumber: string | undefined;
    npwpNumber: string | undefined;
    tdpNumber: string | undefined;
    pirtNumber: string | undefined;
    googleMapsLink: string;
    favorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export async function getAllMitra() {
    try {
        const mitraSnapshot = await adminDb
            .collection("mitra")
            .orderBy("favorite", "desc")
            .orderBy("createdAt", "desc")
            .get();

        const mitra: Omit<Mitra, "productsCount">[] = mitraSnapshot.docs.map(
            (doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name ?? "",
                    corp: data.corp ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    status: data.status ?? "",
                    img: data.img ?? null,
                    bankName: data.bankName ?? "",
                    bankAccount: data.bankAccount ?? "",
                    businessDesc: data.businessDesc ?? "",
                    siupNumber: data.siupNumber ?? "",
                    npwpNumber: data.npwpNumber ?? "",
                    tdpNumber: data.tdpNumber ?? "",
                    pirtNumber: data.pirtNumber ?? "",
                    googleMapsLink: data.googleMapsLink ?? "",
                    favorite: data.favorite ?? false,
                    createdAt: data.createdAt?.toDate
                        ? data.createdAt.toDate()
                        : data.createdAt,
                    updatedAt: data.updatedAt?.toDate
                        ? data.updatedAt.toDate()
                        : data.updatedAt,
                };
            },
        );

        const mitraWithCount = await Promise.all(
            mitra.map(async (mitra) => {
                const countSnapshot = await adminDb
                    .collection("products")
                    .where("mitra_id", "==", mitra.id)
                    .count()
                    .get();

                return {
                    ...mitra,
                    productsCount: countSnapshot.data().count,
                };
            }),
        );

        return {
            success: true,
            mitra: mitraWithCount,
        };
    } catch (error) {
        console.error("Error fetching mitras with count:", error);
        return {
            success: false,
            error: "Failed to add mitra. Please try again.",
        };
    }
}

// Lightweight fetch for use in dropdowns/selects — no product count query.
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
        const snapshot = await adminDb
            .collection("mitra")
            .orderBy("name", "asc")
            .get();

        const mitra: MitraSelectOption[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name ?? "",
                corp: data.corp ?? "",
            };
        });

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
        const mitraRef = adminDb.collection("mitra");

        const docRef = await mitraRef.add({
            ...mitraData,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        revalidatePath("/admin/mitra");

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_MITRA",
                module: "Mitra",
                description: `Menambah mitra baru "${mitraData.name}" (${mitraData.corp})`,
                targetId: docRef.id,
                targetName: mitraData.name,
            });
        }

        return {
            success: true,
            productId: docRef.id,
            message: "Mitra added successfully!",
        };
    } catch (error) {
        console.error("Error adding mitra to Firebase:", error);
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
        const mitraRef = adminDb.collection("mitra").doc(mitraId);

        await mitraRef.update({
            ...data,
            updatedAt: FieldValue.serverTimestamp(),
        });

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
        const mitraRef = adminDb.collection("mitra").doc(mitraId);

        await mitraRef.delete();

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
        const mitraRef = adminDb.collection("mitra").doc(mitraId);

        await mitraRef.update({
            favorite: !currentStatus,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite." };
    }
}
