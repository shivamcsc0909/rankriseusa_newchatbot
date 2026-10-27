import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_SOCKET_URL } from '../../config';
import type {
  AdminConversation,
  AdminNotification,
  AdminPresence,
  ConversationStatus,
  LiveVisitor,
  TypingState,
} from '../types';
import { AdminChatSocket } from '../services/adminChatSocket';

export function useAdminChat(
  adminKey: string,
  onUnauthorized?: () => void,
  fallback: AdminConversation[] = []
) {
  const [conversations, setConversations] = useState(fallback);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [typing, setTyping] = useState<TypingState[]>([]);
  const [presence, setPresence] = useState<AdminPresence>({ agentsOnline: 0, liveVisitors: 0 });
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [connected, setConnected] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const socketRef = useRef<AdminChatSocket | null>(null);
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  useEffect(() => {
    if (!CHAT_SOCKET_URL || !adminKey) return;
    setAuthFailed(false);
    const socket = new AdminChatSocket(adminKey);
    socketRef.current = socket;
    const offSnapshot = socket.onSnapshot(setConversations);
    const offNotifications = socket.onNotifications(setNotifications);
    const offTyping = socket.onTyping(setTyping);
    const offPresence = socket.onPresence(setPresence);
    const offLive = socket.onLiveVisitors(setLiveVisitors);
    const offStatus = socket.onStatus(setConnected);
    const offAuthFailed = socket.onAuthFailed(() => {
      setAuthFailed(true);
      setConnected(false);
      onUnauthorizedRef.current?.();
    });
    socket.connect();
    return () => {
      offSnapshot();
      offNotifications();
      offTyping();
      offPresence();
      offLive();
      offStatus();
      offAuthFailed();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [adminKey]);

  const sendMessage = useCallback((visitorId: string, content: string) => {
    socketRef.current?.sendMessage(visitorId, content);
  }, []);
  const notifyTyping = useCallback((visitorId: string) => {
    socketRef.current?.notifyTyping(visitorId);
  }, []);
  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.markRead(conversationId);
  }, []);
  const markNotificationRead = useCallback((id: string) => {
    socketRef.current?.markNotificationRead(id);
  }, []);
  const updateConversation = useCallback(
    (conversationId: string, status?: ConversationStatus, agentId?: string) => {
      socketRef.current?.updateConversation(conversationId, status, agentId);
    },
    []
  );
  const exportConversation = useCallback((conversationId: string) => {
    socketRef.current?.exportConversation(conversationId);
  }, []);

  return {
    conversations,
    setConversations,
    notifications,
    typing,
    presence,
    liveVisitors,
    connected,
    authFailed,
    liveEnabled: Boolean(CHAT_SOCKET_URL),
    sendMessage,
    notifyTyping,
    markRead,
    markNotificationRead,
    updateConversation,
    exportConversation,
  };
}
