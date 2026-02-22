/**
 * Video/Audio recording service using MediaRecorder API
 */

let mediaRecorder = null
let recordedChunks = []
let mediaStream = null

/**
 * Start recording video + audio from webcam
 * @returns {Promise<MediaStream>} The media stream (for video preview)
 */
export async function startRecording() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: { echoCancellation: true, noiseSuppression: true },
        })

        recordedChunks = []

        // Try to use webm, fallback to whatever is supported
        const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
        let selectedMime = ''
        for (const mt of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mt)) {
                selectedMime = mt
                break
            }
        }

        mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: selectedMime || undefined,
            videoBitsPerSecond: 1500000, // 1.5 Mbps
        })

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data)
            }
        }

        mediaRecorder.start(1000) // Collect data every second
        return mediaStream
    } catch (err) {
        console.error('Failed to start recording:', err)
        throw err
    }
}

/**
 * Stop recording and return the Blob
 * @returns {Promise<Blob>}
 */
export function stopRecording() {
    return new Promise((resolve) => {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            resolve(null)
            return
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'video/webm' })
            recordedChunks = []

            // Stop all tracks
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop())
                mediaStream = null
            }

            mediaRecorder = null
            resolve(blob)
        }

        mediaRecorder.stop()
    })
}

/**
 * Download recorded video
 * @param {Blob} blob - The video blob
 * @param {string} filename - File name
 */
export function downloadRecording(blob, filename = 'interview-recording') {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

/**
 * Check recording state
 */
export function isRecordingActive() {
    return mediaRecorder?.state === 'recording'
}

/**
 * Get the current media stream (for video preview)
 */
export function getMediaStream() {
    return mediaStream
}
