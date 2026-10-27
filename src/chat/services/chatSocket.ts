import type { ChatMessage, ChatSocketStatus, PresenceEvent, TypingEvent } from '../types';
import { CHAT_POLL_INTERVAL_MS } from '../config';

// Phase 5 transport: AJAX short-polling. Public API matches the old WebSocket client
// so hooks / UI stay unchanged.

export interface ChatSocketEventMap {
  status: ChatSocketStatus;
  message: ChatMessage;
  history: ChatMessage[];
  typing: TypingEvent;
  presence: PresenceEvent;
}

type Listener<K extends keyof ChatSocketEventMap> = (payload: ChatSocketEventMap[K]) => void;

async function apiFetch<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const json = (await res.json()) as {
    ok?: boolean;
    data?: T;
    error?: { message?: string; code?: string };
  };
  if (!res.ok || json.ok === false) {
    throw new Error(json.error?.message || `Chat API error (${res.status})`);
  }
  return (json.data ?? (json as unknown as T)) as T;
}

export class ChatSocketClient {
  private readonly baseUrl: string;
  private readonly visitorId: string;
  private listeners = new Map<keyof ChatSocketEventMap, Set<(payload: never) => void>>();
  private status: ChatSocketStatus = 'offline';
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;
  private cursor = 0;
  private seenIds = new Set<string>();
  private pollInFlight = false;
  private consecutiveFailures = 0;

  constructor(baseUrl: string, visitorId: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.visitorId = visitorId;
  }

  connect(): void {
    this.manuallyClosed = false;
    void this.bootstrap();
  }

  disconnect(): void {
    this.manuallyClosed = true;
    this.clearPoll();
    this.setStatus('offline');
  }

  getStatus(): ChatSocketStatus {
    return this.status;
  }

  sendMessage(message: ChatMessage): void {
    void this.postMessage(message);
  }

  sendTyping(isTyping: boolean): void {
    void apiFetch(this.baseUrl, '/v1/chat/typing', {
      method: 'POST',
      body: JSON.stringify({
        author: 'visitor',
        isTyping,
        visitorId: this.visitorId,
      }),
    }).catch(() => {
      // Best-effort; polling continues.
    });
  }

  on<K extends keyof ChatSocketEventMap>(event: K, listener: Listener<K>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as (payload: never) => void);
    return () => set?.delete(listener as (payload: never) => void);
  }

  private emit<K extends keyof ChatSocketEventMap>(event: K, payload: ChatSocketEventMap[K]): void {
    this.listeners.get(event)?.forEach((listener) => {
      (listener as Listener<K>)(payload);
    });
  }

  private setStatus(status: ChatSocketStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.emit('status', status);
  }

  private getBackoffDelay(): number {
    if (this.consecutiveFailures === 0) return CHAT_POLL_INTERVAL_MS;
    return Math.min(30000, CHAT_POLL_INTERVAL_MS * Math.pow(2, Math.min(this.consecutiveFailures, 4)));
  }

  private async bootstrap(): Promise<void> {
    this.setStatus('connecting');
    try {
      await apiFetch(this.baseUrl, '/v1/chat/session', {
        method: 'POST',
        body: JSON.stringify({
          visitorId: this.visitorId,
          currentPage: typeof window !== 'undefined' ? window.location.href : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
          language: typeof navigator !== 'undefined' ? navigator.language : undefined,
          timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        }),
      });

      const history = await apiFetch<{ messages: ChatMessage[] }>(
        this.baseUrl,
        `/v1/chat/history?visitorId=${encodeURIComponent(this.visitorId)}`
      );
      const messages = Array.isArray(history.messages) ? history.messages : [];
      for (const m of messages) {
        if (m?.id) this.seenIds.add(m.id);
        const ts = Number(m?.timestamp) || 0;
        if (ts > this.cursor) this.cursor = ts;
      }
      this.emit('history', messages);
      this.consecutiveFailures = 0;
      this.setStatus('online');
      this.schedulePoll(0);
    } catch {
      this.consecutiveFailures++;
      this.setStatus('offline');
      if (!this.manuallyClosed) this.schedulePoll(this.getBackoffDelay());
    }
  }

  private async postMessage(message: ChatMessage): Promise<void> {
    try {
      this.seenIds.add(message.id);
      if (message.timestamp > this.cursor) this.cursor = message.timestamp;

      const data = await apiFetch<{ reply?: ChatMessage }>(this.baseUrl, '/v1/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          role: 'visitor',
          id: message.id,
          author: 'visitor',
          content: message.content,
          timestamp: message.timestamp,
          visitorId: this.visitorId,
        }),
      });

      if (data.reply?.id) {
        if (!this.seenIds.has(data.reply.id)) {
          this.seenIds.add(data.reply.id);
          if (data.reply.timestamp > this.cursor) this.cursor = data.reply.timestamp;
          this.emit('message', data.reply);
        }
      }
      this.consecutiveFailures = 0;
      this.setStatus('online');
    } catch {
      this.consecutiveFailures++;
      this.setStatus('offline');
    }
  }

  private schedulePoll(delayMs: number): void {
    this.clearPoll();
    if (this.manuallyClosed) return;
    this.pollTimer = setTimeout(() => {
      this.pollTimer = null;
      void this.pollOnce();
    }, delayMs);
  }

  private clearPoll(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async pollOnce(): Promise<void> {
    if (this.manuallyClosed || this.pollInFlight) {
      this.schedulePoll(this.getBackoffDelay());
      return;
    }
    this.pollInFlight = true;
    try {
      const data = await apiFetch<{
        messages?: ChatMessage[];
        typing?: TypingEvent | null;
        presence?: PresenceEvent;
        cursor?: number;
      }>(
        this.baseUrl,
        `/v1/chat/poll?visitorId=${encodeURIComponent(this.visitorId)}&since=${this.cursor}`
      );

      for (const message of data.messages ?? []) {
        if (!message?.id || this.seenIds.has(message.id)) continue;
        this.seenIds.add(message.id);
        const ts = Number(message.timestamp) || 0;
        if (ts > this.cursor) this.cursor = ts;
        this.emit('message', message);
      }
      if (typeof data.cursor === 'number' && data.cursor > this.cursor) {
        this.cursor = data.cursor;
      }
      if (data.typing) this.emit('typing', data.typing);
      else this.emit('typing', { author: 'agent', isTyping: false, visitorId: this.visitorId });
      if (data.presence) this.emit('presence', data.presence);

      this.consecutiveFailures = 0;
      this.setStatus('online');
    } catch {
      this.consecutiveFailures++;
      this.setStatus('offline');
    } finally {
      this.pollInFlight = false;
      if (!this.manuallyClosed) this.schedulePoll(this.getBackoffDelay());
    }
  }
}
