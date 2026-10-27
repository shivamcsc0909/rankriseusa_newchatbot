import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

interface ChatLauncherProps {
  isOpen: boolean;
  unreadCount: number;
  onClick: () => void;
}

export default function ChatLauncher({ isOpen, unreadCount, onClick }: ChatLauncherProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5, type: 'spring', stiffness: 140, damping: 16 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      className="fixed bottom-8 right-6 z-[204] w-14 h-14 rounded-2xl bg-primary text-background flex items-center justify-center shadow-[0_8px_30px_rgba(234,179,8,0.45)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isOpen ? 'close' : 'open'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#05070a]"
            aria-label={`${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
