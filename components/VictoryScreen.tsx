
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { audioManager } from '../services/audioManager';

interface VictoryScreenProps {
  onMainMenu: () => void;
  onPlayAgain: () => void;
  message?: string;
}

const VictoryScreen = ({ onMainMenu, onPlayAgain, message = "VICTORY" }: VictoryScreenProps) => {
  const sentence = message.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: -50, scale: 0.5, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 120, damping: 10 }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-[100] text-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #0c0a09 90%)' }}></div>
      
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-8xl md:text-[10rem] font-black text-yellow-400 font-serif-display text-center flex flex-wrap justify-center px-4 tracking-tighter leading-none"
        style={{ textShadow: '0 0 50px rgba(250, 204, 21, 1), 0 0 20px rgba(255, 255, 255, 0.8)' }}
        aria-label="Victory"
      >
        {sentence.map((letter, index) =>
          <motion.span key={index} variants={letterVariants} className="inline-block transform hover:scale-110 hover:-translate-y-2 transition-transform cursor-default">
            {letter}
          </motion.span>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="mt-4 text-xl text-gray-300"
      >
        You have overcome the challenge.
      </motion.p>
      <div className="mt-12 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 2.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
              audioManager.playSound('button-click');
              onMainMenu();
          }}
          className="px-8 py-4 bg-gray-600 text-white font-bold text-2xl rounded-md shadow-lg hover:bg-gray-500"
        >
          Main Menu
        </motion.button>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            boxShadow: ['0 0 0px rgba(250, 204, 21, 0)', '0 0 25px 10px rgba(250, 204, 21, 0.4)', '0 0 0px rgba(250, 204, 21, 0)'],
          }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 15, delay: 2.7 },
            opacity: { duration: 0.5, delay: 2.7 },
            boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 3.2 }
          }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 35px 15px rgba(250, 204, 21, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
              audioManager.playSound('button-click');
              onPlayAgain();
          }}
          className="mt-12 px-8 py-4 bg-yellow-500 text-gray-900 font-bold text-2xl rounded-md shadow-lg hover:bg-yellow-400"
        >
          Play Again
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VictoryScreen;
