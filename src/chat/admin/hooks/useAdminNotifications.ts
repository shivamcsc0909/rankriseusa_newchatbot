import { useEffect, useRef, useState, useCallback } from 'react';
import type { AdminConversation } from '../types';

/**
 * Custom hook for safe browser notifications and sound alerts when new visitor messages arrive.
 */
export function useAdminNotifications(
  conversations: AdminConversation[],
  selectedId: string | null,
  onSelectConversation: (id: string) => void
) {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  const isInitializedRef = useRef(false);
  const seenMessageIdsRef = useRef<Set<string>>(new Set());

  // Safe function to request desktop notification permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
    } catch {
      // Safe fallback if browser blocks request
    }
  }, []);

  // Subtle audio chime via Web Audio API (no external file dependencies)
  const playChime = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 tone
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5 tone

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio autoplay policy or Web Audio failure — fail silently
    }
  }, []);

  useEffect(() => {
    if (!conversations || conversations.length === 0) return;

    // Initial load: populate seen messages to avoid notifying for existing history
    if (!isInitializedRef.current) {
      conversations.forEach((c) => {
        c.messages.forEach((m) => {
          seenMessageIdsRef.current.add(m.id);
        });
      });
      isInitializedRef.current = true;
      return;
    }

    // Check for NEW visitor messages
    const newVisitorMessages: Array<{ conversation: AdminConversation; text: string }> = [];

    conversations.forEach((c) => {
      c.messages.forEach((m) => {
        if (!seenMessageIdsRef.current.has(m.id)) {
          seenMessageIdsRef.current.add(m.id);
          // Only notify for visitor messages, NOT agent replies
          if (m.author === 'visitor') {
            newVisitorMessages.push({ conversation: c, text: m.content });
          }
        }
      });
    });

    if (newVisitorMessages.length === 0) return;

    // Play subtle chime for incoming visitor message
    playChime();

    // Show desktop notification if permission granted
    if (permission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
      // Group incoming messages by conversation ID
      const byConv = new Map<string, { conversation: AdminConversation; messages: string[] }>();
      newVisitorMessages.forEach(({ conversation, text }) => {
        const existing = byConv.get(conversation.id);
        if (existing) {
          existing.messages.push(text);
        } else {
          byConv.set(conversation.id, { conversation, messages: [text] });
        }
      });

      byConv.forEach(({ conversation, messages }) => {
        const isCurrentSelected = conversation.id === selectedId;
        const isTabHidden = document.hidden;

        // Trigger notification if tab is backgrounded OR admin is viewing another conversation
        if (isTabHidden || !isCurrentSelected) {
          try {
            const visitorName = conversation.visitor.name || 'Visitor';
            const title =
              messages.length === 1
                ? `New message — RankRise USA`
                : `${messages.length} new messages — RankRise USA`;

            const body =
              messages.length === 1
                ? `${visitorName}: ${messages[0].slice(0, 80)}`
                : `${messages.length} messages from ${visitorName}`;

            const notification = new Notification(title, {
              body,
              tag: `chat-${conversation.id}`,
              icon: '/favicon.ico',
            });

            notification.onclick = () => {
              window.focus();
              onSelectConversation(conversation.id);
              notification.close();
            };
          } catch {
            // Notification error handling — fail silently
          }
        }
      });
    }
  }, [conversations, selectedId, permission, playChime, onSelectConversation]);

  return { permission, requestPermission };
}
