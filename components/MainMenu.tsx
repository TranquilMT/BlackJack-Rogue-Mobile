import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnlocksScreen from './UnlocksScreen';
import CompendiumScreen from './CompendiumScreen';
import SettingsScreen from './SettingsScreen';
import CustomizationShopScreen from './CustomizationShopScreen';
import type { MetaState, GameMode } from '../types';
import { RelicId } from '../types';
import AchievementsScreen from './AchievementsScreen';
import RunHistoryScreen from './RunHistoryScreen';
import { audioManager } from '../services/audioManager';
import { useStore } from '../store/useStore';
import LeaderboardScreen from './LeaderboardScreen';
import { hapticManager } from '../services/hapticManager';
import RoadmapScreen from './RoadmapScreen';
import RelicForgeScreen from './RelicForgeScreen';
import RelicSelectScreen from './RelicSelectScreen';
import { Palette } from 'lucide-react';

import QuestScreen from './QuestScreen';

interface MainMenuProps {
  onPlay: (startingRelicId?: RelicId | null, mode?: GameMode) => void;
  onStartTutorial: (returnMode?: GameMode) => void;
  onEnterMultiplayer: () => void;
  setShowPatchNotes: (show: boolean) => void;
  onOpenSkillTree: () => void;
}

type MenuView = 'main' | 'unlocks' | 'compendium' | 'settings' | 'relicSelect' | 'achievements' | 'runHistory' | 'shop' | 'leaderboard' | 'roadmap' | 'relicForge' | 'quests';

