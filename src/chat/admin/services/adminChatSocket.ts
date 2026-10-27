import { CHAT_API_BASE, CHAT_ADMIN_POLL_INTERVAL_MS } from '../../config';
import type { ChatMessage } from '../../types';
import type {
  AdminConversation,
  AdminNotification,
  AdminPresence,
  ConversationStatus,
  LiveVisitor,
  TypingState,
} from '../types';

type SnapshotListener = (conversations: AdminConversation[]) => void;
type NotificationListener = (notifications: AdminNotification[]) => void;
type StatusListener = (connected: boolean) => void;
type AuthFailedListener = () => void;
type TypingListener = (typing: TypingState[]) => void;
type PresenceListener = (presence: AdminPresence) => void;
type LiveVisitorsListener = (visitors: LiveVisitor[]) => void;

async function adminFetch<T>(
  baseUrl: string,
  path: string,
  adminKey: string,
  init?: RequestInit
): Promise<T> {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      'X-Admin-Key': adminKey,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const json = (await res.json()) as {
    ok?: boolean;
    data?: T;
    error?: { message?: string; code?: string };
  };
  if (res.status === 401 || json.error?.code === 'unauthorized' || json.error?.code === 'auth_not_configured') {
    const err = new Error(json.error?.message || 'Unauthorized');
    (err as Error & { authFailed?: boolean }).authFailed = true;
    throw err;
  }
  if (!res.ok || json.ok === false) {
    throw new Error(json.error?.message || `Chat API error (${res.status})`);
  }
  return (json.data ?? (json as unknown as T)) as T;
}

export class AdminChatSocket {
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;
  private adminKey: string;
  private pollInFlight = false;
  private latestConversations: AdminConversation[] = [];
  private snapshotListeners = new Set<SnapshotListener>();
  private notificationListeners = new Set<NotificationListener>();
  private statusListeners = new Set<StatusListener>();
  private authFailedListeners = new Set<AuthFailedListener>();
  private typingListeners = new Set<TypingListener>();
  private presenceListeners = new Set<PresenceListener>();
  private liveVisitorsListeners = new Set<LiveVisitorsListener>();
  private consecutiveFailures = 0;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(adminKey: string) {
    this.adminKey = adminKey;
  }

  connect() {
    if (!CHAT_API_BASE || !this.adminKey) return;
    this.stopped = false;
    void this.pollOnce(true);
  }

