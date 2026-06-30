
import type { Hand, Synergy, Card } from '../types';
import { SynergyId, Rank, Suit } from '../types';

export const SYNERGIES: Record<SynergyId, Omit<Synergy, 'id'>> = {
  [SynergyId.SuitedConnectors]: {
    name: 'Suited Connectors',
    description: '+0.5x Damage Multiplier for this hand.',
  },
  [SynergyId.PairedAces]: {
    name: 'Paired Aces',
    description: 'This hand is automatically a Blackjack (2.5x Damage).',
  },
  [SynergyId.LuckySevens]: {
    name: 'Lucky Sevens',
    description: 'Instantly win and deal 50 damage!',
  },
  [SynergyId.RoyalCourt]: {
    name: 'Royal Court',
    description: '+0.5x Damage Multiplier for this hand.',
  },
  [SynergyId.BlackjackFlush]: {
      name: 'Blackjack Flush',
      description: 'On win, heal for 5 HP.',
  },
  [SynergyId.FiveCardCharlie]: {
    name: 'Five Card Charlie',
    description: 'Having 5 cards without busting is an automatic win.',
  },
  [SynergyId.ColorFlush]: {
    name: 'Color Flush',
    description: '+5 flat damage for this hand.',
  },
  [SynergyId.PerfectTwentyOne]: {
    name: 'Perfect 21',
    description: 'A score of 21 with 3+ cards grants +0.25x Damage Multiplier.',
  },
  [SynergyId.AceInTheHole]: {
      name: 'Ace in the Hole',
      description: 'If your first card is an Ace, gain 5 Shield for the round.',
  },
  [SynergyId.BlackAndRed]: {
      name: 'Black and Red',
      description: 'If your starting hand has one black and one red card, heal 2 HP.',
  },
  [SynergyId.NumericalStraight]: {
      name: 'Numerical Straight',
      description: 'A 3-card hand with consecutive ranks is an instant Super Win, dealing 25 damage.',
  },
  [SynergyId.KingsRansom]: {
      name: 'King\'s Ransom',
      description: 'A King and Queen of the same suit grants +5 bonus Shards on a win.',
  },
  [SynergyId.FullHouse]: {
      name: 'Full House',
      description: '3 cards of one rank and 2 of another. Massive 3x Damage Multiplier!',
  },
  [SynergyId.Flush]: {
      name: 'Flush',
      description: '5 cards of the same suit. Heal 25 HP and Win.',
  },
  [SynergyId.StraightFlush]: {
      name: 'Straight Flush',
      description: '3+ consecutive cards of the same suit. Deal 100 Instant Damage.',
  },
  [SynergyId.TwoPair]: {
      name: 'Two Pair',
      description: 'Two different pairs in your hand. +1.5x Damage Multiplier.',
  },
  [SynergyId.ThreeOfAKind]: {
      name: 'Three of a Kind',
      description: 'Three cards of the same rank. +2.0x Damage Multiplier.',
  },
  [SynergyId.Lowball]: {
      name: 'Lowball',
      description: 'Winning with a score of 15 or less grants +10 Flat Damage.',
  },
  [SynergyId.EvenSplit]: {
      name: 'Even Split',
      description: 'If all cards in hand are Even ranks, gain +5 Shield.',
  },
  [SynergyId.OddSplit]: {
      name: 'Odd Split',
      description: 'If all cards in hand are Odd ranks, deal +5 Flat Damage.',
  },
  [SynergyId.PrimeTime]: {
      name: 'Prime Time',
      description: 'Hand score is a Prime Number (2, 3, 5, 7, 11, 13, 17, 19). Gain +10 Focus.',
  },
  [SynergyId.FaceOff]: {
      name: 'Face Off',
      description: 'Hand consists entirely of Face Cards. 2.0x Damage Multiplier.',
  },
  [SynergyId.DivineNine]: {
      name: 'Divine Nine',
      description: 'Score is exactly 9. 25% chance to gain a Potion Charge.',
  },
  [SynergyId.Zenith]: {
      name: 'Zenith',
      description: 'Score is exactly 20. +5 Flat Damage.',
  },
  [SynergyId.Rainbow]: {
      name: 'Rainbow',
      description: 'Hand contains all 4 suits. Gain +20 Shield.',
  },
  [SynergyId.Snapshot]: {
      name: 'Snapshot',
      description: '3 Cards in alternating colors (Red/Black/Red or Black/Red/Black). +10 Focus.',
  },
  [SynergyId.DoubleDownFrenzy]: {
      name: 'Double Down Frenzy',
      description: 'If you double down and win, gain +10 Shards.',
  },
  [SynergyId.SplitUniverse]: {
      name: 'Split Universe',
      description: 'If you split and both hands win, gain a random Potion.',
  },
  [SynergyId.GamblersEdge]: {
      name: 'Gambler\'s Edge',
      description: 'If your hand score is exactly 19, gain +15 Flat Damage.',
  }
};

