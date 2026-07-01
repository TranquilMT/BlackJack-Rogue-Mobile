
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Curse } from '../types';
import { CurseId } from '../types';
import { audioManager } from '../services/audioManager';

interface CurseSelectionScreenProps {
  choices: Curse[];
  onSelect: (curseId: CurseId) => void;
}

const CurseIcon = ({ curseId }: { curseId: CurseId; }) => {
    const curseIcons: Record<CurseId, string> = {
        [CurseId.BrittleBones]: '🦴',
        [CurseId.Butterfingers]: '🖐️',
        [CurseId.ClumsyHands]: '💔',
        [CurseId.DullBlade]: '🗡️',
        [CurseId.Paranoia]: '😵',
        [CurseId.HeavyPockets]: '💰',
        [CurseId.WeakKnees]: '🦵',
    };
    return <span className="text-4xl drop-shadow-lg">{curseIcons[curseId] || '❓'}</span>
}

const CurseSelectionScreen = ({ choices, onSelect }: CurseSelectionScreenProps) => {
  
  const handleSelect = (curseId: CurseId) => {
    audioManager.playSound('curse-acquire');
    onSelect(curseId);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white p-4"
    >
      <motion.h1 
        className="text-5xl font-bold font-serif-display text-red-500 mb-4 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        style={{textShadow: '0 0 15px rgba(239, 68, 68, 0.6)'}}
      >
        A Pyrrhic Victory...
      </motion.h1>
      <motion.h2
        className="text-2xl text-gray-400 mb-12 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        You must accept a Curse.
      </motion.h2>

      <div className="flex flex-row flex-wrap justify-center gap-4 md:gap-8">
        <AnimatePresence>
            {choices.map((curse, index) => (
                <motion.div
                    key={curse.id}
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2, type: 'spring', stiffness: 150, damping: 15 }}
                    whileHover={{ scale: 1.05, y: -10, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
                    onClick={() => handleSelect(curse.id)}
                    className="w-48 h-64 bg-gray-900 rounded-xl border-2 border-red-500/50 p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-lg"
                >
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border-2 border-red-600/50 mb-3">
                            <CurseIcon curseId={curse.id} />
                        </div>
                        <h3 className="text-lg font-bold text-red-400">{curse.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{curse.description}</p>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CurseSelectionScreen;