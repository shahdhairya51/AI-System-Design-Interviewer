
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

// Unique session ID to group events for a single visit
const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

/**
 * Tracks the start of a mock interview.
 * Returns the Firestore document ID to allow updates later (completion/score).
 */
export const trackInterviewStart = async (problem) => {
    try {
        const docRef = await addDoc(collection(db, 'telemetry'), {
            sessionId: SESSION_ID,
            problemId: problem?.id || 'unknown',
            problemTitle: problem?.title || 'Unknown Problem',
            type: problem?.type || 'N/A', // 'HLD' or 'LLD'
            startTime: serverTimestamp(),
            status: 'started',
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Telemetry Error (Start):", error);
        return null;
    }
};

/**
 * Tracks the completion of an interview with final results.
 */
export const trackInterviewComplete = async (telemetryId, stats) => {
    if (!telemetryId) return;

    try {
        const docRef = doc(db, 'telemetry', telemetryId);
        await updateDoc(docRef, {
            endTime: serverTimestamp(),
            status: 'completed',
            durationSeconds: Math.floor((Date.now() - stats.startTimeMs) / 1000),
            numTurns: stats.numTurns,
            overallScore: stats.overallScore,
            talkRatio: stats.talkRatio,
            avgResponseLength: stats.avgResponseLength
        });
    } catch (error) {
        console.error("Telemetry Error (Complete):", error);
    }
};

/**
 * Tracks navigation or other meaningful UI events.
 */
export const trackEvent = async (eventName, data = {}) => {
    try {
        await addDoc(collection(db, 'events'), {
            sessionId: SESSION_ID,
            event: eventName,
            ...data,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Telemetry Error (Event):", error);
    }
};
