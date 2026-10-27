import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatSocketClient } from '../services/chatSocket';
import { CHAT_SOCKET_URL } from '../config';
import type { ChatMessage, ChatSocketStatus } from '../types';

interface UseChatSocketOptions {
  visitorId: string;
  onMessage: (message: ChatMessage) => void;
  onHistory?: (messages: ChatMessage[]) => void;
}

/**
 * Realtime transport hook (Phase 5: AJAX polling).
 * When no API base is configured the hook is inert:
 * status stays 'disabled', nothing connects, and all senders are no-ops.
 */
export function useChatSocket({ visitorId, onMessage, onHistory }: UseChatSocketOptions) {
  const [status, setStatus] = useState<ChatSocketStatus>(
    CHAT_SOCKET_URL ? 'connecting' : 'disabled'
  );
  const [agentTyping, setAgentTyping] = useState(false);
  const clientRef = useRef<ChatSocketClient | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;
  const onHistoryRef = useRef(onHistory);
  onHistoryRef.current = onHistory;

  useEffect(() => {
    if (!CHAT_SOCKET_URL) return;

    const client = new ChatSocketClient(CHAT_SOCKET_URL, visitorId);
    clientRef.current = client;

    const offStatus = client.on('status', setStatus);
    const offMessage = client.on('message', (message) => {
      // Ignore echoes of this visitor's own messages.
      if (message.author === 'visitor' && message.visitorId === visitorId) return;
      onMessageRef.current(message);
    });
    const offHistory = client.on('history', (messages) => {
      onHistoryRef.current?.(messages);
    });
    const offTyping = client.on('typing', (event) => {
      if (event.author === 'agent') setAgentTyping(event.isTyping);
    });

    client.connect();

    return () => {
      offStatus();
      offMessage();
      offHistory();
      offTyping();
      client.disconnect();
      clientRef.current = null;
    };
  }, [visitorId]);

  const sendMessage = useCallback((message: ChatMessage) => {
    clientRef.current?.sendMessage(message);
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    clientRef.current?.sendTyping(isTyping);
  }, []);

  return { status, agentTyping, sendMessage, sendTyping };
}
