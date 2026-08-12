"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logActivity, type ActivityActor } from "@/lib/actions/activity-log";
import { isJasudaPosko } from "@/lib/utils";

export interface OnlineMarketplaceLink {
    channel: string;
    link: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    client_id: string;
    corp_name: string;
    expiryDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    favorite: boolean;
    countBuyer: number;
    costPrice?: number;
    commission?: number;
    productCode?: string;
    pirt?: string;
    halalCertificate?: string;
    netWeight?: string;
    shopeeLink?: string;
    isJasudaProduct?: boolean;
    onlineLinks?: OnlineMarketplaceLink[];
}

const DYNAMIC_PRODUCT_IMAGES = [
    "/image/golden seaweed.webp",
    "/image/sea vegetable.webp",
    "/image/nori flakes.webp",
    "/image/pizzata.webp",
    "/image/stik ulva.webp",
    "/image/keripik ulvaku.webp",
    "/image/maeki brownies.webp",
    "/image/seaweed pudding.webp",
    "/image/seavegie.webp",
    "/image/Sea Plants.webp",
];

function getValidImageUrl(photoStr: string | null | undefined, productIdStr: string): string {
    if (!photoStr || photoStr === "nophoto.jpg" || photoStr.trim() === "" || photoStr === "null") {
        return "/image/nothing picture.webp";
    }
    if (photoStr.startsWith("http://") || photoStr.startsWith("https://") || photoStr.startsWith("/")) {
        return photoStr;
    }
    return `/uploads/products/${photoStr}`;
}

export async function getAllProduct() {
    try {
        const [rows]: any = await pool.query(
            `SELECT 
                p.*, 
                k.nama_usaha as corp_name,
                COALESCE(
                    (SELECT SUM(s.volume_beli) - SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk),
                    0
                ) as calculated_stock,
                COALESCE(
                    (SELECT SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk AND s.status = 'jual'),
                    0
                ) as total_sold,
                po.channel1, po.link1,
                po.channel2, po.link2,
                po.channel3, po.link3,
                po.channel4, po.link4,
                po.channel5, po.link5
             FROM produk p 
             LEFT JOIN klien_posko k ON k.id_posko = p.id_posko 
             LEFT JOIN pasar_online po ON po.id_produk = p.id_produk 
             ORDER BY p.is_favorite DESC, total_sold DESC, p.nama_produk ASC`
        );

        const products: Product[] = rows.map((data: any) => {
            const onlineLinks: OnlineMarketplaceLink[] = [];
            for (let i = 1; i <= 5; i++) {
                const ch = data[`channel${i}`];
                const lk = data[`link${i}`];
                if (ch && lk && ch !== "P I L I H" && ch !== "") {
                    onlineLinks.push({ channel: ch, link: lk });
                }
            }

            const corpNameStr = data.corp_name || "";
            const isJasuda = isJasudaPosko(data.id_posko, corpNameStr);
            const pIdStr = String(data.id_produk);

            return {
                id: pIdStr,
                name: data.nama_produk || "",
                description: data.deskripsi || "",
                price: Number(data.harga_jual) || 0,
                stock: Math.max(0, Number(data.calculated_stock) || 0),
                category: "Seaweed",
                imageUrl: getValidImageUrl(data.photo, pIdStr),
                client_id: String(data.id_posko || ""),
                countBuyer: Number(data.total_sold) || 0,
                corp_name: corpNameStr || (isJasuda ? "POSKO JASUDA" : "Mitra Posko"),
                expiryDate: null,
                createdAt: data.tgl_inp ? new Date(data.tgl_inp) : new Date(),
                updatedAt: new Date(),
                favorite: Boolean(data.is_favorite ?? (data.publish === "Y")),
                costPrice: Number(data.harga_beli) || 0,
                commission: 0,
                productCode: data.kode || "",
                pirt: data.legalitas || "",
                halalCertificate: data.sertifikat_halal || "",
                netWeight: data.berat_bersih ? `${data.berat_bersih}g` : "",
                shopeeLink: data.shopee_link || "",
                isJasudaProduct: isJasuda,
                onlineLinks,
            };
        });

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            success: false,
            error: "Failed to fetch products. Please try again.",
        };
    }
}

