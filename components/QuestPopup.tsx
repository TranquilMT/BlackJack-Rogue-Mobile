import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

interface QuestPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuestPopup: React.FC<QuestPopupProps> = ({ isOpen, onClose }) => {
  const activeQuests = useStore(state => state.activeQuests) || [];
  
  const uncompletedQuests = activeQuests.filter(q => !q.isClaimed);

  return (
    <AnimatePresence>
      {isOpen && uncompletedQuests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 right-4 z-40 bg-zinc-800 text-zinc-100 p-4 rounded-xl shadow-2xl border border-zinc-600 w-72"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-amber-400">Active Quests</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
          </div>
          <ul className="text-xs space-y-3">
            {uncompletedQuests.map(quest => (
              <li key={quest.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${quest.progress >= quest.target ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <span>{quest.description}</span>
                </div>
                <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden ml-4">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-zinc-400 ml-4 text-right">
                  {quest.progress} / {quest.target}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestPopup;
