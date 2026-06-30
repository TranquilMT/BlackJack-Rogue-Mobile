import type { Relic } from '../types';
import { RelicId } from '../types';

export const RELICS: Record<RelicId, Relic> = {
    [RelicId.GoldenKnuckles]: {
        id: RelicId.GoldenKnuckles,
        name: 'Golden Knuckles',
        description: 'Your first winning hand each round deals double damage.',
    },
    [RelicId.GamblersChip]: {
        id: RelicId.GamblersChip,
        name: 'Gambler\'s Chip',
        description: 'When you Push (tie), gain 5 Shield.',
    },
    [RelicId.FirstAidKit]: {
        id: RelicId.FirstAidKit,
        name: 'First-Aid Kit',
        description: 'At the start of each round, heal 2 HP.',
    },
    [RelicId.SplittersCharm]: {
        id: RelicId.SplittersCharm,
        name: 'Splitter\'s Charm',
        description: 'Your first Split each round costs 0 HP.',
    },
    [RelicId.RubyLense]: {
        id: RelicId.RubyLense,
        name: 'Ruby Lense',
        description: 'You start each round with at least 1 Potion Charge.',
    },
    [RelicId.VampiricFangs]: {
        id: RelicId.VampiricFangs,
        name: 'Vampiric Fangs',
        description: 'Heal for 20% of the unblocked damage you deal.',
    },
    [RelicId.CursedCoin]: {
        id: RelicId.CursedCoin,
        name: 'Cursed Coin',
        description: 'Gain 2 extra Shards per win. Lose 2 HP per loss.',
    },
    [RelicId.Hourglass]: {
        id: RelicId.Hourglass,
        name: 'Hourglass',
        description: 'The first time you would be defeated each run, survive with 1 HP.',
    },
    [RelicId.SharpeningStone]: {
        id: RelicId.SharpeningStone,
        name: 'Sharpening Stone',
        description: 'Every time you win a hand, permanently gain +1 flat damage for the rest of the run.',
    },
    [RelicId.JadeFigurine]: {
        id: RelicId.JadeFigurine,
        name: 'Jade Figurine',
        description: 'You now deal 5 damage on a Push.',
    },
    [RelicId.ReflectiveShield]: {
        id: RelicId.ReflectiveShield,
        name: 'Reflective Shield',
        description: 'When you have Shield and take damage, reflect 50% of the damage taken back at the Dealer.',
    },
    [RelicId.CardCountersGuide]: {
        id: RelicId.CardCountersGuide,
        name: 'Card Counter\'s Guide',
        description: 'The Shoe now displays the number of Aces remaining in the deck.',
    },
    [RelicId.SoulShard]: {
        id: RelicId.SoulShard,
        name: 'Soul Shard',
        description: 'When you are dealt a Blackjack, gain 10 shield.',
    },
    [RelicId.DealersSleeve]: {
        id: RelicId.DealersSleeve,
        name: 'Dealer\'s Sleeve',
        description: 'When the dealer busts, you heal 5 HP.',
    },
    [RelicId.BlackCatCollar]: {
        id: RelicId.BlackCatCollar,
        name: 'Black Cat Collar',
        description: 'When you lose with a score of 13, deal 13 damage to the dealer.',
    },
    [RelicId.AlchemistsRing]: {
        id: RelicId.AlchemistsRing,
        name: 'Alchemist\'s Ring',
        description: 'Potions have a 25% chance to not be consumed.',
    },
    [RelicId.GildedDeck]: {
        id: RelicId.GildedDeck,
        name: 'Gilded Deck',
        description: 'Start each combat with +5 Shards.',
    },
    [RelicId.PhoenixFeather]: {
        id: RelicId.PhoenixFeather,
        name: 'Phoenix Feather',
        description: 'The first time you Bust in a combat, treat it as a Push instead.',
    },
    [RelicId.ObsidianDice]: {
        id: RelicId.ObsidianDice,
        name: 'Obsidian Dice',
        description: 'Critical Hits deal 3x damage instead of 2x.',
    },
    [RelicId.StoneSkin]: {
        id: RelicId.StoneSkin,
        name: 'Stone Skin',
        description: 'Retain up to 10 Shield at the end of each round.',
    },
    [RelicId.LuckyHorseshoe]: {
        id: RelicId.LuckyHorseshoe,
        name: 'Lucky Horseshoe',
        description: 'You are more likely to find higher rarity Relics in rewards.',
    },
    [RelicId.LoadedDice]: {
        id: RelicId.LoadedDice,
        name: 'Loaded Dice',
        description: 'Rerolling rewards (future feature) costs 0 shards.',
    },
    [RelicId.MerchantsMonocle]: {
        id: RelicId.MerchantsMonocle,
        name: 'Merchant\'s Monocle',
        description: 'Shop items cost 25% less.',
    },
    [RelicId.ScryingOrb]: {
        id: RelicId.ScryingOrb,
        name: 'Scrying Orb',
        description: 'Reveal the Dealer\'s face-down card once per combat.',
    },
    [RelicId.VikingHelmet]: {
        id: RelicId.VikingHelmet,
        name: 'Viking Helmet',
        description: 'Deal +1 damage for every 10 missing HP you have.',
    },
    [RelicId.GamblersFallacy]: {
        id: RelicId.GamblersFallacy,
        name: 'Gambler\'s Fallacy',
        description: 'If you Bust with exactly 5 cards, your hand score becomes 21.',
    },
    [RelicId.FOUR_LEAF_CLOVER]: {
        id: RelicId.FOUR_LEAF_CLOVER,
        name: 'Four-Leaf Clover',
        description: 'You are more likely to draw beneficial Modifier Cards.',
    },
    [RelicId.SHATTERED_SOUL]: {
        id: RelicId.SHATTERED_SOUL,
        name: 'Shattered Soul',
        description: 'Negative Modifier Card effects are doubled when drawn by the Dealer.',
    },
    [RelicId.SANDALS_OF_HERMES]: {
        id: RelicId.SANDALS_OF_HERMES,
        name: 'Sandals of Hermes',
        description: 'After you Stand on a hand, gain 3 Shield.',
    },
    [RelicId.MIDAS_TOUCH]: {
        id: RelicId.MIDAS_TOUCH,
        name: 'Midas Touch',
        description: 'Gain Shards equal to 10% of damage dealt.',
    },
    [RelicId.VOID_AMULET]: {
        id: RelicId.VOID_AMULET,
        name: 'Void Amulet',
        description: 'Take 50% less damage when you Bust.',
    },
    [RelicId.DARKSIGN]: {
        id: RelicId.DARKSIGN,
        name: 'The Darksign',
        description: 'Deal double damage permanently, but you cannot Heal.',
    },
    [RelicId.VOID_ESSENCE]: {
        id: RelicId.VOID_ESSENCE,
        name: 'Void Essence',
        description: 'Gain 1 Focus whenever you draw a Modifier Card.',
    },
    [RelicId.EVENT_HORIZON]: {
        id: RelicId.EVENT_HORIZON,
        name: 'Event Horizon',
        description: 'If you Bust, there is a 25% chance to restart the hand at the cost of 1 HP.',
    },
    // Forged Relics
    [RelicId.GoldenGauntlets]: {
        id: RelicId.GoldenGauntlets,
        name: 'Golden Gauntlets',
        description: 'Your first TWO winning hands each round deal double damage.',
        isForged: true,
    },
    [RelicId.VampiricCrown]: {
        id: RelicId.VampiricCrown,
        name: 'Vampiric Crown',
        description: 'Heal for 35% of the unblocked damage you deal.',
        isForged: true,
    },
    [RelicId.SovereignsChip]: {
        id: RelicId.SovereignsChip,
        name: 'Sovereign\'s Chip',
        description: 'When you Push (tie), gain 10 Shield and deal 10 damage.',
        isForged: true,
    },
    [RelicId.VoidShard]: {
        id: RelicId.VoidShard,
        name: 'Void Shard',
        description: 'Gain 1 Focus every time you play a Void card.',
    },
    [RelicId.AbyssalEye]: {
        id: RelicId.AbyssalEye,
        name: 'Abyssal Eye',
        description: 'See the Dealer\'s next card if your hand total is 10 or less.',
    },
    [RelicId.MIRROR_SHARD]: {
        id: RelicId.MIRROR_SHARD,
        name: 'Mirror Shard',
        description: 'When you get a Blackjack, gain 10 Shield.',
    },
};