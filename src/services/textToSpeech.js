/**
 * Text-to-Speech service using browser's Speech Synthesis API
 * CC-8 FIX: Safety timeout prevents stuck TTS state
 */

let currentUtterance = null
let preferredVoice = null
let isInitialized = false
let safetyTimer = null // CC-8: Timeout failsafe

/**
 * Get all available voices
 */
export function getAvailableVoices() {
    return window.speechSynthesis.getVoices()
}

/**
 * Set a specific voice by URI
 */
export function setVoice(voiceURI) {
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.voiceURI === voiceURI || v.name === voiceURI)
    if (voice) {
        preferredVoice = voice
        return true
    }
    return false
}

/**
 * Initialize TTS and find the best available voice
 */
export function initTTS() {
    return new Promise((resolve) => {
        if (isInitialized) {
            resolve(true)
            return
        }

        const setVoice = () => {
            const voices = window.speechSynthesis.getVoices()
            if (voices.length === 0) return

            // Prefer high-quality English voices
            const preferred = [
                'Google UK English Male',
                'Google US English',
                'Microsoft David',
                'Microsoft Mark',
                'Daniel',
                'Alex',
                'Samantha',
            ]

            for (const name of preferred) {
                const found = voices.find(v => v.name.includes(name))
                if (found) {
                    preferredVoice = found
                    break
                }
            }

            if (!preferredVoice) {
                preferredVoice = voices.find(v => v.lang.startsWith('en')) || voices[0]
            }

            isInitialized = true
            resolve(true)
        }

        if (window.speechSynthesis.getVoices().length > 0) {
            setVoice()
        } else {
            window.speechSynthesis.onvoiceschanged = setVoice
            setTimeout(() => {
                setVoice()
                resolve(true)
            }, 1000)
        }
    })
}

/**
 * Speak text aloud
 * CC-8: Added safety timeout to prevent stuck TTS state
 */
export function speak(text, options = {}) {
    return new Promise((resolve) => {
        stop()

        if (!text || text.trim().length === 0) {
            resolve()
            return
        }

        // Clean text for speech (remove markdown formatting)
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/#{1,6}\s/g, '')
            .replace(/\n{2,}/g, '. ')
            .replace(/\n/g, ' ')
            .trim()

        if (cleanText.length === 0) {
            resolve()
            return
        }

        const utterance = new SpeechSynthesisUtterance(cleanText)

        if (preferredVoice) {
            utterance.voice = preferredVoice
        }

        utterance.rate = options.rate || 1.0
        utterance.pitch = options.pitch || 1.0
        utterance.volume = 1.0

        const cleanup = () => {
            currentUtterance = null
            if (safetyTimer) {
                clearTimeout(safetyTimer)
                safetyTimer = null
            }
        }

        utterance.onstart = () => {
            options.onStart?.()
        }

        utterance.onend = () => {
            cleanup()
            options.onEnd?.()
            resolve()
        }

        utterance.onerror = (event) => {
            cleanup()
            if (event.error === 'canceled' || event.error === 'interrupted') {
                resolve()
            } else {
                console.warn('TTS error:', event.error)
                options.onEnd?.() // CC-8: Always call onEnd to reset UI state
                resolve()
            }
        }

        currentUtterance = utterance
        window.speechSynthesis.speak(utterance)

        // CC-8: Safety timeout — if speech hasn't ended within expected time,
        // force-cancel to prevent UI getting stuck in "speaking" state.
        // Estimate: ~80ms per character at 1x speed, plus 5s buffer
        const estimatedDurationMs = Math.max(cleanText.length * 80, 3000) + 5000
        const maxTimeout = 60000 // Never wait more than 60 seconds
        const timeoutMs = Math.min(estimatedDurationMs, maxTimeout)

        safetyTimer = setTimeout(() => {
            if (currentUtterance) {
                console.warn(`TTS safety timeout fired after ${timeoutMs}ms — force-canceling stuck speech`)
                stop()
                options.onEnd?.()
                resolve()
            }
        }, timeoutMs)
    })
}

/**
 * Stop current speech
 */
export function stop() {
    if (safetyTimer) {
        clearTimeout(safetyTimer)
        safetyTimer = null
    }
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
    }
    currentUtterance = null
}

/**
 * Check if currently speaking
 */
export function isSpeaking() {
    return window.speechSynthesis.speaking
}

/**
 * Check if TTS is available
 */
export function isTTSSupported() {
    return 'speechSynthesis' in window
}
