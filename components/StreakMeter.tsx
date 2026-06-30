import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreakMeterProps {
  streak: number;
}

const StreakMeter: React.FC<StreakMeterProps> = React.memo(({ streak }) => {
  if (streak === 0) {
    return (
        <AnimatePresence>
            {null}
        </AnimatePresence>
    );
  }

  const color = streak >= 5 ? '#ef4444' : streak >= 3 ? '#f97316' : '#facc15';
  const textShadow = `0 0 8px ${color}, 0 0 15px ${color}`;

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 flex items-center flex-col pointer-events-none"
        >
            <div className="text-center font-serif-display">
                <motion.span 
                    className="text-sm font-bold uppercase tracking-widest" 
                    style={{ color, textShadow }}
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ delay: 0.2 }}
                >
                    WIN STREAK
                </motion.span>
                <div className="flex items-center justify-center -mt-1">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={streak}
                            initial={{ y: 20, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                            className="text-5xl font-black font-rogue-number"
                            style={{ color, textShadow }}
                        >
                            {streak}
                        </motion.span>
                    </AnimatePresence>
                    <motion.span 
                        className="text-3xl font-bold ml-1" 
                        style={{ color, textShadow }}
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1}}
                        transition={{ delay: 0.3 }}
                    >
                        x
                    </motion.span>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
});

export default StreakMeter;
