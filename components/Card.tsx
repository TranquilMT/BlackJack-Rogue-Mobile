import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../types';
import { Suit, CardModifierId } from '../types';

interface CardProps {
  card: CardType;
  style?: React.CSSProperties;
  className?: string;
  isActive?: boolean;
  cardBack?: string;
  onBurn?: (cardId: string) => void;
  isFaceDown?: boolean;
}

const SuitIcon = ({ suit, color, ...props }: { suit: Suit; color: string;[key: string]: any }) => {
  const icons = {
    [Suit.Spades]: '♠',
    [Suit.Clubs]: '♣',
    [Suit.Diamonds]: '♦',
    [Suit.Hearts]: '♥',
  };
  return <span style={{ color }} {...props}>{icons[suit]}</span>;
};

const CardBack = ({ design }: { design: string }) => {
    switch(design) {
        case 'nebula':
            return (
                <div className="w-full h-full rounded-lg bg-indigo-900 border-2 border-purple-500/50" style={{background: 'radial-gradient(ellipse at center, #5b21b6 0%, #1e1b4b 100%)'}}>
                    <div className="absolute inset-0 opacity-50" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)'}}></div>
                </div>
            )
        case 'royal':
            return (
                <div className="w-full h-full rounded-lg bg-blue-900 border-2 border-yellow-400/50 flex items-center justify-center">
                    <div className="text-4xl text-yellow-300" style={{textShadow: '0 0 5px #facc15'}}>👑</div>
                </div>
            )
        default:
             return (
                 <div className="relative w-full h-full bg-gray-900 rounded-lg border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-red-600 rounded-full" style={{boxShadow: '0 0 15px #dc2626, inset 0 0 10px #dc2626'}}></div>
                    <div className="absolute w-1 h-12 md:w-1.5 md:h-16 bg-red-600" style={{boxShadow: '0 0 15px #dc2626'}}></div>
                    <div className="absolute w-12 h-1 md:w-16 md:h-1.5 bg-red-600" style={{boxShadow: '0 0 15px #dc2626'}}></div>
                </div>
             )
    }
}

const BloodEffect = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-10">
        <div 
            className="absolute top-0 left-1/4 w-1 bg-red-800 rounded-b-full opacity-80 animate-blood-drip-1"
        />
        <div 
            className="absolute top-0 right-1/3 w-1.5 bg-red-900 rounded-b-full opacity-90 animate-blood-drip-2"
        />
    </div>
);

const HolographicSheen = () => (
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg z-20" style={{ mixBlendMode: 'overlay' }} />
);

const GlitchEffect = () => (
    <div 
        className="absolute inset-0 bg-emerald-500/20 mix-blend-color-dodge pointer-events-none rounded-lg z-10 animate-glitch"
    />
);

