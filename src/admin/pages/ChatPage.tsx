import { useMemo, useState } from 'react';
import { getAdminKey, clearAdminKey } from '@/chat/admin/services/adminSession';
import { useNavigate } from 'react-router-dom';
import DashboardFilters from '@/chat/admin/components/DashboardFilters';
import ConversationList from '@/chat/admin/components/ConversationList';
import AdminChatWindow from '@/chat/admin/components/AdminChatWindow';
import VisitorInfoPanel from '@/chat/admin/components/VisitorInfoPanel';
import type { ConversationFilter } from '@/chat/admin/types';
import { useAdminChat } from '@/chat/admin/hooks/useAdminChat';
import { Radio, Users, Wifi, WifiOff } from 'lucide-react';

export default function ChatPage() {
  const navigate = useNavigate();
  const adminKey = getAdminKey() || '';
  const onUnauthorized = () => {
    clearAdminKey();
    navigate('/admin/login', { replace: true });
  };

  const {
    conversations,
    notifications,
    typing,
    presence,
    liveVisitors,
    connected,
    authFailed,
    liveEnabled,
    sendMessage,
    notifyTyping,
    markRead,
    markNotificationRead,
    updateConversation,
    exportConversation,
  } = useAdminChat(adminKey, onUnauthorized);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [search, setSearch] = useState('');
  const [showInfoMobile, setShowInfoMobile] = useState(false);

  const counts = useMemo<Record<ConversationFilter, number>>(
    () => ({
      all: conversations.length,
      live: conversations.filter((c) => c.visitorOnline).length,
      unread: conversations.filter((c) => c.unreadCount > 0).length,
      pending: conversations.filter((c) => c.status === 'pending').length,
      closed: conversations.filter((c) => c.status === 'closed').length,
    }),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filter === 'live' && !c.visitorOnline) return false;
      if (filter === 'unread' && c.unreadCount === 0) return false;
      if (filter === 'pending' && c.status !== 'pending') return false;
      if (filter === 'closed' && c.status !== 'closed') return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const text = `${c.id} ${c.visitor?.name || ''} ${c.visitor?.email || ''} ${c.visitor?.ip || ''} ${c.messages.map((m) => m.content).join(' ')}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  }, [conversations, filter, search]);

  const selected = conversations.find((c) => c.id === selectedId) || null;

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 min-h-[calc(100vh-0px)] flex flex-col bg-[#0b141a] text-white">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#202c33] border-b border-white/5">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Live Chat</h1>
          <p className="text-[11px] text-white/40">
            {!liveEnabled
              ? 'Chat API not configured'
              : authFailed
                ? 'Unauthorized — re-login required'
                : connected
                  ? 'Connected · replies deliver instantly via poll'
                  : 'Connecting…'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-white/60">
            {connected ? <Wifi className="w-3.5 h-3.5 text-[#00a884]" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
            {connected ? 'Online' : 'Offline'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-white/60">
            <Users className="w-3.5 h-3.5 text-[#00a884]" />
            {presence.agentsOnline || 0} agent{(presence.agentsOnline || 0) === 1 ? '' : 's'}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-white/60">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {presence.liveVisitors ?? liveVisitors.length} live
          </span>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex gap-3 overflow-x-auto text-sm">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className="shrink-0 flex items-center gap-2 rounded-lg bg-black/20 px-3 py-1.5 text-amber-100/90"
              >
                <span className="max-w-[240px] truncate">
                  {n.label || n.trigger}
                  {n.visitor_message ? `: ${n.visitor_message}` : ''}
                </span>
                <button
                  type="button"
                  className="text-[11px] text-amber-200 hover:underline"
                  onClick={() => markNotificationRead(n.id)}
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left: conversation list */}
        <div
          className={`lg:col-span-3 flex flex-col border-r border-white/5 bg-[#111b21] min-h-0 ${
            selectedId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <DashboardFilters
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            counts={counts}
          />
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            typing={typing}
            onSelect={(id) => {
              setSelectedId(id);
              setShowInfoMobile(false);
              markRead(id);
            }}
          />
        </div>

        {/* Center: chat */}
        <div
          className={`lg:col-span-6 flex flex-col min-h-0 ${
            selectedId ? 'flex' : 'hidden lg:flex'
          } ${showInfoMobile ? 'hidden xl:flex' : ''}`}
        >
          <AdminChatWindow
            conversation={selected}
            typing={typing}
            onBack={() => setSelectedId(null)}
            onToggleInfo={() => setShowInfoMobile(true)}
            onTyping={() => {
              if (selected) notifyTyping(selected.visitor.id);
            }}
            onSend={(text) => {
              if (selected) sendMessage(selected.visitor.id, text);
            }}
            onAssign={() => {
              if (selected) updateConversation(selected.id, 'open', 'dashboard');
            }}
            onClose={() => {
              if (selected) updateConversation(selected.id, 'closed');
            }}
            onReopen={() => {
              if (selected) updateConversation(selected.id, 'open');
            }}
            onExport={() => {
              if (selected) exportConversation(selected.id);
            }}
          />
        </div>

        {/* Right: visitor info */}
        <div
          className={`lg:col-span-3 border-l border-white/5 min-h-0 ${
            showInfoMobile ? 'flex' : 'hidden xl:flex'
          } flex-col`}
        >
          {showInfoMobile && (
            <button
              type="button"
              className="xl:hidden text-left px-4 py-2 text-sm text-[#00a884] bg-[#202c33]"
              onClick={() => setShowInfoMobile(false)}
            >
              ← Back to chat
            </button>
          )}
          <VisitorInfoPanel
            visitor={selected?.visitor ?? null}
            online={selected?.visitorOnline}
            assignedAgentId={selected?.assignedAgentId}
            status={selected?.status}
          />
        </div>
      </div>
    </div>
  );
}
