# RankRise PHP API — Hostinger Shared Hosting (PHP 8.x)

Stateless PHP 8.x backend for Hostinger Shared Hosting.

## Includes

- Env loader, config, optional PDO, router, middleware, auth, logging
- AI workflow: OpenAI cURL client, prompts, knowledge search, decision engine
- Chat AJAX polling + admin routes (JSON file persistence)
- PayPal: `create-order.php` / `capture-order.php` (credentials from `.env`)

## Storage (intentional)

Chat conversations, notifications, and presence use **JSON files** under
`storage/chat/` (atomic write + lock + corrupt backup). This is intentional for
shared hosting — **not** a half-finished MySQL migration.

`lib/Database.php` + `sql/` remain optional (health probe / future use only).
Chat and knowledge do **not** require MySQL.

## Knowledge Base (no HTTP CRUD)

Knowledge is **read-only search** over JSON collection files in
`storage/knowledge/` (or `KB_DATA_DIR`).

There is **no** Knowledge Base CRUD API. Edit / upload JSON files on the server:

- `documents.json`, `faqs.json`, `pricing.json`, `policies.json`, `company_info.json`

## Setup

1. Copy `env.example` → `.env` on the server (`public/api/.env` or `public_html/api/.env`)
2. Set **required** secrets (no placeholders, no empty defaults in code):
   - `ADMIN_API_KEY` (admin routes fail closed with 503 if empty)
   - `OPENAI_API_KEY` (AI fails closed if empty)
   - `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET` (PayPal fails closed if empty)
3. Ensure `storage/`, `storage/chat/`, `storage/logs/`, `storage/knowledge/` are writable
4. Optionally place KB JSON collections in `storage/knowledge/`

## Phase 4 — AI workflow

| Node | PHP |
|------|-----|
| `OpenAiClient.js` | `services/OpenAiClient.php` (cURL) |
| `AiService.js` | `services/AiService.php` |
| `promptBuilder.js` | `services/PromptBuilder.php` |
| `knowledgeSearch.js` | `services/KnowledgeSearchService.php` |
| `decisionEngine.js` | `services/DecisionEngine.php` |
| `aiWorkflow.js` | `services/AiWorkflow.php` |
| `workflow.config.json` | `config/workflow.config.json` |

### AI smoke test (admin key required)

```bash
curl -s -X POST https://your-domain/api/index.php/v1/ai/process \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_KEY" \
  -d '{"message":"I want to talk to a human"}'
```

Expected (no OpenAI call): `type=handover`, `reason=visitor_requested_human`.

## Phase 5 — AJAX chat polling

| Method | Path | Role |
|--------|------|------|
| POST | `/v1/chat/session` | visitor |
| GET | `/v1/chat/history` | visitor |
| POST | `/v1/chat/message` | visitor / agent |
| GET | `/v1/chat/poll` | visitor |
| POST | `/v1/chat/typing` | visitor / agent |
| GET | `/v1/chat/admin/poll` | admin |
| GET | `/v1/chat/conversations` | admin |
| POST | `/v1/chat/conversation/read` | admin |
| GET/POST | `/v1/chat/notifications` (+ `/read`) | admin |
| POST | `/v1/chat/presence` | admin |

Frontend transport (`src/chat/services/*`) polls every ~1.5s. UI components unchanged.

## Phase 6 — Admin backend

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/admin/poll` | Dashboard snapshot (conversations + notifications + presence) |
| GET | `/v1/admin/conversations` | List + filters (`status`, `unread`, `assigned`, `search`) |
| GET | `/v1/admin/conversations/{id}` | Single conversation |
| POST | `/v1/admin/conversations/update` | Status and/or assignment |
| POST | `/v1/admin/conversations/assign` | Assign agent |
| POST | `/v1/admin/conversations/status` | Set `open` / `pending` / `closed` |
| POST | `/v1/admin/conversations/read` | Mark read |
| GET | `/v1/admin/notifications` | List notifications |
| POST | `/v1/admin/notifications/read` | Mark one read |
| POST | `/v1/admin/notifications/read-all` | Mark all read |

Service: `services/AdminChatService.php`. Auth: `X-Admin-Key`.
