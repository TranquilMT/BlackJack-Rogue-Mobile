
import React from 'react';
import { motion } from 'framer-motion';

const ROADMAP_DATA = [
    { 
        title: 'Phase 0.5: The Void Expansion', 
        status: 'current',
        version: 'v2.5.0 - LIVE NOW',
        items: [
            { text: 'New Boss: Void Sentinel (Floor 10+)', completed: true },
            { text: 'New Relics: Void Essence, Event Horizon', completed: true },
            { text: 'Void Potion & Potion Rework', completed: true },
            { text: 'Quest System & Zero G Achievement', completed: true },
        ] 
    },
    { 
        title: 'Phase 0: The Void Event', 
        status: 'completed',
        version: 'v2.4.0',
        items: [
            { text: 'Anti-Gravity Mode: Defy physics in the Sanctuary', completed: true },
            { text: 'Void Chests: Unlock powerful Modifier Cards', completed: true },
            { text: 'Multiplayer Duels: Challenge friends', completed: true },
            { text: 'New Customization: 30+ new cosmetic items', completed: true },
        ] 
    },
    { 
        title: 'Phase 1: The Awakening', 
        status: 'completed',
        version: 'v1.0 - v1.2',
        items: [
            { text: 'Core Blackjack Combat Engine', completed: true },
            { text: 'Relic, Potion, and Synergy Systems', completed: true },
            { text: 'Wheel of Fate & Mini-Games (Plinko, Dice)', completed: true },
            { text: 'Elite Boss Encounters', completed: true },
        ] 
    },
    { 
        title: 'Phase 2: The Descent', 
        status: 'completed', 
        version: 'v1.3 - v1.5',
        items: [
            { text: 'Dark Arcana: Modifier Cards (Reaper, Sun, Clone)', completed: true },
            { text: 'The Relic Forge: Combine items for power', completed: true },
            { text: 'Mysterious Stranger: Risk/Reward Pacts', completed: true },
            { text: 'Visual Overhaul: VFX & Atmospheric Lighting', completed: true },
        ] 
    },
    { 
        title: 'Phase 3: The Hollow', 
        status: 'current', 
        version: 'v1.6.0',
        items: [
            { text: 'Soulslike Mechanics: Hollowing & Humanity', completed: true },
            { text: 'Bonfire Sanctuaries: Rest, Kindle, Purge', completed: true },
            { text: 'Combat Depth: Perfect Parry & Boss Enrage', completed: true },
            { text: 'New Hardcore Relics (The Darksign)', completed: true },
        ] 
    },
    { 
        title: 'Phase 4: The Syndicate', 
        status: 'planned', 
        version: 'Multiplayer Update',
        items: [
            { text: 'Asynchronous PvP: Battle Player "Ghost" Decks', completed: false },
            { text: 'Seasonal Leaderboards with Cosmetic Rewards', completed: false },
            { text: 'Covenants: Join Factions for Global Buffs', completed: false },
            { text: 'Co-op Community Raids (World Bosses)', completed: false },
        ] 
    },
    { 
        title: 'Phase 5: Sovereign Economy', 
        status: 'planned', 
        version: 'v2.7.0 (Coming Soon)',
        items: [
            { text: 'Staking & Governance: Earn yield & vote on game balance', completed: false },
            { text: 'Cosmetic Store for Project Funding & Earning Boosts', completed: false },
        ] 
    },
    { 
        title: 'Phase 6: The Campaign', 
        status: 'planned', 
        version: 'v3.0.0 (Planned)',
        items: [
            { text: 'Storyline Campaign Mode: Unravel the mystery of the Void', completed: false },
            { text: 'Rune Unlocking System: Unlock runes via $RELIC, Wheel, or Lootboxes', completed: false },
            { text: 'Early Boss Difficulty Rebalance', completed: false },
        ] 
    },
    { 
        title: 'Phase 7: Expansion', 
        status: 'planned', 
        version: 'v4.0.0 (Planned)',
        items: [
            { text: 'New Bosses: The Fallen Kings', completed: false },
            { text: 'Advanced Lootbox System', completed: false },
        ] 
    },
    { 
        title: 'Phase 8: Evolution', 
        status: 'planned', 
        version: 'v5.0.0 (Planned)',
        items: [
            { text: 'Multiplayer Improvements & Covenants', completed: false },
            { text: 'Seasonal Events & Challenges', completed: false },
        ] 
    },
    { 
        title: 'Phase 9: The End-Game', 
        status: 'planned', 
        version: 'v6.0.0 (Planned)',
        items: [
            { text: 'Infinite Mode: Test your limits', completed: false },
            { text: 'End-game Content & Leaderboards', completed: false },
        ] 
    },
    { 
        title: 'Planned Fixes & Polish', 
        status: 'planned', 
        version: 'Ongoing',
        items: [
            { text: 'UI/UX Polish for Campaign Mode', completed: false },
            { text: 'Performance optimization for particle systems', completed: false },
            { text: 'General bug fixes and stability improvements', completed: false },
        ] 
    },
];

