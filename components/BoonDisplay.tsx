
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Boon } from '../types';
import { BoonId } from '../types';
import { Tooltip } from './Tooltip';

interface BoonDisplayProps {
  boons: Boon[];
}

const BoonIcon = ({ boonId }: { boonId: BoonId; }) => {
    const boonIcons: Record<BoonId, string> = {
        [BoonId.MAX_HP_UP_SMALL]: '❤️‍🩹',
        [BoonId.FLAT_DAMAGE_UP_SMALL]: '⚔️',
        [BoonId.STARTING_SHIELD_SMALL]: '🛡️',
        [BoonId.HEAL_SMALL]: '💖',
        [BoonId.SHARD_GAIN_UP]: '💰',
        [BoonId.POTION_CHARGE_UP]: '🧪',
        [BoonId.SURVIVAL_BONUS]: '⏳',
    };
    return <span className="text-xl drop-shadow-lg">{boonIcons[boonId] || '✨'}</span>
}

const BoonDisplay: React.FC<BoonDisplayProps> = React.memo(({ boons }) => {
  const activeBoons = boons.filter(b => b.id !== BoonId.HEAL_SMALL && b.id !== BoonId.POTION_CHARGE_UP);

  if (activeBoons.length === 0) return null;

  return (
    <div className="absolute top-[calc(50%+120px)] -translate-y-1/2 left-2 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {activeBoons.map((boon, index) => (
          <Tooltip
            key={boon.id}
            side="right"
            content={
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-cyan-400">{boon.name}</h3>
                <p className="text-sm text-gray-300">{boon.description}</p>
              </div>
            }
          >
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gray-900/70 rounded-md border-2 border-cyan-400/30 flex items-center justify-center cursor-pointer shadow-lg hover:border-cyan-400/70 transition-colors">
                  <BoonIcon boonId={boon.id} />
              </div>
            </motion.div>
          </Tooltip>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default BoonDisplay;
