
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../services/audioManager';
import { Card, Rank, Suit } from '../types';
import CardComponent from './Card';
import { getCardValue, shuffleDeck, createDeck } from '../game/logic';

// --- High / Low Game ---
interface HighLowProps {
    onComplete: (rewards: { shards: number, xp: number }) => void;
}

export const HighLowGame: React.FC<HighLowProps> = ({ onComplete }) => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [nextCard, setNextCard] = useState<Card | null>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'revealed' | 'finished'>('start');
    const [message, setMessage] = useState("Guess if the next card is Higher or Lower!");
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const newDeck = shuffleDeck(createDeck()).slice(0, 10);
        setDeck(newDeck);
        setCurrentCard(newDeck[0]);
    }, []);

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (!deck || deck.length < 2) return;
        const next = deck[1];
        setNextCard(next);
        setGameState('revealed');
        audioManager.playSound('card-deal');

        setTimeout(() => {
            const currentVal = getCardValue(currentCard!).low;
            const nextVal = getCardValue(next).low;
            
            let won = false;
            if (guess === 'higher' && nextVal >= currentVal) won = true;
            else if (guess === 'lower' && nextVal <= currentVal) won = true;

            if (won) {
                setMessage("Correct!");
                audioManager.playSound('win-hand');
                setStreak(s => s + 1);
                setTimeout(() => {
                    const remaining = deck.slice(1);
                    if (remaining.length > 1 && streak < 4) { // Max 5 rounds
                        setDeck(remaining);
                        setCurrentCard(next);
                        setNextCard(null);
                        setGameState('playing');
                        setMessage("Next Round...");
                    } else {
                        finishGame(streak + 1);
                    }
                }, 1500);
            } else {
                setMessage("Wrong!");
                audioManager.playSound('lose-hand');
                setTimeout(() => finishGame(streak), 1500);
            }
        }, 1000);
    };

    const finishGame = (finalStreak: number) => {
        setGameState('finished');
        const shards = finalStreak * 20;
        const xp = finalStreak * 10;
        setMessage(`Game Over! Won ${shards} Shards!`);
        setTimeout(() => onComplete({ shards, xp }), 2000);
    };

    return (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-[150]">
            <h2 className="text-4xl font-bold font-serif-display text-blue-400 mb-8">High / Low</h2>
            <div className="flex gap-8 items-center mb-8">
                {currentCard && <div className="scale-125"><CardComponent card={currentCard} /></div>}
                <div className="text-4xl font-bold text-gray-500">?</div>
                {nextCard ? (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="scale-125">
                        <CardComponent card={nextCard} />
                    </motion.div>
                ) : (
                    <div className="w-24 h-36 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-700">Next</div>
                )}
            </div>
            
            <p className="text-xl mb-8 h-8 text-center">{message}</p>

            {gameState === 'start' || gameState === 'playing' ? (
                <div className="flex gap-4">
                    <button onClick={() => { if(gameState==='start') setGameState('playing'); handleGuess('higher'); }} className="px-8 py-3 bg-green-600 rounded-lg font-bold text-xl hover:bg-green-500">HIGHER ▲</button>
                    <button onClick={() => { if(gameState==='start') setGameState('playing'); handleGuess('lower'); }} className="px-8 py-3 bg-red-600 rounded-lg font-bold text-xl hover:bg-red-500">LOWER ▼</button>
                </div>
            ) : null}
        </div>
    );
};

// --- Dice Roll Game ---
interface DiceRollProps {
    onComplete: (rewards: { shards: number, xp: number, relicCurrency?: number }) => void;
}

