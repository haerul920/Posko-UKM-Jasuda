"use server";

import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    client_id: string;
    client_name: string;
    expiryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

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
                client_name: data.client_name,
                expiryDate: data.expiryDate?.toDate
                    ? data.expiryDate.toDate()
                    : data.expiryDate,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : data.createdAt,
                updatedAt: data.updatedAt?.toDate
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
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
                client_name: data.client_id,
                expiryDate: data.expiryDate?.toDate
                    ? data.expiryDate.toDate()
                    : data.expiryDate,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : data.createdAt,
                updatedAt: data.updatedAt?.toDate
                    ? data.updatedAt.toDate()
                    : data.updatedAt,
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
) {
    try {
        const productsRef = adminDb.collection("products");

        const docRef = await productsRef.add({
            ...productData,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

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
