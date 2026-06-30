
import type { Boon } from '../types';
import { BoonId } from '../types';

export const BOONS: Record<BoonId, Omit<Boon, 'id'>> = {
    [BoonId.MAX_HP_UP_SMALL]: {
        name: 'Toughness',
        description: 'Increase your Max HP by 10 for this run.'
    },
    [BoonId.FLAT_DAMAGE_UP_SMALL]: {
        name: 'Precision',
        description: 'Gain +2 flat damage on all wins for this run.'
    },
    [BoonId.STARTING_SHIELD_SMALL]: {
        name: 'Guard Up',
        description: 'Start every combat round with 5 Shield.'
    },
    [BoonId.HEAL_SMALL]: {
        name: 'Minor Heal',
        description: 'Instantly heal 15 HP.'
    },
    [BoonId.SHARD_GAIN_UP]: {
        name: 'Prosperity',
        description: 'Gain +2 extra Shards from every win for this run.'
    },
    [BoonId.POTION_CHARGE_UP]: {
        name: 'Extra Brew',
        description: 'Instantly gain 1 Potion Charge.'
    },
    [BoonId.SURVIVAL_BONUS]: {
        name: 'Endurance',
        description: 'Permanently gain +0.1x Damage Multiplier every 3 rounds survived.'
    },
};
