
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function LoginModal({ onClose }) {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await login();
            onClose(); // Close modal on success
        } catch (err) {
            setError('Failed to sign in. ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal-content" onClick={e => e.stopPropagation()}>
                <div className="login-header">
                    <h2>Sign In</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="login-body">
                    <p>Sign in to sync your progress and interview history across devices.</p>

                    {error && <div className="login-error">{error}</div>}

                    <button
                        className="google-btn"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Continue with Google'}
                    </button>

                    <div className="guest-note">
                        <small>Don't want to sign in? No problem. Your progress is saved to this browser automatically.</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
