
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LeaderboardEntry } from '../types';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const MOCK_NAMES = [
    'CryptoKing_99', 'CardMaster_X', 'WhaleWatcher', 'RogueShadow', 'AceHigh_X',
    'DealerDestroyer', 'MoonMan_X', 'BettingBae', 'Satoshi_Dev', 'VoidWalker',
    'JackBlack', 'Viking_Rouge', 'HighRoller_88', 'LuckyCat_Meow', 'Zero_Sum'
];

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'global' | 'syndicate'>('global');

  useEffect(() => {
    // Generate simulated data
    const generateSimulatedData = () => {
        const data: LeaderboardEntry[] = MOCK_NAMES.map((name, i) => ({
            id: `user_${i}`,
            name,
            score: 100 - (i * 5) + Math.floor(Math.random() * 10),
            rank: i + 1
        })).sort((a, b) => b.score - a.score);
        return data.map((entry, index) => ({ ...entry, rank: index + 1 }));
    };

    setLeaderboard(generateSimulatedData());

    // Update simulation every minute to look alive
    const interval = setInterval(() => {
        setLeaderboard(prev => {
            const updated = prev.map(entry => ({
                ...entry,
                score: entry.score + (Math.random() > 0.8 ? 1 : 0)
            })).sort((a, b) => b.score - a.score);
            return updated.map((entry, index) => ({ ...entry, rank: index + 1 }));
        });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="w-full h-full flex flex-col items-center text-white pt-16 px-4 overflow-y-auto custom-scrollbar pb-12"
    >
      <h1 className="text-5xl font-bold font-serif-display text-yellow-400 mb-4">Rankings</h1>
      <div className="flex gap-4 mb-8 bg-black/40 p-1 rounded-xl border border-white/10">
          <button onClick={() => setActiveTab('global')} className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'global' ? 'bg-yellow-600 text-black' : 'text-gray-500'}`}>Global</button>
          <button onClick={() => setActiveTab('syndicate')} className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'syndicate' ? 'bg-yellow-600 text-black' : 'text-gray-500'}`}>Syndicate</button>
      </div>
      
      <div className="w-full max-w-2xl bg-black/40 p-4 rounded-2xl border border-white/5 shadow-2xl">
        <div className="sticky top-0 bg-gray-900/90 py-2 flex justify-between px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 z-10">
            <span>Rank / Player</span>
            <span>Floor Reached</span>
        </div>
        <div className="space-y-2 mt-4">
            <AnimatePresence>
            {leaderboard.map((entry, index) => (
              <motion.div 
                key={entry.name} 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-4 ${index < 3 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/5'} rounded-xl transition-all hover:bg-white/10`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold w-10 text-center ${index === 0 ? 'text-yellow-400 text-3xl' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-700' : 'text-gray-600'}`}>
                    {index === 0 ? '👑' : index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold font-serif-display">{entry.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Registered TON Wallet</span>
                  </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-500">{entry.score}</div>
                    <div className="text-[8px] text-green-500 font-bold uppercase animate-pulse">Playing Now</div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
        </div>
      </div>

      <motion.button
        onClick={onBack}
        className="mt-12 px-10 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-colors border border-white/5 uppercase text-xs tracking-widest"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Main Menu
      </motion.button>
    </motion.div>
  );
};

export default LeaderboardScreen;