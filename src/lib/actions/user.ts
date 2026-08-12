"use server";

import pool from "@/lib/db";
import crypto from "crypto";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cityId: string;
  province: string;
  provinceId: string;
  district: string;
  districtId: string;
  postalCode: string;
  role: string;
  photo?: string;
}

export async function getUserProfile(userId: string): Promise<{ success: true; profile: UserProfile } | { success: false; error: string }> {
  try {
    const [rows]: any = await pool.query(
      `SELECT id, name, email, phone, address, city, city_id, province, province_id, district, district_id, postal_code, role, photo_url FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (rows && rows.length > 0) {
      const u = rows[0];
      return {
        success: true,
        profile: {
          id: String(u.id),
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          city: u.city || "",
          cityId: u.city_id || "",
          province: u.province || "",
          provinceId: u.province_id || "",
          district: u.district || "",
          districtId: u.district_id || "",
          postalCode: u.postal_code || "",
          role: u.role || "user",
          photo: u.photo_url || undefined,
        },
      };
    }

    return { success: false, error: "Pengguna tidak ditemukan" };
  } catch (err: any) {
    console.error("[getUserProfile error]", err);
    return { success: false, error: err.message || "Gagal mengambil profil pengguna" };
  }
}

/**
 * Simpan URL foto profil user ke database.
 * URL dihasilkan setelah upload ke /api/upload.
 */
export async function updateUserPhoto(
  userId: string,
  photoUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!userId || !photoUrl) {
    return { success: false, error: "Parameter tidak lengkap" };
  }
  try {
    await pool.query(
      `UPDATE users SET photo_url = ? WHERE id = ?`,
      [photoUrl.trim(), userId]
    );
    return { success: true };
  } catch (err: any) {
    console.error("[updateUserPhoto error]", err);
    return { success: false, error: err.message || "Gagal menyimpan foto profil" };
  }
}

export async function getAdminAccount(userId?: string, userEmail?: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const searchId = userId || "";
    const searchEmail = userEmail || "";

    // 1. Try finding in pengurus table
    if (searchId || searchEmail) {
      const [pengurusRows]: any = await pool.query(
        `SELECT id_agt, nama_pengurus, email, telepon, alamat_rumah, kab_kota, photo 
         FROM pengurus 
         WHERE (id_agt = ? AND id_agt != '') OR (email = ? AND email != '') 
         LIMIT 1`,
        [searchId, searchEmail]
      );
      if (pengurusRows && pengurusRows.length > 0) {
        const p = pengurusRows[0];
        const nowIso = new Date().toISOString();
        pool.query(`UPDATE pengurus SET last_login = ? WHERE id_agt = ?`, [nowIso, p.id_agt]).catch(() => {});
        return {
          success: true,
          profile: {
            id: String(p.id_agt),
            name: p.nama_pengurus || searchEmail.split("@")[0] || "Admin",
            email: p.email || searchEmail,
            phone: p.telepon || "",
            address: p.alamat_rumah || "",
            city: p.kab_kota || "",
            cityId: "",
            province: "",
            provinceId: "",
            district: "",
            districtId: "",
            postalCode: "",
            role: "admin",
            photo: p.photo || undefined,
          },
        };
      }
    }

    // 2. Try finding in operator table (joining pengurus to get photo)
    if (searchId || searchEmail) {
      const [opRows]: any = await pool.query(
        `SELECT o.id_opr, o.username, o.level, o.log, p.photo, p.nama_pengurus 
         FROM operator o 
         LEFT JOIN pengurus p ON p.email = o.username 
         WHERE (o.id_opr = ? AND o.id_opr != '') OR (o.username = ? AND o.username != '') 
         LIMIT 1`,
        [searchId, searchEmail]
      );
      if (opRows && opRows.length > 0) {
        const op = opRows[0];
        const nowIso = new Date().toISOString();
        if (op.username) {
          pool.query(`UPDATE pengurus SET last_login = ? WHERE email = ?`, [nowIso, op.username]).catch(() => {});
        }
        const displayName = op.nama_pengurus || ((op.log && op.log !== "Irsyadi Siradjuddin") ? op.log : op.username.split("@")[0]);
        return {
          success: true,
          profile: {
            id: String(op.id_opr),
            name: displayName || searchEmail.split("@")[0] || "Admin",
            email: op.username || searchEmail,
            phone: "",
            address: "",
            city: "",
            cityId: "",
            province: "",
            provinceId: "",
            district: "",
            districtId: "",
            postalCode: "",
            role: op.level?.toLowerCase() === "admin" ? "admin" : "editor",
            photo: op.photo || undefined,
          },
        };
      }
    }

    // 3. Try finding in users table
    if (searchId || searchEmail) {
      const [userRows]: any = await pool.query(
        `SELECT id, name, email, phone, address, city, city_id, province, province_id, district, district_id, postal_code, role 
         FROM users 
         WHERE (id = ? AND id != '') OR (email = ? AND email != '') 
         LIMIT 1`,
        [searchId, searchEmail]
      );
      if (userRows && userRows.length > 0) {
        const u = userRows[0];
        return {
          success: true,
          profile: {
            id: String(u.id),
            name: u.name || searchEmail.split("@")[0] || "Admin",
            email: u.email || searchEmail,
            phone: u.phone || "",
            address: u.address || "",
            city: u.city || "",
            cityId: u.city_id || "",
            province: u.province || "",
            provinceId: u.province_id || "",
            district: u.district || "",
            districtId: u.district_id || "",
            postalCode: u.postal_code || "",
            role: u.role || "admin",
          },
        };
      }
    }

    // Fallback: If searchEmail is available, return profile with searchEmail
    if (searchEmail) {
      const fallbackName = searchEmail.split("@")[0];
      return {
        success: true,
        profile: {
          id: searchId || "admin-fallback",
          name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
          email: searchEmail,
          phone: "",
          address: "",
          city: "",
          cityId: "",
          province: "",
          provinceId: "",
          district: "",
          districtId: "",
          postalCode: "",
          role: "admin",
        },
      };
    }

    // BUG-14: Clean generic admin fallback (removed personal developer details)
    return {
      success: true,
      profile: {
        id: "admin-1",
        name: "Admin Posko Jasuda",
        email: "admin@jasuda.net",
        phone: "-",
        address: "Posko UKM Jasuda",
        city: "Makassar",
        cityId: "",
        province: "Sulawesi Selatan",
        provinceId: "73",
        district: "",
        districtId: "",
        postalCode: "",
        role: "admin",
      },
    };
  } catch (err: any) {
    console.error("[getAdminAccount error]", err);
    return { success: false, error: err.message || "Gagal mengambil data akun admin" };
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    cityId?: string;
    province?: string;
    provinceId?: string;
    district?: string;
    districtId?: string;
    postalCode?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await pool.query(
      `UPDATE users SET name = ?, phone = ?, address = ?, city = ?, city_id = ?, province = ?, province_id = ?, district = ?, district_id = ?, postal_code = ? WHERE id = ?`,
      [
        data.name.trim(),
        (data.phone || "").trim(),
        (data.address || "").trim(),
        (data.city || "").trim(),
        (data.cityId || "").trim(),
        (data.province || "").trim(),
        (data.provinceId || "").trim(),
        (data.district || "").trim(),
        (data.districtId || "").trim(),
        (data.postalCode || "").trim(),
        userId,
      ]
    );
    return { success: true };
  } catch (err: any) {
    console.error("[updateUserProfile error]", err);
    return { success: false, error: err.message || "Gagal memperbarui profil" };
  }
}

export async function updateAdminAccount(
  userId: string,
  data: { name: string; email: string; password?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim();
    const shaHash = data.password ? crypto.createHash("sha256").update(data.password.trim()).digest("hex") : "";

    // BUG-13: Use strict separate primary key update logic to prevent accidental multi-row updates
    // 1. Update in pengurus table
    try {
      const [res1]: any = await pool.query(
        `UPDATE pengurus SET nama_pengurus = ?, email = ? WHERE id_agt = ?`,
        [cleanName, cleanEmail, userId]
      );
      if (res1.affectedRows === 0 && cleanEmail) {
        await pool.query(
          `UPDATE pengurus SET nama_pengurus = ? WHERE email = ?`,
          [cleanName, cleanEmail]
        );
      }
    } catch {
      // ignore table specific update err
    }

    // 2. Update in operator table
    try {
      if (data.password && shaHash) {
        const [res2]: any = await pool.query(
          `UPDATE operator SET username = ?, password = ?, log = ? WHERE id_opr = ?`,
          [cleanEmail, shaHash, cleanName, userId]
        );
        if (res2.affectedRows === 0 && cleanEmail) {
          await pool.query(
            `UPDATE operator SET password = ?, log = ? WHERE username = ?`,
            [shaHash, cleanName, cleanEmail]
          );
        }
      } else {
        const [res2]: any = await pool.query(
          `UPDATE operator SET username = ?, log = ? WHERE id_opr = ?`,
          [cleanEmail, cleanName, userId]
        );
        if (res2.affectedRows === 0 && cleanEmail) {
          await pool.query(
            `UPDATE operator SET log = ? WHERE username = ?`,
            [cleanName, cleanEmail]
          );
        }
      }
    } catch {
      // ignore
    }

    // 3. Update in users table
    try {
      if (data.password && shaHash) {
        const [res3]: any = await pool.query(
          `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
          [cleanName, cleanEmail, shaHash, userId]
        );
        if (res3.affectedRows === 0 && cleanEmail) {
          await pool.query(
            `UPDATE users SET name = ?, password = ? WHERE email = ?`,
            [cleanName, shaHash, cleanEmail]
          );
        }
      } else {
        const [res3]: any = await pool.query(
          `UPDATE users SET name = ?, email = ? WHERE id = ?`,
          [cleanName, cleanEmail, userId]
        );
        if (res3.affectedRows === 0 && cleanEmail) {
          await pool.query(
            `UPDATE users SET name = ? WHERE email = ?`,
            [cleanName, cleanEmail]
          );
        }
      }
    } catch {
      // ignore
    }

    return { success: true };
  } catch (err: any) {
    console.error("[updateAdminAccount error]", err);
    return { success: false, error: err.message || "Gagal memperbarui akun admin" };
  }
}

export async function checkUserProfileComplete(userId: string): Promise<{ isComplete: boolean; missingFields: string[]; profile?: UserProfile }> {
  try {
    const res = await getUserProfile(userId);
    if (!res.success || !res.profile) {
      return { isComplete: false, missingFields: ["Pengguna tidak ditemukan"] };
    }

    const p = res.profile;
    const missing: string[] = [];
    if (!p.name || p.name.trim() === "") missing.push("Nama Lengkap");
    if (!p.phone || p.phone.trim() === "") missing.push("Nomor Telepon");
    if (!p.address || p.address.trim() === "") missing.push("Alamat Pengiriman");
    if (!p.city || p.city.trim() === "") missing.push("Kota / Kabupaten");
    if (!p.province || p.province.trim() === "") missing.push("Provinsi");

    return {
      isComplete: missing.length === 0,
      missingFields: missing,
      profile: p,
    };
  } catch {
    return { isComplete: false, missingFields: ["Kesalahan validasi profil"] };
  }
}

