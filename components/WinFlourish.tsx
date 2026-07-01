
import React from 'react';
import { motion } from 'framer-motion';

const WinFlourish = () => {
  const numParticles = 24;
  const radius = 150;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <motion.div
        className="absolute w-full h-full bg-yellow-400/20 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {Array.from({ length: numParticles }).map((_, i) => {
        const angle = (i / numParticles) * 360;
        const distance = radius * (0.5 + Math.random() * 0.5);
        const x = distance * Math.cos((angle * Math.PI) / 180);
        const y = distance * Math.sin((angle * Math.PI) / 180);

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-12 bg-yellow-300 rounded-full shadow-[0_0_10px_#facc15]"
            initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, rotate: angle + 90 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.2, 1.5, 0],
              x: [0, x],
              y: [0, y],
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              delay: 0.2 + Math.random() * 0.1,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default WinFlourish;
