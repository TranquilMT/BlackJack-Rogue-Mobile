

export interface LeaderboardEntry {
    id: string;
    name: string;
    score: number;
    rank: number;
    floor?: number;
    date?: string;
}

export enum Suit {
  Spades = '♠',
  Clubs = '♣',
  Diamonds = '♦',
  Hearts = '♥',
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export enum CardModifierId {
    THE_REAPER = 'THE_REAPER',
    THE_GUARDIAN = 'THE_GUARDIAN',
    THE_JESTER = 'THE_JESTER',
    THE_ABYSS = 'THE_ABYSS',
    THE_BERSERKER = 'THE_BERSERKER',
    THE_ALCHEMIST = 'THE_ALCHEMIST',
    THE_ORACLE = 'THE_ORACLE',
    THE_VAMPIRE = 'THE_VAMPIRE',
    THE_VOIDWALKER = 'THE_VOIDWALKER',
    THE_TIMEWARP = 'THE_TIMEWARP',
    THE_MAGNET = 'THE_MAGNET',
    THE_SUN = 'THE_SUN',
    THE_JUDGEMENT = 'THE_JUDGEMENT',
    THE_TOWER = 'THE_TOWER',
    THE_STAR = 'THE_STAR',
    THE_MOON = 'THE_MOON',
    THE_EMPEROR = 'THE_EMPEROR',
    THE_EMPRESS = 'THE_EMPRESS',
}

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  tell?: 'low' | 'high' | null;
  modifier?: CardModifierId;
  isCloned?: boolean;
}

export enum HandStatus {
  Hitting = 'hitting',
  Standing = 'standing',
  Busted = 'busted',
  Blackjack = 'blackjack',
  Win = 'win',
  Lose = 'lose',
  Push = 'push',
  SuperWin = 'superWin',
}

export enum SynergyId {
  SuitedConnectors = 'SUITED_CONNECTORS',
  PairedAces = 'PAIRED_ACES',
  LuckySevens = 'LUCKY_SEVENS',
  RoyalCourt = 'ROYAL_COURT',
  BlackjackFlush = 'BLACKJACK_FLUSH',
  FiveCardCharlie = 'FIVE_CARD_CHARLIE',
  ColorFlush = 'COLOR_FLUSH',
  PerfectTwentyOne = 'PERFECT_21',
  AceInTheHole = 'ACE_IN_THE_HOLE',
  BlackAndRed = 'BLACK_AND_RED',
  NumericalStraight = 'NUMERICAL_STRAIGHT',
  KingsRansom = 'KINGS_RANSOM',
  FullHouse = 'FULL_HOUSE',
  Flush = 'FLUSH',
  StraightFlush = 'STRAIGHT_FLUSH',
  TwoPair = 'TWO_PAIR',
  ThreeOfAKind = 'THREE_OF_A_KIND',
  Lowball = 'LOWBALL',
  EvenSplit = 'EVEN_SPLIT',
  OddSplit = 'ODD_SPLIT',
  PrimeTime = 'PRIME_TIME',
  FaceOff = 'FACE_OFF',
  DivineNine = 'DIVINE_NINE',
  Zenith = 'ZENITH',
  Rainbow = 'RAINBOW',
  Snapshot = 'SNAPSHOT',
  DoubleDownFrenzy = 'DOUBLE_DOWN_FRENZY',
  SplitUniverse = 'SPLIT_UNIVERSE',
  GamblersEdge = 'GAMBLERS_EDGE',
}

export interface Synergy {
  id: SynergyId;
  name: string;
  description: string;
}

export interface Hand {
  id: number;
  cards: Card[];
  score: number;
  status: HandStatus;
  damageMultiplier: number;
  activeSynergies: Synergy[];
  flatDamageBonus: number;
  isFirstWin?: boolean;
  isDoubled?: boolean;
  isSplitHand?: boolean;
  isRevealed?: boolean;
}

