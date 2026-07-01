import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Hand } from '../types';
import Card from './Card';
import WinFlourish from './WinFlourish';
import SynergyBadge from './SynergyBadge';

interface HandDisplayProps {
  hand: Hand;
  isPlayer: boolean;
  isDealer: boolean;
  isActive: boolean;
  handIndex: number;
  totalPlayerHands: number;
  onReadyToMeasure?: () => void;
  cardBack: string;
  onBurn?: (cardId: string) => void;
  hideSecondCard?: boolean;
}

const HandDisplay = React.memo(({ hand, isPlayer, isDealer, isActive, handIndex, totalPlayerHands, onReadyToMeasure, cardBack, onBurn, hideSecondCard }: HandDisplayProps) => {
  const { cards, score, status, activeSynergies, damageMultiplier } = hand;
  const isWin = status === 'win' || status === 'blackjack' || status === 'superWin';
  const isLoss = status === 'lose' || status === 'busted';
  const isResolved = isWin || isLoss || status === 'push';

  const statusColor = isWin ? 'text-green-400' :
                      isLoss ? 'text-red-400' :
                      status === 'push' ? 'text-yellow-400' : 'text-white';

  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const dealerDisplayScore = (isDealer && hideSecondCard) ? 0 : score;
  const shouldShowMultiplier = (isActive || isWin || isLoss) && damageMultiplier > 1;

  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 768;
  const baseSpread = isMobile ? 20 : 30;
  const CARD_SPREAD = cards.length > 4 ? Math.max(10, baseSpread - (cards.length - 4) * 2) : baseSpread;
  const handContainerOffset = -((cards.length - 1) * CARD_SPREAD) / 2;
  const entryX = isMobile ? 210 : 520;
  const entryY = isDealer ? (isMobile ? -90 : -160) : (isMobile ? -320 : -460);

  useEffect(() => {
    if (isActive && onReadyToMeasure) {
      const timer = setTimeout(onReadyToMeasure, 90);
      return () => clearTimeout(timer);
    }
  }, [isActive, onReadyToMeasure, cards.length]);

  return (
    <motion.div
      className="player-hand-highlight relative flex flex-col items-center justify-center transition-all duration-300 w-48 h-56 md:w-56 md:h-64"
      animate={isResolved ? { y: [0, -4, 0] } : { y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {isActive && (
        <motion.div
            layoutId="activeHandIndicator"
            className="absolute -inset-4 md:-inset-6 border-2 border-red-500/60 rounded-xl pointer-events-none z-0 skew-x-[-2deg] active-hand-aura"
            initial={false}
            animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.015, 1], skewX: [-2, -3, -2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg skew-x-[2deg] border border-red-400/50">
                ACTIVE HAND
            </div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
        </motion.div>
      )}

      <AnimatePresence>
        {isResolved && (
          <motion.div
            key={`impact-${status}-${score}-${cards.length}`}
            className={`absolute top-20 w-36 h-36 rounded-full pointer-events-none z-0 ${isWin ? 'bg-green-500/10' : isLoss ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {isWin && <WinFlourish />}

      <div className="absolute -top-12 text-center w-full z-30">
        { isDealer && dealerDisplayScore > 0 &&
            <motion.div
                key={status + dealerDisplayScore}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="flex flex-col items-center"
            >
                <p className="text-white font-black text-xl font-vt323 drop-shadow-md">{dealerDisplayScore}</p>
                {(status === 'blackjack' || status === 'busted' || status === 'superWin' || activeSynergies.length > 0) && (
                    <div className="flex flex-col items-center">
                        <p className={`font-bold text-sm ${statusColor}`}>{statusText}</p>
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                            <AnimatePresence>
                                {activeSynergies.map(synergy => <SynergyBadge key={synergy.id} synergy={synergy} />)}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </motion.div>
        }

        { isPlayer && score > 0 &&
          <motion.div
            key={status + score + activeSynergies.length}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-baseline justify-center gap-2">
              <motion.p
                animate={score > 21 ? { x: [-3, 3, -3, 3, 0], scale: [1, 1.08, 1] } : isWin ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 0.35 }}
                className={`font-black text-xl md:text-2xl font-vt323 drop-shadow-md ${statusColor}`}
              >
                {statusText} ({score})
              </motion.p>
              {shouldShowMultiplier && (
                <motion.p
                  key={`dmg-${damageMultiplier}`}
                  initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                  animate={{ scale: [1, 1.25, 1.1], opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.12, type: 'spring', stiffness: 420, damping: 10 }}
                  className="font-black text-xl md:text-2xl text-orange-400 font-vt323"
                  style={{ textShadow: '0 0 15px #f97316' }}
                >
                  x{damageMultiplier.toFixed(2)}
                </motion.p>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              <AnimatePresence>
                {activeSynergies.map(synergy => <SynergyBadge key={synergy.id} synergy={synergy} />)}
              </AnimatePresence>
            </div>
          </motion.div>
        }
      </div>

      <motion.div
        className="absolute top-12 h-28 md:h-36 flex items-center justify-center card-container"
        layout
        animate={{ x: handContainerOffset }}
        transition={{ type: 'spring', stiffness: 520, damping: 34 }}
        style={{ willChange: 'transform' }}
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const areInitialCards = status === 'hitting' && index < 2;
            const dealOrder = isDealer ? totalPlayerHands : handIndex;
            const totalHands = totalPlayerHands + 1;
            const initialDealDelay = (dealOrder + index * totalHands) * 0.13;
            const isHidden = isDealer && hideSecondCard && index === 1;
            const isLatestHit = index === cards.length - 1 && cards.length > 2;
            const finalRotate = (index - (cards.length - 1) / 2) * 6;

            return (
                <motion.div
                    key={card.id}
                    layout="position"
                    className={`absolute ${card.modifier ? 'modifier-card-aura' : ''}`}
                    initial={{ opacity: 0, x: entryX, y: entryY, scale: 0.18, rotate: isDealer ? -35 : 85, rotateY: isHidden ? 180 : 0 }}
                    animate={{
                      opacity: 1,
                      x: index * CARD_SPREAD,
                      y: isLatestHit ? [0, -18, 0] : 0,
                      rotate: finalRotate,
                      rotateY: 0,
                      scale: isLatestHit ? [0.96, 1.2, 1] : [0.98, 1.08, 1],
                    }}
                    exit={{ opacity: 0, y: 180, scale: 0.3, rotate: -45, transition: { duration: 0.22 } }}
                    transition={{
                        type: 'spring',
                        stiffness: isLatestHit ? 720 : 620,
                        damping: isLatestHit ? 16 : 18,
                        delay: areInitialCards ? initialDealDelay : 0.04,
                    }}
                    style={{ zIndex: index, transformOrigin: 'bottom center' }}
                >
                    {isLatestHit && <span className="card-impact-ring" />}
                    <span className="deal-trail" />
                    <Card card={card} isActive={isPlayer && isActive} cardBack={cardBack} onBurn={onBurn} isFaceDown={isHidden}/>
                </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default HandDisplay;
