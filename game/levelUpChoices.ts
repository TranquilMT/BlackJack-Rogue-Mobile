
import type { LevelUpChoice } from '../types';
import { LevelUpChoiceId } from '../types';

export const LEVEL_UP_CHOICES: Record<LevelUpChoiceId, LevelUpChoice> = {
    [LevelUpChoiceId.MAX_HP_UP]: {
        id: LevelUpChoiceId.MAX_HP_UP,
        name: 'Fortify',
        description: 'Increase Max HP by 10 and heal 10.',
    },
    [LevelUpChoiceId.PERMANENT_DAMAGE_UP]: {
        id: LevelUpChoiceId.PERMANENT_DAMAGE_UP,
        name: 'Sharpen',
        description: 'Permanently gain +2 flat damage.',
    },
    [LevelUpChoiceId.POTION_CAPACITY_UP]: {
        id: LevelUpChoiceId.POTION_CAPACITY_UP,
        name: 'Expand Belt',
        description: 'Increase max Potion Charges by 1 and gain 1 charge.',
    },
    [LevelUpChoiceId.CRITICAL_HIT_CHANCE]: {
        id: LevelUpChoiceId.CRITICAL_HIT_CHANCE,
        name: 'Precision Aim',
        description: 'Increase Critical Hit chance by 5%.',
    },
    [LevelUpChoiceId.SHIELD_ON_STAND]: {
        id: LevelUpChoiceId.SHIELD_ON_STAND,
        name: 'Defensive Stance',
        description: 'Increase Shield gained on Stand by 5.',
    },
    [LevelUpChoiceId.FOCUS_GENERATION_UP]: {
        id: LevelUpChoiceId.FOCUS_GENERATION_UP,
        name: 'Inner Peace',
        description: 'Increase Focus gained from winning hands by 5.',
    },
};

export const getRandomLevelUpChoices = (count: number): LevelUpChoice[] => {
    const choices = Object.values(LEVEL_UP_CHOICES);
    const shuffled = [...choices].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
