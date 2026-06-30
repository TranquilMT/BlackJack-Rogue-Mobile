
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';
import { LootReward } from '../types';

interface LootChestProps {
  onComplete: (rewards: LootReward) => void;
  rewards: LootReward | null;
}

const LootChest: React.FC<LootChestProps> = ({ onComplete, rewards }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showRewards, setShowRewards] = useState(false);

    useEffect(() => {
        // Safe check: if rewards aren't ready, don't animate.
        // In the new flow, rewards are passed from state, so they should be present.
        if (!rewards) return;

        const openTimer = setTimeout(() => {
            audioManager.playSound('chest-open');
            setIsOpen(true);
        }, 1000);

        const showRewardsTimer = setTimeout(() => {
            if (rewards.triggerWheel) {
                audioManager.playSound('win-hand'); // Special sound for wheel
            } else {
                audioManager.playSound('reward-reveal');
            }
            setShowRewards(true);
        }, 1500);

        const completeTimer = setTimeout(() => {
            onComplete(rewards);
        }, 4000);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(showRewardsTimer);
            clearTimeout(completeTimer);
        }
    }, [onComplete, rewards]); // Dependency on rewards ensures we only run if data is ready

    if (!rewards) return null;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center text-white"
    >
        <motion.div
            className="relative w-48 h-48"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0, rotate: [0, -5, 5, -5, 0] }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2, rotate: { duration: 0.5, ease: 'easeInOut', delay: 0.5 } }}
        >
            {/* Chest Base */}
            <div className={`absolute bottom-0 left-0 w-full h-2/3 ${rewards.triggerWheel ? 'bg-purple-900 border-purple-500' : 'bg-yellow-800 border-yellow-900'} rounded-lg border-4 transition-colors duration-500`}></div>
            {/* Chest Lid */}
            <motion.div
                className={`absolute top-0 left-0 w-full h-1/3 ${rewards.triggerWheel ? 'bg-purple-800 border-purple-500' : 'bg-yellow-700 border-yellow-900'} rounded-t-lg border-4 transition-colors duration-500`}
                style={{ originY: '100%' }}
                animate={{ rotateX: isOpen ? -110 : 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 1.0 }}
            ></motion.div>
            
            {/* Glow for Wheel */}
            {rewards.triggerWheel && isOpen && (
                <motion.div 
                    className="absolute inset-0 bg-purple-500 blur-2xl opacity-50 z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.div>
        
        <AnimatePresence>
        {showRewards && (
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center"
            >
                {rewards.triggerWheel ? (
                    <>
                        <h2 className="text-4xl font-bold text-purple-400 mb-2 font-serif-display">Mystery Key Found!</h2>
                        <p className="text-xl">Spinning the Bonus Wheel...</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-yellow-400">Blackjack Bonus!</h2>
                        {rewards.potionCharges && <p className="text-xl mt-2">You found a Potion Charge! 🧪</p>}
                        {rewards.shards && <p className="text-xl mt-2">You found {rewards.shards} Shards! 💰</p>}
                        {rewards.relicCurrency && <p className="text-xl mt-2">You found {rewards.relicCurrency} $RELIC! 💎</p>}
                    </>
                )}
            </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
  );
};

export default LootChest;
