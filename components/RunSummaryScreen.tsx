
import React from 'react';
import { motion } from 'framer-motion';
import { RunStats } from '../types';
import { SYNERGIES } from '../game/synergies';

interface RunSummaryScreenProps {
  stats: RunStats;
  onClose: () => void;
}

const RunSummaryScreen = ({ stats, onClose }: RunSummaryScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20, rotateX: 10 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 w-full max-w-2xl p-8 rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.3)] border-2 border-blue-500/50 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 text-center mb-8 font-serif-display drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Run Summary</h2>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-lg relative z-10">
            <div className="font-semibold text-gray-400">Floors Cleared:</div>
            <div className="text-right font-black text-white font-rogue-number">{stats.floor}</div>

            <div className="font-semibold text-gray-400">Total Damage Dealt:</div>
            <div className="text-right font-black text-red-400 font-rogue-number">{stats.totalDamageDealt}</div>
            
            <div className="font-semibold text-gray-400">Shards Earned:</div>
            <div className="text-right font-black text-yellow-400 font-rogue-number">{stats.shardsEarned}</div>

            {stats.relicCurrencyEarned > 0 && (
              <>
                <div className="font-semibold text-gray-400">$RELIC Earned:</div>
                <div className="text-right font-black text-purple-400 font-rogue-number">{stats.relicCurrencyEarned}</div>
              </>
            )}
            
            <div className="font-semibold text-gray-400 col-span-2 mt-4 mb-2">Relics Collected:</div>
            <div className="col-span-2 text-base text-gray-300">
                {stats.relicsCollected.length > 0 ? stats.relicsCollected.join(', ') : 'None'}
            </div>

            <div className="font-semibold text-gray-400 col-span-2 mt-4 mb-2">Synergies Activated:</div>
            <div className="col-span-2 text-base">
                {Object.entries(stats.synergiesActivated).length > 0 ? (
                     <ul className="list-disc list-inside">
                        {Object.entries(stats.synergiesActivated).map(([synergyId, count]) => (
                            <li key={synergyId} className="text-gray-300">
                                <span className="text-cyan-400">{SYNERGIES[synergyId]?.name || synergyId}:</span> <span className="font-rogue-number">{count}</span> times
                            </li>
                        ))}
                    </ul>
                ) : 'None'}
            </div>
        </div>

        <div className="text-center mt-8">
            <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-md font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Close
            </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RunSummaryScreen;
