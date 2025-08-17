import { create } from 'zustand';
import type { MoodEntry } from '@/types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

interface MoodStore {
    entries: MoodEntry[];
    fetchEntries: () => Promise<void>;
    addEntry: (entry: Omit<MoodEntry, 'id' | 'date'> & { date: Date }) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const useMoodStore = create<MoodStore>((set, get) => ({
    entries: [],
    loading: true,
    error: null,
    fetchEntries: async () => {
        set({ loading: true, error: null });
        try {
            const q = query(collection(db, 'moods'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const entries = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore Timestamp to ISO string
                    date: data.date.toDate().toISOString(),
                } as MoodEntry;
            });
            set({ entries, loading: false });
        } catch (error) {
            console.error("Error fetching mood entries: ", error);
            set({ error: 'Failed to fetch mood entries.', loading: false });
        }
    },
    addEntry: async (entry) => {
        try {
            await addDoc(collection(db, 'moods'), {
                ...entry,
                date: entry.date,
            });
            // Refresh entries after adding a new one
            await get().fetchEntries();
        } catch (error) {
            console.error("Error adding mood entry: ", error);
            set({ error: 'Failed to save mood entry.' });
        }
    },
}));
