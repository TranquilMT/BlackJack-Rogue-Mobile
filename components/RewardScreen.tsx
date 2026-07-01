
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Relic } from '../types';
import { RelicId } from '../types';
import { audioManager } from '../services/audioManager';
import { hapticManager } from '../services/hapticManager';
import RelicAsset from './RelicAsset';

interface RewardScreenProps {
  choices: Relic[];
  onSelect: (relicId: RelicId) => void;
  onSkip: () => void;
}

const RewardScreen = ({ choices, onSelect, onSkip }: RewardScreenProps) => {
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [inspectingRelic, setInspectingRelic] = useState<Relic | null>(null);

  const handleOpenChest = () => {
      audioManager.playSound('chest-open');
      audioManager.playSound('relic-acquire');
      setIsChestOpen(true);
  };
  
  const handleConfirmSelection = (relicId: RelicId) => {
    audioManager.playSound('button-click');
    onSelect(relicId);
    setInspectingRelic(null); // Close modal
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center text-white p-4"
    >
        <AnimatePresence mode="wait">
            {!isChestOpen ? (
                <motion.div 
                    key="chest"
                    className="flex flex-col items-center justify-center cursor-pointer"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    onClick={handleOpenChest}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.h1 
                        className="text-5xl font-bold font-serif-display text-yellow-400 mb-12 text-center"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{textShadow: '0 0 25px rgba(250, 204, 21, 0.6)'}}
                    >
                        Floor Cleared!
                    </motion.h1>
                    
                    <div className="relative w-64 h-64">
                        <div className="absolute inset-0 bg-yellow-500 blur-[60px] opacity-20 animate-pulse"></div>
                        
                        <motion.div 
                            className="relative w-full h-full"
                            animate={{ rotate: [0, -2, 2, -2, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-yellow-800 to-yellow-900 rounded-b-2xl border-4 border-yellow-600 shadow-2xl">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-16 bg-yellow-500 rounded border-2 border-yellow-300 shadow-lg z-10 flex items-center justify-center">
                                    <div className="w-4 h-6 bg-black/30 rounded-sm"></div>
                                </div>
                            </div>
                            <div className="absolute top-4 w-full h-1/3 bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-t-2xl border-4 border-yellow-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform origin-bottom hover:-translate-y-2 transition-transform"></div>
                        </motion.div>
                    </div>
                    
                    <p className="mt-12 text-xl text-gray-400 font-bold tracking-widest uppercase animate-pulse">Tap to Open</p>
                </motion.div>
            ) : (
                <motion.div
                    key="rewards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex flex-col items-center"
                >
                    <motion.h2
                        className="text-4xl text-yellow-100 mb-12 text-center font-serif-display"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        Choose Your Relic
                    </motion.h2>

                    {choices.length === 0 ? (
                      <div className="w-full max-w-md rogue-panel p-8 rounded-2xl border border-yellow-500/30 text-center">
                        <h3 className="text-2xl font-bold text-yellow-200 mb-3">Vault Exhausted</h3>
                        <p className="text-sm text-gray-400 mb-6">No new relics remain in this reward pool. Continue deeper into the run.</p>
                        <motion.button
                          onClick={onSkip}
                          className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-xl text-lg uppercase tracking-widest transition-all shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Continue
                        </motion.button>
                      </div>
                    ) : (
                    <div className="w-full max-w-2xl">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
                          <AnimatePresence>
                              {choices.map((relic, index) => (
                                  <motion.div
                                      key={relic.id}
                                      initial={{ scale: 0, opacity: 0, y: 100, rotateY: 90 }}
                                      animate={{ scale: 1, opacity: 1, y: 0, rotateY: 0 }}
                                      transition={{ delay: 0.1 + index * 0.15, type: 'spring', stiffness: 120, damping: 12 }}
                                      whileHover={{ scale: 1.05, y: -15, boxShadow: '0 0 40px rgba(250, 204, 21, 0.4)' }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => setInspectingRelic(relic)}
                                      className="relative w-full aspect-[2/3] bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-yellow-500/30 p-2 md:p-4 flex flex-col items-center text-center cursor-pointer shadow-2xl group overflow-hidden"
                                  >
                                      <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-colors duration-300"></div>
                                      
                                      <div className="my-2 md:mt-4 md:mb-6 relative">
                                          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full"></div>
                                          <div className="w-16 h-16 md:w-20 md:h-20 bg-black/40 rounded-full flex items-center justify-center border-2 border-yellow-500/50 relative z-10 group-hover:scale-110 transition-transform duration-300">
                                              <RelicAsset id={relic.id} width="75%" height="75%" />
                                          </div>
                                      </div>
                                      
                                      <h3 className="text-base md:text-lg font-bold text-yellow-200 mb-1 md:mb-2 group-hover:text-white transition-colors">{relic.name}</h3>
                                      <div className="w-8 h-0.5 bg-yellow-500/30 mb-2 md:mb-3"></div>
                                      <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">{relic.description}</p>
                                      
                                      <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                  </motion.div>
                              ))}
                          </AnimatePresence>
                      </div>
                    </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
        
        <AnimatePresence>
            {inspectingRelic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 z-[101] flex items-center justify-center p-4"
                onClick={() => setInspectingRelic(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-gray-900 to-black w-full max-w-md p-8 rounded-3xl border-2 border-yellow-500/30 text-center shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                >
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 border-yellow-500/40 bg-yellow-500/10 mb-4">
                        <RelicAsset id={inspectingRelic.id} width={64} height={64} />
                    </div>
                    <h2 className="text-3xl font-bold font-serif-display text-yellow-300 mb-2">{inspectingRelic.name}</h2>
                    <p className="text-gray-400 mb-8 h-20 overflow-y-auto">{inspectingRelic.description}</p>
                    
                    <motion.button
                        onClick={() => handleConfirmSelection(inspectingRelic.id)}
                        className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-xl text-lg uppercase tracking-widest transition-all shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Select this Relic
                    </motion.button>
                    <button onClick={() => setInspectingRelic(null)} className="mt-4 text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest">Close</button>
                </motion.div>
              </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

export default RewardScreen;
