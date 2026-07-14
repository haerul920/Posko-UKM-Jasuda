export type UserRole = "admin" | "editor" | "user";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    role: UserRole;
    createdAt: Date;
}
