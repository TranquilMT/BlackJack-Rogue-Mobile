import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatchNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatchNotes: React.FC<PatchNotesProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 text-zinc-100 p-6 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-black mb-6 text-purple-400 font-serif-display uppercase tracking-tighter">System Update v<span className="font-rogue-number">4.1.1</span></h2>
            <div className="space-y-6 text-zinc-300">
                <section>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Clarity & Polish</h3>
                    <ul className="space-y-2 text-xs list-disc list-inside">
                        <li><span className="font-bold text-emerald-400">Card Counting:</span> Updated the card counting font and color for better visibility.</li>
                        <li><span className="font-bold text-emerald-400">Rogue Font:</span> Applied the roguelike font to more UI elements.</li>
                    </ul>
                </section>
                <section>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">The Void Expansion</h3>
                    <ul className="space-y-2 text-xs list-disc list-inside">
                        <li><span className="font-bold text-purple-400">Void Event:</span> A new floor modifier that adds chaos and power.</li>
                        <li><span className="font-bold text-purple-400">New Relics:</span> Void Shard and Abyssal Eye.</li>
                        <li><span className="font-bold text-purple-400">Void Skill Branch:</span> Unlock Void Affinity, Power, and Resilience.</li>
                    </ul>
                </section>
            </div>
            <div className="mt-8 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Developer Note</h3>
                <p className="text-[10px] text-zinc-400">Phase 2 of the expansion is now live. The abyss is watching.</p>
            </div>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-3 px-4 rounded-lg uppercase text-xs tracking-widest transition-colors"
            >
              Acknowledge
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatchNotes;