const RoadmapScreen: React.FC<{onBack: () => void}> = ({ onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full p-8 flex flex-col items-center text-white overflow-y-auto custom-scrollbar"
        >
            <div className="relative mb-12 text-center">
                <h1 className="text-5xl md:text-7xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    Roadmap
                </h1>
                <p className="text-gray-500 uppercase tracking-[0.4em] text-xs mt-2">The Path of the Rogue</p>
                <div className="h-1 w-48 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-4"></div>
            </div>

            <div className="w-full max-w-5xl space-y-12 relative pb-20">
                {/* Vertical Line */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-600/50 via-gray-800 to-transparent z-0" />

                {ROADMAP_DATA.map((step, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`flex w-full items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative z-10`}
                    >
                        {/* Content Side */}
                        <div className={`w-1/2 px-4 md:px-12 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                             <div className="inline-block max-w-md">
                                <span className={`font-bold text-xl md:text-2xl ${step.status === 'current' ? 'text-yellow-400' : step.status === 'completed' ? 'text-green-500' : 'text-purple-400'}`}>{step.version}</span>
                                <h3 className="text-2xl md:text-3xl font-bold font-serif-display mb-3">{step.title}</h3>
                                <div className={`flex flex-col gap-2 ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
                                    {step.items.map(item => (
                                        <div key={item.text} className="flex items-center gap-2 group">
                                            {i % 2 !== 0 && <span className={`${item.completed ? 'text-green-500 font-bold' : 'text-gray-600 group-hover:text-gray-400 transition-colors'}`}>{item.completed ? '✓' : '○'}</span>}
                                            <span className={`text-sm md:text-base font-medium group-hover:text-white transition-colors ${item.completed ? 'text-gray-400' : 'text-gray-500'}`}>{item.text}</span>
                                            {i % 2 === 0 && <span className={`${item.completed ? 'text-green-500 font-bold' : 'text-gray-600 group-hover:text-gray-400 transition-colors'}`}>{item.completed ? '✓' : '○'}</span>}
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                        
                        {/* Dot */}
                        <div className="relative flex items-center justify-center">
                            <div className={`w-10 h-10 rounded-full ${step.status === 'completed' ? 'bg-green-900 border-green-500' : step.status === 'current' ? 'bg-red-600 border-red-400 shadow-[0_0_20px_#ef4444]' : 'bg-gray-900 border-gray-700'} border-4 z-20 flex items-center justify-center`}>
                                {step.status === 'current' && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 bg-white rounded-full" />}
                            </div>
                        </div>

                        {/* Empty Side for Spacing */}
                        <div className="w-1/2" />
                    </motion.div>
                ))}
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack} 
                className="mt-8 mb-12 px-12 py-4 bg-red-900/20 border border-red-500/50 text-white rounded-xl hover:bg-red-900/40 transition-all font-bold uppercase tracking-widest backdrop-blur-md shadow-lg"
            >
                Return to Main Menu
            </motion.button>
        </motion.div>
    );
};

export default RoadmapScreen;
