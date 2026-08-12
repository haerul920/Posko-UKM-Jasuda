/**
 * Centralized Date & Time Formatter Helper for Jasuda (Makassar / WITA - UTC+8)
 * Fixed to UTC+8 (Asia/Makassar) for enterprise operations in Makassar.
 */

const TIMEZONE_MAKASSAR = "Asia/Makassar";
const LOCALE_INDONESIA = "id-ID";

/**
 * Safely parses any ISO string, SQL timestamp, or legacy string into a JS Date object.
 * Automatically appends +08:00 (WITA / Makassar offset) if the input string lacks timezone info.
 */
export function parseDynamicDate(dateInput: string | Date | number | null | undefined): Date | null {
    if (!dateInput) return null;
    if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;
    if (typeof dateInput === "number") return new Date(dateInput);

    let str = String(dateInput).trim();

    // Replace SQL space separator with T
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(str)) {
        str = str.replace(" ", "T");
    }

    // If string has no timezone offset (no Z or +/- offset), append +08:00 for WITA / Makassar
    if (/^\d{4}-\d{2}-\d{2}/.test(str) && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(str)) {
        str += "+08:00";
    }

    let parsed = new Date(str);
    if (!isNaN(parsed.getTime())) return parsed;

    // Handle legacy date strings like "18 Apr 2017 09:15:15"
    const cleaned = str.replace(/-/g, "/");
    parsed = new Date(cleaned);
    return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats a date using UTC+8 (Asia/Makassar) timezone.
 */
export function formatClientDate(
    dateInput: string | Date | number | null | undefined,
    options?: Intl.DateTimeFormatOptions,
): string {
    const d = parseDynamicDate(dateInput);
    if (!d) return "-";

    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: TIMEZONE_MAKASSAR,
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options,
    };

    return new Intl.DateTimeFormat(LOCALE_INDONESIA, defaultOptions).format(d);
}

/**
 * Formats date and time using UTC+8 (Asia/Makassar) timezone.
 */
export function formatClientDateTime(
    dateInput: string | Date | number | null | undefined,
    options?: Intl.DateTimeFormatOptions,
): string {
    const d = parseDynamicDate(dateInput);
    if (!d) return "-";

    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: TIMEZONE_MAKASSAR,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        ...options,
    };

    return new Intl.DateTimeFormat(LOCALE_INDONESIA, defaultOptions).format(d);
}

/**
 * Formats relative time dynamically in UTC+8 context (e.g. "Baru saja", "5 menit lalu", "2 jam lalu").
 */
export function formatRelativeTime(dateInput: string | Date | number | null | undefined): string {
    const d = parseDynamicDate(dateInput);
    if (!d) return "Belum pernah masuk";

    const diff = Date.now() - d.getTime();
    if (diff < 0 || diff < 60_000) return "Baru saja";

    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 2) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    if (days < 365) return `${Math.floor(days / 30)} bulan lalu`;
    return `${Math.floor(days / 365)} tahun lalu`;
}
