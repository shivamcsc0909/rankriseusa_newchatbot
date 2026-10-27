import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
        >
          <span className="text-white font-bold text-4xl">R</span>
        </motion.div>

        {/* Brand Name */}
        <p className="text-4xl font-bold text-gradient mb-4">
          RankRise USA
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-muted-foreground"
        >
          Loading your digital experience...
        </motion.p>
      </div>
    </motion.div>
  );
}
