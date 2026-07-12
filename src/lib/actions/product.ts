"use server";

import { adminDb } from '@/lib/firebase/admin';
import { Product } from '@/types/firebase';

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  try {
    const productsSnapshot = await adminDb
      .collection('products')
      .where('storeId', '==', storeId)
      .orderBy('createdAt', 'desc')
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
        storeId: data.storeId,
        expiryDate: data.expiryDate ? data.expiryDate.toDate() : null,
        createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
      });
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
