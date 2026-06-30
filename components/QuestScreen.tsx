import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { audioManager } from '../services/audioManager';
import { Quest } from '../types';

interface QuestScreenProps {
    onBack: () => void;
}

const QuestScreen: React.FC<QuestScreenProps> = ({ onBack }) => {
    const { activeQuests, _setState } = useStore();

    const handleClaim = (questId: string) => {
        const state = useStore.getState();
        const quest = state.activeQuests.find(q => q.id === questId);
        if (!quest || !quest.isCompleted || quest.isClaimed) return;

        audioManager.playSound('coin-pickup');

        const newQuests = state.activeQuests.map(q => 
            q.id === questId ? { ...q, isClaimed: true } : q
        );
        
        let newTotalCurrency = state.totalCurrency;
        let newRelicCurrency = state.relicCurrency;
        const newUnlockedCustomizations = { ...state.unlockedCustomizations };

        if (quest.reward.type === 'shards') {
            newTotalCurrency += (quest.reward.value as number);
        } else if (quest.reward.type === 'relics') {
            newRelicCurrency += (quest.reward.value as number);
        } else if (quest.reward.type === 'customization') {
            const type = quest.reward.id as 'cardBacks' | 'tableFelts' | 'shoeDesigns' | 'deckDesigns';
            if (newUnlockedCustomizations[type] && !newUnlockedCustomizations[type]!.includes(quest.reward.value as string)) {
                newUnlockedCustomizations[type] = [...newUnlockedCustomizations[type]!, quest.reward.value as string];
            }
        }

        _setState({
            activeQuests: newQuests,
            totalCurrency: newTotalCurrency,
            relicCurrency: newRelicCurrency,
            unlockedCustomizations: newUnlockedCustomizations
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-8"
        >
            <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar" style={{ touchAction: 'auto', overscrollBehavior: 'contain' }}>
                <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
                    <h2 className="text-3xl md:text-5xl font-black text-amber-500 uppercase tracking-tighter">Quests</h2>
                    <button onClick={() => { audioManager.playSound('button-click'); onBack(); }} className="text-stone-500 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {activeQuests.map(quest => (
                        <div key={quest.id} className={`p-4 rounded-xl border ${quest.isClaimed ? 'bg-stone-900/50 border-stone-800 opacity-50' : quest.isCompleted ? 'bg-green-900/20 border-green-500/50' : 'bg-stone-800/50 border-stone-700'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-stone-200">{quest.description}</h3>
                                <div className="mt-2 w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-700">
                                    <div 
                                        className={`h-full ${quest.isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}
                                        style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-stone-400 mt-1 font-mono">{quest.progress} / {quest.target}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 min-w-[150px] justify-end">
                                <div className="text-right">
                                    <p className="text-[10px] text-stone-500 uppercase font-black tracking-widest">Reward</p>
                                    <p className="text-sm font-bold text-amber-400">
                                        {quest.reward.type === 'shards' ? `${quest.reward.value} Shards` : 
                                         quest.reward.type === 'relics' ? `${quest.reward.value} Gold` : 
                                         `Customization: ${quest.reward.value}`}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={() => handleClaim(quest.id)}
                                    disabled={!quest.isCompleted || quest.isClaimed}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                                        quest.isClaimed ? 'bg-stone-800 text-stone-600' :
                                        quest.isCompleted ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
                                        'bg-stone-700 text-stone-400'
                                    }`}
                                >
                                    {quest.isClaimed ? 'Claimed' : 'Claim'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default QuestScreen;
