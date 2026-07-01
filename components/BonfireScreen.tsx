
import React from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../services/audioManager';

interface BonfireScreenProps {
    onAction: (action: 'rest' | 'kindle' | 'purge' | 'leave') => void;
    hasCurses: boolean;
}

const BonfireScreen: React.FC<BonfireScreenProps> = ({ onAction, hasCurses }) => {
    
    React.useEffect(() => {
        // audioManager.playSound('bonfire-lit'); // Can add specific sfx later
    }, []);

    const handleAction = (action: 'rest' | 'kindle' | 'purge' | 'leave') => {
        if (action !== 'leave') {
            audioManager.playSound('boon-acquire');
        } else {
            audioManager.playSound('button-click');
        }
        onAction(action);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-orange-900/40 via-black to-black animate-pulse" />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex flex-col items-center gap-12"
            >
                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-serif-display text-orange-500 mb-2 drop-shadow-[0_0_25px_rgba(249,115,22,0.6)]">BONFIRE LIT</h1>
                    <p className="text-gray-400 text-sm tracking-[0.3em] uppercase">Sanctuary</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <button 
                        onClick={() => handleAction('rest')}
                        className="group relative w-64 h-32 bg-gray-900 border border-orange-900/50 hover:border-orange-500 rounded-lg flex flex-col items-center justify-center transition-all hover:bg-gray-800"
                    >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">❤️‍🔥</span>
                        <h3 className="text-xl font-bold text-orange-200">Rest</h3>
                        <p className="text-xs text-gray-500 mt-1">Heal 30% Max HP</p>
                    </button>

                    <button 
                        onClick={() => handleAction('kindle')}
                        className="group relative w-64 h-32 bg-gray-900 border border-yellow-900/50 hover:border-yellow-500 rounded-lg flex flex-col items-center justify-center transition-all hover:bg-gray-800"
                    >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧪</span>
                        <h3 className="text-xl font-bold text-yellow-200">Kindle</h3>
                        <p className="text-xs text-gray-500 mt-1">+1 Potion Charge</p>
                    </button>

                    <button 
                        onClick={() => handleAction('purge')}
                        disabled={!hasCurses}
                        className="group relative w-64 h-32 bg-gray-900 border border-purple-900/50 hover:border-purple-500 rounded-lg flex flex-col items-center justify-center transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🧿</span>
                        <h3 className="text-xl font-bold text-purple-200">Purge</h3>
                        <p className="text-xs text-gray-500 mt-1">{hasCurses ? 'Remove 1 Curse' : 'No Curses Active'}</p>
                    </button>
                </div>

                <button 
                    onClick={() => handleAction('leave')}
                    className="mt-8 text-gray-500 hover:text-white uppercase text-xs tracking-widest transition-colors"
                >
                    Leave Sanctuary
                </button>
            </motion.div>
            
            {/* Fire Effect Placeholder */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full animate-pulse" />
        </motion.div>
    );
};

export default BonfireScreen;
