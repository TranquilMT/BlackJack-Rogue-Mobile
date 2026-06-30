
import type { GameState, Pact, Relic } from '../types';
import { CurseId, RelicId } from '../types';
import { RELICS } from './relics';

const allRelics = Object.values(RELICS);
const commonRelics = allRelics.filter(r => !r.isForged).slice(0, 10); // Example of a smaller pool

const ALL_PACTS: Record<string, Pact> = {
    PACT_OF_POWER: {
        id: 'PACT_OF_POWER',
        name: 'Pact of Power',
        description: 'Sacrifice 25% of your current HP. Gain +5 permanent flat damage.',
        icon: 'skull',
        effect: (state) => {
            const hpCost = Math.floor(state.playerHP * 0.25);
            return {
                ...state,
                playerHP: state.playerHP - hpCost,
                permanentFlatDamageBonus: state.permanentFlatDamageBonus + 5,
            };
        },
    },
    PACT_OF_WEALTH: {
        id: 'PACT_OF_WEALTH',
        name: 'Pact of Wealth',
        description: 'Lose your oldest relic. Gain 150 Shards.',
        icon: 'coin',
        effect: (state) => {
            const relics = [...state.relics];
            if (relics.length > 0) {
                relics.shift(); // Remove the oldest relic
            }
            return {
                ...state,
                relics,
                runCurrency: state.runCurrency + 150,
            };
        },
    },
    PACT_OF_RESILIENCE: {
        id: 'PACT_OF_RESILIENCE',
        name: 'Pact of Resilience',
        description: 'Your Max HP is reduced by 20. Gain a random common relic.',
        icon: 'heart',
        effect: (state) => {
            const randomRelic = commonRelics[Math.floor(Math.random() * commonRelics.length)];
            return {
                ...state,
                playerMaxHP: state.playerMaxHP - 20,
                playerHP: Math.min(state.playerHP, state.playerMaxHP - 20),
                relics: [...state.relics, randomRelic],
            };
        },
    },
    PACT_OF_FORTUNE: {
        id: 'PACT_OF_FORTUNE',
        name: 'Pact of Fortune',
        description: 'A simple gift. Gain 75 Shards.',
        icon: 'star',
        effect: (state) => ({
            ...state,
            runCurrency: state.runCurrency + 75,
        }),
    },
    PACT_OF_FRAILTY: {
        id: 'PACT_OF_FRAILTY',
        name: 'Pact of Frailty',
        description: 'Gain 2 Potion Charges, but acquire the Brittle Bones curse (Take +2 damage from all sources).',
        icon: 'skull',
        effect: (state) => {
            const newCurse = { id: CurseId.BrittleBones, name: 'Brittle Bones', description: 'You take +2 damage from all sources.' };
            return {
                ...state,
                potionCharges: state.potionCharges + 2,
                curses: [...state.curses, newCurse],
            };
        },
    },
    PACT_OF_KNOWLEDGE: {
        id: 'PACT_OF_KNOWLEDGE',
        name: 'Pact of Knowledge',
        description: 'Gain 500 XP immediately, but lose 50 Shards.',
        icon: 'star',
        effect: (state) => ({
            ...state,
            playerXP: state.playerXP + 500,
            runCurrency: Math.max(0, state.runCurrency - 50),
        }),
    }
};

export const getRandomPacts = (count: number): Pact[] => {
    const pacts = Object.values(ALL_PACTS);
    const shuffled = [...pacts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
