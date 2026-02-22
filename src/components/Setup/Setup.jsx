import { useState } from 'react'
import { HLD_QUESTIONS, LLD_QUESTIONS, COMPANY_STYLES, DIFFICULTY_LEVELS, TIME_OPTIONS } from '../../data/questions'
import { trackInterviewStart } from '../../services/telemetry'
import './Setup.css'

export default function Setup({ onStart, onBack }) {
    const [mode, setMode] = useState('general') // 'general' | 'jd'
    const [type, setType] = useState('hld') // 'hld' | 'lld'
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [difficulty, setDifficulty] = useState('mid')
    const [companyStyle, setCompanyStyle] = useState('generic')
    const [timeLimit, setTimeLimit] = useState(45)
    const [jdText, setJdText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterDifficulty, setFilterDifficulty] = useState('all')

    const questions = type === 'hld' ? HLD_QUESTIONS : LLD_QUESTIONS
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
        return matchesSearch && matchesDifficulty;
    })

    const handleStart = async () => {
        const problem = mode === 'general' ? selectedQuestion : { id: 'jd-custom', title: 'JD Selection', type };

        // Start telemetry
        const telemetryId = await trackInterviewStart(problem);

        const config = {
            mode,
            type,
            question: mode === 'general' ? selectedQuestion : null,
            jdText: mode === 'jd' ? jdText : null,
            difficulty,
            companyStyle,
            timeLimit,
            telemetryId, // Pass it down to track completion
            startTimeMs: Date.now(), // For duration calc
            companyData: COMPANY_STYLES.find(c => c.id === companyStyle),
        }
        onStart(config)
    }

    const canStart = mode === 'jd' ? jdText.trim().length > 50 : selectedQuestion !== null

    return (
        <div className="setup">
            <header className="setup-header">
                <div className="container">
                    <div className="setup-nav">
                        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
                        <div className="setup-logo">
                            <img src="/Logo.png" alt="DesignDrill" className="setup-logo-img" />
                            <span className="setup-logo-text">DesignDrill</span>
                        </div>
                        <div style={{ width: 80 }} />
                    </div>
                </div>
            </header>

            <main className="setup-main">
                <div className="container">
                    <h1 className="setup-title animate-fade-in-up">Configure Your Interview</h1>
                    <p className="setup-subtitle animate-fade-in-up">Customize every aspect to match your preparation goals</p>

                    <div className="setup-grid">
                        {/* Left Column - Configuration */}
                        <div className="setup-config">
                            {/* Mode Selection */}
                            <div className="setup-section animate-fade-in-up">
                                <h2 className="setup-section-title">Interview Mode</h2>
                                <div className="setup-toggle-group">
                                    <button
                                        className={`setup-toggle pink-card ${mode === 'general' ? 'active' : ''}`}
                                        onClick={() => setMode('general')}
                                    >
                                        <span className="setup-toggle-label">General Prep</span>
                                        <span className="setup-toggle-desc">Choose from our problem bank</span>
                                    </button>
                                    <button
                                        className={`setup-toggle pink-card ${mode === 'jd' ? 'active' : ''}`}
                                        onClick={() => setMode('jd')}
                                    >
                                        <span className="setup-toggle-label">JD-Based</span>
                                        <span className="setup-toggle-desc">Paste a job description</span>
                                    </button>
                                </div>
                            </div>

                            {/* Type Selection */}
                            <div className="setup-section animate-fade-in-up">
                                <h2 className="setup-section-title">Design Type</h2>
                                <div className="setup-toggle-group">
                                    <button
                                        className={`setup-toggle pink-card ${type === 'hld' ? 'active' : ''}`}
                                        onClick={() => { setType('hld'); setSelectedQuestion(null) }}
                                    >
                                        <span className="setup-toggle-label">High-Level Design</span>
                                        <span className="setup-toggle-desc">Architecture & system components</span>
                                    </button>
                                    <button
                                        className={`setup-toggle pink-card ${type === 'lld' ? 'active' : ''}`}
                                        onClick={() => { setType('lld'); setSelectedQuestion(null) }}
                                    >
                                        <span className="setup-toggle-label">Low-Level Design</span>
                                        <span className="setup-toggle-desc">Classes, patterns & API design</span>
                                    </button>
                                </div>
                            </div>

                            {/* JD Input or Question Selection */}
                            {mode === 'jd' ? (
                                <div className="setup-section animate-fade-in-up">
                                    <h2 className="setup-section-title">Paste Job Description</h2>
                                    <textarea
                                        className="input setup-jd-input"
                                        placeholder="Paste the full job description here. The AI will analyze it and generate a tailored interview matching the company's style, required skills, and role level..."
                                        value={jdText}
                                        onChange={e => setJdText(e.target.value)}
                                        rows={8}
                                    />
                                    {jdText.length > 0 && jdText.length < 50 && (
                                        <p className="setup-hint">Please paste at least 50 characters for accurate analysis</p>
                                    )}
                                </div>
                            ) : (
                                <div className="setup-section animate-fade-in-up">
                                    <h2 className="setup-section-title">Select a Problem</h2>
                                    <div className="setup-filter-container">
                                        <div className="setup-search-box">
                                            <input
                                                className="input setup-search"
                                                placeholder="Search problems..."
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="setup-filter-options">
                                            {['all', 'Easy', 'Medium', 'Hard'].map(d => (
                                                <button
                                                    key={d}
                                                    className={`setup-filter-card ${filterDifficulty === d ? 'active' : ''}`}
                                                    onClick={() => setFilterDifficulty(d)}
                                                >
                                                    {d === 'all' ? 'All' : d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="setup-questions-list">
                                        {filteredQuestions.map(q => (
                                            <button
                                                key={q.id}
                                                className={`setup-question-card ${selectedQuestion?.id === q.id ? 'selected pink-card' : ''}`}
                                                onClick={() => setSelectedQuestion(q)}
                                            >
                                                <div className="setup-question-header">
                                                    <span className="setup-question-title">{q.title}</span>
                                                    <span className={`badge ${q.difficulty === 'Easy' ? 'badge-success' : q.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'}`}>
                                                        {q.difficulty}
                                                    </span>
                                                </div>
                                                <span className="setup-question-category">{q.category}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Difficulty */}
                            <div className="setup-section animate-fade-in-up">
                                <h2 className="setup-section-title">Difficulty Level</h2>
                                <div className="setup-radio-group">
                                    {DIFFICULTY_LEVELS.map(d => (
                                        <label key={d.id} className={`setup-radio ${difficulty === d.id ? 'active pink-card' : ''}`}>
                                            <input
                                                type="radio"
                                                name="difficulty"
                                                value={d.id}
                                                checked={difficulty === d.id}
                                                onChange={() => setDifficulty(d.id)}
                                            />
                                            <span className="setup-radio-label">{d.label}</span>
                                            <span className="setup-radio-desc">{d.description}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Company Style */}
                            <div className="setup-section animate-fade-in-up">
                                <h2 className="setup-section-title">Interview Style</h2>
                                <div className="setup-company-grid">
                                    {COMPANY_STYLES.map(c => (
                                        <button
                                            key={c.id}
                                            className={`setup-company-card ${companyStyle === c.id ? 'selected pink-card' : ''}`}
                                            onClick={() => setCompanyStyle(c.id)}
                                            style={{ '--company-color': c.color }}
                                        >
                                            <div className="setup-company-logo-container" style={{ background: c.color }}>
                                                {c.logoUrl ? (
                                                    <img
                                                        src={c.logoUrl}
                                                        alt={c.name}
                                                        className="setup-company-logo-img"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <span
                                                    className="setup-company-initial"
                                                    style={{ display: c.logoUrl ? 'none' : 'flex' }}
                                                >
                                                    {c.name[0]}
                                                </span>
                                            </div>
                                            <span className="setup-company-name">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Limit */}
                            <div className="setup-section animate-fade-in-up">
                                <h2 className="setup-section-title">Time Limit</h2>
                                <div className="setup-time-group">
                                    {TIME_OPTIONS.map(t => (
                                        <button
                                            key={t.value}
                                            className={`setup-time-card pink-card ${timeLimit === t.value ? 'selected' : ''}`}
                                            onClick={() => setTimeLimit(t.value)}
                                        >
                                            <span className="setup-time-value">{t.label}</span>
                                            <span className="setup-time-desc">{t.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Preview */}
                        <div className="setup-preview">
                            <div className="setup-preview-card card">
                                <h3 className="setup-preview-title">Interview Preview</h3>
                                <div className="divider" />
                                <div className="setup-preview-items">
                                    <div className="setup-preview-item">
                                        <span className="setup-preview-label">Mode</span>
                                        <span className="setup-preview-value">{mode === 'jd' ? 'JD-Based' : 'General Prep'}</span>
                                    </div>
                                    <div className="setup-preview-item">
                                        <span className="setup-preview-label">Type</span>
                                        <span className="setup-preview-value">{type === 'hld' ? 'High-Level Design' : 'Low-Level Design'}</span>
                                    </div>
                                    {mode === 'general' && selectedQuestion && (
                                        <div className="setup-preview-item">
                                            <span className="setup-preview-label">Problem</span>
                                            <span className="setup-preview-value">{selectedQuestion.title}</span>
                                        </div>
                                    )}
                                    <div className="setup-preview-item">
                                        <span className="setup-preview-label">Difficulty</span>
                                        <span className="setup-preview-value">{DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.label}</span>
                                    </div>
                                    <div className="setup-preview-item">
                                        <span className="setup-preview-label">Style</span>
                                        <span className="setup-preview-value">
                                            {COMPANY_STYLES.find(c => c.id === companyStyle)?.name}
                                        </span>
                                    </div>
                                    <div className="setup-preview-item">
                                        <span className="setup-preview-label">Duration</span>
                                        <span className="setup-preview-value">{timeLimit} minutes</span>
                                    </div>
                                </div>
                                <div className="divider" />
                                <button
                                    className="btn btn-primary btn-lg setup-start-btn"
                                    disabled={!canStart}
                                    onClick={handleStart}
                                    id="begin-interview-btn"
                                >
                                    Begin Interview
                                </button>
                                {!canStart && (
                                    <p className="setup-start-hint">
                                        {mode === 'jd' ? 'Paste a job description to continue' : 'Select a problem to continue'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