const RANK_ORDER: Record<Rank, number> = {
  [Rank.Ace]: 14,
  [Rank.Two]: 2,
  [Rank.Three]: 3,
  [Rank.Four]: 4,
  [Rank.Five]: 5,
  [Rank.Six]: 6,
  [Rank.Seven]: 7,
  [Rank.Eight]: 8,
  [Rank.Nine]: 9,
  [Rank.Ten]: 10,
  [Rank.Jack]: 11,
  [Rank.Queen]: 12,
  [Rank.King]: 13,
};

const isRed = (suit: Suit) => suit === Suit.Diamonds || suit === Suit.Hearts;

// --- EXISTING CHECKS ---
const checkSuitedConnectors = (hand: Hand): Synergy | null => {
  if (hand.cards.length !== 2) return null;
  const [card1, card2] = hand.cards;
  if (card1.suit !== card2.suit) return null;
  const rank1Value = RANK_ORDER[card1.rank];
  const rank2Value = RANK_ORDER[card2.rank];
  if (Math.abs(rank1Value - rank2Value) === 1) return { id: SynergyId.SuitedConnectors, ...SYNERGIES[SynergyId.SuitedConnectors] };
  if ((card1.rank === Rank.Ace && card2.rank === Rank.King) || (card1.rank === Rank.King && card2.rank === Rank.Ace)) return { id: SynergyId.SuitedConnectors, ...SYNERGIES[SynergyId.SuitedConnectors] };
  return null;
};

const checkPairedAces = (hand: Hand): Synergy | null => {
  if (hand.cards.length !== 2) return null;
  if (hand.cards.every(c => c.rank === Rank.Ace)) return { id: SynergyId.PairedAces, ...SYNERGIES[SynergyId.PairedAces] };
  return null;
};

const checkLuckySevens = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 3 || hand.score !== 21) return null;
    if (hand.cards.every(c => c.rank === Rank.Seven)) return { id: SynergyId.LuckySevens, ...SYNERGIES[SynergyId.LuckySevens] };
    return null;
}

const checkRoyalCourt = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 2) return null;
    const [card1, card2] = hand.cards;
    if (card1.suit !== card2.suit) return null;
    const faceCards = [Rank.King, Rank.Queen, Rank.Jack];
    if (faceCards.includes(card1.rank) && faceCards.includes(card2.rank)) return { id: SynergyId.RoyalCourt, ...SYNERGIES[SynergyId.RoyalCourt] };
    return null;
}

const checkBlackjackFlush = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 2 || hand.score !== 21) return null;
    if (hand.cards[0].suit === hand.cards[1].suit) return { id: SynergyId.BlackjackFlush, ...SYNERGIES[SynergyId.BlackjackFlush] };
    return null;
}

const checkFiveCardCharlie = (hand: Hand): Synergy | null => {
    if (hand.cards.length === 5 && hand.score <= 21) return { id: SynergyId.FiveCardCharlie, ...SYNERGIES[SynergyId.FiveCardCharlie] };
    return null;
}

const checkColorFlush = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 2) return null;
    const [card1, card2] = hand.cards;
    if (isRed(card1.suit) === isRed(card2.suit)) return { id: SynergyId.ColorFlush, ...SYNERGIES[SynergyId.ColorFlush] };
    return null;
}

