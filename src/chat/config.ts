// Chat feature configuration.

// Phase 5: AJAX polling over PHP API (Hostinger Shared Hosting).
// WebSocket / Node socket servers are no longer used.
//
// Set VITE_CHAT_API_URL to override (e.g. https://rankriseusa.com/api/index.php).
// Set VITE_CHAT_LIVE=false to disable live chat (local UI only).
// In production builds, defaults to same-origin `/api/index.php`.

const liveDisabled = import.meta.env.VITE_CHAT_LIVE === 'false';
const configuredApi =
  (import.meta.env.VITE_CHAT_API_URL as string | undefined)?.trim() ||
  (import.meta.env.VITE_CHAT_SOCKET_URL as string | undefined)?.trim() ||
  '';

function resolveApiBase(): string | null {
  if (liveDisabled) return null;
  if (configuredApi) {
    // Legacy ws:// / wss:// values are mapped to the PHP API front controller.
    if (/^wss?:\/\//i.test(configuredApi)) {
      return '/api/index.php';
    }
    return configuredApi.replace(/\/$/, '');
  }
  // Hostinger / production: enable polling by default on same origin.
  if (import.meta.env.PROD) return '/api/index.php';
  // Local Vite: enable when public PHP is reachable at /api/index.php (or set env).
  return '/api/index.php';
}

/** HTTP API base used by the polling transport (not a WebSocket URL). */
export const CHAT_API_BASE: string | null = resolveApiBase();

/**
 * @deprecated Name kept so existing hooks keep working. Value is the PHP API base.
 */
export const CHAT_SOCKET_URL: string | null = CHAT_API_BASE;

// Admin credentials are never baked into the client bundle.
// Operators unlock /admin/chat with ADMIN_API_KEY via AdminAuthGate
// (sessionStorage). Do not set VITE_CHAT_ADMIN_KEY in production builds.

export const CHAT_POLL_INTERVAL_MS = Number(import.meta.env.VITE_CHAT_POLL_MS) > 0
  ? Number(import.meta.env.VITE_CHAT_POLL_MS)
  : 1500;

export const CHAT_ADMIN_POLL_INTERVAL_MS = Number(import.meta.env.VITE_CHAT_ADMIN_POLL_MS) > 0
  ? Number(import.meta.env.VITE_CHAT_ADMIN_POLL_MS)
  : 1500;
