import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MetaState, RelicId, Customization } from '../types';
import { RelicId as RelicIdEnum, GraphicsQuality, CardModifierId } from '../types';

const defaultMetaState: MetaState = {
    unlockedRelicIds: [RelicIdEnum.GoldenKnuckles],
    unlockedRuneIds: [],
    unlockedModifierCardIds: [CardModifierId.THE_REAPER], // Start with only one
    unlockedSkills: [],
    skillPoints: 1,
    totalCurrency: 0,
    runHistory: [],
    unlockedAchievementIds: [],
    hasCompletedTutorial: false,
    relicCurrency: 0,
    customization: { cardBack: 'default', tableFelt: 'green', volume: 0.5, graphicsQuality: GraphicsQuality.High, deviceMode: 'mobile' },
    unlockedCustomizations: { cardBacks: ['default'], tableFelts: ['green'], shoeDesigns: ['default'], deckDesigns: ['default'] },
    playerName: undefined,
    lastLoginDate: undefined,
    lastDailySpinDate: undefined,
    referralCount: 0,
    activeQuests: [
        {
            id: 'quest_grind_shards_1',
            description: 'Collect 1,000 Shards',
            target: 1000,
            progress: 0,
            reward: { type: 'relics', value: 5 },
            isCompleted: false,
            isClaimed: false
        },
        {
            id: 'quest_grind_relics_1',
            description: 'Collect 50 Gold',
            target: 50,
            progress: 0,
            reward: { type: 'shards', value: 2000 },
            isCompleted: false,
            isClaimed: false
        },
        {
            id: 'quest_play_hands_1',
            description: 'Play 50 Hands',
            target: 50,
            progress: 0,
            reward: { type: 'customization', value: 'galaxy', id: 'tableFelt' },
            isCompleted: false,
            isClaimed: false
        }
    ],
    seasonStats: {
        totalBurned: 0,
    },
    currentSeason: {
        id: 1,
        name: "The Void Awakening",
        endsAt: "2025-11-15T00:00:00Z",
        totalBurnedGlobal: 5000000,
    }
};

interface MetaStateActions {
  setPlayerName: (name: string) => void;
  addCurrency: (amount: number) => void;
  addRelicCurrency: (amount: number) => void;
  unlockRelic: (relicId: RelicId) => boolean;
  unlockRune: (runeId: string) => boolean;
  updateCustomization: (customization: Partial<Customization>) => void;
  unlockCustomization: (type: 'cardBacks' | 'tableFelts' | 'shoeDesigns' | 'deckDesigns', id: string) => void;
  setHasCompletedTutorial: (status: boolean) => void;
  setLastLoginDate: (date: string) => void;
  setLastDailySpinDate: (date: string) => void;
  _setState: (newState: Partial<MetaState>) => void;
  forgeRelic: (relic1Id: RelicId, relic2Id: RelicId, newRelicId: RelicId, cost: number) => boolean;
  burnTokens: (amount: number) => boolean;
  updateQuestProgress: (questId: string, amount: number) => void;
  unlockSkill: (skillId: string, cost: number) => boolean;
}

export const useStore = create<MetaState & MetaStateActions>()(
  persist(
    (set, get) => ({
      ...defaultMetaState,
      setPlayerName: (name) => set({ playerName: name }),
      addCurrency: (amount) => set(state => ({ totalCurrency: state.totalCurrency + amount })),
      addRelicCurrency: (amount) => set(state => ({ relicCurrency: state.relicCurrency + amount })),
      updateQuestProgress: (questId, amount) => set(state => {
          const newQuests = state.activeQuests.map(q => {
              if (q.id === questId && !q.isCompleted) {
                  const newProgress = Math.min(q.target, q.progress + amount);
                  return { ...q, progress: newProgress, isCompleted: newProgress >= q.target };
              }
              return q;
          });
          return { activeQuests: newQuests };
      }),
      unlockSkill: (skillId, cost) => {
          const { skillPoints, unlockedSkills } = get();
          if (skillPoints < cost) return false;
          if (unlockedSkills?.includes(skillId)) return false;
          
          set({
              skillPoints: skillPoints - cost,
              unlockedSkills: [...(unlockedSkills || []), skillId]
          });
          return true;
      },
      unlockRelic: (relicId) => {
          const currentIds = get().unlockedRelicIds || [];
          if (!currentIds.includes(relicId)) {
              set(state => ({ unlockedRelicIds: [...(state.unlockedRelicIds || []), relicId] }));
              return true;
          }
          return false;
      },
      unlockRune: (runeId) => {
          const currentIds = get().unlockedRuneIds || [];
          if (!currentIds.includes(runeId)) {
              set(state => ({ unlockedRuneIds: [...(state.unlockedRuneIds || []), runeId] }));
              return true;
          }
          return false;
      },
      updateCustomization: (customization) => set(state => ({
        customization: { ...state.customization, ...customization }
      })),
      unlockCustomization: (type, id) => set(state => {
          const currentType = state.unlockedCustomizations?.[type] || [];
          return {
              unlockedCustomizations: {
                  ...state.unlockedCustomizations,
                  [type]: [...currentType, id]
              }
          };
      }),
      setHasCompletedTutorial: (status) => set({ hasCompletedTutorial: status }),
      setLastLoginDate: (date) => set({ lastLoginDate: date }),
      setLastDailySpinDate: (date) => set({ lastDailySpinDate: date }),
      _setState: (newState) => set(newState),
      forgeRelic: (relic1Id, relic2Id, newRelicId, cost) => {
          const { relicCurrency, unlockedRelicIds } = get();
          if (relicCurrency < cost) return false;
          
          const newRelicList = unlockedRelicIds.filter(id => id !== relic1Id && id !== relic2Id);
          if (!newRelicList.includes(newRelicId)) {
              newRelicList.push(newRelicId);
          }

          set({
              relicCurrency: relicCurrency - cost,
              unlockedRelicIds: newRelicList
          });
          return true;
      },
      burnTokens: (amount) => {
          const { relicCurrency, seasonStats } = get();
          if (relicCurrency < amount) return false;
          
          set({
              relicCurrency: relicCurrency - amount,
              seasonStats: {
                  totalBurned: seasonStats.totalBurned + amount
              }
          });
          return true;
      }
    }),
    {
      name: 'blackjack-rogue-meta-v3-med', 
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (persistedState: any, version) => {
          if (version < 4) {
              return {
                  ...defaultMetaState,
                  ...persistedState,
                  unlockedModifierCardIds: persistedState.unlockedModifierCardIds || defaultMetaState.unlockedModifierCardIds,
                  unlockedRuneIds: persistedState.unlockedRuneIds || defaultMetaState.unlockedRuneIds,
                  activeQuests: persistedState.activeQuests || defaultMetaState.activeQuests,
                  customization: {
                      ...defaultMetaState.customization,
                      ...persistedState.customization
                  },
                  unlockedCustomizations: {
                      ...defaultMetaState.unlockedCustomizations,
                      ...persistedState.unlockedCustomizations,
                      shoeDesigns: persistedState.unlockedCustomizations?.shoeDesigns || defaultMetaState.unlockedCustomizations.shoeDesigns,
                      deckDesigns: persistedState.unlockedCustomizations?.deckDesigns || defaultMetaState.unlockedCustomizations.deckDesigns,
                  },
                  seasonStats: defaultMetaState.seasonStats,
                  currentSeason: defaultMetaState.currentSeason
              } as MetaState;
          }
          return persistedState as MetaState;
      },
    }
  )
);