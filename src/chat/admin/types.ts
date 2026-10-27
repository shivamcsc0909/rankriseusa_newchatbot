import type { ChatMessage } from '../types';

export type ConversationStatus = 'open' | 'pending' | 'closed';

export type ConversationFilter = 'all' | 'unread' | 'pending' | 'closed' | 'live';

export interface VisitorInfo {
  id: string;
  name: string;
  email?: string;
  location?: string;
  country?: string;
  ip?: string;
  currentPage?: string;
  referrer?: string;
  userAgent?: string;
  browser?: string;
  device?: string;
  os?: string;
  language?: string;
  timezone?: string;
  firstSeenAt: number;
  lastSeenAt: number;
}

export interface AdminChatMessage extends ChatMessage {
  status?: 'sent' | 'delivered' | 'seen';
  seenAt?: number;
  agentId?: string;
  source?: string;
}

export interface AdminConversation {
  id: string;
  visitor: VisitorInfo;
  status: ConversationStatus;
  unreadCount: number;
  lastMessageAt: number;
  messages: AdminChatMessage[];
  assignedAgentId?: string | null;
  visitorOnline?: boolean;
}

export interface LiveVisitor {
  visitorId: string;
  name: string;
  conversationId?: string | null;
  currentPage?: string | null;
  lastSeenAt?: number | null;
  unreadCount?: number;
  status?: string;
}

export interface TypingState {
  author: string;
  isTyping: boolean;
  visitorId: string;
}

export interface AdminPresence {
  agentsOnline: number;
  agentIds?: string[];
  liveVisitors?: number;
}

export interface AdminNotification {
  id: string;
  type: string;
  conversation_id?: string;
  visitor_id?: string;
  trigger?: string;
  label?: string;
  priority?: string;
  visitor_message?: string;
  status?: string;
  read: boolean;
  created_at: string;
}
