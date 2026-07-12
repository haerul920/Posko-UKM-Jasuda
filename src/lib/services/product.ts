import { db, storage } from '@/lib/firebase/client';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Product } from '@/types/firebase';
import { useEffect, useState } from 'react';

export const uploadProductImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const storageRef = ref(storage, fileName);
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...productData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// Hook for realtime admin inventory
export const useInventoryRealtime = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
          imageUrl: data.imageUrl,
          storeId: data.storeId,
          expiryDate: data.expiryDate ? data.expiryDate.toDate() : null,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });
      setProducts(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching inventory:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading };
};
