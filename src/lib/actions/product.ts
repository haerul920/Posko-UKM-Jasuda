"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    client_id: string;
    corp_name: string;
    expiryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    favorite: boolean;
    countBuyer: number;
    costPrice?: number;
    commission?: number;
}

export async function getAllProduct() {
    try {
        const productsSnapshot = await adminDb
            .collection("products")
            .orderBy("createdAt", "desc")
            .get();

        const products: Product[] = [];
        productsSnapshot.forEach((doc: any) => {
            const data = doc.data();

            products.push({
                id: doc.id,
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                category: data.category,
                imageUrl: data.imageUrl,
                client_id: data.client_id,
                countBuyer: 0,
                corp_name: data.corp_name ?? data.client_name ?? "",
                expiryDate: data.expiryDate?.toDate
                    ? data.expiryDate.toDate()
                    : data.expiryDate,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : data.createdAt,
                updatedAt: data.updatedAt?.toDate
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
                favorite: data.favorite ?? false,
                costPrice: data.costPrice,
                commission: data.commission,
            });
        });

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            success: false,
            error: "Failed to add product. Please try again.",
        };
    }
}

export async function getProductsByStore(store_name: string) {
    try {
        const productsSnapshot = await adminDb
            .collection("products")
            .where("store_name", "==", store_name)
            .orderBy("createdAt", "desc")
            .limit(20)
            .get();

        const products: Product[] = [];
        productsSnapshot.forEach((doc: any) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                category: data.category,
                imageUrl: data.imageUrl,
                client_id: data.client_id,
                countBuyer: data.countBuyer,
                corp_name: data.corp_name ?? data.client_name ?? "",
                expiryDate: data.expiryDate?.toDate
                    ? data.expiryDate.toDate()
                    : data.expiryDate,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : data.createdAt,
                updatedAt: data.updatedAt?.toDate
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
                favorite: data.favorite ?? false,
                costPrice: data.costPrice,
                commission: data.commission,
            });
        });

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            success: false,
            error: "Failed to add product. Please try again.",
        };
    }
}

export async function addNewProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    actor?: ActivityActor,
) {
    try {
        const productsRef = adminDb.collection("products");

        const docRef = await productsRef.add({
            ...productData,
            favorite: false,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_PRODUCT",
                module: "Produk",
                description: `Menambah produk baru "${productData.name}"`,
                targetId: docRef.id,
                targetName: productData.name,
            });
        }

        return {
            success: true,
            productId: docRef.id,
            message: "Product added successfully!",
        };
    } catch (error) {
        console.error("Error adding product to Firebase:", error);
        return {
            success: false,
            error: "Failed to add product. Please try again.",
        };
    }
}

export async function updateProduct(
    productId: string,
    data: Partial<Omit<Product, "id" | "createdAt">>,
    actor?: ActivityActor,
) {
    try {
        const productRef = adminDb.collection("products").doc(productId);

        await productRef.update({
            ...data,
            updatedAt: FieldValue.serverTimestamp(),
        });

        if (actor) {
            await logActivity({
                actor,
                action: "UPDATE_PRODUCT",
                module: "Produk",
                description: `Memperbarui produk "${data.name ?? productId}"`,
                targetId: productId,
                targetName: data.name,
            });
        }

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

export async function deleteProduct(
    productId: string,
    actor?: ActivityActor,
    productName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await adminDb.collection("products").doc(productId).delete();

        const { revalidatePath } = await import("next/cache");
        revalidatePath("/admin/inventaris");

        if (actor) {
            await logActivity({
                actor,
                action: "DELETE_PRODUCT",
                module: "Produk",
                description: `Menghapus produk "${productName ?? productId}"`,
                targetId: productId,
                targetName: productName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal menghapus produk.";
        console.error("[deleteProduct]", err);
        return { success: false, error: message };
    }
}

export async function toggleProductFavorite(
    productId: string,
    currentStatus: boolean,
    actor?: ActivityActor,
    productName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const productRef = adminDb.collection("products").doc(productId);

        await productRef.update({
            favorite: !currentStatus,
            updatedAt: FieldValue.serverTimestamp(),
        });

        if (actor) {
            await logActivity({
                actor,
                action: "TOGGLE_FAVORITE_PRODUCT",
                module: "Produk",
                description: `${!currentStatus ? "Menandai" : "Membatalkan tanda"} produk "${productName ?? productId}" sebagai favorit`,
                targetId: productId,
                targetName: productName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Gagal memperbarui status favorit produk.";
        console.error("[toggleProductFavorite]", err);
        return { success: false, error: message };
    }
}
