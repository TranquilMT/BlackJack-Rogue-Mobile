
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';
import { PATCH_NOTES_HISTORY } from '../game/patchNotesHistory';

const PatchNotesScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleContinue = () => {
      audioManager.playSound('button-click');
      onContinue();
    };
    
    // Function to handle changing index and scrolling to top
    const changePatch = (newIndex: number) => {
        if (newIndex >= 0 && newIndex < PATCH_NOTES_HISTORY.length) {
            setCurrentIndex(newIndex);
            if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleOlder = () => {
        audioManager.playSound('button-click');
        changePatch(currentIndex + 1);
    };

    const handleNewer = () => {
        audioManager.playSound('button-click');
        changePatch(currentIndex - 1);
    };

    const currentPatch = PATCH_NOTES_HISTORY[currentIndex];

    return (
        <motion.div
            ref={scrollRef}
            key="patch_notes_redesign"
            className="w-full h-full overflow-y-auto bg-gray-950 relative z-[100]"
            style={{ backgroundImage: `radial-gradient(ellipse at top, #1a1a1a, transparent 60%), radial-gradient(ellipse at bottom, #1a1a1a, transparent 60%), url('https://www.transparenttextures.com/patterns/dark-matter.png')` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-10 text-center p-6 bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none">
                <p className="text-sm text-red-500 font-bold uppercase tracking-[0.3em]">Version History</p>
                <h1 className="text-3xl md:text-5xl font-bold font-serif-display text-white mt-1" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{currentPatch.title}</h1>
                <p className="text-gray-400 font-mono text-sm mt-2">{`Build ${currentPatch.version} - ${currentPatch.date}`}</p>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-3xl mx-auto px-4 pt-48 pb-40 min-h-screen relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="space-y-8 text-white/90 text-base md:text-lg">
                            {currentPatch.changes.map(change => (
                                <div key={change.category} className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
                                    <h2 className="text-3xl font-black text-emerald-400 font-serif-display uppercase tracking-tighter border-b border-zinc-800 pb-4 mb-6">{change.category}</h2>
                                    <ul className="space-y-4">
                                        {change.points.map(point => (
                                            <li key={point} className="flex items-start gap-4 text-sm font-bold text-zinc-300 uppercase tracking-widest">
                                                <span className="text-emerald-500 mt-1">✦</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none">
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 pointer-events-auto">
                     <div className="flex items-center justify-center gap-4">
                         <button
                             onClick={handleOlder}
                             disabled={currentIndex >= PATCH_NOTES_HISTORY.length - 1}
                             className="px-6 py-2 bg-black/30 border border-white/10 rounded-lg text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                         >
                            ← Older
                         </button>
                         <span className="text-sm font-mono text-gray-500">
                             {currentIndex + 1} / {PATCH_NOTES_HISTORY.length}
                         </span>
                         <button
                             onClick={handleNewer}
                             disabled={currentIndex <= 0}
                             className="px-6 py-2 bg-black/30 border border-white/10 rounded-lg text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                         >
                            Newer →
                         </button>
                     </div>
                     <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinue} 
                        className="px-12 py-4 bg-red-800/50 border border-red-500/50 text-white rounded-xl font-bold uppercase tracking-widest backdrop-blur-sm shadow-lg hover:bg-red-800/80 transition-all"
                    >
                        Continue
                    </motion.button>
                </div>
            </footer>
        </motion.div>
    );
};

export default PatchNotesScreen;
