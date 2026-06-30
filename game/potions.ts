
import type { Potion } from '../types';
import { PotionId } from '../types';

export const POTIONS: Record<PotionId, Potion> = {
    [PotionId.HealingPotion]: {
        id: PotionId.HealingPotion,
        name: 'Healing Potion',
        description: 'Instantly heal for 20 HP.',
    },
    [PotionId.ShieldPotion]: {
        id: PotionId.ShieldPotion,
        name: 'Shield Potion',
        description: 'Instantly gain 15 Shield.',
    },
    [PotionId.CardPeeker]: {
        id: PotionId.CardPeeker,
        name: 'Card Peeker',
        description: 'Reveals the dealer\'s face-down card for this round.',
    },
    [PotionId.RagePotion]: {
        id: PotionId.RagePotion,
        name: 'Rage Potion',
        description: 'For this round only, all your winning hands deal double damage.',
    },
    [PotionId.PurificationPotion]: {
        id: PotionId.PurificationPotion,
        name: 'Purification Potion',
        description: 'Removes your oldest active Curse.',
    },
    [PotionId.DeckStackerPotion]: {
        id: PotionId.DeckStackerPotion,
        name: 'Deck-Stacker Potion',
        description: 'Your next card drawn is guaranteed to be a 10-value card.',
    },
    [PotionId.VoidPotion]: {
        id: PotionId.VoidPotion,
        name: 'Void Potion',
        description: 'Transform a random card in your hand into a Voidwalker (Value 1).',
    },
};
