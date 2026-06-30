import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Intro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const title = 'BLACKJACK ROGUE';

  return (
    <motion.div
      key="blackjack_rogue_intro"
      className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-black cursor-pointer overflow-hidden select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)', transition: { duration: 0.8 } }}
      onClick={onComplete}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 42%, rgba(127,29,29,0.65) 0%, rgba(24,24,27,0.45) 34%, #000 72%)'
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 intro-card-rain opacity-30" />
      <div className="absolute inset-0 crt-overlay opacity-20" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          className="mb-6 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-red-700/80 flex items-center justify-center bg-black/50 shadow-[0_0_45px_rgba(220,38,38,0.45)]"
          animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-5xl md:text-7xl drop-shadow-[0_0_18px_rgba(248,113,113,0.9)]">♠</span>
        </motion.div>

        <h1 className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-4xl md:text-7xl font-black font-serif-display uppercase tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
          {title.split('').map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className={char === ' ' ? 'w-3 md:w-6' : ''}
              initial={{ opacity: 0, y: 24, rotateX: -80 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.45 + index * 0.035, type: 'spring', stiffness: 220, damping: 16 }}
            >
              {char === ' ' ? '\u00a0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="mt-4 h-px w-64 md:w-96 bg-gradient-to-r from-transparent via-red-500 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.25, duration: 0.85 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.65 }}
          className="mt-5 text-sm md:text-lg text-red-200 font-black uppercase tracking-[0.45em] font-rogue-number text-center"
        >
          Souls are shuffled. Fate is dealt.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 2.3 }}
          className="mt-8 text-[10px] md:text-xs text-stone-400 uppercase tracking-[0.35em] font-mono"
        >
          Tap to enter
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Intro;
