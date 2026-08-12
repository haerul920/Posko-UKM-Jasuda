"use server";

import pool from "@/lib/db";
import crypto from "crypto";
import { cookies } from "next/headers";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "editor" | "user";
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function getAuthSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("jasuda_session")?.value;
    if (!sessionCookie) return null;
    return JSON.parse(sessionCookie) as AuthUser;
  } catch {
    return null;
  }
}

async function setSessionCookie(user: AuthUser) {
  const cookieStore = await cookies();
  cookieStore.set("jasuda_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("jasuda_session");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password?: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split("@")[0];

    if (!password || password.trim().length < 6) {
      return { success: false, error: "Kata sandi minimal 6 karakter." };
    }

    // Check if email already registered in users table
    const [existing]: any = await pool.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [cleanEmail]
    );

    if (existing && existing.length > 0) {
      return { success: false, error: "Email sudah terdaftar. Silakan masuk." };
    }

    const hashed = hashPassword(password.trim());

    const [result]: any = await pool.query(
      `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, 'user')`,
      [cleanEmail, hashed, cleanName]
    );

    const newId = String(result.insertId);
    const user: AuthUser = {
      uid: newId,
      email: cleanEmail,
      displayName: cleanName,
      role: "user",
    };

    await setSessionCookie(user);

    return {
      success: true,
      user,
    };
  } catch (err: any) {
    console.error("[registerUser error]", err);
    return { success: false, error: err.message || "Gagal membuat akun baru." };
  }
}

export async function loginUser(
  email: string,
  password?: string
): Promise<{ success: true; user: AuthUser } | { success: false; error: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();

    if (!password || password.trim() === "") {
      return { success: false, error: "Kata sandi tidak boleh kosong." };
    }

    const cleanPassword = password.trim();
    const shaHash = hashPassword(cleanPassword);
    const md5Hash = crypto.createHash("md5").update(cleanPassword).digest("hex");

    // 1. Check operator table first using hashed password
    const [rows]: any = await pool.query(
      `SELECT * FROM operator WHERE (username = ?) AND (password = ? OR password = ?) LIMIT 1`,
      [cleanEmail, shaHash, md5Hash]
    );

    if (rows && rows.length > 0) {
      const op = rows[0];
      // Auto-migrate legacy MD5 hash to SHA-256 hash
      if (op.password === md5Hash) {
        await pool.query(`UPDATE operator SET password = ? WHERE id_opr = ?`, [shaHash, op.id_opr]);
      }

      // Update last_login timestamp & login count in pengurus table
      const nowIso = new Date().toISOString();
      await pool.query(
        `UPDATE pengurus SET last_login = ?, count = COALESCE(count, 0) + 1 WHERE email = ?`,
        [nowIso, cleanEmail]
      );

      const role: "admin" | "editor" = op.level?.toLowerCase() === "admin" ? "admin" : "editor";
      const user: AuthUser = {
        uid: String(op.id_opr),
        email: op.username,
        displayName: op.log && op.log !== "Irsyadi Siradjuddin" ? op.log : op.username.split("@")[0] || "Operator",
        role,
      };

      await setSessionCookie(user);
      return { success: true, user };
    }

    // 2. Check pengurus table if operator match not found
    const [pengurusRows]: any = await pool.query(
      `SELECT * FROM pengurus WHERE email = ? LIMIT 1`,
      [cleanEmail]
    );

    if (pengurusRows && pengurusRows.length > 0) {
      const p = pengurusRows[0];
      // If pengurus has password column, check it
      if (p.password) {
        if (p.password !== shaHash && p.password !== md5Hash) {
          return { success: false, error: "Email atau kata sandi tidak valid." };
        }
      }

      // Update last_login timestamp in pengurus table
      const nowIso = new Date().toISOString();
      await pool.query(
        `UPDATE pengurus SET last_login = ?, count = COALESCE(count, 0) + 1 WHERE id_agt = ?`,
        [nowIso, p.id_agt]
      );

      const user: AuthUser = {
        uid: String(p.id_agt),
        email: p.email,
        displayName: p.nama_pengurus || p.email,
        role: "admin",
      };
      await setSessionCookie(user);
      return { success: true, user };
    }

    // 3. Check users table for general registered users
    const [userRows]: any = await pool.query(
      `SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1`,
      [cleanEmail, shaHash]
    );

    if (userRows && userRows.length > 0) {
      const u = userRows[0];
      const user: AuthUser = {
        uid: String(u.id),
        email: u.email,
        displayName: u.name || u.email.split("@")[0],
        role: (u.role as "admin" | "editor" | "user") || "user",
      };
      await setSessionCookie(user);
      return { success: true, user };
    }

    return { success: false, error: "Email atau kata sandi tidak valid." };
  } catch (err: any) {
    console.error("[loginUser error]", err);
    return { success: false, error: err.message || "Gagal melakukan otentikasi." };
  }
}

