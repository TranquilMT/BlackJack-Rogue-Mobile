import { Cutscene } from '../types';

export const CAMPAIGN_STORY: Record<string, Cutscene> = {
    'intro': {
        id: 'intro',
        nextPhase: 'playerTurn',
        frames: [
            {
                speaker: '???',
                text: "Wake up, gambler. The House always wins... but perhaps not today.",
                image: 'bg-black'
            },
            {
                speaker: 'The Dealer',
                text: "You've been dealt a bad hand in life. Debts, regrets, and a soul sold for a chance at glory.",
                image: 'bg-gray-900'
            },
            {
                speaker: 'The Dealer',
                text: "But here, in the Void Casino, you have one last chance. Defeat my champions, climb the floors, and reclaim your freedom.",
                image: 'bg-gray-800'
            },
            {
                speaker: 'The Dealer',
                text: "Your first trial awaits in The Rusty Brig. The Captain doesn't take kindly to stowaways.",
                image: 'bg-blue-950'
            }
        ]
    },
    'floor1_complete': {
        id: 'floor1_complete',
        nextPhase: 'playerTurn',
        frames: [
            {
                speaker: 'The Captain',
                text: "Arrrgh! Ye fight like a demon possessed! Take me treasure and begone!",
                image: 'bg-blue-900'
            },
            {
                speaker: 'The Dealer',
                text: "Impressive. You've survived the depths. But the game changes now.",
                image: 'bg-black'
            },
            {
                speaker: 'The Dealer',
                text: "Welcome to The Neon Dungeon. A place where logic fails and probability is rewritten.",
                image: 'bg-purple-900'
            }
        ]
    },
    'floor2_complete': {
        id: 'floor2_complete',
        nextPhase: 'playerTurn',
        frames: [
            {
                speaker: 'The Warden',
                text: "System... failure... Probability matrix... corrupted...",
                image: 'bg-purple-800'
            },
            {
                speaker: 'The Dealer',
                text: "You continue to defy the odds. Most would have folded by now.",
                image: 'bg-black'
            },
            {
                speaker: 'The Dealer',
                text: "The High Roller's Suite awaits. But first, you must pass through the Hall of Mirrors.",
                image: 'bg-indigo-950'
            }
        ]
    },
    'floor3_complete': {
        id: 'floor3_complete',
        nextPhase: 'playerTurn',
        frames: [
            {
                speaker: 'The Mirror',
                text: "I see you... and all the versions of you that failed.",
                image: 'bg-indigo-900'
            },
            {
                speaker: 'The Dealer',
                text: "The reflections are gone. Only the truth remains.",
                image: 'bg-black'
            },
            {
                speaker: 'The Dealer',
                text: "You are at the threshold of The Sanctum. The House itself will be your final opponent.",
                image: 'bg-red-950'
            }
        ]
    },
    'floor4_complete': {
        id: 'floor4_complete',
        nextPhase: 'playerTurn',
        frames: [
            {
                speaker: 'The House',
                text: "You think you can win? I AM the game!",
                image: 'bg-red-900'
            },
            {
                speaker: 'The Dealer',
                text: "The House is trembling. One more push, gambler.",
                image: 'bg-black'
            },
            {
                speaker: 'The Dealer',
                text: "The Void Core is exposed. This is where it all ends.",
                image: 'bg-slate-900'
            }
        ]
    },
    'victory': {
        id: 'victory',
        nextPhase: 'victory',
        frames: [
            {
                speaker: 'The House',
                text: "Impossible... The probability of this outcome was... zero.",
                image: 'bg-red-900'
            },
            {
                speaker: 'The Dealer',
                text: "You've done it. You've broken the bank. Your soul is your own once more.",
                image: 'bg-yellow-900'
            },
            {
                speaker: 'The Dealer',
                text: "Go now. But remember... the cards will always call to you.",
                image: 'bg-black'
            }
        ]
    }
};
