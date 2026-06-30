
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameState } from '../types';
import type { Action } from '../game/state';
import PlayerActions from './PlayerActions';
import TutorialHighlight from './TutorialHighlight';

const tutorialSteps = [
    { text: "Welcome to Blackjack Rogue! Let's learn how to fight.", target: null },
    { text: "This is your Health (top-left). If it hits zero, your run is over.", target: ".player-status-highlight" },
    { text: "This is the Dealer's Health (top-right). Reduce it to zero to clear the floor!", target: ".boss-status-highlight" },
    { text: "You and the Dealer are dealt cards. The goal is to get a score closer to 21 than the Dealer without going over.", target: ".player-hand-highlight" },
    { text: "Your hand is 15. The Dealer shows a Queen (10). To win, you likely need a higher score. Click 'Hit' to take another card.", target: ".action-hit", actionRequired: true },
    { text: "Nice! You drew a 6, for a perfect 21. Hitting again would be a 'Bust' (going over 21).", target: ".player-hand-highlight" },
    { text: "Let's see what happens when you Bust. We'll start a new hand.", target: null },
    { text: "This time you have 15 again. Let's 'Hit'.", target: ".action-hit", actionRequired: true },
    { text: "Now you have 25. That's a 'Bust'! When you bust, you lose the hand and take damage.", target: ".player-hand-highlight" },
    { text: "Let's try one more hand. You have 19, a very strong hand. The dealer has 17. You should 'Stand'.", target: ".action-stand", actionRequired: true },
    { text: "You won! Winning hands is how you deal damage to the Dealer.", target: ".boss-status-highlight" },
    { text: "A 'Blackjack' (an Ace and a 10-value card on the deal) is a critical hit that deals massive damage and grants a bonus Loot Chest!", target: null },
    { text: "You may also 'Double Down' or 'Split' pairs by spending HP to increase your damage potential.", target: ".action-double" },
    { text: "On the left are your Relics. These passive items are game-changers. See 'Golden Knuckles'? It doubles the damage of your first win each round!", target: ".relic-display-highlight" },
    { text: "At the bottom are your Potions. These are powerful single-use items. You have limited charges per floor.", target: ".potion-belt-highlight" },
    { text: "Now, beware the Dark Arcana. Special 'Modifier Cards' are shuffled into the deck.", target: null },
    { text: "Let's deal a new hand. Watch closely...", target: null, actionRequired: true, hidePlayerActions: true },
    { text: "You drew 'The Reaper'! Modifier cards trigger immediate effects when drawn. This one dealt 6 damage to you instantly!", target: ".player-hand-highlight" },
    { text: "Other modifiers include 'The Guardian' (Shields you), 'The Jester' (Grants Shards), and new ones like 'The Magnet' which pulls another card!", target: null },
    { text: "Modifier cards still have a rank value. The Reaper is a 10. You have 18. Let's Stand.", target: ".action-stand", actionRequired: true },
    { text: "Even with a good hand, the Dealer can still get lucky. Risk management is key.", target: null },
    { text: "Survive 3 rounds to gain a permanent Damage Multiplier! Also, watch the discard pile (top right) to anticipate cards when the deck reshuffles.", target: ".discard-pile-highlight" },
    { text: "Finally, Loot Chests (from Blackjacks or Bosses) may contain a **Mystery Key**.", target: null },
    { text: "Keys unlock the **Bonus Wheel**, which leads to Mini-Games like Plinko, High/Low, Dice Roll, and Shell Game for massive rewards.", target: null },
    { text: "That covers everything. You are ready to face the Rogue. Good luck!", target: null },
];

interface TutorialProps {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  onComplete: () => void;
  activeHandPosition: { top: number; left: number; width: number } | null;
}

const Tutorial: React.FC<TutorialProps> = ({ state, dispatch, onComplete, activeHandPosition }) => {
    const { tutorialStep } = state;
    const currentStep = tutorialSteps[tutorialStep - 1];
    const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsProcessing(false);
        if (currentStep && currentStep.target) {
            const el = document.querySelector(currentStep.target);
            setHighlightedElement(el);
        } else {
            setHighlightedElement(null);
        }
    }, [tutorialStep, currentStep]);
    
    const handleAction = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        if (tutorialStep === tutorialSteps.length) {
            onComplete();
        } else {
            dispatch({ type: 'TUTORIAL_ACTION', step: tutorialStep });
        }
    };
    
    const isLastStep = tutorialStep === tutorialSteps.length;

    const popupPosition = useMemo(() => {
        // If there's no highlight, center the popup but move it lower to keep the logo clear
        if (!highlightedElement) return { top: '75%', left: '50%', x: '-50%', y: '-50%' };
        
        const rect = highlightedElement.getBoundingClientRect();
        // If target is in top half, show popup in bottom half
        if (rect.top < window.innerHeight / 2) {
            return { bottom: '15%', left: '50%', x: '-50%', y: '0%' };
        } else {
            // If target is in bottom half, show popup in top half
            return { top: '15%', left: '50%', x: '-50%', y: '0%' };
        }
    }, [highlightedElement]);

    return (
        <div className="absolute inset-0 z-[60] pointer-events-none">
            {/* Lighter overlay to keep table visible */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            
            <AnimatePresence>
                {highlightedElement && <TutorialHighlight element={highlightedElement} />}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={tutorialStep}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute w-full max-w-md bg-stone-900/90 p-6 rounded-2xl text-center text-stone-100 text-lg border-2 border-amber-600/50 shadow-2xl pointer-events-auto backdrop-blur-md"
                    style={popupPosition}
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-700 text-stone-100 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500">
                        Lesson {tutorialStep}
                    </div>
                    <p className="mt-2 font-medium leading-relaxed">{currentStep.text}</p>
                    {!currentStep.actionRequired && (
                        <button disabled={isProcessing} onClick={handleAction} className="mt-6 px-8 py-3 bg-amber-700 text-stone-100 font-black rounded-lg hover:bg-amber-600 transition-all uppercase tracking-widest text-sm shadow-lg border border-amber-500/30">
                            {isLastStep ? "Face the Rogue" : "Continue"}
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
            
            {activeHandPosition && currentStep.actionRequired && !currentStep.hidePlayerActions && (
                 <div className="pointer-events-auto">
                    <PlayerActions 
                        position={activeHandPosition} 
                        onHit={tutorialStep === 5 || tutorialStep === 8 ? handleAction : undefined} 
                        onStand={tutorialStep === 10 || tutorialStep === 20 ? handleAction : undefined} 
                        onDouble={undefined} 
                        onSplit={undefined} 
                        blockedAction={null} 
                        splitCost={0} 
                        focus={0} maxFocus={100} 
                    />
                 </div>
            )}
            
            {currentStep.actionRequired && currentStep.hidePlayerActions && (
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto mt-32">
                     <button disabled={isProcessing} onClick={handleAction} className="px-10 py-4 bg-amber-600 text-stone-100 font-black rounded-xl shadow-2xl hover:bg-amber-500 animate-pulse transition-all uppercase tracking-widest border-2 border-amber-400/50">
                         Commence Round
                     </button>
                 </div>
            )}
        </div>
    );
};

export default Tutorial;
