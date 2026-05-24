import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserState, ByteMood } from '@/types';
import { supabase } from '@/lib/supabase';

const today = () => new Date().toISOString().split('T')[0];

interface UserActions {
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  loseHeart: () => void;
  gainHeart: () => void;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  checkStreak: () => void;
  setByteMood: (mood: ByteMood) => void;
  unlockBadge: (badgeId: string) => void;
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  setUserId: (id: string | null) => void;
  resetHearts: () => void;
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
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserId: (id) => set({ userId: id }),

      addXp: (amount) => {
        set((s) => ({ xp: s.xp + amount, weeklyXp: s.weeklyXp + amount }));
      },

      addGems: (amount) => set((s) => ({ gems: s.gems + amount })),

      spendGems: (amount) => {
        const { gems } = get();
        if (gems < amount) return false;
        set((s) => ({ gems: s.gems - amount }));
        return true;
      },

      loseHeart: () => {
        set((s) => {
          const hearts = Math.max(0, s.hearts - 1);
          const mood = hearts === 0 ? 'low_battery' : s.hearts <= 2 ? 'worried' : s.byteMood;
          return { hearts, byteMood: mood };
        });
      },

      gainHeart: () => {
        set((s) => ({ hearts: Math.min(s.hearts + 1, s.maxHearts) }));
      },

      resetHearts: () => set({ hearts: 5 }),

      completeLesson: (lessonId, xpEarned) => {
        const { completedLessons } = get();
        if (completedLessons.includes(lessonId)) return;

        const todayStr = today();
        set((s) => ({
          completedLessons: [...s.completedLessons, lessonId],
          xp: s.xp + xpEarned,
          weeklyXp: s.weeklyXp + xpEarned,
          gems: s.gems + Math.floor(xpEarned / 10),
          lastActiveDate: todayStr,
          byteMood: 'celebrating',
          byteBattery: Math.min(100, s.byteBattery + 20),
        }));

        get().checkStreak();
        setTimeout(() => get().syncToSupabase(), 500);
      },

      checkStreak: () => {
        const { lastActiveDate } = get();
        const todayStr = today();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        set((s) => {
          if (s.lastActiveDate === todayStr) {
            return {};
          } else if (s.lastActiveDate === yesterdayStr || !s.lastActiveDate) {
            const newStreak = s.streak + 1;
            const battery = Math.min(100, newStreak * 15);
            const mood: ByteMood = newStreak >= 7 ? 'proud' : 'happy';
            return { streak: newStreak, byteBattery: battery, byteMood: mood };
          } else {
            // Streak broken
            return { streak: 0, byteBattery: 10, byteMood: 'low_battery' };
          }
        });
      },

      setByteMood: (mood) => set({ byteMood: mood }),

      unlockBadge: (badgeId) => {
        const { badges } = get();
        if (badges.includes(badgeId)) return;
        set((s) => ({ badges: [...s.badges, badgeId] }));
      },

      syncToSupabase: async () => {
        const s = get();
        if (!s.userId) return;
        try {
          await supabase.from('user_state').upsert({
            user_id: s.userId,
            xp: s.xp,
            gems: s.gems,
            hearts: s.hearts,
            streak: s.streak,
            last_active_date: s.lastActiveDate,
            byte_mood: s.byteMood,
            byte_battery: s.byteBattery,
            completed_lessons: s.completedLessons,
            badges: s.badges,
            weekly_xp: s.weeklyXp,
            week_start_date: s.weekStartDate,
          });
        } catch {
          // Silent fail — local state is source of truth
        }
      },

      loadFromSupabase: async (userId) => {
        try {
          const { data } = await supabase
            .from('user_state')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          if (data) {
            set({
              userId,
              xp: data.xp,
              gems: data.gems,
              hearts: data.hearts,
              streak: data.streak,
              lastActiveDate: data.last_active_date,
              byteMood: data.byte_mood as ByteMood,
              byteBattery: data.byte_battery,
              completedLessons: data.completed_lessons ?? [],
              badges: data.badges ?? [],
              weeklyXp: data.weekly_xp,
              weekStartDate: data.week_start_date,
            });
          } else {
            set({ userId });
          }
        } catch {
          set({ userId });
        }
      },
    }),
    {
      name: 'codebyte-user',
      partialize: (s) => ({
        xp: s.xp,
        gems: s.gems,
        hearts: s.hearts,
        streak: s.streak,
        lastActiveDate: s.lastActiveDate,
        byteMood: s.byteMood,
        byteBattery: s.byteBattery,
        completedLessons: s.completedLessons,
        badges: s.badges,
        weeklyXp: s.weeklyXp,
        weekStartDate: s.weekStartDate,
      }),
    }
  )
);
