
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RelicId } from '../types';
import { RELICS } from '../game/relics';
import { useStore } from '../store/useStore';
import RelicAsset from './RelicAsset';
import { audioManager } from '../services/audioManager';
import { hapticManager } from '../services/hapticManager';

interface RelicForgeScreenProps {
  onBack: () => void;
}

const FORGE_COST = 25;

// Define forging recipes
const FORGE_RECIPES: Record<string, RelicId> = {
    [`${RelicId.GoldenKnuckles}_${RelicId.SharpeningStone}`]: RelicId.GoldenGauntlets,
    [`${RelicId.VampiricFangs}_${RelicId.FirstAidKit}`]: RelicId.VampiricCrown,
    [`${RelicId.GamblersChip}_${RelicId.JadeFigurine}`]: RelicId.SovereignsChip,
};

const getRecipeResult = (relic1Id: RelicId, relic2Id: RelicId): RelicId | null => {
    const key1 = `${relic1Id}_${relic2Id}`;
    const key2 = `${relic2Id}_${relic1Id}`;
    return FORGE_RECIPES[key1] || FORGE_RECIPES[key2] || null;
}

const RelicForgeScreen: React.FC<RelicForgeScreenProps> = ({ onBack }) => {
    const { relicCurrency, unlockedRelicIds, forgeRelic } = useStore();
    const [selection1, setSelection1] = useState<RelicId | null>(null);
    const [selection2, setSelection2] = useState<RelicId | null>(null);
    const [forgedRelic, setForgedRelic] = useState<RelicId | null>(null);
    const [error, setError] = useState<string | null>(null);

    const availableRelics = useMemo(() => {
        return Object.values(RELICS).filter(r => unlockedRelicIds.includes(r.id) && !r.isForged);
    }, [unlockedRelicIds]);

    const recipeResult = useMemo(() => {
        if (!selection1 || !selection2) return null;
        return getRecipeResult(selection1, selection2);
    }, [selection1, selection2]);

    const canForge = recipeResult && relicCurrency >= FORGE_COST;

    const handleSelectRelic = (relicId: RelicId) => {
        if (relicId === selection1 || relicId === selection2) return; // Can't select the same relic twice
        
        if (forgedRelic) setForgedRelic(null); // Clear previous result when starting a new forge
        
        if (!selection1) setSelection1(relicId);
        else if (!selection2) setSelection2(relicId);
    };
    
    const handleForge = () => {
        if (!canForge || !selection1 || !selection2 || !recipeResult) {
            setError("Invalid combination or insufficient funds.");
            return;
        }
        
        audioManager.playSound('relic-acquire');
        
        const success = forgeRelic(selection1, selection2, recipeResult, FORGE_COST);
        if (success) {
            setForgedRelic(recipeResult);
            setSelection1(null);
            setSelection2(null);
        } else {
            setError("Forge failed. Please try again.");
        }
    };
    
    const clearSelections = () => {
        setSelection1(null);
        setSelection2(null);
        setForgedRelic(null);
        setError(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full h-full flex flex-col items-center pt-12 text-white px-4 overflow-y-auto custom-scrollbar pb-12"
        >
            <div className="text-center mb-6">
                <h1 className="text-6xl font-bold font-serif-display text-orange-500">Relic Forge</h1>
                <p className="text-gray-400">Combine two relics to create a masterpiece.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-4xl p-4 bg-black/30 rounded-2xl mb-4">
                {/* Selection Slots */}
                <div className="flex gap-4">
                   <ForgeSlot relicId={selection1} onClear={() => { setSelection1(null); setForgedRelic(null); }} />
                   <div className="flex items-center justify-center text-4xl font-bold text-gray-500">+</div>
                   <ForgeSlot relicId={selection2} onClear={() => { setSelection2(null); setForgedRelic(null); }} />
                </div>
                
                {/* Anvil/Forge Button */}
                <div className="flex flex-col items-center gap-2">
                    <motion.button 
                        onClick={handleForge} 
                        disabled={!canForge}
                        className="w-32 h-32 bg-gray-900 rounded-full border-4 border-orange-500/50 disabled:opacity-50 flex flex-col items-center justify-center text-center shadow-lg disabled:cursor-not-allowed"
                        whileHover={canForge ? { scale: 1.1, boxShadow: '0 0 20px #f97316' } : {}}
                    >
                        <span className="text-5xl">🔥</span>
                        <span className="text-xs font-bold uppercase">Forge</span>
                    </motion.button>
                    <span className="text-xs text-purple-400">Cost: {FORGE_COST} $RELIC</span>
                </div>

                {/* Result Slot */}
                <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl font-bold text-gray-500">→</div>
                </div>
                <ForgeSlot relicId={recipeResult || forgedRelic} isResult={true} />
            </div>
            
             {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* Relic Inventory */}
            <div className="w-full max-w-5xl bg-black/30 p-4 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Your Relics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {availableRelics.map(relic => (
                        <motion.div 
                            key={relic.id} 
                            onClick={() => handleSelectRelic(relic.id)}
                            className={`p-2 rounded-lg cursor-pointer transition-all ${selection1 === relic.id || selection2 === relic.id ? 'bg-gray-700 opacity-50' : 'bg-gray-800 hover:bg-gray-700'}`}
                            whileTap={{ scale: 0.9 }}
                        >
                            <RelicAsset id={relic.id} />
                            <p className="text-xs text-center mt-1 truncate">{relic.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.button
                onClick={onBack}
                className="mt-6 px-8 py-3 bg-gray-800 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
            >
                Back to Armory
            </motion.button>
        </motion.div>
    );
};

const ForgeSlot = ({ relicId, onClear, isResult = false }: { relicId: RelicId | null, onClear?: () => void, isResult?: boolean }) => {
    const relic = relicId ? RELICS[relicId] : null;
    return (
        <div className="w-36 h-48 bg-black/50 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-2 relative">
            {relic ? (
                <AnimatePresence>
                    <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} className="text-center">
                        <RelicAsset id={relic.id} />
                        <h4 className="font-bold text-sm mt-2">{relic.name}</h4>
                        <p className="text-xs text-gray-400">{relic.description}</p>
                        {!isResult && onClear && (
                            <button onClick={onClear} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white font-bold">X</button>
                        )}
                    </motion.div>
                </AnimatePresence>
            ) : (
                <span className="text-gray-600 text-sm">{isResult ? '???' : 'Select a Relic'}</span>
            )}
        </div>
    )
}

export default RelicForgeScreen;