export const DiceRollGame: React.FC<DiceRollProps> = ({ onComplete }) => {
    const [dice, setDice] = useState([1, 1]);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState<'pending' | 'win' | 'loss'>('pending');

    const rollDice = () => {
        setRolling(true);
        audioManager.playSound('wheel-tick'); // Simulate rattling
        
        let count = 0;
        const interval = setInterval(() => {
            setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
            count++;
            if (count > 10) {
                clearInterval(interval);
                finishRoll();
            }
        }, 100);
    };

    const finishRoll = () => {
        const finalDice = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
        setDice(finalDice);
        setRolling(false);
        const sum = finalDice[0] + finalDice[1];
        
        let rewards = { shards: 0, xp: 0, relicCurrency: 0 };
        let msg = '';

        if (sum >= 11) { // 11, 12
            rewards = { shards: 100, xp: 50, relicCurrency: 1 };
            msg = 'CRITICAL ROLL! (11+)';
            audioManager.playSound('level-up');
        } else if (sum >= 7) { // 7, 8, 9, 10
            rewards = { shards: 50, xp: 25, relicCurrency: 0 };
            msg = 'Good Roll! (7-10)';
            audioManager.playSound('win-hand');
        } else { // 2, 3, 4, 5, 6
            rewards = { shards: 10, xp: 5, relicCurrency: 0 };
            msg = 'Low Roll... (2-6)';
            audioManager.playSound('lose-hand');
        }
        setResult('win');
        
        setTimeout(() => onComplete(rewards), 2500);
    };

    return (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-[150]">
            <h2 className="text-4xl font-bold font-serif-display text-yellow-400 mb-12">Roll for Power</h2>
            
            <div className="flex gap-8 mb-12">
                {dice.map((d, i) => (
                    <motion.div 
                        key={i}
                        animate={rolling ? { rotate: [0, 360], y: [0, -20, 0] } : {}}
                        transition={{ duration: 0.2, repeat: rolling ? Infinity : 0 }}
                        className="w-24 h-24 bg-white text-black rounded-xl flex items-center justify-center text-6xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        {d}
                    </motion.div>
                ))}
            </div>

            <button 
                onClick={rollDice} 
                disabled={rolling || result !== 'pending'}
                className="px-10 py-4 bg-yellow-600 rounded-lg font-bold text-2xl hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
                {rolling ? 'Rolling...' : result === 'pending' ? 'ROLL!' : 'Done'}
            </button>
        </div>
    );
};

// --- Shell Game ---
interface ShellGameProps {
    onComplete: (rewards: { shards: number, xp: number, relicCurrency?: number }) => void;
}

export const ShellGame: React.FC<ShellGameProps> = ({ onComplete }) => {
    const [gameState, setGameState] = useState<'pick' | 'shuffling' | 'revealed'>('pick');
    const [winningIndex, setWinningIndex] = useState(1);
    const [shells, setShells] = useState([0, 1, 2]);

    const handlePick = (index: number) => {
        if (gameState !== 'pick') return;
        setGameState('revealed');
        
        // Randomize winner on pick to prevent cheating via react dev tools lol (visual shuffle is just visual)
        const actualWinner = Math.floor(Math.random() * 3);
        setWinningIndex(actualWinner);
        
        audioManager.playSound('card-deal'); // Reveal sound

        setTimeout(() => {
            let rewards = { shards: 0, xp: 0, relicCurrency: 0 };
            if (index === actualWinner) {
                rewards = { shards: 75, xp: 30, relicCurrency: 0 };
                audioManager.playSound('win-hand');
            } else {
                rewards = { shards: 10, xp: 5, relicCurrency: 0 };
                audioManager.playSound('lose-hand');
            }
            setTimeout(() => onComplete(rewards), 2000);
        }, 1000);
    };

    return (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-[150]">
            <h2 className="text-4xl font-bold font-serif-display text-teal-400 mb-4">Shell Game</h2>
            <p className="text-xl mb-12 text-gray-300">Find the Queen!</p>
            
            <div className="flex gap-8">
                {shells.map((shellIndex) => (
                    <motion.div
                        key={shellIndex}
                        onClick={() => handlePick(shellIndex)}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="cursor-pointer"
                    >
                        <div className="w-32 h-48 bg-gray-800 rounded-lg border-4 border-gray-600 flex items-center justify-center relative overflow-hidden">
                            {/* Card Back */}
                            <div className="absolute inset-0 bg-red-900 opacity-100 flex items-center justify-center">
                                <span className="text-4xl">?</span>
                            </div>
                            
                            {/* Reveal Logic */}
                            {gameState === 'revealed' && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className={`absolute inset-0 flex items-center justify-center ${shellIndex === winningIndex ? 'bg-white text-black' : 'bg-gray-900 text-gray-500'}`}
                                >
                                    <span className="text-5xl">{shellIndex === winningIndex ? '♛' : 'X'}</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
