
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Relic } from '../types';
import RelicAsset from './RelicAsset';
import { Tooltip } from './Tooltip';

interface RelicDisplayProps {
  relics: Relic[];
}

const RelicDisplay = React.memo(({ relics }: RelicDisplayProps) => {
  return (
    <div className="relic-display-highlight absolute top-1/2 -translate-y-1/2 left-2 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {relics.map((relic, index) => (
          <Tooltip
            key={relic.id}
            side="right"
            content={
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                  <RelicAsset id={relic.id} width={20} height={20} />
                  {relic.name}
                </h3>
                <p className="text-sm text-gray-300">{relic.description}</p>
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
              <div className="w-12 h-12 bg-gray-900/90 rounded-md border-2 border-yellow-400/30 flex items-center justify-center cursor-pointer shadow-lg hover:border-yellow-400/70 transition-colors">
                  <RelicAsset id={relic.id} width={32} height={32} />
              </div>
            </motion.div>
          </Tooltip>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default RelicDisplay;
