
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PlayerNameInputScreenProps {
  onSubmit: (name: string) => void;
}

const PlayerNameInputScreen: React.FC<PlayerNameInputScreenProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

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
        className="bg-gray-900 w-full max-w-sm p-8 rounded-xl shadow-2xl border border-yellow-500/50 text-white text-center"
      >
        <h2 className="text-3xl font-bold text-yellow-400 font-serif-display">New High Score!</h2>
        <p className="text-gray-300 my-4">Enter your name for the leaderboard.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white text-center text-lg"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!name.trim()}
            className="mt-6 w-full px-6 py-3 bg-yellow-600 text-black font-bold rounded-md disabled:bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PlayerNameInputScreen;
