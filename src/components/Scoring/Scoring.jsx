import { useState, useEffect, useMemo, useRef } from 'react'
import { INTERVIEW_PHASES } from '../../data/questions'
import { generateAIScoring } from '../../services/aiEngine'
import { downloadRecording } from '../../services/recorder'
import { storageAdapter } from '../../services/storageAdapter'
import { getProblemKnowledge } from '../../data/problemKnowledge'
import { trackInterviewComplete } from '../../services/telemetry'
import './Scoring.css'

const SCORING_DIMENSIONS = [
    { id: 'problem-navigation', name: 'Problem Navigation', weight: 0.15, description: 'Clarifying requirements, asking the right questions, scoping correctly' },
    { id: 'solution-design', name: 'Solution Design', weight: 0.20, description: 'Architecture quality, component choices, data flow design' },
    { id: 'technical-depth', name: 'Technical Depth', weight: 0.20, description: 'Deep knowledge of databases, caching, messaging, distributed systems' },
    { id: 'tradeoff-analysis', name: 'Trade-off Analysis', weight: 0.15, description: 'Articulating pros/cons, justifying choices, understanding implications' },
    { id: 'coachability', name: 'Coachability', weight: 0.15, description: 'Responding to feedback, fixing math errors, resolving contradictions' },
    { id: 'communication', name: 'Communication', weight: 0.15, description: 'Clarity, structured thinking, confidence' },
]

const SOFT_SKILLS = [
    { id: 'clarity', name: 'Communication Clarity' },
    { id: 'structure', name: 'Structure & Organization' },
    { id: 'pressure', name: 'Handling Pressure' },
    { id: 'listening', name: 'Active Listening' },
    { id: 'confidence', name: 'Confidence Level' },
]