const checkPerfectTwentyOne = (hand: Hand): Synergy | null => {
    if (hand.cards.length >= 3 && hand.score === 21) return { id: SynergyId.PerfectTwentyOne, ...SYNERGIES[SynergyId.PerfectTwentyOne] };
    return null;
}

const checkAceInTheHole = (hand: Hand): Synergy | null => {
    if (hand.cards.length > 0 && hand.cards[0].rank === Rank.Ace) return { id: SynergyId.AceInTheHole, ...SYNERGIES[SynergyId.AceInTheHole] };
    return null;
}

const checkBlackAndRed = (hand: Hand): Synergy | null => {
    if (hand.cards.length === 2) {
        if (isRed(hand.cards[0].suit) !== isRed(hand.cards[1].suit)) return { id: SynergyId.BlackAndRed, ...SYNERGIES[SynergyId.BlackAndRed] };
    }
    return null;
}

const checkNumericalStraight = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 3) return null;
    const ranks = hand.cards.map(c => RANK_ORDER[c.rank]).sort((a, b) => a - b);
    if (ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2]) return { id: SynergyId.NumericalStraight, ...SYNERGIES[SynergyId.NumericalStraight] };
    if (ranks[0] === 2 && ranks[1] === 3 && ranks[2] === 14) return { id: SynergyId.NumericalStraight, ...SYNERGIES[SynergyId.NumericalStraight] };
    return null;
}

const checkKingsRansom = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 2) return null;
    const [card1, card2] = hand.cards;
    const ranks = [card1.rank, card2.rank];
    if (card1.suit === card2.suit && ranks.includes(Rank.King) && ranks.includes(Rank.Queen)) return { id: SynergyId.KingsRansom, ...SYNERGIES[SynergyId.KingsRansom] };
    return null;
}

const checkFullHouse = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 5) return null;
    const rankCounts: Record<string, number> = {};
    hand.cards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
    const counts = Object.values(rankCounts);
    if (counts.includes(3) && counts.includes(2)) {
        return { id: SynergyId.FullHouse, ...SYNERGIES[SynergyId.FullHouse] };
    }
    return null;
}

const checkFlush = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 5) return null;
    const suit = hand.cards[0].suit;
    if (hand.cards.every(c => c.suit === suit)) {
        return { id: SynergyId.Flush, ...SYNERGIES[SynergyId.Flush] };
    }
    return null;
}

const checkStraightFlush = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 3) return null;
    const suit = hand.cards[0].suit;
    if (!hand.cards.every(c => c.suit === suit)) return null;
    
    const ranks = hand.cards.map(c => RANK_ORDER[c.rank]).sort((a, b) => a - b);
    let consecutive = 1;
    for (let i = 0; i < ranks.length - 1; i++) {
        if (ranks[i] + 1 === ranks[i+1]) consecutive++;
    }
    
    if (consecutive === hand.cards.length) {
         return { id: SynergyId.StraightFlush, ...SYNERGIES[SynergyId.StraightFlush] };
    }
    return null;
}

const checkTwoPair = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 4) return null;
    const rankCounts: Record<string, number> = {};
    hand.cards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
    const pairCount = Object.values(rankCounts).filter(c => c >= 2).length;
    if (pairCount >= 2) return { id: SynergyId.TwoPair, ...SYNERGIES[SynergyId.TwoPair] };
    return null;
};

const checkThreeOfAKind = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 3) return null;
    const rankCounts: Record<string, number> = {};
    hand.cards.forEach(c => rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1);
    if (Object.values(rankCounts).some(c => c >= 3)) return { id: SynergyId.ThreeOfAKind, ...SYNERGIES[SynergyId.ThreeOfAKind] };
    return null;
};

const checkLowball = (hand: Hand): Synergy | null => {
    if (hand.cards.length >= 2 && hand.score <= 15 && hand.score > 0) {
        return { id: SynergyId.Lowball, ...SYNERGIES[SynergyId.Lowball] };
    }
    return null;
};

