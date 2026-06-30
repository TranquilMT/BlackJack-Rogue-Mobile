
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { audioManager } from '../services/audioManager';
import { CardModifierId } from '../types';
import { Edit, ArrowLeft, ShoppingBag, Package } from 'lucide-react';

interface CustomizationShopScreenProps {
  onBack: () => void;
}

const shopItems = {
    cardBacks: [
        { id: 'default', name: 'Default Rogue', cost: 0, preview: 'bg-stone-900' },
        { id: 'royal', name: 'Royal Blue', cost: 250, preview: 'bg-blue-900' },
        { id: 'nebula', name: 'Nebula', cost: 500, preview: 'bg-indigo-900' },
        { id: 'crimson', name: 'Crimson Pact', cost: 750, preview: 'bg-red-900' },
        { id: 'emerald', name: 'Emerald Envy', cost: 750, preview: 'bg-emerald-900' },
        { id: 'golden', name: 'Midas Touch', cost: 1500, preview: 'bg-yellow-600' },
        { id: 'void', name: 'Void Walker', cost: 2000, preview: 'bg-black border border-purple-500' },
        { id: 'cyber', name: 'Cyber Grid', cost: 1200, preview: 'bg-cyan-900' },
        { id: 'runic', name: 'Ancient Runes', cost: 1000, preview: 'bg-stone-700' },
        { id: 'dragon', name: 'Dragon Scale', cost: 1800, preview: 'bg-orange-800' },
    ],
    tableFelts: [
        { id: 'green', name: 'Classic Green', cost: 0, preview: 'bg-green-900' },
        { id: 'blue', name: 'Cool Blue', cost: 300, preview: 'bg-blue-900' },
        { id: 'red', name: 'High-Stakes Red', cost: 300, preview: 'bg-red-900' },
        { id: 'purple', name: 'Royal Velvet', cost: 600, preview: 'bg-purple-900' },
        { id: 'black', name: 'Midnight Void', cost: 800, preview: 'bg-black' },
        { id: 'wood', name: 'Tavern Wood', cost: 500, preview: 'bg-amber-900' },
        { id: 'stone', name: 'Dungeon Stone', cost: 500, preview: 'bg-stone-800' },
        { id: 'galaxy', name: 'Cosmic Dust', cost: 1500, preview: 'bg-indigo-950' },
        { id: 'blood', name: 'Blood Moon', cost: 1200, preview: 'bg-rose-950' },
        { id: 'gold', name: 'Gilded Table', cost: 2500, preview: 'bg-yellow-700' },
    ],
    shoeDesigns: [
        { id: 'default', name: 'Standard Shoe', cost: 0, preview: 'bg-stone-800' },
        { id: 'mahogany', name: 'Mahogany', cost: 400, preview: 'bg-red-950' },
        { id: 'ivory', name: 'Ivory', cost: 800, preview: 'bg-stone-200' },
        { id: 'obsidian', name: 'Obsidian', cost: 1200, preview: 'bg-black border border-stone-600' },
        { id: 'crystal', name: 'Crystal', cost: 2000, preview: 'bg-cyan-200/50' },
    ],
    deckDesigns: [
        { id: 'default', name: 'Standard Deck', cost: 0, preview: 'bg-white' },
        { id: 'faded', name: 'Faded Vintage', cost: 300, preview: 'bg-amber-100' },
        { id: 'dark', name: 'Dark Mode', cost: 600, preview: 'bg-stone-900 text-white' },
        { id: 'neon', name: 'Neon Lights', cost: 1000, preview: 'bg-black border-neon-green' },
        { id: 'gold_leaf', name: 'Gold Leaf', cost: 2500, preview: 'bg-yellow-100 border-yellow-500' },
    ]
};

const MODIFIER_CARDS = Object.values(CardModifierId);

