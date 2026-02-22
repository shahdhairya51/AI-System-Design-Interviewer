/**
 * Speech-to-Text service using browser's Web Speech API
 * CC-6 FIX: Transcript accumulates across auto-restarts instead of resetting
 */

let recognition = null
let isListening = false
let accumulatedTranscript = '' // CC-6: Persist across auto-restarts

/**
 * Check if speech recognition is available
 */
export function isSpeechRecognitionSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}

/**
 * Start listening for speech input
 */
export function startListening({ onResult, onInterim, onEnd, onError }) {
    if (isListening) {
        stopListening()
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
        onError?.('Speech recognition not supported in this browser. Use Chrome or Edge for best results.')
        return false
    }

    // CC-6: Reset accumulated transcript on NEW listen session (not on auto-restart)
    accumulatedTranscript = ''

    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
                // CC-6: ACCUMULATE across auto-restarts, don't reset
                accumulatedTranscript += result[0].transcript + ' '
                onResult?.(accumulatedTranscript.trim())
            } else {
                interim += result[0].transcript
            }
        }
        if (interim) {
            // Show accumulated + current interim for better UX
            onInterim?.(accumulatedTranscript + interim)
        }
    }

    recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        if (event.error === 'no-speech' || event.error === 'aborted') {
            return // Silently handle
        }
        // Network errors can happen when mic is used — handle gracefully
        if (event.error === 'network') {
            console.warn('STT network error — will retry on next restart')
            return
        }
        onError?.(event.error)
    }

    recognition.onend = () => {
        // Auto-restart if we're still supposed to be listening
        if (isListening) {
            try {
                recognition.start()
            } catch (e) {
                // CC-6: Even on restart failure, don't lose transcript
                isListening = false
                onEnd?.()
            }
        } else {
            onEnd?.()
        }
    }

    try {
        recognition.start()
        isListening = true
        return true
    } catch (e) {
        console.error('Failed to start speech recognition:', e)
        onError?.(e.message)
        return false
    }
}

/**
 * Stop listening
 */
export function stopListening() {
    isListening = false
    if (recognition) {
        try {
            recognition.stop()
        } catch (e) {
            // Ignore
        }
        recognition = null
    }
}

/**
 * Get current accumulated transcript (CC-6: useful for reading state)
 */
export function getAccumulatedTranscript() {
    return accumulatedTranscript.trim()
}

/**
 * Clear accumulated transcript (call when message is sent)
 */
export function clearTranscript() {
    accumulatedTranscript = ''
}

/**
 * Check if currently listening
 */
export function getIsListening() {
    return isListening
}
