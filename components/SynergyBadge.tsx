
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Synergy } from '../types';
import { SynergyId } from '../types';

interface SynergyBadgeProps {
  synergy: Synergy;
}

const synergyColors: Record<SynergyId, string> = {
  [SynergyId.SuitedConnectors]: 'bg-blue-500/80 border-blue-400',
  [SynergyId.PairedAces]: 'bg-yellow-500/80 border-yellow-400',
  [SynergyId.LuckySevens]: 'bg-green-500/80 border-green-400',
  [SynergyId.RoyalCourt]: 'bg-purple-500/80 border-purple-400',
  [SynergyId.BlackjackFlush]: 'bg-teal-500/80 border-teal-400',
  [SynergyId.FiveCardCharlie]: 'bg-indigo-500/80 border-indigo-400',
  [SynergyId.ColorFlush]: 'bg-pink-500/80 border-pink-400',
  [SynergyId.PerfectTwentyOne]: 'bg-orange-500/80 border-orange-400',
  [SynergyId.AceInTheHole]: 'bg-gray-400/80 border-gray-300',
  [SynergyId.BlackAndRed]: 'bg-gradient-to-r from-red-500/80 to-gray-600/80 border-gray-400',
  [SynergyId.NumericalStraight]: 'bg-cyan-500/80 border-cyan-400',
  [SynergyId.KingsRansom]: 'bg-amber-500/80 border-amber-400',
  [SynergyId.FullHouse]: 'bg-rose-500/80 border-rose-400',
  [SynergyId.Flush]: 'bg-emerald-500/80 border-emerald-400',
  [SynergyId.StraightFlush]: 'bg-fuchsia-500/80 border-fuchsia-400',
  [SynergyId.TwoPair]: 'bg-lime-500/80 border-lime-400',
  [SynergyId.ThreeOfAKind]: 'bg-sky-500/80 border-sky-400',
  [SynergyId.Lowball]: 'bg-slate-500/80 border-slate-400',
  [SynergyId.EvenSplit]: 'bg-violet-500/80 border-violet-400',
  [SynergyId.OddSplit]: 'bg-amber-600/80 border-amber-500',
  [SynergyId.PrimeTime]: 'bg-zinc-500/80 border-zinc-300',
  [SynergyId.FaceOff]: 'bg-red-800/80 border-red-500',
  [SynergyId.DivineNine]: 'bg-yellow-200/80 border-yellow-400 text-black',
  [SynergyId.Zenith]: 'bg-teal-700/80 border-teal-400',
  [SynergyId.Rainbow]: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 border-white',
  [SynergyId.Snapshot]: 'bg-gray-800/80 border-white/50',
  [SynergyId.DoubleDownFrenzy]: 'bg-orange-600/80 border-orange-400',
  [SynergyId.SplitUniverse]: 'bg-indigo-600/80 border-indigo-400',
  [SynergyId.GamblersEdge]: 'bg-red-700/80 border-red-500',
  [SynergyId.EchoChamber]: 'bg-emerald-700/80 border-emerald-400',
};


// FIX: Changed to React.FC to correctly type as a functional component, resolving key prop issue.
const SynergyBadge: React.FC<SynergyBadgeProps> = ({ synergy }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colorClasses = synergyColors[synergy.id] || 'bg-gray-500/80 border-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 10, scale: 0.5, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute -inset-2 rounded-md ${colorClasses}`}
        initial={{ opacity: 0.8, scale: 1.5, filter: 'blur(12px)' }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
        style={{ zIndex: -1 }}
      />
      <div 
        className={`relative px-2 py-0.5 text-[10px] font-black text-white rounded-sm border-2 text-center shadow-lg skew-x-[-4deg] uppercase tracking-tighter ${colorClasses}`}
        style={{
            textShadow: '1px 1px 0px rgba(0,0,0,0.8)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
        }}
      >
        {synergy.name}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs z-50"
          >
            <div className="bg-black/80 text-white text-xs rounded-md p-2 shadow-lg">
              {synergy.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SynergyBadge;
