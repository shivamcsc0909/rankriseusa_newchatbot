import { useEffect, useState, type FormEvent } from 'react';
import { adminFetch } from '../lib/adminApi';
import { Plus, Pencil, Trash2, Search, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  synonyms?: string[];
  enabled: boolean;
  priority: number;
};

const emptyForm = {
  question: '',
  answer: '',
  category: 'general',
  keywords: '',
  synonyms: '',
  enabled: true,
  priority: 0,
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ faqs: Faq[] }>(
        `/v1/admin/faqs?search=${encodeURIComponent(search)}`
      );
      setFaqs(data.faqs || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setCreating(false);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: (faq.keywords || []).join(', '),
      synonyms: (faq.synonyms || []).join(', '),
      enabled: faq.enabled !== false,
      priority: faq.priority || 0,
    });
  };

  const parseList = (raw: string) =>
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const keywords = [...parseList(form.keywords), ...parseList(form.synonyms)];
    if (!form.answer.trim() || keywords.length === 0) {
      toast.error('Answer and at least one keyword/synonym are required.');
      return;
    }
    const payload = {
      question: form.question,
      answer: form.answer,
      category: form.category,
      keywords,
      synonyms: parseList(form.synonyms),
      enabled: form.enabled,
      priority: Number(form.priority) || 0,
    };
    try {
      if (editing) {
        await adminFetch('/v1/admin/faqs/update', {
          method: 'POST',
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast.success('FAQ updated');
      } else {
        await adminFetch('/v1/admin/faqs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('FAQ created');
      }
      setEditing(null);
      setCreating(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await adminFetch('/v1/admin/faqs/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">FAQ Manager</h1>
          <p className="text-sm text-white/50 mt-1">Keywords power the chatbot first-response layer.</p>
        </div>
        <Button onClick={openCreate} className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" /> New FAQ
        </Button>
      </header>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void load()}
          placeholder="Search FAQs…"
          className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-9 pr-4 text-sm"
        />
      </div>

      {(creating || editing) && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? 'Edit FAQ' : 'Create FAQ'}</h2>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          <textarea
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm min-h-[100px]"
            placeholder="Answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Keywords (comma-separated)"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              required
            />
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Synonyms (merged into keywords)"
              value={form.synonyms}
              onChange={(e) => setForm({ ...form, synonyms: e.target.value })}
            />
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="number"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
            />
            Enabled
          </label>
          <Button type="submit" className="bg-white text-black">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {loading && <p className="text-sm text-white/40">Loading…</p>}
        {!loading && faqs.length === 0 && (
          <p className="text-sm text-white/40">No FAQs found.</p>
        )}
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col md:flex-row md:items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-amber-300/80">
                  {faq.category}
                </span>
                <span className="text-[10px] text-white/30">priority {faq.priority}</span>
                {!faq.enabled && (
                  <span className="text-[10px] text-red-300">disabled</span>
                )}
              </div>
              <p className="font-semibold truncate">{faq.question || '(no question)'}</p>
              <p className="text-sm text-white/50 line-clamp-2 mt-1">{faq.answer}</p>
              <p className="text-xs text-white/30 mt-2">
                {(faq.keywords || []).slice(0, 12).join(', ')}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(faq)}
                className="p-2 rounded-lg border border-white/10 hover:bg-white/5"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(faq.id)}
                className="p-2 rounded-lg border border-white/10 hover:bg-red-500/10 text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
