
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOUBLE_COST } from '../game/logic';
import type { BlockedAction } from '../types';
import { audioManager } from '../services/audioManager';
import { useStore } from '../store/useStore';

interface PlayerActionsProps {
  position: { top: number, left: number, width: number };
  onHit?: () => void;
  onStand?: () => void;
  onSurrender?: () => void;
  onDouble?: () => void;
  onSplit?: () => void;
  onIntimidate?: () => void;
  blockedAction: BlockedAction;
  splitCost: number;
  focus: number;
  maxFocus: number;
}

const ActionButton: React.FC<{ 
    onClick?: () => void, 
    disabled?: boolean, 
    children: React.ReactNode, 
    className: string, 
    isBlocked?: boolean,
    highlightClass?: string,
    style?: React.CSSProperties,
    shortcut?: string
}> = ({ onClick, disabled, children, className, isBlocked, highlightClass, style, shortcut }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled || !onClick || isBlocked}
    className={`relative w-full flex flex-col items-center justify-center overflow-hidden font-serif-display uppercase border shadow-md transition-all duration-100 disabled:opacity-40 disabled:grayscale ${className} ${isBlocked ? 'bg-gray-800 !border-gray-600 !text-gray-500' : ''} ${highlightClass || ''}`}
    style={style}
    whileHover={!disabled && !isBlocked ? { 
        scale: 1.1, 
        boxShadow: '0 0 25px rgba(255,255,255,0.3)',
        filter: 'brightness(1.3)',
        y: -2
    } : {}}
    whileTap={!disabled && !isBlocked ? { scale: 0.85, y: 2 } : {}}
  >
    <motion.div 
        className="absolute inset-0 bg-white opacity-0"
        whileTap={{ opacity: 0.3 }}
        transition={{ duration: 0.1 }}
    />
    {isBlocked ? "Blocked" : children}
    {shortcut && <span className="text-[8px] opacity-50 mt-0.5">[{shortcut}]</span>}
  </motion.button>
);

