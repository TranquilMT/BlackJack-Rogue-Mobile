
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Potion } from '../types';
import { PotionId } from '../types';
import { POTIONS } from '../game/potions';
import { audioManager } from '../services/audioManager';
import { Tooltip } from './Tooltip';

interface PotionBeltProps {
  charges: number;
  onUsePotion: (potionId: PotionId) => void;
}

const PotionIcon = ({ potionId }: {potionId: PotionId}) => {
    const icons: Record<PotionId, string> = {
        [PotionId.HealingPotion]: '❤️', [PotionId.ShieldPotion]: '🛡️',
        [PotionId.CardPeeker]: '🔍', [PotionId.RagePotion]: '😡',
        [PotionId.PurificationPotion]: '💧', [PotionId.DeckStackerPotion]: '🃏',
        [PotionId.VoidPotion]: '🌌',
    };
    return <span className="text-xl drop-shadow-lg">{icons[potionId]}</span>;
}

const potionLabels: Record<PotionId, string> = {
    [PotionId.HealingPotion]: 'Heal', [PotionId.ShieldPotion]: 'Shield',
    [PotionId.CardPeeker]: 'Reveal', [PotionId.RagePotion]: 'Rage',
    [PotionId.PurificationPotion]: 'Purify', [PotionId.DeckStackerPotion]: 'Stack',
    [PotionId.VoidPotion]: 'Void',
};

const PotionBelt = React.memo(({ charges, onUsePotion }: PotionBeltProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const availablePotions = Object.values(POTIONS);

  return (
    <>
        {/* Mobile Toggle Button */}
        <div className="md:hidden absolute bottom-24 right-4 z-50">
             <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-12 h-12 bg-purple-900/90 rounded-full border-2 border-purple-400/50 flex items-center justify-center shadow-lg text-2xl"
                whileTap={{ scale: 0.9 }}
             >
                 🧪
             </motion.button>
             <div className="absolute -top-2 -right-2 bg-black/80 text-purple-300 text-xs font-bold px-1.5 py-0.5 rounded-full border border-purple-500/30">
                 {charges}
             </div>
        </div>

        {/* Expanded Modal for Mobile */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="md:hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setIsExpanded(false)}
                >
                    <div className="bg-stone-900 border-2 border-purple-500/50 rounded-xl p-4 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-purple-300 font-serif-display uppercase tracking-widest">Potions ({charges})</h3>
                            <button onClick={() => setIsExpanded(false)} className="text-stone-400 hover:text-white">✕</button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {availablePotions.map((potion) => (
                                <div key={potion.id} className="flex flex-col items-center">
                                    <motion.button
                                        onClick={() => { 
                                            audioManager.playSound('potion-use'); 
                                            onUsePotion(potion.id); 
                                            setIsExpanded(false);
                                        }}
                                        disabled={charges <= 0}
                                        className="w-14 h-14 bg-gray-800 rounded-full border border-purple-400/30 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:grayscale"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <PotionIcon potionId={potion.id} />
                                    </motion.button>
                                    <span className="text-[10px] text-stone-400 mt-1 text-center leading-tight">{potionLabels[potion.id]}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-stone-500 text-center italic">
                            Tap to use. Costs 1 Charge.
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Desktop View (Original) */}
        <div className="hidden md:flex potion-belt-highlight absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex-col items-center gap-2">
           <div className="flex gap-2">
            {availablePotions.map((potion) => (
                <Tooltip
                    key={potion.id}
                    side="top"
                    content={
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-purple-300">{potion.name}</h3>
                            <p className="text-sm text-gray-300">{potion.description}</p>
                        </div>
                    }
                >
                    <div className="relative flex flex-col items-center">
                        <p className="text-white text-xs font-semibold mb-1 pointer-events-none h-4">{potionLabels[potion.id]}</p>
                        <motion.button
                            onClick={() => { audioManager.playSound('potion-use'); onUsePotion(potion.id); }}
                            disabled={charges <= 0}
                            className="w-14 h-14 bg-gray-900/70 rounded-full border-2 border-purple-400/30 flex items-center justify-center cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-500/50 hover:border-purple-400/70 transition-colors"
                            whileHover={{ scale: charges > 0 ? 1.1 : 1, y: charges > 0 ? -5 : 0 }}
                            whileTap={{ scale: charges > 0 ? 0.95 : 1}}
                            transition={{ type: 'spring', stiffness: 300, damping: 15}}
                        >
                            <PotionIcon potionId={potion.id} />
                        </motion.button>
                    </div>
                </Tooltip>
            ))}
           </div>
           <div className="bg-black/70 px-3 py-1 rounded-full text-white font-bold text-lg border border-white/10">
               Charges: <span className="text-purple-300">{charges}</span>
           </div>
        </div>
    </>
  );
});

export default PotionBelt;