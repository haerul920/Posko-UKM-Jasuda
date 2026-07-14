import { UserProfile } from "firebase/auth";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    client: Client;
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

export interface AuditTarget {
    collection: "products" | "clients" | string;
    id: string;
    name: string;
}

export interface AuditChanges {
    before?: Record<string, any>;
    after?: Record<string, any>;
}

export interface AuditMetadata {
    ip_address: string;
    user_agent: string;
}

export interface ActivityLog {
    id: string;
    actor: UserProfile;
    action: "create" | "update" | "delete" | "login" | string;
    target: AuditTarget;
    changes: AuditChanges;
    metadata: AuditMetadata;
    createdAt: Date;
}
