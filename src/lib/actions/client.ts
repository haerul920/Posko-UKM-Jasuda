"use server";

import { adminDb } from "@/lib/firebase/admin";
import { Client, Product } from "@/types/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export const uploadProductImage = async (
    file: File,
    onProgress?: (progress: number) => void,
): Promise<string> => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref,
                );
                resolve(downloadURL);
            },
        );
    });
};

export async function getAllClients() {
    try {
        const clientsSnapshot = await adminDb.collection("clients").get();

        // 1. Map documents to your Client interface first
        const clients: Client[] = clientsSnapshot.docs.map((doc) => {
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
            };
        });

        // 2. Attach the productsCount to each client
        const clientsWithCount = await Promise.all(
            clients.map(async (client) => {
                const countSnapshot = await adminDb
                    .collection("products")
                    .where("clientId", "==", client.id)
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

export async function addClient(
    clientData: Omit<Client, "id" | "createdAt" | "updatedAt">,
) {
    try {
        const clientsRef = adminDb.collection("clients");

        const docRef = await clientsRef.add({
            ...clientData,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

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

export async function updateProduct(
    productId: string,
    data: Partial<Omit<Product, "id" | "createdAt">>,
) {
    try {
        const productRef = adminDb.collection("products").doc(productId);

        await productRef.update({
            ...data,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return {
            success: true,
            message: "Product updated successfully!",
        };
    } catch (error) {
        console.error("Error updating product:", error);
        return {
            success: false,
            error: "Failed to update product.",
        };
    }
}

export async function updateClient(
    clientId: string,
    data: Partial<Omit<Client, "id" | "createdAt">>,
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