export async function getProductsByStore(store_name: string) {
    try {
        const isJasudaQuery = store_name.toLowerCase() === "jasuda" || store_name.toLowerCase().includes("posko jasuda");

        const querySql = isJasudaQuery
            ? `SELECT 
                p.*, 
                k.nama_usaha as corp_name,
                COALESCE(
                    (SELECT SUM(s.volume_beli) - SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk),
                    0
                ) as calculated_stock,
                COALESCE(
                    (SELECT SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk AND s.status = 'jual'),
                    0
                ) as total_sold,
                po.channel1, po.link1,
                po.channel2, po.link2,
                po.channel3, po.link3,
                po.channel4, po.link4,
                po.channel5, po.link5
             FROM produk p 
             LEFT JOIN klien_posko k ON k.id_posko = p.id_posko 
             LEFT JOIN pasar_online po ON po.id_produk = p.id_produk 
             WHERE p.id_posko IN (78, 24) OR k.nama_usaha LIKE '%JASUDA%' 
             ORDER BY p.is_favorite DESC, total_sold DESC, p.nama_produk ASC`
            : `SELECT 
                p.*, 
                k.nama_usaha as corp_name,
                COALESCE(
                    (SELECT SUM(s.volume_beli) - SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk),
                    0
                ) as calculated_stock,
                COALESCE(
                    (SELECT SUM(s.volume_jual) FROM stok s WHERE s.id_produk = p.id_produk AND s.status = 'jual'),
                    0
                ) as total_sold,
                po.channel1, po.link1,
                po.channel2, po.link2,
                po.channel3, po.link3,
                po.channel4, po.link4,
                po.channel5, po.link5
             FROM produk p 
             LEFT JOIN klien_posko k ON k.id_posko = p.id_posko 
             LEFT JOIN pasar_online po ON po.id_produk = p.id_produk 
             WHERE k.nama_usaha LIKE ? OR p.id_posko = ? 
             ORDER BY p.is_favorite DESC, total_sold DESC, p.nama_produk ASC`;

        const queryParams = isJasudaQuery ? [] : [`%${store_name}%`, store_name];

        const [rows]: any = await pool.query(querySql, queryParams);

        const products: Product[] = rows.map((data: any) => {
            const onlineLinks: OnlineMarketplaceLink[] = [];
            for (let i = 1; i <= 5; i++) {
                const ch = data[`channel${i}`];
                const lk = data[`link${i}`];
                if (ch && lk && ch !== "P I L I H" && ch !== "") {
                    onlineLinks.push({ channel: ch, link: lk });
                }
            }

            const corpNameStr = data.corp_name || "";
            const isJasuda = isJasudaPosko(data.id_posko, corpNameStr);
            const pIdStr = String(data.id_produk);

            return {
                id: pIdStr,
                name: data.nama_produk || "",
                description: data.deskripsi || "",
                price: Number(data.harga_jual) || 0,
                stock: Math.max(0, Number(data.calculated_stock) || 0),
                category: "Seaweed",
                imageUrl: getValidImageUrl(data.photo, pIdStr),
                client_id: String(data.id_posko || ""),
                countBuyer: Number(data.total_sold) || 0,
                corp_name: corpNameStr || (isJasuda ? "POSKO JASUDA" : "Mitra Posko"),
                expiryDate: null,
                createdAt: data.tgl_inp ? new Date(data.tgl_inp) : new Date(),
                updatedAt: new Date(),
                favorite: Boolean(data.is_favorite ?? (data.publish === "Y")),
                costPrice: Number(data.harga_beli) || 0,
                commission: 0,
                productCode: data.kode || "",
                pirt: data.legalitas || "",
                halalCertificate: data.sertifikat_halal || "",
                netWeight: data.berat_bersih ? `${data.berat_bersih}g` : "",
                isJasudaProduct: isJasuda,
                onlineLinks,
            };
        });

        return {
            success: true,
            products,
        };
    } catch (error) {
        console.error("Error fetching store products:", error);
        return {
            success: false,
            error: "Failed to fetch products. Please try again.",
        };
    }
}