const ModifierFace = ({ modifier }: { modifier: CardModifierId }) => {
    switch(modifier) {
        case CardModifierId.THE_REAPER:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-red-600">
                    <BloodEffect />
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] relative z-20">💀</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-red-500 relative z-20">Reaper</div>
                    <div className="text-[10px] text-gray-400 relative z-20">-6 HP</div>
                </div>
            );
        case CardModifierId.THE_GUARDIAN:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950 text-blue-300">
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_10px_rgba(147,197,253,0.8)] relative z-20">🛡️</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-blue-200 relative z-20">Guardian</div>
                    <div className="text-[10px] text-gray-400 relative z-20">+15 Shield</div>
                </div>
            );
        case CardModifierId.THE_JESTER:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-purple-950 text-yellow-400 overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #fbbf24 10%, transparent 10%)', backgroundSize: '10px 10px'}}></div>
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] relative z-10">🎭</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-yellow-300 relative z-10">Jester</div>
                    <div className="text-[10px] text-gray-300 relative z-10">+40 Shards</div>
                </div>
            );
        case CardModifierId.THE_ABYSS:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-500">
                    <div className="text-5xl md:text-6xl animate-pulse grayscale opacity-80 relative z-20">⚫</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-gray-400 relative z-20">The Void</div>
                    <div className="text-[10px] text-red-900 font-bold relative z-20">Shield Break</div>
                </div>
            );
        case CardModifierId.THE_BERSERKER:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950 text-red-200">
                    <BloodEffect />
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse relative z-20">🩸</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-red-400 relative z-20">Berserker</div>
                    <div className="text-[10px] text-red-300 font-bold relative z-20">-4 HP / +2 Dmg</div>
                </div>
            );
        case CardModifierId.THE_ALCHEMIST:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950 text-emerald-200">
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] relative z-20">⚗️</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-emerald-400 relative z-20">Alchemist</div>
                    <div className="text-[10px] text-emerald-300 relative z-20">+25 Shards / Boss Heal</div>
                </div>
            );
        case CardModifierId.THE_ORACLE:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950 text-indigo-200">
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] relative z-20">👁️</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-indigo-400 relative z-20">Oracle</div>
                    <div className="text-[10px] text-indigo-300 relative z-20">Reveal Dealer</div>
                </div>
            );
        case CardModifierId.THE_VAMPIRE:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 text-white">
                    <BloodEffect />
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#000] relative z-20">🧛</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-red-300 relative z-20">Vampire</div>
                    <div className="text-[10px] text-white/80 relative z-20">Lifesteal On Draw</div>
                </div>
            );
        case CardModifierId.THE_VOIDWALKER:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-violet-950 text-violet-200">
                    <div className="text-5xl md:text-6xl blur-[1px] relative z-20">👻</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-violet-300 relative z-20">Void</div>
                    <div className="text-[10px] text-violet-300 relative z-20">1 Value / +Focus</div>
                </div>
            );
        case CardModifierId.THE_TIMEWARP:
             return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-950 text-yellow-200">
                    <div className="text-5xl md:text-6xl relative z-20">⏳</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-yellow-300 relative z-20">Timewarp</div>
                    <div className="text-[10px] text-yellow-400 relative z-20">Reshuffles Discard</div>
                </div>
            );
        case CardModifierId.THE_MAGNET:
            return (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-200">
                   <div className="text-5xl md:text-6xl animate-pulse relative z-20">🧲</div>
                   <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-slate-300 relative z-20">Magnet</div>
                   <div className="text-[10px] text-slate-400 relative z-20">Draws another card</div>
               </div>
           );
        case CardModifierId.THE_SUN:
            return (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-200 text-amber-900">
                   <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#f59e0b] relative z-20">☀️</div>
                   <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-amber-800 relative z-20">The Sun</div>
                   <div className="text-[10px] text-amber-700 font-bold relative z-20">+15 Heal / +15 Dmg</div>
               </div>
           );
        case CardModifierId.THE_JUDGEMENT:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-950 text-amber-200">
                    <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] relative z-20">⚖️</div>
                    <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-amber-400 relative z-20">Judgement</div>
                    <div className="text-[10px] text-amber-300 relative z-20">2x Score Damage</div>
                </div>
            );
        case CardModifierId.THE_EMPEROR:
            return (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-stone-200">
                   <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#a8a29e] relative z-20">👑</div>
                   <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-stone-300 relative z-20">Emperor</div>
                   <div className="text-[10px] text-stone-400 relative z-20">+10 Shield / +10 Shards</div>
               </div>
           );
        case CardModifierId.THE_EMPRESS:
            return (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-pink-950 text-pink-200">
                   <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#f472b6] relative z-20">🌸</div>
                   <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-pink-300 relative z-20">Empress</div>
                   <div className="text-[10px] text-pink-400 relative z-20">+10 HP / +10 Focus</div>
               </div>
           );
        case CardModifierId.THE_CLONE:
            return (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950 text-emerald-200">
                   <div className="text-5xl md:text-6xl drop-shadow-[0_0_15px_#34d399] relative z-20">🧬</div>
                   <div className="font-serif-display font-bold text-xs md:text-sm mt-1 uppercase tracking-widest text-emerald-300 relative z-20">Clone</div>
                   <div className="text-[10px] text-emerald-400 relative z-20">Copy Next Card</div>
               </div>
           );
        default: return null;
    }
}

