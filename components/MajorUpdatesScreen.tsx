import React from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../services/audioManager';

const MajorUpdatesScreen: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
    const handleConfirm = () => {
        audioManager.playSound('button-click');
        onConfirm();
    };

    return (
        <motion.div
            className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.h1 
                className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-8 uppercase tracking-tighter"
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
            >
                BIG UPDATE!
            </motion.h1>
            <div className="text-white space-y-6 max-w-2xl mb-12">
                <h2 className="text-3xl font-bold text-emerald-400">What's New?</h2>
                <ul className="text-xl space-y-4">
                    <li>🚀 <b>New Game Modes</b> - Endless and Campaign modes added!</li>
                    <li>🎨 <b>Enhanced Visuals</b> - Smoother animations and sharper textures.</li>
                    <li>🛠️ <b>General Fixes</b> - Squashed bugs for a smoother ride.</li>
                </ul>
            </div>
            <button 
                onClick={handleConfirm}
                className="px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl uppercase text-xl tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
                Let's Go!
            </button>
        </motion.div>
    );
};

export default MajorUpdatesScreen;
