import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import type { BossIntent, FloorModifierId, BossPassive } from '../types';

interface BossStatusProps {
  hp: number;
  maxHp: number;
  shield: number;
  isDesperate: boolean;
  floor: number;
  intent: BossIntent;
  isIntimidated: boolean;
  floorModifier: FloorModifierId;
  bossPassive: BossPassive;
  currentStage?: number;
}

const getIntentIcon = (intentId: string) => {
    switch (intentId) {
        case 'ATTACK_UP': return '⚔️';
        case 'SHIELD_UP': return '🛡️';
        case 'CURSED_SHUFFLE': return '🃏';
        case 'HAYMAKER': return '💥';
        case 'STUNNED': return '💫';
        default: return '❓';
    }
};

// Fix: Explicitly type as React.FC to include 'key' in prop definitions for mapping
const FlameParticle: React.FC<{ delay: number }> = ({ delay }) => (
    <div 
        className="absolute bottom-0 w-2 h-2 bg-orange-500 rounded-full animate-flame"
        style={{ left: `${Math.random() * 100}%`, animationDelay: `${delay}s` }}
    />
);

const BloodSplatter = () => (
    <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 1, scale: 0.5 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.5 }}
    >
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-red-600 rounded-full blur-xl opacity-50 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-red-800 rounded-full blur-md opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-red-700 rounded-full blur-lg opacity-50" />
    </motion.div>
);

