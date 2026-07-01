import type { GameState, Hand, Card, BlockedAction, Relic, Potion, BossIntent, FloorModifier, Curse, RunStats, MetaState, Boon, LevelUpChoice, LootReward, Pact, BossPassive, GameMode } from '../types';
import { GamePhase, HandStatus, SynergyId, RelicId, PotionId, BossIntentId, FloorModifierId, CurseId, Rank, Suit, BoonId, LevelUpChoiceId, CardModifierId, WheelOutcome, WeatherType, DealerArchetype, BossPhase, TableLighting } from '../types';
import { createDeck, shuffleDeck, calculateHandScore, isBlackjack, determineHandResult, DOUBLE_COST, SPLIT_COST, getCardValue } from './logic';
import { getActiveSynergies } from './synergies';
import { RELICS } from './relics';
import { POTIONS } from './potions';
import { BOONS } from './boons';
import { getRandomPacts } from './pacts';
import { getRandomLevelUpChoices } from './levelUpChoices';
import { CAMPAIGN_STORY } from './story';

let idCounter = 0;
export function getUniqueId(): number {
    return Date.now() * 1000 + (idCounter++ % 1000);
}

export type Action =
  | { type: 'START_NEW_RUN', startingRelicId?: RelicId, metaState?: MetaState, mode?: GameMode }
  | { type: 'START_TUTORIAL' }
  | { type: 'TUTORIAL_ACTION', step: number }
  | { type: 'HIT' }
  | { type: 'STAND' }
  | { type: 'BURN_CARD', cardId: string }
  | { type: 'SURRENDER' }
  | { type: 'DOUBLE' }
  | { type: 'SPLIT' }
  | { type: 'INTIMIDATE' }
  | { type: 'DEALER_TURN_ACTION' } 
  | { type: 'RESOLVE_HAND' }
  | { type: 'START_NEXT_HAND' }
  | { type: 'ADVANCE_FLOOR' }
  | { type: 'RESTART_GAME', metaState?: MetaState, mode?: GameMode }
  | { type: 'USE_POTION', potionId: PotionId }
  | { type: 'SELECT_REWARD', relicId: RelicId }
  | { type: 'SELECT_CURSE', curseId: CurseId }
  | { type: 'AWARD_LOOT', rewards: { potionCharges?: number; shards?: number; relicCurrency?: number; triggerWheel?: boolean } }
  | { type: 'SELECT_BOON', boonId: BoonId }
  | { type: 'SPIN_WHEEL_COMPLETE', result: { outcome: WheelOutcome, payload?: any } }
  | { type: 'MINIGAME_COMPLETE', rewards: { shards: number, xp: number, relicCurrency?: number } }
  | { type: 'PLINKO_COMPLETE', rewards: { shards: number, xp: number, relicCurrency?: number } }
  | { type: 'SELECT_LEVEL_UP_CHOICE', choiceId: LevelUpChoiceId }
  | { type: 'SELECT_PACT', pact: Pact }
  | { type: 'SELECT_SEASONAL_REWARD', rewardId: string }
  | { type: 'BONFIRE_ACTION', action: 'rest' | 'kindle' | 'purge' | 'leave' }
  | { type: 'START_CUTSCENE', cutsceneId: string }
  | { type: 'END_CUTSCENE' }
  | { type: 'UPDATE_LIGHTING', lighting: TableLighting }
  | { type: 'REORDER_DECK', newDeck: Card[] }
  | { type: 'CLEAR_PENDING_VISUAL_EFFECT' };

const initialPlayerHP = 100;
const initialBossHP = 100; 

const defaultState: GameState = {
  mode: 'endless',
  currentStage: 1,
  deck: [],
  discardPile: [],
  playerHands: [],
  dealerHand: { id: 0, cards: [], score: 0, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 },
  dealerArchetype: DealerArchetype.Balanced,
  bossPhase: BossPhase.Phase1,
  tableLighting: TableLighting.Normal,
  gamePhase: 'preGame',
  playerHP: initialPlayerHP,
  playerMaxHP: initialPlayerHP,
  bossHP: initialBossHP,
  bossMaxHP: initialBossHP,
  activeHandIndex: 0,
  message: 'Prepare for battle!',
  bossShield: 0,
  isDesperationActive: false,
  blockedAction: null,
  relics: [],
  potions: Object.values(POTIONS),
  potionCharges: 3,
  playerShield: 0,
  runCurrency: 0,
  runRelicCurrency: 0,
  currentFloor: 1,
  unlockedRelicIds: [],
  unlockedModifierCardIds: [CardModifierId.THE_REAPER],
  unlockedSkills: [],
  rewardChoices: [],
  bossIntent: {id: BossIntentId.None, name: 'None', description: ''},
  floorModifier: {id: FloorModifierId.None, name: 'None', description: ''},
  curses: [],
  curseChoices: [],
  runStats: { floor: 0, totalDamageDealt: 0, synergiesActivated: {}, relicsCollected: [], shardsEarned: 0, relicCurrencyEarned: 0, handsPlayed: 0, runEndedAt: '', victory: false },
  permanentFlatDamageBonus: 0,
  isRageActive: false,
  shopItems: [],
  discardCount: 0,
  achievementQueue: [],
  focus: 0,
  maxFocus: 100,
  isDealerIntimidated: false,
  isBossStunned: false,
  tutorialStep: 0,
  showLootChest: false,
  lootRewards: null,
  activeBoons: [],
  boonChoices: [],
  boonFlatDamageBonus: 0,
  shardBooster: null,
  playerLevel: 1,
  playerXP: 0,
  xpToNextLevel: 100,
  levelUpChoices: [],
  maxPotionCharges: 3,
  critChance: 0,
  permanentCritChance: 0,
  shieldOnStand: 0,
  focusGainBonus: 0,
  tempDamageMultiplier: null, 
  returnPhase: undefined,
  roundsSurvived: 0,
  survivalDamageMultiplier: 1,
  bossPassive: null,
  winStreak: 0,
  strangerChoices: [],
  hollowingStacks: 0,
  isEnraged: false,
  currentCutscene: null,
  weather: WeatherType.Clear,
  comboMultiplier: 1,
  phoenixFeatherUsed: false,
};

function getStreakMultiplier(streak: number): number {
    if (streak >= 5) return 3.0;
    if (streak === 4) return 2.0;
    if (streak === 3) return 1.0;
    if (streak === 2) return 0.5;
    if (streak === 1) return 0.2;
    return 0;
}

function updateBossPhase(state: GameState): BossPhase {
    const hpPercent = state.bossHP / state.bossMaxHP;
    if (hpPercent < 0.33) return BossPhase.Phase3;
    if (hpPercent < 0.66) return BossPhase.Phase2;
    return BossPhase.Phase1;
}

function getRandomFloorModifier(floor: number, unlockedSkills: string[] = []): FloorModifier {
    if (floor < 3) return { id: FloorModifierId.None, name: 'Standard Rules', description: 'No active modifiers.' };

    const modifiers: FloorModifier[] = [
        { id: FloorModifierId.HeavyAir, name: 'Heavy Air', description: 'All cards cost +1 HP to play. (Visual only for now)' },
        { id: FloorModifierId.VampiricTouch, name: 'Vampiric Touch', description: 'Dealer heals 5 HP every round.' },
        { id: FloorModifierId.AceAbundance, name: 'Ace Abundance', description: 'The deck contains extra Aces.' },
        { id: FloorModifierId.TheFog, name: 'The Fog', description: 'Dealer\'s first card is hidden until you Stand.' },
        { id: FloorModifierId.VoidEvent, name: 'The Void Event', description: 'The abyss seeps in. Cards have random tells, and damage is increased.' },
    ];
    
    // Void Affinity I: Increase Void Event chance
    if (unlockedSkills.includes('void_1')) {
        modifiers.push({ id: FloorModifierId.VoidEvent, name: 'The Void Event', description: 'The abyss seeps in. Cards have random tells, and damage is increased.' });
        modifiers.push({ id: FloorModifierId.VoidEvent, name: 'The Void Event', description: 'The abyss seeps in. Cards have random tells, and damage is increased.' });
    }
    
    if (floor > 6) {
        modifiers.push({ id: FloorModifierId.EliteEncounter, name: 'Elite Encounter', description: 'Boss has passive abilities.' });
    }

    const randomIndex = Math.floor(Math.random() * modifiers.length);
    return modifiers[randomIndex];
}

function getRandomDealerArchetype(): DealerArchetype {
    const archetypes = [DealerArchetype.Cautious, DealerArchetype.Aggressive, DealerArchetype.Balanced];
    return archetypes[Math.floor(Math.random() * archetypes.length)];
}

function getRandomWeather(floor: number, mode: GameMode): WeatherType {
    if (mode === 'campaign' && floor === 3) {
        const weathers = [WeatherType.Foggy, WeatherType.Stormy];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }
    if (mode === 'endless') {
        const weathers = [WeatherType.Clear, WeatherType.Foggy, WeatherType.Stormy, WeatherType.Golden];
        return weathers[Math.floor(Math.random() * weathers.length)];
    }
    return WeatherType.Clear;
}


const CURSE_LIBRARY: Record<CurseId, Curse> = {
    [CurseId.BrittleBones]: { id: CurseId.BrittleBones, name: 'Brittle Bones', description: 'Take +2 damage whenever the Dealer hurts you.' },
    [CurseId.Butterfingers]: { id: CurseId.Butterfingers, name: 'Butterfingers', description: 'Burning a card costs +5 HP.' },
    [CurseId.ClumsyHands]: { id: CurseId.ClumsyHands, name: 'Clumsy Hands', description: 'Potion charges are capped 1 lower while active.' },
    [CurseId.DullBlade]: { id: CurseId.DullBlade, name: 'Dull Blade', description: 'Winning hands deal 2 less damage.' },
    [CurseId.Paranoia]: { id: CurseId.Paranoia, name: 'Paranoia', description: 'Dealer tells are less reliable.' },
    [CurseId.HeavyPockets]: { id: CurseId.HeavyPockets, name: 'Heavy Pockets', description: 'Shard rewards from hands are reduced by 20%.' },
    [CurseId.WeakKnees]: { id: CurseId.WeakKnees, name: 'Weak Knees', description: 'Double Down costs +3 HP.' },
};

