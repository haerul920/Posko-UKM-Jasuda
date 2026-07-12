export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  storeId: string; // 'jasuda' or specific tenant ID
  expiryDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