export type GamePhase = 'preGame' | 'roundStart' | 'playerTurn' | 'dealerTurn' | 'gameOver' | 'defeat' | 'victory' | 'reward' | 'curseSelection' | 'runSummary' | 'shop' | 'tutorial' | 'boonSelection' | 'spinWheel' | 'plinko' | 'levelUp' | 'highLow' | 'diceRoll' | 'shellGame' | 'relicForge' | 'strangerEncounter' | 'bonfire' | 'cutscene' | 'seasonalEvent';

export type BlockedAction = 'double' | 'split' | null;

export enum RelicId {
    GoldenKnuckles = 'GOLDEN_KNUCKLES',
    GamblersChip = 'GAMBLERS_CHIP',
    FirstAidKit = 'FIRST_AID_KIT',
    SplittersCharm = 'SPLITTERS_CHARM',
    RubyLense = 'RUBY_LENSE',
    Hourglass = 'HOURGLASS',
    SharpeningStone = 'SHARPENING_STONE',
    JadeFigurine = 'JADE_FIGURINE',
    ReflectiveShield = 'REFLECTIVE_SHIELD',
    CardCountersGuide = 'CARD_COUNTERS_GUIDE',
    CursedCoin = 'CURSED_COIN',
    VampiricFangs = 'VAMPIRIC_FANGS',
    SoulShard = 'SOUL_SHARD',
    DealersSleeve = 'DEALERS_SLEEVE',
    BlackCatCollar = 'BLACK_CAT_COLLAR',
    AlchemistsRing = 'ALCHEMISTS_RING',
    GildedDeck = 'GILDED_DECK',
    PhoenixFeather = 'PHOENIX_FEATHER',
    ObsidianDice = 'OBSIDIAN_DICE',
    StoneSkin = 'STONE_SKIN',
    LuckyHorseshoe = 'LUCKY_HORSESHOE',
    LoadedDice = 'LOADED_ICE',
    MerchantsMonocle = 'MERCHANTS_MONOCLE',
    ScryingOrb = 'SCRYING_ORB',
    VikingHelmet = 'VIKING_HELMET',
    GamblersFallacy = 'GAMBLERS_FALLACY',
    FOUR_LEAF_CLOVER = 'FOUR_LEAF_CLOVER',
    SHATTERED_SOUL = 'SHATTERED_SOUL',
    SANDALS_OF_HERMES = 'SANDALS_OF_HERMES',
    MIDAS_TOUCH = 'MIDAS_TOUCH',
    VOID_AMULET = 'VOID_AMULET',
    DARKSIGN = 'DARKSIGN',
    VOID_ESSENCE = 'VOID_ESSENCE',
    EVENT_HORIZON = 'EVENT_HORIZON',
    MIRROR_SHARD = 'MIRROR_SHARD',
    // Forged Relics
    GoldenGauntlets = 'GOLDEN_GAUNTLETS',
    VampiricCrown = 'VAMPIRIC_CROWN',
    SovereignsChip = 'SOVEREIGNS_CHIP',
    VoidShard = 'VOID_SHARD',
    AbyssalEye = 'ABYSSAL_EYE',
}

export interface Relic {
    id: RelicId;
    name: string;
    description: string;
    isUnlocked?: boolean;
    isUpgraded?: boolean;
    isForged?: boolean;
}

export interface Rune {
    id: string;
    name: string;
    description: string;
    effect: (state: GameState) => GameState;
    isUnlocked: boolean;
    cost: number;
}

export enum PotionId {
    HealingPotion = 'HEALING_POTION',
    ShieldPotion = 'SHIELD_POTION',
    CardPeeker = 'CARD_PEEKER',
    RagePotion = 'RAGE_POTION',
    PurificationPotion = 'PURIFICATION_POTION',
    DeckStackerPotion = 'DECK_STACKER_POTION',
    VoidPotion = 'VOID_POTION',
}

export interface Potion {
    id: PotionId;
    name: string;
    description: string;
}

export enum BossIntentId {
    AttackUp = 'ATTACK_UP',
    ShieldUp = 'SHIELD_UP',
    CursedShuffle = 'CURSED_SHUFFLE',
    Haymaker = 'HAYMAKER',
    Stunned = 'STUNNED',
    None = 'NONE',
}

