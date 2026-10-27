export interface ChatMessage {
  id: string;
  author: 'visitor' | 'agent';
  content: string;
  timestamp: number;
  /** Anonymous visitor session ID (localStorage). Present on visitor messages. */
  visitorId?: string;
  status?: 'sent' | 'delivered' | 'seen';
  seenAt?: number;
  agentId?: string;
  source?: string;
}

/** Connection state of the realtime layer. 'disabled' = no socket URL configured. */
export type ChatSocketStatus = 'disabled' | 'connecting' | 'online' | 'offline';

export interface TypingEvent {
  author: 'visitor' | 'agent';
  isTyping: boolean;
  visitorId?: string;
}

export interface PresenceEvent {
  agentsOnline: number;
}
