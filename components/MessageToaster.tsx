
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageToasterProps {
  message: string;
}

const MessageToaster: React.FC<MessageToasterProps> = React.memo(({ message }) => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  // Correctly initialized with null for React 19 compatibility
  const prevMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (message && message !== prevMessageRef.current) {
      setCurrentMessage(message);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      prevMessageRef.current = message;
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 50, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: -50, scale: 0.8, rotateX: 90, transition: { duration: 0.4 } }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] text-white bg-gradient-to-b from-red-900/90 to-black/90 border-2 border-red-500/50 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] text-lg md:text-3xl font-black font-serif-display uppercase tracking-widest text-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {currentMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default MessageToaster;
