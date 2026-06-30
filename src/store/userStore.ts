'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, ByteMood, ByteEquipment } from '@/types';
import { supabase } from '@/lib/supabase';
import { pickReward } from '@/data/cosmetics';

const today = () => new Date().toISOString().split('T')[0];

interface UserActions {
  addXp: (amount: number) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  completeLesson: (lessonId: string, xpEarned: number) => string | null;
  checkStreak: () => void;
  setByteMood: (mood: ByteMood) => void;
  unlockBadge: (badgeId: string) => void;
  addItem: (itemId: string) => void;
  equip: (slot: keyof ByteEquipment, itemId: string | undefined) => void;
  syncToSupabase: () => Promise<void>;
  setUserId: (id: string | null) => void;
  setName: (name: string) => void;
  toggleTopic: (topicId: string) => void;
}

const initialState: UserState = {
  userId: null,
  xp: 0,
  gems: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastActiveDate: null,
  byteMood: 'happy',
  byteBattery: 100,
  completedLessons: [],
  badges: [],
  weeklyXp: 0,
  weekStartDate: null,
  ownedItems: [],
  equipment: {},
  name: null,
  selectedTopics: [],
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserId: (id) => set({ userId: id }),

      addXp: (amount) => set((s) => ({ xp: s.xp + amount, weeklyXp: s.weeklyXp + amount })),

      loseHeart: () => set((s) => {
        const hearts = Math.max(0, s.hearts - 1);
        return { hearts, byteMood: hearts === 0 ? 'low_battery' : hearts <= 2 ? 'worried' : s.byteMood };
      }),

      gainHeart: () => set((s) => ({ hearts: Math.min(s.hearts + 1, s.maxHearts) })),

      completeLesson: (lessonId, xpEarned) => {
        const { completedLessons, ownedItems } = get();
        if (completedLessons.includes(lessonId)) return null;

        const reward = pickReward(completedLessons.length, ownedItems);
        const newOwned = reward ? [...ownedItems, reward] : ownedItems;

        set((s) => ({
          completedLessons: [...s.completedLessons, lessonId],
          xp: s.xp + xpEarned,
          weeklyXp: s.weeklyXp + xpEarned,
          gems: s.gems + Math.floor(xpEarned / 10),
          lastActiveDate: today(),
          byteMood: 'celebrating',
          byteBattery: Math.min(100, s.byteBattery + 20),
          ownedItems: newOwned,
        }));

        get().checkStreak();
        setTimeout(() => get().syncToSupabase(), 300);
        return reward;
      },

      checkStreak: () => {
        const todayStr = today();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        set((s) => {
          if (s.lastActiveDate === todayStr) return {};
          if (s.lastActiveDate === yStr) {
            // Active yesterday → increment streak
            const streak = s.streak + 1;
            return { streak, byteBattery: Math.min(100, streak * 15), byteMood: streak >= 7 ? 'proud' : 'happy', lastActiveDate: todayStr };
          }
          if (!s.lastActiveDate) {
            // First time ever — don't increment yet, just note today
            return { lastActiveDate: todayStr };
          }
          // Missed days → reset
          return { streak: 0, byteBattery: 20, byteMood: 'happy', lastActiveDate: todayStr };
        });
      },

      setByteMood: (mood) => set({ byteMood: mood }),

      unlockBadge: (id) => set((s) => s.badges.includes(id) ? {} : { badges: [...s.badges, id] }),

      addItem: (itemId) => set((s) =>
        s.ownedItems.includes(itemId) ? {} : { ownedItems: [...s.ownedItems, itemId] }
      ),

      equip: (slot, itemId) => set((s) => ({
        equipment: { ...s.equipment, [slot]: itemId },
      })),

      setName: (name) => set({ name }),

      toggleTopic: (topicId) => set((s) => ({
        selectedTopics: s.selectedTopics.includes(topicId)
          ? s.selectedTopics.filter(id => id !== topicId)
          : [...s.selectedTopics, topicId],
      })),

      syncToSupabase: async () => {
        const s = get();
        if (!s.userId) return;
        try {
          await supabase.from('user_state').upsert({
            user_id: s.userId,
            xp: s.xp, gems: s.gems, hearts: s.hearts, streak: s.streak,
            last_active_date: s.lastActiveDate, byte_mood: s.byteMood,
            byte_battery: s.byteBattery, completed_lessons: s.completedLessons,
            badges: s.badges, weekly_xp: s.weeklyXp, week_start_date: s.weekStartDate,
          });
        } catch {}
      },
    }),
    {
      name: 'coduy-user-v1',
      partialize: (s) => ({
        xp: s.xp, gems: s.gems, hearts: s.hearts, streak: s.streak,
        lastActiveDate: s.lastActiveDate, byteMood: s.byteMood,
        byteBattery: s.byteBattery, completedLessons: s.completedLessons,
        badges: s.badges, weeklyXp: s.weeklyXp, weekStartDate: s.weekStartDate,
        ownedItems: s.ownedItems, equipment: s.equipment, name: s.name,
        selectedTopics: s.selectedTopics,
      }),
    }
  )
);
