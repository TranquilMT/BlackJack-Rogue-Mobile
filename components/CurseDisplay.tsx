
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Curse } from '../types';
import { CurseId } from '../types';

interface CurseDisplayProps {
  curses: Curse[];
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
    return <span className="text-xl drop-shadow-lg">{curseIcons[curseId] || '❓'}</span>
}

const CurseDisplay: React.FC<CurseDisplayProps> = ({ curses }) => {
  const [hoveredCurse, setHoveredCurse] = useState<Curse | null>(null);

  if (curses.length === 0) return null;

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-2 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {curses.map((curse, index) => (
          <motion.div
            key={curse.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
            onMouseEnter={() => setHoveredCurse(curse)}
            onMouseLeave={() => setHoveredCurse(null)}
          >
            <div className="w-12 h-12 bg-black/50 rounded-lg border-2 border-red-500/50 flex items-center justify-center cursor-pointer shadow-lg">
                <CurseIcon curseId={curse.id} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
          {hoveredCurse && (
              <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-0 right-full mr-4 w-64 z-50 pointer-events-none"
              >
                  <div className="bg-black/80 text-white rounded-md p-3 shadow-xl border border-white/20">
                      <h3 className="font-bold text-red-400">{hoveredCurse.name}</h3>
                      <p className="text-sm text-gray-300">{hoveredCurse.description}</p>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default CurseDisplay;
