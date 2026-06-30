
import React, { useReducer, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import MultiplayerScreen from './components/MultiplayerScreen';
import { Zap, Globe, Activity, Layers } from 'lucide-react';
import { useScreenShake } from './src/hooks/useScreenShake';
import { gameReducer, createInitialState, updateTableLighting, getUniqueId } from './game/state';
import BlackjackTable from './components/BlackjackTable';
import PlayerActions from './components/PlayerActions';
import MessageToaster from './components/MessageToaster';
import PlayerStatus from './components/PlayerStatus';
import BossStatus from './components/BossStatus';
import { canDouble, canSplit, SPLIT_COST } from './game/logic';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';
import MainMenu from './components/MainMenu';
import RelicDisplay from './components/RelicDisplay';
import PotionBelt from './components/PotionBelt';
import RewardScreen from './components/RewardScreen';
import CurseSelectionScreen from './components/CurseSelectionScreen';
import Tutorial from './components/Tutorial';
import AchievementToast from './components/AchievementToast';
import { ACHIEVEMENTS } from './game/achievements';
import type { RelicId, Hand, LootReward, LeaderboardEntry, SoundId, Pact, GameMode } from './types';
import { TableLighting, RelicId as RelicIdEnum, WheelOutcome, BoonId, LevelUpChoiceId } from './types';
import BoonSelectionScreen from './components/BoonSelectionScreen';
import SpinWheelScreen from './components/SpinWheelScreen';
import BoonDisplay from './components/BoonDisplay';
import CombatText from './components/CombatText';
import LevelUpScreen from './components/LevelUpScreen';
import { audioManager } from './services/audioManager';
import Intro from './components/Intro';
import { useStore } from './store/useStore';
import PlayerNameInputScreen from './components/PlayerNameInputScreen';
import DailyRewardScreen from './components/DailyRewardScreen';
import PlinkoScreen from './components/PlinkoScreen';
import { HighLowGame, DiceRollGame, ShellGame } from './components/MiniGames';
import VisualFXLayer, { SlashParams, SplatterParams, ShockwaveParams } from './components/VisualFXLayer';
import LootChest from './components/LootChest';
import ParticleSystem, { ParticleSystemHandle } from './components/ParticleSystem';
import PatchNotes from './components/PatchNotes';
import QuestPopup from './components/QuestPopup';
import PatchNotesScreen from './components/PatchNotesScreen';
import MajorUpdatesScreen from './components/MajorUpdatesScreen';
import StreakMeter from './components/StreakMeter';
import StrangerEncounterScreen from './components/StrangerEncounterScreen';
import SeasonalEventScreen from './components/SeasonalEventScreen';
import BonfireScreen from './components/BonfireScreen';
import Cutscene from './components/Cutscene';
import { LightingOverlay } from './components/LightingOverlay';
import { Toaster, toast } from 'sonner';
import DeckManager from './components/DeckManager';
import { getSteamService } from './src/services/SteamService';
import SkillTree from './components/SkillTree';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function normalizeSavedGameState(savedState: any) {
  if (Array.isArray(savedState?.dealerHand)) {
    savedState.dealerHand = {
      id: 0,
      cards: savedState.dealerHand,
      score: savedState.dealerHand.score ?? 0,
      status: savedState.dealerHand.status ?? 'standing',
      damageMultiplier: savedState.dealerHand.damageMultiplier ?? 1,
      activeSynergies: savedState.dealerHand.activeSynergies ?? [],
      flatDamageBonus: savedState.dealerHand.flatDamageBonus ?? 0,
      isRevealed: savedState.dealerHand.isRevealed ?? false,
    };
  }
  return savedState;
}

type CombatTextInfo = { id: number; value: number | string; type: 'player-damage' | 'boss-damage' | 'player-heal' | 'boss-heal' | 'shield' | 'xp-gain'; };

export default function App() {
  // Use granular selectors to avoid infinite loops and unnecessary re-renders
  const customization = useStore(state => state.customization);
  const totalCurrency = useStore(state => state.totalCurrency);
  const relicCurrency = useStore(state => state.relicCurrency);
  const runHistory = useStore(state => state.runHistory);
  const unlockedAchievementIds = useStore(state => state.unlockedAchievementIds);
  const setPlayerName = useStore(state => state.setPlayerName);
  const addCurrency = useStore(state => state.addCurrency);
  const addRelicCurrency = useStore(state => state.addRelicCurrency);
  const lastLoginDate = useStore(state => state.lastLoginDate);
  const setLastLoginDate = useStore(state => state.setLastLoginDate);
  const playerName = useStore(state => state.playerName);
  const hasCompletedTutorial = useStore(state => state.hasCompletedTutorial);
  const setHasCompletedTutorial = useStore(state => state.setHasCompletedTutorial);
  const unlockedRelicIds = useStore(state => state.unlockedRelicIds);
  const unlockedCustomizations = useStore(state => state.unlockedCustomizations);
  const unlockedSkills = useStore(state => state.unlockedSkills || []);
  const skillPoints = useStore(state => state.skillPoints || 0);
  const unlockSkill = useStore(state => state.unlockSkill);
  const updateCustomization = useStore(state => state.updateCustomization);
  const _setMetaState = useStore(state => state._setState);

  const [appPhase, setAppPhase] = useState<'tranquilIntro' | 'patchNotes' | 'majorUpdates' | 'mainMenu' | 'inGame' | 'multiplayer'>('tranquilIntro');
  const [showPlayerNameInput, setShowPlayerNameInput] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showPatchNotes, setShowPatchNotes] = useState(false);
  const [showQuests, setShowQuests] = useState(true);
  const [showDeckManager, setShowDeckManager] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket'],
      autoConnect: false
    });
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, []);

  const handleEnterMultiplayer = () => {
    socket?.connect();
    setAppPhase('multiplayer');
  };
  
  const particleSystemRef = useRef<ParticleSystemHandle>(null);
  const hasHandledRunEndRef = useRef<boolean>(false);
  
  const [slashes, setSlashes] = useState<SlashParams[]>([]);
  const [splatters, setSplatters] = useState<SplatterParams[]>([]);
  const [shockwaves, setShockwaves] = useState<ShockwaveParams[]>([]);
  const [screenFlash, setScreenFlash] = useState(0);
  const [fps, setFps] = useState(60);
  const [showDebug, setShowDebug] = useState(false);
    const { shake, triggerShake } = useScreenShake();

    // FPS Counter
    useEffect(() => {
        let frameCount = 0;
        let lastTime = performance.now();
        const updateFps = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateFps);
        };
        const handle = requestAnimationFrame(updateFps);
        return () => cancelAnimationFrame(handle);
    }, []);

    const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const saved = localStorage.getItem('blackjackRogueSave');
    if (saved) {
      try { return normalizeSavedGameState(JSON.parse(saved)); } catch (e) { console.error("Failed to parse save:", e); }
    }
    return createInitialState({ customization, totalCurrency, relicCurrency, runHistory, unlockedAchievementIds, hasCompletedTutorial, unlockedRelicIds, unlockedSkills } as any);
  });

  useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      if (state.gamePhase === 'dealerTurn') {
          timeoutId = setTimeout(() => {
              dispatch({ type: 'DEALER_TURN_ACTION' });
          }, 600); // Faster dealer turn
      } 
      return () => clearTimeout(timeoutId);
  }, [state.gamePhase, state.dealerHand.score, state.dealerHand.cards.length]);

  const lastPhaseRef = useRef(state.gamePhase);

  useEffect(() => {
      if (state.gamePhase === 'gameOver' && lastPhaseRef.current !== 'gameOver') {
          const prevPhase = lastPhaseRef.current;
          const allBusted = state.playerHands.every(h => h.status === 'busted');
          if (prevPhase === 'dealerTurn' || (prevPhase === 'playerTurn' && allBusted)) {
              dispatch({ type: 'RESOLVE_HAND' });
          }
      }
      lastPhaseRef.current = state.gamePhase;
  }, [state.gamePhase, state.playerHands]);

  const [shownAchievements, setShownAchievements] = useState<string[]>([]);
  const [combatTextQueue, setCombatTextQueue] = useState<CombatTextInfo[]>([]);
  
  const prevPlayerHP = useRef(state.playerHP);
  const prevBossHP = useRef(state.bossHP);
  const prevPlayerShield = useRef(state.playerShield);
  const prevFocus = useRef(state.focus);
  const prevPlayerXP = usePrevious(state.playerXP);
  const prevPlayerHands = usePrevious<Hand[]>(state.playerHands);
  const prevGamePhase = usePrevious(state.gamePhase);
  const prevRunCurrency = usePrevious(state.runCurrency);
  const prevWinStreak = usePrevious(state.winStreak);

  const gameContainerControls = useAnimation();
  
  const spawnParticles = (count: number, type: 'coin' | 'blood' | 'sparkle', x: number, y: number) => {
      particleSystemRef.current?.spawn(x, y, type, count);
  }
  
  const spawnSlash = (x: number, y: number) => {
      const angle = Math.random() * 360;
      setSlashes(prev => [...prev, { id: getUniqueId(), x, y, angle }]);
  };

  const spawnSplatter = (x: number, y: number) => {
      setSplatters(prev => [...prev, { 
          id: getUniqueId(), 
          x, 
          y, 
          scale: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? '#7f1d1d' : '#991b1b' 
      }]);
      if (splatters.length > 5) setSplatters(prev => prev.slice(1));
  };

  const spawnShockwave = (x: number, y: number) => {
      setShockwaves(prev => [...prev, { id: getUniqueId(), x, y }]);
  };

  useEffect(() => {
    const initialVolume = customization.volume ?? 0.5;
    audioManager.setVolume(initialVolume);
    audioManager.resume();

    const today = new Date().toISOString().split('T')[0];
    if (lastLoginDate !== today) {
      setShowDailyReward(true);
      setLastLoginDate(today);
    }
    getSteamService().getLeaderboard().then(lb => console.log("Steam Leaderboard:", lb));
  }, []);

  // Player HP Effects
  useEffect(() => {
    const hpDiff = state.playerHP - prevPlayerHP.current;
    if (hpDiff !== 0) {
        if (hpDiff < 0) {
            setCombatTextQueue(q => [...q, { id: getUniqueId(), value: hpDiff, type: 'player-damage' }]);
            triggerShake(15, 300);
            spawnParticles(80, 'blood', window.innerWidth * 0.25, window.innerHeight * 0.5);
            audioManager.playSound('player-damage');
            audioManager.playSound('rumble');
            setScreenFlash(0.8);
            setTimeout(() => setScreenFlash(0), 100);
        } else if (hpDiff > 0) {
            setCombatTextQueue(q => [...q, { id: getUniqueId(), value: `+${hpDiff}`, type: 'player-heal' }]);
            spawnParticles(15, 'sparkle', window.innerWidth * 0.25, window.innerHeight * 0.5);
            audioManager.playSound('player-heal');
        }
        prevPlayerHP.current = state.playerHP;
    }
  }, [state.playerHP, gameContainerControls]);

  // Boss HP Effects
  useEffect(() => {
    const bossHpDiff = state.bossHP - prevBossHP.current;
    if (bossHpDiff !== 0) {
        if (bossHpDiff < 0) {
            setCombatTextQueue(q => [...q, { id: getUniqueId(), value: bossHpDiff, type: 'boss-damage' }]);
            audioManager.playSound('boss-damage');
            const bossX = window.innerWidth * 0.75;
            const bossY = window.innerHeight * 0.25;
            spawnSlash(bossX, bossY);
            spawnParticles(100, 'blood', bossX, bossY);
            spawnSplatter(bossX + (Math.random() * 100 - 50), bossY + (Math.random() * 100 - 50));
            
            triggerShake(25, 400);
            setScreenFlash(0.5);
            setTimeout(() => setScreenFlash(0), 80);

            if (bossHpDiff < -20) {
                spawnShockwave(bossX, bossY);
                setScreenFlash(0.9);
                setTimeout(() => setScreenFlash(0), 150);
                spawnParticles(200, 'blood', bossX, bossY);
            }
        }
        prevBossHP.current = state.bossHP;
    }
  }, [state.bossHP, gameContainerControls]);

  // Other Combat Effects (Shield, Focus, Currency)
  useEffect(() => {
    const shieldDiff = state.playerShield - prevPlayerShield.current;
    if (shieldDiff !== 0) {
        if (shieldDiff > 0) {
            setCombatTextQueue(q => [...q, { id: getUniqueId(), value: `+${shieldDiff}`, type: 'shield' }]);
            audioManager.playSound('shield-gain');
        } else if (shieldDiff < 0 && state.playerShield === 0) {
            audioManager.playSound('shield-break');
        }
        prevPlayerShield.current = state.playerShield;
    }
    
    if (prevFocus.current < state.maxFocus && state.focus >= state.maxFocus) {
        audioManager.playSound('focus-full');
    }
    prevFocus.current = state.focus;

    if (state.runCurrency > (prevRunCurrency ?? 0)) {
        spawnParticles(8, 'coin', window.innerWidth * 0.5, window.innerHeight * 0.5);
        audioManager.playSound('coin-pickup');
    }
  }, [state.playerShield, state.focus, state.maxFocus, state.runCurrency]);


  useEffect(() => {
      if (prevGamePhase !== state.gamePhase) {
          if (state.gamePhase === 'playerTurn') audioManager.playSound('card-deal');
          if (state.gamePhase === 'levelUp') { audioManager.playSound('level-up'); }
          if (state.gamePhase === 'victory') { audioManager.playSound('victory-fanfare'); }
          if (state.gamePhase === 'defeat') { audioManager.playSound('defeat-sting'); }
      }

      if (prevPlayerHands && state.playerHands.length === prevPlayerHands.length) {
          state.playerHands.forEach((hand, index) => {
              const prevHand = prevPlayerHands[index];
              if (prevHand && prevHand.status !== hand.status) {
                  if (['win', 'blackjack', 'superWin'].includes(hand.status)) {
                      audioManager.playSound('win-hand');
                  }
                  else if (['lose', 'busted'].includes(hand.status)) {
                      audioManager.playSound('lose-hand');
                  }
              }
          });
      }
  }, [state.gamePhase, state.playerHands]);
  
  useEffect(() => {
    if (state.pendingVisualEffect) {
      const bossX = window.innerWidth * 0.75;
      const bossY = window.innerHeight * 0.25;
      // Trigger effect based on type
      switch (state.pendingVisualEffect) {
        case 'blood':
          spawnSplatter(bossX, bossY);
          break;
        case 'glow':
          // Simple glow effect: flash screen
          setScreenFlash(0.5);
          setTimeout(() => setScreenFlash(0), 200);
          break;
        case 'glitch':
          // Simple glitch effect: shake
          gameContainerControls.start({ 
              x: [0, -20, 20, -10, 10, 0], 
              transition: { duration: 0.2 } 
          });
          break;
        case 'explosion':
          spawnShockwave(bossX, bossY);
          break;
        case 'magic':
          spawnParticles(30, 'sparkle', bossX, bossY);
          break;
      }
      // Clear the effect from state
      dispatch({ type: 'CLEAR_PENDING_VISUAL_EFFECT' });
    }
  }, [state.pendingVisualEffect, gameContainerControls]);
  
  const { 
    playerHands, dealerHand, activeHandIndex, gamePhase, 
    playerHP, playerMaxHP, bossHP, bossMaxHP, deck, discardPile,
    bossShield, isDesperationActive, blockedAction,
    relics, potions, potionCharges, playerShield, runCurrency, currentFloor,
    rewardChoices, curseChoices, bossIntent, floorModifier, runStats,
    focus, maxFocus, isDealerIntimidated, showLootChest, lootRewards,
    boonChoices, activeBoons, playerLevel, playerXP, xpToNextLevel, levelUpChoices, tempDamageMultiplier,
    isBossStunned, bossPassive, winStreak, strangerChoices, hollowingStacks, isEnraged
  } = state;

  useEffect(() => {
    const isInRun = appPhase === 'inGame' && !['preGame', 'defeat', 'victory', 'tutorial'].includes(gamePhase);
    if (isInRun) {
        try {
            localStorage.setItem('blackjackRogueSave', JSON.stringify(state));
            getSteamService().saveCloudData(state);
        } catch (e) { console.error("Failed to save game state:", e); }
    } else {
        localStorage.removeItem('blackjackRogueSave');
    }
  }, [state, appPhase, gamePhase]);
  
  const [activeHandPosition, setActiveHandPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const playerHandRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeHand = useMemo(() => (gamePhase === 'playerTurn' || gamePhase === 'tutorial') ? playerHands[activeHandIndex] : null, [playerHands, activeHandIndex, gamePhase]);
  
  const measureActiveHand = useCallback(() => {
    if ((gamePhase === 'playerTurn' || gamePhase === 'tutorial') && activeHandIndex != null) {
      const node = playerHandRefs.current[activeHandIndex];
      if (node) {
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setActiveHandPosition({ top: rect.top, left: rect.left, width: rect.width });
          return;
        }
      }
      const isMobile = window.innerWidth < 768;
      setActiveHandPosition({
          top: window.innerHeight * (isMobile ? 0.55 : 0.65),
          left: window.innerWidth * 0.5 - (isMobile ? 100 : 120),
          width: isMobile ? 200 : 240
      });
    }
  }, [gamePhase, activeHandIndex]);

  useEffect(() => {
    if (appPhase === 'inGame' && (gamePhase === 'playerTurn' || gamePhase === 'tutorial')) {
        measureActiveHand();
        const interval = setInterval(measureActiveHand, 300);
        return () => clearInterval(interval);
    }
    if (gamePhase !== 'playerTurn' && gamePhase !== 'tutorial') {
        setActiveHandPosition(null);
    }
  }, [appPhase, gamePhase, measureActiveHand]);

  const handleRunEnd = useCallback((endedRunStats: typeof runStats) => {
    const newHistory = [...runHistory, endedRunStats].slice(-10);
    const newAchievements = [...new Set([...(unlockedAchievementIds || []), ...state.achievementQueue])];
    
    // Update quests
    useStore.getState().updateQuestProgress('quest_grind_shards_1', endedRunStats.shardsEarned);
    useStore.getState().updateQuestProgress('quest_grind_relics_1', endedRunStats.relicCurrencyEarned);
    useStore.getState().updateQuestProgress('quest_play_hands_1', endedRunStats.handsPlayed);

    // Stable state update using the base setter to avoid infinite render loop
    _setMetaState({
        unlockedRelicIds,
        totalCurrency: totalCurrency + endedRunStats.shardsEarned,
        relicCurrency: relicCurrency + endedRunStats.relicCurrencyEarned,
        runHistory: newHistory,
        unlockedAchievementIds: newAchievements,
        hasCompletedTutorial,
        customization,
        playerName,
        lastLoginDate,
        seasonStats: useStore.getState().seasonStats,
        currentSeason: useStore.getState().currentSeason,
        unlockedRuneIds: useStore.getState().unlockedRuneIds,
        unlockedModifierCardIds: useStore.getState().unlockedModifierCardIds,
        unlockedCustomizations: useStore.getState().unlockedCustomizations,
        activeQuests: useStore.getState().activeQuests,
        lootboxLevel: useStore.getState().lootboxLevel,
    });
    
    const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('blackjackRogueLeaderboard') || '[]');
    const lowestScore = leaderboard.length > 0 ? leaderboard[leaderboard.length - 1].score : 0;

    if (!playerName && (leaderboard.length < 10 || endedRunStats.floor > lowestScore)) {
        setShowPlayerNameInput(true);
    } else if (playerName) {
        const newEntry = { name: playerName, score: endedRunStats.floor, date: new Date().toISOString() };
        const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('blackjackRogueLeaderboard', JSON.stringify(updatedLeaderboard));
    }
  }, [_setMetaState, totalCurrency, relicCurrency, runHistory, unlockedAchievementIds, state.achievementQueue, playerName, customization, lastLoginDate, hasCompletedTutorial, unlockedRelicIds]);

  useEffect(() => {
    if ((gamePhase === 'defeat' || gamePhase === 'victory') && !hasHandledRunEndRef.current) {
      hasHandledRunEndRef.current = true;
      handleRunEnd(runStats);
    }
  }, [gamePhase, runStats, handleRunEnd]);

  useEffect(() => {
    const newAchievements = state.achievementQueue.filter(id => !(unlockedAchievementIds || []).includes(id) && !shownAchievements.includes(id));
    if (newAchievements.length > 0) {
      const achievementId = newAchievements[0];
      setShownAchievements(prev => [...prev, achievementId]);
      audioManager.playSound('achievement-unlock');
      const ach = ACHIEVEMENTS[achievementId];
      if (ach) {
        toast.success(`Achievement Unlocked: ${ach.name}`, {
          description: ach.description,
          icon: '🏆',
          duration: 5000,
        });
        getSteamService().unlockAchievement(achievementId);
      }
    }
  }, [state.achievementQueue, unlockedAchievementIds, shownAchievements]);

  useEffect(() => {
      const newLighting = updateTableLighting(state);
      if (newLighting !== state.tableLighting) {
          dispatch({ type: 'UPDATE_LIGHTING', lighting: newLighting });
      }
  }, [state.gamePhase, state.isEnraged]);

  const handleGoToMainMenu = () => setAppPhase('mainMenu');

  const handlePlay = (startingRelicId?: RelicId | null, mode: GameMode = 'endless') => {
    console.log('App handlePlay starting', { startingRelicId, mode });
    try {
      audioManager.resume();
      audioManager.playSound('button-click');
      
      console.log('handlePlay: clearing save and setting state');
      localStorage.removeItem('blackjackRogueSave');
      hasHandledRunEndRef.current = false; // Reset the guard for the new run
      const metaState = useStore.getState();
      console.log('handlePlay: dispatching START_NEW_RUN');
      dispatch({ type: 'START_NEW_RUN', startingRelicId: startingRelicId || undefined, metaState, mode });
      console.log('handlePlay: setting appPhase to inGame');
      setAppPhase('inGame');
    } catch (error) {
      console.error('Error in handlePlay:', error);
    }
  };

  const handleStartTutorial = () => {
    audioManager.resume();
    audioManager.playSound('button-click');
    localStorage.removeItem('blackjackRogueSave');
    dispatch({ type: 'START_TUTORIAL' });
    setAppPhase('inGame');
  };

  const handleCompleteTutorial = () => {
    audioManager.playSound('button-click');
    setHasCompletedTutorial(true);
    dispatch({ type: 'START_NEW_RUN', metaState: { customization, totalCurrency, relicCurrency, runHistory, unlockedAchievementIds, hasCompletedTutorial: true, unlockedRelicIds, unlockedSkills } as any });
  }

  const handleSelectReward = (relicId: RelicId) => {
    audioManager.playSound('relic-acquire');
    dispatch({ type: 'SELECT_REWARD', relicId });
  };
  
  const currentAchievement = shownAchievements[shownAchievements.length - 1];
  const achievementData = currentAchievement ? { id: currentAchievement, ...ACHIEVEMENTS[currentAchievement] } : null;

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowPlayerNameInput(false);
    const newEntry = { name, score: runStats.floor, date: new Date().toISOString() };
    const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('blackjackRogueLeaderboard') || '[]');
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('blackjackRogueLeaderboard', JSON.stringify(updatedLeaderboard));
  };
  
  const handleClaimDailyReward = () => {
      addCurrency(100);
      addRelicCurrency(1);
      setShowDailyReward(false);
      if (!playerName) setShowPlayerNameInput(true);
  };

  const handleHit = useCallback(() => dispatch({ type: 'HIT' }), [dispatch]);
  const handleBurnCard = useCallback((cardId: string) => {
    dispatch({ type: 'BURN_CARD', cardId });
  }, [dispatch]);
  const handleStand = useCallback(() => dispatch({ type: 'STAND' }), [dispatch]);
  const handleSurrender = useCallback(() => dispatch({ type: 'SURRENDER' }), [dispatch]);
  const handleDouble = useCallback(() => dispatch({ type: 'DOUBLE' }), [dispatch]);
  const handleSplit = useCallback(() => dispatch({ type: 'SPLIT' }), [dispatch]);
  const handleIntimidate = useCallback(() => dispatch({ type: 'INTIMIDATE' }), [dispatch]);
  const handleUsePotion = useCallback((potionId: any) => dispatch({ type: 'USE_POTION', potionId }), [dispatch]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appPhase !== 'inGame' || state.gamePhase !== 'playerTurn') return;
      
      switch (e.key.toLowerCase()) {
        case 'h':
          handleHit();
          break;
        case 's':
          handleStand();
          break;
        case 'd':
          if (activeHand && canDouble(activeHand, state.playerHP)) handleDouble();
          break;
        case 'f':
          if (activeHand && canSplit(activeHand, state.playerHP)) handleSplit();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          const potionIndex = parseInt(e.key) - 1;
          if (state.potions[potionIndex]) {
            handleUsePotion(state.potions[potionIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appPhase, state.gamePhase, state.potions, state.playerHP, activeHand, handleHit, handleStand, handleDouble, handleSplit, handleUsePotion]);

  // Determine background class based on floor
  let bgClass = "bg-stone-900"; // Default
  if (state.currentFloor === 1) bgClass = "bg-slate-900"; // Rusty Brig
  if (state.currentFloor === 2) bgClass = "bg-fuchsia-950"; // Neon Dungeon
  if (state.currentFloor >= 3) bgClass = "bg-rose-950"; // High Roller's Suite

  const GameBoard = (
    <motion.div 
        animate={gameContainerControls} 
        className={`w-full h-full relative ${bgClass} transition-colors duration-1000`}
        style={{ 
            x: shake.x, 
            y: shake.y,
            filter: 'contrast(1.05) saturate(1.1) brightness(1.02)'
        }}
    >
      {showDebug && (
          <div className="absolute top-2 left-2 z-[9999] bg-black/80 p-2 font-mono text-[10px] text-green-500 border border-green-900/50 pointer-events-none select-none">
              <p>ENGINE: RAYLIB-JS EMULATED</p>
              <p>FPS: {fps}</p>
              <p>PHASE: {state.gamePhase}</p>
              <p>FLOOR: {state.currentFloor}</p>
              <p>ENTITIES: {slashes.length + splatters.length + shockwaves.length + combatTextQueue.length}</p>
          </div>
      )}
      
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="absolute right-4 top-4 z-[9999] p-2 bg-black/40 border border-white/10 rounded text-white/40 hover:text-white transition-colors"
        title="Toggle Debug"
      >
        <Activity className="w-4 h-4" />
      </button>

      {gamePhase === 'cutscene' && state.currentCutscene && (
          <Cutscene cutscene={state.currentCutscene} onComplete={() => dispatch({ type: 'END_CUTSCENE' })} />
      )}
      <PlayerStatus hp={playerHP} maxHp={playerMaxHP} shield={playerShield} runCurrency={runCurrency} focus={focus} maxFocus={maxFocus} level={playerLevel} xp={playerXP} xpToNextLevel={xpToNextLevel} />
      <BossStatus hp={bossHP} maxHp={bossMaxHP} shield={bossShield} isDesperate={isDesperationActive} floor={currentFloor} intent={bossIntent} isIntimidated={isDealerIntimidated} floorModifier={floorModifier.id} bossPassive={bossPassive} currentStage={state.currentStage} />
      <RelicDisplay relics={relics} />
      <BoonDisplay boons={activeBoons} />
      <PotionBelt charges={potionCharges} onUsePotion={handleUsePotion} />
      <MessageToaster message={state.message} />
      <StreakMeter streak={winStreak} />
      
      <button 
        onClick={() => setShowDeckManager(true)}
        className="absolute left-4 top-32 z-50 p-3 bg-indigo-900/80 border border-indigo-500 rounded-full text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors shadow-lg shadow-indigo-900/50"
        title="View Deck"
      >
        <Layers className="w-6 h-6" />
      </button>

      <DeckManager 
        isOpen={showDeckManager} 
        onClose={() => setShowDeckManager(false)} 
        deck={state.deck} 
        onReorder={(newDeck) => dispatch({ type: 'REORDER_DECK', newDeck })} 
      />

      {tempDamageMultiplier && (
          <div className="absolute top-20 right-4 bg-red-900/80 border border-red-500 text-white p-2 rounded-lg animate-pulse z-40">
              <p className="font-bold">DAMAGE BUFF</p>
              <p>{tempDamageMultiplier.value}x for {tempDamageMultiplier.roundsLeft} turns</p>
          </div>
      )}
      
      {hollowingStacks > 0 && (
          <div className="absolute top-24 left-4 bg-purple-900/80 border border-purple-500 text-white p-2 rounded-lg z-40">
              <p className="font-bold text-xs uppercase">Hollowing</p>
              <p className="text-xs">Max HP Reduced: -{hollowingStacks}</p>
          </div>
      )}

      {floorModifier.id !== 'NONE' && gamePhase !== 'roundStart' && (
           <div className="absolute top-1/2 -translate-y-[150px] left-1/2 -translate-x-1/2 z-50 bg-black/60 p-3 rounded-lg text-center shadow-lg pointer-events-none">
               <h3 className="text-lg font-bold text-purple-300">{floorModifier.name}</h3>
               <p className="text-sm text-gray-300">{floorModifier.description}</p>
           </div>
      )}
      
      <BlackjackTable felt={customization.tableFelt} lighting={state.tableLighting}>
        <>
          <BlackjackTable.DealerHandContainer>
              {dealerHand.cards.length > 0 && 
                <BlackjackTable.Hand hand={dealerHand} isPlayer={false} isDealer={true} handIndex={0} isActive={gamePhase === 'dealerTurn'} totalPlayerHands={playerHands.length} cardBack={customization.cardBack} hideSecondCard={gamePhase === 'playerTurn' && !dealerHand.isRevealed} />}
          </BlackjackTable.DealerHandContainer>
          
          <BlackjackTable.PlayerHandsContainer handCount={playerHands.length}>
               {playerHands.map((hand, index) => (
                  <div key={hand.id} ref={el => { playerHandRefs.current[index] = el; }} style={{ display: 'inline-block' }}>
                    <BlackjackTable.Hand hand={hand} isPlayer={true} isDealer={false} handIndex={index} isActive={(index === activeHandIndex && gamePhase === 'playerTurn') || gamePhase === 'tutorial'} totalPlayerHands={playerHands.length} onReadyToMeasure={measureActiveHand} cardBack={customization.cardBack} onBurn={handleBurnCard} />
                  </div>
               ))}
          </BlackjackTable.PlayerHandsContainer>
          
          <BlackjackTable.Shoe count={deck.length} acesLeft={relics.some(r => r.id === RelicIdEnum.CardCountersGuide) ? deck.filter(c => c.rank === 'A').length : undefined} />
          <BlackjackTable.DiscardPile count={discardPile.length} />
        </>
      </BlackjackTable>

      {((activeHandPosition && gamePhase === 'playerTurn')) && (
        <PlayerActions 
          position={activeHandPosition || { top: window.innerHeight * 0.7, left: window.innerWidth / 2 - 150, width: 300 }}
          onHit={handleHit}
          onStand={handleStand}
          onSurrender={activeHand && activeHand.cards.length === 2 ? handleSurrender : undefined}
          onDouble={activeHand && canDouble(activeHand, playerHP) ? handleDouble : undefined}
          onSplit={activeHand && canSplit(activeHand, playerHP) ? handleSplit : undefined}
          onIntimidate={focus >= maxFocus ? handleIntimidate : undefined}
          blockedAction={blockedAction}
          splitCost={relics.some(r => r.id === RelicIdEnum.SplittersCharm) && playerHands.length === 1 ? 0 : SPLIT_COST}
          focus={focus}
          maxFocus={maxFocus}
        />
      )}
      
      {gamePhase === 'gameOver' && !showLootChest && (
        <div className="absolute bottom-10 z-50">
          <button className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold text-xl rounded-md shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105" onClick={() => { audioManager.playSound('button-click'); dispatch({ type: 'START_NEXT_HAND' }); }}>Next Hand</button>
        </div>
      )}

      {showLootChest && lootRewards && <LootChest rewards={lootRewards} onComplete={(rewards) => dispatch({type: 'AWARD_LOOT', rewards})} />}
      {gamePhase === 'tutorial' && <Tutorial dispatch={dispatch} state={state} onComplete={handleCompleteTutorial} activeHandPosition={activeHandPosition} />}
      {gamePhase === 'defeat' && <GameOverScreen runStats={runStats} onMainMenu={handleGoToMainMenu} dispatch={dispatch} />}
      {gamePhase === 'victory' && <VictoryScreen dispatch={dispatch} onMainMenu={handleGoToMainMenu} message={state.message === 'Campaign Complete!' ? 'CAMPAIGN COMPLETE' : 'VICTORY'} mode={state.mode} />}
      {gamePhase === 'reward' && <RewardScreen choices={rewardChoices} onSelect={handleSelectReward} />}
      {gamePhase === 'strangerEncounter' && <StrangerEncounterScreen choices={strangerChoices} onSelect={(pact: Pact) => dispatch({ type: 'SELECT_PACT', pact })} />}
      {gamePhase === 'curseSelection' && <CurseSelectionScreen choices={curseChoices} onSelect={(curseId) => dispatch({ type: 'SELECT_CURSE', curseId })} />}
      {gamePhase === 'boonSelection' && <BoonSelectionScreen choices={boonChoices} onSelect={(boonId: BoonId) => dispatch({ type: 'SELECT_BOON', boonId })} />}
      {gamePhase === 'bonfire' && <BonfireScreen onAction={(action) => dispatch({ type: 'BONFIRE_ACTION', action })} hasCurses={state.curses.length > 0} />}
      {gamePhase === 'seasonalEvent' && <SeasonalEventScreen onSelect={(rewardId) => dispatch({ type: 'SELECT_SEASONAL_REWARD', rewardId })} />}
      {gamePhase === 'spinWheel' && <SpinWheelScreen onComplete={(result) => dispatch({ type: 'SPIN_WHEEL_COMPLETE', result })} />}
      {gamePhase === 'plinko' && <PlinkoScreen onComplete={(rewards) => dispatch({ type: 'MINIGAME_COMPLETE', rewards })} />}
      {gamePhase === 'highLow' && <HighLowGame onComplete={(rewards) => dispatch({ type: 'MINIGAME_COMPLETE', rewards })} />}
      {gamePhase === 'diceRoll' && <DiceRollGame onComplete={(rewards) => dispatch({ type: 'MINIGAME_COMPLETE', rewards })} />}
      {gamePhase === 'shellGame' && <ShellGame onComplete={(rewards) => dispatch({ type: 'MINIGAME_COMPLETE', rewards })} />}
      {gamePhase === 'levelUp' && <LevelUpScreen choices={levelUpChoices} onSelect={(choiceId: LevelUpChoiceId) => dispatch({ type: 'SELECT_LEVEL_UP_CHOICE', choiceId})} level={playerLevel} />}
    </motion.div>
  );

  const handleSlashComplete = useCallback((id: number) => {
      setSlashes(s => s.filter(sl => sl.id !== id));
  }, []);

  const handleShockwaveComplete = useCallback((id: number) => {
      setShockwaves(s => s.filter(sw => sw.id !== id));
  }, []);

  const handleCombatTextClear = useCallback((id: number) => {
      setCombatTextQueue(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <Toaster position="top-center" theme="dark" richColors />
      <div className={`absolute inset-0 z-[1000] pointer-events-none transition-opacity duration-300 ${screenFlash > 0 ? 'bg-red-600' : 'bg-transparent'}`} style={{ opacity: screenFlash }}></div>
      {state.gamePhase !== 'cutscene' && (
        <>
          <VisualFXLayer slashes={slashes} splatters={splatters} onSlashComplete={handleSlashComplete} isBossStunned={isBossStunned} shockwaves={shockwaves} onShockwaveComplete={handleShockwaveComplete} />
          <ParticleSystem ref={particleSystemRef} />
          <div className="absolute inset-0 z-[90] pointer-events-none">
              <CombatText queue={combatTextQueue} onClear={handleCombatTextClear} />
          </div>
        </>
      )}
      <PatchNotes isOpen={showPatchNotes} onClose={() => setShowPatchNotes(false)} />
      {appPhase === 'inGame' && <QuestPopup isOpen={showQuests} onClose={() => setShowQuests(false)} />}
      <AnimatePresence mode="wait">
        {appPhase === 'tranquilIntro' && <Intro onComplete={() => setAppPhase('majorUpdates')} />}
        {appPhase === 'majorUpdates' && <MajorUpdatesScreen onConfirm={() => setAppPhase('patchNotes')} />}
        {appPhase === 'patchNotes' && <PatchNotesScreen onContinue={() => setAppPhase('mainMenu')} />}
        {appPhase === 'mainMenu' && (
            <motion.div 
                key="mainMenu" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.05 }} 
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full relative"
            >
                <MainMenu 
                  onPlay={handlePlay} 
                  onStartTutorial={handleStartTutorial}
                  onEnterMultiplayer={handleEnterMultiplayer}
                  setShowPatchNotes={setShowPatchNotes}
                  onOpenSkillTree={() => setShowSkillTree(true)}
                />
                
                {showPlayerNameInput && <PlayerNameInputScreen onSubmit={handleNameSubmit} />}
                {showDailyReward && <DailyRewardScreen onClaim={handleClaimDailyReward} rewards={{ shards: 100, relicCurrency: 1 }} />}
            </motion.div>
        )}
        {appPhase === 'multiplayer' && (
          <MultiplayerScreen 
            socket={socket} 
            onBack={() => {
              socket?.disconnect();
              setAppPhase('mainMenu');
            }}
            onStartGame={(roomId) => {
              // For now, just start a normal run but maybe with a special flag
              // In a real implementation, we would sync state
              handlePlay(); 
            }}
          />
        )}
        {appPhase === 'inGame' && (
            <motion.div 
                key="game" 
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} 
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} 
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full" 
                style={{ perspective: '2000px' }}
            >
                {GameBoard}
            </motion.div>
        )}
      </AnimatePresence>

      <SkillTree 
        isOpen={showSkillTree} 
        onClose={() => setShowSkillTree(false)} 
        skillPoints={skillPoints} 
        unlockedSkills={unlockedSkills} 
        onUnlockSkill={unlockSkill} 
      />
    </div>
  );
}
