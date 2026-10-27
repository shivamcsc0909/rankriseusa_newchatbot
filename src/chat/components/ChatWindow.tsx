import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Headset, Send, X } from 'lucide-react';
import type { ChatMessage, ChatSocketStatus } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  onClose: () => void;
  connectionStatus?: ChatSocketStatus;
  agentTyping?: boolean;
  onTyping?: (isTyping: boolean) => void;
}

const TYPING_IDLE_MS = 1500;

function StatusLabel({ status }: { status: ChatSocketStatus }) {
  if (status === 'disabled') {
    return (
      <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Chat</p>
    );
  }

  const config: Record<Exclude<ChatSocketStatus, 'disabled'>, { dot: string; label: string }> = {
    online: { dot: 'bg-green-500', label: 'Online' },
    connecting: { dot: 'bg-yellow-500 animate-pulse', label: 'Connecting…' },
    offline: { dot: 'bg-gray-500', label: 'Offline' },
  };
  const { dot, label } = config[status];

  return (
    <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </p>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="rounded-2xl rounded-bl-md bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-1"
        aria-label="Agent is typing"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({
  messages,
  onSend,
  onClose,
  connectionStatus = 'disabled',
  agentTyping = false,
  onTyping,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, agentTyping]);

  // Ensure a trailing "stopped typing" is sent if the window unmounts mid-typing.
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (isTypingRef.current) onTyping?.(false);
    };
  }, [onTyping]);

  const notifyTyping = () => {
    if (!onTyping) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTyping(false);
    }, TYPING_IDLE_MS);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
    if (isTypingRef.current) {
      isTypingRef.current = false;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTyping?.(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      className="fixed bottom-24 right-4 sm:right-6 z-[205] w-[calc(100vw-2rem)] max-w-sm h-[min(540px,calc(100vh-8rem))] flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-[#05070a] shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
      role="dialog"
      aria-label="Chat with RankRise USA"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Headset className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-black text-foreground leading-tight">RankRise USA</p>
            <StatusLabel status={connectionStatus} />
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1.5 hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.author === 'visitor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={
                msg.author === 'visitor'
                  ? 'max-w-[85%] rounded-2xl rounded-br-md bg-primary text-background px-4 py-2.5 text-sm font-medium whitespace-pre-wrap'
                  : 'max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 border border-white/10 text-foreground px-4 py-2.5 text-sm font-medium whitespace-pre-wrap'
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {agentTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10 bg-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              notifyTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type your message..."
            aria-label="Chat message"
            className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-xl bg-primary text-background flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
