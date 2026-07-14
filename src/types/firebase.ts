import { UserProfile } from "firebase/auth";

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

export type { Product } from "@/lib/actions/product";
