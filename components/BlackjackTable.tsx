
import React, { useState, useEffect } from 'react';
import type { Hand } from '../types';
import HandDisplay from './HandDisplay';
import { RelicId, TableLighting } from '../types';
import { RELICS } from '../game/relics';
import { motion } from 'framer-motion';

interface BlackjackTableProps {
  children?: React.ReactNode;
  felt: string;
  lighting: TableLighting;
}

interface BlackjackTableComponent {
  (props: BlackjackTableProps): React.ReactElement;
  DealerHandContainer: React.FC<{ children: React.ReactNode }>;
  PlayerHandsContainer: React.FC<{ children: React.ReactNode; handCount: number }>;
  Hand: React.FC<{ hand: Hand; isPlayer: boolean; isDealer: boolean; handIndex: number; isActive: boolean; totalPlayerHands: number; onReadyToMeasure?: () => void; cardBack: string; onBurn?: (cardId: string) => void; hideSecondCard?: boolean; }>;
  Shoe: React.FC<{ count: number; acesLeft: number | undefined }>;
  DiscardPile: React.FC<{ count: number }>;
}

const feltStyles: Record<string, string> = {
    green: 'bg-[#062c16] from-[#041d0f] to-[#01140a]',
    blue: 'bg-[#0f172a] from-[#020617] to-[#0f172a]',
    red: 'bg-[#450a0a] from-[#2d0606] to-[#450a0a]',
};

const LogoGraphic = () => (
    <div className="flex flex-col items-center opacity-10 mb-4 text-red-600">
        <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" stroke="currentColor" strokeWidth="2" />
            <path d="M50 15 L80 30 L80 70 L50 85 L20 70 L20 30 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M50 30 V70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 50 H70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.2" />
        </svg>
    </div>
);

const BlackjackTableInternal = React.memo(({ children, felt, lighting }: BlackjackTableProps): React.ReactElement => {
  const feltClass = feltStyles[felt] || feltStyles.green;
  
  const lightingOverlay = lighting === TableLighting.Tension ? 'bg-black/30' : lighting === TableLighting.HighStakes ? 'bg-red-900/20' : 'bg-transparent';

  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-4 overflow-hidden">
      <motion.div
        className={`rogue-table relative w-full h-full max-w-[1600px] max-h-[1000px] rounded-[30px] md:rounded-[100px] border-[8px] md:border-[20px] border-stone-950 ${feltClass.split(' ')[0]} overflow-hidden`}
        style={{
          background: `radial-gradient(ellipse at center, ${feltClass.split(' ')[1].replace('from-[', '').replace(']', '')} 0%, ${feltClass.split(' ')[2].replace('to-[', '').replace(']', '')} 100%)`,
          aspectRatio: 'auto'
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
      >
        <div className={`absolute inset-0 ${lightingOverlay} pointer-events-none`} />
        
        <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 48%, rgba(248,196,92,0.12) 0%, rgba(127,16,16,0.11) 35%, rgba(0,0,0,0.78) 100%)' }}
            animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-0 rounded-[85px] border-2 border-amber-900/10 shadow-[inset_0_0_240px_rgba(0,0,0,0.92)]"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[110%] md:-translate-y-[140%] flex flex-col items-center justify-center select-none pointer-events-none">
            <div className="text-stone-200">
                <LogoGraphic />
            </div>
            <h1 className="text-3xl md:text-6xl font-black font-serif-display text-white/5 uppercase tracking-widest pixel-text-shadow" style={{ opacity: 0.1 }}>Blackjack <span className="text-red-900">Rogue</span></h1>
        </div>
        
        <div className="absolute top-[32%] md:top-[38%] left-1/2 -translate-x-1/2 text-center select-none w-full px-4 pointer-events-none">
            <p className="font-serif-display text-2xl md:text-5xl font-black text-black/40 uppercase tracking-widest pixel-text-shadow" style={{ opacity: 0.2 }}>PAYS 3:2</p>
            <p className='text-[10px] md:text-sm font-black text-black/30 uppercase tracking-[0.5em] mt-2 font-mono' style={{ opacity: 0.3 }}>DEALER STANDS ON 17</p>
        </div>

        {children}
      </motion.div>
    </div>
  );
});

// Repositioned Dealer Hand higher (was 8% top)
const DealerHandContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute top-[5%] md:top-[12%] w-full flex justify-center items-start pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="pointer-events-auto">
            {children}
        </div>
    </div>
);

const PlayerHandsContainer: React.FC<{ children: React.ReactNode, handCount: number }> = ({ children, handCount }) => {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const angleSpread = isMobile ? Math.min(120, handCount * 25) : Math.min(100, handCount * 15);
    const startAngle = -angleSpread / 2;
    const radius = isMobile ? width * 0.9 : 650;
    const yOffset = isMobile ? 60 : -10;

    return (
        <div className="absolute bottom-[5%] md:bottom-[-10%] left-0 w-full h-[50%] md:h-[35%] pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {React.Children.map(children, (child, index) => {
                let style: React.CSSProperties;
                let innerStyle: React.CSSProperties = {};

                if (handCount <= 1) {
                    style = {
                        transform: `translateX(-50%) translateY(0px)`,
                        transition: 'transform 0.5s ease-out',
                        transformStyle: 'preserve-3d'
                    };
                } else {
                    const angle = startAngle + (angleSpread / (handCount - 1)) * index;
                    const x = radius * Math.sin((angle * Math.PI) / 180);
                    const y = radius * (1 - Math.cos((angle * Math.PI) / 180));
                    style = {
                        transform: `translateX(-50%) translate(${x}px, -${y + yOffset}px) rotate(${angle}deg)`,
                        transition: 'transform 0.5s ease-out',
                        transformStyle: 'preserve-3d'
                    };
                    innerStyle = { transform: `rotate(${-angle}deg)`, transformStyle: 'preserve-3d' };
                }

                return (
                    <div className="absolute bottom-0 left-1/2 pointer-events-auto" style={style}>
                      <div style={innerStyle}>{child}</div>
                    </div>
                );
            })}
        </div>
    );
}