const StatBar = ({ value, max, colorFrom, colorTo, isDesperate, isEnraged }: { value: number, max: number, colorFrom: string, colorTo: string, isDesperate?: boolean, isEnraged?: boolean }) => {
    const [lastValue, setLastValue] = React.useState(value);
    const [damageFlash, setDamageFlash] = React.useState(0);
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const lastPercentage = max > 0 ? (lastValue / max) * 100 : 0;

    React.useEffect(() => {
        if (value < lastValue) {
            setDamageFlash(lastPercentage - percentage);
        }
        const timeout = setTimeout(() => setLastValue(value), 600);
        return () => clearTimeout(timeout);
    }, [value, lastValue, percentage, lastPercentage]);

    return (
        <div className={`relative w-full bg-black/70 rounded-md h-4 md:h-5 mt-1 overflow-hidden border ${isEnraged ? 'border-orange-500 shadow-[0_0_15px_#f97316]' : isDesperate ? 'border-red-400/80' : 'border-amber-500/10'} shadow-inner`}>
            {/* Drain Bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-red-300 opacity-50"
              initial={{ width: `${lastPercentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Main Bar */}
            <motion.div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${isEnraged ? 'from-orange-600 to-red-600' : colorFrom} ${colorTo}`}
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Flame particles on health bar */}
            {isEnraged && Array.from({ length: 6 }).map((_, i) => (
                <FlameParticle key={i} delay={i * 0.15} />
            ))}

             {/* Damage Flash */}
            <AnimatePresence>
                {damageFlash > 0 && (
                     <motion.div
                        className="absolute top-0 h-full bg-white"
                        style={{ left: `${percentage}%`, width: `${damageFlash}%` }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        onAnimationComplete={() => setDamageFlash(0)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

const BossStatus = React.memo(({ hp, maxHp, shield, isDesperate, floor, intent, isIntimidated, floorModifier, bossPassive, currentStage = 1 }: BossStatusProps) => {
  const isElite = floorModifier === 'ELITE_ENCOUNTER';
  const isBossStage = currentStage % 3 === 0;
  const isMajor = floor % 5 === 0 || isBossStage;
  // Use boss passive or threshold to determine visual enrage
  const isEnraged = isMajor && hp < (maxHp * 0.5);
  
  const controls = useAnimation();
  const prevHp = React.useRef(hp);
  const [showSplatter, setShowSplatter] = React.useState(false);

  React.useEffect(() => {
      if (hp < prevHp.current) {
          setShowSplatter(true);
          setTimeout(() => setShowSplatter(false), 500);
          controls.start({
              backgroundColor: ['rgba(255,0,0,0.8)', 'rgba(0,0,0,0.6)'],
              scale: [1, 1.2, 0.9, 1.05, 1],
              rotate: [0, 8, -8, 4, -4, 0],
              x: [0, 15, -15, 8, -8, 0],
              y: [0, -10, 10, -5, 5, 0],
              transition: { duration: 0.6, ease: 'backOut' }
          });
      }
      prevHp.current = hp;
  }, [hp, controls]);

  const passiveDescriptions = {
      thorns: "Reflects 20% of damage taken.",
      resilient: "Immune to Intimidate."
  };

  const animationClass = isEnraged
    ? 'animate-boss-enraged'
    : isDesperate 
    ? 'animate-boss-desperate'
    : isElite || isMajor
    ? 'animate-boss-elite'
    : '';

  return (
    <motion.div 
      className={`boss-status-highlight rogue-panel absolute top-2 right-2 md:top-4 md:right-4 z-50 text-white p-1.5 md:p-3 rounded-xl w-[42%] max-w-[160px] md:max-w-none md:w-64 ${animationClass}`}
      animate={controls}
      style={!animationClass ? { borderColor: 'rgba(248, 196, 92, 0.18)' } : {}}
    >
      <div className="flex justify-between items-baseline relative z-10">
        <h3 className="text-[8px] md:text-sm font-bold text-stone-400 uppercase tracking-widest">F {floor} - S {currentStage}</h3>
        <h2 className={`text-xs md:text-lg font-bold font-serif-display tracking-wider ${isEnraged ? 'text-orange-500' : isElite ? 'text-purple-400' : isMajor ? 'text-red-600' : 'text-red-400'}`}>
            {isEnraged ? 'DEMON' : isElite ? 'Elite' : isMajor ? 'Boss' : 'Dealer'}
        </h2>
      </div>
      
      {showSplatter && <BloodSplatter />}

      <div className="relative z-10">
        <StatBar value={hp} max={maxHp} colorFrom="from-red-700" colorTo="to-orange-600" isDesperate={isDesperate} isEnraged={isEnraged} />
        <p className="absolute w-full h-full top-0 text-center font-black text-[10px] md:text-sm flex items-center justify-center font-rogue-number" style={{textShadow: '1px 1px 2px #000'}}>
          {hp} / {maxHp}
        </p>
      </div>

      {shield > 0 && (
          <div className="relative mt-0.5 md:mt-1">
            <StatBar value={shield} max={shield > 0 ? shield : 1} colorFrom="from-blue-600" colorTo="to-cyan-400" />
            <p className="absolute w-full h-full top-0 text-center font-black text-[10px] md:text-xs flex items-center justify-center text-white font-rogue-number" style={{textShadow: '1px 1px 1px #000'}}>
              {shield}
            </p>
          </div>
      )}

      <div className="mt-1 md:mt-2 space-y-1">
        <AnimatePresence>
            {isEnraged && (
                 <motion.div className="bg-orange-950/60 p-0.5 md:p-1 rounded-md text-center border border-orange-500/50" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <p className="text-[8px] md:text-[10px] font-black text-orange-400 uppercase animate-pulse">Fury</p>
                </motion.div>
            )}
            {bossPassive && (
                 <motion.div className="bg-purple-900/60 p-1 md:p-2 rounded-md text-center border border-purple-400/50" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                    <p className="text-[10px] md:text-sm font-bold text-purple-300 capitalize">{bossPassive}</p>
                </motion.div>
            )}
            {isIntimidated && (
                 <motion.div className="bg-black/60 p-1 md:p-2 rounded-md text-center border border-indigo-400/50" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
                    <p className="text-[10px] md:text-sm font-bold text-indigo-300">INTIMIDATED</p>
                </motion.div>
            )}
          {intent && intent.id !== 'NONE' && !isIntimidated && (
            <motion.div 
                className="bg-black/80 p-1.5 md:p-2.5 rounded-md text-center border border-yellow-500/50 flex flex-col items-center justify-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.2)]" 
                initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
            >
                <div className="flex items-center gap-2">
                    <span 
                        className="text-lg md:text-xl drop-shadow-md animate-wiggle"
                    >
                        {getIntentIcon(intent.id)}
                    </span>
                    <p className="text-[10px] md:text-sm font-bold text-yellow-300 tracking-wide uppercase">{intent.name}</p>
                </div>
                {intent.description && (
                    <p className="text-[8px] md:text-[10px] text-stone-400 leading-tight max-w-[140px]">{intent.description}</p>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default BossStatus;