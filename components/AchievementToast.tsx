
import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
}

const AchievementToast: React.FC<AchievementToastProps> = React.memo(({ achievement }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-4 rounded-lg shadow-2xl border-2 border-green-400/50"
    >
      <div className="text-3xl">🏆</div>
      <div>
        <p className="font-bold text-green-400">Achievement Unlocked!</p>
        <p className="text-white">{achievement.name}</p>
      </div>
    </motion.div>
  );
});

export default AchievementToast;
