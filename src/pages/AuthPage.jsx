import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const TICKER_ITEMS = [
  { label: 'Avg. saved / month', value: '$284', delta: '+12%' },
  { label: 'Budgets tracked', value: '14.2k', delta: '+890' },
  { label: 'Overspend prevented', value: '$1.1M', delta: 'total' },
  { label: 'Goals hit this week', value: '3,412', delta: '↑ 22%' },
];

const PANELS = [
  { icon: TrendingUp, heading: 'See where every\ndollar actually goes.', sub: 'AI maps your spending in real time — no spreadsheets, no guesswork.' },
  { icon: Zap, heading: 'Forecasts before\nyou even ask.', sub: 'Predictive insights surface patterns weeks ahead of when they'd hit you.' },
  { icon: Shield, heading: 'Built for students,\nnot banks.', sub: 'No fees, no ads, no data selling. Just clarity for your financial life.' },
];

function Ticker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER_ITEMS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const item = TICKER_ITEMS[idx];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, marginTop: 'auto' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8FF5E', flexShrink: 0, boxShadow: '0 0 8px #B8FF5E' }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}
        >
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em' }}>{item.value}</span>
          <span style={{ fontSize: 11, color: '#B8FF5E', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.delta}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.02em' }}>{item.label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RotatingPanel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PANELS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const p = PANELS[idx];
  const Icon = p.icon;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: 'rgba(184,255,94,0.12)',
            border: '1px solid rgba(184,255,94,0.25)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 28
          }}>
            <Icon size={20} color="#B8FF5E" strokeWidth={1.5} />
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 3vw, 38px)',
            fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.04em',
            whiteSpace: 'pre-line', marginBottom: 16
          }}>
            {p.heading}
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, maxWidth: 320, fontFamily: "'DM Sans', sans-serif" }}>
            {p.sub}
          </p>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 6, marginTop: 32 }}>
        {PANELS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            height: 3, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: i === idx ? '#B8FF5E' : 'rgba(255,255,255,0.15)',
            width: i === idx ? 28 : 8,
            padding: 0,
            transition: 'all 0.35s ease'
          }} />
        ))}
      </div>
    </div>
  );
}

