
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';

interface DailySpinWheelProps {
  onComplete: (result: { payload: any }) => void;
}

const segments = [
    { type: 'shards', value: 50, icon: "🪙", color: "#374151", textColor: "#e5e7eb" },
    { type: 'shards', value: 100, icon: "💰", color: "#1e3a8a", textColor: "#93c5fd" },
    { type: 'shards', value: 150, icon: "💎", color: "#064e3b", textColor: "#86efac" },
    { type: 'relic', value: 1, icon: "✨", color: "#b45309", textColor: "#fffbeb" },
    { type: 'shards', value: 75, icon: "🪙", color: "#374151", textColor: "#e5e7eb" },
    { type: 'shards', value: 125, icon: "💰", color: "#1e3a8a", textColor: "#93c5fd" },
    { type: 'shards', value: 50, icon: "🪙", color: "#374151", textColor: "#e5e7eb" },
    { type: 'shards', value: 250, icon: "👑", color: "#4c1d95", textColor: "#e9d5ff" },
];


const DailySpinWheel: React.FC<DailySpinWheelProps> = ({ onComplete }) => {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultText, setResultText] = useState<string | null>(null);
    const [winningSegment, setWinningSegment] = useState<typeof segments[0] | null>(null);

    const segmentAngle = 360 / segments.length;

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        audioManager.playSound('button-click');

        const outcomeWeights = [
            { type: 'shards', value: 50, weight: 30 },
            { type: 'shards', value: 75, weight: 20 },
            { type: 'shards', value: 100, weight: 15 },
            { type: 'shards', value: 125, weight: 10 },
            { type: 'shards', value: 150, weight: 8 },
            { type: 'shards', value: 250, weight: 5 },
            { type: 'relic', value: 1, weight: 2 }, // Rare
        ];
        
        const totalWeight = outcomeWeights.reduce((acc, item) => acc + item.weight, 0);
        let randomNum = Math.random() * totalWeight;
        let selectedOutcome = outcomeWeights[0];
        
        for (const item of outcomeWeights) {
            if (randomNum < item.weight) {
                selectedOutcome = item;
                break;
            }
            randomNum -= item.weight;
        }

        const possibleIndices = segments.map((s, i) => (s.type === selectedOutcome.type && s.value === selectedOutcome.value) ? i : -1).filter(i => i !== -1);
        const targetIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
        const targetSegment = segments[targetIndex];

        const spins = 5;
        const baseTargetRotation = -(targetIndex * segmentAngle) - 90 - (360 * spins);
        const randomOffset = (Math.random() * segmentAngle * 0.8) - (segmentAngle * 0.4); 
        const finalRotation = baseTargetRotation + randomOffset;

        const tickInterval = setInterval(() => {
            audioManager.playSound('wheel-tick');
        }, 100);

        controls.start({
            rotate: finalRotation,
            transition: { duration: 4.5, ease: [0.15, 0.85, 0.35, 1] }
        }).then(() => {
            clearInterval(tickInterval);
            audioManager.playSound('wheel-win');
            
            setWinningSegment(targetSegment);

            let payload: any = {};
            let text = '';
            
            if (targetSegment.type === 'shards') {
                payload = { shards: targetSegment.value };
                text = `You won ${targetSegment.value} Shards!`;
            } else if (targetSegment.type === 'relic') {
                payload = { relicCurrency: targetSegment.value };
                text = `JACKPOT! You won ${targetSegment.value} $RELIC!`;
            }
            
            setResultText(text);
            
            setTimeout(() => {
                onComplete({ payload });
            }, 2500);
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
        >
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-8 text-center">
                    <h2 className="relative text-5xl md:text-7xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-indigo-700 drop-shadow-[0_2px_0_#1e1b4b] tracking-widest">
                        DAILY SPIN
                    </h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-indigo-600 to-transparent mx-auto mt-2"></div>
                </div>
                
                <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px]">
                    <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-gray-800 to-black border-[12px] border-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.8)]" />
                    <motion.div 
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-2xl"
                        animate={{ scale: [1, 1.1, 1], filter: ['drop-shadow(0 0 8px #a5b4fc)', 'drop-shadow(0 0 15px #a5b4fc)', 'drop-shadow(0 0 8px #a5b4fc)'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-t-[60px] border-l-transparent border-r-transparent border-t-indigo-300"></div>
                    </motion.div>
                    
                    
                    {!isSpinning && !resultText && (
                        <button 
                            onClick={handleSpin}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-xl shadow-2xl border-2 border-indigo-300 transition-all transform hover:scale-105 active:scale-95"
                        >
                            SPIN!
                        </button>
                    )}

                    <motion.div
                        className="w-full h-full rounded-full overflow-hidden relative shadow-[0_0_30px_black] border-8 border-gray-800 bg-[#1a1a1a]"
                        animate={controls}
                        style={{ transformOrigin: 'center' }}
                    >
                        {segments.map((segment, i) => {
                            const rotation = (360 / segments.length) * i;
                            const skew = 90 - (360 / segments.length);
                            return (
                                <div
                                    key={i}
                                    className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                                    style={{
                                        transform: `rotate(${rotation}deg) skewY(${skew}deg)`,
                                        background: segment.color,
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.7)',
                                    }}
                                >
                                    <div 
                                        className="absolute left-0 bottom-0 w-full h-full flex flex-col items-center justify-center"
                                        style={{ transform: `skewY(-${skew}deg) rotate(${segmentAngle / 2}deg) translate(25%, 25%)` }}
                                    >
                                        <div className="transform -rotate-90 flex flex-col items-center">
                                            <span className="text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1">{segment.icon}</span>
                                            <span className="font-black font-serif-display text-base md:text-lg uppercase tracking-widest font-rogue-number" style={{ color: segment.textColor, textShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}>
                                                {segment.type === 'relic' ? `${segment.value} $RELIC` : `+${segment.value}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full border-4 border-indigo-700/50 shadow-[0_0_20px_black] z-20 flex items-center justify-center pointer-events-none">
                        <motion.div 
                            className="w-16 h-16 bg-indigo-950 rounded-full border border-indigo-700 flex items-center justify-center"
                            animate={{boxShadow: ['0 0 10px #a5b4fc', '0 0 25px #a5b4fc', '0 0 10px #a5b4fc']}}
                            transition={{duration: 1.5, repeat: Infinity}}
                        >
                            <span className="text-3xl text-indigo-400 opacity-80 animate-pulse">✦</span>
                        </motion.div>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {resultText && winningSegment && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute bottom-20 z-30"
                    >
                        <div className="bg-gradient-to-b from-gray-800 to-gray-950 p-1 rounded-lg border shadow-[0_0_50px_rgba(0,0,0,0.9)]" style={{borderColor: winningSegment.textColor}}>
                            <motion.div 
                                className="bg-black/80 px-10 py-6 rounded-md text-center backdrop-blur-md"
                                animate={{boxShadow: [`0 0 25px ${winningSegment.textColor}`, `0 0 10px ${winningSegment.textColor}`]}}
                                transition={{duration: 1.5, repeat: Infinity, repeatType: 'reverse'}}
                            >
                                <p className="text-3xl md:text-4xl font-bold text-white font-serif-display text-shadow-lg">{resultText}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DailySpinWheel;