const HandComponent = ({ hand, isPlayer, isDealer, handIndex, isActive, totalPlayerHands, onReadyToMeasure, cardBack, onBurn, hideSecondCard }: { hand: Hand; isPlayer: boolean; isDealer: boolean; handIndex: number; isActive: boolean; totalPlayerHands: number; onReadyToMeasure?: () => void; cardBack: string; onBurn?: (cardId: string) => void; hideSecondCard?: boolean; }) => {
    return <HandDisplay hand={hand} isPlayer={isPlayer} isDealer={isDealer} isActive={isActive} handIndex={handIndex} totalPlayerHands={totalPlayerHands} onReadyToMeasure={onReadyToMeasure} cardBack={cardBack} onBurn={onBurn} hideSecondCard={hideSecondCard} />;
};

const Shoe = ({count, acesLeft}: {count: number, acesLeft: number | undefined}) => {
    const fill = Math.max(5, (count / (52*6)) * 100);
    return (
        <motion.div
            className="absolute top-[8%] right-[4%] md:top-[12%] md:right-[6%] w-16 h-20 md:w-32 md:h-40 pointer-events-auto"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="relative w-full h-full" style={{transformStyle: 'preserve-3d', transform: 'rotateY(-25deg) rotateX(15deg)'}}>
                 <div className="absolute w-full h-full bg-stone-900 rounded-lg shadow-2xl" style={{ transform: 'translateZ(-25px)'}}>
                    <div className="absolute -left-4 top-0 w-4 h-full bg-stone-950 transform origin-right rotate-y-90"></div>
                    <div className="absolute w-full h-4 -top-4 bg-stone-950 transform origin-bottom -rotate-x-90"></div>
                </div>
                {Array.from({ length: 5 }).map((_, index) => (
                    <motion.div
                        key={`shoe-card-${index}`}
                        className="absolute left-[10%] right-[10%] h-1 md:h-1.5 rounded-sm bg-stone-300/70 border border-black/40"
                        style={{ top: `${18 + index * 9}%`, transform: `translateZ(${index * 3}px)` }}
                        animate={{ x: count % 2 === index % 2 ? [0, 2, 0] : [0, -2, 0] }}
                        transition={{ duration: 1.8 + index * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] bg-black/70 rounded border border-stone-800/50 overflow-hidden" style={{ height: `80%`}}>
                    <motion.div
                        className="absolute bottom-0 left-0 w-full bg-red-950"
                        animate={{ height: `${fill}%` }}
                        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                    />
                    <div className="absolute inset-0 deck-count-glow" />
                    <div className="absolute top-1 right-1 text-amber-400 text-[8px] md:text-[10px] font-rogue-number uppercase tracking-tighter drop-shadow-md">{count} Souls</div>
                    {typeof acesLeft === 'number' && <div className="absolute bottom-1 left-1 text-sky-300 text-[7px] md:text-[9px] font-rogue-number">A:{acesLeft}</div>}
                </div>
            </div>
        </motion.div>
    );
}

// Repositioned Discard Pile to top-left to avoid 'mystery square' look in center (was right with large calc)
const DiscardPile = ({count}: {count: number}) => (
    <motion.div
        className="discard-pile-highlight absolute top-[8%] left-[4%] md:top-[12%] md:left-[6%] w-14 h-20 md:w-28 md:h-36 flex flex-col items-center justify-end text-stone-600/40 text-[6px] md:text-[9px] font-black uppercase tracking-widest pointer-events-auto"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotate: count > 0 ? [-1, 1, -1] : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
        <div className="relative w-12 h-16 md:w-20 md:h-32" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div className="absolute inset-0 border border-stone-800 rounded-lg bg-black/20" animate={{ opacity: count > 0 ? [0.35, 0.65, 0.35] : 0.25 }} transition={{ duration: 2, repeat: Infinity }} />
            {Array.from({ length: Math.min(6, Math.max(0, count)) }).map((_, index) => (
                <div key={`discard-${index}`} className="absolute inset-0 rounded-lg border border-stone-700/50 bg-stone-900/20" style={{ transform: `translate(${index * 1.5}px, ${-index * 1.5}px) rotate(${index - 2}deg)` }} />
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl opacity-10 grayscale">🪦</div>
        </div>
        <p className="mt-1 font-rogue-number text-stone-500/60 drop-shadow-sm">{count} Buried</p>
    </motion.div>
);

const BlackjackTable = Object.assign(BlackjackTableInternal, {
  DealerHandContainer,
  PlayerHandsContainer,
  Hand: HandComponent,
  Shoe,
  DiscardPile,
}) as unknown as BlackjackTableComponent;

export default BlackjackTable;
