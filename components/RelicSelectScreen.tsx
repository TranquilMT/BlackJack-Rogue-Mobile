import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RelicId } from '../types';
import { RELICS } from '../game/relics';
import RelicAsset from './RelicAsset';
import { useStore } from '../store/useStore';
import { audioManager } from '../services/audioManager';

interface RelicSelectScreenProps {
  onSelect: (relicId: RelicId | null) => void;
  onBack: () => void;
}

const RelicSelectScreen: React.FC<RelicSelectScreenProps> = ({ onSelect, onBack }) => {
  const { unlockedRelicIds, customization, unlockedCustomizations, updateCustomization } = useStore();
  const availableRelics = Object.values(RELICS).filter(r => unlockedRelicIds.includes(r.id));
  const [selectedRelic, setSelectedRelic] = useState<RelicId | null>(null);

  const handleStart = () => {
    try {
      console.log('RelicSelectScreen handleStart', { selectedRelic });
      audioManager.playSound('button-click');
      onSelect(selectedRelic);
    } catch (error) {
      console.error('Error in handleStart:', error);
    }
  };

  console.log('RelicSelectScreen render', { selectedRelic, availableRelics });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] flex flex-col items-center pt-8 text-white px-4 overflow-y-auto custom-scrollbar pb-12 bg-black/90 backdrop-blur-md pointer-events-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold font-serif-display text-amber-500">Prepare for the Run</h1>
        <p className="text-gray-400 mt-2">Select your heirloom.</p>
      </div>

      <div className="w-full max-w-5xl bg-black/30 p-6 rounded-xl border border-white/5">
        <h2 className="text-xl font-black text-stone-500 uppercase tracking-widest mb-4">Starting Relic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <motion.div
            onClick={() => setSelectedRelic(null)}
            className={`p-4 rounded-xl cursor-pointer transition-all border-2 flex flex-col items-center justify-center min-h-[120px] ${
              selectedRelic === null ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-gray-800 border-transparent hover:bg-gray-700'
            }`}
            whileHover={{ y: -5, backgroundColor: selectedRelic === null ? 'rgba(120, 53, 15, 0.5)' : 'rgba(55, 65, 81, 1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl mb-2">🚫</div>
            <h3 className="font-bold text-sm text-center">No Relic</h3>
            <p className="text-xs text-gray-500 text-center mt-1">A true challenge.</p>
          </motion.div>

          {availableRelics.map(relic => (
            <motion.div
              key={relic.id}
              onClick={() => setSelectedRelic(relic.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border-2 flex flex-col items-center min-h-[120px] ${
                selectedRelic === relic.id ? 'bg-amber-900/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-gray-800 border-transparent hover:bg-gray-700'
              }`}
              whileHover={{ y: -5, backgroundColor: selectedRelic === relic.id ? 'rgba(120, 53, 15, 0.5)' : 'rgba(55, 65, 81, 1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <RelicAsset id={relic.id} width={40} height={40} />
              <h3 className="font-bold text-sm text-center mt-2">{relic.name}</h3>
              <p className="text-xs text-gray-400 text-center mt-1 line-clamp-3">{relic.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent flex justify-center gap-4 z-[120]">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="px-8 py-3 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-colors pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handleStart();
          }}
          className="px-8 py-3 bg-amber-600 rounded-lg font-bold text-black hover:bg-amber-500 transition-colors pointer-events-auto shadow-lg shadow-amber-900/20 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Embark
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RelicSelectScreen;
