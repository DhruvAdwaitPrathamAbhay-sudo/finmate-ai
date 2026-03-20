import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AuthPage() {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const { login } = useApp();
    const navigate = useNavigate();

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
        if (mode === 'signup' && !form.name) { setError('Name is required.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

        setLoading(true);
        setTimeout(() => {
            if (mode === 'signup') {
                const existing = localStorage.getItem(`finmate_user_${form.email}`);
                if (existing) { setError('Account already exists. Please login.'); setLoading(false); return; }
                localStorage.setItem(`finmate_user_${form.email}`, JSON.stringify({ name: form.name, email: form.email, password: form.password }));
                login(form.email, form.name);
            } else {
                const user = localStorage.getItem(`finmate_user_${form.email}`);
                if (!user) { setError('Account not found. Please sign up.'); setLoading(false); return; }
                const u = JSON.parse(user);
                if (u.password !== form.password) { setError('Incorrect password. Try again.'); setLoading(false); return; }
                login(form.email, u.name);
            }
            navigate('/dashboard');
            setLoading(false);
        }, 900);
    }

    const features = [
        'AI-powered spending insights',
        'Interactive charts & analytics',
        'Goal-based savings tracker',
        'Smart financial predictions',
    ];

    return (
        <div className="auth-page">
            {/* Background blobs */}
            <div className="auth-bg-blob" style={{ width: 500, height: 500, background: 'var(--accent-purple)', top: -150, left: -150 }} />
            <div className="auth-bg-blob" style={{ width: 400, height: 400, background: 'var(--accent-blue)', bottom: -100, right: -100 }} />
            <div className="auth-bg-blob" style={{ width: 300, height: 300, background: 'var(--accent-teal)', top: '50%', left: '50%' }} />

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>💎</div>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        FinMate AI
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Smart Finance for Students</p>
                </div>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
                    {features.map(f => (
                        <div key={f} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
                            <CheckCircle size={13} color="var(--accent-green)" />
                            {f}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: 28 }}>
                    {/* Tabs */}
                    <div className="tabs" style={{ marginBottom: 24 }}>
                        <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
                            Login
                        </button>
                        <button className={`tab-btn ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
                            Sign Up
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={mode}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                        >
                            {mode === 'signup' && (
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} autoComplete="name" />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Email Address</label>
                                <input name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} autoComplete="email" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="password"
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="Min 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        style={{ paddingRight: 44 }}
                                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(p => !p)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    >
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent-red)' }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 15 }} disabled={loading}>
                                {loading ? (
                                    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <span className="typing-dot" style={{ width: 6, height: 6 }} />
                                        <span className="typing-dot" style={{ width: 6, height: 6 }} />
                                        <span className="typing-dot" style={{ width: 6, height: 6 }} />
                                    </span>
                                ) : mode === 'login' ? '🚀 Login to FinMate' : '✨ Create Account'}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                </div>

                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
                    🛡️ This app provides financial insights for educational purposes only.
                </p>
            </motion.div>
        </div>
    );
}
