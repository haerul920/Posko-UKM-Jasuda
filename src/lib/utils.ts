import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isJasudaPosko(poskoId?: number | string | null, poskoName?: string | null): boolean {
  const pId = poskoId !== undefined && poskoId !== null ? Number(poskoId) : null;
  if (pId === 78 || pId === 24) return true;
  if (poskoName) {
    const nameUpper = poskoName.trim().toUpperCase();
    if (nameUpper.includes("JASUDA") || nameUpper.includes("POSKO JASUDA")) return true;
  }
  return false;
}

