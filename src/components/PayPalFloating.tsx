import { motion } from 'framer-motion';

export default function PayPalFloating({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.7, type: 'spring', stiffness: 120, damping: 16 }}
      className="fixed bottom-8 left-6 z-[200]"
    >
      {/* Glow aura */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.12, 0.45] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '18px',
          background: 'radial-gradient(ellipse, #FFC439 0%, transparent 70%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      {/* Bob float animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <button
          onClick={onClick}
          aria-label="Pay with PayPal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 22px 12px 16px',
            background: '#FFC439',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow:
              '0 8px 30px rgba(255,196,57,0.6), 0 2px 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.07)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 14px 40px rgba(255,196,57,0.75), 0 4px 14px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 8px 30px rgba(255,196,57,0.6), 0 2px 10px rgba(0,0,0,0.2)';
          }}
        >
          {/* Official PayPal "P" SVG logo — exact proportions */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            {/* Outer P — dark navy */}
            <path
              fill="#003087"
              d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"
            />
            {/* Inner P — light blue */}
            <path
              fill="#009cde"
              d="M19.937 7.996c-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106-.319 2.01a.388.388 0 0 0 .38.44h2.71c.459 0 .85-.334.922-.786l.038-.198.733-4.649.047-.256c.072-.452.463-.786.922-.786h.581c3.76 0 6.704-1.528 7.561-5.95.36-1.847.174-3.39-.614-4.073-.241-.207-.524-.378-.879-.492z"
            />
            {/* Highlight */}
            <path
              fill="#012169"
              d="M18.307 7.504c-.13-.038-.264-.071-.403-.1a8.895 8.895 0 0 0-.602-.098 13.87 13.87 0 0 0-2.2-.162H9.59a.93.93 0 0 0-.921.786L7.455 14.9l-.05.307a1.06 1.06 0 0 1 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.029-.149.054-.293.077-.437a5.543 5.543 0 0 0-.952-.47c-.036-.033-.073-.066-.11-.099z"
            />
          </svg>

          {/* PayPal wordmark */}
          <span
            style={{
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.3px',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            <span style={{ color: '#003087' }}>Pay</span>
            <span style={{ color: '#009cde' }}>Pal</span>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
