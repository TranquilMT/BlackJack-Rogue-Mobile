import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';
import { WheelOutcome } from '../types';

interface SpinWheelScreenProps {
  onComplete: (result: { outcome: WheelOutcome; payload?: any }) => void;
}

const segments = [
    { outcome: WheelOutcome.SMALL_SHARDS, value: "+25 Shards", icon: "🪙", color: "#374151", textColor: "#e5e7eb" },
    { outcome: WheelOutcome.PLAY_PLINKO, value: "Plinko", icon: "🎲", color: "#1e3a8a", textColor: "#93c5fd" },
    { outcome: WheelOutcome.INSTANT_BOON, value: "Essence", icon: "🩸", color: "#064e3b", textColor: "#86efac" },
    { outcome: WheelOutcome.SHARD_WINDFALL, value: "+75 Shards", icon: "💎", color: "#b45309", textColor: "#fffbeb" },
    { outcome: WheelOutcome.PLAY_HIGHLOW, value: "High/Low", icon: "🃏", color: "#1e3a8a", textColor: "#93c5fd" },
    { outcome: WheelOutcome.DAMAGE_BUFF, value: "Fury", icon: "⚔️", color: "#7f1d1d", textColor: "#fca5a5" },
    { outcome: WheelOutcome.SMALL_SHARDS, value: "+25 Shards", icon: "🪙", color: "#374151", textColor: "#e5e7eb" },
    { outcome: WheelOutcome.PLAY_DICEROLL, value: "Dice Roll", icon: "🎲", color: "#1e3a8a", textColor: "#93c5fd" },
    { outcome: WheelOutcome.JACKPOT, value: "Hoard", icon: "👑", color: "#4c1d95", textColor: "#e9d5ff" },
    { outcome: WheelOutcome.INSTANT_BOON, value: "Essence", icon: "🩸", color: "#064e3b", textColor: "#86efac" },
    { outcome: WheelOutcome.PLAY_SHELLGAME, value: "Shell Game", icon: "🤔", color: "#1e3a8a", textColor: "#93c5fd" },
    { outcome: WheelOutcome.PERMANENT_BUFF, value: "Ascension", icon: "✨", color: "#f7d5a1", textColor: "#451a03" },
    { outcome: WheelOutcome.BLACKJACK_WHEEL, value: "Blackjack Wheel", icon: "🎰", color: "#7c2d12", textColor: "#fef3c7" },
];