export interface BossIntent {
    id: BossIntentId;
    name: string;
    description: string;
}

export enum FloorModifierId {
    ArcaneAnomaly = 'ARCANE_ANOMALY',
    HeavyAir = 'HEAVY_AIR',
    CardSurge = 'CARD_SURGE',
    GoldenFloor = 'GOLDEN_FLOOR',
    VampiricTouch = 'VAMPIRIC_TOUCH',
    DoubleDownFrenzy = 'DOUBLE_DOWN_FRENZY',
    SplitUniverse = 'SPLIT_UNIVERSE',
    AceAbundance = 'ACE_ABUNDANCE',
    EliteEncounter = 'ELITE_ENCOUNTER',
    TheFog = 'THE_FOG',
    VoidEvent = 'VOID_EVENT',
    None = 'NONE'
}

export interface FloorModifier {
    id: FloorModifierId;
    name: string;
    description: string;
}

export enum CurseId {
    BrittleBones = 'BRITTLE_BONES',
    Butterfingers = 'BUTTERFINGERS',
    ClumsyHands = 'CLUMSY_HANDS',
    DullBlade = 'DULL_BLADE',
    Paranoia = 'PARANOIA',
    HeavyPockets = 'HEAVY_POCKETS',
    WeakKnees = 'WEAK_KNEES',
}

export interface Curse {
    id: CurseId;
    name: string;
    description: string;
    duration?: number;
}

export interface RunStats {
    floor: number;
    totalDamageDealt: number;
    synergiesActivated: Record<string, number>;
    relicsCollected: string[];
    shardsEarned: number;
    relicCurrencyEarned: number;
    handsPlayed: number;
    runEndedAt: string;
    victory: boolean;
}

export type ShopItemType = 'heal' | 'potion_charge' | 'remove_curse' | 'relic' | 'upgrade_relic';
export interface ShopItem {
    id: string;
    type: ShopItemType;
    name: string;
    description: string;
    cost: number;
    payload?: any;
}

export enum AchievementId {
    FIRST_VICTORY = 'FIRST_VICTORY',
    HIGH_ROLLER = 'HIGH_ROLLER',
    SURVIVOR = 'SURVIVOR',
    LUCKY_SEVENS = 'LUCKY_SEVENS',
    FIVE_CARD_CHARLIE = 'FIVE_CARD_CHARLIE',
    UNTOUCHABLE = 'UNTOUCHABLE',
    COLLECTOR = 'COLLECTOR',
    CURSED_ONE = 'CURSED_ONE',
    PERFECTIONIST = 'PERFECTIONIST',
    SAVED_BY_THE_BELL = 'SAVED_BY_THE_BELL',
    ROGUE = 'ROGUE',
    MASTER_OF_SYNERGY = 'MASTER_OF_SYNERGY',
    FLOOR_FIVE = 'FLOOR_FIVE',
    FLOOR_TEN = 'FLOOR_TEN',
    TRUE_GAMBLER = 'TRUE_GAMBLER'
}

export interface Achievement {
    id: AchievementId;
    name: string;
    description: string;
    isUnlocked?: boolean;
}

export interface Quest {
    id: string;
    description: string;
    target: number;
    progress: number;
    reward: { type: 'shards' | 'customization' | 'relics', value: string | number, id?: string };
    isCompleted: boolean;
    isClaimed: boolean;
}

export enum BoonId {
    MAX_HP_UP_SMALL = 'MAX_HP_UP_SMALL',
    FLAT_DAMAGE_UP_SMALL = 'FLAT_DAMAGE_UP_SMALL',
    STARTING_SHIELD_SMALL = 'STARTING_SHIELD_SMALL',
    HEAL_SMALL = 'HEAL_SMALL',
    SHARD_GAIN_UP = 'SHARD_GAIN_UP',
    POTION_CHARGE_UP = 'POTION_CHARGE_UP',
    SURVIVAL_BONUS = 'SURVIVAL_BONUS',
}