const DashboardButton: React.FC<{ 
    label: string, 
    icon: React.ReactNode, 
    onClick: () => void, 
    delay: number, 
    colorClass?: string,
    size?: 'large' | 'normal' | 'wide',
    badge?: string
}> = ({ label, icon, onClick, delay, colorClass = "bg-stone-900 border-stone-800 text-stone-300", size = 'normal', badge }) => (
    <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
        whileHover={{ 
            scale: 1.05, 
            transition: { type: 'spring', stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            audioManager.playSound('button-click');
            hapticManager.trigger('light');
            onClick();
        }}
        className={`rogue-menu-card relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border-2 transition-all group overflow-visible ${colorClass} ${size === 'large' ? 'col-span-2 row-span-2 md:text-2xl min-h-[180px] md:min-h-[220px]' : size === 'wide' ? 'col-span-2' : ''}`}
        style={{}}
    >
        {/* Hover Glitch Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
        <motion.div 
            className="absolute inset-0 border-2 border-white/20 opacity-0 group-hover:opacity-100 pointer-events-none"
            animate={{ 
                x: [0, -2, 2, -1, 0],
                opacity: [0, 0.5, 0.2, 0.8, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.2 }}
        />

        {/* Badge */}
        {badge && (
            <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[8px] md:text-[10px] px-2 py-1 font-black uppercase tracking-tighter z-20 shadow-lg transform rotate-12 animate-pulse">
                {badge}
            </div>
        )}

        <span className={`mb-2 md:mb-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] ${size === 'large' ? 'text-6xl md:text-8xl' : 'text-3xl md:text-4xl'}`}>{icon}</span>
        <span className={`font-black font-serif-display uppercase tracking-[0.2em] text-center pixel-text-shadow ${size === 'large' ? 'text-xl md:text-2xl' : 'text-[10px] md:text-[12px]'}`}>{label}</span>
        
        {/* Decorative Corner */}
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/10 transform translate-x-1/2 translate-y-1/2 rotate-45" />
    </motion.button>
);

const AnimatedBackground = () => (
    <>
        <div className="ken-burns-bg" />
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Red streaks */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`streak-${i}`}
                    className="absolute w-[1px] h-64 bg-gradient-to-b from-transparent via-red-600/30 to-transparent"
                    initial={{ 
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
                        y: -300,
                    }}
                    animate={{ 
                        y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 300,
                    }}
                    transition={{ 
                        duration: Math.random() * 5 + 5, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: Math.random() * 10
                    }}
                />
            ))}

            {/* Glitch horizontal lines */}
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={`glitch-${i}`}
                    className="absolute w-full h-[1px] bg-red-500/10"
                    initial={{ y: Math.random() * 100 + '%' }}
                    animate={{ 
                        opacity: [0, 0.2, 0],
                        scaleY: [1, 3, 1],
                    }}
                    transition={{ 
                        duration: 0.1, 
                        repeat: Infinity, 
                        repeatDelay: Math.random() * 20,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    </>
);

const QuestPreview = ({ quests, onClick }: { quests: any[], onClick: () => void }) => {
    const activeQuest = quests.find(q => !q.isClaimed);
    if (!activeQuest) return null;
    return (
        <motion.div 
            onClick={onClick}
            className="col-span-2 md:col-span-2 bg-stone-900/80 p-4 rounded-xl border border-stone-800 cursor-pointer hover:border-amber-500 transition-colors"
        >
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Active Quest</h3>
            <p className="text-lg font-bold text-white mt-1">{activeQuest.description}</p>
            <div className="mt-2 w-full bg-stone-950 rounded-full h-2 overflow-hidden">
                <div 
                    className="h-full bg-amber-500"
                    style={{ width: `${Math.min(100, (activeQuest.progress / activeQuest.target) * 100)}%` }}
                />
            </div>
        </motion.div>
    );
}

const MainMenu = ({ onPlay, onStartTutorial, onEnterMultiplayer, setShowPatchNotes, onOpenSkillTree }: MainMenuProps) => {
  const metaState = useStore();
  const { unlockedRelicIds = [], hasCompletedTutorial, totalCurrency, relicCurrency, runHistory = [], unlockedAchievementIds = [], setHasCompletedTutorial } = metaState;
  
  const [menuView, setMenuView] = useState<MenuView>('main');
  const [showTutorialPrompt, setShowTutorialPrompt] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>('endless');
  
  const handleStartRunClick = (mode: GameMode) => {
      setSelectedMode(mode);
      if (mode === 'campaign' && (!hasCompletedTutorial || runHistory.length === 0)) {
          setShowTutorialPrompt(true);
      } else {
          proceedToGameSetup(mode);
      }
  };

  const proceedToGameSetup = (mode: GameMode) => {
      setMenuView('relicSelect');
  };

  return (
    <div className="relative w-full h-full flex flex-col z-50 text-stone-200 rogue-backdrop overflow-hidden">
      <AnimatedBackground />
      
      {/* Top Bar - Fixed height to allow scrolling below */}
      <motion.div 
        className="relative z-50 flex justify-between items-center p-4 md:p-8 shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
          <div className="flex flex-col">
              <motion.h1 
                className="text-2xl md:text-5xl font-black font-serif-display text-white tracking-tighter uppercase relative"
                animate={{ 
                    textShadow: [
                        '0 0 10px rgba(220,38,38,0.5)',
                        '0 0 20px rgba(220,38,38,0.8)',
                        '0 0 10px rgba(220,38,38,0.5)'
                    ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Blackjack <span className="text-red-600">Rogue</span>
                <motion.div 
                    className="absolute -inset-1 bg-red-600/10 blur-xl z-[-1]"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                />
              </motion.h1>
              <span className="text-[10px] md:text-[12px] text-red-900 uppercase tracking-[0.4em] font-black mt-1">Season 0: {metaState.currentSeason?.name}</span>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
              <div className="flex flex-col items-end">
                 <p className="text-[9px] font-black text-stone-700 uppercase tracking-widest">Shards</p>
                 <p className="text-amber-500 font-black text-lg md:text-2xl pixel-text-shadow font-rogue-number">{totalCurrency}</p>
              </div>
              <div className="flex flex-col items-end cursor-pointer group" onClick={() => setMenuView('shop')}>
                 <p className="text-[9px] font-black text-stone-700 uppercase tracking-widest group-hover:text-stone-400 transition-colors">Custom</p>
                 <p className="text-stone-300 font-black text-lg md:text-2xl transform group-hover:scale-110 transition-transform">🎨</p>
              </div>
              <div className="flex flex-col items-end">
                 <p className="text-[9px] font-black text-stone-700 uppercase tracking-widest">Gold</p>
                 <p className="text-amber-600 font-black text-lg md:text-2xl pixel-text-shadow font-rogue-number">{relicCurrency}</p>
              </div>
          </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 pb-20" style={{ touchAction: 'auto', overscrollBehavior: 'contain' }}>
        <AnimatePresence mode="wait">
          {menuView === 'main' && !showTutorialPrompt && (
            <motion.div 
              key="main" 
              initial={{opacity:0}} 
              animate={{opacity:1}} 
              exit={{opacity:0}} 
              className="flex flex-col items-center py-8"
              style={{ touchAction: 'auto' }}
            >
              {/* Responsive Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 w-full max-w-6xl">
                  
                  <QuestPreview quests={metaState.activeQuests} onClick={() => setMenuView('quests')} />
                  
                  {/* Customization Preview */}
                  <div className="col-span-2 md:col-span-4 flex justify-center gap-6 mb-8">
                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
                          onClick={() => setMenuView('shop')}
                          className="rogue-panel flex items-center gap-3 px-4 py-2 cursor-pointer group transition-all rounded-xl"
                      >
                          <div className={`w-4 h-6 border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.8)] ${
                              metaState.customization.cardBack === 'royal' ? 'bg-blue-900' :
                              metaState.customization.cardBack === 'nebula' ? 'bg-indigo-900' :
                              metaState.customization.cardBack === 'crimson' ? 'bg-red-900' :
                              metaState.customization.cardBack === 'emerald' ? 'bg-emerald-900' :
                              metaState.customization.cardBack === 'golden' ? 'bg-yellow-600' :
                              metaState.customization.cardBack === 'void' ? 'bg-black border-purple-500' :
                              metaState.customization.cardBack === 'cyber' ? 'bg-cyan-900' :
                              metaState.customization.cardBack === 'runic' ? 'bg-stone-700' :
                              metaState.customization.cardBack === 'dragon' ? 'bg-orange-800' :
                              'bg-stone-800'
                          }`} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900 group-hover:text-red-500 transition-colors">{metaState.customization.cardBack}</span>
                      </motion.div>
                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
                          onClick={() => setMenuView('shop')}
                          className="rogue-panel flex items-center gap-3 px-4 py-2 cursor-pointer group transition-all rounded-xl"
                      >
                          <div className={`w-5 h-5 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.8)] ${
                              metaState.customization.tableFelt === 'blue' ? 'bg-blue-900' :
                              metaState.customization.tableFelt === 'red' ? 'bg-red-900' :
                              metaState.customization.tableFelt === 'purple' ? 'bg-purple-900' :
                              metaState.customization.tableFelt === 'black' ? 'bg-black' :
                              metaState.customization.tableFelt === 'wood' ? 'bg-amber-900' :
                              metaState.customization.tableFelt === 'stone' ? 'bg-stone-800' :
                              metaState.customization.tableFelt === 'galaxy' ? 'bg-indigo-950' :
                              metaState.customization.tableFelt === 'blood' ? 'bg-rose-950' :
                              metaState.customization.tableFelt === 'gold' ? 'bg-yellow-700' :
                              'bg-green-900'
                          }`} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-900 group-hover:text-red-500 transition-colors">{metaState.customization.tableFelt}</span>
                      </motion.div>
                  </div>

                {/* Play Buttons - Mobile Friendly App Store Style */}
                <div className="col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DashboardButton 
                        label="Endless Run" 
                        icon="♾️" 
                        onClick={() => handleStartRunClick('endless')} 
                        delay={0.1} 
                        size="wide"
                        colorClass="bg-stone-950 border-stone-600 text-stone-100 hover:bg-stone-900"
                    />
                    <DashboardButton 
                        label="Campaign" 
                        icon="📜" 
                        onClick={() => handleStartRunClick('campaign')} 
                        delay={0.15} 
                        size="wide"
                        badge="BETA"
                        colorClass="bg-red-950 border-red-600 text-red-100 hover:bg-red-900"
                    />
                </div>

                {/* Primary Actions */}
                <DashboardButton 
                    label="Multiplayer" 
                    icon="⚔️"
                    badge="BETA"
                    onClick={onEnterMultiplayer} 
                    delay={0.2} 
                    colorClass="bg-indigo-950 border-indigo-600 text-indigo-100 hover:bg-indigo-900" 
                />
                <DashboardButton label="The Armory" icon="🛡️" onClick={() => setMenuView('unlocks')} delay={0.3} colorClass="bg-stone-950 border-stone-800 text-stone-400 hover:border-amber-600 hover:text-amber-500" />
                <DashboardButton label="Skill Tree" icon="🌳" onClick={onOpenSkillTree} delay={0.32} colorClass="bg-stone-950 border-stone-800 text-stone-400 hover:border-emerald-600 hover:text-emerald-500" />
                <DashboardButton label="Quests" icon="📜" onClick={() => setMenuView('quests')} delay={0.35} colorClass="bg-stone-950 border-stone-800 text-stone-400 hover:border-red-600 hover:text-red-500" />
                <DashboardButton label="Customization" icon={<Palette className="w-8 h-8" />} onClick={() => setMenuView('shop')} delay={0.5} colorClass="bg-stone-950 border-stone-800 text-stone-400 hover:border-red-600 hover:text-red-500" />
                
                {/* Secondary Actions */}
                <DashboardButton 
                    label="Roadmap" 
                    icon="🗺️"
                    onClick={() => setMenuView('roadmap')} 
                    delay={0.6} 
                    colorClass="bg-black border-stone-900 text-stone-600 hover:text-stone-400 hover:border-stone-700" 
                />
                <DashboardButton label="Grimoire" icon="📖" onClick={() => setMenuView('compendium')} delay={0.7} colorClass="bg-black border-stone-900 text-stone-600 hover:text-stone-400 hover:border-stone-700" />
                <DashboardButton label="Chronicles" icon="🖋️" onClick={() => setMenuView('runHistory')} delay={0.8} colorClass="bg-black border-stone-900 text-stone-600 hover:text-stone-400 hover:border-stone-700" />
                <DashboardButton label="Settings" icon="⚙️" onClick={() => setMenuView('settings')} delay={0.9} colorClass="bg-black border-stone-900 text-stone-600 hover:text-stone-400 hover:border-stone-700" />
                <DashboardButton label="What's New" icon="📢" onClick={() => setShowPatchNotes(true)} delay={1.0} colorClass="bg-black border-stone-900 text-stone-600 hover:text-stone-400 hover:border-stone-700" />
                
                <div className="col-span-2 md:col-span-4 text-center mt-12 opacity-20">
                    <p className="text-[10px] text-red-900 font-serif-display tracking-[0.8em] uppercase">Sovereign Epoch v4.0.0</p>
                </div>
            </div>
          </motion.div>
        )}

        {showTutorialPrompt && (
            <motion.div 
                key="tutorial-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            >
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-stone-900 border-2 border-amber-900/50 p-6 md:p-10 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_black]"
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-amber-600 mb-4 font-serif-display uppercase tracking-tighter">Welcome, Rogue</h3>
                    <p className="text-stone-400 mb-6 md:mb-10 text-base md:text-lg leading-relaxed font-medium">
                        Your soul is new to these halls. Shall we recite the laws of the game before you face the Dealer?
                    </p>
                    <div className="flex flex-col gap-3 md:gap-4">
                        <button 
                            onClick={() => {
                                setShowTutorialPrompt(false);
                                onStartTutorial(selectedMode);
                            }}
                            className="w-full py-3 md:py-4 bg-amber-700 hover:bg-amber-600 text-stone-100 font-black rounded-lg uppercase tracking-widest transition-colors shadow-lg border border-amber-500/30"
                        >
                            Start Tutorial
                        </button>
                        <button 
                            onClick={() => {
                                setShowTutorialPrompt(false);
                                setHasCompletedTutorial(true);
                                proceedToGameSetup('campaign');
                            }}
                            className="w-full py-3 md:py-4 bg-stone-800 hover:bg-stone-700 text-stone-500 font-black rounded-lg uppercase tracking-widest transition-colors"
                        >
                            Skip Tutorial
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
        
        {menuView === 'unlocks' && <UnlocksScreen onBack={() => setMenuView('main')} onGoToForge={() => setMenuView('relicForge')} />}
        {menuView === 'relicForge' && <RelicForgeScreen onBack={() => setMenuView('unlocks')} />}
        {menuView === 'relicSelect' && <RelicSelectScreen onSelect={(relicId) => onPlay(relicId, selectedMode)} onBack={() => setMenuView('main')} />}
        {menuView === 'leaderboard' && <LeaderboardScreen onBack={() => setMenuView('main')} />}
        {menuView === 'settings' && <SettingsScreen onBack={() => setMenuView('main')} metaState={metaState} updateMetaState={metaState._setState} setShowPatchNotes={setShowPatchNotes} />}
        {menuView === 'achievements' && <AchievementsScreen unlockedIds={unlockedAchievementIds} onBack={() => setMenuView('main')} />}
        {menuView === 'shop' && <CustomizationShopScreen onBack={() => setMenuView('main')} />}
        {menuView === 'roadmap' && <RoadmapScreen onBack={() => setMenuView('main')} />}
        {menuView === 'compendium' && <CompendiumScreen onBack={() => setMenuView('main')} />}
        {menuView === 'runHistory' && <RunHistoryScreen runHistory={runHistory} onBack={() => setMenuView('main')} />}
        {menuView === 'quests' && <QuestScreen onBack={() => setMenuView('main')} />}
      </AnimatePresence>
    </div>
  </div>
);
};

export default MainMenu;