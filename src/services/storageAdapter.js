
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';

/**
 * UTILS: Local Storage Wrappers
 */
const getLocal = (key) => JSON.parse(localStorage.getItem(key) || 'null');
const setLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val));

/**
 * CORE: Unified Adapter
 * Automatically switches between LocalStorage (Guest) and Firestore (User).
 */
export const storageAdapter = {

    // --- 1. Learning Progress ---

    async saveLearningProgress(userId, chapterId, data) {
        if (!userId) {
            // Guest: Simple LocalStorage
            const current = getLocal('learning_progress') || {};
            current[chapterId] = { ...current[chapterId], ...data, lastUpdated: new Date().toISOString() };
            setLocal('learning_progress', current);
            return;
        }

        // User: Firestore
        const userRef = doc(db, 'users', userId);
        try {
            await setDoc(userRef, {
                learningProgress: {
                    [chapterId]: { ...data, lastUpdated: new Date().toISOString() }
                }
            }, { merge: true });
        } catch (e) {
            console.error("Error saving progress to cloud:", e);
        }
    },

    async getLearningProgress(userId) {
        if (!userId) return getLocal('learning_progress') || {};

        try {
            const docSnap = await getDoc(doc(db, 'users', userId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                // MERGE with local for offline safety? For now, Cloud source of truth if logged in.
                return data.learningProgress || {};
            }
        } catch (e) {
            console.error("Error fetching progress:", e);
        }
        return {};
    },

    // --- 2. Interview History ---

    async saveInterviewResult(userId, interviewData) {
        // interviewData = { id, date, score, feedback, type, company, ... }

        if (!userId) {
            const history = getLocal('interview_history') || [];
            history.push(interviewData);
            setLocal('interview_history', history);
            return;
        }

        const userRef = doc(db, 'users', userId);
        try {
            await updateDoc(userRef, {
                interviewHistory: arrayUnion(interviewData)
            });
        } catch (e) {
            // If document doesn't exist yet (first time user), create it
            await setDoc(userRef, {
                interviewHistory: [interviewData]
            }, { merge: true });
        }
    },

    async getInterviewHistory(userId) {
        if (!userId) return getLocal('interview_history') || [];

        try {
            const docSnap = await getDoc(doc(db, 'users', userId));
            if (docSnap.exists()) {
                return docSnap.data().interviewHistory || [];
            }
        } catch (e) {
            console.error("Error fetching history:", e);
        }
        return [];
    },

    // --- 3. Sync Logic (Local -> Cloud) ---

    async syncLocalToCloud(userId) {
        if (!userId) return;

        const localProgress = getLocal('learning_progress');
        const localHistory = getLocal('interview_history');

        if (!localProgress && !localHistory) return;

        const userRef = doc(db, 'users', userId);
        const updates = {};

        if (localProgress) updates.learningProgress = localProgress;
        if (localHistory) updates.interviewHistory = localHistory; // Note: This might overwrite if not careful, but for V1 it's okay (usually empty cloud on first sync)

        try {
            await setDoc(userRef, updates, { merge: true });
            // Optional: Clear local after sync? better keep it for backup or "offline mode" logic later
            console.log("Synced local data to cloud for user:", userId);
        } catch (e) {
            console.error("Sync failed:", e);
        }
    }
};
