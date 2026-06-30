
import React from 'react';
import { motion } from 'framer-motion';

interface TutorialHighlightProps {
  element: Element | null;
}

const TutorialHighlight: React.FC<TutorialHighlightProps> = ({ element }) => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();

  return (
    <motion.div
      className="absolute pointer-events-none border-4 border-yellow-400 rounded-lg"
      initial={{
        x: rect.left - 5,
        y: rect.top - 5,
        width: rect.width + 10,
        height: rect.height + 10,
        opacity: 0,
      }}
      animate={{
        x: rect.left - 5,
        y: rect.top - 5,
        width: rect.width + 10,
        height: rect.height + 10,
        opacity: 1,
        boxShadow: [
          '0 0 15px 5px rgba(250, 204, 21, 0.4)',
          '0 0 25px 10px rgba(250, 204, 21, 0.6)',
          '0 0 15px 5px rgba(250, 204, 21, 0.4)',
        ],
      }}
      exit={{ opacity: 0 }}
      transition={{
          default: { duration: 0.3, ease: 'easeInOut' },
          boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      }}
    />
  );
};

export default TutorialHighlight;