const getModifierStyles = (modifier: CardModifierId) => {
    switch(modifier) {
        case CardModifierId.THE_BERSERKER: 
        case CardModifierId.THE_REAPER:
        case CardModifierId.THE_VAMPIRE:
            return { borderColor: 'border-red-600', shadow: 'rgba(220, 38, 38, 0.8)' };
        case CardModifierId.THE_GUARDIAN: 
            return { borderColor: 'border-blue-500', shadow: 'rgba(59, 130, 246, 0.8)' };
        case CardModifierId.THE_ALCHEMIST:
        case CardModifierId.THE_JUDGEMENT:
            return { borderColor: 'border-amber-500', shadow: 'rgba(245, 158, 11, 0.8)' };
        case CardModifierId.THE_VOIDWALKER:
            return { borderColor: 'border-violet-500', shadow: 'rgba(139, 92, 246, 0.8)' };
        case CardModifierId.THE_ABYSS:
            return { borderColor: 'border-gray-800', shadow: 'rgba(75, 85, 99, 0.8)' };
        case CardModifierId.THE_JESTER:
            return { borderColor: 'border-yellow-500', shadow: 'rgba(234, 179, 8, 0.8)' };
        case CardModifierId.THE_ORACLE:
            return { borderColor: 'border-indigo-500', shadow: 'rgba(99, 102, 241, 0.8)' };
        case CardModifierId.THE_TIMEWARP:
             return { borderColor: 'border-yellow-600', shadow: 'rgba(202, 138, 4, 0.8)' };
        case CardModifierId.THE_MAGNET:
             return { borderColor: 'border-slate-500', shadow: 'rgba(100, 116, 139, 0.8)' };
        case CardModifierId.THE_SUN:
             return { borderColor: 'border-amber-500', shadow: 'rgba(245, 158, 11, 0.8)' };
        case CardModifierId.THE_EMPEROR:
             return { borderColor: 'border-stone-500', shadow: 'rgba(168, 162, 158, 0.8)' };
        case CardModifierId.THE_EMPRESS:
             return { borderColor: 'border-pink-500', shadow: 'rgba(236, 72, 153, 0.8)' };
        case CardModifierId.THE_CLONE:
             return { borderColor: 'border-emerald-500', shadow: 'rgba(52, 211, 153, 0.8)' };
        default:
            return { borderColor: 'border-purple-500', shadow: 'rgba(168, 85, 247, 0.8)' };
    }
}