const SpinWheelScreen: React.FC<SpinWheelScreenProps> = ({ onComplete }) => {
    const controls = useAnimation();
    const [resultText, setResultText] = useState<string | null>(null);
    const [winningSegment, setWinningSegment] = useState<typeof segments[0] | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const segmentAngle = 360 / segments.length;

    const handleSpin = () => {
        if (isSpinning || hasFinished) return;
        setIsSpinning(true);

        const outcomeWeights = [
            { outcome: WheelOutcome.SMALL_SHARDS, weight: 25 },
            { outcome: WheelOutcome.SHARD_WINDFALL, weight: 10 },
            { outcome: WheelOutcome.INSTANT_BOON, weight: 20 },
            { outcome: WheelOutcome.PLAY_PLINKO, weight: 8 },
            { outcome: WheelOutcome.PLAY_HIGHLOW, weight: 8 },
            { outcome: WheelOutcome.PLAY_DICEROLL, weight: 8 },
            { outcome: WheelOutcome.PLAY_SHELLGAME, weight: 8 },
            { outcome: WheelOutcome.DAMAGE_BUFF, weight: 8 },
            { outcome: WheelOutcome.JACKPOT, weight: 3 },
            { outcome: WheelOutcome.BLACKJACK_WHEEL, weight: 5 },
            { outcome: WheelOutcome.PERMANENT_BUFF, weight: 2 },
        ];
        
        const totalWeight = outcomeWeights.reduce((acc, item) => acc + item.weight, 0);
        let randomNum = Math.random() * totalWeight;
        let selectedOutcome: WheelOutcome = WheelOutcome.SMALL_SHARDS;
        
        for (const item of outcomeWeights) {
            if (randomNum < item.weight) {
                selectedOutcome = item.outcome;
                break;
            }
            randomNum -= item.weight;
        }

        const possibleIndices = segments.map((s, i) => s.outcome === selectedOutcome ? i : -1).filter(i => i !== -1);
        const targetIndex = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
        const targetSegment = segments[targetIndex];

        const spins = 8;
        const targetRotation = -(targetIndex * segmentAngle + segmentAngle / 2);
        const randomOffset = (Math.random() * segmentAngle * 0.6) - (segmentAngle * 0.3); 
        const finalRotation = targetRotation - (360 * spins) + randomOffset;

        audioManager.playSound('wheel-spin');
        
        const tickInterval = setInterval(() => {
            audioManager.playSound('wheel-tick');
        }, 150);

        controls.start({
            rotate: finalRotation,
            transition: { duration: 5, ease: [0.15, 0.85, 0.35, 1] }
        }).then(() => {
            clearInterval(tickInterval);
            audioManager.playSound('wheel-win');
            
            setWinningSegment(targetSegment);
            setHasFinished(true);
            setIsSpinning(false);

            let payload: any = {};
            let text = '';
            
            switch (targetSegment.outcome) {
                case WheelOutcome.SMALL_SHARDS: payload = { shards: 25 }; text = "+25 Shards"; break;
                case WheelOutcome.SHARD_WINDFALL: payload = { shards: 75 }; text = "Trove of Shards! (+75)"; break;
                case WheelOutcome.INSTANT_BOON: payload = { hp: 20 }; text = "Essence Found! (+20 HP)"; break;
                case WheelOutcome.PLAY_PLINKO: text = "Chaos! Plinko awaits!"; break;
                case WheelOutcome.PLAY_HIGHLOW: text = "A game of High/Low!"; break;
                case WheelOutcome.PLAY_DICEROLL: text = "Roll the Dice!"; break;
                case WheelOutcome.PLAY_SHELLGAME: text = "Watch closely... Shell Game!"; break;
                case WheelOutcome.DAMAGE_BUFF: text = "Fury! (1.5x Dmg for 3 rds)"; break;
                case WheelOutcome.JACKPOT: payload = { relicCurrency: 3 }; text = "Hoard! +3 $RELIC!"; break;
                case WheelOutcome.BLACKJACK_WHEEL: payload = { shards: 200, relicCurrency: 5 }; text = "Blackjack Jackpot! +200 Shards, +5 $RELIC!"; break;
                case WheelOutcome.PERMANENT_BUFF: text = "Ascension! (+1 Perm. Dmg)"; break;
            }
            
            setResultText(text);
            
            setTimeout(() => {
                onCompleteRef.current({ outcome: targetSegment.outcome, payload });
            }, 3000);
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
                    <h2 className="relative text-5xl md:text-7xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-700 drop-shadow-[0_2px_0_#451a03] tracking-widest">
                        WHEEL OF FATE
                    </h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto mt-2"></div>
                </div>
                
                <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px]">
                    <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-gray-800 to-black border-[12px] border-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.8)]" />
                    
                    <div 
                        className={`absolute -top-12 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-2xl ${isSpinning ? 'animate-bounce' : ''}`}
                    >
                        <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-t-[60px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
                    </div>
                    
                    <motion.div
                        className="w-full h-full rounded-full overflow-hidden relative shadow-[0_0_30px_black] border-8 border-gray-800 bg-[#1a1a1a]"
                        animate={controls}
                        style={{ transformOrigin: 'center' }}
                    >
                        <div 
                            className="absolute inset-0 w-full h-full"
                            style={{
                                background: `conic-gradient(${segments.map((s, i) => `${s.color} ${(i * 100) / segments.length}% ${((i + 1) * 100) / segments.length}%`).join(', ')})`
                            }}
                        />

                        {segments.map((segment, i) => {
                            const rotation = (360 / segments.length) * i + (360 / segments.length) / 2;
                            return (
                                <div
                                    key={i}
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                    }}
                                >
                                    <div 
                                        className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center"
                                        style={{ transformOrigin: 'top center' }}
                                    >
                                        <span className="text-2xl md:text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1">{segment.icon}</span>
                                        <span className="font-bold font-serif-display text-[10px] md:text-xs uppercase tracking-widest text-center max-w-[60px] leading-tight" style={{ color: segment.textColor, textShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}>
                                            {segment.value}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full border-4 border-yellow-700/50 shadow-[0_0_20px_black] z-20 flex items-center justify-center">
                        {!isSpinning && !hasFinished ? (
                            <motion.button
                                onClick={handleSpin}
                                className="w-20 h-20 bg-yellow-600 rounded-full border-2 border-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_#fde047] animate-pulse-fast"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                SPIN
                            </motion.button>
                        ) : (
                            <div 
                                className="w-16 h-16 bg-yellow-950 rounded-full border border-yellow-700 flex items-center justify-center animate-pulse-slow"
                            >
                                <span className="text-3xl text-yellow-500 opacity-80 animate-pulse">✦</span>
                            </div>
                        )}
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
                            <div 
                                className="bg-black/80 px-10 py-6 rounded-md text-center backdrop-blur-md animate-pulse-slow"
                                style={{boxShadow: `0 0 15px ${winningSegment.textColor}`}}
                            >
                                <p className="text-sm uppercase tracking-[0.2em] font-bold mb-2" style={{color: winningSegment.textColor}}>{winningSegment.value}</p>
                                <p className="text-3xl md:text-4xl font-bold text-white font-serif-display text-shadow-lg">{resultText}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SpinWheelScreen;