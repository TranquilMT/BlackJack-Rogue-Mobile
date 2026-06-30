import React from 'react';
import { motion } from 'framer-motion';
import { RunStats } from '../types';

interface RunHistoryScreenProps {
  runHistory: RunStats[];
  onBack: () => void;
}

const RunHistoryScreen: React.FC<RunHistoryScreenProps> = ({ runHistory, onBack }) => {
  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const sortedHistory = [...runHistory].reverse();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full flex flex-col items-center justify-start text-white pt-12 md:pt-24 px-4 pb-32"
    >
      <div className="text-center mb-8 relative">
          <h1 className="text-5xl md:text-7xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] uppercase">Chronicles</h1>
          <p className="text-stone-600 uppercase tracking-[0.4em] text-[10px] mt-2 font-black">Your journey recorded in blood</p>
      </div>
      
      <motion.div variants={itemVariants} className="w-full max-w-4xl bg-stone-900/40 p-4 md:p-6 rounded-2xl border border-stone-800/50 backdrop-blur-xl overflow-y-auto custom-scrollbar shadow-2xl">
        {sortedHistory.length === 0 ? (
            <div className="text-center text-stone-600 py-12 font-serif-display italic uppercase tracking-widest">No souls harvested yet.</div>
        ) : (
            <div className="space-y-4">
            {sortedHistory.map((run, index) => (
                <div key={index} className={`p-4 rounded-lg bg-black/40 border border-stone-800/50 hover:border-stone-700 transition-colors relative overflow-hidden group`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${run.victory ? 'bg-amber-600' : 'bg-red-950'}`} />
                    
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <h3 className={`text-lg md:text-xl font-bold font-serif-display uppercase tracking-widest ${run.victory ? 'text-amber-500' : 'text-stone-400'}`}>
                                {run.victory ? 'Ascended' : 'Perished'}
                            </h3>
                            <span className="text-[10px] text-stone-600 font-black uppercase tracking-wider">Reached Floor {run.floor}</span>
                        </div>
                        <span className="text-[10px] text-stone-700 font-mono">{new Date(run.runEndedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs">
                        <div className="bg-stone-950/40 p-2 rounded-md border border-stone-800/30">
                            <p className="text-stone-600 text-[8px] uppercase mb-1">Dmg Dealt</p>
                            <p className="font-bold text-stone-200">{run.totalDamageDealt}</p>
                        </div>
                        <div className="bg-stone-950/40 p-2 rounded-md border border-stone-800/30">
                            <p className="text-stone-600 text-[8px] uppercase mb-1">Soul Shards</p>
                            <p className="font-bold text-amber-600">{run.shardsEarned}</p>
                        </div>
                         <div className="bg-stone-950/40 p-2 rounded-md border border-stone-800/30">
                            <p className="text-stone-600 text-[8px] uppercase mb-1">Relics</p>
                            <p className="font-bold text-stone-400">{run.relicsCollected.length}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </motion.div>

      {/* Standardized Fixed Footer for Back Button */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center z-[100]">
        <motion.button
          onClick={onBack}
          className="px-16 py-5 bg-stone-900/80 border border-stone-800 text-stone-400 font-black rounded-xl hover:bg-stone-800 hover:text-stone-100 uppercase text-[11px] tracking-[0.4em] shadow-2xl backdrop-blur-xl transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Grimoire
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RunHistoryScreen;