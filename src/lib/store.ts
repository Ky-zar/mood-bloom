import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MoodEntry } from '@/types';

type StoreState = {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id'>) => void;
};

export const useMoodStore = create<StoreState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, { ...entry, id: new Date().toISOString() }].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        })),
    }),
    {
      name: 'mood-bloom-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
