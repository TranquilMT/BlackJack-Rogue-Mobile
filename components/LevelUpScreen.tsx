
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LevelUpChoice } from '../types';
import { LevelUpChoiceId } from '../types';

interface LevelUpScreenProps {
  choices: LevelUpChoice[];
  onSelect: (choiceId: LevelUpChoiceId) => void;
  level: number;
}

const LevelUpIcon = ({ choiceId }: { choiceId: LevelUpChoiceId; }) => {
    const icons: Record<LevelUpChoiceId, string> = {
        [LevelUpChoiceId.MAX_HP_UP]: '❤️‍🔥',
        [LevelUpChoiceId.PERMANENT_DAMAGE_UP]: '⚔️',
        [LevelUpChoiceId.POTION_CAPACITY_UP]: '🧪',
        [LevelUpChoiceId.CRITICAL_HIT_CHANCE]: '🎯',
        [LevelUpChoiceId.SHIELD_ON_STAND]: '🛡️',
        [LevelUpChoiceId.FOCUS_GENERATION_UP]: '🧘',
    };
    return <span className="text-4xl drop-shadow-lg">{icons[choiceId] || '✨'}</span>
}

const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ choices, onSelect, level }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/95 z-[100] overflow-y-auto custom-scrollbar"
    >
      <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12">
          <motion.h1 
            className="text-5xl md:text-8xl font-black font-serif-display text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-2 text-center mt-8 md:mt-0"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{filter: 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.7))'}}
          >
            LEVEL UP!
          </motion.h1>
          <motion.h2
            className="text-lg md:text-2xl text-gray-300 mb-8 text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            You are now Level {level}. Choose an upgrade.
          </motion.h2>

          <div className="flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-4 w-full max-w-5xl">
            <AnimatePresence>
                {choices.map((choice, index) => (
                    <motion.div
                        key={choice.id}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 150, damping: 15 }}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(31, 41, 55, 0.9)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(choice.id)}
                        className="w-full md:w-64 bg-gray-900/60 rounded-2xl border-2 border-yellow-500/30 p-4 md:p-6 flex flex-row md:flex-col items-center md:text-center cursor-pointer shadow-lg hover:border-yellow-400 transition-all gap-4 group"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-black/40 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-yellow-500/30 group-hover:border-yellow-400 group-hover:bg-yellow-500/10 transition-colors">
                            <LevelUpIcon choiceId={choice.id} />
                        </div>
                        <div className="flex flex-col flex-1 md:items-center">
                            <h3 className="text-xl font-bold text-yellow-200 group-hover:text-yellow-100 transition-colors">{choice.name}</h3>
                            <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors leading-snug mt-1">{choice.description}</p>
                        </div>
                        {/* Mobile chevron */}
                        <div className="md:hidden text-yellow-500 opacity-50 text-xl font-bold">
                            &gt;
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
          </div>
      </div>
    </motion.div>
  );
};

export default LevelUpScreen;
