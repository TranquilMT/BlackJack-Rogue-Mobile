
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Boon } from '../types';
import { BoonId } from '../types';
import { audioManager } from '../services/audioManager';

interface BoonSelectionScreenProps {
  choices: Boon[];
  onSelect: (boonId: BoonId) => void;
}

const BoonIcon = ({ boonId }: { boonId: BoonId; }) => {
    const boonIcons: Record<BoonId, string> = {
        [BoonId.MAX_HP_UP_SMALL]: '❤️‍🩹',
        [BoonId.FLAT_DAMAGE_UP_SMALL]: '⚔️',
        [BoonId.STARTING_SHIELD_SMALL]: '🛡️',
        [BoonId.HEAL_SMALL]: '💖',
        [BoonId.SHARD_GAIN_UP]: '💰',
        [BoonId.POTION_CHARGE_UP]: '🧪',
        [BoonId.SURVIVAL_BONUS]: '⏳',
    };
    return <span className="text-4xl drop-shadow-lg">{boonIcons[boonId] || '✨'}</span>
}

const BoonSelectionScreen: React.FC<BoonSelectionScreenProps> = ({ choices, onSelect }) => {
  const handleSelect = (boonId: BoonId) => {
    audioManager.playSound('boon-acquire');
    onSelect(boonId);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center text-white p-4"
    >
      <motion.h1 
        className="text-5xl font-bold font-serif-display text-cyan-400 mb-4 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        style={{textShadow: '0 0 15px rgba(34, 211, 238, 0.6)'}}
      >
        Blackjack!
      </motion.h1>
      <motion.h2
        className="text-2xl text-gray-300 mb-12 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        Choose a Boon
      </motion.h2>

      <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-8">
        <AnimatePresence>
            {choices.map((boon, index) => (
                <motion.div
                    key={boon.id}
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2, type: 'spring', stiffness: 150, damping: 15 }}
                    whileHover={{ scale: 1.05, y: -10, boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}
                    onClick={() => handleSelect(boon.id)}
                    className="w-48 h-64 bg-gray-900/80 rounded-xl border-2 border-cyan-400/50 p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-lg"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border-2 border-cyan-500/50 mb-3">
                            <BoonIcon boonId={boon.id} />
                        </div>
                        <h3 className="text-lg font-bold text-cyan-300">{boon.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm">{boon.description}</p>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BoonSelectionScreen;