export interface Boon {
    id: BoonId;
    name: string;
    description: string;
}

export enum LevelUpChoiceId {
    MAX_HP_UP = 'MAX_HP_UP',
    PERMANENT_DAMAGE_UP = 'PERMANENT_DAMAGE_UP',
    POTION_CAPACITY_UP = 'POTION_CAPACITY_UP',
    CRITICAL_HIT_CHANCE = 'CRITICAL_HIT_CHANCE',
    SHIELD_ON_STAND = 'SHIELD_ON_STAND',
    FOCUS_GENERATION_UP = 'FOCUS_GENERATION_UP',
}

export interface LevelUpChoice {
    id: LevelUpChoiceId;
    name: string;
    description: string;
}

export interface LootReward {
    potionCharges?: number;
    shards?: number;
    relicCurrency?: number;
    triggerWheel?: boolean;
}

export enum WheelOutcome {
    INSTANT_BOON = 'INSTANT_BOON',
    SHARD_WINDFALL = 'SHARD_WINDFALL',
    JACKPOT = 'JACKPOT',
    PLAY_PLINKO = 'PLAY_PLINKO',
    PLAY_HIGHLOW = 'PLAY_HIGHLOW',
    PLAY_DICEROLL = 'PLAY_DICEROLL',
    PLAY_SHELLGAME = 'PLAY_SHELLGAME',
    DAMAGE_BUFF = 'DAMAGE_BUFF',
    PERMANENT_BUFF = 'PERMANENT_BUFF',
    SMALL_SHARDS = 'SMALL_SHARDS',
    BLACKJACK_WHEEL = 'blackjack_wheel'
}

export type BossPassive = 'thorns' | 'resilient' | 'void_aura' | null;

export type SoundId =
  | 'card-deal'
  | 'card-hit'
  | 'player-stand'
  | 'player-damage'
  | 'boss-damage'
  | 'player-heal'
  | 'win-hand'
  | 'lose-hand'
  | 'synergy'
  | 'rumble'
  | 'button-click'
  | 'level-up'
  | 'relic-acquire'
  | 'victory-fanfare'
  | 'defeat-sting'
  | 'wheel-tick'
  | 'wheel-win'
  | 'wheel-spin'
  | 'double-down'
  | 'split'
  | 'potion-use'
  | 'shield-gain'
  | 'shield-break'
  | 'curse-acquire'
  | 'boon-acquire'
  | 'achievement-unlock'
  | 'focus-full'
  | 'chest-open'
  | 'reward-reveal'
  | 'coin-pickup'
  | 'bonfire-lit'
  | 'burn-token';

export interface Pact {
    id: string;
    name: string;
    description: string;
    icon: 'skull' | 'coin' | 'heart' | 'star';
    effect: (state: GameState) => GameState;
}
  
export type GameMode = 'campaign' | 'endless';

export enum WeatherType {
    Clear = 'CLEAR',
    Foggy = 'FOGGY',
    Stormy = 'STORMY',
    Golden = 'GOLDEN',
}

export enum DealerArchetype {
    Cautious = 'CAUTIOUS',
    Aggressive = 'AGGRESSIVE',
    Balanced = 'BALANCED',
}

export enum BossPhase {
    Phase1 = 'PHASE_1',
    Phase2 = 'PHASE_2',
    Phase3 = 'PHASE_3',
}

export enum TableLighting {
    Normal = 'NORMAL',
    Tension = 'TENSION',
    HighStakes = 'HIGH_STAKES',
}

export type VisualEffectType = 'blood' | 'glow' | 'glitch' | 'explosion' | 'magic';

