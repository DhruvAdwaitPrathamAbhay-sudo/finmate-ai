import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye, EyeOff, CheckCircle, Lock, Mail, User, Shield, ArrowRight, Sparkles,
    Brain, ChartPie, Target, ChartLine // feature icons
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ParallaxBackground from '../components/ui/ParallaxBackground';

export default function AuthPage() {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { login } = useApp();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    // Detect system theme
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        const handler = (e) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const features = [
        { text: 'AI-powered insights', icon: Brain },
        { text: 'Interactive analytics', icon: ChartPie },
        { text: 'Goal-based tracker', icon: Target },
        { text: 'Predictive planning', icon: ChartLine },
    ];

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setError('');
        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (mode === 'signup') {
            if (!form.name) {
                setError('Please enter your name.');
                return;
            }
            if (form.password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        }
        if (!form.email.includes('@') || !form.email.includes('.')) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (mode === 'signup') {
                const existing = localStorage.getItem(`finmate_user_${form.email}`);
                if (existing) {
                    setError('Account already exists. Please login.');
                    setLoading(false);
                    return;
                }
                localStorage.setItem(`finmate_user_${form.email}`, JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                }));
                if (rememberMe) {
                    localStorage.setItem('finmate_remembered_email', form.email);
                }
                login(form.email, form.name);
            } else {
                const user = localStorage.getItem(`finmate_user_${form.email}`);
                if (!user) {
                    setError('Account not found. Would you like to sign up instead?');
                    setLoading(false);
                    return;
                }
                const u = JSON.parse(user);
                if (u.password !== form.password) {
                    setError('Incorrect password. Try again or reset your password.');
                    setLoading(false);
                    return;
                }
                if (rememberMe) {
                    localStorage.setItem('finmate_remembered_email', form.email);
                }
                login(form.email, u.name);
            }
            navigate('/dashboard');
            setLoading(false);
        }, 800);
    };

    const fillDemoAccount = () => {
        setForm({
            name: 'Alex Johnson',
            email: 'demo@finmate.com',
            password: 'demo123',
            confirmPassword: 'demo123'
        });
        setMode('login');
    };

    const bgImageUrl = 'https://img.freepik.com/premium-photo/3d-holographic-representation-fintech-technology-concept-with-digital-elements-blue-orange-futuristic-cyber-background_124865-96627.jpg?ga=GA1.1.1347717580.1769188783&w=740&q=80';

    // Helper functions for dynamic colors
    const getTextColor = (light, dark) => (isDark ? dark : light);
    const getBgColor = (light, dark) => (isDark ? dark : light);
    const getBorderColor = (light, dark) => (isDark ? dark : light);


    return (
        <div className="auth-page">
            <ParallaxBackground />
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card"
                style={{ maxWidth: 440, width: '90%', padding: '40px 36px', borderRadius: 32 }}
            >
                {/* Logo Area - chart-line icon */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                        borderRadius: 18,
                        marginBottom: 16,
                        boxShadow: '0 8px 16px -6px rgba(0,0,0,0.2)',
                    }}>
                        <ChartLine size={32} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: getTextColor('#1e293b', '#f1f5f9'),
                        letterSpacing: '-0.3px',
                        marginBottom: 6,
                    }}>FinMate AI</h1>
                    <p style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: getTextColor('#475569', '#94a3b8'),
                    }}>Smart finance, human touch</p>
                </div>

                {/* Features Grid with proper icons */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 32,
                    padding: '8px 0',
                }}>
                    {features.map(({ text, icon: Icon }) => (
                        <div key={text} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 500,
                            color: getTextColor('#334155', '#cbd5e1'),
                        }}>
                            <Icon size={14} color={isDark ? '#60a5fa' : '#2563eb'} />
                            {text}
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                    {['login', 'signup'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                border: 'none',
                                borderRadius: 40,
                                fontWeight: 600,
                                fontSize: 14,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: mode === m ? 'linear-gradient(135deg, #2563eb, #1e40af)' : 'transparent',
                                color: mode === m ? 'white' : getTextColor('#475569', '#94a3b8'),
                                fontFamily: 'inherit',
                            }}
                        >
                            {m === 'login' ? 'Sign in' : 'Create account'}
                        </button>
                    ))}
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                    <motion.form
                        key={mode}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={handleSubmit}
                        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                    >
                        {mode === 'signup' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                    color: getTextColor('#1e293b', '#cbd5e1'),
                                }}>
                                    <User size={14} /> Full name
                                </label>
                                <input
                                    name="name"
                                    placeholder="Alex Johnson"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: 14,
                                        border: `1px solid ${getBorderColor('#e2e8f0', '#334155')}`,
                                        fontSize: 14,
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        background: getBgColor('rgba(255,255,255,0.9)', 'rgba(30,41,59,0.8)'),
                                        color: getTextColor('#0f172a', '#f1f5f9'),
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                                    onBlur={e => e.target.style.borderColor = getBorderColor('#e2e8f0', '#334155')}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 8,
                                color: getTextColor('#1e293b', '#cbd5e1'),
                            }}>
                                <Mail size={14} /> Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 14,
                                    border: `1px solid ${getBorderColor('#e2e8f0', '#334155')}`,
                                    fontSize: 14,
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    background: getBgColor('rgba(255,255,255,0.9)', 'rgba(30,41,59,0.8)'),
                                    color: getTextColor('#0f172a', '#f1f5f9'),
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563eb'}
                                onBlur={e => e.target.style.borderColor = getBorderColor('#e2e8f0', '#334155')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 8,
                                color: getTextColor('#1e293b', '#cbd5e1'),
                            }}>
                                <Lock size={14} /> Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    name="password"
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px 44px 12px 16px',
                                        borderRadius: 14,
                                        border: `1px solid ${getBorderColor('#e2e8f0', '#334155')}`,
                                        fontSize: 14,
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        background: getBgColor('rgba(255,255,255,0.9)', 'rgba(30,41,59,0.8)'),
                                        color: getTextColor('#0f172a', '#f1f5f9'),
                                    }}
                                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                                    onBlur={e => e.target.style.borderColor = getBorderColor('#e2e8f0', '#334155')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(p => !p)}
                                    style={{
                                        position: 'absolute',
                                        right: 14,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: getTextColor('#64748b', '#94a3b8'),
                                    }}
                                >
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {mode === 'signup' && form.password && (
                                <div style={{ marginTop: 6 }}>
                                    <div style={{
                                        height: 3,
                                        background: getBorderColor('#e2e8f0', '#334155'),
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: `${(passwordStrength / 4) * 100}%`,
                                            height: '100%',
                                            backgroundColor: passwordStrength > 2 ? '#10b981' : passwordStrength > 1 ? '#f59e0b' : '#dc2626',
                                            transition: 'width 0.2s',
                                        }} />
                                    </div>
                                    <p style={{
                                        fontSize: 11,
                                        marginTop: 6,
                                        color: getTextColor('#475569', '#94a3b8'),
                                    }}>
                                        {passwordStrength === 0 && 'Weak – use 6+ characters'}
                                        {passwordStrength === 1 && 'Fair – add uppercase or numbers'}
                                        {passwordStrength === 2 && 'Good – almost there'}
                                        {passwordStrength >= 3 && 'Strong password!'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {mode === 'signup' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                    color: getTextColor('#1e293b', '#cbd5e1'),
                                }}>Confirm password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPw ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px 44px 12px 16px',
                                            borderRadius: 14,
                                            border: `1px solid ${getBorderColor('#e2e8f0', '#334155')}`,
                                            fontSize: 14,
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            background: getBgColor('rgba(255,255,255,0.9)', 'rgba(30,41,59,0.8)'),
                                            color: getTextColor('#0f172a', '#f1f5f9'),
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#2563eb'}
                                        onBlur={e => e.target.style.borderColor = getBorderColor('#e2e8f0', '#334155')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPw(p => !p)}
                                        style={{
                                            position: 'absolute',
                                            right: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: getTextColor('#64748b', '#94a3b8'),
                                        }}
                                    >
                                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 16px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                fontSize: 13,
                                color: getTextColor('#334155', '#cbd5e1'),
                            }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ width: 16, height: 16, accentColor: '#2563eb' }}
                                />
                                Remember me
                            </label>
                            {mode === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => alert('A password reset link would be sent to your email.')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: getTextColor('#2563eb', '#60a5fa'),
                                        fontSize: 13,
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        textDecoration: 'underline',
                                        textUnderlineOffset: 2,
                                    }}
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(220,38,38,0.1)',
                                    border: '1px solid rgba(220,38,38,0.2)',
                                    borderRadius: 12,
                                    padding: '10px 14px',
                                    fontSize: 13,
                                    color: '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span>⚠️</span> {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                border: 'none',
                                borderRadius: 40,
                                background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 15,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <><Sparkles size={18} className="animate-spin" /> Please wait...</>
                            ) : (
                                <>{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </motion.form>
                </AnimatePresence>

                {/* Demo button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fillDemoAccount}
                    style={{
                        width: '100%',
                        marginTop: 20,
                        padding: '10px 16px',
                        borderRadius: 40,
                        border: `1px solid ${getBorderColor('#cbd5e1', '#334155')}`,
                        background: 'transparent',
                        color: getTextColor('#1e293b', '#cbd5e1'),
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                    }}
                >
                    <Sparkles size={14} /> Try demo account (demo@finmate.com / demo123)
                </motion.button>

                <div style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: `1px solid ${getBorderColor('#e2e8f0', '#334155')}`,
                    textAlign: 'center',
                    fontSize: 11,
                    color: getTextColor('#475569', '#94a3b8'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}>
                    <Shield size={12} /> Your data is private & secure
                </div>
            </motion.div>
        </div>
    );
}