const Card = React.memo(({ card, style, className, isActive, cardBack = 'default', onBurn, isFaceDown = false }: CardProps) => {
  const { suit, rank, tell, modifier } = card;
  const isRed = suit === Suit.Diamonds || suit === Suit.Hearts;
  const color = isRed ? '#dc2626' : '#171717';

  const cardRef = useRef<HTMLDivElement>(null);
  const [shadowOffset, setShadowOffset] = useState({ x: 5, y: 10 });
  const [showBurn, setShowBurn] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate dynamic shadow offset based on position relative to center
        const dx = (rect.left + rect.width / 2 - centerX) / 20;
        const dy = (rect.top + rect.height / 2 - centerY) / 20;
        
        setShadowOffset({ x: dx, y: dy + 15 });
    }
  }, [isActive, card.id]);


  const modStyles = modifier ? getModifierStyles(modifier) : null;

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-16 h-24 md:w-24 md:h-36 rounded-lg ${modifier ? 'modifier-card-frame' : ''} ${isFaceDown ? 'card-face-down' : ''} ${className ?? ''}`}
      style={{ 
          perspective: '1000px', 
          ...style, 
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity' // Force GPU promotion
      }}
      initial={false}
      animate={{
        scale: isActive ? 1.15 : 1,
        rotateZ: isActive ? -3 : 0,
        rotateY: isFaceDown ? 0 : 0,
        y: isActive ? -15 : 0,
        z: 0
      }}
      whileHover={{
        scale: 1.3,
        y: -25,
        rotateX: 15,
        rotateY: (Math.random() - 0.5) * 15, // Slight random tilt
        zIndex: 50,
        boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.6), 0 15px 15px -5px rgba(0, 0, 0, 0.4)'
      }}
      whileTap={{ scale: 0.85, rotateX: -10 }}
      transition={{
        default: { type: 'spring', stiffness: 500, damping: 20 }
      }}
      onMouseEnter={() => setShowBurn(true)}
      onMouseLeave={() => setShowBurn(false)}
    >
      {/* 2.5D Realistic Shadow */}
      <motion.div 
        className="absolute inset-1 bg-black/40 blur-md rounded-lg z-[-1]"
        animate={{
            x: shadowOffset.x,
            y: shadowOffset.y,
            scale: isActive ? 1.1 : 1,
            opacity: 0.4
        }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Front Face */}
      <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {isFaceDown ? (
            <CardBack design={cardBack || 'default'} />
        ) : (
            <div
            className={`relative w-full h-full bg-gray-200 rounded-lg border-2 flex items-center justify-center p-1 overflow-hidden ${modStyles ? modStyles.borderColor : 'border-gray-400'} ${isActive || modifier ? 'card-sheen' : ''}`}
            >
            {showBurn && onBurn && (
                <button 
                className="absolute top-0 right-0 z-50 bg-red-600 text-white text-[8px] p-0.5 rounded-bl-lg"
                onClick={(e) => { e.stopPropagation(); onBurn(card.id); }}
                >
                Burn
                </button>
            )}
            <HolographicSheen />
            {modifier && <div className="absolute inset-0 pointer-events-none z-30 modifier-rune-sweep" />}
            {modifier ? (
                <>
                    <ModifierFace modifier={modifier} />
                    <div 
                        className="absolute inset-0 pointer-events-none rounded-lg z-20 animate-pulse-slow"
                        style={{
                            boxShadow: `inset 0 0 15px ${modStyles?.shadow}`
                        }}
                    />
                    {card.isCloned && (
                        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-emerald-400 z-30 flex items-center justify-center">
                            <GlitchEffect />
                            <div className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold px-1 py-0.5 rounded shadow-lg transform -rotate-12 uppercase tracking-widest">
                                Cloned
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="absolute inset-0 bg-white/50 opacity-50" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)'}}></div>
                    <div className="absolute top-1 left-1 md:left-2 text-left">
                        <div className="font-bold text-xs md:text-sm pixel-text-shadow-white font-vt323" style={{ color, textShadow: `0 0 5px ${color}` }}>{rank}</div>
                        <SuitIcon suit={suit} color={color} className="text-xs md:text-sm" />
                    </div>
                    <div className="absolute bottom-1 right-1 md:right-2 text-right transform rotate-180">
                        <div className="font-bold text-xs md:text-sm pixel-text-shadow-white font-vt323" style={{ color, textShadow: `0 0 5px ${color}` }}>{rank}</div>
                        <SuitIcon suit={suit} color={color} className="text-xs md:text-sm" />
                    </div>
                    <SuitIcon suit={suit} color={color} className="text-3xl md:text-5xl opacity-80" />
                    {card.isCloned && (
                        <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-emerald-400 z-30 flex items-center justify-center">
                            <GlitchEffect />
                            <div className="bg-emerald-900/80 text-emerald-300 text-[10px] font-bold px-1 py-0.5 rounded shadow-lg transform -rotate-12 uppercase tracking-widest">
                                Cloned
                            </div>
                        </div>
                    )}
                </>
            )}
            </div>
        )}
      </div>

      {/* Back Face - Removed as per user request */}
    </motion.div>
  );
});

export default Card;