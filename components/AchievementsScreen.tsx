
import React from 'react';
import { motion } from 'framer-motion';
import { AchievementId } from '../types';
import { ACHIEVEMENTS } from '../game/achievements';

interface AchievementsScreenProps {
  unlockedIds: AchievementId[];
  onBack: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ unlockedIds, onBack }) => {
  // FIX: Used Object.entries to include the achievement ID, which is needed for keys and checks.
  const allAchievements = Object.entries(ACHIEVEMENTS).map(([id, achData]) => ({ id: id as AchievementId, ...achData }));
  
  // Safe array
  const safeUnlockedIds = unlockedIds || [];

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col items-center text-white pt-16 md:pt-24 px-4 overflow-y-auto custom-scrollbar pb-12"
    >
      <motion.h1 variants={itemVariants} className="text-5xl font-bold font-serif-display text-green-400 mb-8">Achievements</motion.h1>
      
      <motion.div variants={itemVariants} className="w-full max-w-4xl bg-black/40 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map(ach => {
            const isUnlocked = safeUnlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={`bg-gray-800/50 p-4 rounded-lg transition-all duration-300 ${isUnlocked ? 'border-l-4 border-green-400' : 'opacity-60'}`}>
                <h3 className={`text-xl font-bold ${isUnlocked ? 'text-green-300' : 'text-gray-500'}`}>{ach.name}</h3>
                <p className={`mt-1 text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isUnlocked ? ach.description : '???'}
                </p>
                {isUnlocked && <div className="text-right mt-2 font-bold text-green-400">UNLOCKED</div>}
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="mt-8 px-8 py-3 bg-gray-700 text-white font-bold rounded-md shadow-lg hover:bg-gray-600 transition-colors uppercase text-xs tracking-widest"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Main Menu
      </motion.button>
    </motion.div>
  );
};

export default AchievementsScreen;