import assert from 'node:assert/strict';
import { createInitialState, gameReducer } from '../game/state';
import { calculateHandScore } from '../game/logic';
import { getActiveSynergies, SYNERGIES } from '../game/synergies';
import {
  BoonId,
  CardModifierId,
  DealerArchetype,
  GameState,
  Hand,
  HandStatus,
  PotionId,
  Rank,
  RelicId,
  Suit,
  SynergyId,
} from '../types';

const originalRandom = Math.random;

function withMockedRandom<T>(value: number, fn: () => T): T {
  Math.random = () => value;
  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

function hand(cards: Hand['cards'], overrides: Partial<Hand> = {}): Hand {
  const base: Hand = {
    id: Math.floor(Math.random() * 1_000_000),
    cards,
    score: calculateHandScore(cards),
    status: HandStatus.Standing,
    damageMultiplier: 1.2,
    activeSynergies: [],
    flatDamageBonus: 0,
    ...overrides,
  };
  return {
    ...base,
    activeSynergies: overrides.activeSynergies ?? getActiveSynergies(base),
  };
}

function baseState(): GameState {
  return {
    ...createInitialState({
      unlockedRelicIds: [RelicId.GoldenKnuckles],
      unlockedRuneIds: [],
      unlockedModifierCardIds: [CardModifierId.THE_REAPER],
      unlockedSkills: [],
      skillPoints: 0,
      totalCurrency: 0,
      relicCurrency: 0,
      runHistory: [],
      unlockedAchievementIds: [],
      hasCompletedTutorial: true,
      customization: { cardBack: 'default', tableFelt: 'green' },
      unlockedCustomizations: { cardBacks: ['default'], tableFelts: ['green'] },
      referralCount: 0,
      activeQuests: [],
      seasonStats: { totalBurned: 0 },
      currentSeason: { id: 1, name: 'Test', endsAt: '2099-01-01T00:00:00Z', totalBurnedGlobal: 0 },
    }),
    gamePhase: 'gameOver',
    critChance: 0,
    permanentCritChance: 0,
  };
}

withMockedRandom(0, () => {
  const state = createInitialState({
    unlockedRelicIds: [RelicId.GoldenKnuckles],
    unlockedRuneIds: [],
    unlockedModifierCardIds: [CardModifierId.THE_REAPER, CardModifierId.THE_SUN, CardModifierId.THE_CLONE],
    unlockedSkills: [],
    skillPoints: 0,
    totalCurrency: 0,
    relicCurrency: 0,
    runHistory: [],
    unlockedAchievementIds: [],
    hasCompletedTutorial: true,
    customization: { cardBack: 'default', tableFelt: 'green' },
    unlockedCustomizations: { cardBacks: ['default'], tableFelts: ['green'] },
    referralCount: 0,
    activeQuests: [],
    seasonStats: { totalBurned: 0 },
    currentSeason: { id: 1, name: 'Test', endsAt: '2099-01-01T00:00:00Z', totalBurnedGlobal: 0 },
  });
  assert.equal(state.unlockedModifierCardIds.includes(CardModifierId.THE_SUN), true);
  assert.equal(state.deck.some(card => card.modifier === CardModifierId.THE_SUN), true);
  assert.equal(state.unlockedModifierCardIds.includes(CardModifierId.THE_CLONE), true);
  assert.equal(state.deck.some(card => card.modifier === CardModifierId.THE_CLONE), true);
});

const aceLowStraightFlush = hand([
  { id: 'a', rank: Rank.Ace, suit: Suit.Hearts },
  { id: '2', rank: Rank.Two, suit: Suit.Hearts },
  { id: '3', rank: Rank.Three, suit: Suit.Hearts },
]);
assert.equal(getActiveSynergies(aceLowStraightFlush).some(s => s.id === SynergyId.StraightFlush), true);

{
  const state = {
    ...baseState(),
    gamePhase: 'playerTurn' as const,
    dealerArchetype: DealerArchetype.Balanced,
    playerHands: [hand([
      { id: 'p1', rank: Rank.Two, suit: Suit.Hearts },
      { id: 'p2', rank: Rank.Six, suit: Suit.Clubs },
    ], { status: HandStatus.Hitting })],
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Spades },
      { id: 'd2', rank: Rank.Seven, suit: Suit.Clubs },
    ], { id: 0 }),
    deck: [
      { id: 'next-four', rank: Rank.Four, suit: Suit.Diamonds },
    ],
  };

  const afterHit = gameReducer(state, { type: 'HIT' });
  assert.equal(afterHit.playerHands[0].score, 12);
  assert.equal(afterHit.playerHands[0].status, HandStatus.Hitting);

  const afterStand = gameReducer(afterHit, { type: 'STAND' });
  assert.equal(afterStand.playerHands[0].score, 12);
  assert.equal(afterStand.playerHands[0].status, HandStatus.Standing);
  assert.equal(afterStand.dealerHand.isRevealed, true);

  const afterDealer = gameReducer(afterStand, { type: 'DEALER_TURN_ACTION' });
  assert.equal(afterDealer.gamePhase, 'gameOver');
  assert.equal(afterDealer.playerHands[0].status, HandStatus.Standing);
}

