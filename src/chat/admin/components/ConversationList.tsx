import { Check, CheckCheck } from 'lucide-react';
import type { AdminConversation, TypingState } from '../types';

interface ConversationListProps {
  conversations: AdminConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  typing: TypingState[];
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const STATUS_DOT: Record<AdminConversation['status'], string> = {
  open: 'bg-emerald-400',
  pending: 'bg-amber-400',
  closed: 'bg-white/30',
};

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  typing,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-sm text-white/40">
        No conversations match.
      </div>
    );
  }

  const typingMap = new Set(
    typing.filter((t) => t.author === 'visitor' && t.isTyping).map((t) => t.visitorId)
  );

  return (
    <div className="flex-1 overflow-y-auto" role="list" aria-label="Conversations">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const isSelected = conversation.id === selectedId;
        const isTyping = typingMap.has(conversation.visitor.id);
        const online = conversation.visitorOnline === true;

        return (
          <button
            key={conversation.id}
            type="button"
            role="listitem"
            onClick={() => onSelect(conversation.id)}
            className={`w-full text-left px-4 py-3.5 border-b border-white/5 transition-colors ${
              isSelected ? 'bg-[#00a884]/15' : 'hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#2a3942] flex items-center justify-center text-sm font-bold text-white/80">
                  {(conversation.visitor.name || 'V').slice(0, 1).toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111b21] ${
                    online ? 'bg-emerald-400' : 'bg-white/25'
                  }`}
                  title={online ? 'Online' : 'Offline'}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-white truncate">
                    {conversation.visitor.name}
                  </span>
                  <span className="text-[11px] text-white/40 shrink-0">
                    {formatRelativeTime(conversation.lastMessageAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] text-white/50 truncate flex items-center gap-1">
                    {isTyping ? (
                      <span className="text-[#00a884] italic">typing…</span>
                    ) : lastMessage ? (
                      <>
                        {lastMessage.author === 'agent' && (
                          lastMessage.status === 'seen' || lastMessage.seenAt ? (
                            <CheckCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          )
                        )}
                        <span className="truncate">{lastMessage.content}</span>
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[conversation.status]}`} />
                    {conversation.unreadCount > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#00a884] text-[#111b21] text-[11px] font-bold flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
