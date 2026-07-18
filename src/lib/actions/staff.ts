"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StaffRole = "admin" | "editor";

export interface StaffUser {
    uid: string;
    displayName: string;
    email: string;
    role: StaffRole;
    favorite: boolean;
    phone?: string;
    address?: string;
    birthPlace?: string;
    birthDate?: string;
    status: "Aktif" | "Nonaktif";
    lastSignInTime: string | null; // ISO string
    createdAt: string | null; // ISO string
}

interface RegisterStaffInput {
    displayName: string;
    email: string;
    password: string;
    role: StaffRole;
    phone?: string;
    address?: string;
    birthPlace?: string;
    birthDate?: string;
}

interface UpdateStaffInput {
    displayName?: string;
    role?: StaffRole;
    phone?: string;
    address?: string;
    birthPlace?: string;
    birthDate?: string;
}

// ---------------------------------------------------------------------------
// Register a new staff user (admin creates account with temporary password)
// ---------------------------------------------------------------------------

export async function registerStaffUser(
    input: RegisterStaffInput,
    actor?: ActivityActor,
): Promise<{ success: true; uid: string } | { success: false; error: string }> {
    try {
        // 1. Create the Firebase Auth user
        const userRecord = await adminAuth.createUser({
            email: input.email,
            password: input.password,
            displayName: input.displayName,
            emailVerified: false,
        });

        // 2. Write the user document to Firestore
        await adminDb
            .collection("users")
            .doc(userRecord.uid)
            .set({
                uid: userRecord.uid,
                email: input.email,
                displayName: input.displayName,
                role: input.role,
                favorite: false,
                phone: input.phone ?? "",
                address: input.address ?? "",
                birthPlace: input.birthPlace ?? "",
                birthDate: input.birthDate ?? "",
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_STAFF",
                module: "Staf",
                description: `Menambah pengelola baru "${input.displayName}" (${input.role})`,
                targetId: userRecord.uid,
                targetName: input.displayName,
            });
        }

        return { success: true, uid: userRecord.uid };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal membuat pengguna.";
        console.error("[registerStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Fetch all staff users (role: admin | editor)
// ---------------------------------------------------------------------------

export async function getStaffUsers(): Promise<
    { success: true; staff: StaffUser[] } | { success: false; error: string }
> {
    try {
        const snapshot = await adminDb
            .collection("users")
            .where("role", "in", ["admin", "editor"])
            .orderBy("favorite", "desc")
            .orderBy("createdAt", "desc")
            .get();

        const staff: StaffUser[] = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                // Try to get last sign-in time from Firebase Auth
                let lastSignInTime: string | null = null;
                try {
                    const authUser = await adminAuth.getUser(docSnap.id);
                    lastSignInTime = authUser.metadata.lastSignInTime ?? null;
                } catch {
                    // User may not have signed in yet
                }

                const createdAt = data.createdAt?.toDate
                    ? (data.createdAt.toDate() as Date).toISOString()
                    : null;

                return {
                    uid: docSnap.id,
                    displayName: data.displayName ?? "",
                    email: data.email ?? "",
                    role: data.role as StaffRole,
                    favorite: data.favorite ?? false,
                    phone: data.phone ?? "",
                    address: data.address ?? "",
                    birthPlace: data.birthPlace ?? "",
                    birthDate: data.birthDate ?? "",
                    status: "Aktif" as const,
                    lastSignInTime,
                    createdAt,
                };
            }),
        );

        return { success: true, staff };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal mengambil data staf.";
        console.error("[getStaffUsers]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Update existing staff user info
// ---------------------------------------------------------------------------

export async function updateStaffUser(
    uid: string,
    input: UpdateStaffInput,
    actor?: ActivityActor,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        // Update Firebase Auth display name if provided
        if (input.displayName !== undefined) {
            await adminAuth.updateUser(uid, { displayName: input.displayName });
        }

        // Update Firestore document
        const updateData: Record<string, unknown> = {
            updatedAt: FieldValue.serverTimestamp(),
        };
        if (input.displayName !== undefined)
            updateData.displayName = input.displayName;
        if (input.role !== undefined) updateData.role = input.role;
        if (input.phone !== undefined) updateData.phone = input.phone;
        if (input.address !== undefined) updateData.address = input.address;
        if (input.birthPlace !== undefined)
            updateData.birthPlace = input.birthPlace;
        if (input.birthDate !== undefined)
            updateData.birthDate = input.birthDate;

        await adminDb.collection("users").doc(uid).update(updateData);

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "UPDATE_STAFF",
                module: "Staf",
                description: `Memperbarui data pengelola "${input.displayName ?? uid}"`,
                targetId: uid,
                targetName: input.displayName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal memperbarui data staf.";
        console.error("[updateStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Delete a staff user from Auth + Firestore
// ---------------------------------------------------------------------------

export async function deleteStaffUser(
    uid: string,
    actor?: ActivityActor,
    staffName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await adminAuth.deleteUser(uid);
        await adminDb.collection("users").doc(uid).delete();

        revalidatePath("/admin/pengaturan");

        if (actor) {
            await logActivity({
                actor,
                action: "DELETE_STAFF",
                module: "Staf",
                description: `Menghapus pengelola "${staffName ?? uid}"`,
                targetId: uid,
                targetName: staffName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal menghapus pengguna.";
        console.error("[deleteStaffUser]", err);
        return { success: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Toggle favorite status for a staff user
// ---------------------------------------------------------------------------

export async function toggleStaffFavorite(
    uid: string,
    currentStatus: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await adminDb.collection("users").doc(uid).update({
            favorite: !currentStatus,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal memperbarui favorit.";
        console.error("[toggleStaffFavorite]", err);
        return { success: false, error: message };
    }
}