export default function Scoring({ result, config, onNewInterview, onHome }) {
    const [isLoading, setIsLoading] = useState(true)
    const [aiScores, setAiScores] = useState(null)
    const [revealedIndex, setRevealedIndex] = useState(-1)
    const telemetryLoggedRef = useRef(false)

    // AI Interviewer 2.0: Persistence Support
    const [storedResult, setStoredResult] = useState(null)
    const activeResult = result || storedResult

    // Sync result to sessionStorage to survive refresh
    useEffect(() => {
        if (result) {
            try {
                const persistable = {
                    messages: result.messages,
                    duration: result.duration,
                    coverageMap: result.coverageMap,
                    stateHistory: result.stateHistory,
                    canvasLines: result.canvasLines?.length || 0,
                    // Intentionally exclude recordingBlob — not serializable
                }
                sessionStorage.setItem('last_interview_result', JSON.stringify(persistable))
            } catch (e) {
                console.warn('Could not persist result to sessionStorage:', e)
            }
        } else {
            try {
                const saved = sessionStorage.getItem('last_interview_result')
                if (saved) setStoredResult(JSON.parse(saved))
            } catch (e) {
                console.warn('Could not restore result from sessionStorage:', e)
            }
        }
    }, [result])

    // Fetch AI scoring
    useEffect(() => {
        if (!activeResult) return
        let cancelled = false
        async function fetchScores() {
            setIsLoading(true)
            try {
                const scoringTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Scoring timeout')), 30000)
                )
                const scores = await Promise.race([
                    generateAIScoring(activeResult?.messages || [], config),
                    scoringTimeout
                ])

                if (!cancelled && scores) {
                    setAiScores(scores)

                    // Log Telemetry only once
                    if (config.telemetryId && !telemetryLoggedRef.current) {
                        trackInterviewComplete(config.telemetryId, {
                            startTimeMs: config.startTimeMs,
                            numTurns: (activeResult.messages || []).length,
                            overallScore: scores.overallScore,
                            talkRatio: activeResult.talkRatio || 0,
                            avgResponseLength: activeResult.avgResponseLength || 0
                        });
                        telemetryLoggedRef.current = true;
                    }
                }
            } catch (err) {
                console.error('Scoring error:', err)
                // Fallback happens automatically via useMemo logic
            }
            if (!cancelled) setIsLoading(false)
        }
        fetchScores()
        return () => { cancelled = true }
    }, [activeResult, config])

    // Generate scores from AI response or fallback
    const scores = useMemo(() => {
        if (aiScores?.dimensions) {
            return SCORING_DIMENSIONS.map(meta => {
                const aiDim = aiScores.dimensions.find(d => d.id === meta.id)
                return aiDim
                    ? { ...meta, ...aiDim, score: Math.min(10, Math.max(1, aiDim.score)) }
                    : { ...meta, score: 0, feedback: 'Not evaluated in this session.' }
            })
        }

        // Fallback scoring
        const messageCount = activeResult?.messages?.length || 0
        const userMessages = activeResult?.messages?.filter(m => m.role === 'user')?.length || 0
        const totalWords = activeResult?.messages
            ?.filter(m => m.role === 'user')
            ?.reduce((sum, m) => sum + m.content.split(/\s+/).length, 0) || 0

        return SCORING_DIMENSIONS.map(dim => {
            const base = 5 + Math.random() * 3
            const boost = Math.min(userMessages * 0.3, 2)
            const wordBoost = Math.min(totalWords * 0.005, 1)
            const score = Math.min(10, Math.max(3, base + boost + wordBoost))
            return { ...dim, score: Math.round(score * 10) / 10, feedback: generateFallbackFeedback(dim.id, score) }
        }).sort((a, b) => (b.weight || 0) - (a.weight || 0))
    }, [aiScores, activeResult])

    const softScores = useMemo(() => {
        if (aiScores?.softSkills) {
            return aiScores.softSkills.map(skill => {
                const meta = SOFT_SKILLS.find(s => s.id === skill.id)
                return { ...meta, ...skill, score: Math.min(10, Math.max(1, skill.score)) }
            })
        }
        return SOFT_SKILLS.map(skill => ({ ...skill, score: Math.round((5 + Math.random() * 4) * 10) / 10 }))
    }, [aiScores])

    const overallScore = useMemo(() => {
        const weightedSum = scores.reduce((sum, s) => {
            const isLLD = config?.type === 'lld'
            const meta = SCORING_DIMENSIONS.find(d => d.id === s.id)
            // Phase 11: Dynamic Weighting — Prioritize LLD-specific dimensions for LLD
            let weight = meta?.weight || 0.166
            if (isLLD) {
                if (s.id === 'technical-depth') weight = 0.25
                if (s.id === 'solution-design') weight = 0.25
                if (s.id === 'problem-navigation') weight = 0.10
                if (s.id === 'tradeoff-analysis') weight = 0.15
            }
            return sum + s.score * weight
        }, 0)
        return Math.round(weightedSum * 10) / 10
    }, [scores, config])

    const duration = activeResult?.duration || 0
    const durationMin = Math.floor(duration / 60)
    const durationSec = duration % 60

    // Phase 10.4: Pace Analysis & Behavioral Metrics
    const behavioralStats = useMemo(() => {
        if (!activeResult?.messages) return null
        const userMsgs = activeResult.messages.filter(m => m.role === 'user')
        const aiMsgs = activeResult.messages.filter(m => m.role === 'ai')

        const userWords = userMsgs.reduce((s, m) => s + m.content.split(/\s+/).length, 0)
        const aiWords = aiMsgs.reduce((s, m) => s + m.content.split(/\s+/).length, 0)
        const totalWords = userWords + aiWords

        // Find "Peak" moment (Turn with most decisions)
        let peakTurn = 1
        let maxDensity = 0
        activeResult.stateHistory?.forEach((e, i) => {
            const density = (e.extractionResult?.newDecisions?.length || 0) + (e.extractionResult?.contradictions?.length || 0)
            if (density > maxDensity) {
                maxDensity = density
                peakTurn = i + 1
            }
        })

        return {
            talkRatio: totalWords > 0 ? (userWords / totalWords) * 100 : 0,
            avgResponseWords: userMsgs.length > 0 ? userWords / userMsgs.length : 0,
            engagementScore: Math.min(10, (userMsgs.length / 10) * 5 + (userWords / 500) * 5),
            peakTurn
        }
    }, [activeResult])

    // Phase 10.2: Gap Analysis Data
    const gaps = useMemo(() => {
        if (!activeResult?.coverageMap || !config?.questionId) return null
        const knowledge = getProblemKnowledge(config.questionId)
        if (!knowledge) return null

        const isLLD = config.type === 'lld'
        const missing = []

        // Dynamic HLD Mapping: Map generic areas to specific Deep Dive topics
        if (!isLLD) {
            const hldAreas = {
                highLevelArchitecture: { label: 'Overall Architecture', keywords: ['architecture', 'components', 'key components', 'flow'] },
                scalability: { label: 'Scalability', keywords: ['scalability', 'scale', 'load', 'sharding', 'partitioning'] },
                security: { label: 'Security & Isolation', keywords: ['security', 'isolation', 'auth', 'protection', 'policy'] },
                failureHandling: { label: 'Reliability', keywords: ['failure', 'reliability', 'fault', 'availability', 'redundancy'] },
                apiDesign: { label: 'API & Contract Design', keywords: ['api', 'contract', 'endpoint', 'payload'] },
                cachingStrategy: { label: 'Caching Strategy', keywords: ['caching', 'cdn', 'cache', 'redis', 'memcached'] },
                databaseDesign: { label: 'Data Storage', keywords: ['database', 'storage', 'data store', 'relational', 'nosql', 'db'] }
            }

            Object.entries(hldAreas).forEach(([key, meta]) => {
                const score = activeResult.coverageMap[key] || 0
                if (score < 1.5) {
                    // Phase 11: Robust Semantic Mapping
                    const deepDiveKey = Object.keys(knowledge.deepDive || {}).find(k =>
                        meta.keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase()))
                    )
                    const label = deepDiveKey ? `${meta.label} (${deepDiveKey})` : meta.label
                    missing.push({ label, severity: score < 0.5 ? 'High' : 'Medium' })
                }
            })
        } else {
            // LLD Specific Gaps with mapping
            const lldAreas = {
                'technical-depth': { label: 'Thread Safety & Low-level detail', keywords: ['thread', 'safety', 'concurrency', 'lock', 'atomic'] },
                'solution-design': { label: 'Class Hierarchy & Interfaces', keywords: ['class', 'interface', 'hierarchy', 'solid', 'pattern', 'design'] },
                concurrency: { label: 'Multi-threading & Deadlocks', keywords: ['thread', 'deadlock', 'concurrency', 'race', 'sync'] },
                'data-structures': { label: 'Algorithm & Data Structure implementation', keywords: ['algorithm', 'structure', 'complexity', 'array', 'list', 'map', 'tree'] }
            }

            Object.entries(lldAreas).forEach(([key, meta]) => {
                const score = activeResult.coverageMap[key] || 0
                if (score < 1.5) {
                    const deepDiveKey = Object.keys(knowledge.deepDive || {}).find(k =>
                        meta.keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase()))
                    )
                    const label = deepDiveKey ? `${meta.label} (${deepDiveKey})` : meta.label
                    missing.push({ label, severity: score < 0.5 ? 'High' : 'Medium' })
                }
            })

            // Suggest specific LLD extensions if technical depth is low
            if (activeResult.coverageMap['technical-depth'] < 1.5 && knowledge.extensions) {
                missing.push({ label: `Consider: ${knowledge.extensions[0]}`, severity: 'Medium' })
            }
        }

        return missing
    }, [activeResult, config])

    // Reveal animation
    useEffect(() => {
        if (isLoading) return
        if (revealedIndex < scores.length) {
            const timer = setTimeout(() => setRevealedIndex(prev => prev + 1), 300)
            return () => clearTimeout(timer)
        }
    }, [revealedIndex, scores.length, isLoading])

    // Auto-save result when score is available
    const hasSaved = useRef(false)
    const { currentUser } = useAuth()

    useEffect(() => {
        if (overallScore > 0 && aiScores && !hasSaved.current) {
            hasSaved.current = true
            const uid = currentUser?.uid || 'guest'
            const record = {
                date: new Date().toISOString(),
                type: config?.type || 'system-design',
                topic: config?.question?.title || 'JD-Based',
                score: overallScore,
                verdict: aiScores.overallVerdict,
                strengths: aiScores.strengths,
                improvements: aiScores.improvements
            }
            storageAdapter.saveInterviewResult(uid, record)
        }
    }, [overallScore, aiScores, config, currentUser])

    const getScoreColor = (score) => {
        if (score >= 8) return 'var(--success)'
        if (score >= 6) return 'var(--accent-2)'
        if (score >= 4) return 'var(--warning)'
        return 'var(--error)'
    }

    const getScoreLabel = (score) => {
        if (score >= 9) return 'Exceptional'
        if (score >= 8) return 'Strong Hire'
        if (score >= 7.5) return 'Hire'
        if (score >= 6.5) return 'Lean Hire'
        if (score >= 5.5) return 'Borderline'
        if (score >= 4.5) return 'Needs Improvement'
        return 'Below Bar'
    }

    const downloadTranscript = () => {
        const lines = []
        lines.push(`# Interview Transcript`)
        lines.push(`**Problem:** ${config?.question?.title || 'JD-Based'}`)
        lines.push(`**Type:** ${config?.type?.toUpperCase()}`)
        lines.push(`**Company Style:** ${config?.companyData?.name}`)
        lines.push(`**Duration:** ${durationMin}m ${durationSec}s`)
        lines.push(`**Overall Score:** ${overallScore}/10`)
        lines.push(`\n---\n`)

        activeResult?.messages?.forEach(m => {
            const role = m.role === 'ai' ? '**Interviewer**' : m.role === 'user' ? '**Candidate**' : '**System**'
            lines.push(`${role}: ${m.content}\n`)
        })

        if (aiScores?.overallVerdict) {
            lines.push(`\n---\n## AI Verdict\n${aiScores.overallVerdict}`)
        }

        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `interview-transcript-${Date.now()}.md`
        a.click()
        // CC-9: Fix revoke delay
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    const handleDownloadVideo = () => {
        if (activeResult?.recordingBlob) {
            downloadRecording(activeResult.recordingBlob, `interview-${config?.question?.id || 'session'}`)
        }
    }

    if (isLoading) {
        return (
            <div className="scoring">
                <header className="scoring-header">
                    <div className="container">
                        <div className="scoring-nav">
                            <div style={{ width: 80 }} />
                            <div className="landing-logo">
                                <span className="landing-logo-icon">◆</span>
                                <span className="landing-logo-text">DesignDrill</span>
                            </div>
                            <div style={{ width: 80 }} />
                        </div>
                    </div>
                </header>
                <div className="scoring-loading">
                    <div className="scoring-loading-spinner" />
                    <h2>Analyzing Your Interview...</h2>
                    <p>Our AI is evaluating your performance across 6 dimensions</p>
                </div>
            </div>
        )
    }

    // CC-10: Handle too-short interviews
    const isTooShort = aiScores?.tooShort

    return (
        <div className="scoring">
            <header className="scoring-header">
                <div className="container">
                    <div className="scoring-nav">
                        <button className="btn btn-ghost" onClick={onHome}>← Home</button>
                        <div className="landing-logo">
                            <span className="landing-logo-icon">◆</span>
                            <span className="landing-logo-text">DesignDrill</span>
                        </div>
                        <div style={{ width: 80 }} />
                    </div>
                </div>
            </header>

            <main className="scoring-main">
                <div className="container">
                    {/* Overall Score */}
                    <div className="scoring-overall animate-scale-in">
                        <div className="scoring-overall-ring" style={{ '--score-color': getScoreColor(overallScore) }}>
                            <svg viewBox="0 0 120 120" className="scoring-ring-svg">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle
                                    cx="60" cy="60" r="52" fill="none"
                                    stroke={getScoreColor(overallScore)}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(overallScore / 10) * 327} 327`}
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 1.5s ease' }}
                                />
                            </svg>
                            <div className="scoring-overall-value">
                                <span className="scoring-overall-number">{overallScore}</span>
                                <span className="scoring-overall-max">/10</span>
                            </div>
                        </div>
                        <h1 className="scoring-overall-label">{getScoreLabel(overallScore)}</h1>
                        <p className="scoring-overall-meta">
                            {config?.question?.title || 'JD-Based Interview'} • {durationMin}m {durationSec}s • {config?.companyData?.name} Style
                        </p>
                    </div>

                    {/* CC-10: Too-short interview warning */}
                    {isTooShort && (
                        <div className="scoring-tooshort card animate-fade-in-up" style={{ background: 'rgba(253, 203, 110, 0.1)', border: '1px solid rgba(253, 203, 110, 0.3)', padding: '24px', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--warning)', margin: '0 0 8px' }}>Interview Too Short</h3>
                            <p style={{ color: 'var(--text-2)', margin: 0 }}>
                                Your interview was too brief for a comprehensive AI evaluation. Aim for at least 10-15 minutes of conversation covering requirements, architecture, and a deep dive for meaningful feedback.
                            </p>
                        </div>
                    )}

                    {/* AI Verdict */}
                    {aiScores?.overallVerdict && (
                        <div className="scoring-verdict card animate-fade-in-up">
                            <h3>AI Assessment</h3>
                            <p>{aiScores.overallVerdict}</p>
                        </div>
                    )}

                    {/* Strengths & Improvements */}
                    {aiScores?.strengths && (
                        <div className="scoring-insights animate-fade-in-up">
                            <div className="scoring-insight-col">
                                <h3>Strengths</h3>
                                <ul>{aiScores.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                            <div className="scoring-insight-col">
                                <h3>Areas to Improve</h3>
                                <ul>{(aiScores.improvements || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        </div>
                    )}

                    {/* Dimension Scores */}
                    <div className="scoring-dimensions">
                        <h2 className="scoring-section-title">Technical Assessment</h2>
                        <div className="scoring-dim-grid">
                            {scores.map((dim, i) => (
                                <div key={dim.id} className={`card scoring-dim-card ${i <= revealedIndex ? 'revealed' : ''}`}>
                                    <div className="scoring-dim-header">
                                        <span className="scoring-dim-name">{dim.name}</span>
                                        <span className="scoring-dim-score" style={{ color: getScoreColor(dim.score) }}>
                                            {dim.score}
                                        </span>
                                    </div>
                                    <div className="scoring-dim-bar">
                                        <div className="scoring-dim-bar-fill" style={{ width: i <= revealedIndex ? `${(dim.score / 10) * 100}%` : '0%', background: getScoreColor(dim.score) }} />
                                    </div>
                                    <p className="scoring-dim-feedback">{dim.feedback}</p>
                                    <p className="scoring-dim-weight">Weight: {((dim.weight || 0.2) * 100)}%</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Soft Skills */}
                    <div className="scoring-soft">
                        <h2 className="scoring-section-title">Soft Skills Assessment</h2>
                        <div className="scoring-soft-grid">
                            {softScores.map(skill => (
                                <div key={skill.id} className="scoring-soft-item">
                                    <div className="scoring-soft-left">
                                        <span className="scoring-soft-name">{skill.name}</span>
                                    </div>
                                    <div className="scoring-soft-bar-container">
                                        <div className="scoring-soft-bar">
                                            <div className="scoring-soft-bar-fill" style={{ width: `${(skill.score / 10) * 100}%`, background: getScoreColor(skill.score) }} />
                                        </div>
                                        <span className="scoring-soft-score" style={{ color: getScoreColor(skill.score) }}>{skill.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gap Analysis (Study Guide) */}
                    {gaps && gaps.length > 0 && (
                        <div className="scoring-gaps animate-fade-in-up">
                            <h2 className="scoring-section-title">Design Audit & Gap Analysis</h2>
                            <div className="card scoring-gap-card">
                                <p className="gap-message">Based on expert architecture benchmarks, here are areas you could have explored deeper:</p>
                                <div className="gap-list">
                                    {gaps.map((gap, i) => (
                                        <div key={i} className={`gap-item ${gap.severity.toLowerCase()}`}>
                                            <span className="gap-severity">{gap.severity}</span>
                                            <span className="gap-label">{gap.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="gap-footer">
                                    <p>Tip: Focus on these concepts in your next system design study session.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Decision Timeline (AI Interviewer 2.0) */}
                    <div className="scoring-timeline animate-fade-in-up">
                        <h2 className="scoring-section-title">Design Evolution & Timeline</h2>
                        <div className="card scoring-timeline-card">
                            {/* Design Evolution Sparkline */}
                            <div className="evolution-graph">
                                <div className="graph-header">
                                    <span>Knowledge Coverage Trend</span>
                                    <span className="graph-legend">Turns →</span>
                                </div>
                                <svg className="sparkline" viewBox="0 0 400 60" preserveAspectRatio="none">
                                    <path
                                        d={`M 0 60 ${activeResult.stateHistory?.map((e, i) => {
                                            const coverage = Object.values(e.coverageMap || {}).reduce((s, v) => s + v, 0)
                                            const divisor = Math.max(1, activeResult.stateHistory.length - 1)
                                            const x = (i / divisor) * 400
                                            const y = 60 - (Math.min(coverage, 12) / 12) * 50
                                            return `L ${x} ${y}`
                                        }).join(' ')} L 400 60`}
                                        fill="url(#sparkline-gradient)"
                                        className="sparkline-area"
                                    />
                                    <path
                                        d={`M 0 60 ${activeResult.stateHistory?.map((e, i) => {
                                            const coverage = Object.values(e.coverageMap || {}).reduce((s, v) => s + v, 0)
                                            const divisor = Math.max(1, activeResult.stateHistory.length - 1)
                                            const x = (i / divisor) * 400
                                            const y = 60 - (Math.min(coverage, 12) / 12) * 50
                                            return `L ${x} ${y}`
                                        }).join(' ')}`}
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="sparkline-path"
                                    />
                                    <defs>
                                        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <hr style={{ margin: '16px 0', borderColor: 'rgba(255,255,255,0.05)' }} />
                            <div className="timeline-coverage-grid">
                                {activeResult.coverageMap && Object.entries(activeResult.coverageMap)
                                    .filter(([area]) => {
                                        const hldOnly = ['scaleEstimation', 'cachingStrategy', 'databaseDesign', 'highLevelArchitecture', 'failureHandling', 'scalability', 'security', 'apiDesign', 'tradeoffs']
                                        const lldOnly = ['technical-depth', 'solution-design', 'concurrency', 'data-structures']
                                        const isLLD = config?.type === 'lld'
                                        if (isLLD) return !hldOnly.includes(area)
                                        return !lldOnly.includes(area)
                                    })
                                    .map(([area, value]) => (
                                        <div key={area} className="timeline-coverage-item">
                                            <span className="coverage-label">{area.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <div className="coverage-dots">
                                                {[0, 1, 2, 3].map(dot => {
                                                    let stateClass = ''
                                                    if (value > dot) {
                                                        if (dot < 1) stateClass = 'partial'
                                                        else if (dot < 2) stateClass = 'full'
                                                        else stateClass = 'challenged'
                                                    }
                                                    return <div key={dot} className={`coverage-dot ${stateClass}`} />
                                                })}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <hr style={{ margin: '24px 0', borderColor: 'rgba(255,255,255,0.05)' }} />

                            <div className="timeline-events">
                                {activeResult.stateHistory?.some(e => e.extractionResult?.newDecisions?.length > 0 || e.extractionResult?.mathClaims?.length > 0 || e.extractionResult?.contradictions?.length > 0) ? (
                                    activeResult.stateHistory
                                        .map((event, originalIdx) => ({ event, originalIdx }))
                                        .filter(({ event }) =>
                                            event.extractionResult?.newDecisions?.length > 0 ||
                                            event.extractionResult?.contradictions?.length > 0 ||
                                            event.extractionResult?.mathClaims?.length > 0
                                        ).map(({ event, originalIdx }) => (
                                            <div key={originalIdx} className="timeline-event expanded">
                                                <div className="timeline-event-marker" />
                                                <div className="timeline-event-content">
                                                    <div className="timeline-event-header">
                                                        <span className="timeline-event-time">Turn {originalIdx + 1}</span>
                                                        <span className="timeline-event-type">Design Decision</span>
                                                    </div>

                                                    {event.extractionResult?.newDecisions?.length > 0 && (
                                                        <div className="event-details-list">
                                                            {event.extractionResult.newDecisions.map((d, i) => (
                                                                <div key={i} className="detail-item decision">
                                                                    <span className="detail-bullet">✓</span>
                                                                    <span className="detail-text">{d}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {event.extractionResult?.contradictions?.length > 0 && (
                                                        <div className="event-details-list">
                                                            {event.extractionResult.contradictions.map((c, i) => (
                                                                <div key={i} className="detail-item contradiction">
                                                                    <span className="detail-bullet">⚠</span>
                                                                    <span className="detail-text">{c}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {event.extractionResult?.mathClaims?.length > 0 && (
                                                        <div className="event-details-list">
                                                            {event.extractionResult.mathClaims.map((m, i) => (
                                                                <div key={i} className="detail-item math">
                                                                    <span className="detail-bullet">∑</span>
                                                                    <span className="detail-text">{m}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'var(--text-3)' }}>No significant design events captured.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session Stats */}
                <div className="scoring-stats">
                    <h2 className="scoring-section-title">Session Statistics & Pace</h2>
                    <div className="scoring-stats-grid">
                        <div className="card scoring-stat-card">
                            <span className="scoring-stat-icon">T</span>
                            <span className="scoring-stat-value">{durationMin}m {durationSec}s</span>
                            <span className="scoring-stat-label">Duration</span>
                        </div>
                        <div className="card scoring-stat-card">
                            <span className="scoring-stat-icon">R</span>
                            <span className="scoring-stat-value">{activeResult?.messages?.filter(m => m.role === 'user')?.length || 0}</span>
                            <span className="scoring-stat-label">Turns</span>
                        </div>
                        <div className="card scoring-stat-card">
                            <span className="scoring-stat-icon">P</span>
                            <span className="scoring-stat-value">
                                {behavioralStats?.talkRatio ? `${Math.round(behavioralStats.talkRatio)}%` : '0%'}
                            </span>
                            <span className="scoring-stat-label">Talk Ratio</span>
                        </div>
                        <div className="card scoring-stat-card">
                            <span className="scoring-stat-icon">W</span>
                            <span className="scoring-stat-value">
                                {Math.round(behavioralStats?.avgResponseWords || 0)}
                            </span>
                            <span className="scoring-stat-label">Avg Length</span>
                        </div>
                        <div className="card scoring-stat-card">
                            <span className="scoring-stat-icon">M</span>
                            <span className="scoring-stat-value">
                                Turn {behavioralStats?.peakTurn || 1}
                            </span>
                            <span className="scoring-stat-label">Peak Moment</span>
                        </div>
                    </div>
                </div>

                {/* Downloads */}
                <div className="scoring-actions">
                    <h2 className="scoring-section-title">Session Artifacts</h2>
                    <div className="scoring-actions-grid">
                        <button className="btn btn-secondary btn-lg" onClick={downloadTranscript}>
                            Download Transcript
                        </button>
                        {activeResult?.recordingBlob && (
                            <button className="btn btn-secondary btn-lg" onClick={handleDownloadVideo}>
                                Download Recording
                            </button>
                        )}
                        <button className="btn btn-primary btn-xl" onClick={onNewInterview}>
                            Start New Interview
                        </button>
                    </div>
                </div>
            </main >
        </div >
    )
}

function generateFallbackFeedback(dimensionId, score) {
    const feedbacks = {
        'problem-navigation': {
            high: 'Excellent job asking clarifying questions and scoping the problem effectively.',
            mid: 'Good attempt at gathering requirements. Consider asking about scale and consistency earlier.',
            low: 'You jumped into the solution too quickly. Take time to clarify requirements first.',
        },
        'solution-design': {
            high: 'Your architecture was well-structured with appropriate component choices.',
            mid: 'Decent architecture. Consider adding layers like caching, CDN, or message queues.',
            low: 'The architecture needs more thought. Consider standard distributed system patterns.',
        },
        'technical-depth': {
            high: 'Impressive depth in your technical discussions and system knowledge.',
            mid: 'Good foundational knowledge. Dive deeper into database and caching strategies.',
            low: 'Strengthen core concepts: sharding, caching, consistency models, load balancing.',
        },
        'tradeoff-analysis': {
            high: 'Excellent trade-off discussions with clear articulation of pros and cons.',
            mid: 'Some trade-offs identified. Go deeper on CAP theorem and cost analysis.',
            low: 'Practice explicitly comparing alternatives and articulating trade-offs.',
        },
        coachability: {
            high: 'You responded well to challenges and incorporated feedback effectively.',
            mid: 'You acknowledged some pushback but could engage more deeply with contradictions.',
            low: 'Work on updating your design when the interviewer challenges your decisions.',
        },
        communication: {
            high: 'Outstanding communication! Clear, structured, and engaging approach.',
            mid: 'Good communication. Try to think aloud more consistently.',
            low: 'Work on verbalizing your thought process with a structured framework.',
        },
    }
    const level = score >= 7.5 ? 'high' : score >= 5.5 ? 'mid' : 'low'
    return feedbacks[dimensionId]?.[level] || 'Continue practicing to improve.'
}
