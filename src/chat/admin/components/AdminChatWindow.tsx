import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  Check,
  CheckCheck,
  Download,
  Info,
  MessagesSquare,
  RotateCcw,
  Send,
  UserPlus,
  XCircle,
} from 'lucide-react';
import type { AdminConversation, TypingState } from '../types';

interface AdminChatWindowProps {
  conversation: AdminConversation | null;
  onSend: (content: string) => void;
  onTyping?: () => void;
  onBack: () => void;
  onToggleInfo: () => void;
  onAssign: () => void;
  onClose: () => void;
  onReopen: () => void;
  onExport: () => void;
  typing?: TypingState[];
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AdminChatWindow({
  conversation,
  onSend,
  onTyping,
  onBack,
  onToggleInfo,
  onAssign,
  onClose,
  onReopen,
  onExport,
  typing = [],
}: AdminChatWindowProps) {
  const [input, setInput] = useState('');
  const [showNewMsgBadge, setShowNewMsgBadge] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const prevMsgCountRef = useRef(conversation?.messages.length ?? 0);
  const prevConvIdRef = useRef(conversation?.id);

  const checkIfNearBottom = useCallback(() => {
    if (!scrollRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    return scrollHeight - scrollTop - clientHeight < 80;
  }, []);

  const handleScroll = () => {
    const nearBottom = checkIfNearBottom();
    isNearBottomRef.current = nearBottom;
    if (nearBottom && showNewMsgBadge) {
      setShowNewMsgBadge(false);
    }
  };

  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
      setShowNewMsgBadge(false);
      isNearBottomRef.current = true;
    }
  }, []);

  useEffect(() => {
    const currentCount = conversation?.messages.length ?? 0;
    const currentConvId = conversation?.id;

    if (currentConvId !== prevConvIdRef.current) {
      prevConvIdRef.current = currentConvId;
      prevMsgCountRef.current = currentCount;
      setShowNewMsgBadge(false);
      setTimeout(() => scrollToBottom(false), 50);
      return;
    }

    if (currentCount > prevMsgCountRef.current) {
      const lastMsg = conversation?.messages[currentCount - 1];
      const isMyMessage = lastMsg?.author === 'agent';

      if (isMyMessage || isNearBottomRef.current) {
        scrollToBottom(true);
      } else {
        setShowNewMsgBadge(true);
      }
    }
    prevMsgCountRef.current = currentCount;
  }, [conversation?.id, conversation?.messages.length, scrollToBottom]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/40 bg-[#0b141a]">
        <MessagesSquare className="w-14 h-14 opacity-30" />
        <p className="text-sm">Select a chat to start messaging</p>
        <p className="text-xs text-white/25">WhatsApp-style live inbox · RankRise Control Center</p>
      </div>
    );
  }

  const visitorTyping = typing.some(
    (t) => t.visitorId === conversation.visitor.id && t.author === 'visitor' && t.isTyping
  );

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    setTimeout(() => scrollToBottom(true), 50);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 bg-[#0b141a] relative">
      <div className="flex items-center justify-between px-3 py-2.5 bg-[#202c33] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="lg:hidden text-white/60 hover:text-white p-1.5 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#2a3942] flex items-center justify-center text-sm font-bold">
              {(conversation.visitor.name || 'V').slice(0, 1).toUpperCase()}
            </div>
            {conversation.visitorOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#202c33]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{conversation.visitor.name}</p>
            <p className="text-[11px] text-white/45 truncate">
              {visitorTyping
                ? 'typing…'
                : conversation.visitorOnline
                  ? 'online'
                  : conversation.status}
              {conversation.assignedAgentId ? ` · assigned ${conversation.assignedAgentId}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Assign me"
            onClick={onAssign}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
          >
            <UserPlus className="w-4 h-4" />
          </button>
          {conversation.status === 'closed' ? (
            <button
              type="button"
              title="Reopen"
              onClick={onReopen}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              title="Close chat"
              onClick={onClose}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            title="Export chat"
            onClick={onExport}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Visitor info"
            onClick={onToggleInfo}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 xl:hidden"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(0,168,132,0.04) 0, transparent 35%)',
        }}
      >
        {conversation.messages.map((msg) => {
          const isAgent = msg.author === 'agent';
          const seen = msg.status === 'seen' || Boolean(msg.seenAt);
          return (
            <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-lg px-3 py-1.5 shadow-sm ${
                  isAgent
                    ? 'bg-[#005c4b] text-white rounded-br-sm'
                    : 'bg-[#202c33] text-white rounded-bl-sm'
                }`}
              >
                <p className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <div
                  className={`flex items-center gap-1 mt-0.5 ${
                    isAgent ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="text-[10px] text-white/40">{formatTime(msg.timestamp)}</span>
                  {isAgent &&
                    (seen ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-white/40" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
        {visitorTyping && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] rounded-lg rounded-bl-sm px-4 py-2 text-white/50 text-sm italic">
              typing…
            </div>
          </div>
        )}
      </div>

      {showNewMsgBadge && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-[#00a884] text-[#111b21] text-xs font-bold shadow-lg hover:opacity-90 flex items-center gap-1.5 transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          New messages
        </button>
      )}

      <div className="p-2.5 bg-[#202c33] border-t border-white/5 shrink-0">
        {conversation.status === 'closed' ? (
          <button
            type="button"
            onClick={onReopen}
            className="w-full h-11 rounded-xl bg-white/5 text-sm text-white/70 hover:bg-white/10"
          >
            Conversation closed — click to reopen
          </button>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                onTyping?.();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Type a message"
              aria-label="Reply message"
              className="flex-1 max-h-28 min-h-[44px] rounded-xl bg-[#2a3942] border-0 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none resize-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send reply"
              className="w-11 h-11 rounded-full bg-[#00a884] text-[#111b21] flex items-center justify-center disabled:opacity-40 hover:opacity-90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