function getRandomCurses(count: number, existing: Curse[] = []): Curse[] {
    const existingIds = new Set(existing.map(c => c.id));
    return Object.values(CURSE_LIBRARY)
        .filter(c => !existingIds.has(c.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
}

function hasCurse(state: GameState, curseId: CurseId): boolean {
    return state.curses.some(c => c.id === curseId);
}

function updateHand(hand: Hand, newCards: Card[], state: GameState): Hand {
    let updatedHand = { ...hand, cards: [...hand.cards, ...newCards] };
    updatedHand.score = calculateHandScore(updatedHand.cards);
    
    if (updatedHand.score > 21 && updatedHand.cards.length === 5 && state.relics.some(r => r.id === RelicId.GamblersFallacy)) {
        updatedHand.score = 21;
    }

    let baseMultiplier = updatedHand.isDoubled ? 2 : 1.2;
    updatedHand.damageMultiplier = baseMultiplier;
    updatedHand.flatDamageBonus = state.permanentFlatDamageBonus + state.boonFlatDamageBonus;
    
    updatedHand.activeSynergies = getActiveSynergies(updatedHand);
    let synergyMultiplier = 0;
    
    for (const synergy of updatedHand.activeSynergies) {
        switch (synergy.id) {
            case SynergyId.SuitedConnectors:
            case SynergyId.RoyalCourt: synergyMultiplier += 0.5; break;
            case SynergyId.PairedAces:
                updatedHand.status = HandStatus.Blackjack;
                synergyMultiplier += 1.5;
                break;
            case SynergyId.LuckySevens:
            case SynergyId.NumericalStraight: updatedHand.status = HandStatus.SuperWin; break;
            case SynergyId.ColorFlush: updatedHand.flatDamageBonus += 5; break;
            case SynergyId.PerfectTwentyOne: synergyMultiplier += 0.25; break;
            case SynergyId.FullHouse: synergyMultiplier += 3.0; break;
            case SynergyId.Flush: updatedHand.status = HandStatus.Win; break;
            case SynergyId.StraightFlush: updatedHand.status = HandStatus.SuperWin; break;
            case SynergyId.TwoPair: synergyMultiplier += 1.5; break;
            case SynergyId.ThreeOfAKind: synergyMultiplier += 2.0; break;
            case SynergyId.Lowball: updatedHand.flatDamageBonus += 10; break;
            case SynergyId.OddSplit: updatedHand.flatDamageBonus += 5; break;
            case SynergyId.FaceOff: synergyMultiplier += 2.0; break;
            case SynergyId.EchoChamber: synergyMultiplier += 0.5; break;
            case SynergyId.Zenith: updatedHand.flatDamageBonus += 5; break;
            case SynergyId.GamblersEdge: updatedHand.flatDamageBonus += 15; break;
            case SynergyId.FiveCardCharlie: updatedHand.status = HandStatus.Win; break;
        }
    }
    
    updatedHand.damageMultiplier += synergyMultiplier;
    if (state.survivalDamageMultiplier > 1) updatedHand.damageMultiplier *= state.survivalDamageMultiplier;
    if (state.tempDamageMultiplier) updatedHand.damageMultiplier *= state.tempDamageMultiplier.value;
    
    // Darksign Double Damage
    if (state.relics.some(r => r.id === RelicId.DARKSIGN)) {
        updatedHand.damageMultiplier *= 2;
    }

    // Void Power I Skill
    if (state.floorModifier.id === FloorModifierId.VoidEvent && state.unlockedSkills.includes('void_2')) {
        updatedHand.damageMultiplier *= 1.1;
    }

    if (updatedHand.status !== HandStatus.Blackjack && updatedHand.status !== HandStatus.SuperWin && updatedHand.status !== HandStatus.Win && updatedHand.status !== HandStatus.Lose) {
      if (updatedHand.score > 21) {
          updatedHand.status = HandStatus.Busted;
      } else if (updatedHand.score === 21) {
          if (updatedHand.cards.length === 2) {
              updatedHand.status = HandStatus.Blackjack;
              updatedHand.damageMultiplier += 1.5;
          } else {
              updatedHand.status = HandStatus.Standing;
          }
      }
      else updatedHand.status = HandStatus.Hitting;
    }
    
    return updatedHand;
}

/**
 * Unified draw processor that handles the "recursive chain" of modifier effects.
 * This fixes Magnets only working once and Clones not appearing.
 */
function processDrawChain(state: GameState, initialCard: Card, activeHand: Hand, source: 'player' | 'dealer' = 'player'): { newState: GameState, finalCards: Card[], messages: string[] } {
    let currentState = { ...state };
    let messages: string[] = [];
    let cardsInThisChain: Card[] = [];
    let drawQueue: Card[] = [initialCard];
    let pendingClone = false;

    let iterations = 0;
    while (drawQueue.length > 0 && iterations < 20) {
        iterations++;
        let card = drawQueue.shift()!;
        
        if (pendingClone) {
            const cloned = { ...card, id: `${card.id}-clone-${Date.now()}-${iterations}`, isCloned: true };
            drawQueue.unshift(card);
            drawQueue.unshift(cloned);
            messages.push(`Clone copied ${card.rank}${card.suit}!`);
            pendingClone = false;
            continue;
        }

        // Every drawn card now enters the hand, including modifier cards.
        // Previously modifiers fired their effect but vanished, which broke scoring, synergies, burn, split, and potion logic.
        cardsInThisChain.push(card);

        // We apply effects using the hand state AS IT WILL BE after this specific card is added.
        const buildingHand = { ...activeHand, cards: [...activeHand.cards, ...cardsInThisChain] };
        buildingHand.score = calculateHandScore(buildingHand.cards);
        const effect = applyModifierCardEffect(card, currentState, buildingHand, source);
        
        currentState = effect.newState;
        if (effect.message) messages.push(effect.message);

        if (effect.cloneNext) {
            pendingClone = true;
        }

        // CLONE FIX: If card was cloned, add to draw queue so it triggers effects
        if (effect.cloneCard) {
            drawQueue.unshift(effect.cloneCard);
        }

        // MAGNET FIX: If card was a magnet, draw another and add it to the front of the queue
        if (effect.drawAnother) {
            const deal = dealCard(currentState);
            currentState = { ...currentState, deck: deal.deck, discardPile: deal.discardPile };
            drawQueue.push(deal.card);
        }

        // VOID ESSENCE: Gain focus on modifier card
        if (!card.isCloned && card.modifier && currentState.relics.some(r => r.id === RelicId.VOID_ESSENCE)) {
            currentState.focus = Math.min(currentState.maxFocus, currentState.focus + 1);
        }

        // VOID SHARD: Gain focus on void card
        if (!card.isCloned && (card.modifier === CardModifierId.THE_ABYSS || card.modifier === CardModifierId.THE_VOIDWALKER) && currentState.relics.some(r => r.id === RelicId.VoidShard)) {
            currentState.focus = Math.min(currentState.maxFocus, currentState.focus + 1);
        }
    }

    return { newState: currentState, finalCards: cardsInThisChain, messages };
}

function dealInitialHands(state: GameState): GameState {
    const cardsToDiscard = [
        ...state.playerHands.flatMap(h => h.cards),
        ...state.dealerHand.cards,
    ].filter(Boolean);

    let newDiscardPile = [...state.discardPile, ...cardsToDiscard];
    let currentDeck = [...state.deck];
    let startRoundState = { ...state };
    let roundStartMessages: string[] = [];

    if (startRoundState.floorModifier.id === FloorModifierId.AceAbundance) {
        currentDeck.push(
            { id: `ace-abundance-${Date.now()}-1`, suit: Suit.Hearts, rank: Rank.Ace },
            { id: `ace-abundance-${Date.now()}-2`, suit: Suit.Spades, rank: Rank.Ace }
        );
        currentDeck = shuffleDeck(currentDeck);
        roundStartMessages.push('Ace Abundance seeded the shoe with extra Aces.');
    }

    if (startRoundState.relics.some(r => r.id === RelicId.FirstAidKit) && !startRoundState.relics.some(r => r.id === RelicId.DARKSIGN)) {
        startRoundState.playerHP = Math.min(startRoundState.playerMaxHP, startRoundState.playerHP + 2);
        roundStartMessages.push('First-Aid Kit restored 2 HP.');
    }

    if (startRoundState.relics.some(r => r.id === RelicId.RubyLense) && startRoundState.potionCharges < 1) {
        startRoundState.potionCharges = 1;
        roundStartMessages.push('Ruby Lense refilled 1 Potion Charge.');
    }

    if (startRoundState.relics.some(r => r.id === RelicId.GildedDeck)) {
        startRoundState.runCurrency += 5;
        roundStartMessages.push('Gilded Deck paid +5 Shards.');
    }

    if (startRoundState.floorModifier.id === FloorModifierId.VampiricTouch) {
        startRoundState.bossHP = Math.min(startRoundState.bossMaxHP, startRoundState.bossHP + 5);
        roundStartMessages.push('Vampiric Touch healed the Dealer for 5.');
    }

    if (currentDeck.length < 15) {
        currentDeck = shuffleDeck([...currentDeck, ...newDiscardPile]);
        newDiscardPile = [];
    }

    // Pull base cards for player, ensuring they are not modifiers
    let pCard1: Card | undefined;
    let pCard2: Card | undefined;
    let tempDiscard: Card[] = [];

    while (!pCard1 || !pCard2) {
        if (currentDeck.length === 0) {
            currentDeck = shuffleDeck([...currentDeck, ...newDiscardPile, ...tempDiscard]);
            newDiscardPile = [];
            tempDiscard = [];
        }
        const card = currentDeck.pop()!;
        if (card.modifier) {
            tempDiscard.push(card);
        } else {
            if (!pCard1) pCard1 = card;
            else pCard2 = card;
        }
    }

    // Pull base cards for dealer, ensuring they are not modifiers
    let dCard1: Card | undefined;
    let dCard2: Card | undefined;
    tempDiscard = [];

    while (!dCard1 || !dCard2) {
        if (currentDeck.length === 0) {
            currentDeck = shuffleDeck([...currentDeck, ...newDiscardPile, ...tempDiscard]);
            newDiscardPile = [];
            tempDiscard = [];
        }
        const card = currentDeck.pop()!;
        if (card.modifier) {
            tempDiscard.push(card);
        } else {
            if (!dCard1) dCard1 = card;
            else dCard2 = card;
        }
    }
    newDiscardPile.push(...tempDiscard);

    const isFog = state.floorModifier.id === FloorModifierId.TheFog;
    const isMajorBoss = state.currentFloor % 5 === 0;
    const nextIsEnraged = isMajorBoss && state.bossHP < (state.bossMaxHP * 0.5);
    
    const isVoid = state.floorModifier.id === FloorModifierId.VoidEvent;
    if (isVoid) {
        dCard1 = { ...dCard1, tell: Math.random() > 0.5 ? 'high' : 'low' };
        dCard2 = { ...dCard2, tell: Math.random() > 0.5 ? 'high' : 'low' };
    }

    let tempState = { ...startRoundState, deck: currentDeck, discardPile: newDiscardPile };
    let allModMessages: string[] = [];

    if (isVoid) {
        allModMessages.push("The Void whispers... Dealer cards have tells.");
    }

    // Process Card 1 and its potential chain
    const emptyHand: Hand = { id: Date.now(), cards: [], score: 0, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 };
    const p1Chain = processDrawChain(tempState, pCard1, emptyHand);
    tempState = p1Chain.newState;
    allModMessages.push(...p1Chain.messages);

    // Process Card 2 and its potential chain
    const handAfterP1 = { ...emptyHand, cards: p1Chain.finalCards };
    const p2Chain = processDrawChain(tempState, pCard2, handAfterP1);
    tempState = p2Chain.newState;
    allModMessages.push(...p2Chain.messages);

    const finalPlayerCards = [...p1Chain.finalCards, ...p2Chain.finalCards];
    
    const playerHand = updateHand(emptyHand, finalPlayerCards, tempState);

    const shouldRevealDealer =
        finalPlayerCards.some(c => c.modifier === CardModifierId.THE_ORACLE) ||
        tempState.relics.some(r => r.id === RelicId.ScryingOrb) ||
        (tempState.relics.some(r => r.id === RelicId.AbyssalEye) && playerHand.score <= 10);

    const dealerHand = {
        ...updateHand({ ...emptyHand, id: 0 }, [dCard1, dCard2], tempState),
        isRevealed: shouldRevealDealer
    };

    let playerShield = tempState.relics.some(r => r.id === RelicId.StoneSkin) ? Math.min(tempState.playerShield, 10) : 0;
    let nextPlayerHP = tempState.playerHP;
    if (state.activeBoons.some(b => b.id === BoonId.STARTING_SHIELD_SMALL)) {
        playerShield += 5;
    }
    if (playerHand.activeSynergies.some(s => s.id === SynergyId.AceInTheHole)) {
        playerShield += 5;
        allModMessages.push('Ace in the Hole! +5 Shield.');
    }
    if (playerHand.activeSynergies.some(s => s.id === SynergyId.BlackAndRed) && !tempState.relics.some(r => r.id === RelicId.DARKSIGN)) {
        const healedHp = Math.min(tempState.playerMaxHP, nextPlayerHP + 2);
        if (healedHp > nextPlayerHP) {
            nextPlayerHP = healedHp;
            allModMessages.push('Black and Red! Healed 2 HP.');
        }
    }
    if (shouldRevealDealer) {
        allModMessages.push('Dealer hand revealed.');
    }

    const enrageMsg = nextIsEnraged && !state.isEnraged ? "MAJOR DEMON ENRAGED! (Double Dmg, Blind Play)" : "";

    const newState = {
        ...tempState,
        playerHands: [playerHand],
        dealerHand: { ...dealerHand, status: HandStatus.Standing },
        playerHP: nextPlayerHP,
        activeHandIndex: 0,
        gamePhase: 'playerTurn' as GamePhase,
        blockedAction: null,
        message: [enrageMsg, ...roundStartMessages, ...allModMessages].filter(Boolean).join(' ') || 'Your Turn',
        playerShield,
        isDealerIntimidated: false,
        isBossStunned: false,
        isEnraged: nextIsEnraged
    };

    if (playerHand.status === HandStatus.Blackjack) {
        newState.message = "Blackjack!" + (allModMessages.length > 0 ? ` (${allModMessages.join(' ')})` : '');
        return gameReducer(newState, { type: 'STAND' });
    }
    
    return newState;
}

function getRandomRelics(count: number, unlockedIds: RelicId[], currentRelics: Relic[]): Relic[] {
    const currentIds = new Set(currentRelics.map(r => r.id));
    const availableIds = Array.from(new Set(unlockedIds.filter(id => !currentIds.has(id))));
    
    // If we don't have enough unlocked relics, fallback to some defaults
    if (availableIds.length < count) {
        const defaults = [RelicId.GamblersFallacy, RelicId.GoldenKnuckles, RelicId.VampiricFangs, RelicId.FirstAidKit, RelicId.Hourglass];
        for (const id of defaults) {
            if (!currentIds.has(id) && !availableIds.includes(id)) {
                availableIds.push(id);
            }
        }
    }

    const shuffled = [...availableIds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(id => RELICS[id] || RELICS[RelicId.GamblersFallacy]);
}

export function createInitialState(metaState: MetaState, mode: GameMode = 'endless'): GameState {
    const unlockedRelics = metaState?.unlockedRelicIds || [];
    const unlockedCardBacks = metaState?.unlockedCustomizations?.cardBacks || ['default'];
    const unlockedSkills = metaState?.unlockedSkills || [];
    const unlockedModifierCardIds = metaState?.unlockedModifierCardIds || [CardModifierId.THE_REAPER];

    let maxHPBonus = 0;
    let dmgBonus = 0;
    let potionSlotsBonus = 0;
    let shieldOnStandBonus = 0;
    let critChanceBonus = 0;
    let focusGainBonus = 0;

    if (unlockedSkills.includes('hp_1')) maxHPBonus += 10;
    if (unlockedSkills.includes('hp_2')) maxHPBonus += 20;
    if (unlockedSkills.includes('dmg_1')) dmgBonus += 1;
    if (unlockedSkills.includes('dmg_2')) dmgBonus += 2;
    if (unlockedSkills.includes('potion_1')) potionSlotsBonus += 1;
    if (unlockedSkills.includes('shield_1')) shieldOnStandBonus += 5;
    if (unlockedSkills.includes('crit_1')) critChanceBonus += 0.05;
    if (unlockedSkills.includes('focus_1')) focusGainBonus += 1;

    return {
        ...defaultState,
        mode,
        dealerArchetype: getRandomDealerArchetype(),
        bossPhase: BossPhase.Phase1,
        tableLighting: TableLighting.Normal,
        unlockedRelicIds: unlockedRelics,
        unlockedModifierCardIds,
        unlockedSkills,
        deck: shuffleDeck(createDeck(unlockedModifierCardIds)),
        permanentFlatDamageBonus: dmgBonus,
        playerMaxHP: defaultState.playerMaxHP + (unlockedCardBacks.includes('royal') ? 10 : 0) + maxHPBonus,
        playerHP: defaultState.playerMaxHP + (unlockedCardBacks.includes('royal') ? 10 : 0) + maxHPBonus,
        maxPotionCharges: defaultState.maxPotionCharges + potionSlotsBonus,
        potionCharges: defaultState.maxPotionCharges + potionSlotsBonus,
        shieldOnStand: defaultState.shieldOnStand + shieldOnStandBonus,
        permanentCritChance: defaultState.permanentCritChance + critChanceBonus,
        critChance: defaultState.critChance + critChanceBonus,
        focusGainBonus: defaultState.focusGainBonus + focusGainBonus,
    };
}

export function updateTableLighting(state: GameState): TableLighting {
    if (state.isEnraged) return TableLighting.HighStakes;
    if (state.gamePhase === 'dealerTurn') return TableLighting.Tension;
    return TableLighting.Normal;
}

export function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'UPDATE_LIGHTING': {
            return { ...state, tableLighting: action.lighting };
        }
        case 'CLEAR_PENDING_VISUAL_EFFECT': {
            return { ...state, pendingVisualEffect: undefined };
        }
        case 'START_NEW_RUN': {
            const baseState = createInitialState(action.metaState || {} as MetaState, action.mode);
            const startingRelics = action.startingRelicId ? [{ ...RELICS[action.startingRelicId], id: action.startingRelicId }] : [];
            
            const newState = dealInitialHands({ 
                ...baseState, 
                relics: action.startingRelicId ? [{ ...RELICS[action.startingRelicId], id: action.startingRelicId }] : [],
                weather: getRandomWeather(baseState.currentFloor, baseState.mode)
            });

            if (action.mode === 'campaign') {
                return {
                    ...newState,
                    gamePhase: 'cutscene',
                    returnPhase: newState.gamePhase, // Store the phase to return to after cutscene
                    currentCutscene: CAMPAIGN_STORY['intro']
                };
            }

            return newState;
        }

        case 'START_NEXT_HAND': {
            return dealInitialHands(state);
        }

        case 'SELECT_SEASONAL_REWARD': {
            let newState = { ...state };
            switch (action.rewardId) {
                case 'void_shards':
                    newState.runCurrency += 250;
                    break;
                case 'void_relic':
                    // Just a placeholder for now, maybe add a specific relic
                    break;
                case 'void_hp':
                    newState.playerMaxHP += 20;
                    newState.playerHP += 20;
                    break;
            }
            return dealInitialHands({
                ...newState,
                gamePhase: 'roundStart',
            });
        }

        case 'BONFIRE_ACTION': {
            let newState = { ...state };
            let msg = "";
            switch (action.action) {
                case 'rest':
                    const healAmt = Math.floor(state.playerMaxHP * 0.3);
                    if (state.relics.some(r => r.id === RelicId.DARKSIGN)) {
                        msg = "The Darksign prevents healing.";
                    } else {
                        newState.playerHP = Math.min(state.playerMaxHP, state.playerHP + healAmt);
                        msg = "Rested at the bonfire. HP Restored.";
                    }
                    break;
                case 'kindle':
                    newState.potionCharges += 1;
                    msg = "Estus kindled. +1 Potion Charge.";
                    break;
                case 'purge':
                    if (newState.curses.length > 0) {
                        newState.curses.shift();
                        msg = "Humanity restored. Curse purged.";
                    } else {
                        newState.playerXP += 100;
                        msg = "No curses to purge. Gained XP instead.";
                    }
                    break;
                case 'leave':
                    return dealInitialHands(state);
            }
            return dealInitialHands({ ...newState, message: msg });
        }

        case 'HIT': {
            if (state.gamePhase !== 'playerTurn' && state.gamePhase !== 'tutorial') return state;
            if (state.gamePhase === 'tutorial') return gameReducer(state, { type: 'TUTORIAL_ACTION', step: state.tutorialStep });

            const hitCost = state.floorModifier.id === FloorModifierId.HeavyAir ? 1 : 0;
            if (state.playerHP <= hitCost) return state;
            const deal = dealCard(state);
            let tempState = { ...state, deck: deal.deck, discardPile: deal.discardPile, playerHP: state.playerHP - hitCost };
            const hitCostMessage = hitCost > 0 ? 'Heavy Air: -1 HP. ' : '';
            const activeHand = tempState.playerHands[tempState.activeHandIndex];
            
            const drawChain = processDrawChain(tempState, deal.card, activeHand);
            let newState = drawChain.newState;
            
            const updatedHand = updateHand(activeHand, drawChain.finalCards, newState);
            const newHands = [...newState.playerHands];
            newHands[newState.activeHandIndex] = updatedHand;

            const finalState = {
                ...newState,
                playerHands: newHands,
                message: `${hitCostMessage}${drawChain.messages.join(' ')}`.trim() || state.message,
            };

            // Abyssal Eye: Reveal dealer card if score <= 10
            if (finalState.relics.some(r => r.id === RelicId.AbyssalEye) && updatedHand.score <= 10) {
                finalState.dealerHand = { ...finalState.dealerHand, isRevealed: true };
            }

            if (updatedHand.status === HandStatus.SuperWin) {
                const synergyName = updatedHand.activeSynergies.find(s => s.id === SynergyId.NumericalStraight || s.id === SynergyId.LuckySevens)?.name;
                return {
                    ...finalState,
                    gamePhase: 'gameOver',
                    message: `${synergyName || 'Super Win'}!`,
                };
            }

            if (updatedHand.status === HandStatus.Busted) {
                if (state.relics.some(r => r.id === RelicId.EVENT_HORIZON) && Math.random() < 0.25) {
                    return {
                        ...tempState,
                        playerHP: Math.max(1, state.playerHP - 1),
                        message: "Event Horizon! The bust was consumed by the void. (-1 HP)",
                    };
                }
                return gameReducer(finalState, { type: 'STAND' });
            }

            if (updatedHand.status === HandStatus.Blackjack || updatedHand.status === HandStatus.Win || updatedHand.status === HandStatus.Standing) {
                 return gameReducer(finalState, { type: 'STAND' });
            }
            return finalState;
        }

        case 'BURN_CARD': {
            if (state.gamePhase !== 'playerTurn') return state;
            
            const activeHand = state.playerHands[state.activeHandIndex];
            const cardIndex = activeHand.cards.findIndex(c => c.id === action.cardId);
            if (cardIndex === -1) return state;

            const burnedCard = activeHand.cards[cardIndex];
            const newCards = activeHand.cards.filter((_, i) => i !== cardIndex);
            
            // Burn cost: 10 HP
            const hpCost = hasCurse(state, CurseId.Butterfingers) ? 15 : 10;
            if (state.playerHP <= hpCost) return state;

            const updatedHand = updateHand({ ...activeHand, cards: newCards }, [], state);
            const newHands = [...state.playerHands];
            newHands[state.activeHandIndex] = updatedHand;

            return {
                ...state,
                playerHP: state.playerHP - hpCost,
                playerHands: newHands,
                discardPile: [...state.discardPile, burnedCard],
                message: `Burned ${burnedCard.rank} of ${burnedCard.suit}. Lost ${hpCost} HP.`
            };
        }

        case 'SURRENDER': {
            if (state.gamePhase !== 'playerTurn') return state;
            const hpCost = 5;
            if (state.playerHP <= hpCost) return state;

            const activeHand = state.playerHands[state.activeHandIndex];
            const updatedHand = { ...activeHand, status: HandStatus.Lose, score: 0 }; 
            const newHands = [...state.playerHands];
            newHands[state.activeHandIndex] = updatedHand;

            const nextState = { 
                ...state, 
                playerHP: state.playerHP - hpCost, 
                playerHands: newHands, 
                message: 'Surrendered! Lost 5 HP.' 
            };
            
            return gameReducer(nextState, { type: 'STAND' });
        }

        case 'STAND': {
            if (state.gamePhase !== 'playerTurn' && state.gamePhase !== 'roundStart' && state.gamePhase !== 'tutorial') return state;
            if (state.gamePhase === 'tutorial') return gameReducer(state, { type: 'TUTORIAL_ACTION', step: state.tutorialStep });

            const currentHand = state.playerHands[state.activeHandIndex];
            if (!currentHand) return state;

            const updatedHands = [...state.playerHands];
            const standingHand = currentHand.status === HandStatus.Hitting
                ? { ...currentHand, status: HandStatus.Standing }
                : currentHand;
            updatedHands[state.activeHandIndex] = standingHand;

            const perfectParry = standingHand.score === 21 && standingHand.status !== HandStatus.Lose && standingHand.status !== HandStatus.Blackjack;
            const nextIndex = state.activeHandIndex + 1;
            const baseState = {
                ...state,
                playerHands: updatedHands,
                isBossStunned: state.isBossStunned || perfectParry,
                message: perfectParry ? 'PERFECT PARRY! Dealer Stunned!' : state.message,
            };

            if (nextIndex < updatedHands.length) {
                return { 
                    ...baseState, 
                    activeHandIndex: nextIndex, 
                    message: `Hand ${nextIndex + 1}: Your turn.` 
                };
            }
            
            const allHandsDone = updatedHands.every(h => h.status === HandStatus.Busted || h.status === HandStatus.Lose);
            if (allHandsDone) {
                return {
                    ...baseState,
                    gamePhase: 'gameOver',
                    message: 'Round resolved.',
                };
            }
            
            const dealerCards = baseState.dealerHand.cards.map(c => ({...c, tell: c.tell ?? null}));
            const dealerHandRevealed = updateHand({ ...baseState.dealerHand, cards: dealerCards }, [], { ...baseState, dealerHand: { ...baseState.dealerHand, cards: dealerCards } });
            
            if (baseState.isBossStunned) {
                return { 
                    ...baseState, 
                    dealerHand: dealerHandRevealed,
                    gamePhase: 'gameOver', 
                    message: 'Dealer is Stunned! Direct Hit!' 
                };
            }
            
            let shieldFromStand = 0;
            if(baseState.shieldOnStand > 0) {
                shieldFromStand += baseState.shieldOnStand;
            }
            if(baseState.relics.some(r => r.id === RelicId.SANDALS_OF_HERMES)) {
                shieldFromStand += 3;
            }

            return { 
                ...baseState, 
                playerShield: baseState.playerShield + shieldFromStand,
                dealerHand: dealerHandRevealed,
                gamePhase: 'dealerTurn',
                message: shieldFromStand > 0 ? `Dealer Turn... +${shieldFromStand} Shield for standing.` : 'Dealer Turn...'
            };
        }

        case 'DEALER_TURN_ACTION': {
            if (state.gamePhase !== 'dealerTurn') return state;

            if (state.isDealerIntimidated) {
                return {
                    ...state,
                    isDealerIntimidated: false,
                    gamePhase: 'gameOver',
                    message: 'Dealer is Intimidated and Skips!'
                };
            }

            let dealerThreshold = 17;
            if (state.dealerArchetype === DealerArchetype.Cautious) {
                dealerThreshold = 16;
            } else if (state.dealerArchetype === DealerArchetype.Aggressive) {
                dealerThreshold = 18;
            }

            if (state.dealerHand.score < dealerThreshold) {
                const { card, deck, discardPile } = dealCard(state);
                const chain = processDrawChain({ ...state, deck, discardPile }, card, state.dealerHand, 'dealer');
                const updatedDealerHand = updateHand(state.dealerHand, chain.finalCards, chain.newState);
                const dealerDone = updatedDealerHand.status === HandStatus.Busted || updatedDealerHand.score >= dealerThreshold;
                return {
                    ...chain.newState,
                    dealerHand: dealerDone ? { ...updatedDealerHand, status: updatedDealerHand.status === HandStatus.Busted ? HandStatus.Busted : HandStatus.Standing } : updatedDealerHand,
                    gamePhase: dealerDone ? 'gameOver' : 'dealerTurn',
                    message: dealerDone
                        ? (updatedDealerHand.status === HandStatus.Busted ? `Dealer Busts on ${updatedDealerHand.score}!` : `Dealer Stands on ${updatedDealerHand.score}`)
                        : (chain.messages.length > 0 ? `Dealer: ${chain.messages.join(' ')}` : 'Dealer Hits...')
                };
            } else {
                return {
                    ...state,
                    dealerHand: { ...state.dealerHand, status: HandStatus.Standing },
                    gamePhase: 'gameOver',
                    message: `Dealer Stands on ${state.dealerHand.score}`
                }; 
            }
        }

        case 'DOUBLE': {
            if (state.gamePhase !== 'playerTurn') return state;
            const hpCost = DOUBLE_COST + (hasCurse(state, CurseId.WeakKnees) ? 3 : 0);
            if (state.playerHP <= hpCost) return state;

            const { card, deck, discardPile } = dealCard(state);
            const activeHand = state.playerHands[state.activeHandIndex];
            
            // Process chain for the double card
            const chain = processDrawChain({ ...state, deck, discardPile }, card, activeHand);
            const updatedHand = updateHand({ ...activeHand, isDoubled: true }, chain.finalCards, chain.newState);
            
            const newHands = [...state.playerHands];
            newHands[state.activeHandIndex] = updatedHand;

            const nextState = { 
                ...chain.newState, 
                playerHP: state.playerHP - hpCost, 
                playerHands: newHands,
                message: chain.messages.length > 0 ? `Double! ${chain.messages.join(' ')}` : 'Double!'
            };
            return gameReducer(nextState, { type: 'STAND' });
        }

        case 'SPLIT': {
            if (state.gamePhase !== 'playerTurn') return state;
            const activeHand = state.playerHands[state.activeHandIndex];
            if (activeHand.cards.length !== 2) return state;
            
            const splitCost = state.relics.some(r => r.id === RelicId.SplittersCharm) && state.playerHands.length === 1 ? 0 : SPLIT_COST;
            if (state.playerHP <= splitCost) return state;
        
            const card1 = activeHand.cards[0];
            const card2 = activeHand.cards[1];
        
            const deal1 = dealCard(state);
            const stateAfterDeal1 = { ...state, deck: deal1.deck, discardPile: deal1.discardPile };
            
            // Process chain for first split card
            const chain1 = processDrawChain(stateAfterDeal1, deal1.card, { 
                ...activeHand, cards: [card1] 
            });
            
            const deal2 = dealCard(chain1.newState);
            
            // Process chain for second split card
            const chain2 = processDrawChain({ ...chain1.newState, deck: deal2.deck, discardPile: deal2.discardPile }, deal2.card, { 
                ...activeHand, cards: [card2] 
            });
        
            const hand1 = updateHand({ 
                id: Date.now(), cards: [], score: 0, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0, isSplitHand: true 
            }, [card1, ...chain1.finalCards], chain1.newState);
            
            const hand2 = updateHand({ 
                id: Date.now() + 1, cards: [], score: 0, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0, isSplitHand: true 
            }, [card2, ...chain2.finalCards], chain2.newState);
        
            const newHands = [...state.playerHands];
            newHands.splice(state.activeHandIndex, 1, hand1, hand2);
        
            return {
                ...chain2.newState,
                playerHands: newHands,
                playerHP: state.playerHP - splitCost,
                message: `Split! ${[...chain1.messages, ...chain2.messages].join(' ')}`.trim()
            };
        }

        case 'INTIMIDATE': {
            if (state.focus < state.maxFocus) return state;
            return {
                ...state,
                focus: 0,
                isDealerIntimidated: true,
                message: 'Dealer Intimidated! (Turn Skipped)',
                gamePhase: 'playerTurn' 
            };
        }
        
        case 'SELECT_PACT': {
            const newState = action.pact.effect(state);
            return dealInitialHands({
                ...newState,
                gamePhase: 'roundStart',
            });
        }

        case 'RESOLVE_HAND': {
            const streakBonus = getStreakMultiplier(state.winStreak);
            let newComboMultiplier = state.comboMultiplier;
            let totalPlayerDamage = 0;
            let totalBossDamage = 0;
            let healing = 0;
            let shieldGain = 0;
            let shardsGained = 0;
            let triggersWheel = false;
            let focusGained = 0;
            let allModMessages: string[] = [];
            let usedPhoenixFeather = false;
            let hasWonAtLeastOneHand = false;
            let hasLostAtLeastOneHand = false;
            let winningHandsProcessed = 0;
            let newPotions = [...state.potions];
            let newPotionCharges = state.potionCharges;
            let newBossShield = state.bossShield;
            let newPermanentFlatDamageBonus = state.permanentFlatDamageBonus;
            const handResults = state.playerHands.map(hand =>
                hand.status === HandStatus.Lose && hand.score === 0 ? HandStatus.Lose : determineHandResult(hand, state.dealerHand)
            );
            const splitUniverseEligible = state.playerHands.filter(hand => hand.isSplitHand).length >= 2 &&
                state.playerHands.every((hand, index) =>
                    !hand.isSplitHand ||
                    [HandStatus.Win, HandStatus.Blackjack, HandStatus.SuperWin].includes(handResults[index])
                );
            let splitUniverseRewarded = false;

            state.playerHands.forEach((hand, index) => {
                if (hand.status === HandStatus.Lose && hand.score === 0) {
                     return;
                }

                if (hand.activeSynergies.some(s => s.id === SynergyId.EvenSplit)) {
                    shieldGain += 5;
                }
                if (hand.activeSynergies.some(s => s.id === SynergyId.Rainbow)) {
                    shieldGain += 20;
                }

                const result = handResults[index];
                
                if (result === HandStatus.Win || result === HandStatus.Blackjack || result === HandStatus.SuperWin) {
                    hasWonAtLeastOneHand = true;
                    newComboMultiplier += 0.1;
                    let damage = 0;

                    if (hand.status === HandStatus.SuperWin) {
                        if (hand.activeSynergies.some(s => s.id === SynergyId.StraightFlush)) {
                            damage = 100;
                        } else if (hand.activeSynergies.some(s => s.id === SynergyId.LuckySevens)) {
                            damage = 50;
                        } else if (hand.activeSynergies.some(s => s.id === SynergyId.NumericalStraight)) {
                            damage = 25;
                        }
                    } else { 
                        let handMultiplier = hand.damageMultiplier + streakBonus + (state.playerLevel * 0.1);

                        if (state.isRageActive) handMultiplier *= 2; 

                        if (result === HandStatus.Win) {
                            if (state.relics.some(r => r.id === RelicId.GoldenGauntlets) && winningHandsProcessed < 2) {
                                handMultiplier *= 2;
                                winningHandsProcessed++;
                            } else if (state.relics.some(r => r.id === RelicId.GoldenKnuckles) && winningHandsProcessed < 1) {
                                handMultiplier *= 2;
                                winningHandsProcessed++;
                            }
                        }
                        
                        damage = Math.max(0, (hand.score + hand.flatDamageBonus - (hasCurse(state, CurseId.DullBlade) ? 2 : 0)) * handMultiplier);
                        
                        if (state.bossPassive === 'void_aura' && hand.cards.length <= 2) {
                            damage *= 0.5;
                        }
                        
                        if (Math.random() < state.critChance) {
                            const critMult = state.relics.some(r => r.id === RelicId.ObsidianDice) ? 3 : 2;
                            damage *= critMult;
                        }

                        if (state.relics.some(r => r.id === RelicId.VikingHelmet)) {
                            damage += Math.floor((state.playerMaxHP - state.playerHP) / 10);
                        }
                        
                        if (hand.status === HandStatus.Blackjack) {
                            damage += 50; 
                        }
                    }

                    totalPlayerDamage += damage;

                    if (state.relics.some(r => r.id === RelicId.MIDAS_TOUCH)) {
                        shardsGained += Math.floor(damage * 0.1);
                    }

                    focusGained += (10 + state.focusGainBonus);
                    if(hand.activeSynergies.some(s => s.id === SynergyId.PrimeTime)) focusGained += 10;
                    if(hand.activeSynergies.some(s => s.id === SynergyId.Snapshot)) focusGained += 10;
                    if(hand.activeSynergies.some(s => s.id === SynergyId.KingsRansom)) shardsGained += 5;
                    if(hand.activeSynergies.some(s => s.id === SynergyId.DivineNine) && Math.random() < 0.25) newPotionCharges = Math.min(state.maxPotionCharges, newPotionCharges + 1);
                    if(hand.activeSynergies.some(s => s.id === SynergyId.DoubleDownFrenzy)) shardsGained += 10;
                    if(!splitUniverseRewarded && hand.activeSynergies.some(s => s.id === SynergyId.SplitUniverse) && splitUniverseEligible) {
                        const potionIds: PotionId[] = [PotionId.HealingPotion, PotionId.ShieldPotion, PotionId.RagePotion, PotionId.VoidPotion];
                        const randomPotionId = potionIds[Math.floor(Math.random() * potionIds.length)];
                        if (state.potions.some(p => p.id === randomPotionId)) {
                            newPotionCharges = Math.min(state.maxPotionCharges, newPotionCharges + 1);
                            allModMessages.push('Split Universe! Both split hands won; gained a potion charge.');
                        }
                        splitUniverseRewarded = true;
                    }
                    
                    shardsGained += (10 + (state.activeBoons.some(b => b.id === BoonId.SHARD_GAIN_UP) ? 2 : 0));
                    if (state.relics.some(r => r.id === RelicId.CursedCoin)) shardsGained += 2;
                    
                    // Void Affinity I: 5% chance for bonus shards (simulating Void Chest)
                    if (state.unlockedSkills.includes('void_1') && Math.random() < 0.05) {
                        shardsGained += 50;
                        allModMessages.push("Void Affinity! Found extra shards in the abyss.");
                    }

                    if (hand.status === HandStatus.Blackjack) {
                        triggersWheel = true;
                        if (state.relics.some(r => r.id === RelicId.MIRROR_SHARD)) shieldGain += 10;
                    }

                    if (hand.activeSynergies.some(s => s.id === SynergyId.BlackjackFlush)) healing += 5;
                    if (hand.activeSynergies.some(s => s.id === SynergyId.Flush)) healing += 25;
                    
                    if (state.relics.some(r => r.id === RelicId.SharpeningStone)) {
                        newPermanentFlatDamageBonus += 1;
                    }
                    if (state.relics.some(r => r.id === RelicId.VampiricCrown)) {
                        healing += Math.floor(damage * 0.35);
                    } else if (state.relics.some(r => r.id === RelicId.VampiricFangs)) {
                        healing += Math.floor(damage * 0.2);
                    }
                    if (hand.cards.some(c => c.modifier === CardModifierId.THE_VAMPIRE)) {
                        healing += Math.floor(damage * 0.5);
                    }

                } else if ((result === HandStatus.Lose || result === HandStatus.Busted) && state.relics.some(r => r.id === RelicId.PhoenixFeather) && !state.phoenixFeatherUsed) {
                    shieldGain += 5;
                    allModMessages.push('Phoenix Feather saved a losing hand as a Push.');
                    usedPhoenixFeather = true;
                } else if (result === HandStatus.Lose || result === HandStatus.Busted) {
                    newComboMultiplier = 1;
                    hasLostAtLeastOneHand = true;
                    let bossDmg = 10 + (state.currentFloor * 3) + (hasCurse(state, CurseId.BrittleBones) ? 2 : 0); 
                    if (state.bossIntent.id === BossIntentId.AttackUp) bossDmg *= 1.5;
                    if (state.bossIntent.id === BossIntentId.Haymaker) bossDmg *= 2.5;
                    if (state.isEnraged) bossDmg *= 1.5;
                    
                    if (result === HandStatus.Busted && state.relics.some(r => r.id === RelicId.VOID_AMULET)) {
                        bossDmg *= 0.5;
                    }

                    totalBossDamage += bossDmg;

                    if (state.relics.some(r => r.id === RelicId.CursedCoin)) totalPlayerDamage += 2; 
                    if (state.relics.some(r => r.id === RelicId.BlackCatCollar) && hand.score === 13) {
                        totalPlayerDamage += 13; 
                    }

                } else if (result === HandStatus.Push) {
                    newComboMultiplier = 1;
                    if (state.relics.some(r => r.id === RelicId.SovereignsChip)) {
                        shieldGain += 10;
                        totalPlayerDamage += 10;
                    } else {
                        if (state.relics.some(r => r.id === RelicId.GamblersChip)) shieldGain += 5;
                        if (state.relics.some(r => r.id === RelicId.JadeFigurine)) totalPlayerDamage += 5;
                    }
                }
            });

            if (state.relics.some(r => r.id === RelicId.DARKSIGN)) {
                healing = 0;
            }

            let newWinStreak = state.winStreak;
            let newHollowing = state.hollowingStacks;
            let newMaxHP = state.playerMaxHP;
            let newHandsPlayed = state.runStats.handsPlayed + state.playerHands.length;
            const newRoundsSurvived = state.roundsSurvived + 1;
            const enduranceStacks = state.activeBoons.filter(b => b.id === BoonId.SURVIVAL_BONUS).length;
            const enduranceBonus = enduranceStacks > 0 && newRoundsSurvived % 3 === 0 ? 0.1 * enduranceStacks : 0;
            const newSurvivalDamageMultiplier = state.survivalDamageMultiplier + enduranceBonus;

            if (hasWonAtLeastOneHand) {
                newWinStreak++;
            } else if (hasLostAtLeastOneHand) {
                newWinStreak = 0;
                newMaxHP -= 2;
                newHollowing += 2;
            }

            if (hasCurse(state, CurseId.HeavyPockets)) {
                shardsGained = Math.floor(shardsGained * 0.8);
            }

            let blockedByBossShield = Math.min(newBossShield, Math.floor(totalPlayerDamage));
            newBossShield -= blockedByBossShield;
            let unblockedPlayerDamage = Math.max(0, Math.floor(totalPlayerDamage) - blockedByBossShield);
            let newBossHP = state.bossHP - unblockedPlayerDamage;
            let newPlayerHP = state.playerHP + Math.floor(healing);
            const resolutionMessageParts = [...allModMessages];
            if (enduranceBonus > 0) resolutionMessageParts.push(`Endurance grew to ${newSurvivalDamageMultiplier.toFixed(1)}x.`);
            if (blockedByBossShield > 0) resolutionMessageParts.push(`Dealer Shield blocked ${blockedByBossShield} damage.`);
            if (unblockedPlayerDamage > 0) resolutionMessageParts.push(`Dealt ${unblockedPlayerDamage} damage.`);
            if (Math.floor(healing) > 0) resolutionMessageParts.push(`Healed ${Math.floor(healing)} HP.`);
            if (shieldGain > 0) resolutionMessageParts.push(`Gained ${shieldGain} Shield.`);
            if (shardsGained > 0) resolutionMessageParts.push(`Earned ${shardsGained} Shards.`);
            const resolutionMessage = resolutionMessageParts.length > 0 ? resolutionMessageParts.join(' ') : 'Round resolved.';
            
            newPlayerHP = Math.min(newPlayerHP, newMaxHP);

            let newShield = state.playerShield + shieldGain;
            let newFocus = Math.min(state.maxFocus, state.focus + focusGained);

            let actualBossDamage = totalBossDamage;
            if (newShield >= actualBossDamage) {
                newShield -= actualBossDamage;
                actualBossDamage = 0;
            } else {
                actualBossDamage -= newShield;
                newShield = 0;
            }
            
            if (state.relics.some(r => r.id === RelicId.ReflectiveShield) && state.playerShield > 0 && totalBossDamage > 0) {
                newBossHP -= Math.floor(totalBossDamage * 0.5);
            }

            if (Math.floor(actualBossDamage) > 0) resolutionMessageParts.push(`Took ${Math.floor(actualBossDamage)} damage.`);
            newPlayerHP -= Math.floor(actualBossDamage);
            
            const xpGained = totalPlayerDamage > 0 ? Math.floor(totalPlayerDamage / 2) : 5;
            let newXP = state.playerXP + xpGained;
            let levelUp = false;
            let newPlayerLevel = state.playerLevel;
            let newXpToNextLevel = state.xpToNextLevel;
        
            if (newXP >= state.xpToNextLevel) {
                newXP -= state.xpToNextLevel;
                levelUp = true;
                newPlayerLevel += 1;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.5);
            }

            if (newPlayerHP <= 0) {
                if (state.relics.some(r => r.id === RelicId.Hourglass)) {
                    newPlayerHP = 1;
                    allModMessages.push("Saved by the Hourglass!");
                } else {
                    return { ...state, playerHP: 0, gamePhase: 'defeat', runStats: { ...state.runStats, victory: false, runEndedAt: new Date().toISOString(), shardsEarned: state.runCurrency + shardsGained, relicCurrencyEarned: state.runRelicCurrency, handsPlayed: newHandsPlayed }, winStreak: 0, comboMultiplier: 1 };
                }
            }
            
            if (triggersWheel) {
                let returnPhase: GamePhase = 'gameOver';
                if (newBossHP <= 0) {
                    returnPhase = levelUp ? 'levelUp' : 'reward';
                }
                
                if (newBossHP <= 0) {
                    newMaxHP += newHollowing;
                    newHollowing = 0;
                }

                return {
                    ...state,
                    bossHP: newBossHP,
                    bossShield: newBossShield,
                    bossPhase: updateBossPhase({ ...state, bossHP: newBossHP }),
                    playerHP: newPlayerHP,
                    playerMaxHP: newMaxHP,
                    hollowingStacks: newHollowing,
                    playerShield: newShield,
                    playerXP: newXP,
                    playerLevel: newPlayerLevel,
                    xpToNextLevel: newXpToNextLevel,
                    focus: newFocus,
                    potions: newPotions,
                    potionCharges: newPotionCharges,
                    runCurrency: state.runCurrency + shardsGained,
                    gamePhase: 'spinWheel',
                    returnPhase: returnPhase,
                    message: `BLACKJACK! Spin the Wheel of Fate! ${resolutionMessage}`.trim(),
                    levelUpChoices: levelUp ? getRandomLevelUpChoices(3) : state.levelUpChoices,
                    rewardChoices: newBossHP <= 0 ? getRandomRelics(3, state.unlockedRelicIds, state.relics) : state.rewardChoices,
                    winStreak: newWinStreak,
                    runStats: { ...state.runStats, floor: state.currentFloor, totalDamageDealt: state.runStats.totalDamageDealt + unblockedPlayerDamage, handsPlayed: newHandsPlayed },
                    comboMultiplier: newComboMultiplier,
                    roundsSurvived: newRoundsSurvived,
                    survivalDamageMultiplier: newSurvivalDamageMultiplier,
                    permanentFlatDamageBonus: newPermanentFlatDamageBonus,
                    tempDamageMultiplier: state.tempDamageMultiplier ? (state.tempDamageMultiplier.roundsLeft > 1 ? { ...state.tempDamageMultiplier, roundsLeft: state.tempDamageMultiplier.roundsLeft - 1 } : null) : null,
                    isRageActive: false,
                    phoenixFeatherUsed: state.phoenixFeatherUsed || usedPhoenixFeather
                };
            }

            if (newBossHP <= 0) {
                newMaxHP += newHollowing;
                newHollowing = 0;

                return {
                    ...state,
                    bossHP: 0,
                    bossShield: newBossShield,
                    playerHP: newPlayerHP,
                    playerMaxHP: newMaxHP,
                    hollowingStacks: newHollowing,
                    playerShield: newShield,
                    playerXP: newXP,
                    playerLevel: newPlayerLevel,
                    xpToNextLevel: newXpToNextLevel,
                    focus: newFocus,
                    potions: newPotions,
                    potionCharges: newPotionCharges,
                    runCurrency: state.runCurrency + shardsGained,
                    runRelicCurrency: state.runRelicCurrency + (state.currentFloor % 5 === 0 ? 1 : 0),
                    gamePhase: levelUp ? 'levelUp' : 'reward',
                    returnPhase: levelUp ? 'reward' : undefined,
                    message: resolutionMessage,
                    levelUpChoices: levelUp ? getRandomLevelUpChoices(3) : state.levelUpChoices,
                    rewardChoices: getRandomRelics(3, state.unlockedRelicIds, state.relics),
                    winStreak: newWinStreak,
                    runStats: { ...state.runStats, floor: state.currentFloor, totalDamageDealt: state.runStats.totalDamageDealt + unblockedPlayerDamage, handsPlayed: newHandsPlayed },
                    comboMultiplier: newComboMultiplier,
                    roundsSurvived: newRoundsSurvived,
                    survivalDamageMultiplier: newSurvivalDamageMultiplier,
                    permanentFlatDamageBonus: newPermanentFlatDamageBonus,
                    tempDamageMultiplier: state.tempDamageMultiplier ? (state.tempDamageMultiplier.roundsLeft > 1 ? { ...state.tempDamageMultiplier, roundsLeft: state.tempDamageMultiplier.roundsLeft - 1 } : null) : null,
                    isRageActive: false,
                    phoenixFeatherUsed: state.phoenixFeatherUsed || usedPhoenixFeather
                };
            }

            if (levelUp) {
                return {
                    ...state,
                    bossHP: newBossHP,
                    bossShield: newBossShield,
                    bossPhase: updateBossPhase({ ...state, bossHP: newBossHP }),
                    playerHP: newPlayerHP,
                    playerMaxHP: newMaxHP,
                    hollowingStacks: newHollowing,
                    playerShield: newShield,
                    playerXP: newXP,
                    playerLevel: newPlayerLevel,
                    xpToNextLevel: newXpToNextLevel,
                    focus: newFocus,
                    potions: newPotions,
                    potionCharges: newPotionCharges,
                    runCurrency: state.runCurrency + shardsGained,
                    gamePhase: 'levelUp',
                    returnPhase: 'gameOver',
                    message: resolutionMessage,
                    levelUpChoices: getRandomLevelUpChoices(3),
                    winStreak: newWinStreak,
                    runStats: { ...state.runStats, floor: state.currentFloor, totalDamageDealt: state.runStats.totalDamageDealt + unblockedPlayerDamage, handsPlayed: newHandsPlayed },
                    comboMultiplier: newComboMultiplier,
                    roundsSurvived: newRoundsSurvived,
                    survivalDamageMultiplier: newSurvivalDamageMultiplier,
                    permanentFlatDamageBonus: newPermanentFlatDamageBonus,
                    tempDamageMultiplier: state.tempDamageMultiplier ? (state.tempDamageMultiplier.roundsLeft > 1 ? { ...state.tempDamageMultiplier, roundsLeft: state.tempDamageMultiplier.roundsLeft - 1 } : null) : null,
                    isRageActive: false,
                    phoenixFeatherUsed: state.phoenixFeatherUsed || usedPhoenixFeather
                };
            }

            return {
                ...state,
                bossHP: newBossHP,
                bossShield: newBossShield,
                bossPhase: updateBossPhase({ ...state, bossHP: newBossHP }),
                playerHP: newPlayerHP,
                playerMaxHP: newMaxHP,
                hollowingStacks: newHollowing,
                playerShield: newShield,
                playerXP: newXP,
                playerLevel: newPlayerLevel,
                xpToNextLevel: newXpToNextLevel,
                focus: newFocus,
                potions: newPotions,
                potionCharges: newPotionCharges,
                runCurrency: state.runCurrency + shardsGained,
                gamePhase: 'gameOver',
                showLootChest: false,
                    message: resolutionMessage,
                winStreak: newWinStreak,
                runStats: { ...state.runStats, floor: state.currentFloor, totalDamageDealt: state.runStats.totalDamageDealt + unblockedPlayerDamage, handsPlayed: newHandsPlayed },
                comboMultiplier: newComboMultiplier,
                    roundsSurvived: newRoundsSurvived,
                    survivalDamageMultiplier: newSurvivalDamageMultiplier,
                    permanentFlatDamageBonus: newPermanentFlatDamageBonus,
                    tempDamageMultiplier: state.tempDamageMultiplier ? (state.tempDamageMultiplier.roundsLeft > 1 ? { ...state.tempDamageMultiplier, roundsLeft: state.tempDamageMultiplier.roundsLeft - 1 } : null) : null,
                    isRageActive: false,
                    phoenixFeatherUsed: state.phoenixFeatherUsed || usedPhoenixFeather
            };
        }

        case 'AWARD_LOOT': {
            const { shards = 0, relicCurrency = 0, triggerWheel } = action.rewards;
            let nextState = {
                ...state,
                runCurrency: state.runCurrency + shards,
                runRelicCurrency: state.runRelicCurrency + relicCurrency,
                showLootChest: false,
                lootRewards: null
            };

            if (triggerWheel) {
                return { ...nextState, gamePhase: 'spinWheel', returnPhase: state.gamePhase };
            }

            if (state.bossHP <= 0) {
                 return nextState; 
            } else {
                return { ...nextState, gamePhase: 'gameOver' };
            }
        }


        case 'SELECT_CURSE': {
            const selected = CURSE_LIBRARY[action.curseId];
            if (!selected) return state;
            const nextState = {
                ...state,
                curses: [...state.curses, selected],
                curseChoices: [],
                message: `${selected.name} acquired.`,
            };
            return dealInitialHands({ ...nextState, gamePhase: 'roundStart' });
        }

        case 'SELECT_BOON': {
            const boonDef = BOONS[action.boonId];
            if (!boonDef) return state;
            const boon: Boon = { id: action.boonId, ...boonDef };
            let nextState = { ...state, activeBoons: [...state.activeBoons, boon], boonChoices: [], message: `${boon.name} gained.` };
            switch (action.boonId) {
                case BoonId.MAX_HP_UP_SMALL:
                    nextState.playerMaxHP += 10;
                    nextState.playerHP += 10;
                    break;
                case BoonId.FLAT_DAMAGE_UP_SMALL:
                    nextState.boonFlatDamageBonus += 2;
                    break;
                case BoonId.HEAL_SMALL:
                    if (!nextState.relics.some(r => r.id === RelicId.DARKSIGN)) {
                        nextState.playerHP = Math.min(nextState.playerMaxHP, nextState.playerHP + 15);
                    }
                    break;
                case BoonId.POTION_CHARGE_UP:
                    nextState.potionCharges = Math.min(nextState.maxPotionCharges, nextState.potionCharges + 1);
                    break;
                case BoonId.SURVIVAL_BONUS:
                    break;
            }
            return dealInitialHands({ ...nextState, gamePhase: 'roundStart' });
        }

        case 'SPIN_WHEEL_COMPLETE': {
            const { outcome, payload } = action.result;
            let nextState = { ...state };
            
            if (payload?.shards) nextState.runCurrency += payload.shards;
            if (payload?.relicCurrency) nextState.runRelicCurrency += payload.relicCurrency;
            if (payload?.hp) nextState.playerHP = Math.min(nextState.playerMaxHP, nextState.playerHP + payload.hp);
            if (outcome === WheelOutcome.INSTANT_BOON) {
                const boonIds = Object.values(BoonId);
                const randomBoonId = boonIds[Math.floor(Math.random() * boonIds.length)];
                const boon: Boon = { id: randomBoonId, ...BOONS[randomBoonId] };
                nextState.activeBoons = [...nextState.activeBoons, boon];
                if (randomBoonId === BoonId.MAX_HP_UP_SMALL) { nextState.playerMaxHP += 10; nextState.playerHP += 10; }
                if (randomBoonId === BoonId.FLAT_DAMAGE_UP_SMALL) nextState.boonFlatDamageBonus += 2;
                if (randomBoonId === BoonId.POTION_CHARGE_UP) nextState.potionCharges = Math.min(nextState.maxPotionCharges, nextState.potionCharges + 1);
                nextState.message = `Essence gained: ${boon.name}.`;
            }
            
            if (outcome === WheelOutcome.DAMAGE_BUFF) {
                nextState.tempDamageMultiplier = { value: 1.5, roundsLeft: 3 };
                nextState.message = "RAGE! 1.5x damage for 3 turns!";
            }
            if (outcome === WheelOutcome.PERMANENT_BUFF) {
                nextState.permanentFlatDamageBonus += 1;
                nextState.message = "ASCENSION! +1 permanent damage!";
            }
            
            if (outcome === WheelOutcome.PLAY_PLINKO || 
                outcome === WheelOutcome.PLAY_HIGHLOW || 
                outcome === WheelOutcome.PLAY_DICEROLL || 
                outcome === WheelOutcome.PLAY_SHELLGAME) {
                    
                let minigame: GamePhase = 'plinko';
                if (outcome === WheelOutcome.PLAY_HIGHLOW) minigame = 'highLow';
                if (outcome === WheelOutcome.PLAY_DICEROLL) minigame = 'diceRoll';
                if (outcome === WheelOutcome.PLAY_SHELLGAME) minigame = 'shellGame';
                
                return { ...nextState, gamePhase: minigame, returnPhase: state.returnPhase };
            }

            return { ...nextState, gamePhase: state.returnPhase || 'gameOver', returnPhase: undefined };
        }

        case 'SELECT_LEVEL_UP_CHOICE': {
            let newState = { ...state };
            switch(action.choiceId) {
                case LevelUpChoiceId.MAX_HP_UP:
                    newState.playerMaxHP += 10;
                    newState.playerHP += 10;
                    break;
                case LevelUpChoiceId.PERMANENT_DAMAGE_UP:
                    newState.permanentFlatDamageBonus += 2;
                    break;
                case LevelUpChoiceId.POTION_CAPACITY_UP:
                    newState.maxPotionCharges += 1;
                    newState.potionCharges += 1;
                    break;
                case LevelUpChoiceId.CRITICAL_HIT_CHANCE:
                    newState.permanentCritChance += 0.05;
                    newState.critChance = newState.permanentCritChance;
                    break;
                case LevelUpChoiceId.SHIELD_ON_STAND:
                    newState.shieldOnStand += 5;
                    break;
                case LevelUpChoiceId.FOCUS_GENERATION_UP:
                    newState.focusGainBonus += 5;
                    break;
            }
            return { ...newState, gamePhase: state.returnPhase || 'reward', returnPhase: undefined };
        }

        case 'SELECT_REWARD': {
             const relic = RELICS[action.relicId];
             let newStage = state.currentStage + 1;
             let newFloor = state.currentFloor;
             
             // Floor 1: 9 stages (3 bosses)
             // Floor 2: 12 stages (4 bosses)
             // Floor 3+: 15 stages (5 bosses)
             const stagesPerFloor = newFloor === 1 ? 9 : (newFloor === 2 ? 12 : 15);

             if (newStage > stagesPerFloor) {
                 newStage = 1;
                 newFloor += 1;
 
                 if (state.mode === 'campaign') {
                     if (newFloor > 5) {
                         return {
                             ...state,
                             relics: [...state.relics, relic],
                             gamePhase: 'cutscene',
                             currentCutscene: CAMPAIGN_STORY['victory'],
                             message: 'Campaign Complete!',
                             runStats: {
                                 ...state.runStats,
                                 victory: true,
                                 runEndedAt: new Date().toISOString(),
                                 shardsEarned: state.runCurrency,
                                 relicCurrencyEarned: state.runRelicCurrency
                             }
                         };
                     }
                     
                     const cutsceneId = `floor${newFloor - 1}_complete`;
                     const newBossMaxHP = Math.floor(initialBossHP + (initialBossHP * 0.15 * newFloor));
                     
                     return {
                         ...state,
                         relics: [...state.relics, relic],
                         currentFloor: newFloor,
                         currentStage: newStage,
                         gamePhase: 'cutscene',
                         currentCutscene: CAMPAIGN_STORY[cutsceneId],
                         bossHP: newBossMaxHP,
                         bossMaxHP: newBossMaxHP,
                         bossShield: 0,
                         isBossStunned: false,
                         isDealerIntimidated: false,
                         critChance: state.permanentCritChance, // Reset temporary floor buffs
                         playerHands: [],
                         dealerHand: { ...state.dealerHand, cards: [], score: 0, status: HandStatus.Hitting },
                         activeHandIndex: 0,
                         message: `Floor ${newFloor} - Stage ${newStage}`,
                         deck: shuffleDeck(createDeck(state.unlockedModifierCardIds)),
                         discardPile: [],
                         bossPassive: null,
                         bossIntent: { id: BossIntentId.None, name: 'None', description: '' },
                         floorModifier: { id: FloorModifierId.None, name: 'None', description: '' },
                     };
                 }
             }

             const newBossMaxHP = Math.floor(initialBossHP + (initialBossHP * 0.1 * newFloor) + (initialBossHP * 0.05 * newStage));
             
             let bossPassive: BossPassive = null;
             let message = `Stage ${newFloor}-${newStage}`;
             
             const isBossStage = newStage % 3 === 0;

             if (isBossStage) {
                 message = `Floor ${newFloor} Boss!`;
                 if (newFloor % 2 === 0) bossPassive = 'void_aura';
             }

             const nextState = { 
                 ...state, 
                 relics: [...state.relics, relic],
                 currentFloor: newFloor,
                 currentStage: newStage,
                 bossHP: newBossMaxHP,
                 bossMaxHP: newBossMaxHP,
                 playerShield: 0, 
                 bossShield: 0,
                 message: message,
                 floorModifier: getRandomFloorModifier(newFloor, state.unlockedSkills),
                 critChance: newFloor !== state.currentFloor ? state.permanentCritChance : state.critChance,
                 isEnraged: false,
                 bossPassive: bossPassive
             };

             if (newStage === 1) {
                 if (newFloor % 7 === 0) {
                     return {
                         ...nextState,
                         gamePhase: 'seasonalEvent',
                         message: "The Void Altar calls...",
                     };
                 }
                 if (newFloor > 1 && newFloor % 3 === 0) {
                     return {
                         ...nextState,
                         gamePhase: 'bonfire',
                         message: "A sanctuary found...",
                     };
                 }
                 if (newFloor % 4 === 0) {
                     return {
                         ...nextState,
                         gamePhase: 'strangerEncounter',
                         strangerChoices: getRandomPacts(2),
                     };
                 }
             }

             return dealInitialHands(nextState);
        }

        case 'START_TUTORIAL': {
            const tutorState = { 
                ...defaultState, 
                gamePhase: 'tutorial' as GamePhase, 
                tutorialStep: 1,
                playerHands: [updateHand({ id: Date.now(), cards: [{id:'t1', rank: Rank.Nine, suit: Suit.Spades}, {id:'t2', rank: Rank.Six, suit: Suit.Clubs}], score: 15, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }, [], defaultState)],
                dealerHand: { id: 0, cards: [{id:'td1', rank: Rank.Queen, suit: Suit.Diamonds}, {id:'td2', rank: Rank.Ten, suit: Suit.Spades}], score: 20, status: HandStatus.Standing, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }
            };
            return tutorState;
        }

        case 'TUTORIAL_ACTION': {
            let nextStep = state.tutorialStep + 1;
            let newState = { ...state, tutorialStep: nextStep };

            if (action.step === 5) {
                const newCard = {id: 't3', rank: Rank.Six, suit: Suit.Diamonds};
                newState.playerHands[0] = updateHand(newState.playerHands[0], [newCard], newState);
            }
            if (action.step === 7) {
                newState.playerHands = [updateHand({ id: Date.now(), cards: [{id:'t4', rank: Rank.Nine, suit: Suit.Spades}, {id:'t5', rank: Rank.Six, suit: Suit.Clubs}], score: 15, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }, [], newState)];
            }
            if (action.step === 8) {
                const newCard = {id: 't6', rank: Rank.Jack, suit: Suit.Clubs};
                newState.playerHands[0] = updateHand(newState.playerHands[0], [newCard], newState);
            }
            if (action.step === 10) {
                newState.playerHands = [updateHand({ id: Date.now(), cards: [{id:'t7', rank: Rank.Ten, suit: Suit.Spades}, {id:'t8', rank: Rank.Nine, suit: Suit.Hearts}], score: 19, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }, [], newState)];
                newState.dealerHand = { id: 0, cards: [{id:'td3', rank: Rank.Seven, suit: Suit.Diamonds}, {id:'td4', rank: Rank.Ten, suit: Suit.Clubs}], score: 17, status: HandStatus.Standing, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 };
            }
            if (action.step === 17) {
                newState.playerHands = [updateHand({ id: Date.now(), cards: [{id:'t9', rank: Rank.Ten, suit: Suit.Spades, modifier: CardModifierId.THE_REAPER}, {id:'t10', rank: Rank.Eight, suit: Suit.Diamonds}], score: 18, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }, [], newState)];
                newState.playerHP = Math.max(0, newState.playerHP - 6);
                newState.message = "REAPER DRAWN: -6 HP";
            }
            if (action.step === 20) {
                 newState.playerHands = [updateHand({ id: Date.now(), cards: [{id:'t11', rank: Rank.King, suit: Suit.Spades}, {id:'t12', rank: Rank.Eight, suit: Suit.Hearts}], score: 18, status: HandStatus.Hitting, damageMultiplier: 1, activeSynergies: [], flatDamageBonus: 0 }, [], newState)];
            }

            return newState;
        }

        case 'USE_POTION': {
            const potion = POTIONS[action.potionId];
            if (state.potionCharges <= 0 || !potion) return state;
            const consumePotion = !(state.relics.some(r => r.id === RelicId.AlchemistsRing) && Math.random() < 0.25);
            let newState = { ...state, potionCharges: consumePotion ? state.potionCharges - 1 : state.potionCharges };
            const preservedMessage = consumePotion ? '' : "Alchemist's Ring preserved the charge. ";
            
            if (action.potionId === PotionId.HealingPotion) {
                if (state.relics.some(r => r.id === RelicId.DARKSIGN)) {
                    newState.message = "The Darksign prevents healing.";
                } else {
                    newState.playerHP = Math.min(newState.playerMaxHP, newState.playerHP + 20);
                }
            } else if (action.potionId === PotionId.ShieldPotion) {
                newState.playerShield += 15;
            } else if (action.potionId === PotionId.CardPeeker) {
                newState.dealerHand = { ...newState.dealerHand, isRevealed: true };
                newState.message = "Dealer's hand revealed!";
            } else if (action.potionId === PotionId.RagePotion) {
                newState.isRageActive = false;
                newState.tempDamageMultiplier = { value: 2, roundsLeft: 1 };
                newState.playerHands = newState.playerHands.map(h => updateHand(h, [], newState));
                newState.message = "Rage! Double damage on your next resolution.";
            } else if (action.potionId === PotionId.PurificationPotion) {
                if (newState.curses.length > 0) {
                    newState.curses.shift();
                    newState.message = "Curse purified.";
                } else {
                    newState.message = "No curses to purify.";
                }
            } else if (action.potionId === PotionId.DeckStackerPotion) {
                // Add a 10 to the top of the deck
                const tenCard: Card = { id: `stacked-${Date.now()}`, suit: Suit.Spades, rank: Rank.Ten };
                newState.deck = [...newState.deck, tenCard];
                newState.message = "Next card will be a 10.";
            } else if (action.potionId === PotionId.VoidPotion) {
                const activeHand = newState.playerHands[newState.activeHandIndex];
                if (activeHand && activeHand.cards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * activeHand.cards.length);
                    const newCards = [...activeHand.cards];
                    newCards[randomIndex] = { 
                        ...newCards[randomIndex], 
                        modifier: CardModifierId.THE_VOIDWALKER,
                        rank: Rank.Two, // Voidwalker is usually Rank 2 in logic.ts
                        id: `void-${Date.now()}`
                    };
                    const newHands = [...newState.playerHands];
                    newHands[newState.activeHandIndex] = updateHand({ ...activeHand, cards: newCards }, [], newState);
                    newState.playerHands = newHands;
                    newState.message = "Card transformed by the Void.";
                }
            }
            
            return { ...newState, message: `${preservedMessage}${newState.message || `Used ${potion.name}`}`.trim() };
        }

        case 'ADVANCE_FLOOR': {
             const newFloor = state.currentFloor + 1;
             const newBossMaxHP = Math.floor(initialBossHP + (initialBossHP * 0.01 * state.currentFloor));
             
             let bossPassive: BossPassive = null;
             let message = `Floor ${newFloor} reached!`;

             if (newFloor % 10 === 0) {
                 bossPassive = 'void_aura';
                 message = "The Void Sentinel approaches...";
             }

             const nextModifier = getRandomFloorModifier(newFloor, state.unlockedSkills);
             
             let playerMaxHP = state.playerMaxHP;
             let playerHP = state.playerHP;

             // Revert previous Void Resilience if it was active
             if (state.floorModifier.id === FloorModifierId.VoidEvent && state.unlockedSkills.includes('void_3')) {
                 playerMaxHP -= 10;
                 playerHP = Math.min(playerHP, playerMaxHP);
             }

             // Apply new Void Resilience
             if (nextModifier.id === FloorModifierId.VoidEvent && state.unlockedSkills.includes('void_3')) {
                 playerMaxHP += 10;
                 playerHP += 10;
                 message += " Void Resilience activated! +10 Max HP.";
             }

             let nextState = { 
                 ...state, 
                 currentFloor: newFloor, 
                 playerShield: 0, 
                 bossShield: 0, 
                 bossHP: newBossMaxHP,
                 bossMaxHP: newBossMaxHP,
                 playerMaxHP,
                 playerHP,
                 message: message,
                 floorModifier: nextModifier,
                 isEnraged: false,
                 bossPassive: bossPassive,
                 weather: getRandomWeather(newFloor, state.mode)
             };
             return dealInitialHands(nextState);
        }

        case 'MINIGAME_COMPLETE': {
            return { 
                ...state, 
                runCurrency: state.runCurrency + action.rewards.shards, 
                playerXP: state.playerXP + action.rewards.xp,
                runRelicCurrency: state.runRelicCurrency + (action.rewards.relicCurrency || 0),
                gamePhase: state.returnPhase || 'gameOver',
                returnPhase: undefined
            };
        }

        case 'RESTART_GAME': {
            return createInitialState(action.metaState || {} as MetaState, action.mode || state.mode);
        }

        case 'START_CUTSCENE':
            return {
                ...state,
                gamePhase: 'cutscene',
                currentCutscene: CAMPAIGN_STORY[action.cutsceneId]
            };
        case 'END_CUTSCENE': {
            if (!state.currentCutscene) return state;
            const nextPhase = state.returnPhase || state.currentCutscene.nextPhase;
            const stateAfterCutscene = {
                ...state,
                gamePhase: nextPhase,
                currentCutscene: null,
                returnPhase: undefined
            };
            
            // If we are transitioning to a gameplay phase and have no hands, deal them
            if ((nextPhase === 'playerTurn' || nextPhase === 'dealerTurn') && state.playerHands.length === 0) {
                return dealInitialHands(stateAfterCutscene);
            }
            
            return stateAfterCutscene;
        }
        case 'REORDER_DECK':
            return {
                ...state,
                deck: action.newDeck
            };
        default: return state;
    }
}

