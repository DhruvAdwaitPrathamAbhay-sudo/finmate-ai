import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const features = [
    'AI-powered spending insights',
    'Interactive charts & analytics',
    'Goal-based savings tracker',
    'Smart financial predictions',
  ];

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

  return (
    <div className="auth-page" style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#0f111a', position:'relative', overflow:'hidden' }}>
      {/* Background glows / AI shapes */}
      <div className="bg-glow" style={{
        position:'absolute', top:-200, left:-200, width:500, height:500,
        background:'linear-gradient(135deg, #6a82fb, #fc5c7d)', filter:'blur(120px)', borderRadius:'50%'
      }}/>
      <div className="bg-glow" style={{
        position:'absolute', bottom:-150, right:-100, width:400, height:400,
        background:'linear-gradient(135deg, #42e695, #3bb2b8)', filter:'blur(100px)', borderRadius:'50%'
      }}/>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease:[0.4,0,0.2,1] }}
        style={{ zIndex:10, maxWidth:380, width:'90%', padding:32, borderRadius:24, backdropFilter:'blur(20px)', background:'rgba(20,20,35,0.85)', boxShadow:'0 15px 40px rgba(0,0,0,0.4)' }}
      >
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:50, marginBottom:8, background:'linear-gradient(90deg,#6a82fb,#fc5c7d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>💎</div>
          <h1 style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:28, fontWeight:800, background:'linear-gradient(90deg,#6a82fb,#fc5c7d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            FinMate AI
          </h1>
          <p style={{ color:'#aaa', fontSize:13 }}>Smart Finance for Students</p>
        </div>

        {/* Features */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:24 }}>
          {features.map(f=>(
            <div key={f} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#888' }}>
              <CheckCircle size={14} color="#42e695" />
              {f}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', marginBottom:24, background:'#151526', borderRadius:12 }}>
          {['login','signup'].map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{
                flex:1, padding:12, border:'none', borderRadius:12,
                color: mode===m?'#fff':'#888',
                background: mode===m?'linear-gradient(90deg,#6a82fb,#fc5c7d)':'transparent',
                fontWeight:600,
                cursor:'pointer',
                transition:'0.3s'
              }}>
              {m==='login'?'Login':'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity:0, x:20 }}
            animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-20 }}
            transition={{ duration:0.2 }}
            onSubmit={handleSubmit}
            style={{ display:'flex', flexDirection:'column', gap:16 }}
          >
            {mode==='signup' && (
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <label style={{ fontSize:12, color:'#aaa' }}>Full Name</label>
                <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} autoComplete="name"
                  style={{ padding:12, borderRadius:10, border:'1px solid #333', background:'#1b1c2b', color:'#fff', outline:'none' }}
                  onFocus={e=>e.target.style.border='1px solid #6a82fb'} onBlur={e=>e.target.style.border='1px solid #333'} />
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <label style={{ fontSize:12, color:'#aaa' }}>Email Address</label>
              <input name="email" type="email" placeholder="name@university.com" value={form.email} onChange={handleChange} autoComplete="email"
                style={{ padding:12, borderRadius:10, border:'1px solid #333', background:'#1b1c2b', color:'#fff', outline:'none' }}
                onFocus={e=>e.target.style.border='1px solid #6a82fb'} onBlur={e=>e.target.style.border='1px solid #333'} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <label style={{ fontSize:12, color:'#aaa' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input name="password" type={showPw?'text':'password'} placeholder="Enter at least 6 characters" value={form.password} onChange={handleChange} style={{ padding:12, paddingRight:44, borderRadius:10, border:'1px solid #333', background:'#1b1c2b', color:'#fff', outline:'none' }}
                  autoComplete={mode==='signup'?'new-password':'current-password'}
                  onFocus={e=>e.target.style.border='1px solid #6a82fb'} onBlur={e=>e.target.style.border='1px solid #333'}
                />
                <button type="button" onClick={()=>setShowPw(p=>!p)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#aaa' }}>
                  {showPw?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#ef4444' }}>{error}</motion.div>}

            <button type="submit" disabled={loading} style={{
              padding:14, borderRadius:12, border:'none', background:'linear-gradient(90deg,#6a82fb,#fc5c7d)',
              color:'#fff', fontWeight:600, cursor:'pointer', transition:'0.3s'
            }}>
              {loading ? 'Loading...' : mode==='login'?'Login':'Create Account'}
            </button>
          </motion.form>
        </AnimatePresence>

        <p style={{ textAlign:'center', fontSize:11, color:'#aaa', marginTop:16, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
          <Lock size={12}/> Your data is encrypted and private
        </p>
      </motion.div>
    </div>
  );
}
