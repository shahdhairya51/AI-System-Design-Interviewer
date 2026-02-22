import React, { useState } from 'react'
import './RichContent.css'

export default function CodeTutorial({ title, language, code, steps }) {
    const [activeStep, setActiveStep] = useState(0)

    // Parse code into lines
    const lines = code.trim().split('\n')

    return (
        <div className="code-tutorial-container">
            {title && <h3 className="tutorial-title">{title}</h3>}

            <div className="tutorial-split">
                {/* Left: Code Viewer */}
                <div className="tutorial-code-panel">
                    <div className="code-header">
                        <span className="lang-badge">{language}</span>
                        <div className="code-controls">
                            <button onClick={() => navigator.clipboard.writeText(code)} title="Copy Code">📋</button>
                        </div>
                    </div>
                    <pre className="tutorial-pre">
                        <code>
                            {lines.map((line, i) => {
                                const lineNum = i + 1
                                const step = steps[activeStep]
                                // Check if this line is highlighting by the active step
                                const isHighlighted = step && step.lines && step.lines.includes(lineNum)

                                return (
                                    <div
                                        key={i}
                                        className={`code-line ${isHighlighted ? 'active' : ''}`}
                                    >
                                        <span className="line-num">{lineNum}</span>
                                        <span className="line-content">{line}</span>
                                    </div>
                                )
                            })}
                        </code>
                    </pre>
                </div>

                {/* Right: Explanation Steps */}
                <div className="tutorial-steps-panel">
                    <div className="tutorial-steps-header">
                        <h4>Walkthrough</h4>
                        <span className="step-counter">{activeStep + 1} / {steps.length}</span>
                    </div>
                    <div className="steps-list">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`tutorial-step-card ${index === activeStep ? 'active' : ''}`}
                                onClick={() => setActiveStep(index)}
                            >
                                <div className="step-marker">{index + 1}</div>
                                <div className="step-content">
                                    <h5>{step.title}</h5>
                                    <p>{step.eval || step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
