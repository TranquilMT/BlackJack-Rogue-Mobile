import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cutscene as CutsceneType } from '../types';
import { audioManager } from '../services/audioManager';

interface CutsceneProps {
    cutscene: CutsceneType;
    onComplete: () => void;
}

const Cutscene = ({ cutscene, onComplete }: CutsceneProps) => {
    const [frameIndex, setFrameIndex] = useState(0);
    const currentFrame = cutscene.frames[frameIndex];

    const handleNext = () => {
        audioManager.playSound('button-click');
        if (frameIndex < cutscene.frames.length - 1) {
            setFrameIndex(frameIndex + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden ${currentFrame.image || 'bg-black'}`}>
            <div className="absolute inset-0 bg-black/60" /> {/* Overlay for readability */}
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={frameIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-4xl w-full p-8 text-center"
                >
                    <h2 className="text-4xl font-serif text-yellow-500 mb-6">{currentFrame.speaker}</h2>
                    <p className="text-2xl md:text-3xl leading-relaxed font-light italic">"{currentFrame.text}"</p>
                </motion.div>
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="relative z-10 mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-lg font-medium backdrop-blur-sm transition-colors"
            >
                {frameIndex < cutscene.frames.length - 1 ? 'Continue' : 'Proceed'}
            </motion.button>
        </div>
    );
};

export default Cutscene;
