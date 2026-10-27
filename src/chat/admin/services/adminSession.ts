const STORAGE_KEY = 'rankrise-admin-key';

export function getAdminKey(): string | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return value && value.trim() ? value.trim() : null;
  } catch {
    return null;
  }
}

export function setAdminKey(key: string): void {
  sessionStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearAdminKey(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