function dealCard(state: GameState): { card: Card; deck: Card[]; discardPile: Card[] } {
  let currentDeck = [...state.deck];
  let currentDiscard = [...state.discardPile];

  if (currentDeck.length === 0) {
    currentDeck = shuffleDeck(currentDiscard);
    currentDiscard = [];
  }
  const card = currentDeck.pop()!;
  
  return { card, deck: currentDeck, discardPile: currentDiscard };
}

function applyModifierCardEffect(card: Card, state: GameState, hand: Hand, source: 'player' | 'dealer' = 'player'): {
    newState: GameState;
    message: string;
    drawAnother?: boolean;
    cloneCard?: Card;
    cloneNext?: boolean;
}
 {
    let newState = { ...state };
    let message = '';
    let drawAnother = false;
    let cloneCard: Card | undefined = undefined;
    let cloneNext = false;
    const isPlayer = source === 'player';
    const actor = isPlayer ? 'You' : 'Dealer';
    const negativeMultiplier = !isPlayer && state.relics.some(r => r.id === RelicId.SHATTERED_SOUL) ? 2 : 1;

    if (!card.modifier || card.isCloned) return { newState, message, drawAnother, cloneCard, cloneNext };

    const damagePlayer = (amount: number) => {
        let remaining = amount;
        if (newState.playerShield > 0) {
            const blocked = Math.min(newState.playerShield, remaining);
            newState.playerShield -= blocked;
            remaining -= blocked;
        }
        if (remaining > 0) newState.playerHP = Math.max(0, newState.playerHP - remaining);
    };

    switch (card.modifier) {
        case CardModifierId.THE_JESTER:
            if (isPlayer) {
                newState.runCurrency += 40;
                message = "Jester's Gift! +40 Shards!";
            } else {
                newState.bossShield += 12;
                message = "Dealer's Jester conjures +12 Shield.";
            }
            break;
        case CardModifierId.THE_ABYSS:
            if (isPlayer) {
                newState.playerShield = 0;
                message = "The Abyss consumes your Shield!";
            } else {
                newState.bossShield = 0;
                message = "Dealer's Abyss consumes their Shield!";
            }
            newState.pendingVisualEffect = 'glitch';
            break;
        case CardModifierId.THE_GUARDIAN:
            if (isPlayer) newState.playerShield += 15;
            else newState.bossShield += 15;
            message = `${actor}'s Guardian grants +15 Shield!`;
            break;
        case CardModifierId.THE_REAPER:
            if (isPlayer) {
                newState.playerHP = Math.max(0, newState.playerHP - 6);
                message = "The Reaper strikes! -6 HP.";
            } else {
                const damage = 6 * negativeMultiplier;
                newState.bossHP = Math.max(0, newState.bossHP - damage);
                message = `Dealer's Reaper backfires! Dealer takes ${damage} damage.`;
            }
            newState.pendingVisualEffect = 'blood';
            break;
        case CardModifierId.THE_BERSERKER:
            if (isPlayer) {
                newState.playerHP = Math.max(0, newState.playerHP - 4);
                newState.permanentFlatDamageBonus += 2;
                message = "Berserker's Rage! -4 HP, +2 permanent damage!";
            } else {
                const damage = 4 * negativeMultiplier;
                newState.bossHP = Math.max(0, newState.bossHP - damage);
                newState.bossShield += 8;
                message = `Dealer's Berserker misfires! Dealer takes ${damage}, gains +8 Shield.`;
            }
            newState.pendingVisualEffect = 'explosion';
            break;
        case CardModifierId.THE_ALCHEMIST:
            if (isPlayer) {
                newState.runCurrency += 25;
                newState.bossHP = Math.min(newState.bossMaxHP, newState.bossHP + 5);
                message = "Alchemy! +25 Shards, but the Dealer heals 5 HP.";
            } else {
                newState.bossHP = Math.min(newState.bossMaxHP, newState.bossHP + 10);
                newState.bossShield += 5;
                message = "Dealer's Alchemist restores 10 HP and +5 Shield.";
            }
            newState.pendingVisualEffect = 'magic';
            break;
        case CardModifierId.THE_ORACLE:
            if (isPlayer) {
                newState.dealerHand = { 
                    ...newState.dealerHand, 
                    cards: newState.dealerHand.cards.map(c => ({...c, tell: 'high'})),
                    isRevealed: true
                };
                message = "Oracle's Vision! The Dealer's hand is revealed.";
            } else {
                newState.blockedAction = 'double';
                message = "Dealer's Oracle foresees your burst. Double Down blocked.";
            }
            newState.pendingVisualEffect = 'glow';
            break;
        case CardModifierId.THE_VOIDWALKER:
            if (isPlayer) {
                newState.focus = Math.min(newState.maxFocus, newState.focus + 15);
                message = "Voidwalker appears! +15 Focus.";
            } else {
                newState.bossShield += 10;
                message = "Dealer's Voidwalker bends the table. Dealer gains +10 Shield.";
            }
            newState.pendingVisualEffect = 'glitch';
            break;
        case CardModifierId.THE_TIMEWARP:
            newState.deck = shuffleDeck([...newState.deck, ...newState.discardPile]);
            newState.discardPile = [];
            message = "Timewarp! The discard pile has been reshuffled into the deck.";
            break;
        case CardModifierId.THE_MAGNET:
            message = `${actor}'s Magnetic Pull draws another card...`;
            drawAnother = true;
            break;
        case CardModifierId.THE_CLONE:
            message = isPlayer ? "Clone primes the next draw..." : "Dealer's Clone primes the next draw...";
            cloneNext = true;
            drawAnother = true;
            newState.pendingVisualEffect = 'glitch';
            break;
        case CardModifierId.THE_JUDGEMENT: {
            const damage = Math.max(6, hand.score * 2);
            if (isPlayer) {
                newState.bossHP = Math.max(0, newState.bossHP - damage);
                message = `Judgement! Dealt ${damage} damage to the Dealer!`;
            } else {
                const hit = Math.max(4, Math.floor(damage / 2));
                damagePlayer(hit);
                message = `Dealer's Judgement burns you for ${hit}.`;
            }
            newState.pendingVisualEffect = 'magic';
            break;
        }
        case CardModifierId.THE_SUN:
            if (isPlayer) {
                newState.playerHP = Math.min(newState.playerMaxHP, newState.playerHP + 15);
                newState.bossHP = Math.max(0, newState.bossHP - 15);
                message = "The Sun's brilliance! Heal 15 HP and deal 15 damage!";
            } else {
                newState.bossHP = Math.min(newState.bossMaxHP, newState.bossHP + 15);
                damagePlayer(10);
                message = "Dealer's Sun scorches you and restores 15 HP.";
            }
            newState.pendingVisualEffect = 'glow';
            break;
        case CardModifierId.THE_VAMPIRE:
            if (isPlayer) {
                newState.playerHP = Math.min(newState.playerMaxHP, newState.playerHP + 5);
                newState.bossHP = Math.max(0, newState.bossHP - 5);
                message = "Vampire drains the Dealer! +5 HP, -5 Boss HP.";
            } else {
                newState.bossHP = Math.min(newState.bossMaxHP, newState.bossHP + 5);
                damagePlayer(5);
                message = "Dealer's Vampire drains you for 5 HP.";
            }
            newState.pendingVisualEffect = 'blood';
            break;
        case CardModifierId.THE_TOWER:
            if (isPlayer) {
                newState.playerShield += 30;
                newState.permanentFlatDamageBonus = Math.max(0, newState.permanentFlatDamageBonus - 1);
                message = "The Tower stands tall! +30 Shield, -1 permanent damage.";
            } else {
                newState.bossShield += 30;
                message = "Dealer's Tower raises +30 Shield.";
            }
            break;
        case CardModifierId.THE_STAR:
            if (isPlayer) {
                newState.critChance += 0.1;
                message = "The Star shines! +10% Crit Chance for this floor.";
            } else {
                newState.bossShield += 10;
                message = "Dealer's Star glitters into +10 Shield.";
            }
            break;
        case CardModifierId.THE_MOON:
            if (isPlayer) {
                newState.isDealerIntimidated = true;
                message = "The Moon confuses the Dealer! They are intimidated.";
            } else {
                newState.blockedAction = Math.random() > 0.5 ? 'double' : 'split';
                message = "Dealer's Moon curses your tactical options.";
            }
            break;
        case CardModifierId.THE_EMPEROR:
            if (isPlayer) {
                newState.playerShield += 10;
                newState.runCurrency += 10;
                message = "The Emperor commands! +10 Shield, +10 Shards.";
            } else {
                newState.bossShield += 15;
                message = "Dealer's Emperor commands +15 Shield.";
            }
            break;
        case CardModifierId.THE_EMPRESS:
            if (isPlayer) {
                newState.playerHP = Math.min(newState.playerMaxHP, newState.playerHP + 10);
                newState.focus = Math.min(newState.maxFocus, newState.focus + 10);
                message = "The Empress nurtures! +10 HP, +10 Focus.";
            } else {
                newState.bossHP = Math.min(newState.bossMaxHP, newState.bossHP + 10);
                newState.bossShield += 10;
                message = "Dealer's Empress restores 10 HP and +10 Shield.";
            }
            break;
    }
    return { newState, message, drawAnother, cloneCard, cloneNext };
}
