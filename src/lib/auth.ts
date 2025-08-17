import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null; }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null; }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
};

export const signOut = async (): Promise<{ error: string | null; }> => {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const onAuth = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export { auth };