const CustomizationShopScreen: React.FC<CustomizationShopScreenProps> = ({ onBack }) => {
  const { totalCurrency, customization, unlockedCustomizations, updateCustomization, unlockCustomization, addCurrency, unlockedModifierCardIds, _setState } = useStore();
  const [activeTab, setActiveTab] = useState<'cosmetics' | 'lootbox'>('cosmetics');
  const [lootboxResult, setLootboxResult] = useState<CardModifierId | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const LOOTBOX_COST = 500;

  const handlePurchase = (type: 'cardBacks' | 'tableFelts' | 'shoeDesigns' | 'deckDesigns', id: string, cost: number) => {
    if (totalCurrency >= cost) {
        audioManager.playSound('coin-pickup');
        addCurrency(-cost);
        unlockCustomization(type, id);
    }
  };
  
  const handleEquip = (type: 'cardBack' | 'tableFelt' | 'shoeDesign' | 'deckDesign', id: string) => {
    audioManager.playSound('button-click');
    updateCustomization({ [type]: id });
  };

  const handleLootboxBuy = () => {
      const { totalCurrency, unlockedModifierCardIds, _setState, addCurrency } = useStore.getState();
      console.log('Lootbox buy clicked', { totalCurrency, LOOTBOX_COST, isSpinning });
      if (totalCurrency < LOOTBOX_COST || isSpinning) {
          console.log('Cannot buy: insufficient funds or already spinning');
          return;
      }
      
      addCurrency(-LOOTBOX_COST);
      setIsSpinning(true);
      audioManager.playSound('wheel-tick');

      setTimeout(() => {
          const { unlockedModifierCardIds: latestUnlocked } = useStore.getState();
          const lockedModifiers = MODIFIER_CARDS.filter(id => !latestUnlocked.includes(id));
          
          let result: CardModifierId;
          if (lockedModifiers.length > 0) {
             // 50% chance to get a new card if available, otherwise duplicate (shards refund)
             if (Math.random() > 0.5) {
                 result = lockedModifiers[Math.floor(Math.random() * lockedModifiers.length)];
                 _setState({ unlockedModifierCardIds: [...latestUnlocked, result] });
             } else {
                 result = MODIFIER_CARDS[Math.floor(Math.random() * MODIFIER_CARDS.length)];
                 if (latestUnlocked.includes(result)) {
                     // Refund partial
                     addCurrency(250);
                 }
             }
          } else {
              // All unlocked, just give a random one and refund
               result = MODIFIER_CARDS[Math.floor(Math.random() * MODIFIER_CARDS.length)];
               addCurrency(250);
          }
          
          setLootboxResult(result);
          setIsSpinning(false);
          audioManager.playSound('relic-acquire');
      }, 2000);
  };

  const renderCosmetics = () => (
      <div className="space-y-8 w-full max-w-6xl">
        {Object.entries(shopItems).map(([category, items]) => (
            <div key={category}>
                <h2 className="text-2xl font-bold text-yellow-500 mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h2>
                <div className="flex flex-wrap gap-4">
                    {items.map((item: any) => {
                         // @ts-ignore
                        const isUnlocked = unlockedCustomizations?.[category]?.includes(item.id) || item.cost === 0;
                         // @ts-ignore
                        const isEquipped = customization[category.slice(0, -1)] === item.id; // simple plural to singular hack
                        
                        return (
                            <div key={item.id} className="bg-stone-900/80 border border-stone-700 p-3 rounded-xl flex flex-col items-center group hover:border-yellow-500/50 transition-colors">
                                <div className={`w-full aspect-square rounded-lg mb-3 shadow-inner ${item.preview}`}></div>
                                <h3 className="font-bold text-sm text-stone-300 text-center mb-1">{item.name}</h3>
                                {isEquipped ? (
                                    <span className="text-xs font-black text-green-500 uppercase tracking-widest mt-auto">Equipped</span>
                                ) : isUnlocked ? (
                                    <button 
                                        onClick={() => handleEquip(category.slice(0, -1) as any, item.id)}
                                        className="w-full mt-auto py-2 bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold rounded uppercase tracking-widest"
                                    >
                                        Equip
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handlePurchase(category as any, item.id, item.cost)}
                                        disabled={totalCurrency < item.cost}
                                        className="w-full mt-auto py-2 bg-yellow-700 hover:bg-yellow-600 disabled:bg-stone-800 disabled:text-stone-600 text-black text-xs font-bold rounded uppercase tracking-widest"
                                    >
                                        {item.cost} Shards
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        ))}
      </div>
  );

  return (
    <div className="w-full min-h-full flex flex-col items-center pt-10 pb-10 px-4 bg-black text-white overflow-y-auto custom-scrollbar" style={{ touchAction: 'auto' }}>
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-4">
            <Edit className="w-10 h-10 text-yellow-500" />
            <div>
                <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">Customize Tab</p>
                <h1 className="text-4xl font-black font-serif-display text-white tracking-tighter">The Exchange</h1>
            </div>
          </div>
          <div className="text-right">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Balance</p>
              <p className="text-3xl font-black text-yellow-500">{totalCurrency} <span className="text-lg text-stone-600">SHARDS</span></p>
          </div>
      </div>

      <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('cosmetics')}
            className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${activeTab === 'cosmetics' ? 'bg-yellow-600 text-black' : 'bg-stone-900 text-stone-500 hover:text-stone-300'}`}
          >
              <ShoppingBag className="w-4 h-4" />
              Cosmetics
          </button>
          <button 
            onClick={() => setActiveTab('lootbox')}
            className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${activeTab === 'lootbox' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]' : 'bg-stone-900 text-stone-500 hover:text-stone-300'}`}
          >
              <Package className="w-4 h-4" />
              Void Chests
          </button>
      </div>

      {activeTab === 'cosmetics' ? renderCosmetics() : (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl bg-stone-900/50 border border-purple-900/30 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
              
              <h2 className="text-3xl font-black text-purple-400 uppercase tracking-tighter mb-2 relative z-10">Void Chest</h2>
              <p className="text-stone-400 text-center mb-8 max-w-md relative z-10">Open the chest to unlock powerful Modifier Cards. Duplicate cards will be refunded as Shards.</p>

              <div className="w-64 h-64 bg-black rounded-2xl border-4 border-purple-900 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(147,51,234,0.2)]">
                  {isSpinning ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                        className="text-6xl"
                      >
                          🌀
                      </motion.div>
                  ) : lootboxResult ? (
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-center"
                      >
                          <p className="text-5xl mb-2">🃏</p>
                          <p className="font-bold text-purple-300">{lootboxResult.replace('THE_', '')}</p>
                      </motion.div>
                  ) : (
                      <p className="text-6xl opacity-50">📦</p>
                  )}
              </div>

              <button 
                onClick={handleLootboxBuy}
                disabled={totalCurrency < LOOTBOX_COST || isSpinning}
                className="px-12 py-4 bg-purple-700 hover:bg-purple-600 disabled:bg-stone-800 disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-widest shadow-xl transition-all relative z-10"
              >
                  {isSpinning ? 'Opening...' : `Open Chest (${LOOTBOX_COST})`}
              </button>
              
              <div className="mt-8 grid grid-cols-5 gap-2 w-full opacity-50">
                  {MODIFIER_CARDS.map(id => (
                      <div key={id} className={`h-1 rounded-full ${unlockedModifierCardIds.includes(id) ? 'bg-purple-500' : 'bg-stone-800'}`} />
                  ))}
              </div>
              <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mt-2">{unlockedModifierCardIds.length} / {MODIFIER_CARDS.length} Unlocked</p>
          </div>
      )}

      <button
        onClick={onBack}
        className="mt-12 px-8 py-3 bg-stone-800 text-stone-400 font-bold rounded-full hover:bg-stone-700 transition-colors uppercase text-xs tracking-widest flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>
    </div>
  );
};

export default CustomizationShopScreen;