  disconnect() {
    this.stopped = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.typingTimer) clearTimeout(this.typingTimer);
    this.emitStatus(false);
  }

  sendMessage(visitorId: string, content: string) {
    if (!CHAT_API_BASE) return;
    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author: 'agent',
      content,
      timestamp: Date.now(),
      visitorId,
    };

    this.patchConversationByVisitor(visitorId, (conversation) => ({
      ...conversation,
      status: 'open',
      assignedAgentId: conversation.assignedAgentId ?? 'dashboard',
      lastMessageAt: message.timestamp,
      unreadCount: 0,
      messages: [
        ...conversation.messages,
        { ...message, status: 'sent' },
      ],
    }));

    void this.sendTyping(visitorId, false);

    void adminFetch<{ conversation?: AdminConversation }>(CHAT_API_BASE, '/v1/chat/message', this.adminKey, {
      method: 'POST',
      body: JSON.stringify({
        role: 'agent',
        agentId: 'dashboard',
        ...message,
      }),
    })
      .then((data) => {
        if (data.conversation) this.replaceConversation(data.conversation);
        else void this.pollOnce(false);
      })
      .catch((err: Error & { authFailed?: boolean }) => {
        if (err.authFailed) this.handleAuthFailed();
        else void this.pollOnce(false);
      });
  }

  sendTyping(visitorId: string, isTyping: boolean) {
    if (!CHAT_API_BASE || !visitorId) return;
    void adminFetch(CHAT_API_BASE, '/v1/chat/typing', this.adminKey, {
      method: 'POST',
      body: JSON.stringify({
        author: 'agent',
        isTyping,
        visitorId,
      }),
    }).catch(() => {
      // best effort
    });
  }

  /** Debounced typing pulse while agent is composing. */
  notifyTyping(visitorId: string) {
    this.sendTyping(visitorId, true);
    if (this.typingTimer) clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.sendTyping(visitorId, false);
    }, 2500);
  }

  markRead(conversationId: string) {
    if (!CHAT_API_BASE) return;
    this.patchConversationById(conversationId, (c) => ({ ...c, unreadCount: 0 }));
    void adminFetch(CHAT_API_BASE, '/v1/admin/conversations/read', this.adminKey, {
      method: 'POST',
      body: JSON.stringify({ conversationId }),
    })
      .then(() => this.pollOnce(false))
      .catch((err: Error & { authFailed?: boolean }) => {
        if (err.authFailed) this.handleAuthFailed();
      });
  }

  markNotificationRead(id: string) {
    if (!CHAT_API_BASE) return;
    void adminFetch(CHAT_API_BASE, '/v1/admin/notifications/read', this.adminKey, {
      method: 'POST',
      body: JSON.stringify({ id }),
    })
      .then(() => this.pollOnce(false))
      .catch((err: Error & { authFailed?: boolean }) => {
        if (err.authFailed) this.handleAuthFailed();
      });
  }

  updateConversation(conversationId: string, status?: ConversationStatus, agentId?: string) {
    if (!CHAT_API_BASE) return;

    this.patchConversationById(conversationId, (c) => ({
      ...c,
      ...(status ? { status } : {}),
      ...(agentId ? { assignedAgentId: agentId } : {}),
    }));

    void adminFetch<{ conversation?: AdminConversation }>(
      CHAT_API_BASE,
      '/v1/admin/conversations/update',
      this.adminKey,
      {
        method: 'POST',
        body: JSON.stringify({ conversationId, status, agentId }),
      }
    )
      .then((data) => {
        if (data.conversation) this.replaceConversation(data.conversation);
        else void this.pollOnce(false);
      })
      .catch((err: Error & { authFailed?: boolean }) => {
        if (err.authFailed) this.handleAuthFailed();
        else void this.pollOnce(false);
      });
  }

  exportConversation(conversationId: string) {
    if (!CHAT_API_BASE) return;
    const url = `${CHAT_API_BASE}/v1/admin/conversations/${encodeURIComponent(conversationId)}/export`;
    void fetch(url, {
      headers: { 'X-Admin-Key': this.adminKey, Accept: 'text/plain' },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Export failed');
        const text = await res.text();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = `chat-${conversationId}.txt`;
        a.click();
        URL.revokeObjectURL(href);
      })
      .catch(() => {
        // silent
      });
  }

  onSnapshot(listener: SnapshotListener) {
    this.snapshotListeners.add(listener);
    return () => this.snapshotListeners.delete(listener);
  }

  onNotifications(listener: NotificationListener) {
    this.notificationListeners.add(listener);
    return () => this.notificationListeners.delete(listener);
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  onAuthFailed(listener: AuthFailedListener) {
    this.authFailedListeners.add(listener);
    return () => this.authFailedListeners.delete(listener);
  }

  onTyping(listener: TypingListener) {
    this.typingListeners.add(listener);
    return () => this.typingListeners.delete(listener);
  }

  onPresence(listener: PresenceListener) {
    this.presenceListeners.add(listener);
    return () => this.presenceListeners.delete(listener);
  }

  onLiveVisitors(listener: LiveVisitorsListener) {
    this.liveVisitorsListeners.add(listener);
    return () => this.liveVisitorsListeners.delete(listener);
  }

  private emitSnapshot(conversations: AdminConversation[]) {
    this.latestConversations = conversations;
    this.snapshotListeners.forEach((listener) => listener(conversations));
  }

  private replaceConversation(conversation: AdminConversation) {
    const next = [...this.latestConversations];
    const idx = next.findIndex((c) => c.id === conversation.id);
    if (idx >= 0) next[idx] = { ...next[idx], ...conversation };
    else next.unshift(conversation);
    this.emitSnapshot(next);
  }

  private patchConversationById(
    conversationId: string,
    patch: (c: AdminConversation) => AdminConversation
  ) {
    const next = this.latestConversations.map((c) =>
      c.id === conversationId ? patch(c) : c
    );
    this.emitSnapshot(next);
  }

  private patchConversationByVisitor(
    visitorId: string,
    patch: (c: AdminConversation) => AdminConversation
  ) {
    const next = this.latestConversations.map((c) =>
      c.visitor.id === visitorId ? patch(c) : c
    );
    this.emitSnapshot(next);
  }

  private async pollOnce(scheduleFollowUp: boolean) {
    if (!CHAT_API_BASE || this.stopped || this.pollInFlight) {
      if (scheduleFollowUp && !this.stopped) this.scheduleReconnect();
      return;
    }
    this.pollInFlight = true;
    try {
      const data = await adminFetch<{
        conversations?: AdminConversation[];
        notifications?: AdminNotification[];
        typing?: TypingState[];
        presence?: AdminPresence;
        liveVisitors?: LiveVisitor[];
      }>(CHAT_API_BASE, '/v1/admin/poll?adminId=dashboard', this.adminKey);

      if (Array.isArray(data.conversations)) {
        this.emitSnapshot(data.conversations);
      }
      if (Array.isArray(data.notifications)) {
        this.notificationListeners.forEach((listener) =>
          listener(data.notifications as AdminNotification[])
        );
      }
      if (Array.isArray(data.typing)) {
        this.typingListeners.forEach((l) => l(data.typing as TypingState[]));
      }
      if (data.presence) {
        this.presenceListeners.forEach((l) => l(data.presence as AdminPresence));
      }
      if (Array.isArray(data.liveVisitors)) {
        this.liveVisitorsListeners.forEach((l) => l(data.liveVisitors as LiveVisitor[]));
      }
      this.consecutiveFailures = 0;
      this.emitStatus(true);
    } catch (err) {
      this.consecutiveFailures++;
      const failed = (err as Error & { authFailed?: boolean }).authFailed === true;
      if (failed) {
        this.handleAuthFailed();
        return;
      }
      this.emitStatus(false);
    } finally {
      this.pollInFlight = false;
      if (scheduleFollowUp && !this.stopped) this.scheduleReconnect();
    }
  }

  private handleAuthFailed() {
    this.stopped = true;
    this.emitStatus(false);
    this.authFailedListeners.forEach((listener) => listener());
  }

  private emitStatus(connected: boolean) {
    this.statusListeners.forEach((listener) => listener(connected));
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.stopped) return;
    const delay =
      this.consecutiveFailures === 0
        ? CHAT_ADMIN_POLL_INTERVAL_MS
        : Math.min(
            30000,
            CHAT_ADMIN_POLL_INTERVAL_MS * Math.pow(2, Math.min(this.consecutiveFailures, 4))
          );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.pollOnce(true);
    }, delay);
  }
}