export interface GameState {
  mode: GameMode;
  currentStage: number; // 1, 2, 3 (Boss)
  deck: Card[];
  discardPile: Card[];
  playerHands: Hand[];
  dealerHand: Hand;
  dealerArchetype: DealerArchetype;
  bossPhase: BossPhase;
  tableLighting: TableLighting;
  gamePhase: GamePhase;
  playerHP: number;
  playerMaxHP: number;
  bossHP: number;
  bossMaxHP: number;
  activeHandIndex: number;
  message: string;
  bossShield: number;
  isDesperationActive: boolean;
  blockedAction: BlockedAction;
  relics: Relic[];
  potions: Potion[];
  potionCharges: number;
  playerShield: number;
  runCurrency: number; 
  runRelicCurrency: number; 
  currentFloor: number;
  unlockedRelicIds: RelicId[];
  unlockedModifierCardIds: CardModifierId[];
  unlockedSkills: string[];
  rewardChoices: Relic[];
  bossIntent: BossIntent;
  floorModifier: FloorModifier;
  curses: Curse[];
  curseChoices: Curse[];
  runStats: RunStats;
  permanentFlatDamageBonus: number;
  isRageActive: boolean;
  shopItems: ShopItem[];
  discardCount: number;
  achievementQueue: AchievementId[];
  focus: number;
  maxFocus: number;
  isDealerIntimidated: boolean;
  isBossStunned: boolean;
  tutorialStep: number;
  showLootChest: boolean;
  lootRewards: LootReward | null;
  boonChoices: Boon[];
  activeBoons: Boon[];
  boonFlatDamageBonus: number;
  shardBooster: { multiplier: number; roundsLeft: number } | null;
  playerLevel: number;
  playerXP: number;
  xpToNextLevel: number;
  levelUpChoices: LevelUpChoice[];
  maxPotionCharges: number;
  critChance: number;
  permanentCritChance: number;
  shieldOnStand: number;
  focusGainBonus: number;
  tempDamageMultiplier: { value: number; roundsLeft: number } | null; 
  returnPhase?: GamePhase;
  roundsSurvived: number;
  survivalDamageMultiplier: number;
  bossPassive: BossPassive;
  winStreak: number;
  strangerChoices: Pact[];
  hollowingStacks: number;
  isEnraged: boolean;
  currentCutscene: Cutscene | null;
  weather: WeatherType;
  comboMultiplier: number;
  pendingVisualEffect?: VisualEffectType;
  phoenixFeatherUsed?: boolean;
}

export enum GraphicsQuality {
    Minimal = 'MINIMAL',
    Low = 'LOW',
    Medium = 'MEDIUM',
    High = 'HIGH',
    Ultra = 'ULTRA',
}

export interface Customization {
    cardBack: string;
    tableFelt: string;
    volume?: number;
    graphicsQuality?: GraphicsQuality;
    shoeDesign?: string;
    deckDesign?: string;
    deviceMode?: 'mobile' | 'desktop';
}

export interface UnlockedCustomizations {
    cardBacks: string[];
    tableFelts: string[];
    shoeDesigns?: string[];
    deckDesigns?: string[];
}

export interface MetaState {
    unlockedRelicIds: RelicId[];
    unlockedRuneIds: string[];
    unlockedModifierCardIds: CardModifierId[];
    unlockedSkills: string[];
    skillPoints: number;
    totalCurrency: number; 
    relicCurrency: number; 
    runHistory: RunStats[];
    unlockedAchievementIds: AchievementId[];
    hasCompletedTutorial: boolean;
    customization: Customization;
    unlockedCustomizations: UnlockedCustomizations;
    playerName?: string;
    lastLoginDate?: string;
    achievementQueue?: AchievementId[];
    referralCount: number;
    lastDailySpinDate?: string;
    lootboxLevel?: number;
    activeQuests: Quest[];
    
    // Seasonal & Economy
    seasonStats: {
        totalBurned: number;
    };
    currentSeason: SeasonInfo;
}

export interface SeasonInfo {
    id: number;
    name: string;
    endsAt: string;
    totalBurnedGlobal: number;
}

export interface CutsceneFrame {
    text: string;
    speaker: string;
    image?: string; // URL or class name for background
}

export interface Cutscene {
    id: string;
    frames: CutsceneFrame[];
    nextPhase: GamePhase;
}
