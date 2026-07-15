"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

export interface Client {
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

export async function getAllClients() {
    try {
        const clientsSnapshot = await adminDb
            .collection("clients")
            .orderBy("favorite", "desc")
            .orderBy("createdAt", "desc")
            .get();

        const clients: Omit<Client, "productsCount">[] =
            clientsSnapshot.docs.map((doc) => {
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
            });

        const clientsWithCount = await Promise.all(
            clients.map(async (client) => {
                const countSnapshot = await adminDb
                    .collection("products")
                    .where("client_id", "==", client.id)
                    .count()
                    .get();

                return {
                    ...client,
                    productsCount: countSnapshot.data().count,
                };
            }),
        );

        return {
            success: true,
            clients: clientsWithCount,
        };
    } catch (error) {
        console.error("Error fetching clients with count:", error);
        return {
            success: false,
            error: "Failed to add client. Please try again.",
        };
    }
}

// Lightweight fetch for use in dropdowns/selects — no product count query.
export interface ClientSelectOption {
    id: string;
    name: string;
    corp: string;
}

export async function getClientsForSelect(): Promise<
    | { success: true; clients: ClientSelectOption[] }
    | { success: false; error: string }
> {
    try {
        const snapshot = await adminDb
            .collection("clients")
            .orderBy("name", "asc")
            .get();

        const clients: ClientSelectOption[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name ?? "",
                corp: data.corp ?? "",
            };
        });

        return { success: true, clients };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil data klien.";
        console.error("[getClientsForSelect]", err);
        return { success: false, error: message };
    }
}

export async function addClient(
    clientData: Omit<
        Client,
        "id" | "createdAt" | "updatedAt" | "productsCount"
    >,
) {
    try {
        const clientsRef = adminDb.collection("clients");

        const docRef = await clientsRef.add({
            ...clientData,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        revalidatePath("/admin/mitra");

        return {
            success: true,
            productId: docRef.id,
            message: "Client added successfully!",
        };
    } catch (error) {
        console.error("Error adding client to Firebase:", error);
        return {
            success: false,
            error: "Failed to add client. Please try again.",
        };
    }
}

export async function updateClient(
    clientId: string,
    data: Partial<
        Omit<Client, "id" | "favorite" | "createdAt" | "productsCount">
    >,
) {
    try {
        const clientRef = adminDb.collection("clients").doc(clientId);

        await clientRef.update({
            ...data,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return {
            success: true,
            message: "Client updated successfully!",
        };
    } catch (error) {
        console.error("Error updating client:", error);
        return {
            success: false,
            error: "Failed to update client.",
        };
    }
}

export async function deleteClient(clientId: string) {
    try {
        const clientRef = adminDb.collection("clients").doc(clientId);

        await clientRef.delete();

        return {
            success: true,
            message: "Client deleted successfully!",
        };
    } catch (error) {
        console.error("Error deleting client:", error);
        return {
            success: false,
            error: "Failed to delete client.",
        };
    }
}

export async function toggleFavorite(clientId: string, currentStatus: boolean) {
    try {
        const clientRef = adminDb.collection("clients").doc(clientId);

        await clientRef.update({
            favorite: !currentStatus,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { success: false, error: "Failed to update favorite." };
    }
}
