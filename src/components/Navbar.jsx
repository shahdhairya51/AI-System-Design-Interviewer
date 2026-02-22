
import './Navbar.css'

export default function Navbar({ onLearn, onDashboard, onHome, onSignIn, navLinks = [] }) {

    const handleNavClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div className="navbar-brand" onClick={onHome}>
                    <img src="/Logo.png" alt="DesignDrill" className="navbar-logo" />
                    <span className="brand-name">DesignDrill</span>
                </div>

                <div className="navbar-links">
                    {navLinks.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, link.href)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="navbar-actions">
                    <button className="btn btn-ghost btn-sm" onClick={onLearn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        Curriculum
                    </button>
                </div>
            </div>
        </nav>
    )
}
