import type { Card, Hand } from '../types';
import { Suit, Rank, HandStatus, SynergyId, CardModifierId } from '../types';

export const RANKS: Rank[] = Object.values(Rank);
export const SUITS: Suit[] = Object.values(Suit);
const NUM_DECKS = 6;

// HP Costs for actions
export const DOUBLE_COST = 5;
export const SPLIT_COST = 10;

export function createDeck(unlockedModifierIds: CardModifierId[] = [CardModifierId.THE_REAPER]): Card[] {
  let deck: Card[] = [];
  for (let i = 0; i < NUM_DECKS; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ id: `card-${suit}-${rank}-${i}`, suit, rank });
      }
    }
  }
  
  const modifiers = [
      { id: CardModifierId.THE_REAPER, rank: Rank.Ten, count: 2 },
      { id: CardModifierId.THE_GUARDIAN, rank: Rank.Ten, count: 2 },
      { id: CardModifierId.THE_JESTER, rank: Rank.Five, count: 2 },
      { id: CardModifierId.THE_ABYSS, rank: Rank.Two, count: 2 },
      { id: CardModifierId.THE_BERSERKER, rank: Rank.Eight, count: 2 },
      { id: CardModifierId.THE_ALCHEMIST, rank: Rank.Six, count: 2 },
      { id: CardModifierId.THE_ORACLE, rank: Rank.Ace, count: 2 },
      { id: CardModifierId.THE_VAMPIRE, rank: Rank.Five, count: 2 },
      { id: CardModifierId.THE_VOIDWALKER, rank: Rank.Two, count: 2 },
      { id: CardModifierId.THE_TIMEWARP, rank: Rank.Jack, count: 2 },
      { id: CardModifierId.THE_MAGNET, rank: Rank.Seven, count: 2 },
      { id: CardModifierId.THE_SUN, rank: Rank.King, count: 1 }, 
      { id: CardModifierId.THE_JUDGEMENT, rank: Rank.Queen, count: 1 },
      { id: CardModifierId.THE_TOWER, rank: Rank.Eight, count: 1 },
      { id: CardModifierId.THE_STAR, rank: Rank.Seven, count: 1 },
      { id: CardModifierId.THE_MOON, rank: Rank.Nine, count: 1 },
      { id: CardModifierId.THE_EMPEROR, rank: Rank.King, count: 1 },
      { id: CardModifierId.THE_EMPRESS, rank: Rank.Queen, count: 1 },
      { id: CardModifierId.THE_CLONE, rank: Rank.Three, count: 2 },
  ];

  for(let i=0; i<2; i++) { 
      modifiers.forEach((mod) => {
          if (unlockedModifierIds.includes(mod.id)) {
            for (let j=0; j < mod.count; j++) {
                deck.push({
                    id: `arcana-${mod.id}-${i}-${j}`,
                    suit: Suit.Spades, 
                    rank: mod.rank,
                    modifier: mod.id
                });
            }
          }
      });
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardValue(card: Card): { low: number; high: number } {
  // Fix: Abyss and Voidwalker now return 1 to avoid "0 value" hand issues causing dealer logic bypass
  if (card.modifier === CardModifierId.THE_ABYSS) return { low: 1, high: 1 };
  if (card.modifier === CardModifierId.THE_VOIDWALKER) return { low: 1, high: 1 };
  
  if (card.modifier === CardModifierId.THE_JESTER) return { low: 5, high: 5 };
  if (card.modifier === CardModifierId.THE_ALCHEMIST) return { low: 6, high: 6 };
  if (card.modifier === CardModifierId.THE_BERSERKER) return { low: 8, high: 8 };
  if (card.modifier === CardModifierId.THE_REAPER || card.modifier === CardModifierId.THE_GUARDIAN) return { low: 10, high: 10 };
  if (card.modifier === CardModifierId.THE_VAMPIRE) return { low: 5, high: 5 };
  if (card.modifier === CardModifierId.THE_TIMEWARP) return { low: 10, high: 10 };
  if (card.modifier === CardModifierId.THE_MAGNET) return { low: 7, high: 7 };
  if (card.modifier === CardModifierId.THE_SUN) return { low: 10, high: 10 };
  if (card.modifier === CardModifierId.THE_JUDGEMENT) return { low: 10, high: 10 }; 
  if (card.modifier === CardModifierId.THE_TOWER) return { low: 8, high: 8 };
  if (card.modifier === CardModifierId.THE_STAR) return { low: 7, high: 7 };
  if (card.modifier === CardModifierId.THE_MOON) return { low: 9, high: 9 };
  if (card.modifier === CardModifierId.THE_EMPEROR) return { low: 10, high: 10 };
  if (card.modifier === CardModifierId.THE_EMPRESS) return { low: 10, high: 10 };
  if (card.modifier === CardModifierId.THE_CLONE) return { low: 3, high: 3 };
  if (card.rank === Rank.Ace) return { low: 1, high: 11 };
  if ([Rank.King, Rank.Queen, Rank.Jack, Rank.Ten].includes(card.rank)) return { low: 10, high: 10 };
  return { low: parseInt(card.rank), high: parseInt(card.rank) };
}

export function calculateHandScore(cards: Card[]): number {
    let score = 0;
    let variableValues: number[] = [];

    for (const card of cards) {
        const value = getCardValue(card);
        if (value.high !== value.low) {
            variableValues.push(value.high - value.low);
            score += value.high;
        } else {
            score += value.low;
        }
    }

    // Sort differences descending so we reduce the largest differences first
    variableValues.sort((a, b) => b - a);

    let i = 0;
    while (score > 21 && i < variableValues.length) {
        score -= variableValues[i];
        i++;
    }

    return score;
}

export function isBlackjack(hand: Hand): boolean {
    return hand.cards.length === 2 && calculateHandScore(hand.cards) === 21;
}

export function canSplit(hand: Hand, playerHP: number): boolean {
    if (hand.cards.length !== 2 || playerHP <= SPLIT_COST) {
        return false;
    }
    const card1Value = getCardValue(hand.cards[0]).low;
    const card2Value = getCardValue(hand.cards[1]).low;
    return card1Value === card2Value;
}

export function canDouble(hand: Hand, playerHP: number): boolean {
    return hand.cards.length === 2 && playerHP > DOUBLE_COST;
}

export function determineHandResult(playerHand: Hand, dealerHand: Hand): HandStatus {
    const playerScore = playerHand.score;
    const dealerScore = dealerHand.score;
    const dealerHasBlackjack = dealerHand.status === HandStatus.Blackjack;

    if (playerHand.status === HandStatus.Busted) return HandStatus.Busted;
    if (playerHand.status === HandStatus.Lose) return HandStatus.Lose;
    if (playerHand.status === HandStatus.Win) return HandStatus.Win;
    if (playerHand.status === HandStatus.Blackjack) {
        return dealerHasBlackjack ? HandStatus.Push : HandStatus.Win;
    }
    if (playerHand.status === HandStatus.SuperWin) {
        return HandStatus.SuperWin;
    }
    if (playerScore > 21) return HandStatus.Busted;
    
    if (playerHand.activeSynergies.some(s => s.id === SynergyId.FiveCardCharlie)) {
        return HandStatus.Win;
    }

    if (dealerScore > 21) return HandStatus.Win;
    
    // Dealer blackjack beats player 21 (non-blackjack)
    if (dealerHasBlackjack) return HandStatus.Lose;

    if (playerScore > dealerScore) return HandStatus.Win;
    if (playerScore < dealerScore) return HandStatus.Lose;
    return HandStatus.Push;
}