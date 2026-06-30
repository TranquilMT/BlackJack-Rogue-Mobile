
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MetaState } from './types';
import { audioManager } from './services/audioManager';

interface SettingsScreenProps {
  onBack: () => void;
  metaState: MetaState;
  updateMetaState: React.Dispatch<React.SetStateAction<MetaState>>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, metaState, updateMetaState }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleMasterReset = () => {
    audioManager.playSound('button-click');
    localStorage.clear();
    window.location.reload();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    audioManager.setVolume(newVolume);
    updateMetaState(prev => ({
        ...prev,
        customization: {
            ...prev.customization,
            volume: newVolume,
        }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.div
        key="settings"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full flex flex-col items-center justify-center text-white"
      >
        <motion.h1 variants={itemVariants} className="text-5xl font-bold font-serif-display text-red-500 mb-8">Settings</motion.h1>
        
        <motion.div variants={itemVariants} className="bg-black/30 p-8 rounded-lg space-y-8 w-full max-w-md">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Master Volume</h2>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={metaState.customization.volume ?? 0.5}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Master Reset</h2>
                <p className="text-gray-400 mb-6">This will permanently delete all your progress. This action cannot be undone.</p>
                <motion.button
                    onClick={() => { audioManager.playSound('button-click'); setIsConfirmingReset(true); }}
                    className="px-6 py-3 bg-red-700 text-white font-bold text-lg rounded-md shadow-lg hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Reset Progress
                </motion.button>
            </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={onBack}
          className="mt-12 px-6 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-lg hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isConfirmingReset && (
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
                    className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-red-500/50 text-center"
                >
                    <h3 className="text-2xl font-bold text-red-500">Are you sure?</h3>
                    <p className="text-gray-300 my-4">All progress will be lost forever.</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <motion.button
                            onClick={() => { audioManager.playSound('button-click'); setIsConfirmingReset(false); }}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            onClick={handleMasterReset}
                            className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-md font-bold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Confirm Reset
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsScreen;
