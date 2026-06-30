
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pact } from '../types';
import { audioManager } from '../services/audioManager';
import { hapticManager } from '../services/hapticManager';

interface StrangerEncounterScreenProps {
  choices: Pact[];
  onSelect: (pact: Pact) => void;
}

const PactIcon: React.FC<{ icon: Pact['icon'] }> = ({ icon }) => {
    const icons = {
        skull: '💀',
        coin: '💰',
        heart: '❤️‍🔥',
        star: '✨'
    };
    return <span className="text-4xl drop-shadow-lg">{icons[icon]}</span>;
}

const StrangerEncounterScreen: React.FC<StrangerEncounterScreenProps> = ({ choices, onSelect }) => {
    const [selectedPact, setSelectedPact] = useState<Pact | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleSelect = (pact: Pact) => {
        if (isRevealed) return;
        audioManager.playSound('card-deal');
        setSelectedPact(pact);
        setIsRevealed(true);
    };

    const handleConfirm = () => {
        if (!selectedPact) return;
        audioManager.playSound('boon-acquire');
        onSelect(selectedPact);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center text-white p-4"
        >
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/80 via-black to-black"
                initial={{ scale: 1.5, opacity: 0}}
                animate={{ scale: 1, opacity: 1}}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            
            <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] text-gray-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [10, -10, 10] }}
                transition={{ delay: 0.5, opacity: { duration: 1 }, y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }}}
            >
                👤
            </motion.div>

            <motion.h1
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-4xl md:text-5xl font-bold font-serif-display text-gray-300 mb-4 text-center relative z-10"
                style={{ textShadow: '0 0 15px rgba(0,0,0,0.8)' }}
            >
                A pact is offered...
            </motion.h1>

            <div className="relative flex flex-row flex-wrap justify-center gap-4 md:gap-8 my-12 z-10">
                <AnimatePresence>
                    {choices.map((pact, index) => (
                        <motion.div
                            key={pact.id}
                            initial={{ scale: 0, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.2, type: 'spring', stiffness: 100, damping: 12 }}
                        >
                            <div 
                                className="w-48 h-64 cursor-pointer" 
                                style={{ perspective: '1000px' }} 
                                onClick={() => handleSelect(pact)}
                            >
                                <motion.div
                                    className="relative w-full h-full"
                                    style={{ transformStyle: 'preserve-3d' }}
                                    animate={{ rotateY: selectedPact?.id === pact.id ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* Card Back */}
                                    <div className="absolute w-full h-full bg-gray-900 rounded-xl border-2 border-purple-500/50 p-4 flex flex-col items-center justify-center text-center shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
                                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border-2 border-purple-600/50 mb-3 text-purple-400">
                                            <PactIcon icon={pact.icon} />
                                        </div>
                                        <h3 className="text-lg font-bold text-purple-400 font-serif-display">Pact of the {pact.icon.charAt(0).toUpperCase() + pact.icon.slice(1)}</h3>
                                    </div>

                                    {/* Card Front */}
                                    <div className="absolute w-full h-full bg-gray-800 rounded-xl border-2 border-yellow-400/50 p-4 flex flex-col items-center justify-center text-center shadow-2xl" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                                        <div className="flex flex-col items-center h-full justify-between">
                                            <h3 className="text-lg font-bold text-yellow-300">{pact.name}</h3>
                                            <p className="text-gray-300 text-sm flex-grow flex items-center">{pact.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <AnimatePresence>
            {isRevealed && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    onClick={handleConfirm}
                    className="px-8 py-4 bg-yellow-600 text-black font-black uppercase tracking-widest text-lg rounded-lg shadow-lg hover:bg-yellow-500 relative z-10"
                >
                    Accept Pact
                </motion.button>
            )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StrangerEncounterScreen;
