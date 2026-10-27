import { clearAdminKey, getAdminKey } from '@/chat/admin/services/adminSession';

/** Same-origin PHP front controller (Hostinger). */
export const ADMIN_API_BASE = '/api/index.php';

export class AdminApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = 'bad_request') {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.code = code;
  }
}

type Envelope<T> = {
  ok?: boolean;
  data?: T;
  error?: { message?: string; code?: string };
};

function handleUnauthorized(): void {
  clearAdminKey();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
    window.location.assign('/admin/login');
  }
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit & { adminKey?: string; skipAuth?: boolean; skipUnauthorizedHandler?: boolean }
): Promise<T> {
  const { adminKey, skipAuth, skipUnauthorizedHandler, ...rest } = init ?? {};
  const key = adminKey ?? getAdminKey();
  const url = `${ADMIN_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(rest.headers as Record<string, string> | undefined),
  };

  if (rest.body && !(rest.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth && key) {
    headers['X-Admin-Key'] = key;
  }

  const res = await fetch(url, { ...rest, headers });
  const json = (await res.json().catch(() => ({}))) as Envelope<T>;

  if (
    !skipUnauthorizedHandler &&
    (res.status === 401 || json.error?.code === 'unauthorized')
  ) {
    handleUnauthorized();
  }

  if (!res.ok || json.ok === false) {
    throw new AdminApiError(
      json.error?.message || `Admin API error (${res.status})`,
      res.status,
      json.error?.code || 'error'
    );
  }

  return (json.data ?? (json as unknown as T)) as T;
}

export async function validateAdminKey(key: string): Promise<boolean> {
  try {
    await adminFetch('/health/auth', {
      adminKey: key,
      method: 'GET',
      skipUnauthorizedHandler: true,
    });
    return true;
  } catch {
    return false;
  }
}
