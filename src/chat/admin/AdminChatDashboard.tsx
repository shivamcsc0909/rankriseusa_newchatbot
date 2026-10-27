import { useMemo, useState } from 'react';
import DashboardFilters from './components/DashboardFilters';
import ConversationList from './components/ConversationList';
import AdminChatWindow from './components/AdminChatWindow';
import VisitorInfoPanel from './components/VisitorInfoPanel';
import AdminAuthGate from './AdminAuthGate';
import AdminCommunityModeration from './components/AdminCommunityModeration';
import AdminBlogManager from '@/components/blog/admin/AdminBlogManager';
import type { ConversationFilter } from './types';
import { useAdminChat } from './hooks/useAdminChat';
import { useAdminNotifications } from './hooks/useAdminNotifications';
import { MessageSquare, ShieldCheck, MessagesSquare, FileText, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AdminChatDashboardInner({
  adminKey,
  onUnauthorized,
}: {
  adminKey: string;
  onUnauthorized: () => void;
}) {
  const {
    conversations,
    setConversations,
    notifications,
    typing,
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
  const [activeTab, setActiveTab] = useState<'chat' | 'moderation' | 'blog'>('chat');

  const { permission, requestPermission } = useAdminNotifications(
    conversations,
    selectedId,
    (id) => setSelectedId(id)
  );

  const counts = useMemo<Record<ConversationFilter, number>>(
    () => ({
      all: conversations.length,
      unread: conversations.filter((c) => c.unreadCount > 0).length,
      pending: conversations.filter((c) => c.status === 'pending').length,
      closed: conversations.filter((c) => c.status === 'closed').length,
      live: conversations.filter((c) => c.visitorOnline).length,
    }),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filter === 'unread' && c.unreadCount === 0) return false;
      if (filter === 'pending' && c.status !== 'pending') return false;
      if (filter === 'closed' && c.status !== 'closed') return false;
      if (filter === 'live' && !c.visitorOnline) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const text = `${c.id} ${c.messages.map((m) => m.content).join(' ')}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  }, [conversations, filter, search]);

  const selected = conversations.find((c) => c.id === selectedId) || null;

  return (
    <section className="min-h-screen bg-background pt-20 lg:pt-24 pb-4 px-3 sm:px-4 flex flex-col">
      <div className="container mx-auto max-w-7xl flex-1 flex flex-col min-h-0">
        <header className="mb-4 shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Admin <span className="text-gradient-gold italic">Control Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {!liveEnabled
                ? 'Live chat API is not configured (VITE_CHAT_API_URL).'
                : authFailed
                  ? 'Unauthorized — check the admin key and lock to re-enter.'
                  : connected
                    ? 'Live conversations connected.'
                    : 'Connecting to live conversations…'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {permission === 'default' && (
              <Button
                size="sm"
                variant="outline"
                onClick={requestPermission}
                className="h-9 px-3 rounded-xl text-xs font-semibold bg-white/5 border-white/10 hover:bg-white/10 text-amber-300 gap-1.5"
                title="Enable desktop notifications for new messages"
              >
                <Bell className="w-3.5 h-3.5" /> Enable Notifications
              </Button>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0 overflow-x-auto">
              <Button
                size="sm"
                onClick={() => setActiveTab('chat')}
                className={`h-8 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'chat' ? 'button-premium' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessagesSquare className="w-3.5 h-3.5" /> Live Chat
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab('moderation')}
                className={`h-8 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'moderation' ? 'button-premium' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Moderation
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveTab('blog')}
                className={`h-8 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'blog' ? 'button-premium' : 'bg-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Blog CMS
              </Button>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="w-full mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs font-semibold text-amber-200 mb-1.5">
                Admin notifications ({notifications.length})
              </p>
              <ul className="space-y-1.5 max-h-32 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start justify-between gap-3 text-xs text-muted-foreground"
                  >
                    <span>
                      <span className="text-foreground">{n.label || n.trigger || n.type}</span>
                      {n.visitor_message ? ` — ${n.visitor_message}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      className="shrink-0 text-[11px] text-amber-200 hover:text-amber-100 underline"
                    >
                      Mark read
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <div className="relative flex-1 flex h-[calc(100vh-13.5rem)] min-h-[480px] rounded-3xl border border-white/10 bg-[#05070a] overflow-hidden shadow-2xl">
          {activeTab === 'chat' ? (
            <>
              <aside
                className={`w-full lg:w-80 lg:shrink-0 flex flex-col h-full border-r border-white/10 ${
                  selected ? 'hidden lg:flex' : 'flex'
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
                  onSelect={(id) => {
                    setSelectedId(id);
                    markRead(id);
                  }}
                  typing={typing}
                />
              </aside>

              <main
                className={`flex-1 flex flex-col h-full min-w-0 ${
                  selected ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {selected ? (
                  <div className="flex flex-1 h-full min-h-0 overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0 h-full min-h-0">
                      <AdminChatWindow
                        conversation={selected}
                        onSend={(content) => sendMessage(selected.visitor.id, content)}
                        onTyping={() => notifyTyping(selected.visitor.id)}
                        onBack={() => setSelectedId(null)}
                        onToggleInfo={() => setShowInfoMobile((prev) => !prev)}
                        onAssign={() => updateConversation(selected.id, selected.status, 'admin')}
                        onClose={() => updateConversation(selected.id, 'closed')}
                        onReopen={() => updateConversation(selected.id, 'open')}
                        onExport={() => exportConversation(selected.id)}
                        typing={typing}
                      />
                    </div>
                    <aside
                      className={`w-80 border-l border-white/10 overflow-y-auto lg:block ${
                        showInfoMobile ? 'block absolute inset-0 z-20 bg-background' : 'hidden'
                      }`}
                    >
                      <VisitorInfoPanel
                        visitor={selected.visitor}
                        online={selected.visitorOnline}
                        assignedAgentId={selected.assignedAgentId}
                        status={selected.status}
                      />
                    </aside>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-semibold text-foreground">Select a conversation</p>
                    <p className="text-xs max-w-sm mt-1">
                      Choose a chat thread from the left menu to view visitor messages and reply.
                    </p>
                  </div>
                )}
              </main>
            </>
          ) : activeTab === 'moderation' ? (
            <AdminCommunityModeration adminKey={adminKey} />
          ) : (
            <div className="w-full h-full overflow-y-auto p-4 lg:p-6">
              <AdminBlogManager adminKey={adminKey} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AdminChatDashboard() {
  return <AdminAuthGate>{(adminKey, onUnauthorized) => <AdminChatDashboardInner adminKey={adminKey} onUnauthorized={onUnauthorized} />}</AdminAuthGate>;
}

