
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RELICS } from '../game/relics';
import { POTIONS } from '../game/potions';
import { SYNERGIES } from '../game/synergies';
import RelicAsset from './RelicAsset';
import { useStore } from '../store/useStore';
import { CardModifierId } from '../types';

interface CompendiumScreenProps {
  onBack: () => void;
}

type CompendiumTab = 'Relics' | 'Potions' | 'Synergies' | 'Modifiers';

const MODIFIER_INFO: Record<CardModifierId, { name: string; description: string }> = {
    [CardModifierId.THE_REAPER]: { name: 'The Reaper', description: 'Value <span class="font-rogue-number">10</span>. Deals <span class="font-rogue-number">6</span> damage to opponent on play.' },
    [CardModifierId.THE_GUARDIAN]: { name: 'The Guardian', description: 'Value <span class="font-rogue-number">10</span>. Grants <span class="font-rogue-number">5</span> Shield on play.' },
    [CardModifierId.THE_JESTER]: { name: 'The Jester', description: 'Value <span class="font-rogue-number">5</span>. Rerolls your hand on play.' },
    [CardModifierId.THE_ABYSS]: { name: 'The Abyss', description: 'Value <span class="font-rogue-number">1</span>. Discards opponent\'s last card.' },
    [CardModifierId.THE_BERSERKER]: { name: 'The Berserker', description: 'Value <span class="font-rogue-number">8</span>. Deals double damage if you are below <span class="font-rogue-number">50</span>% HP.' },
    [CardModifierId.THE_ALCHEMIST]: { name: 'The Alchemist', description: 'Value <span class="font-rogue-number">6</span>. Transmutes a random card in hand to Gold.' },
    [CardModifierId.THE_ORACLE]: { name: 'The Oracle', description: 'Value <span class="font-rogue-number">1</span>/<span class="font-rogue-number">11</span>. Reveals the next card in the deck.' },
    [CardModifierId.THE_VAMPIRE]: { name: 'The Vampire', description: 'Value <span class="font-rogue-number">5</span>. Drains <span class="font-rogue-number">5</span> HP from opponent and heals you.' },
    [CardModifierId.THE_VOIDWALKER]: { name: 'The Voidwalker', description: 'Value <span class="font-rogue-number">1</span>. Ignores shields when attacking.' },
    [CardModifierId.THE_TIMEWARP]: { name: 'The Timewarp', description: 'Value <span class="font-rogue-number">10</span>. Grants an extra turn.' },
    [CardModifierId.THE_MAGNET]: { name: 'The Magnet', description: 'Value <span class="font-rogue-number">7</span>. Draws a card from the discard pile.' },
    [CardModifierId.THE_SUN]: { name: 'The Sun', description: 'Value <span class="font-rogue-number">10</span>. Fully heals you.' },
    [CardModifierId.THE_JUDGEMENT]: { name: 'The Judgement', description: 'Value <span class="font-rogue-number">10</span>. Deals damage equal to <span class="font-rogue-number">2</span>x your current hand score on play.' },
    [CardModifierId.THE_TOWER]: { name: 'The Tower', description: 'Value <span class="font-rogue-number">8</span>. Grants <span class="font-rogue-number">30</span> Shield but reduces permanent damage by <span class="font-rogue-number">1</span>.' },
    [CardModifierId.THE_STAR]: { name: 'The Star', description: 'Value <span class="font-rogue-number">7</span>. Increases Crit Chance by <span class="font-rogue-number">10</span>% for the current floor.' },
    [CardModifierId.THE_MOON]: { name: 'The Moon', description: 'Value <span class="font-rogue-number">9</span>. Intimidates the Dealer, potentially skipping their turn.' },
    [CardModifierId.THE_EMPEROR]: { name: 'The Emperor', description: 'Value <span class="font-rogue-number">10</span>. Grants <span class="font-rogue-number">20</span> Shield and deals <span class="font-rogue-number">10</span> damage.' },
    [CardModifierId.THE_EMPRESS]: { name: 'The Empress', description: 'Value <span class="font-rogue-number">10</span>. Heals <span class="font-rogue-number">15</span> HP and grants <span class="font-rogue-number">10</span> Shield.' },
};

const CompendiumScreen: React.FC<CompendiumScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<CompendiumTab>('Relics');
  const { unlockedModifierCardIds } = useStore();
  
  const relics = Object.values(RELICS);
  const potions = Object.values(POTIONS);
  const synergies = Object.values(SYNERGIES);
  const modifiers = Object.entries(MODIFIER_INFO).map(([id, info]) => ({ id, ...info }));

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const renderItem = (item: any) => {
      if (activeTab === 'Relics') {
          return (
              <div className="flex items-start gap-4">
                  <RelicAsset id={item.id} width={40} height={40} />
                  <div>
                      <h3 className="text-xl font-bold text-yellow-300">{item.name}</h3>
                      <p className="text-gray-300 mt-1" dangerouslySetInnerHTML={{ __html: item.description }} />
                  </div>
              </div>
          )
      } else if (activeTab === 'Modifiers') {
          const isUnlocked = unlockedModifierCardIds.includes(item.id as CardModifierId);
          return (
              <div className={`flex flex-col ${isUnlocked ? '' : 'opacity-30 grayscale'}`}>
                  <div className="flex justify-between items-center mb-2">
                       <h3 className={`text-xl font-bold ${isUnlocked ? 'text-purple-400' : 'text-stone-500'}`}>
                           {isUnlocked ? item.name : '???'}
                       </h3>
                       {!isUnlocked && <span className="text-xs uppercase font-bold text-stone-600">Locked</span>}
                  </div>
                  <p className="text-stone-300 text-sm" dangerouslySetInnerHTML={{ __html: isUnlocked ? item.description : 'Unlock via Void Chests in the Exchange.' }} />
              </div>
          )
      } else {
          const color = activeTab === 'Potions' ? 'purple' : 'cyan';
          return (
              <div className={`border-l-4 border-${color}-400 pl-4`}>
                  <h3 className={`text-xl font-bold text-${color}-300`}>{item.name}</h3>
                  <p className="text-gray-300 mt-1" dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
          )
      }
  }

  const getItems = () => {
      switch(activeTab) {
          case 'Relics': return relics;
          case 'Potions': return potions;
          case 'Synergies': return synergies;
          case 'Modifiers': return modifiers;
          default: return [];
      }
  }

  return (
    <motion.div
      key="compendium"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col items-center text-white pt-16 md:pt-24 px-4 overflow-y-auto custom-scrollbar pb-12"
    >
      <motion.h1 variants={itemVariants} className="text-5xl font-bold font-serif-display text-cyan-400 mb-8">Compendium</motion.h1>
      
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-6 bg-black/30 p-2 rounded-lg">
          {(['Relics', 'Potions', 'Synergies', 'Modifiers'] as CompendiumTab[]).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm md:text-lg font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
              >
                  {tab}
              </button>
          ))}
      </motion.div>

      <motion.div variants={itemVariants} className="w-full max-w-4xl bg-black/40 p-4 rounded-lg">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {getItems().map((item: any) => (
                    <div key={item.name || item.id} className="bg-gray-800/50 p-4 rounded-lg border border-white/5">
                        {renderItem(item)}
                    </div>
                ))}
            </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="mt-8 px-8 py-3 bg-gray-700 text-white font-bold rounded-md shadow-lg hover:bg-gray-600 transition-colors uppercase text-xs tracking-widest"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Main Menu
      </motion.button>
    </motion.div>
  );
};

export default CompendiumScreen;