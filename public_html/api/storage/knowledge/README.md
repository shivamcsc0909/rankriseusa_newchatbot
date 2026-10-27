# Knowledge Base JSON

Business answers for the chatbot live here (and in `config/knowledge/*.default.json` seeds).

## Collections

| File | Purpose |
|------|---------|
| `company_info.json` | About the company |
| `contact.json` | Phone, email, offices |
| `services.json` | Services catalog |
| `pricing.json` | Packages & pricing |
| `courses.json` | Training / courses |
| `portfolio.json` | Portfolio / case studies |
| `policies.json` | Privacy, refund, terms |
| `office_hours.json` | Hours & locations |
| `documents.json` | Process / general docs |
| `faqs.json` | KB FAQ records |
| `blogs.json` | Blog pointers |

Missing files are seeded automatically from `public/api/config/knowledge/*.default.json`.

Manage records via Admin → Knowledge, or by editing these JSON files.

**Chat flow:** Knowledge → FAQ → Business Data → (optional OpenAI) → Handover

Override path with `KB_DATA_DIR` in `.env`.