const PlayerActions = React.memo(({ position, onHit, onStand, onSurrender, onDouble, onSplit, onIntimidate, blockedAction, splitCost, focus, maxFocus }: PlayerActionsProps) => {
  const deviceMode = useStore(state => state.customization.deviceMode || 'mobile');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === 'h' && onHit) onHit();
          if (e.key.toLowerCase() === 's' && onStand) onStand();
          if (e.key.toLowerCase() === 'd' && onDouble) onDouble();
          if (e.key.toLowerCase() === 'p' && onSplit) onSplit();
          if (e.key.toLowerCase() === 'i' && onIntimidate) onIntimidate();
          if (e.key.toLowerCase() === 'q' && onSurrender) onSurrender();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onHit, onStand, onDouble, onSplit, onIntimidate, onSurrender]);
  
  const isDesktop = deviceMode === 'desktop';
  const MENU_WIDTH = isDesktop ? 600 : 100;
  
  let finalStyle: React.CSSProperties = {};
  
  if (!isDesktop) {
      if (position.width > 0) {
          let left = position.left + position.width + 8; 
          let top = position.top;
          
          if (left + MENU_WIDTH > windowWidth - 5) {
              left = position.left - MENU_WIDTH - 8;
          }
          
          if (left < 5) left = 5;
          if (left + MENU_WIDTH > windowWidth - 5) left = windowWidth - MENU_WIDTH - 5;

          const MENU_HEIGHT = 260;
          if (top + MENU_HEIGHT > window.innerHeight) {
              top = window.innerHeight - MENU_HEIGHT - 40;
          }
          if (top < 40) top = 40;

          finalStyle = { 
              top, 
              left, 
              position: 'fixed' 
          };
      } else {
          finalStyle = { 
              bottom: '120px', 
              right: '10px', 
              position: 'fixed' 
          };
      }
  } else {
      finalStyle = {
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          position: 'fixed'
      };
  }

  return (
    <AnimatePresence>
        <motion.div 
            className={`z-[100] flex ${isDesktop ? 'flex-row' : 'flex-col'} gap-2 p-2 bg-black/90 rounded border border-yellow-900/50 shadow-[0_0_15px_rgba(0,0,0,0.8)]`}
            style={{...finalStyle, width: isDesktop ? 'auto' : MENU_WIDTH}}
            initial={{ opacity: 0, scale: 0.9, y: isDesktop ? 20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: isDesktop ? 20 : 0 }}
            transition={{ duration: 0.2 }}
        >
            {!isDesktop && <div className="text-center text-[8px] text-yellow-500/50 font-serif-display uppercase tracking-widest mb-0.5">Actions</div>}
            
            <ActionButton 
            onClick={onHit ? () => { audioManager.playSound('card-hit'); onHit(); } : undefined} 
            disabled={!onHit}
            className={`h-12 text-xs tracking-wider bg-green-950/90 border-green-600 text-green-100 hover:bg-green-900 rounded-sm ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-hit"
            shortcut="H"
            >
            Hit
            </ActionButton>
            
            <ActionButton 
            onClick={onStand ? () => { audioManager.playSound('player-stand'); onStand(); } : undefined} 
            disabled={!onStand}
            className={`h-12 text-xs tracking-wider bg-red-950/90 border-red-600 text-red-100 hover:bg-red-900 rounded-sm ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-stand"
            shortcut="S"
            >
            Stand
            </ActionButton>

            <ActionButton 
            onClick={onSurrender ? () => { audioManager.playSound('player-damage'); onSurrender(); } : undefined} 
            disabled={!onSurrender}
            className={`h-12 text-[10px] bg-gray-900/90 border-gray-600 text-gray-300 hover:bg-gray-800 rounded-sm flex flex-col leading-none py-0.5 ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-surrender"
            shortcut="Q"
            >
                <span>Surrender</span>
                <span className="text-[8px] opacity-70 font-rogue-number">-5 HP</span>
            </ActionButton>
            
            {isDesktop && <div className="w-px h-12 bg-white/10 mx-1" />}
            {!isDesktop && <div className="w-full h-px bg-white/10 my-0.5" />}

            <ActionButton 
            onClick={onDouble ? () => { audioManager.playSound('double-down'); onDouble(); } : undefined} 
            disabled={!onDouble} 
            isBlocked={blockedAction === 'double'} 
            className={`h-12 bg-blue-950/80 border-blue-600/70 text-blue-100 hover:bg-blue-900 rounded-sm flex flex-col leading-none py-0.5 ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-double"
            shortcut="D"
            >
                <span className="text-[10px]">Double</span>
                <span className="text-[8px] opacity-70 font-rogue-number">-{DOUBLE_COST} HP</span>
            </ActionButton>
            
            <ActionButton 
            onClick={onSplit ? () => { audioManager.playSound('split'); onSplit(); } : undefined} 
            disabled={!onSplit} 
            isBlocked={blockedAction === 'split'} 
            className={`h-12 bg-purple-950/80 border-purple-600/70 text-purple-100 hover:bg-purple-900 rounded-sm flex flex-col leading-none py-0.5 ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-split"
            shortcut="P"
            >
                <span className="text-[10px]">Split</span>
                <span className="text-[8px] opacity-70 font-rogue-number">-{splitCost} HP</span>
            </ActionButton>
            
            <ActionButton 
            onClick={onIntimidate ? () => { audioManager.playSound('focus-full'); onIntimidate(); } : undefined} 
            disabled={!onIntimidate} 
            className={`h-12 bg-indigo-950/80 border-indigo-500/60 text-indigo-100 hover:bg-indigo-900 rounded-sm flex flex-col leading-none py-0.5 ${isDesktop ? 'w-24' : 'w-full'}`} 
            highlightClass="action-intimidate"
            shortcut="I"
            >
                <span className="text-[9px] uppercase">Intimidate</span>
                <span className="text-[7px] opacity-70 font-rogue-number">{maxFocus} Focus</span>
            </ActionButton>
        </motion.div>
    </AnimatePresence>
  );
});

export default PlayerActions;
