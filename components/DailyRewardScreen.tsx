
import React from 'react';
import { motion } from 'framer-motion';

interface DailyRewardScreenProps {
  onClaim: () => void;
  rewards: { shards: number; relicCurrency: number };
}

const DailyRewardScreen: React.FC<DailyRewardScreenProps> = ({ onClaim, rewards }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 z-[200] flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        className="bg-gray-900 w-full max-w-sm p-8 rounded-xl shadow-2xl border border-green-500/50 text-white text-center"
      >
        <h2 className="text-3xl font-bold text-green-400 font-serif-display">Daily Reward!</h2>
        <p className="text-gray-300 my-4">Welcome back! Here are your rewards for today:</p>
        <div className="my-6 space-y-2">
            <p className="text-2xl font-bold text-yellow-400">{rewards.shards} Shards</p>
            <p className="text-2xl font-bold text-purple-400">{rewards.relicCurrency} $RELIC</p>
        </div>
        <motion.button
          onClick={onClaim}
          className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Claim
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DailyRewardScreen;
