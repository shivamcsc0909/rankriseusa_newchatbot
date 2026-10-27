import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessagesSquare,
  HelpCircle,
  BookOpen,
  Inbox,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { clearAdminKey } from '@/chat/admin/services/adminSession';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/chat', label: 'Live Chat', icon: MessagesSquare },
  { to: '/admin/moderation', label: 'Moderation', icon: ShieldCheck },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/knowledge', label: 'Knowledge', icon: BookOpen },
  { to: '/admin/leads', label: 'Leads', icon: Inbox },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const lock = () => {
    clearAdminKey();
    navigate('/admin/login', { replace: true });
  };

  const NavItems = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )
          }
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-black/40">
        <div className="px-5 py-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">RankRise USA</p>
          <h1 className="text-lg font-black tracking-tight mt-1">
            Control <span className="italic text-amber-300">Center</span>
          </h1>
        </div>
        {NavItems}
        <div className="mt-auto p-4 border-t border-white/10">
          <button
            type="button"
            onClick={lock}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Lock admin
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#05070a] border-r border-white/10 flex flex-col">
            <div className="flex items-center justify-between px-5 py-5">
              <h1 className="font-black">
                Control <span className="italic text-amber-300">Center</span>
              </h1>
              <button type="button" onClick={() => setOpen(false)} className="p-2 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            {NavItems}
            <div className="mt-auto p-4">
              <button
                type="button"
                onClick={lock}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/50"
              >
                <LogOut className="w-4 h-4" /> Lock admin
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button type="button" onClick={() => setOpen(true)} className="p-2 text-white/70">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold">Admin Panel</span>
          <button type="button" onClick={lock} className="text-xs text-white/50 px-2">
            Lock
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
