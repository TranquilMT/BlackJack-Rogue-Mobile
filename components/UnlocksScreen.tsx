import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Relic } from '../types';
import { RelicId } from '../types';
import { RELICS } from '../game/relics';
import { useStore } from '../store/useStore';
import RelicAsset from './RelicAsset';
import { audioManager } from '../services/audioManager';

interface UnlocksScreenProps {
  onBack: () => void;
  onGoToForge: () => void;
}

const RELIC_UNLOCK_COST = 10; 

const UnlocksScreen: React.FC<UnlocksScreenProps> = ({ onBack, onGoToForge }) => {
  const { relicCurrency, unlockedRelicIds, _setState } = useStore();
  const [inspectingRelic, setInspectingRelic] = useState<Relic | null>(null);

  const safeUnlockedRelicIds = unlockedRelicIds || [];

  const handleUnlockRelic = (relicId: RelicId) => {
    if (relicCurrency >= RELIC_UNLOCK_COST && !safeUnlockedRelicIds.includes(relicId)) {
      audioManager.playSound('relic-acquire');
      _setState({
        ...useStore.getState(),
        relicCurrency: relicCurrency - RELIC_UNLOCK_COST,
        unlockedRelicIds: [...safeUnlockedRelicIds, relicId],
      });
      setInspectingRelic(null); // Close modal on success
    }
  };

  const allRelics = Object.values(RELICS).filter(r => !r.isForged);
  
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = (relic: Relic) => {
    const isUnlocked = safeUnlockedRelicIds.includes(relic.id);
    if (isUnlocked) return;
    
    pressTimer.current = setTimeout(() => {
        setInspectingRelic(relic);
    }, 400); // 400ms for a hold
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="w-full h-full flex flex-col items-center pt-16 md:pt-24 text-white overflow-y-auto custom-scrollbar px-4 pb-32"
    >
      <div className="text-center mb-8 relative">
          <div className="absolute -inset-8 bg-yellow-500/5 blur-[40px] rounded-full" />
          <h1 className="text-6xl font-bold font-serif-display text-yellow-400 mb-2 drop-shadow-2xl tracking-tighter">The Armory</h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-bold">Forge your path to victory</p>
      </div>
      
       <motion.button
          onClick={onGoToForge}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-700 text-white font-black rounded-2xl text-lg uppercase tracking-widest border-2 border-orange-400/50 shadow-[0_0_30px_rgba(234,88,12,0.4)]"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
      >
          Go to Relic Forge 🔥
      </motion.button>
      
      <div className="flex gap-8 mb-6 w-full max-w-4xl">
          <div className="flex-1 bg-black/60 p-6 rounded-3xl border border-white/5 backdrop-blur-xl flex items-center justify-between shadow-2xl">
              <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available Credits</p>
                  <p className="text-3xl font-black text-purple-400">{relicCurrency} <span className="text-xs opacity-50">$RELIC</span></p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <span className="text-2xl">💎</span>
              </div>
          </div>
          <div className="flex-1 bg-black/60 p-6 rounded-3xl border border-white/5 backdrop-blur-xl flex items-center justify-between shadow-2xl">
              <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Relics Mastered</p>
                  <p className="text-3xl font-black text-yellow-500">{safeUnlockedRelicIds.filter(id => !RELICS[id]?.isForged).length} / {allRelics.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                  <span className="text-2xl">🛡️</span>
              </div>
          </div>
      </div>
      
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {allRelics.map(relic => {
            const isUnlocked = safeUnlockedRelicIds.includes(relic.id);
            const canAfford = relicCurrency >= RELIC_UNLOCK_COST;

            return (
              <motion.div 
                key={relic.id} 
                whileHover={{ y: -5, scale: 1.02 }}
                className={`relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border-2 transition-all duration-500 select-none ${isUnlocked ? 'border-yellow-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'border-white/5 opacity-80 cursor-pointer'}`}
                onPointerDown={() => handlePointerDown(relic)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {!isUnlocked && (
                    <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-gray-400">LOCKED</div>
                )}
                <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${isUnlocked ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-black border-white/5'}`}>
                        <RelicAsset id={relic.id} width={40} height={40} className={isUnlocked ? 'opacity-100' : 'opacity-20 grayscale'} />
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold font-serif-display ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{relic.name}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1 h-8 overflow-hidden">{relic.description}</p>
                    </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    {isUnlocked ? (
                        <div className="flex items-center gap-2 text-green-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Permanent Unlocked</span>
                            <span className="text-lg">✓</span>
                        </div>
                    ) : (
                        <>
                            <div className={`text-[10px] font-bold uppercase ${canAfford ? 'text-purple-400' : 'text-red-500'}`}>Cost: {RELIC_UNLOCK_COST} $RELIC</div>
                            <div className="px-4 py-2 bg-gray-800 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold">
                                Hold to Inspect
                            </div>
                        </>
                    )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-[100]">
        <motion.button
          onClick={onBack}
          className="px-16 py-5 bg-gray-900 border border-white/20 text-white font-black rounded-2xl hover:bg-gray-800 uppercase text-sm tracking-[0.2em] shadow-2xl backdrop-blur-xl"
          whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Main Menu
        </motion.button>
      </div>
      
      <AnimatePresence>
        {inspectingRelic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
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
                    onClick={() => handleUnlockRelic(inspectingRelic.id)}
                    disabled={relicCurrency < RELIC_UNLOCK_COST}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-black rounded-xl text-lg uppercase tracking-widest transition-all shadow-xl"
                    whileHover={{ scale: relicCurrency >= RELIC_UNLOCK_COST ? 1.05 : 1 }}
                    whileTap={{ scale: relicCurrency >= RELIC_UNLOCK_COST ? 0.95 : 1 }}
                >
                    {relicCurrency >= RELIC_UNLOCK_COST ? `Unlock for ${RELIC_UNLOCK_COST} $RELIC` : 'Insufficient Credits'}
                </motion.button>
                <button onClick={() => setInspectingRelic(null)} className="mt-4 text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UnlocksScreen;