export async function addNewProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    actor?: ActivityActor,
) {
    try {
        const now = new Date();
        const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');

        let poskoId = Number(productData.client_id);
        if (!poskoId || productData.client_id === "jasuda") {
            poskoId = 78; // POSKO JASUDA
        }

        const netWeightNum = parseInt(productData.netWeight || "0", 10) || 0;
        const isFav = productData.favorite ? 1 : 0;

        const [result]: any = await pool.query(
            `INSERT INTO produk 
             (id_posko, kode, nama_produk, deskripsi, berat_bersih, legalitas, sertifikat_halal, harga_beli, harga_jual, photo, publish, is_favorite, tgl_inp, log, shopee_link) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                poskoId,
                productData.productCode || "-",
                productData.name,
                productData.description || null,
                netWeightNum,
                productData.pirt || "-",
                productData.halalCertificate || "-",
                productData.costPrice || 0,
                productData.price,
                productData.imageUrl || "nophoto.jpg",
                isFav ? "Y" : "N",
                isFav,
                nowStr,
                actor?.actorName || "System",
                productData.shopeeLink || "",
            ]
        );

        const newId = String(result.insertId);

        const stockQty = Number(productData.stock) || 0;
        if (stockQty > 0) {
            const day = String(now.getDate());
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthStr = monthNames[now.getMonth()];
            const yearStr = String(now.getFullYear());
            const cost = Number(productData.costPrice) || 0;

            await pool.query(
                `INSERT INTO stok 
                 (id_produk, faktur, tgl, bulan, tahun, volume_beli, harga_beli, total_beli, status, log, tgl_inp) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'beli', ?, ?)`,
                [
                    newId,
                    `POSKO-INIT-${newId}`,
                    day,
                    monthStr,
                    yearStr,
                    stockQty,
                    cost,
                    stockQty * cost,
                    actor?.actorName || "System",
                    nowStr,
                ]
            );
        }

        if (productData.onlineLinks && productData.onlineLinks.length > 0) {
            const links = productData.onlineLinks;
            await pool.query(
                `INSERT INTO pasar_online 
                 (id_produk, channel1, link1, channel2, link2, channel3, link3, log, tgl_inp) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newId,
                    links[0]?.channel || "P I L I H",
                    links[0]?.link || null,
                    links[1]?.channel || "P I L I H",
                    links[1]?.link || null,
                    links[2]?.channel || "P I L I H",
                    links[2]?.link || null,
                    actor?.actorName || "System",
                    nowStr,
                ]
            );
        }

        revalidatePath("/admin/produk");

        if (actor) {
            await logActivity({
                actor,
                action: "CREATE_PRODUCT",
                module: "Produk",
                description: `Menambah produk baru "${productData.name}"`,
                targetId: newId,
                targetName: productData.name,
            });
        }

        return {
            success: true,
            productId: newId,
            message: "Product added successfully!",
        };
    } catch (error) {
        console.error("Error adding product to MySQL:", error);
        return {
            success: false,
            error: "Failed to add product. Please try again.",
        };
    }
}

