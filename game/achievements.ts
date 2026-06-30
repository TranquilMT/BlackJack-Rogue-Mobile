
import type { Achievement } from '../types';
import { AchievementId } from '../types';

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'id'>> = {
    [AchievementId.FIRST_VICTORY]: {
        name: 'A New Beginning',
        description: 'Defeat the dealer and clear Floor 1.'
    },
    [AchievementId.HIGH_ROLLER]: {
        name: 'High Roller',
        description: 'Deal over 1000 total damage in a single run.'
    },
    [AchievementId.SURVIVOR]: {
        name: 'Survivor',
        description: 'Finish a combat with less than 10 HP remaining.'
    },
    [AchievementId.LUCKY_SEVENS]: {
        name: 'Jackpot!',
        description: 'Win a hand with the "Lucky Sevens" synergy.'
    },
    [AchievementId.FIVE_CARD_CHARLIE]: {
        name: 'Methodical',
        description: 'Win a hand with the "Five Card Charlie" synergy.'
    },
    [AchievementId.UNTOUCHABLE]: {
        name: 'Untouchable',
        description: 'Defeat a boss without taking any HP damage during the combat.'
    },
    [AchievementId.COLLECTOR]: {
        name: 'Collector',
        description: 'Hold 5 or more relics at once.'
    },
    [AchievementId.CURSED_ONE]: {
        name: 'Cursed One',
        description: 'Hold 3 or more curses at once.'
    },
    [AchievementId.PERFECTIONIST]: {
        name: 'Perfectionist',
        description: 'Win a hand with a score of exactly 21 using 5 cards.'
    },
    [AchievementId.SAVED_BY_THE_BELL]: {
        name: 'Saved by the Bell',
        description: 'Be saved from defeat by the Hourglass relic.'
    },
    [AchievementId.ROGUE]: {
        name: 'Rogue',
        description: 'Win a run.'
    },
    [AchievementId.MASTER_OF_SYNERGY]: {
        name: 'Master of Synergy',
        description: 'Activate 5 different synergies in a single run.'
    },
    [AchievementId.FLOOR_FIVE]: {
        name: 'Getting Serious',
        description: 'Reach Floor 5.'
    },
    [AchievementId.FLOOR_TEN]: {
        name: 'A True Challenger',
        description: 'Reach Floor 10.'
    },
    [AchievementId.TRUE_GAMBLER]: {
        name: 'True Gambler',
        description: 'Win a hand after doubling down.'
    }
}
