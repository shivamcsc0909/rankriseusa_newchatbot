import { useEffect, useState } from 'react';
import { adminFetch } from '../lib/adminApi';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Stats = {
  blogs: { total: number; published: number; draft: number };
  chats: { total: number; pending: number; open: number; closed: number; today: number };
  presence: { agentsOnline: number; activeVisitors: number };
  visitors?: { today: number; active: number };
  faqs: { total: number; enabled: number };
  knowledge: { total: number; collections: number };
  leads: { total: number; today: number; new: number };
  series?: { day: string; chats: number; leads: number }[];
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminFetch<Stats>('/v1/admin/stats');
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load analytics');
          setStats(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    const t = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const refresh = () => {
    setLoading(true);
    void adminFetch<Stats>('/v1/admin/stats')
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load analytics'))
      .finally(() => setLoading(false));
  };

  const maxBar = Math.max(
    1,
    ...(stats?.series || []).flatMap((d) => [d.chats, d.leads])
  );

  const totals = stats
    ? {
        chats7: (stats.series || []).reduce((a, r) => a + r.chats, 0),
        leads7: (stats.series || []).reduce((a, r) => a + r.leads, 0),
      }
    : { chats7: 0, leads7: 0 };

  return (
    <div>
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
          <p className="text-sm text-white/50 mt-1">
            Aggregated from blogs, chats, FAQs, knowledge, and leads.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-white"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </header>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!stats && !error && <p className="text-sm text-white/40">Loading…</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
            {[
              ['Published blogs', stats.blogs.published],
              ['Draft blogs', stats.blogs.draft],
              ['Pending chats', stats.chats.pending],
              ['Open chats', stats.chats.open],
              ['New leads', stats.leads.new],
              ['Leads today', stats.leads.today],
              ['FAQs enabled', stats.faqs.enabled],
              ['Knowledge items', stats.knowledge.total],
              ['Active visitors', stats.presence.activeVisitors],
              ["Today's visitors", stats.visitors?.today ?? stats.chats.today],
              ['Agents online', stats.presence.agentsOnline],
              ['Chats (7d)', totals.chats7],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black mt-2 tabular-nums">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-semibold text-white/70 mb-4">Last 7 days — chats & leads</h2>
              <div className="space-y-3">
                {(stats.series || []).map((row) => (
                  <div key={row.day} className="grid grid-cols-[72px_1fr_auto] gap-3 items-center">
                    <span className="text-xs text-white/40">{row.day.slice(5)}</span>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-amber-300/80 transition-all"
                          style={{ width: `${(row.chats / maxBar) * 100}%` }}
                        />
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-sky-400/70 transition-all"
                          style={{ width: `${(row.leads / maxBar) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/30 tabular-nums whitespace-nowrap">
                      {row.chats}c · {row.leads}l
                    </span>
                  </div>
                ))}
                {(stats.series || []).length === 0 && (
                  <p className="text-sm text-white/40">No time-series data yet.</p>
                )}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-white/40">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-2 rounded bg-amber-300/80" /> Chats
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-2 rounded bg-sky-400/70" /> Leads
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-sm font-semibold text-white/70 mb-4">Distribution</h2>
              <div className="space-y-4 text-sm">
                <DistRow label="Blogs published" value={stats.blogs.published} total={stats.blogs.total} />
                <DistRow label="Chats open" value={stats.chats.open} total={stats.chats.total} />
                <DistRow label="Chats closed" value={stats.chats.closed} total={stats.chats.total} />
                <DistRow label="FAQs enabled" value={stats.faqs.enabled} total={stats.faqs.total} />
                <DistRow label="New leads" value={stats.leads.new} total={stats.leads.total} />
              </div>
              <p className="text-xs text-white/30 mt-6">
                7-day totals: {totals.chats7} chats · {totals.leads7} leads
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DistRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-white/50 mb-1">
        <span>{label}</span>
        <span className="tabular-nums text-white/70">
          {value}/{total} ({pct}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-white/40" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
