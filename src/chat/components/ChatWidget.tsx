import { AnimatePresence } from 'framer-motion';
import { useChatWidget } from '../hooks/useChatWidget';
import ChatLauncher from './ChatLauncher';
import ChatWindow from './ChatWindow';

// Floating chat widget. Renders exclusively fixed-position elements,
// so it never participates in or affects the document layout.
export default function ChatWidget() {
  const {
    isOpen,
    close,
    toggle,
    messages,
    unreadCount,
    sendMessage,
    connectionStatus,
    agentTyping,
    sendTyping,
  } = useChatWidget();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            onClose={close}
            connectionStatus={connectionStatus}
            agentTyping={agentTyping}
            onTyping={sendTyping}
          />
        )}
      </AnimatePresence>

      <ChatLauncher isOpen={isOpen} unreadCount={unreadCount} onClick={toggle} />
    </>
  );
}
