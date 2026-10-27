import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { adminFetch } from '../lib/adminApi';
import { Save, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Settings = {
  app: { name: string; env: string; debug: boolean; url: string };
  php: string;
  database: { configured: boolean; reachable: boolean };
  openai: { configured: boolean; model: string };
  auth: { admin_configured: boolean; header: string };
  cors: { origins_count: number; allow_localhost: boolean };
  poll: Record<string, number>;
  knowledge: { collections: string[]; files_present: string[] };
  storage: {
    chat_writable: boolean;
    leads_writable: boolean;
    uploads_writable: boolean;
    knowledge_writable: boolean;
  };
};

type Workflow = {
  prompt: {
    companyName: string;
    maxHistoryMessages: number;
    emptyKnowledgePlaceholder: string;
  };
  knowledgeSearch: {
    collections: string[];
    maxResults: number;
    minScore: number;
  };
  decision: {
    handoverMessage: string;
    errorMessage: string;
    humanRequestPatterns: string[];
    escalationPatterns: string[];
  };
  ai: { enabled?: boolean; temperature: number; maxTokens: number };
  faq: { enabled: boolean; minScore: number };
  localAnswer?: { enabled?: boolean; knowledgeMinScore?: number; businessMinScore?: number };
};

function Row({ label, value }: { label: string; value: string | number | boolean }) {
  const display =
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value ?? '—');
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="font-medium text-right break-all">{display}</span>
    </div>
  );
}

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [rebuilding, setRebuilding] = useState(false);
  const [indexStatus, setIndexStatus] = useState<{
    exists?: boolean;
    built_at?: string;
    doc_count?: number;
    sources?: Record<string, number>;
  } | null>(null);

  const loadIndexStatus = useCallback(async () => {
    try {
      const data = await adminFetch<{
        exists?: boolean;
        built_at?: string;
        doc_count?: number;
        sources?: Record<string, number>;
      }>('/v1/admin/knowledge/index-status');
      setIndexStatus(data);
    } catch {
      setIndexStatus(null);
    }
  }, []);

  async function rebuildKnowledgeIndex() {
    setRebuilding(true);
    try {
      const data = await adminFetch<{
        doc_count?: number;
        built_at?: string;
        sources?: Record<string, number>;
      }>('/v1/admin/knowledge/rebuild-index', { method: 'POST', body: '{}' });
      toast.success(`Knowledge index rebuilt (${data.doc_count ?? 0} docs)`);
      setIndexStatus({
        exists: true,
        built_at: data.built_at,
        doc_count: data.doc_count,
        sources: data.sources,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Rebuild failed');
    } finally {
      setRebuilding(false);
    }
  }
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      adminFetch<Settings>('/v1/admin/settings'),
      adminFetch<{ workflow: Workflow }>('/v1/admin/settings/workflow'),
    ])
      .then(([health, wf]) => {
        setSettings(health);
        setWorkflow(wf.workflow);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load settings'));
    void loadIndexStatus();
  }, [loadIndexStatus]);

  const saveWorkflow = async (e: FormEvent) => {
    e.preventDefault();
    if (!workflow) return;
    setSaving(true);
    try {
      const data = await adminFetch<{ workflow: Workflow }>('/v1/admin/settings/workflow', {
        method: 'POST',
        body: JSON.stringify(workflow),
      });
      setWorkflow(data.workflow);
      toast.success('Chat workflow settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-white/50 mt-1">
          Server health (read-only) and chatbot workflow preferences. Secrets are never shown.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white/70">Website Knowledge Index</h2>
            <p className="text-xs text-white/40 mt-1">
              Chatbot answers only from indexed website content (pages, FAQ, knowledge, blog).
            </p>
            {indexStatus && (
              <p className="text-[11px] text-white/35 mt-2 font-mono">
                {indexStatus.exists ? 'Ready' : 'Missing'} · {indexStatus.doc_count ?? 0} docs
                {indexStatus.built_at ? ` · built ${indexStatus.built_at}` : ''}
              </p>
            )}
          </div>
          <Button
            type="button"
            disabled={rebuilding}
            onClick={() => void rebuildKnowledgeIndex()}
            className="bg-white text-black hover:bg-white/90"
          >
            {rebuilding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Rebuild Knowledge Index
          </Button>
        </div>
      </section>

      {workflow && (
        <form
          onSubmit={saveWorkflow}
          className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white/70">Chat & AI Workflow</h2>
            <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-white/90">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block text-xs text-white/40">
              Company name
              <input
                className={`${fieldClass} mt-1`}
                value={workflow.prompt.companyName}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    prompt: { ...workflow.prompt, companyName: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-xs text-white/40">
              Max history messages
              <input
                type="number"
                min={1}
                max={50}
                className={`${fieldClass} mt-1`}
                value={workflow.prompt.maxHistoryMessages}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    prompt: { ...workflow.prompt, maxHistoryMessages: Number(e.target.value) },
                  })
                }
              />
            </label>
            <label className="block text-xs text-white/40">
              AI temperature
              <input
                type="number"
                step="0.1"
                min={0}
                max={2}
                className={`${fieldClass} mt-1`}
                value={workflow.ai.temperature}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    ai: { ...workflow.ai, temperature: Number(e.target.value) },
                  })
                }
              />
            </label>
            <label className="block text-xs text-white/40">
              AI max tokens
              <input
                type="number"
                min={50}
                max={4000}
                className={`${fieldClass} mt-1`}
                value={workflow.ai.maxTokens}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    ai: { ...workflow.ai, maxTokens: Number(e.target.value) },
                  })
                }
              />
            </label>
            <label className="block text-xs text-white/40">
              Knowledge max results
              <input
                type="number"
                min={1}
                max={20}
                className={`${fieldClass} mt-1`}
                value={workflow.knowledgeSearch.maxResults}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    knowledgeSearch: {
                      ...workflow.knowledgeSearch,
                      maxResults: Number(e.target.value),
                    },
                  })
                }
              />
            </label>
            <label className="block text-xs text-white/40">
              FAQ min score
              <input
                type="number"
                min={0}
                className={`${fieldClass} mt-1`}
                value={workflow.faq.minScore}
                onChange={(e) =>
                  setWorkflow({
                    ...workflow,
                    faq: { ...workflow.faq, minScore: Number(e.target.value) },
                  })
                }
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={workflow.faq.enabled}
              onChange={(e) =>
                setWorkflow({
                  ...workflow,
                  faq: { ...workflow.faq, enabled: e.target.checked },
                })
              }
            />
            FAQ first-response layer enabled
          </label>

          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={workflow.ai.enabled !== false}
              onChange={(e) =>
                setWorkflow({
                  ...workflow,
                  ai: { ...workflow.ai, enabled: e.target.checked },
                })
              }
            />
            OpenAI fallback enabled (optional — chatbot works from Knowledge/FAQ without it)
          </label>

          <label className="block text-xs text-white/40">
            Knowledge collections (comma-separated)
            <input
              className={`${fieldClass} mt-1`}
              value={workflow.knowledgeSearch.collections.join(', ')}
              onChange={(e) =>
                setWorkflow({
                  ...workflow,
                  knowledgeSearch: {
                    ...workflow.knowledgeSearch,
                    collections: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  },
                })
              }
            />
          </label>

          <label className="block text-xs text-white/40">
            Handover message
            <textarea
              className={`${fieldClass} mt-1 min-h-[100px]`}
              value={workflow.decision.handoverMessage}
              onChange={(e) =>
                setWorkflow({
                  ...workflow,
                  decision: { ...workflow.decision, handoverMessage: e.target.value },
                })
              }
            />
          </label>

          <label className="block text-xs text-white/40">
            Error fallback message
            <textarea
              className={`${fieldClass} mt-1 min-h-[80px]`}
              value={workflow.decision.errorMessage}
              onChange={(e) =>
                setWorkflow({
                  ...workflow,
                  decision: { ...workflow.decision, errorMessage: e.target.value },
                })
              }
            />
          </label>
        </form>
      )}

      {settings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Application</h2>
            <Row label="Name" value={settings.app.name} />
            <Row label="Environment" value={settings.app.env} />
            <Row label="Debug" value={settings.app.debug} />
            <Row label="APP_URL" value={settings.app.url} />
            <Row label="PHP" value={settings.php} />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Integrations</h2>
            <Row label="Admin auth configured" value={settings.auth.admin_configured} />
            <Row label="Admin header" value={settings.auth.header} />
            <Row label="OpenAI configured" value={settings.openai.configured} />
            <Row label="OpenAI model" value={settings.openai.model} />
            <Row label="Database configured" value={settings.database.configured} />
            <Row label="Database reachable" value={settings.database.reachable} />
            <Row label="CORS origins" value={settings.cors.origins_count} />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Polling</h2>
            {Object.entries(settings.poll || {}).map(([k, v]) => (
              <Row key={k} label={k} value={v} />
            ))}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Storage</h2>
            <Row label="Chat writable" value={settings.storage.chat_writable} />
            <Row label="Leads writable" value={settings.storage.leads_writable} />
            <Row label="Uploads writable" value={settings.storage.uploads_writable} />
            <Row label="Knowledge writable" value={settings.storage.knowledge_writable} />
            <Row label="KB collections" value={(settings.knowledge.collections || []).join(', ')} />
            <Row
              label="KB files present"
              value={(settings.knowledge.files_present || []).join(', ') || '—'}
            />
          </section>
        </div>
      )}
    </div>
  );
}
