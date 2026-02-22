import { CurriculumIcons } from './CurriculumIcons'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { HLD_UNITS, HLD_CHAPTERS } from '../../data/hldCurriculum'
import { LLD_UNITS, LLD_CHAPTERS } from '../../data/lldCurriculum'
import { storageAdapter } from '../../services/storageAdapter'
import './Learn.css'

const TRACKS = {
    hld: { name: 'High-Level Design (HLD)', icon: <CurriculumIcons.hld />, units: HLD_UNITS, chapters: HLD_CHAPTERS },
    lld: { name: 'Low-Level Design (LLD)', icon: <CurriculumIcons.lld />, units: LLD_UNITS, chapters: LLD_CHAPTERS },
}

export default function Learn({ onBack, onStartInterview }) {
    const [track, setTrack] = useState('hld')
    const [activeChapterId, setActiveChapterId] = useState(null)
    const [progress, setProgress] = useState({})
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const currentTrack = TRACKS[track]
    const chapters = currentTrack.chapters
    const units = currentTrack.units

    // Set first chapter on mount or track switch
    useEffect(() => {
        if (chapters.length > 0) {
            setActiveChapterId(chapters[0].id)
        }
    }, [track]) // eslint-disable-line

    // Load progress from localStorage (Guest Experience)
    useEffect(() => {
        function load() {
            try {
                const stored = localStorage.getItem('learn_progress')
                if (stored) {
                    setProgress(JSON.parse(stored))
                }
            } catch (e) {
                console.warn('Failed to load progress', e)
            }
        }
        load()
    }, [])

    const activeChapter = useMemo(
        () => chapters.find(c => c.id === activeChapterId),
        [chapters, activeChapterId]
    )

    const chaptersByUnit = useMemo(() => {
        const map = {}
        units.forEach(u => { map[u.id] = chapters.filter(c => c.unit === u.id) })
        return map
    }, [units, chapters])

    const completedCount = useMemo(
        () => chapters.filter(c => progress[`${track}:${c.id}`]?.completed).length,
        [chapters, progress, track]
    )

    const markComplete = useCallback((chapterId) => {
        const key = `${track}:${chapterId}`

        setProgress(prev => {
            const next = { ...prev, [key]: { completed: true, timestamp: Date.now() } }
            try {
                localStorage.setItem('learn_progress', JSON.stringify(next))
            } catch (e) {
                console.warn('Failed to save progress', e)
            }
            return next
        })

        // Also track telemetry anonymously if available
        if (window.trackEvent) {
            window.trackEvent('chapter_complete', { track, chapterId })
        }
    }, [track])

    const goToChapter = useCallback((chapterId) => {
        setActiveChapterId(chapterId)
        document.querySelector('.learn-content')?.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const currentIndex = chapters.findIndex(c => c.id === activeChapterId)
    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

    const goNext = useCallback(() => {
        if (activeChapterId) markComplete(activeChapterId)
        if (nextChapter) goToChapter(nextChapter.id)
    }, [activeChapterId, nextChapter, markComplete, goToChapter])

    const goPrev = useCallback(() => {
        if (prevChapter) goToChapter(prevChapter.id)
    }, [prevChapter, goToChapter])

    return (
        <div className="learn">
            {/* Header */}
            <header className="learn-header">
                <div className="learn-header-left">
                    <button className="btn btn-ghost" onClick={onBack}>← Home</button>
                    <div className="landing-logo">
                        <span className="landing-logo-icon">◆</span>
                        <span className="landing-logo-text">DesignDrill</span>
                    </div>
                </div>
                <div className="learn-header-center">
                    <div className="learn-track-switcher">
                        {Object.entries(TRACKS).map(([key, t]) => (
                            <button key={key} className={`learn-track-btn ${track === key ? 'active' : ''}`} onClick={() => setTrack(key)}>
                                {t.icon} {t.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="learn-header-right">
                    <div className="learn-progress-badge">
                        {completedCount}/{chapters.length} chapters
                    </div>
                    <button className="btn btn-ghost btn-icon learn-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)' }}>
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Progress bar */}
            <div className="learn-progress-bar">
                <div className="learn-progress-fill" style={{ width: `${(completedCount / chapters.length) * 100}%` }} />
            </div>

            {/* Main */}
            <div className="learn-body">
                {/* Sidebar */}
                {sidebarOpen && (
                    <aside className="learn-sidebar">
                        {units.map(unit => (
                            <div key={unit.id} className="learn-unit">
                                <div className="learn-unit-header">
                                    <span className="learn-unit-icon">
                                        {CurriculumIcons[unit.icon] ? CurriculumIcons[unit.icon]() : unit.icon}
                                    </span>
                                    <span className="learn-unit-name">Unit {unit.id}: {unit.name}</span>
                                </div>
                                <div className="learn-chapter-list">
                                    {(chaptersByUnit[unit.id] || []).map(ch => {
                                        const isComplete = progress[`${track}:${ch.id}`]?.completed
                                        const isActive = ch.id === activeChapterId
                                        return (
                                            <button key={ch.id} className={`learn-chapter-btn ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`} onClick={() => goToChapter(ch.id)}>
                                                <span className="learn-ch-status">
                                                    {isComplete ? <CurriculumIcons.check className="text-success" /> : isActive ? <CurriculumIcons.foundations className="text-primary" /> : <div className="ch-bullet" />}
                                                </span>
                                                <span className="learn-ch-title">{ch.title}</span>
                                                <span className="learn-ch-duration">{ch.duration}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </aside>
                )}

                {/* Content */}
                <main className="learn-content">
                    {activeChapter ? (
                        <>
                            <div className="learn-ch-header">
                                <div className="learn-ch-breadcrumb">
                                    Unit {activeChapter.unit} • {units.find(u => u.id === activeChapter.unit)?.name}
                                </div>
                                <h1 className="learn-ch-title-big">
                                    {activeChapter.title}
                                </h1>
                                <div className="learn-ch-meta">
                                    <span className="badge badge-accent">{units.find(u => u.id === activeChapter.unit)?.difficulty}</span>
                                    <span className="meta-item"><CurriculumIcons.foundations size={14} /> {activeChapter.duration} read</span>
                                    <span className="meta-item">Chapter {currentIndex + 1} of {chapters.length}</span>
                                </div>
                            </div>

                            {/* Legacy vs Rich Content Switch */}
                            {activeChapter.content ? (
                                <div className="learn-ch-body rich-content-wrapper">
                                    <RichTextRenderer content={activeChapter.content} onStartInterview={onStartInterview} />
                                </div>
                            ) : (
                                <div className="learn-ch-body">
                                    {activeChapter.sections.map((section, i) => (
                                        <SectionRenderer key={i} section={section} onStartInterview={onStartInterview} />
                                    ))}
                                </div>
                            )}

                            {/* Practice Link */}
                            {activeChapter.practiceLink && onStartInterview && (
                                <div className="learn-practice-card">
                                    <div className="learn-practice-icon"><CurriculumIcons.scenario size={32} /></div>
                                    <div>
                                        <h4>Practice What You Learned</h4>
                                        <p>Apply these concepts in a professional mock interview session.</p>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => onStartInterview(activeChapter.practiceLink)}>
                                        Start Interview →
                                    </button>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="learn-nav-footer">
                                <button className="btn btn-secondary" onClick={goPrev} disabled={!prevChapter}>
                                    ← {prevChapter?.title || 'Start'}
                                </button>
                                <button className="btn btn-primary" onClick={goNext} disabled={!nextChapter}>
                                    {nextChapter ? <>{nextChapter.title} <CurriculumIcons.check style={{ transform: 'rotate(-90deg)' }} /></> : 'Module Complete'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="learn-empty">
                            <h2>Select a chapter to begin learning</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

/**
 * Renders individual content sections based on type
 */
function SectionRenderer({ section, onStartInterview }) {
    switch (section.type) {
        case 'text':
            return (
                <div className="learn-section learn-text">
                    {section.title && <h2>{section.title}</h2>}
                    <div className="learn-text-content">{renderTextWithBold(section.content)}</div>
                </div>
            )

        case 'code':
            return (
                <div className="learn-section learn-code">
                    {section.title && <h3 className="learn-code-title">{section.title}</h3>}
                    <div className="learn-code-block">
                        <div className="learn-code-lang">{section.language || 'code'}</div>
                        <pre><code>{section.content}</code></pre>
                        <button className="learn-copy-btn" onClick={() => {
                            navigator.clipboard?.writeText(section.content);
                            // Visual feedback could be added here
                        }} title="Copy"><CurriculumIcons.check size={14} /></button>
                    </div>
                </div>
            )

        case 'diagram':
            return (
                <div className="learn-section learn-diagram">
                    {section.title && <h3>{section.title}</h3>}
                    <pre className="learn-diagram-block"><code>{section.content.replace(/```\n?/g, '').trim()}</code></pre>
                </div>
            )

        case 'tip':
            return (
                <div className={`learn-section learn-tip learn-tip-${section.variant || 'info'}`}>
                    <div className="learn-tip-icon">
                        {section.variant === 'interview' ? <CurriculumIcons.mastery /> : section.variant === 'warning' ? <CurriculumIcons.alert /> : <CurriculumIcons.tip />}
                    </div>
                    <div className="learn-tip-content">
                        <div className="learn-tip-label">
                            {section.variant === 'interview' ? 'Interview Tip' : section.variant === 'warning' ? 'Warning' : section.variant === 'pro-tip' ? 'Pro Tip' : 'Note'}
                        </div>
                        <p>{section.content}</p>
                    </div>
                </div>
            )

        case 'concept-card':
            return (
                <div className="learn-section learn-concepts">
                    {section.title && <h3>{section.title}</h3>}
                    <div className="learn-concepts-grid">
                        {section.items.map((item, i) => (
                            <div key={i} className="learn-concept-item">
                                <div className="learn-concept-term">{item.term}</div>
                                <div className="learn-concept-def">{item.definition}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'comparison':
            return (
                <div className="learn-section learn-comparison">
                    {section.title && <h3>{section.title}</h3>}
                    <div className="learn-table-wrapper">
                        <table className="learn-table">
                            <thead>
                                <tr>{section.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {section.rows.map((row, i) => (
                                    <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )

        case 'example':
            return (
                <div className="learn-section learn-example">
                    {section.title && <h3>{section.title}</h3>}
                    <div className="learn-example-grid">
                        <div className="learn-example-bad">
                            <div className="learn-example-label"><CurriculumIcons.alert size={14} /> Standard Approach</div>
                            <div className="learn-example-text">{renderTextWithBold(section.bad)}</div>
                        </div>
                        <div className="learn-example-good">
                            <div className="learn-example-label"><CurriculumIcons.check size={14} /> Expert Approach</div>
                            <div className="learn-example-text">{renderTextWithBold(section.good)}</div>
                        </div>
                    </div>
                </div>
            )

        case 'deep-dive':
            return (
                <details className="learn-section learn-deep-dive">
                    <summary className="learn-deep-dive-summary">
                        <span className="learn-deep-dive-icon"><CurriculumIcons.mastery /></span>
                        <span className="learn-deep-dive-title">{section.title}</span>
                        <span className="learn-deep-dive-arrow"><CurriculumIcons.check style={{ transform: 'rotate(90deg)' }} size={12} /></span>
                    </summary>
                    <div className="learn-deep-dive-content">
                        {renderTextWithBold(section.content)}
                    </div>
                </details>
            )

        case 'scenario':
            return (
                <div className="learn-section learn-scenario">
                    <div className="learn-scenario-header">
                        <span className="learn-scenario-icon"><CurriculumIcons.scenario /></span>
                        <h3>{section.title}</h3>
                    </div>
                    <div className="learn-scenario-body">
                        <div className="learn-scenario-problem">
                            <strong>The Problem:</strong> {section.problem}
                        </div>
                        <div className="learn-scenario-solution">
                            <strong>The Solution:</strong> {renderTextWithBold(section.solution)}
                        </div>
                    </div>
                </div>
            )

        case 'step-by-step':
            return (
                <div className="learn-section learn-steps">
                    {section.title && <h3>{section.title}</h3>}
                    <div className="learn-steps-list">
                        {section.steps.map((step, i) => (
                            <div key={i} className="learn-step-item">
                                <div className="learn-step-number">{i + 1}</div>
                                <div className="learn-step-content">
                                    <strong>{step.title}</strong>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        case 'quiz':
            return <QuizSection section={section} />

        default:
            return null
    }
}

function QuizSection({ section }) {
    const [selected, setSelected] = useState(null)
    const [showResult, setShowResult] = useState(false)

    const isCorrect = selected === section.correctIndex

    return (
        <div className="learn-section learn-quiz">
            <div className="learn-quiz-header">
                <span className="learn-quiz-icon"><CurriculumIcons.quiz /></span>
                <h3>{section.question}</h3>
            </div>
            <div className="learn-quiz-options">
                {section.options.map((opt, i) => (
                    <button
                        key={i}
                        className={`learn-quiz-option ${showResult && i === section.correctIndex ? 'correct' : ''} ${showResult && selected === i && !isCorrect ? 'wrong' : ''}`}
                        onClick={() => { setSelected(i); setShowResult(true); }}
                        disabled={showResult}
                    >
                        {opt}
                        {showResult && i === section.correctIndex && <CurriculumIcons.check className="quiz-status-icon success" />}
                        {showResult && selected === i && !isCorrect && <CurriculumIcons.alert className="quiz-status-icon error" />}
                    </button>
                ))}
            </div>
            {showResult && (
                <div className={`learn-quiz-feedback ${isCorrect ? 'success' : 'error'}`}>
                    {isCorrect ? 'Correct! ' : 'Incorrect. '}
                    {section.explanation}
                </div>
            )}
        </div>
    )
}

/**
 * Renders an array of rich content items (legacy/bulk format)
 */
function RichTextRenderer({ content, onStartInterview }) {
    if (!Array.isArray(content)) {
        return <div className="learn-text-content">{renderTextWithBold(content)}</div>
    }

    return (
        <div className="rich-text-container">
            {content.map((item, i) => {
                // Map legacy types to SectionRenderer types or render directly
                switch (item.type) {
                    case 'markdown':
                        return (
                            <div key={i} className="learn-section learn-text">
                                <div className="learn-text-content">{renderTextWithBold(item.content)}</div>
                            </div>
                        )
                    case 'faang-insight':
                        return (
                            <div key={i} className="learn-section learn-tip learn-tip-interview">
                                <div className="learn-tip-icon"><CurriculumIcons.mastery /></div>
                                <div className="learn-tip-content">
                                    <div className="learn-tip-label">{item.company} Insight</div>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        )
                    case 'code-tutorial':
                        return (
                            <div key={i} className="learn-section learn-steps">
                                {item.title && <h3>{item.title}</h3>}
                                <pre className="learn-code-block"><code>{item.code}</code></pre>
                                <div className="learn-steps-list">
                                    {item.steps.map((step, si) => (
                                        <div key={si} className="learn-step-item">
                                            <div className="learn-step-number">{si + 1}</div>
                                            <div className="learn-step-content">
                                                <strong>{step.title}</strong>
                                                <p>{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    default:
                        // Fallback to SectionRenderer for compatible types
                        return <SectionRenderer key={i} section={item} onStartInterview={onStartInterview} />
                }
            })}
        </div>
    )
}

/**
 * Render text with **bold** and \n newlines
 */
function renderTextWithBold(text) {
    if (!text) return ''
    if (typeof text !== 'string') return ''

    return text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g)
        return (
            <span key={i}>
                {i > 0 && <br />}
                {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>
                    }
                    return <span key={j}>{part}</span>
                })}
            </span>
        )
    })
}