function FloatingLabel({ label, children, focused, hasValue }) {
  return (
    <div style={{ position: 'relative', paddingTop: 20 }}>
      <motion.label
        animate={{
          top: focused || hasValue ? 2 : 20,
          fontSize: focused || hasValue ? 10 : 14,
          color: focused ? '#1a1a2e' : '#9ca3af',
          fontWeight: focused || hasValue ? 700 : 400,
          letterSpacing: focused || hasValue ? '0.08em' : '0',
          textTransform: focused || hasValue ? 'uppercase' : 'none',
        }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'absolute', left: 0, pointerEvents: 'none',
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1
        }}
      >
        {label}
      </motion.label>
      {children}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Fill in all fields to continue.'); return; }
    if (mode === 'signup' && !form.name) { setError('We need your name.'); return; }
    if (form.password.length < 6) { setError('Password needs at least 6 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (mode === 'signup') {
        const existing = localStorage.getItem(`finmate_user_${form.email}`);
        if (existing) { setError('That email already has an account.'); setLoading(false); return; }
        localStorage.setItem(`finmate_user_${form.email}`, JSON.stringify({ name: form.name, email: form.email, password: form.password }));
        login(form.email, form.name);
      } else {
        const user = localStorage.getItem(`finmate_user_${form.email}`);
        if (!user) { setError('No account found — try signing up.'); setLoading(false); return; }
        const u = JSON.parse(user);
        if (u.password !== form.password) { setError('Wrong password. Give it another shot.'); setLoading(false); return; }
        login(form.email, u.name);
      }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 700);
      setLoading(false);
    }, 900);
  }

  const inputBase = {
    width: '100%', background: 'none', border: 'none',
    borderBottom: '1.5px solid #e5e7eb', outline: 'none',
    padding: '8px 0', fontSize: 15, color: '#1a1a2e',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        .fm-input-focused { border-bottom-color: #1a1a2e !important; }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes noise-shift { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1px,1px)} 50%{transform:translate(1px,-1px)} 75%{transform:translate(-1px,-1px)} }
        .fm-spinner { width: 18px; height: 18px; border: 2px solid rgba(26,26,46,0.15); border-top-color: #1a1a2e; border-radius: 50%; animation: spin-slow 0.7s linear infinite; }
        ::placeholder { color: transparent !important; }
      `}</style>

      <div style={{
        display: 'flex', height: '100vh', width: '100vw',
        fontFamily: "'DM Sans', sans-serif", overflow: 'hidden'
      }}>
        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '48%', background: '#0d0d14',
            padding: 'clamp(36px, 5vw, 60px)',
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Grain texture */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
            pointerEvents: 'none',
          }} />

          {/* Decorative circle */}
          <div style={{
            position: 'absolute', right: -120, top: -120,
            width: 380, height: 380, borderRadius: '50%',
            border: '1px solid rgba(184,255,94,0.07)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', right: -80, top: -80,
            width: 260, height: 260, borderRadius: '50%',
            border: '1px solid rgba(184,255,94,0.05)',
            pointerEvents: 'none'
          }} />

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: '#B8FF5E', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TrendingUp size={18} color="#0d0d14" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' }}>
              FinMate
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#B8FF5E',
              background: 'rgba(184,255,94,0.1)', border: '1px solid rgba(184,255,94,0.2)',
              borderRadius: 4, padding: '2px 6px', marginLeft: 2
            }}>AI</span>
          </div>

          <RotatingPanel />
          <Ticker />
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            flex: 1, background: '#fafaf8',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(32px, 5vw, 64px)',
            position: 'relative', overflowY: 'auto',
          }}
        >
          {/* Corner decorative text */}
          <div style={{
            position: 'absolute', top: 28, right: 28,
            fontFamily: "'Syne', sans-serif", fontSize: 11,
            fontWeight: 700, color: '#d1d5db', letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            Smart Finance
          </div>

          <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Mode switcher */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 44, borderBottom: '1.5px solid #e5e7eb' }}>
              {['login', 'signup'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setForm({ name: '', email: '', password: '' }); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0 0 14px 0', marginRight: 28,
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: mode === m ? '#1a1a2e' : '#9ca3af',
                    position: 'relative', transition: 'color 0.2s',
                  }}
                >
                  {m === 'login' ? 'Sign in' : 'Create account'}
                  {mode === m && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{
                        position: 'absolute', bottom: -1.5, left: 0, right: 0,
                        height: 2, background: '#1a1a2e', borderRadius: 99,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + '-heading'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: 36 }}
              >
                <h1 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: 'clamp(26px, 3.5vw, 36px)', color: '#1a1a2e',
                  letterSpacing: '-0.04em', lineHeight: 1.15
                }}>
                  {mode === 'login' ? 'Welcome\nback.' : 'Let\'s get\nyou set up.'}
                </h1>
                <p style={{ marginTop: 10, fontSize: 14, color: '#6b7280', fontWeight: 400, lineHeight: 1.6 }}>
                  {mode === 'login'
                    ? 'Your finances missed you. Pick up right where you left off.'
                    : 'Takes 30 seconds. No credit card, no nonsense.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
              >
                {mode === 'signup' && (
                  <FloatingLabel label="Full name" focused={focused === 'name'} hasValue={!!form.name}>
                    <input
                      name="name" value={form.name} onChange={handleChange}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                      autoComplete="name"
                      className={focused === 'name' ? 'fm-input-focused' : ''}
                      style={inputBase}
                    />
                  </FloatingLabel>
                )}
                <FloatingLabel label="Email address" focused={focused === 'email'} hasValue={!!form.email}>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    autoComplete="email"
                    className={focused === 'email' ? 'fm-input-focused' : ''}
                    style={inputBase}
                  />
                </FloatingLabel>
                <FloatingLabel label="Password" focused={focused === 'password'} hasValue={!!form.password}>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="password" type={showPw ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      className={focused === 'password' ? 'fm-input-focused' : ''}
                      style={{ ...inputBase, paddingRight: 32 }}
                    />
                    <button
                      type="button" onClick={() => setShowPw(p => !p)}
                      style={{
                        position: 'absolute', right: 0, bottom: 10,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#9ca3af', padding: 0, lineHeight: 0,
                        transition: 'color 0.15s',
                      }}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FloatingLabel>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 13, color: '#dc2626',
                        fontWeight: 500, lineHeight: 1.5,
                        paddingLeft: 12, borderLeft: '2px solid #dc2626',
                        marginTop: -8,
                      }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading || success}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: success ? '#B8FF5E' : '#1a1a2e',
                    color: success ? '#0d0d14' : '#fff',
                    border: 'none', borderRadius: 12, padding: '15px 24px',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                    letterSpacing: '-0.02em', cursor: loading ? 'default' : 'pointer',
                    width: '100%', transition: 'background 0.3s, color 0.3s',
                    marginTop: 4,
                    boxShadow: success ? '0 0 24px rgba(184,255,94,0.35)' : '0 4px 24px rgba(13,13,20,0.18)',
                  }}
                >
                  {loading ? (
                    <div className="fm-spinner" />
                  ) : success ? (
                    <>Redirecting you ✓</>
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign in to FinMate' : 'Create my account'}
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Footer note */}
            <p style={{
              marginTop: 28, fontSize: 12, color: '#9ca3af',
              lineHeight: 1.65, textAlign: 'center',
              fontWeight: 400,
            }}>
              For educational use only. Your data stays on your device.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
