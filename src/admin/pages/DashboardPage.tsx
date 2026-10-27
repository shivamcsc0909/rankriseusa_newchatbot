import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../lib/adminApi';
import {
  FileText,
  MessagesSquare,
  HelpCircle,
  BookOpen,
  Inbox,
  Users,
  Activity,
  ArrowRight,
} from 'lucide-react';

type Stats = {
  blogs: { total: number; published: number; draft: number };
  chats: { total: number; pending: number; open: number; closed: number; today: number };
  presence: { agentsOnline: number; activeVisitors: number };
  visitors?: { today: number; active: number };
  faqs: { total: number; enabled: number };
  knowledge: { total: number; collections: number };
  leads: { total: number; today: number; new: number };
};

const CARDS: { key: string; label: string; icon: typeof FileText; get: (s: Stats) => number }[] = [
  { key: 'blogs', label: 'Total Blogs', icon: FileText, get: (s) => s.blogs.total },
  { key: 'chats', label: 'Total Chats', icon: MessagesSquare, get: (s) => s.chats.total },
  { key: 'visitors', label: 'Active Visitors', icon: Users, get: (s) => s.presence.activeVisitors },
  { key: 'faqs', label: 'FAQ Count', icon: HelpCircle, get: (s) => s.faqs.total },
  { key: 'knowledge', label: 'Knowledge Items', icon: BookOpen, get: (s) => s.knowledge.total },
  { key: 'leads', label: 'Contact Leads', icon: Inbox, get: (s) => s.leads.total },
  {
    key: 'today',
    label: "Today's Visitors",
    icon: Activity,
    get: (s) => s.visitors?.today ?? s.chats.today,
  },
];

const QUICK = [
  { to: '/admin/blogs', label: 'Manage blogs' },
  { to: '/admin/chat', label: 'Open live chat' },
  { to: '/admin/leads', label: 'Review leads' },
  { to: '/admin/faqs', label: 'Edit FAQs' },
  { to: '/admin/knowledge', label: 'Knowledge base' },
  { to: '/admin/analytics', label: 'View analytics' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await adminFetch<Stats>('/v1/admin/stats');
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load stats');
      }
    };
    void load();
    const t = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/50 mt-1">Live overview of RankRise operations.</p>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map(({ label, icon: Icon, get }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
              <Icon className="w-4 h-4 text-amber-300/80" />
            </div>
            <p className="text-3xl font-black tabular-nums">{stats ? get(stats) : '—'}</p>
          </div>
        ))}
      </div>

      {stats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Blogs</h2>
            <p className="text-sm text-white/50">Published: {stats.blogs.published}</p>
            <p className="text-sm text-white/50">Drafts: {stats.blogs.draft}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Chats</h2>
            <p className="text-sm text-white/50">Pending: {stats.chats.pending}</p>
            <p className="text-sm text-white/50">Open: {stats.chats.open}</p>
            <p className="text-sm text-white/50">Closed: {stats.chats.closed}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Leads</h2>
            <p className="text-sm text-white/50">New: {stats.leads.new}</p>
            <p className="text-sm text-white/50">Today: {stats.leads.today}</p>
            <p className="text-sm text-white/50">Agents online: {stats.presence.agentsOnline}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition"
          >
            {item.label}
            <ArrowRight className="w-4 h-4 text-amber-300/70" />
          </Link>
        ))}
      </div>
    </div>
  );
}
