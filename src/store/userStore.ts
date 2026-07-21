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
  loadFromSupabase: () => Promise<void>;
  setUserId: (id: string | null) => void;
  setName: (name: string) => void;
  toggleTopic: (topicId: string) => void;
  addCoffee: () => void;
  setFavDrink: (drink: 'coffee' | 'tea' | 'energy' | 'juice' | 'water') => void;
  addWrongQuestion: (questionId: number) => void;
  removeWrongQuestion: (questionId: number) => void;
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
  coffees: 0,
  favDrink: null,
  wrongQuestionIds: [],
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserId: (id) => set({ userId: id }),

      addXp: (amount) => set((s) => ({ xp: s.xp + amount, weeklyXp: s.weeklyXp + amount })),

      // Hearts = health indicator based on activity, NOT lost on wrong answers
      loseHeart: () => {}, // no-op - hearts are not lost on mistakes

      gainHeart: () => set((s) => ({ hearts: Math.min(s.hearts + 1, s.maxHearts) })),

      completeLesson: (lessonId, xpEarned) => {
        const { completedLessons, ownedItems } = get();
        if (completedLessons.includes(lessonId)) return null;

        // Reward every 5th lesson (not every lesson - 50 items for 293 lessons)
        const newCount = completedLessons.length + 1;
        const getsReward = newCount % 5 === 0 || newCount === 1 || newCount === 3;
        const reward = getsReward ? pickReward(newCount, ownedItems) : null;
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
            // Active yesterday → increment streak, gain heart
            const streak = s.streak + 1;
            const hearts = Math.min(s.maxHearts, s.hearts + 1);
            return { streak, hearts, byteBattery: Math.min(100, streak * 15), byteMood: streak >= 7 ? 'proud' : 'happy', lastActiveDate: todayStr };
          }
          if (!s.lastActiveDate) {
            // First time ever - start streak at 1
            return { streak: 1, lastActiveDate: todayStr, byteMood: 'happy' };
          }
          // Missed days → reset streak, lose hearts based on days missed
          const lastDate = new Date(s.lastActiveDate);
          const daysMissed = Math.floor((Date.now() - lastDate.getTime()) / 86400000) - 1;
          const heartsLost = Math.min(daysMissed, s.hearts);
          const hearts = Math.max(0, s.hearts - heartsLost);
          return { streak: 0, hearts, byteBattery: 20, byteMood: hearts === 0 ? 'low_battery' : hearts <= 2 ? 'worried' : 'happy', lastActiveDate: todayStr };
        });
      },

      setByteMood: (mood) => set({ byteMood: mood }),

      unlockBadge: (id) => set((s) => s.badges.includes(id) ? {} : { badges: [...s.badges, id] }),

      addItem: (itemId) => set((s) =>
        s.ownedItems.includes(itemId) ? {} : { ownedItems: [...s.ownedItems, itemId] }
      ),

      equip: (slot, itemId) => {
        set((s) => ({ equipment: { ...s.equipment, [slot]: itemId } }));
        setTimeout(() => get().syncToSupabase(), 300);
      },

      setName: (name) => {
        set({ name });
        setTimeout(() => get().syncToSupabase(), 300);
      },

      toggleTopic: (topicId) => {
        set((s) => ({
          selectedTopics: s.selectedTopics.includes(topicId)
            ? s.selectedTopics.filter(id => id !== topicId)
            : [...s.selectedTopics, topicId],
        }));
        setTimeout(() => get().syncToSupabase(), 300);
      },

      addCoffee: () => set((s) => ({ coffees: (s.coffees || 0) + 1 })),
      setFavDrink: (drink) => {
        set({ favDrink: drink });
        setTimeout(() => get().syncToSupabase(), 300);
      },

      addWrongQuestion: (questionId) => set((s) => ({
        wrongQuestionIds: s.wrongQuestionIds?.includes(questionId) ? s.wrongQuestionIds : [...(s.wrongQuestionIds || []), questionId],
      })),
      removeWrongQuestion: (questionId) => set((s) => ({
        wrongQuestionIds: (s.wrongQuestionIds || []).filter(id => id !== questionId),
      })),

      syncToSupabase: async () => {
        const s = get();
        if (!s.userId) return;
        try {
          await supabase.from('user_state').upsert({
            user_id: s.userId,
            display_name: s.name || 'User',
            xp: s.xp, gems: s.gems, hearts: s.hearts, streak: s.streak,
            last_active_date: s.lastActiveDate, byte_mood: s.byteMood,
            byte_battery: s.byteBattery, completed_lessons: s.completedLessons,
            badges: s.badges, weekly_xp: s.weeklyXp, week_start_date: s.weekStartDate,
            owned_items: s.ownedItems, equipment: s.equipment,
            selected_topics: s.selectedTopics, coffees: s.coffees, fav_drink: s.favDrink,
          });
        } catch {}
      },

      loadFromSupabase: async () => {
        const s = get();
        if (!s.userId) return;
        try {
          const { data } = await supabase.from('user_state').select('*').eq('user_id', s.userId).single();
          if (!data) return;

          // Only load from server if server has more progress (more completed lessons)
          const serverLessons = data.completed_lessons || [];
          const localLessons = s.completedLessons || [];
          const serverIsNewer = serverLessons.length > localLessons.length;

          if (serverIsNewer || !s.name) {
            set({
              name: data.display_name || s.name,
              xp: Math.max(data.xp || 0, s.xp),
              gems: Math.max(data.gems || 0, s.gems),
              streak: Math.max(data.streak || 0, s.streak),
              lastActiveDate: data.last_active_date || s.lastActiveDate,
              completedLessons: serverLessons.length > localLessons.length ? serverLessons : localLessons,
              badges: [...new Set([...(data.badges || []), ...(s.badges || [])])],
              weeklyXp: Math.max(data.weekly_xp || 0, s.weeklyXp),
              ownedItems: [...new Set([...(data.owned_items || []), ...(s.ownedItems || [])])],
              equipment: data.equipment && Object.keys(data.equipment).length > 0 ? data.equipment : s.equipment,
              selectedTopics: data.selected_topics?.length > 0 ? data.selected_topics : s.selectedTopics,
              coffees: Math.max(data.coffees || 0, s.coffees || 0),
              favDrink: data.fav_drink || s.favDrink,
            });
          }
        } catch {}
      },
    }),
    {
      name: 'coduy-user',
      // Migrate from old storage key
      onRehydrateStorage: () => {
        if (typeof window === 'undefined') return;
        const oldKey = 'codebyte-user-v2';
        const oldData = localStorage.getItem(oldKey);
        if (oldData && !localStorage.getItem('coduy-user')) {
          localStorage.setItem('coduy-user', oldData);
          localStorage.removeItem(oldKey);
        }
      },
      partialize: (s) => ({
        xp: s.xp, gems: s.gems, hearts: s.hearts, streak: s.streak,
        lastActiveDate: s.lastActiveDate, byteMood: s.byteMood,
        byteBattery: s.byteBattery, completedLessons: s.completedLessons,
        badges: s.badges, weeklyXp: s.weeklyXp, weekStartDate: s.weekStartDate,
        ownedItems: s.ownedItems, equipment: s.equipment, name: s.name,
        selectedTopics: s.selectedTopics, coffees: s.coffees, favDrink: s.favDrink,
      }),
    }
  )
);