{
  const state = {
    ...baseState(),
    gamePhase: 'dealerTurn' as const,
    dealerArchetype: DealerArchetype.Aggressive,
    playerHands: [hand([
      { id: 'p1', rank: Rank.Two, suit: Suit.Hearts },
      { id: 'p2', rank: Rank.Six, suit: Suit.Clubs },
      { id: 'p3', rank: Rank.Four, suit: Suit.Diamonds },
    ], { status: HandStatus.Standing })],
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Spades },
      { id: 'd2', rank: Rank.Seven, suit: Suit.Clubs },
    ], { id: 0, status: HandStatus.Hitting }),
    deck: [],
    discardPile: [],
  };

  const next = gameReducer(state, { type: 'DEALER_TURN_ACTION' });
  assert.equal(next.dealerHand.cards.every(Boolean), true);
  assert.equal(next.dealerHand.cards.length >= 3, true);
  assert.equal(next.deck.length > 0, true);
}

{
  const state = {
    ...baseState(),
    gamePhase: 'playerTurn' as const,
    playerHands: [hand([
      { id: 'p1', rank: Rank.Two, suit: Suit.Hearts },
      { id: 'p2', rank: Rank.Five, suit: Suit.Clubs },
    ], { status: HandStatus.Hitting })],
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Spades },
      { id: 'd2', rank: Rank.Seven, suit: Suit.Clubs },
    ], { id: 0 }),
    deck: [
      { id: 'next-four', rank: Rank.Four, suit: Suit.Diamonds },
      { id: 'clone-card', rank: Rank.Three, suit: Suit.Spades, modifier: CardModifierId.THE_CLONE },
    ],
  };
  const next = gameReducer(state, { type: 'HIT' });
  const updatedHand = next.playerHands[0];
  assert.equal(updatedHand.cards.length, 5);
  assert.equal(updatedHand.cards.filter(card => card.id.startsWith('next-four')).length, 2);
  assert.equal(updatedHand.cards.some(card => card.id.startsWith('next-four-clone') && card.isCloned), true);
  assert.equal(updatedHand.score, 18);
  assert.equal(updatedHand.activeSynergies.some(s => s.id === SynergyId.EchoChamber), true);
  assert.equal(updatedHand.damageMultiplier, 1.7);
}

{
  const state = {
    ...baseState(),
    potionCharges: 1,
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Clubs },
      { id: 'd2', rank: Rank.Nine, suit: Suit.Spades },
    ], { id: 0 }),
  };
  const next = gameReducer(state, { type: 'USE_POTION', potionId: PotionId.CardPeeker });
  assert.equal(next.potionCharges, 0);
  assert.equal(next.dealerHand.isRevealed, true);
}

{
  const playerHand = hand([
    { id: 'p1', rank: Rank.Ten, suit: Suit.Hearts },
    { id: 'p2', rank: Rank.Nine, suit: Suit.Clubs },
  ]);
  const state = { ...baseState(), potionCharges: 1, playerHands: [playerHand] };
  const next = gameReducer(state, { type: 'USE_POTION', potionId: PotionId.RagePotion });
  assert.equal(next.isRageActive, false);
  assert.equal(next.playerHands[0].damageMultiplier, 2.4);
}

withMockedRandom(0, () => {
  const playerHand = hand([
    { id: 'p1', rank: Rank.Ace, suit: Suit.Hearts },
    { id: 'p2', rank: Rank.King, suit: Suit.Hearts },
  ], { status: HandStatus.Blackjack });
  const state = { ...baseState(), potionCharges: 1, playerHands: [playerHand] };
  const next = gameReducer(state, { type: 'USE_POTION', potionId: PotionId.VoidPotion });
  assert.equal(next.playerHands[0].score, 11);
  assert.equal(next.playerHands[0].activeSynergies.some(s => s.id === SynergyId.BlackjackFlush), false);
});

withMockedRandom(0, () => {
  const splitSynergy = { id: SynergyId.SplitUniverse, ...SYNERGIES[SynergyId.SplitUniverse] };
  const state = {
    ...baseState(),
    potionCharges: 0,
    maxPotionCharges: 5,
    playerHands: [
      hand([
        { id: 's1', rank: Rank.Ten, suit: Suit.Hearts },
        { id: 's2', rank: Rank.Nine, suit: Suit.Clubs },
      ], { isSplitHand: true, activeSynergies: [splitSynergy] }),
      hand([
        { id: 's3', rank: Rank.Ten, suit: Suit.Diamonds },
        { id: 's4', rank: Rank.Eight, suit: Suit.Spades },
      ], { isSplitHand: true, activeSynergies: [splitSynergy] }),
    ],
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Spades },
      { id: 'd2', rank: Rank.Seven, suit: Suit.Clubs },
    ], { id: 0 }),
  };
  const next = gameReducer(state, { type: 'RESOLVE_HAND' });
  assert.equal(next.potionCharges, 1);
});

{
  const state = {
    ...baseState(),
    roundsSurvived: 2,
    survivalDamageMultiplier: 1,
    activeBoons: [{ id: BoonId.SURVIVAL_BONUS, name: 'Endurance', description: 'test' }],
    playerHands: [hand([
      { id: 'p1', rank: Rank.Ten, suit: Suit.Hearts },
      { id: 'p2', rank: Rank.Nine, suit: Suit.Clubs },
    ])],
    dealerHand: hand([
      { id: 'd1', rank: Rank.Ten, suit: Suit.Spades },
      { id: 'd2', rank: Rank.Seven, suit: Suit.Clubs },
    ], { id: 0 }),
  };
  const next = gameReducer(state, { type: 'RESOLVE_HAND' });
  assert.equal(next.roundsSurvived, 3);
  assert.equal(next.survivalDamageMultiplier, 1.1);
}

console.log('systems regression tests passed');
