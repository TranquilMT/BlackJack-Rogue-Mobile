
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';
import { hapticManager } from '../services/hapticManager';
import { getUniqueId } from '../game/state';

interface PlinkoScreenProps {
  onComplete: (rewards: { shards: number, xp: number, relicCurrency?: number }) => void;
  mode?: 'bonus' | 'menu'; // Added mode prop
  cost?: number; // Cost for menu mode
  userCurrency?: number; // Current shards for check
  onClose?: () => void; // For menu mode cancellation
}

const PEGS_ROWS = 8;
const BALL_RADIUS = 12;
const PEG_RADIUS = 5;

const PlinkoScreen: React.FC<PlinkoScreenProps> = ({ onComplete, mode = 'bonus', cost = 0, userCurrency = 0, onClose }) => {
    const [balls, setBalls] = useState<any[]>([]);
    const [totalShards, setTotalShards] = useState(0);
    const [totalXP, setTotalXP] = useState(0);
    const [totalRelicCurrency, setTotalRelicCurrency] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStarted, setHasStarted] = useState(mode === 'bonus'); // Auto-start in bonus mode

    const pegs = useMemo(() => {
        const pegArray: {x: number, y: number}[] = [];
        for (let row = 0; row < PEGS_ROWS; row++) {
            const numPegs = row + 2;
            for(let i = 0; i < numPegs; i++) {
                pegArray.push({
                    x: (i / (numPegs - 1)) * 300 - 150,
                    y: row * 40 + 50
                });
            }
        }
        return pegArray;
    }, []);

    const buckets = useMemo(() => {
        if (mode === 'menu') {
            // High stakes for menu gambling
            return [
                { value: 0, xp: 0, relic: 0, width: 1, color: '#ef4444', label: 'LOSS' },
                { value: 25, xp: 0, relic: 0, width: 1.5, color: '#facc15', label: '25💎' },
                { value: 0, xp: 0, relic: 1, width: 2, color: '#a855f7', label: '1 RELIC' },
                { value: 25, xp: 0, relic: 0, width: 1.5, color: '#facc15', label: '25💎' },
                { value: 0, xp: 0, relic: 0, width: 1, color: '#ef4444', label: 'LOSS' },
            ];
        }
        // Standard bonus mode
        return [
            { value: 10, xp: 5, relic: 0, width: 1, color: '#9333ea', label: '10💎' },
            { value: 20, xp: 10, relic: 0, width: 1.5, color: '#2563eb', label: '20💎' },
            { value: 50, xp: 25, relic: 0, width: 2, color: '#eab308', label: '50💎' },
            { value: 20, xp: 10, relic: 0, width: 1.5, color: '#2563eb', label: '20💎' },
            { value: 10, xp: 5, relic: 0, width: 1, color: '#9333ea', label: '10💎' },
        ];
    }, [mode]);

    const startGame = () => {
        if (mode === 'menu') {
            if (userCurrency < cost) {
                hapticManager.trigger('error');
                return;
            }
            audioManager.playSound('button-click');
        }
        setHasStarted(true);
        startDrop();
    };

    const startDrop = () => {
        const dropBall = (index: number) => {
            const maxBalls = mode === 'menu' ? 1 : 10;
            if (index >= maxBalls) {
                 setTimeout(() => setIsComplete(true), 3000);
                return;
            };
            
            const startX = Math.random() * 40 - 20;
            const id = getUniqueId();

            setBalls(prev => [...prev, {
                id,
                x: startX,
                y: -20,
                vx: Math.random() * 2 - 1,
                vy: 1,
                landed: false,
                trail: [], 
            }]);

            hapticManager.trigger('light');
            if (mode === 'bonus') {
                setTimeout(() => dropBall(index + 1), 600);
            } else {
                // Single ball for menu gamble
                setTimeout(() => setIsComplete(true), 3000);
            }
        };
        dropBall(0);
    };

    // Auto-start for bonus mode
    useEffect(() => {
        if (mode === 'bonus') startDrop();
    }, []);

    const handleBallLanded = (bucketIndex: number) => {
        const bucket = buckets[bucketIndex];
        setTotalShards(prev => prev + bucket.value);
        setTotalXP(prev => prev + bucket.xp);
        if (bucket.relic) setTotalRelicCurrency(prev => prev + bucket.relic);
        
        if (bucket.value > 0 || bucket.relic > 0) {
            hapticManager.trigger('success');
            audioManager.playSound('coin-pickup');
        } else {
            hapticManager.trigger('error'); // Loss sound
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center text-white"
        >
            <h1 className="text-5xl font-bold font-serif-display text-purple-400 mb-2" style={{textShadow: '0 0 20px #a855f7'}}>
                {mode === 'menu' ? 'High-Stakes Plinko' : 'Plinko Bonus!'}
            </h1>
            
            {mode === 'menu' && !hasStarted && (
                <div className="mb-4 text-center">
                    <p className="text-xl text-gray-300 mb-4">Gamble <span className="text-yellow-400">{cost} Shards</span> for a chance at <span className="text-purple-400">$RELIC</span>?</p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={startGame}
                            disabled={userCurrency < cost}
                            className="px-6 py-2 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Drop Ball ({cost})
                        </button>
                    </div>
                    {userCurrency < cost && <p className="text-red-500 mt-2">Not enough shards!</p>}
                </div>
            )}

            <div className="relative w-[320px] h-[450px] bg-gray-900/50 border-2 border-purple-500/50 rounded-lg mt-2 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                <svg width="320" height="450" className="absolute inset-0">
                    {pegs.map((peg, i) => (
                        <circle key={i} cx={peg.x + 160} cy={peg.y} r={PEG_RADIUS} fill="#a78bfa" className="drop-shadow-[0_0_3px_#fff]" />
                    ))}
                    {buckets.map((bucket, i) => {
                        const x = (i * 64);
                         return <rect key={i} x={x} y={PEGS_ROWS * 40 + 50} width={64} height={50} fill={`rgba(${bucket.relic > 0 ? '168, 85, 247' : bucket.value > 0 ? '234, 179, 8' : '239, 68, 68'}, ${0.1 + (i%3)*0.1})`} stroke={bucket.color} strokeWidth="2" />
                    })}
                </svg>

                {balls.map(ball => (
                   <Ball key={ball.id} ball={ball} pegs={pegs} onLanded={handleBallLanded} buckets={buckets} />
                ))}

                 <div className="absolute bottom-0 w-full flex justify-around items-center h-[50px]">
                    {buckets.map((b, i) => (
                        <div key={i} className={`text-center font-bold text-xs ${b.relic ? 'text-purple-400 animate-pulse' : b.value > 0 ? 'text-yellow-400' : 'text-red-500'}`}>
                            <p>{b.label}</p>
                        </div>
                    ))}
                </div>
            </div>

             <div className="mt-4 text-center">
                {(totalShards > 0 || mode === 'bonus') && <p className="text-2xl font-bold">Total Shards: <motion.span key={totalShards} initial={{scale: 1.5, color: '#fff'}} animate={{scale: 1, color: '#facc15'}} className="inline-block">{totalShards}</motion.span></p>}
                {(totalXP > 0) && <p className="text-2xl font-bold">Total XP: <span className="text-green-400">{totalXP}</span></p>}
                {(totalRelicCurrency > 0) && <p className="text-2xl font-bold">Total $RELIC: <motion.span key={totalRelicCurrency} initial={{scale: 1.5}} animate={{scale: 1}} className="text-purple-400 inline-block">{totalRelicCurrency}</motion.span></p>}
            </div>

            <AnimatePresence>
            {isComplete && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                        audioManager.playSound('button-click');
                        onComplete({ shards: totalShards, xp: totalXP, relicCurrency: totalRelicCurrency });
                    }}
                    className="mt-4 px-8 py-3 bg-purple-600 rounded-lg font-bold text-xl shadow-lg hover:bg-purple-500 hover:shadow-purple-500/50 transition-all"
                >
                    {mode === 'menu' ? 'Done' : 'Collect Rewards'}
                </motion.button>
            )}
            </AnimatePresence>

        </motion.div>
    );
};

