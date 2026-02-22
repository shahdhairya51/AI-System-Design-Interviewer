import Navbar from '../Navbar'
import { trackInterviewStart } from '../../services/telemetry'
import './Landing.css'

// Simple SVG Icons (Lucide-style)
const Icons = {
    Layers: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    ),
    Sparkles: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
    ),
    Play: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}><polygon points="5 3 19 12 5 21 5 3" /></svg>
    ),
    BookOpen: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    ),
    Cpu: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 1h6" /><path d="M9 23h6" /><path d="M1 9v6" /><path d="M23 9v6" /></svg>
    ),
    PenTool: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
    ),
    Target: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
    ),
    Video: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" ry="2" /></svg>
    ),
    Code: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    ),
    Map: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" /></svg>
    ),
    ArrowRight: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
    ),
    Linkedin: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    ),
    Mail: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    ShieldCheck: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    Zap: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
    Calculator: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
    ),
    History: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
    ),
    GraduationCap: ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
    ),
}

const LANDING_NAV_LINKS = [
    { label: 'The Core', href: '#engine' },
    { label: 'Features', href: '#features' },
    { label: 'Process', href: '#process' }
]

export default function Landing({ onStart, onLearn, onDashboard }) {

    const handleStartInterview = async () => {
        // Start tracking immediately when they click start
        // Actual problem tracking happens in the Selection view which calls onStart
        onStart()
    }

    return (
        <div className="landing">
            <Navbar
                onLearn={onLearn}
                onDashboard={onDashboard}
                onHome={() => {
                    const hero = document.querySelector('#hero')
                    if (hero) hero.scrollIntoView({ behavior: 'smooth' })
                }}
                navLinks={LANDING_NAV_LINKS}
            />

            {/* Background Effects */}
            <div className="landing-bg">
                <div className="landing-glow landing-glow-1" />
                <div className="landing-glow landing-glow-2" />
                <div className="landing-grid-overlay" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="hero">
                <div className="container hero-container">
                    <div className="hero-content-wrapper">
                        <div className="hero-content animate-fade-in-up">
                            <div className="hero-pill">
                                <span className="hero-pill-icon"><Icons.Sparkles size={14} /></span>
                                <span>AI-Powered System Design Prep</span>
                            </div>
                            <h1 className="hero-title">
                                Master the <span className="text-gradient">System Design</span> Interview
                            </h1>
                            <p className="hero-subtitle">
                                Simulate real FAANG-style interviews with an adaptive AI.
                                Practice architecture, trade-offs, and communication in a realistic environment.
                            </p>

                            <div className="hero-cta-group">
                                <button className="btn btn-primary btn-xl" onClick={handleStartInterview}>
                                    <Icons.Play size={20} /> Start Mock Interview
                                </button>
                                <button className="btn btn-secondary btn-xl" onClick={onLearn}>
                                    <Icons.Map size={20} /> View Roadmap
                                </button>
                            </div>

                            <div className="hero-stats">
                                <StatItem value="30+" label="Real Problems" />
                                <div className="stat-separator" />
                                <StatItem value="HLD/LLD" label="Dual Track" />
                                <div className="stat-separator" />
                                <StatItem value="Detailed" label="AI Feedback" />
                            </div>
                        </div>

                        <div className="hero-visual animate-fade-in">
                            <div className="video-mockup-frame">
                                <div className="video-mockup-header">
                                    <div className="video-mockup-dots">
                                        <span className="dot" />
                                        <span className="dot" />
                                        <span className="dot" />
                                    </div>
                                    <div className="video-mockup-url">designdrill.ai/live-interview</div>
                                </div>
                                <video
                                    className="hero-video"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    poster="/vite.svg"
                                >
                                    <source src="/Landing_page_gif.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="video-overlay-glow" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Engineering Standard Section */}
            <section id="engine" className="section trust-section">
                <div className="container">
                    <div className="section-header animate-fade-in">
                        <span className="section-badge">Engineering Rigor</span>
                        <h2 className="section-title">The <span className="text-gradient">Engineering Standard</span></h2>
                        <p className="section-desc">We built the engine we wished we had during our own senior-level interviews at Google and Meta. No marketing fluff—just technical precision.</p>
                    </div>

                    <div className="trust-grid">
                        <div className="trust-main-visual animate-fade-in-left">
                            <div className="engine-schematic-container">
                                <div className="engine-schematic">
                                    <div className="schematic-core">
                                        <div className="core-node pulse">Cognitive Engine</div>
                                        <div className="core-rings">
                                            <div className="ring ring-1"></div>
                                            <div className="ring ring-2"></div>
                                            <div className="ring ring-3"></div>
                                        </div>
                                    </div>
                                    <div className="schematic-highlights">
                                        <div className="schematic-item item-ledger">
                                            <div className="item-dot"></div>
                                            <span>State Ledger</span>
                                        </div>
                                        <div className="schematic-item item-math">
                                            <div className="item-dot"></div>
                                            <span>Math Audit</span>
                                        </div>
                                        <div className="schematic-item item-conflicts">
                                            <div className="item-dot"></div>
                                            <span>Conflict Bank</span>
                                        </div>
                                        <div className="schematic-item item-pacing">
                                            <div className="item-dot"></div>
                                            <span>Dynamic Pacing</span>
                                        </div>
                                        <div className="schematic-item item-probes">
                                            <div className="item-dot"></div>
                                            <span>Adversarial Probes</span>
                                        </div>
                                        <div className="schematic-item item-rubric">
                                            <div className="item-dot"></div>
                                            <span>FAANG Rubric</span>
                                        </div>
                                        <div className="schematic-item item-extraction">
                                            <div className="item-dot"></div>
                                            <span>Extraction Pass</span>
                                        </div>
                                        <div className="schematic-item item-signals">
                                            <div className="item-dot"></div>
                                            <span>Signal Detection</span>
                                        </div>
                                        <div className="schematic-item item-history">
                                            <div className="item-dot"></div>
                                            <span>State History</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="trust-cards animate-fade-in-right">
                            {TRUST_USPS.map((usp, i) => (
                                <div className="trust-card" key={i}>
                                    <div className="trust-card-icon">{usp.icon}</div>
                                    <div className="trust-card-content">
                                        <h3 className="trust-card-title">{usp.title}</h3>
                                        <p className="trust-card-desc">{usp.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Features Grid (Bento Style) */}
            <section id="features" className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything you need to <span className="text-gradient">level up</span></h2>
                        <p className="section-desc">A complete platform built by engineers to mirror the actual interview experience.</p>
                    </div>

                    <div className="bento-grid">
                        <BentoCard
                            icon={<Icons.Cpu />}
                            title="Adaptive AI Interviewer"
                            desc="Challenges your design choices and adapts complexity based on your responses."
                            className="bento-large"
                        />
                        <BentoCard
                            icon={<Icons.PenTool />}
                            title="Interactive Whiteboard"
                            desc="Draw architectures with a real-time system design canvas."
                        />
                        <BentoCard
                            icon={<Icons.Target />}
                            title="FAANG Rubrics"
                            desc="Scored on 5 key dimensions used by top tech companies."
                        />
                        <BentoCard
                            icon={<Icons.Video />}
                            title="Session Recording"
                            desc="Review your performance to identify communication gaps."
                        />
                        <BentoCard
                            icon={<Icons.Code />}
                            title="Full Stack Coverage"
                            desc="From high-level architecture to low-level class design."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="process" className="section steps-section">
                <div className="container">
                    <div className="section-header center">
                        <span className="section-badge animate-fade-in">Process</span>
                        <h2 className="section-title">How <span className="text-gradient">DesignDrill</span> Works</h2>
                        <p className="section-desc">Three simple steps to mastering your next interview.</p>
                    </div>
                    <div className="steps-flow">
                        {STEPS.map((step, i) => (
                            <div className="step-item" key={i}>
                                <div className="step-marker-container">
                                    <div className="step-marker">
                                        <div className="step-number">{i + 1}</div>
                                        <div className="step-marker-glow" />
                                    </div>
                                    {i < STEPS.length - 1 && <div className="step-line" />}
                                </div>
                                <div className="step-card">
                                    <div className="step-icon-box">{step.icon}</div>
                                    <div className="step-content">
                                        <h3 className="step-title">{step.title}</h3>
                                        <p className="step-desc">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-content">
                            <h2 className="cta-title">Ready to practice?</h2>
                            <p className="cta-desc">No signup required. Start your first mock interview in seconds.</p>
                            <button className="btn btn-primary btn-lg" onClick={onStart}>
                                Start Interview Now <Icons.ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-left">
                            <div className="footer-brand">
                                <img src="/Logo.png" alt="DesignDrill" className="footer-logo" />
                                <span className="text-gradient">DesignDrill</span>
                            </div>
                            <p className="footer-tagline">Master the art of system design with AI-powered mock interviews.</p>
                        </div>

                        <div className="footer-right">
                            <div className="footer-info">
                                <span className="footer-label">Developed by</span>
                                <h4 className="footer-name">Dhairya Shah</h4>
                                <div className="footer-socials">
                                    <a href="https://www.linkedin.com/in/dhairya-shah-582b3a21b/" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                                        <Icons.Linkedin size={20} />
                                    </a>
                                    <a href="mailto:shahdhairya51@gmail.com" className="social-link" title="Email">
                                        <Icons.Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © {new Date().getFullYear()} DesignDrill. All rights reserved.
                        </div>
                        <div className="footer-contact">
                            shahdhairya51@gmail.com
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function StatItem({ value, label }) {
    return (
        <div className="stat-item">
            <span className="stat-val">{value}</span>
            <span className="stat-lbl">{label}</span>
        </div>
    )
}

function BentoCard({ icon, title, desc, className = '' }) {
    return (
        <div className={`bento-card ${className}`}>
            <div className="bento-icon">{icon}</div>
            <h3 className="bento-title">{title}</h3>
            <p className="bento-desc">{desc}</p>
        </div>
    )
}

const STEPS = [
    {
        title: 'Choose a Problem',
        desc: 'Select from 30+ tailored scenarios or paste a custom JD.',
        icon: <Icons.Target size={24} />
    },
    {
        title: 'Design & Discuss',
        desc: 'Solve the problem on the whiteboard while the AI grills you.',
        icon: <Icons.PenTool size={24} />
    },
    {
        title: 'Get Feedback',
        desc: 'Receive a detailed score and actionable tips to improve.',
        icon: <Icons.Sparkles size={24} />
    }
]

const TRUST_USPS = [
    {
        title: "FAANG-Calibrated Knowledge",
        desc: "Calibrated on 1,000+ real Senior interviews from Google, Meta, and Amazon.",
        icon: <Icons.ShieldCheck size={28} />
    },
    {
        title: "Adversarial \"Conflict Bank\"",
        desc: "Expert-calibrated 'Curveballs' triggered once you reach architectural depth.",
        icon: <Icons.Zap size={28} />
    },
    {
        title: "Programmatic Arithmetic Audit",
        desc: "Secondary validator audits your QPS and storage throughput in real-time.",
        icon: <Icons.Calculator size={28} />
    },
    {
        title: "Deterministic Design Ledger",
        desc: "Persistent state tracking ensures 100% consistency across deep dives.",
        icon: <Icons.History size={28} />
    }
]


