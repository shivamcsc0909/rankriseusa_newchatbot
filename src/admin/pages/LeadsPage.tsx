import { useEffect, useState } from 'react';
import { adminFetch } from '../lib/adminApi';
import { Download, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Lead = {
  id: string;
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
  fields?: Record<string, string>;
};

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set('search', search.trim());
      if (source.trim()) q.set('source', source.trim());
      if (status.trim()) q.set('status', status.trim());
      const data = await adminFetch<{ leads: Lead[] }>(`/v1/admin/leads?${q}`);
      setLeads(data.leads || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load leads');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setLeadStatus = async (id: string, next: Lead['status']) => {
    try {
      await adminFetch('/v1/admin/leads/status', {
        method: 'POST',
        body: JSON.stringify({ id, status: next }),
      });
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await adminFetch('/v1/admin/leads/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      toast.success('Deleted');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const exportCsv = () => {
    const header = ['id', 'source', 'status', 'name', 'email', 'phone', 'company', 'message', 'created_at'];
    const rows = leads.map((l) =>
      [
        l.id,
        l.source,
        l.status,
        l.name || '',
        l.email || '',
        l.phone || '',
        l.company || '',
        l.message || '',
        l.created_at,
      ]
        .map((c) => escapeCsv(String(c)))
        .join(',')
    );
    const blob = new Blob([[header.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Contact Leads</h1>
          <p className="text-sm text-white/50 mt-1">
            Captured from site forms (also dual-written to Google Sheets when configured).
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-white"
          onClick={exportCsv}
          disabled={leads.length === 0}
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void load()}
            placeholder="Search name, email, message…"
            className="w-full h-10 rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 text-sm"
          />
        </div>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Source filter"
          className="h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
        <Button variant="outline" className="border-white/20 text-white" onClick={() => void load()}>
          Apply
        </Button>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300/80">
                    {lead.source}
                  </span>
                  <span className="text-[10px] uppercase text-white/30">{lead.status}</span>
                  <span className="text-[10px] text-white/30">
                    {new Date(lead.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="font-semibold">
                  {lead.name || 'Anonymous'} {lead.email ? `· ${lead.email}` : ''}
                </p>
                {lead.phone && <p className="text-sm text-white/50">{lead.phone}</p>}
                {lead.company && <p className="text-sm text-white/50">{lead.company}</p>}
                {lead.message && (
                  <p className="text-sm text-white/60 mt-2 whitespace-pre-wrap">{lead.message}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {lead.status === 'new' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white"
                    onClick={() => void setLeadStatus(lead.id, 'read')}
                  >
                    Mark read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white"
                  onClick={() => void setLeadStatus(lead.id, 'archived')}
                >
                  Archive
                </Button>
                <button
                  type="button"
                  onClick={() => void remove(lead.id)}
                  className="p-2 rounded-lg border border-white/10 text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p className="text-sm text-white/40">No leads yet.</p>}
      </div>
    </div>
  );
}
