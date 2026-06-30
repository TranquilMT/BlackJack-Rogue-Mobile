
import React from 'react';
import { motion } from 'framer-motion';
import { ShopItem, RelicId } from '../types';

interface ShopScreenProps {
  items: ShopItem[];
  runCurrency: number;
  onPurchase: (itemId: string) => void;
  onContinue: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ items, runCurrency, onPurchase, onContinue }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="absolute inset-0 bg-black/80 z-[100] flex flex-col items-center justify-center text-white"
    >
      <motion.h1 variants={itemVariants} className="text-5xl font-bold font-serif-display text-yellow-300 mb-4" style={{textShadow: '0 0 10px #fde047'}}>Tranquil Shop</motion.h1>
      <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-8">Spend your shards before the next floor.</motion.p>
      
      <motion.div variants={itemVariants} className="bg-black/50 p-3 rounded-lg mb-6">
        <p className="text-xl">Your Shards: <span className="font-black text-yellow-300 font-rogue-number">{runCurrency}</span></p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
        {items.map(item => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={`bg-gray-800/70 p-4 rounded-lg border-2 border-yellow-400/30 flex flex-col justify-between ${runCurrency < item.cost ? 'opacity-50' : ''}`}
          >
            <div>
              <h3 className="text-xl font-bold text-yellow-200">{item.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            </div>
            <button
              onClick={() => onPurchase(item.id)}
              disabled={runCurrency < item.cost}
              className="mt-4 w-full px-4 py-2 bg-yellow-600 text-white font-black rounded-md shadow-md transition-colors hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed font-rogue-number"
            >
              Buy ({item.cost} Shards)
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        variants={itemVariants}
        onClick={onContinue}
        className="mt-12 px-8 py-3 bg-green-600 text-white font-bold text-xl rounded-md shadow-lg hover:bg-green-500 transition-colors"
      >
        Continue to Next Floor
      </motion.button>
    </motion.div>
  );
};

export default ShopScreen;
