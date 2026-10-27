# Chat frontend

Realtime visitor widget + admin dashboard.

## Production config (Phase 5 — AJAX polling)

| Env (build-time) | Purpose |
|------------------|---------|
| `VITE_CHAT_API_URL` | PHP API base, e.g. `/api/index.php` (default in production). |
| `VITE_CHAT_LIVE` | Set `false` to disable live transport (local UI only). |
| `VITE_CHAT_POLL_MS` | Visitor poll interval (default 1500). |
| `VITE_CHAT_ADMIN_POLL_MS` | Admin poll interval (default 1500). |
| `VITE_GOOGLE_SHEETS_URL` | Google Apps Script form endpoint. |

Legacy `VITE_CHAT_SOCKET_URL` is accepted; `ws://` / `wss://` values map to `/api/index.php`.

Admin auth: `/admin/chat` is gated by `AdminAuthGate`. Enter the same
`ADMIN_API_KEY` configured in `public/api/.env`. The key lives in `sessionStorage`
only — never put it in `VITE_*` variables.

## Transport

`src/chat/services/chatSocket.ts` and `adminChatSocket.ts` use short-polling
HTTP against the PHP chat/admin routes. UI components and layout are unchanged.

Admin API (Phase 6): `/v1/admin/poll`, conversation update/assign/status/read,
notifications read / read-all.
