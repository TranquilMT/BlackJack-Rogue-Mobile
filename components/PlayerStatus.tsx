
import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface PlayerStatusProps {
  hp: number;
  maxHp: number;
  shield: number;
  runCurrency: number;
  focus: number;
  maxFocus: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

const StatBar = ({ value, max, colorFrom, colorTo }: { value: number, max: number, colorFrom: string, colorTo: string }) => {
    const [lastValue, setLastValue] = React.useState(value);
    const [damageFlash, setDamageFlash] = React.useState(0);
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const lastPercentage = max > 0 ? (lastValue / max) * 100 : 0;

    React.useEffect(() => {
        if (value < lastValue) {
            setDamageFlash(lastPercentage - percentage); // Flash width is the amount of damage
        }
        const timeout = setTimeout(() => setLastValue(value), 600);
        return () => clearTimeout(timeout);
    }, [value, lastValue, lastPercentage, percentage]);

    return (
        <div className="relative w-full bg-black/70 rounded-md h-4 md:h-5 mt-1 overflow-hidden border border-amber-500/10 shadow-inner">
            {/* Drain Bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gray-400 opacity-70"
              initial={{ width: `${lastPercentage}%` }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Main Bar */}
            <motion.div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorFrom} ${colorTo}`}
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
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
            {/* Sheen */}
            <div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-md">
                 <div 
                    className="absolute top-0 h-full w-1/2 bg-gradient-to-r from-white/20 to-transparent animate-sheen"
                 />
            </div>
        </div>
    );
}

const PlayerStatus = React.memo(({ hp, maxHp, shield, runCurrency, focus, maxFocus, level, xp, xpToNextLevel }: PlayerStatusProps) => {
  const controls = useAnimation();
  const prevHp = React.useRef(hp);

  React.useEffect(() => {
    if (hp < prevHp.current) {
        controls.start({
            scale: [1, 1.15, 0.95, 1.05, 1],
            rotate: [0, -5, 5, -3, 3, 0],
            x: [0, -10, 10, -5, 5, 0],
            y: [0, 5, -5, 2, -2, 0],
            backgroundColor: ['rgba(255,0,0,0.5)', 'rgba(0,0,0,0.6)'],
            transition: { duration: 0.6, ease: 'backOut' }
        });
    }
    prevHp.current = hp;
  }, [hp, controls]);

  return (
    <motion.div 
      animate={controls}
      className="player-status-highlight rogue-panel absolute top-2 left-2 md:top-4 md:left-4 z-50 text-white p-1.5 md:p-3 rounded-xl w-[42%] max-w-[160px] md:max-w-none md:w-64"
    >
      <div className="flex justify-between items-baseline">
        <h2 className="text-xs md:text-lg font-bold text-cyan-200 font-serif-display tracking-wider uppercase">Rogue</h2>
        <p className="text-[10px] md:text-sm font-bold text-amber-300">Lvl {level}</p>
      </div>
      <div className="relative">
        <StatBar value={hp} max={maxHp} colorFrom="from-red-700" colorTo="to-red-500" />
        <p className="absolute w-full h-full top-0 text-center font-black text-[10px] md:text-sm flex items-center justify-center font-rogue-number" style={{textShadow: '1px 1px 2px #000'}}>
          {hp} / {maxHp}
        </p>
      </div>

       {shield > 0 && (
          <div className="relative mt-0.5 md:mt-1">
            <StatBar value={shield} max={Math.max(30, shield)} colorFrom="from-blue-600" colorTo="to-cyan-400" />
            <p className="absolute w-full h-full top-0 text-center font-black text-[10px] md:text-xs flex items-center justify-center text-white font-rogue-number" style={{textShadow: '1px 1px 1px #000'}}>
              {shield}
            </p>
          </div>
      )}
      
      <div className="relative mt-0.5 md:mt-1">
        <StatBar value={focus} max={maxFocus} colorFrom="from-purple-600" colorTo="to-indigo-400" />
        <p className="absolute w-full h-full top-0 text-center font-black text-[10px] md:text-sm flex items-center justify-center font-rogue-number" style={{textShadow: '1px 1px 2px #000'}}>
          {focus}
        </p>
      </div>

       <div className="relative mt-0.5 md:mt-1">
        <StatBar value={xp} max={xpToNextLevel} colorFrom="from-yellow-600" colorTo="to-amber-400" />
        <p className="absolute w-full h-full top-0 text-center font-bold text-[10px] md:text-sm flex items-center justify-center" style={{textShadow: '1px 1px 2px #000'}}>
          XP
        </p>
      </div>

      <div className="mt-1 md:mt-2 text-right">
        <p className="text-[10px] md:text-sm text-yellow-300 font-rogue-number">
          <span className="font-black">{runCurrency}</span> 💎
        </p>
      </div>
    </motion.div>
  );
});

export default PlayerStatus;
