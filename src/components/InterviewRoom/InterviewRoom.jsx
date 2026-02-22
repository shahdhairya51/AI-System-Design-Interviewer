import { useState, useEffect, useRef, useCallback } from 'react'
import { INTERVIEW_PHASES, COMPANY_STYLES } from '../../data/questions'
import {
    initializeInterview,
    sendMessageToAI,
    sendTimesUpToAI,
    isAPIConfigured,
    isAPIHealthy,
    getInterviewProgress,
    getDesignState, // AI Interviewer 2.0
    getStateHistory,
    getCurrentCoverage
} from '../../services/aiEngine'
import { startListening, stopListening, clearTranscript, isSpeechRecognitionSupported } from '../../services/speechToText'
import { initTTS, speak, stop as stopTTS, isTTSSupported, getAvailableVoices, setVoice } from '../../services/textToSpeech'
import { startRecording, stopRecording, downloadRecording } from '../../services/recorder'
import { trackEvent } from '../../services/telemetry'
import './InterviewRoom.css'

const PHASE_TIME_RATIOS = {
    requirements: 0.16,
    'high-level': 0.33,
    'deep-dive': 0.30,
    tradeoffs: 0.14,
    wrapup: 0.07,
}

export default function InterviewRoom({ config, onFinish, onExit }) {
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [isMicActive, setIsMicActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [messages, setMessages] = useState([])
    const [userInput, setUserInput] = useState('')
    const [isAiThinking, setIsAiThinking] = useState(false)
    const [isAiSpeaking, setIsAiSpeaking] = useState(false)
    const [ThinkingState, setThinkingState] = useState('Thinking...') // 'Thinking...', 'Analyzing Code...', 'Reviewing Board...'
    const [showExitConfirm, setShowExitConfirm] = useState(false)
    const [interimText, setInterimText] = useState('')
    const [ttsEnabled, setTtsEnabled] = useState(true)
    const [recordingBlob, setRecordingBlob] = useState(null)
    const [videoStream, setVideoStream] = useState(null)

    // CC-11: Time's up state
    const [showTimesUp, setShowTimesUp] = useState(false)
    const timesUpHandledRef = useRef(false)

    // CC-14: Network status
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    // Right panel tabs
    const [activeTab, setActiveTab] = useState('whiteboard')
    const [codeContent, setCodeContent] = useState('// Write your code, API schemas, or class designs here\n\n')

    // Whiteboard state
    const [whiteboardTool, setWhiteboardTool] = useState('pen')
    const [penColor, setPenColor] = useState('#6c5ce7')

    // CC-7: Track if mic was active before TTS started
    const micWasActiveBeforeTTS = useRef(false)

    // CC-13: Track last sent phase to avoid duplicates
    const lastSentPhaseRef = useRef(null)

    // Smart Sync Refs
    const lastSentCodeLengthRef = useRef(0)
    const lastSentLineCountRef = useRef(0)

    const timerRef = useRef(null)
    const chatEndRef = useRef(null)
    const canvasRef = useRef(null)
    const videoRef = useRef(null)
    const linesRef = useRef([])
    const isDrawingRef = useRef(false)
    const currentLineRef = useRef(null)
    const canvasSizeRef = useRef({ w: 0, h: 0 })

    const totalSeconds = config.timeLimit * 60
    const currentPhase = INTERVIEW_PHASES[currentPhaseIndex]

    // AI Interviewer 2.0: Organic Progress
    const [organicProgress, setOrganicProgress] = useState(0)
    const progress = organicProgress

    const timeRemaining = totalSeconds - elapsedSeconds
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    // ─── CC-14: Network status listener ─────────────────────
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // ─── VOICE SELECTION ───────────────────────────────────
    const [voices, setVoices] = useState([])
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('')

    const handleVoiceChange = (e) => {
        const uri = e.target.value
        setSelectedVoiceURI(uri)
        setVoice(uri)
    }

    useEffect(() => {
        const load = () => {
            const available = getAvailableVoices()
            if (available.length > 0) {
                const en = available.filter(v => v.lang.startsWith('en'))
                setVoices(en.length ? en : available)
            }
        }
        load()
        window.speechSynthesis.onvoiceschanged = load
        return () => { window.speechSynthesis.onvoiceschanged = null }
    }, [])

    // ─── INITIALIZE AI + TTS ───────────────────────────────
    useEffect(() => {
        let cancelled = false
        async function init() {
            if (isTTSSupported()) await initTTS()
            setIsAiThinking(true)
            const greeting = await initializeInterview(config)
            if (cancelled) return
            if (greeting) {
                setMessages([{ role: 'ai', content: greeting, timestamp: Date.now() }])
                if (ttsEnabled) {
                    setIsAiSpeaking(true)
                    // CC-7: Mute mic during TTS
                    if (isMicActive) {
                        micWasActiveBeforeTTS.current = true
                        stopListening()
                        setIsMicActive(false)
                    }
                    await speak(greeting, {
                        onEnd: () => {
                            setIsAiSpeaking(false)
                            // CC-7: Resume mic after TTS
                            if (micWasActiveBeforeTTS.current) {
                                micWasActiveBeforeTTS.current = false
                                // Don't auto-resume — user can click mic again
                            }
                        }
                    })
                }
            } else {
                const fallback = `Welcome! I'm your ${config.companyData?.name || 'system design'} interviewer. We have ${config.timeLimit} minutes.\n\nLet's design: **${config.question?.title || 'the system from your JD'}**\n\n${config.question?.description || ''}\n\nWhat clarifying questions do you have?`
                setMessages([{ role: 'ai', content: fallback, timestamp: Date.now() }])
            }
            setIsAiThinking(false)
        }
        init()
        return () => { cancelled = true }
    }, []) // eslint-disable-line

    // ─── TIMER ─────────────────────────────────────────────
    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => {
                    if (prev >= totalSeconds) { clearInterval(timerRef.current); return totalSeconds }
                    return prev + 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [isPaused, totalSeconds])

    // ─── CC-11: Time's up detection ─────────────────────────
    useEffect(() => {
        if (elapsedSeconds >= totalSeconds && !timesUpHandledRef.current) {
            timesUpHandledRef.current = true
            setShowTimesUp(true)

            // Send a wrap-up message to the AI
            async function wrapUp() {
                const wrapUpMsg = await sendTimesUpToAI()
                if (wrapUpMsg) {
                    setMessages(prev => [...prev, { role: 'ai', content: wrapUpMsg, timestamp: Date.now() }])
                    if (ttsEnabled) {
                        setIsAiSpeaking(true)
                        await speak(wrapUpMsg, { onEnd: () => setIsAiSpeaking(false) })
                    }
                }
            }
            wrapUp()
        }
    }, [elapsedSeconds, totalSeconds, ttsEnabled])

    // AI Interviewer 2.0: Organic Phase Steering
    useEffect(() => {
        const p = getInterviewProgress();
        setOrganicProgress(p);

        // Map progress to phases (Custom mapping for organic feel)
        if (p > 90) setCurrentPhaseIndex(4); // Wrap-up
        else if (p > 75) setCurrentPhaseIndex(3); // Trade-offs
        else if (p > 45) setCurrentPhaseIndex(2); // Deep Dive
        else if (p > 20) setCurrentPhaseIndex(1); // HLD
        else setCurrentPhaseIndex(0); // Requirements
    }, [messages]) // Re-calculate after every message

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isAiThinking])

    // Video stream → element
    useEffect(() => {
        if (videoRef.current && videoStream) videoRef.current.srcObject = videoStream
    }, [videoStream])

    // ─── SEND MESSAGE ──────────────────────────────────────
    const sendMessage = useCallback(async (text) => {
        const messageText = text || userInput.trim()
        if (!messageText) return

        // CC-12: Prevent sending while AI is thinking
        if (isAiThinking) return

        // CC-14: Check network before sending
        if (!navigator.onLine) {
            setMessages(prev => [...prev, {
                role: 'system',
                content: 'You appear to be offline. Please check your internet connection and try again.',
                timestamp: Date.now()
            }])
            return
        }

        stopTTS()
        setIsAiSpeaking(false)

        // CC-7: Stop mic before AI finishes speaking
        const wasMicOn = isMicActive
        if (isMicActive) {
            stopListening()
            setIsMicActive(false)
        }

        setMessages(prev => [...prev, { role: 'user', content: messageText, timestamp: Date.now() }])
        setUserInput('')
        setInterimText('')
        clearTranscript() // CC-6: Clear accumulated transcript after sending
        setIsAiThinking(true)
        setThinkingState('Thinking...') // Default state

        try {
            // Smart Sync: Check if code changed significantly (>10 chars difference or grew)
            let sentCodeContent = null
            const cleanCode = codeContent.trim()
            if (cleanCode.length > 20 && Math.abs(cleanCode.length - lastSentCodeLengthRef.current) > 10) {
                sentCodeContent = codeContent
                lastSentCodeLengthRef.current = cleanCode.length
                setThinkingState('Reviewing your code...')
            }

            // Smart Sync: Check if whiteboard changed (line count diff)
            let canvasImageBase64 = null
            let hasDrawing = false
            const currentLineCount = linesRef.current.length

            // Only capture if we have lines AND they changed
            if (currentLineCount > 0 && currentLineCount !== lastSentLineCountRef.current && canvasRef.current) {
                try {
                    const dataUrl = canvasRef.current.toDataURL('image/png')
                    canvasImageBase64 = dataUrl.split(',')[1]
                    hasDrawing = true
                    lastSentLineCountRef.current = currentLineCount
                    setThinkingState('Analyzing your diagram...')
                } catch (e) {
                    console.warn('Could not capture canvas:', e)
                }
            } else if (currentLineCount > 0) {
                // We have a drawing but it didn't change, just flag it as present
                hasDrawing = true
            }

            // CC-13: Only send phase name if it changed since last message
            const phaseId = currentPhase.id
            const isNewPhase = lastSentPhaseRef.current !== phaseId
            lastSentPhaseRef.current = phaseId

            let response = await sendMessageToAI(messageText, {
                phaseId: isNewPhase ? phaseId : phaseId,
                messageCount: messages.length,
                timeRemaining: Math.floor(timeRemaining / 60),
                codeContent: sentCodeContent,
                canvasImageBase64,
                hasDrawing,
            })

            // AI Interviewer 2.0: Check for [NEXT_PHASE] signal
            if (response.includes('[NEXT_PHASE]')) {
                // Strip the tag
                response = response.replace(/\[NEXT_PHASE\]/g, '').trim()

                // Trigger phase transition if not already at the end
                if (currentPhaseIndex < INTERVIEW_PHASES.length - 1) {
                    console.log('AI triggered phase transition')
                    setCurrentPhaseIndex(prev => prev + 1)
                }
            }

            setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: Date.now() }])
            setIsAiThinking(false)

            if (ttsEnabled) {
                setIsAiSpeaking(true)
                // CC-7: Don't resume mic until TTS finishes
                await speak(response, {
                    onEnd: () => {
                        setIsAiSpeaking(false)
                        // CC-7: Resume mic after AI finishes speaking (if it was on before)
                        if (wasMicOn) {
                            const started = startListening({
                                onResult: (t) => { setUserInput(t); setInterimText('') },
                                onInterim: (i) => setInterimText(i),
                                onEnd: () => setIsMicActive(false),
                                onError: () => setIsMicActive(false),
                            })
                            setIsMicActive(started)
                        }
                    }
                })
            } else {
                // CC-7: If TTS is off, resume mic immediately
                if (wasMicOn) {
                    const started = startListening({
                        onResult: (t) => { setUserInput(t); setInterimText('') },
                        onInterim: (i) => setInterimText(i),
                        onEnd: () => setIsMicActive(false),
                        onError: () => setIsMicActive(false),
                    })
                    setIsMicActive(started)
                }
            }
        } catch (err) {
            console.error('AI response error:', err)
            setIsAiThinking(false)
            // CC-7: Resume mic on error too
            if (wasMicOn) {
                const started = startListening({
                    onResult: (t) => { setUserInput(t); setInterimText('') },
                    onInterim: (i) => setInterimText(i),
                    onEnd: () => setIsMicActive(false),
                    onError: () => setIsMicActive(false),
                })
                setIsMicActive(started)
            }
        }
    }, [userInput, currentPhase, messages.length, timeRemaining, ttsEnabled, codeContent, isAiThinking, isMicActive, currentPhaseIndex])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    // ─── MIC TOGGLE ────────────────────────────────────────
    const toggleMic = useCallback(() => {
        // CC-7: Don't start mic while AI is speaking
        if (isAiSpeaking) {
            stopTTS()
            setIsAiSpeaking(false)
        }

        if (isMicActive) {
            stopListening()
            setIsMicActive(false)
            if (userInput.trim()) sendMessage(userInput.trim())
        } else {
            clearTranscript() // CC-6: Clear before starting new listen
            const started = startListening({
                onResult: (t) => { setUserInput(t); setInterimText('') },
                onInterim: (i) => setInterimText(i),
                onEnd: () => setIsMicActive(false),
                onError: () => setIsMicActive(false),
            })
            setIsMicActive(started)
        }
    }, [isMicActive, userInput, sendMessage, isAiSpeaking])

    // ─── RECORDING ─────────────────────────────────────────
    const toggleRecording = useCallback(async () => {
        if (isRecording) {
            const blob = await stopRecording()
            setRecordingBlob(blob)
            setIsRecording(false)
            setVideoStream(null)
        } else {
            try {
                const stream = await startRecording()
                setVideoStream(stream)
                setIsRecording(true)
            } catch (err) { console.error('Recording failed:', err) }
        }
    }, [isRecording])

    // ─── WHITEBOARD ───────────────────────────────────────
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const w = canvas.width
        const h = canvas.height
        ctx.clearRect(0, 0, w, h)

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'
        ctx.lineWidth = 1
        for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
        for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

        // Watermark
        if (linesRef.current.length === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.06)'
            ctx.font = '16px Inter, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Draw your system architecture here', w / 2, h / 2 - 10)
            ctx.font = '12px Inter, sans-serif'
            ctx.fillText('Use boxes, arrows, and labels to show components', w / 2, h / 2 + 15)
            ctx.textAlign = 'start'
        }

        // Lines
        const allLines = [...linesRef.current]
        if (currentLineRef.current) allLines.push(currentLineRef.current)

        allLines.forEach(line => {
            if (!line.points || line.points.length < 2) return
            ctx.beginPath()
            ctx.strokeStyle = line.color
            ctx.lineWidth = line.width
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.globalCompositeOperation = 'source-over'
            ctx.moveTo(line.points[0].x, line.points[0].y)
            for (let i = 1; i < line.points.length; i++) {
                const p0 = line.points[i - 1]
                const p1 = line.points[i]
                const mx = (p0.x + p1.x) / 2
                const my = (p0.y + p1.y) / 2
                ctx.quadraticCurveTo(p0.x, p0.y, mx, my)
            }
            ctx.stroke()
        })
    }, [])

    // Setup canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const container = canvas.parentElement

        const resize = () => {
            const rect = container.getBoundingClientRect()
            if (rect.width === canvasSizeRef.current.w && rect.height === canvasSizeRef.current.h) return
            canvasSizeRef.current = { w: rect.width, h: rect.height }
            canvas.width = rect.width
            canvas.height = rect.height
            renderCanvas()
        }

        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(container)
        return () => observer.disconnect()
    }, [renderCanvas])

    const getCanvasPos = (e) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
        const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
        return { x: clientX - rect.left, y: clientY - rect.top }
    }

    const handleCanvasDown = (e) => {
        e.preventDefault()
        const pos = getCanvasPos(e)
        isDrawingRef.current = true
        currentLineRef.current = {
            points: [pos],
            color: whiteboardTool === 'eraser' ? '#0a0a0f' : penColor,
            width: whiteboardTool === 'eraser' ? 24 : 2.5,
        }
    }

    const handleCanvasMove = (e) => {
        if (!isDrawingRef.current || !currentLineRef.current) return
        e.preventDefault()
        const pos = getCanvasPos(e)
        currentLineRef.current.points.push(pos)
        renderCanvas()
    }

    const handleCanvasUp = () => {
        if (currentLineRef.current && currentLineRef.current.points.length > 1) {
            linesRef.current = [...linesRef.current, { ...currentLineRef.current }]
        }
        isDrawingRef.current = false
        currentLineRef.current = null
        renderCanvas()
    }

    const undoLine = () => {
        linesRef.current = linesRef.current.slice(0, -1)
        renderCanvas()
    }

    const clearCanvas = () => {
        linesRef.current = []
        currentLineRef.current = null
        renderCanvas()
    }

    // ─── FINISH ────────────────────────────────────────────
    const handleFinish = useCallback(async () => {
        clearInterval(timerRef.current)
        stopListening()
        stopTTS()
        let blob = recordingBlob
        if (isRecording) {
            blob = await stopRecording()
            setIsRecording(false)
        }

        const finalResult = {
            messages,
            duration: elapsedSeconds,
            canvasLines: linesRef.current,
            codeContent,
            recordingBlob: blob,
            designState: getDesignState(),
            stateHistory: getStateHistory(),
            coverageMap: getCurrentCoverage()
        }

        // AI Interviewer 2.0: Persistence Support
        sessionStorage.setItem('last_interview_result', JSON.stringify(finalResult))

        onFinish(finalResult)
    }, [messages, elapsedSeconds, recordingBlob, isRecording, onFinish, codeContent])

    const confirmExit = () => {
        if (config.telemetryId) {
            trackEvent('interview_exit', {
                telemetryId: config.telemetryId,
                elapsedSeconds,
                phase: currentPhase.name
            });
        }
        onExit()
    }

    const isTimeWarning = timeRemaining <= 120 && timeRemaining > 60
    const isTimeDanger = timeRemaining <= 60
    const apiLive = isAPIConfigured() && isAPIHealthy() // CC-15: Check actual health

    // ─── RENDER ────────────────────────────────────────────
    return (
        <div className="interview-room">
            {/* Header */}
            <header className="ir-header">
                <div className="ir-header-left">
                    <button className="btn btn-ghost" onClick={() => setShowExitConfirm(true)}>×</button>
                    <div className="ir-problem-name">{config.question?.title || 'JD-Based Interview'}</div>
                    <span className="badge badge-accent">{config.type.toUpperCase()}</span>
                    {apiLive && <span className="badge badge-success" style={{ fontSize: '10px' }}>AI Live</span>}
                    {isAPIConfigured() && !isAPIHealthy() && <span className="badge" style={{ fontSize: '10px', background: 'var(--error)', color: '#fff' }}>AI Error</span>}
                    {!isOnline && <span className="badge" style={{ fontSize: '10px', background: 'var(--warning)', color: '#000' }}>Offline</span>}
                </div>

                <div className="ir-header-center">
                    <div className="ir-phase-indicator">
                        {INTERVIEW_PHASES.map((phase, i) => (
                            <div key={phase.id} className={`ir-phase-dot ${i === currentPhaseIndex ? 'active' : ''} ${i < currentPhaseIndex ? 'completed' : ''}`} title={phase.name}>
                                <span className="ir-phase-dot-icon">{phase.icon}</span>
                                {i === currentPhaseIndex && <span className="ir-phase-dot-name">{phase.name}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ir-header-right">
                    <div className={`ir-timer ${isTimeWarning ? 'warning' : ''} ${isTimeDanger ? 'danger' : ''}`}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <button className={`btn btn-icon ${isRecording ? 'ir-rec-active' : 'btn-secondary'}`} onClick={toggleRecording} title={isRecording ? 'Stop Recording' : 'Record'}>
                        {isRecording ? '🔴' : '⏺️'}
                    </button>
                    {voices.length > 0 && (
                        <select
                            className="ir-voice-select"
                            value={selectedVoiceURI}
                            onChange={handleVoiceChange}
                            title="Select AI Voice"
                        >
                            {voices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>
                                    {v.name.replace(/Google |Microsoft /, '')}
                                </option>
                            ))}
                        </select>
                    )}
                    <button className={`btn btn-icon ${ttsEnabled ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => { setTtsEnabled(!ttsEnabled); if (ttsEnabled) stopTTS() }} title={ttsEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}>
                        {ttsEnabled ? '🔊' : '🔇'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setIsPaused(!isPaused)}>{isPaused ? '▶️' : '⏸️'}</button>
                    <button className="btn btn-primary" onClick={handleFinish}>End & Score</button>
                </div>
            </header>

            <div className="ir-progress-bar">
                <div className="ir-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>

            {/* Main Content */}
            <div className="ir-content">
                {/* Left — Chat */}
                <div className="ir-chat-panel">
                    <div className="ir-chat-header">
                        <div className="ir-chat-header-row">
                            <span className="ir-chat-phase-badge">{currentPhase.icon} {currentPhase.name}</span>
                            {isAiSpeaking && <span className="ir-speaking-badge">Speaking...</span>}
                        </div>
                        <span className="ir-chat-phase-hint">{currentPhase.description}</span>
                    </div>

                    {videoStream && (
                        <div className="ir-video-preview">
                            <video ref={videoRef} autoPlay muted playsInline className="ir-video-el" />
                            <span className="ir-video-label">REC</span>
                        </div>
                    )}

                    <div className="ir-chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`ir-message ${msg.role}`}>
                                <div className="ir-message-avatar">{msg.role === 'ai' ? 'AI' : msg.role === 'system' ? '!' : 'You'}</div>
                                <div className="ir-message-content">
                                    <div className="ir-message-name">
                                        {msg.role === 'ai' ? 'Interviewer' : msg.role === 'system' ? 'System' : 'You'}
                                    </div>
                                    <div className={`ir-message-text ${msg.role === 'system' ? 'ir-system-msg' : ''}`}>{formatMessage(msg.content)}</div>
                                </div>
                            </div>
                        ))}
                        {isAiThinking && (
                            <div className="ir-message ai">
                                <div className="ir-message-avatar">AI</div>
                                <div className="ir-message-content">
                                    <div className="ir-message-name">Interviewer</div>
                                    <div className="ir-thinking-indicator">
                                        <span className="ir-thinking-text">{ThinkingState}</span>
                                        <div className="ir-thinking-dots"><span /><span /><span /></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="ir-chat-input-area">
                        {/* CC-14: Offline warning */}
                        {!isOnline && (
                            <div className="ir-offline-banner">
                                You're offline. Reconnect to continue with AI interviewer.
                            </div>
                        )}
                        {(interimText || isMicActive) && (
                            <div className="ir-interim-text">
                                {isMicActive && <span className="ir-mic-pulse-dot" />}
                                {interimText || (isMicActive ? 'Listening...' : '')}
                            </div>
                        )}
                        <div className="ir-chat-input-row">
                            {isSpeechRecognitionSupported() && (
                                <button className={`btn btn-icon ${isMicActive ? 'ir-mic-active' : 'btn-secondary'}`} onClick={toggleMic} title={isMicActive ? 'Stop & Send' : 'Speak'} disabled={isAiThinking}>
                                    {isMicActive ? '🎙️' : '🎤'}
                                </button>
                            )}
                            <textarea
                                className="input ir-chat-input"
                                placeholder={isAiThinking ? 'Waiting for interviewer...' : isMicActive ? 'Speaking...' : 'Type your response...'}
                                value={userInput}
                                onChange={e => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={2}
                                disabled={isAiThinking}
                            />
                            <button
                                className="btn btn-primary btn-icon ir-send-btn"
                                onClick={() => sendMessage()}
                                disabled={!userInput.trim() || isAiThinking}
                                title={isAiThinking ? 'Wait for interviewer to respond' : 'Send'}
                            >➤</button>
                        </div>
                    </div>
                </div>

                {/* Right — Whiteboard / Code */}
                <div className="ir-right-panel">
                    <div className="ir-tabs">
                        <button className={`ir-tab ${activeTab === 'whiteboard' ? 'active' : ''}`} onClick={() => setActiveTab('whiteboard')}>
                            Whiteboard
                        </button>
                        <button className={`ir-tab ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                            Code Editor
                        </button>
                        <div className="ir-tab-actions">
                            {activeTab === 'whiteboard' && (
                                <>
                                    <button className={`btn btn-icon btn-ghost btn-sm ${whiteboardTool === 'pen' ? 'active' : ''}`} onClick={() => setWhiteboardTool('pen')} title="Pen">Pen</button>
                                    <button className={`btn btn-icon btn-ghost btn-sm ${whiteboardTool === 'eraser' ? 'active' : ''}`} onClick={() => setWhiteboardTool('eraser')} title="Eraser">Ers</button>
                                    <div className="ir-wb-colors">
                                        {['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#0984e3', '#ffffff'].map(c => (
                                            <button key={c} className={`ir-wb-color ${penColor === c ? 'active' : ''}`} style={{ background: c }} onClick={() => { setPenColor(c); setWhiteboardTool('pen') }} />
                                        ))}
                                    </div>
                                    <button className="btn btn-ghost btn-icon btn-sm" onClick={undoLine} title="Undo">Undo</button>
                                    <button className="btn btn-ghost btn-icon btn-sm" onClick={clearCanvas} title="Clear">Clear</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Whiteboard Canvas */}
                    <div className="ir-right-content" style={{ display: activeTab === 'whiteboard' ? 'block' : 'none' }}>
                        <div className="ir-wb-canvas-container">
                            <canvas
                                ref={canvasRef}
                                className="ir-wb-canvas"
                                onMouseDown={handleCanvasDown}
                                onMouseMove={handleCanvasMove}
                                onMouseUp={handleCanvasUp}
                                onMouseLeave={handleCanvasUp}
                                onTouchStart={handleCanvasDown}
                                onTouchMove={handleCanvasMove}
                                onTouchEnd={handleCanvasUp}
                            />
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="ir-right-content" style={{ display: activeTab === 'code' ? 'flex' : 'none' }}>
                        <textarea
                            className="ir-code-editor"
                            value={codeContent}
                            onChange={e => setCodeContent(e.target.value)}
                            placeholder={`// Write your code here\n// API schemas, class designs, data models\n// The AI interviewer can see your code\n\nclass UserService {\n  constructor(db, cache) {\n    this.db = db;\n    this.cache = cache;\n  }\n\n  async getUser(id) {\n    // Check cache first\n    const cached = await this.cache.get(id);\n    if (cached) return cached;\n    \n    const user = await this.db.findById(id);\n    await this.cache.set(id, user, TTL);\n    return user;\n  }\n}`}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>

            {/* CC-11: Time's Up Overlay */}
            {showTimesUp && (
                <div className="ir-modal-overlay" onClick={() => setShowTimesUp(false)}>
                    <div className="ir-modal" onClick={e => e.stopPropagation()}>
                        <h3>Time's Up!</h3>
                        <p>Your interview time has ended. You can end and get your score, or continue practicing.</p>
                        <div className="ir-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowTimesUp(false)}>Continue Practicing</button>
                            <button className="btn btn-primary" onClick={handleFinish}>End & Score</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Exit Confirm */}
            {showExitConfirm && (
                <div className="ir-modal-overlay" onClick={() => setShowExitConfirm(false)}>
                    <div className="ir-modal" onClick={e => e.stopPropagation()}>
                        <h3>Leave Interview?</h3>
                        <p>Your progress and conversation will be lost.</p>
                        <div className="ir-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowExitConfirm(false)}>Continue</button>
                            <button className="btn btn-primary" onClick={confirmExit}>Leave</button>
                        </div>
                    </div>
                </div>
            )}

            {isPaused && (
                <div className="ir-pause-overlay" onClick={() => setIsPaused(false)}>
                    <div className="ir-pause-content">
                        <span className="ir-pause-icon">||</span>
                        <h2>Interview Paused</h2>
                        <p>Click anywhere to resume</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function formatMessage(text) {
    if (!text) return ''
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return part
    })
}
