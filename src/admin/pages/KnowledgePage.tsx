import { useEffect, useState, type FormEvent } from 'react';
import { adminFetch } from '../lib/adminApi';
import { Download, Plus, Pencil, Trash2, Upload, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type KnowledgeItem = {
  id: string;
  collection: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
};

type ListResponse = {
  collections: string[];
  items: KnowledgeItem[];
  total: number;
};

const empty = { collection: 'company_info', title: '', content: '', tags: '', category: '' };

export default function KnowledgePage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState('all');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    try {
      const q = new URLSearchParams();
      if (activeCollection !== 'all') q.set('collection', activeCollection);
      if (search.trim()) q.set('search', search.trim());
      const data = await adminFetch<ListResponse>(`/v1/admin/knowledge?${q}`);
      setCollections(data.collections || []);
      setItems(data.items || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load knowledge');
    }
  };

  useEffect(() => {
    void load();
  }, [activeCollection]);

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({
      ...empty,
      collection: activeCollection !== 'all' ? activeCollection : 'company_info',
    });
  };

  const openEdit = (item: KnowledgeItem) => {
    setEditing(item);
    setCreating(false);
    setForm({
      collection: item.collection,
      title: item.title,
      content: item.content,
      tags: (item.tags || []).join(', '),
      category: item.category || '',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      collection: form.collection,
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await adminFetch('/v1/admin/knowledge/update', {
          method: 'POST',
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast.success('Updated');
      } else {
        await adminFetch('/v1/admin/knowledge', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        toast.success('Created');
      }
      setCreating(false);
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDelete = async (item: KnowledgeItem) => {
    if (!confirm('Delete this knowledge item?')) return;
    try {
      await adminFetch('/v1/admin/knowledge/delete', {
        method: 'POST',
        body: JSON.stringify({ id: item.id, collection: item.collection }),
      });
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleExport = async () => {
    const collection = activeCollection === 'all' ? 'company_info' : activeCollection;
    try {
      const data = await adminFetch<{ collection: string; items: KnowledgeItem[] }>(
        `/v1/admin/knowledge/export?collection=${encodeURIComponent(collection)}`
      );
      const blob = new Blob([JSON.stringify(data.items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collection}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const collection = activeCollection === 'all' ? 'company_info' : activeCollection;
      await adminFetch('/v1/admin/knowledge/import', {
        method: 'POST',
        body: JSON.stringify({ collection, items: parsed, replace: false }),
      });
      toast.success('Imported');
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed');
    }
  };

  return (
    <div>
      <header className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-white/50 mt-1">Powers chatbot grounding and AI context.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-white/20 text-white" onClick={() => void handleExport()}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <label className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
            <Upload className="w-4 h-4" /> Import
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleImport(f);
                e.target.value = '';
              }}
            />
          </label>
          <Button className="bg-white text-black" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New item
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveCollection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider border ${
            activeCollection === 'all' ? 'bg-white text-black' : 'border-white/10 text-white/50'
          }`}
        >
          All
        </button>
        {collections.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCollection(c)}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider border ${
              activeCollection === c ? 'bg-white text-black' : 'border-white/10 text-white/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void load()}
          placeholder="Search knowledge…"
          className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
        />
        <Button variant="outline" className="border-white/20 text-white" onClick={() => void load()}>
          Search
        </Button>
      </div>

      {(creating || editing) && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
          <div className="flex justify-between">
            <h2 className="font-semibold">{editing ? 'Edit item' : 'Create item'}</h2>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }}>
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            placeholder="Collection (e.g. company_info)"
            value={form.collection}
            onChange={(e) => setForm({ ...form, collection: e.target.value })}
            required
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm min-h-[120px]"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              placeholder="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <Button type="submit" className="bg-white text-black">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.collection}:${item.id}`}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col md:flex-row justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-amber-300/80">{item.collection}</p>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-white/50 line-clamp-2 mt-1">{item.content}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg border border-white/10">
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(item)}
                className="p-2 rounded-lg border border-white/10 text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-white/40">No knowledge items.</p>}
      </div>
    </div>
  );
}
