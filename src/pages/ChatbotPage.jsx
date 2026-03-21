import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Send, Bot, Sparkles } from 'lucide-react';
import { generateAIResponse } from '../data/aiResponses';
import GlassCard from '../components/ui/GlassCard';
import MagneticButton from '../components/ui/MagneticButton';

const SUGGESTIONS = [
    "Analyze my spending",
    "How can I save more?",
    "Investment tips for students",
    "What's my risk level?",
    "Predict next month expenses",
    "Give me saving tips",
];

function TypingIndicator() {
    return (
        <div className="chat-bubble ai" style={{ padding: '12px 16px' }}>
            <div className="typing-dots">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
            </div>
        </div>
    );
}

function formatMessage(text) {
    return text.split('\n').map((line, i) => {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ lineHeight: 1.6 }} />;
    });
}

export default function ChatbotPage() {
    const { expenses, goals, monthlyIncome } = useApp();
    const [messages, setMessages] = useState([
        {
            id: '0',
            role: 'ai',
            text: `👋 Hi! I'm **FinMate AI**, your personal finance assistant!\n\nI can help you with spending analysis, savings tips, investment advice, and more. What would you like to know?`,
            time: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    function sendMessage(text) {
        if (!text.trim() || isTyping) return;
        const userMsg = { id: Date.now().toString(), role: 'user', text: text.trim(), time: new Date() };
        setMessages(m => [...m, userMsg]);
        setInput('');
        setIsTyping(true);

        const delay = 1200 + Math.random() * 1000;
        setTimeout(() => {
            const response = generateAIResponse(text, expenses, goals, monthlyIncome);
            const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: response, time: new Date() };
            setMessages(m => [...m, aiMsg]);
            setIsTyping(false);
        }, delay);
    }

    function handleSubmit(e) {
        e.preventDefault();
        sendMessage(input);
    }

    const helpItems = [
        { icon: '📊', title: 'Spending Analysis', desc: 'Detailed spending pattern breakdown' },
        { icon: '💰', title: 'Savings Tips', desc: 'Personalized advice to save more' },
        { icon: '📈', title: 'Investment Advice', desc: 'Student-friendly strategies' },
        { icon: '⚠️', title: 'Budget Warnings', desc: 'Overspending alerts' },
        { icon: '🎯', title: 'Goal Planning', desc: 'Reach goals faster' },
        { icon: '🔮', title: 'Financial Forecast', desc: 'Predict future expenses' },
    ];

    return (
        <div className="page-wrapper">
            <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h2 className="page-title">🤖 AI Financial Assistant</h2>
                    <p className="page-subtitle">Get personalized financial insights powered by AI</p>
                </div>
                <span className="badge badge-green" style={{ padding: '6px 14px' }}>
                    <span style={{ width: 7, height: 7, background: 'var(--accent-green)', borderRadius: '50%', display: 'inline-block', marginRight: 6, animation: 'pulse-ring 2s infinite' }} />
                    Online
                </span>
            </motion.div>

            <div className="two-col" style={{ alignItems: 'start' }}>
                {/* Chat Window */}
                <GlassCard delay={0.05} style={{ gridColumn: '1 / -1' }} tilt={false}>
                    {/* Header */}
                    <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <motion.div
                            style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Bot size={22} color="white" />
                        </motion.div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>FinMate AI</div>
                            <div style={{ fontSize: 12, color: 'var(--accent-green)' }}>
                                {isTyping ? '✏️ Thinking...' : '● Always here to help'}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {SUGGESTIONS.map(s => (
                            <MagneticButton
                                key={s}
                                variant="secondary"
                                size="sm"
                                style={{ fontSize: 12 }}
                                onClick={() => sendMessage(s)}
                                disabled={isTyping}
                            >
                                {s}
                            </MagneticButton>
                        ))}
                    </div>

                    {/* Messages */}
                    <div className="chat-messages" style={{ height: 420, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <AnimatePresence>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}
                                >
                                    {msg.role === 'ai' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', paddingLeft: 4 }}>
                                            <Sparkles size={11} color="var(--accent-purple)" /> FinMate AI
                                        </div>
                                    )}
                                    <div className={`chat-bubble ${msg.role}`}>
                                        {formatMessage(msg.text)}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 4px' }}>
                                        {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isTyping && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 4 }}>
                                    <Sparkles size={11} color="var(--accent-purple)" /> FinMate AI
                                </div>
                                <TypingIndicator />
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="chat-input-row">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask anything about your finances..."
                            disabled={isTyping}
                            style={{ flex: 1 }}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                        />
                        <MagneticButton type="submit" disabled={!input.trim() || isTyping} style={{ padding: '10px 16px' }}>
                            <Send size={16} />
                        </MagneticButton>
                    </form>
                </GlassCard>
            </div>

            {/* Tips */}
            <GlassCard delay={0.15} style={{ padding: 20, marginTop: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>💡 What I can help with</h3>
                <motion.div
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
                >
                    {helpItems.map(item => (
                        <motion.div
                            key={item.title}
                            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px', background: 'var(--bg-card)', borderRadius: 10, border: '1px solid var(--border)' }}
                        >
                            <span style={{ fontSize: 20 }}>{item.icon}</span>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </GlassCard>
        </div>
    );
}
