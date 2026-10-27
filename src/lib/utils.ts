import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function submitToSheet(
  sheetName: string,
  formData: Record<string, string>
): Promise<void> {
  // Dual-write: persist to RankRise leads API (Admin inbox) best-effort.
  try {
    await fetch('/api/index.php/v1/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: sheetName,
        name:
          formData.name ||
          formData.Name ||
          formData.fullName ||
          formData.full_name ||
          '',
        email: formData.email || formData.Email || '',
        phone: formData.phone || formData.Phone || formData.mobile || '',
        company: formData.company || formData.Company || '',
        message: formData.message || formData.Message || formData.notes || '',
        fields: formData,
        // Honeypot only — never map real website_url into hp_field.
        hp_field: formData.hp_field || formData.hp || '',
      }),
    });
  } catch {
    // Non-blocking — Sheets remains primary marketing CRM.
  }

  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined;
  if (!url) {
    if (import.meta.env.DEV) {
      console.warn("[Google Sheet Warning] VITE_GOOGLE_SHEETS_URL is not configured.");
    }
    return;
  }

  try {
    const body = new URLSearchParams({
      sheetName,
      timestamp: new Date().toISOString(),
      ...formData,
    });

    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: body.toString(),
    });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[Google Sheet Error]", err);
    }
  }
}