const Ball = ({ ball, pegs, onLanded, buckets }: any) => {
    const [position, setPosition] = useState({ x: ball.x, y: ball.y });
    const [vx, setVx] = useState(ball.vx);
    const [vy, setVy] = useState(ball.vy);
    const [landed, setLanded] = useState(false);
    const [trail, setTrail] = useState<{x: number, y: number}[]>([]);

    useEffect(() => {
        if(landed) return;

        const interval = setInterval(() => {
            let newVx = vx;
            let newVy = vy + 0.15; // gravity slightly higher for weight
            let newX = position.x + newVx;
            let newY = position.y + newVy;
            
            // Wall collision
            if (newX < -150 + BALL_RADIUS || newX > 150 - BALL_RADIUS) {
                newVx = -newVx * 0.7;
                newX = position.x + newVx;
            }

            // Peg collision
            for(const peg of pegs) {
                const dx = newX - peg.x;
                const dy = newY - peg.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < BALL_RADIUS + PEG_RADIUS) {
                    newVx = (Math.random() - 0.5) * 5; // Random horizontal bounce
                    newVy *= 0.5; // Dampen vertical speed significantly on hit
                    hapticManager.trigger('light'); // Vibration on peg hit
                    break;
                }
            }
            
            // Bucket collision
            const bucketTop = PEGS_ROWS * 40 + 50;
            if (newY > bucketTop) {
                const bucketIndex = Math.floor((newX + 160) / 64);
                if (bucketIndex >= 0 && bucketIndex < buckets.length) {
                    onLanded(bucketIndex);
                    setLanded(true);
                    clearInterval(interval);
                    newY = bucketTop + 15;
                }
            }

            setVx(newVx);
            setVy(newVy);
            setPosition({ x: newX, y: newY });
            
            // Update trail
            setTrail(prev => [...prev.slice(-5), {x: newX, y: newY}]);

        }, 16);

        return () => clearInterval(interval);

    }, [position, vx, vy, pegs, landed]);

    return (
        <>
            {trail.map((t, i) => (
                <div key={i} className="absolute w-6 h-6 rounded-full bg-purple-400" 
                    style={{ left: '50%', top: 0, transform: `translate(${t.x}px, ${t.y}px) scale(${i/6})`, opacity: i/6 }} 
                />
            ))}
            <motion.div
                className="absolute w-6 h-6 rounded-full bg-white shadow-[0_0_10px_#d8b4fe]"
                style={{
                    left: '50%',
                    top: 0,
                }}
                animate={{
                    x: position.x,
                    y: position.y,
                }}
                transition={{ type: false }}
            />
        </>
    )
}


export default PlinkoScreen;