const checkEvenSplit = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 2) return null;
    const isAllEven = hand.cards.every(c => {
        const val = RANK_ORDER[c.rank];
        return val % 2 === 0;
    });
    if (isAllEven) return { id: SynergyId.EvenSplit, ...SYNERGIES[SynergyId.EvenSplit] };
    return null;
};

const checkOddSplit = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 2) return null;
    const isAllOdd = hand.cards.every(c => {
        const val = RANK_ORDER[c.rank];
        return val % 2 !== 0;
    });
    if (isAllOdd) return { id: SynergyId.OddSplit, ...SYNERGIES[SynergyId.OddSplit] };
    return null;
};

const checkPrimeTime = (hand: Hand): Synergy | null => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19];
    if (primes.includes(hand.score)) return { id: SynergyId.PrimeTime, ...SYNERGIES[SynergyId.PrimeTime] };
    return null;
};

const checkFaceOff = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 2) return null;
    const faceCards = [Rank.Jack, Rank.Queen, Rank.King];
    if (hand.cards.every(c => faceCards.includes(c.rank))) return { id: SynergyId.FaceOff, ...SYNERGIES[SynergyId.FaceOff] };
    return null;
};

const checkDivineNine = (hand: Hand): Synergy | null => {
    if (hand.score === 9) return { id: SynergyId.DivineNine, ...SYNERGIES[SynergyId.DivineNine] };
    return null;
};

const checkZenith = (hand: Hand): Synergy | null => {
    if (hand.score === 20) return { id: SynergyId.Zenith, ...SYNERGIES[SynergyId.Zenith] };
    return null;
};

const checkRainbow = (hand: Hand): Synergy | null => {
    if (hand.cards.length < 4) return null;
    const suits = new Set(hand.cards.map(c => c.suit));
    if (suits.size === 4) return { id: SynergyId.Rainbow, ...SYNERGIES[SynergyId.Rainbow] };
    return null;
};

const checkSnapshot = (hand: Hand): Synergy | null => {
    if (hand.cards.length !== 3) return null;
    const c1 = isRed(hand.cards[0].suit);
    const c2 = isRed(hand.cards[1].suit);
    const c3 = isRed(hand.cards[2].suit);
    // Red-Black-Red or Black-Red-Black
    if ((c1 && !c2 && c3) || (!c1 && c2 && !c3)) return { id: SynergyId.Snapshot, ...SYNERGIES[SynergyId.Snapshot] };
    return null;
};

const checkDoubleDownFrenzy = (hand: Hand): Synergy | null => {
    if (hand.isDoubled) return { id: SynergyId.DoubleDownFrenzy, ...SYNERGIES[SynergyId.DoubleDownFrenzy] };
    return null;
};

const checkGamblersEdge = (hand: Hand): Synergy | null => {
    if (hand.score === 19) return { id: SynergyId.GamblersEdge, ...SYNERGIES[SynergyId.GamblersEdge] };
    return null;
};

const checkSplitUniverse = (hand: Hand): Synergy | null => {
    if (hand.isSplitHand) return { id: SynergyId.SplitUniverse, ...SYNERGIES[SynergyId.SplitUniverse] };
    return null;
};


export const getActiveSynergies = (hand: Hand): Synergy[] => {
  const active: Synergy[] = [];
  
  const potentialSynergies = [
      checkSuitedConnectors,
      checkPairedAces,
      checkLuckySevens,
      checkRoyalCourt,
      checkBlackjackFlush,
      checkFiveCardCharlie,
      checkColorFlush,
      checkPerfectTwentyOne,
      checkAceInTheHole,
      checkBlackAndRed,
      checkNumericalStraight,
      checkKingsRansom,
      checkFullHouse,
      checkFlush,
      checkStraightFlush,
      checkTwoPair,
      checkThreeOfAKind,
      checkLowball,
      checkEvenSplit,
      checkOddSplit,
      checkPrimeTime,
      checkFaceOff,
      checkDivineNine,
      checkZenith,
      checkRainbow,
      checkSnapshot,
      checkDoubleDownFrenzy,
      checkSplitUniverse,
      checkGamblersEdge
  ];

  for (const check of potentialSynergies) {
      const synergy = check(hand);
      if (synergy) active.push(synergy);
  }

  return active;
};
