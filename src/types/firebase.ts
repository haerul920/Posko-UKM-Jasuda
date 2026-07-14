export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    store_name: string; // 'jasuda' or specific tenant ID
    expiryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Mitra
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
    siupNumber?: string;
    npwpNumber?: string;
    tdpNumber?: string;
    pirtNumber?: string;
    googleMapsLink: string;
    favorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}