export async function updateProduct(
    productId: string,
    data: Partial<Omit<Product, "id" | "createdAt">>,
    actor?: ActivityActor,
) {
    try {
        const now = new Date();
        const nowStr = now.toISOString().slice(0, 19).replace('T', ' ');

        const fieldMap: Record<string, string> = {
            name: "nama_produk",
            description: "deskripsi",
            price: "harga_jual",
            costPrice: "harga_beli",
            productCode: "kode",
            pirt: "legalitas",
            halalCertificate: "sertifikat_halal",
            imageUrl: "photo",
            favorite: "is_favorite",
            shopeeLink: "shopee_link",
        };

        const updates: string[] = [];
        const values: any[] = [];

        Object.entries(data).forEach(([key, val]) => {
            if (fieldMap[key] && val !== undefined) {
                if (key === "favorite") {
                    updates.push("is_favorite = ?");
                    values.push(val ? 1 : 0);
                    updates.push("publish = ?");
                    values.push(val ? "Y" : "N");
                } else {
                    updates.push(`${fieldMap[key]} = ?`);
                    values.push(val);
                }
            }
        });

        if (updates.length > 0) {
            values.push(productId);
            await pool.query(
                `UPDATE produk SET ${updates.join(", ")} WHERE id_produk = ?`,
                values
            );
        }

        if (data.stock !== undefined) {
            const targetStock = Math.max(0, Number(data.stock) || 0);
            const [calcRows]: any = await pool.query(
                `SELECT COALESCE(SUM(volume_beli) - SUM(volume_jual), 0) as current_stock FROM stok WHERE id_produk = ?`,
                [productId]
            );
            const currentStock = Number(calcRows[0]?.current_stock || 0);
            const diff = targetStock - currentStock;

            if (diff !== 0) {
                const day = String(now.getDate());
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthStr = monthNames[now.getMonth()];
                const yearStr = String(now.getFullYear());
                const cost = Number(data.costPrice) || 0;
                const status = diff > 0 ? "beli" : "jual";
                const absDiff = Math.abs(diff);

                await pool.query(
                    `INSERT INTO stok 
                     (id_produk, faktur, tgl, bulan, tahun, volume_beli, volume_jual, harga_beli, total_beli, status, log, tgl_inp) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        productId,
                        `POSKO-ADJ-${productId}-${Date.now()}`,
                        day,
                        monthStr,
                        yearStr,
                        diff > 0 ? absDiff : 0,
                        diff < 0 ? absDiff : 0,
                        cost,
                        absDiff * cost,
                        status,
                        actor?.actorName || "System (Penyesuaian Stok)",
                        nowStr,
                    ]
                );
            }
        }

        if (data.onlineLinks && data.onlineLinks.length > 0) {
            const links = data.onlineLinks;
            const [poRows]: any = await pool.query(`SELECT id_online FROM pasar_online WHERE id_produk = ?`, [productId]);

            if (poRows && poRows.length > 0) {
                await pool.query(
                    `UPDATE pasar_online SET 
                        channel1 = ?, link1 = ?, 
                        channel2 = ?, link2 = ?, 
                        channel3 = ?, link3 = ?, 
                        log = ?, 
                        tgl_update = ?
                     WHERE id_produk = ?`,
                    [
                        links[0]?.channel || "P I L I H",
                        links[0]?.link || null,
                        links[1]?.channel || "P I L I H",
                        links[1]?.link || null,
                        links[2]?.channel || "P I L I H",
                        links[2]?.link || null,
                        actor?.actorName || "System",
                        nowStr,
                        productId,
                    ]
                );
            } else {
                await pool.query(
                    `INSERT INTO pasar_online 
                     (id_produk, channel1, link1, channel2, link2, channel3, link3, log, tgl_inp) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        productId,
                        links[0]?.channel || "P I L I H",
                        links[0]?.link || null,
                        links[1]?.channel || "P I L I H",
                        links[1]?.link || null,
                        links[2]?.channel || "P I L I H",
                        links[2]?.link || null,
                        actor?.actorName || "System",
                        nowStr,
                    ]
                );
            }
        }

        revalidatePath("/admin/produk");

        if (actor) {
            await logActivity({
                actor,
                action: "UPDATE_PRODUCT",
                module: "Produk",
                description: `Memperbarui produk "${data.name ?? productId}"`,
                targetId: productId,
                targetName: data.name,
            });
        }

        return {
            success: true,
            message: "Product updated successfully!",
        };
    } catch (error) {
        console.error("Error updating product:", error);
        return {
            success: false,
            error: "Failed to update product.",
        };
    }
}

export async function deleteProduct(
    productId: string,
    actor?: ActivityActor,
    productName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        await pool.query(`DELETE FROM stok WHERE id_produk = ?`, [productId]);
        await pool.query(`DELETE FROM pasar_online WHERE id_produk = ?`, [productId]);
        await pool.query(`DELETE FROM produk WHERE id_produk = ?`, [productId]);

        revalidatePath("/admin/produk");

        if (actor) {
            await logActivity({
                actor,
                action: "DELETE_PRODUCT",
                module: "Produk",
                description: `Menghapus produk "${productName ?? productId}"`,
                targetId: productId,
                targetName: productName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Gagal menghapus produk.";
        console.error("[deleteProduct]", err);
        return { success: false, error: message };
    }
}

export async function toggleProductFavorite(
    productId: string,
    currentStatus: boolean,
    actor?: ActivityActor,
    productName?: string,
): Promise<{ success: true } | { success: false; error: string }> {
    try {
        const nextStatusNum = !currentStatus ? 1 : 0;
        const nextStatusStr = !currentStatus ? "Y" : "N";
        await pool.query(
            `UPDATE produk SET is_favorite = ?, publish = ? WHERE id_produk = ?`,
            [nextStatusNum, nextStatusStr, productId]
        );

        revalidatePath("/admin/produk");

        if (actor) {
            await logActivity({
                actor,
                action: "TOGGLE_FAVORITE_PRODUCT",
                module: "Produk",
                description: `${!currentStatus ? "Menandai" : "Membatalkan tanda"} produk "${productName ?? productId}" sebagai favorit`,
                targetId: productId,
                targetName: productName,
            });
        }

        return { success: true };
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Gagal memperbarui status favorit produk.";
        console.error("[toggleProductFavorite]", err);
        return { success: false, error: message };
    }
}
