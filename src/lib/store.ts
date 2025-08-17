import { create } from 'zustand';
import type { MoodEntry } from '@/types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface MoodStore {
    entries: MoodEntry[];
    fetchEntries: () => Promise<void>;
    addEntry: (entry: Omit<MoodEntry, 'id' | 'date' | 'userId'> & { date: Date }) => Promise<void>;
    loading: boolean;
    error: string | null;
    clearEntries: () => void;
}

export const useMoodStore = create<MoodStore>((set, get) => ({
    entries: [],
    loading: true,
    error: null,
    fetchEntries: async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            set({ entries: [], loading: false });
            return;
        }

        set({ loading: true, error: null });
        try {
            const q = query(collection(db, 'moods'), where('userId', '==', user.uid), orderBy('date', 'desc'));
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
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            set({ error: 'You must be logged in to add an entry.' });
            return;
        }

        try {
            await addDoc(collection(db, 'moods'), {
                ...entry,
                date: entry.date,
                userId: user.uid,
            });
            // Refresh entries after adding a new one
            await get().fetchEntries();
        } catch (error) {
            console.error("Error adding mood entry: ", error);
            set({ error: 'Failed to save mood entry.' });
        }
    },
    clearEntries: () => {
        set({ entries: [], loading: false });
    }
}));
