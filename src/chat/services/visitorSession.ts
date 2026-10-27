const VISITOR_ID_STORAGE_KEY = 'rankrise_visitor_id';

function createVisitorId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID.
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function readStoredVisitorId(): string | null {
  try {
    const value = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  } catch {
    // localStorage may be unavailable (private mode / blocked storage).
  }
  return null;
}

function writeStoredVisitorId(visitorId: string): void {
  try {
    localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
  } catch {
    // Ignore write failures; in-memory ID still works for the current session.
  }
}

/**
 * Returns the persistent visitor ID for this browser.
 * Creates one on first visit and reuses it from localStorage thereafter.
 * No login, signup, backend, or database involved.
 */
export function getOrCreateVisitorId(): string {
  const existing = readStoredVisitorId();
  if (existing) return existing;

  const visitorId = createVisitorId();
  writeStoredVisitorId(visitorId);
  return visitorId;
}

export function getVisitorIdStorageKey(): string {
  return VISITOR_ID_STORAGE_KEY;
}
