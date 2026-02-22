
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageAdapter } from '../../services/storageAdapter';
import './Dashboard.css';

export default function UserDashboard({ onHome, onStart }) {
    const { currentUser, logout } = useAuth();
    const [history, setHistory] = useState([]);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const userId = currentUser ? currentUser.uid : null; // null for guest

            // Sync if just logged in? handled in Login logic or manually here?
            // simpler: storageAdapter.syncLocalToCloud(userId) should be called *once* on login success.
            // For now, simple fetch.

            const h = await storageAdapter.getInterviewHistory(userId);
            const p = await storageAdapter.getLearningProgress(userId);

            setHistory(h || []);
            setProgress(p || {});
            setLoading(false);
        }
        loadData();
    }, [currentUser]);

    const completedChapters = Object.values(progress).filter(c => c.completed).length;
    const totalInterviews = history.length;
    const avgScore = totalInterviews > 0
        ? (history.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalInterviews).toFixed(1)
        : '-';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="user-info">
                    <h1>{currentUser ? `Welcome back, ${currentUser.displayName}` : 'Guest Dashboard'}</h1>
                    <p>{currentUser ? 'Your progress is synced to the cloud.' : 'Progress saved to this browser.'}</p>
                </div>
                {currentUser && (
                    <button className="logout-btn" onClick={logout}>Sign Out</button>
                )}
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Interviews Completed</h3>
                    <div className="stat-value">{totalInterviews}</div>
                </div>
                <div className="stat-card">
                    <h3>Chapters Read</h3>
                    <div className="stat-value">{completedChapters}</div>
                </div>
                <div className="stat-card">
                    <h3>Avg. Score</h3>
                    <div className="stat-value">{avgScore}</div>
                </div>
            </div>

            <div className="history-section">
                <h2>Recent Activity</h2>
                {loading ? <p>Loading...</p> : (
                    history.length === 0 ? (
                        <div className="empty-state">
                            <p>No interviews yet. Go start one!</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.slice().reverse().map((item, i) => (
                                <div key={i} className="history-item">
                                    <div className="history-meta">
                                        <span className="history-date">{new Date(item.date).toLocaleDateString()}</span>
                                        <span className={`history-score score-${Math.floor(item.score)}`}>{item.score}/10</span>
                                    </div>
                                    <div className="history-details">
                                        <h4>{item.type.toUpperCase()} Design</h4>
                                        <p>{item.topic || 'System Design'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
