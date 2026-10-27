import { useCallback, useRef, useState } from 'react';
import type { ChatMessage } from '../types';
import { useVisitorSession } from './useVisitorSession';
import { useChatSocket } from './useChatSocket';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  author: 'agent',
  content:
    'Welcome to RankRise USA! How can we help you today?',
  timestamp: Date.now(),
};

// Chat widget state. Visitor ID comes from localStorage (no auth). The realtime
// layer uses AJAX polling when CHAT_API_BASE is set (Phase 5).
export function useChatWidget() {
  const { visitorId } = useVisitorSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  // The welcome message starts unread until the visitor first opens the widget.
  const [unreadCount, setUnreadCount] = useState(1);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const handleIncomingMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    if (!isOpenRef.current) setUnreadCount((count) => count + 1);
  }, []);

  const handleHistory = useCallback((history: ChatMessage[]) => {
    if (history.length > 0) setMessages(history);
  }, []);

  const {
    status: connectionStatus,
    agentTyping,
    sendMessage: sendSocketMessage,
    sendTyping,
  } = useChatSocket({
    visitorId,
    onMessage: handleIncomingMessage,
    onHistory: handleHistory,
  });

  const open = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      const message: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        author: 'visitor',
        content: trimmed,
        timestamp: Date.now(),
        visitorId,
      };
      setMessages((prev) => [...prev, message]);
      sendSocketMessage(message);
    },
    [visitorId, sendSocketMessage]
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    messages,
    unreadCount,
    sendMessage,
    visitorId,
    connectionStatus,
    agentTyping,
    sendTyping,
  };
}
