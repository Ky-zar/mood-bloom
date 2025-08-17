import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    getAdditionalUserInfo,
    type User
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export const signUpWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null; isNewUser: boolean; }> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null, isNewUser: true };
    } catch (error: any) {
        return { user: null, error: error.message, isNewUser: false };
    }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: User | null; error: string | null; isNewUser: boolean; }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // We assume they are not new if they sign in with email/password directly.
        // New users will come from the signup page.
        const isNew = !userCredential.user.displayName;
        return { user: userCredential.user, error: null, isNewUser: isNew };
    } catch (error: any) {
        return { user: null, error: error.message, isNewUser: false };
    }
};

export const signInWithGoogle = async (): Promise<{ user: User | null; error: string | null; isNewUser: boolean; }> => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const additionalUserInfo = getAdditionalUserInfo(result);
        return { user: result.user, error: null, isNewUser: !!additionalUserInfo?.isNewUser };
    } catch (error: any) {
        return { user: null, error: error.message, isNewUser: false };
    }
};

export const updateUserProfile = async (profile: { displayName?: string; photoURL?: string; }): Promise<{ user: User | null; error: string | null; }> => {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateProfile(user, profile);
            return { user, error: null };
        } catch(error: any) {
            return { user: null, error: error.message };
        }
    }
    return { user: null, error: "No user is currently signed in." };
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
