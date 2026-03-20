import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus, Target, Trash2, X, Check, Plus as PlusIcon } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const GOAL_ICONS = ['🎯', '💻', '✈️', '📱', '🎓', '🚗', '🏠', '💍', '📷', '🎮', '👟', '🎵'];
const AI_SUGGESTIONS = {
    default: 'Set aside a fixed amount daily to reach your goal faster. Even ₹50/day = ₹1,500/month!',
    '25': 'Great start! You\'re 25% there. Increase your monthly contribution by 10% to finish 3 weeks early!',
    '50': 'Halfway there! 🎉 Keep the momentum going. You\'re doing amazing!',
    '75': 'Almost done! 🌟 Just one more push. Cut one unnecessary expense this week to cross the finish line!',
    '100': '🎊 Congratulations! You\'ve reached your goal! Time to set a new one!',
};

function GoalModal({ onSave, onClose }) {
    const [form, setForm] = useState({ name: '', target: '', icon: '🎯', deadline: '' });
    function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }
    function handleSubmit(e) {
        e.preventDefault();
        if (!form.name || !form.target) return;
        onSave({ ...form, target: Number(form.target) });
    }
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div className="modal-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <div className="modal-header">
                    <h3 className="modal-title">🎯 New Savings Goal</h3>
                    <button className="btn-icon" onClick={onClose}><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label>Goal Name *</label>
                        <input name="name" placeholder="e.g. New Laptop, Trip to Goa..." value={form.name} onChange={handleChange} required autoFocus />
                    </div>
                    <div className="form-group">
                        <label>Target Amount (₹) *</label>
                        <input name="target" type="number" min="1" placeholder="50000" value={form.target} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Choose Icon</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {GOAL_ICONS.map(icon => (
                                <button
                                    type="button"
                                    key={icon}
                                    onClick={() => setForm(f => ({ ...f, icon }))}
                                    style={{
                                        width: 40, height: 40, fontSize: 20, borderRadius: 8, border: '2px solid',
                                        borderColor: form.icon === icon ? 'var(--accent-purple)' : 'var(--border)',
                                        background: form.icon === icon ? 'rgba(139,92,246,0.15)' : 'var(--bg-input)',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Target Date (optional)</label>
                        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                            <Check size={15} /> Create Goal
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function ContributeModal({ goal, onSave, onClose }) {
    const [amount, setAmount] = useState('');
    function handleSubmit(e) {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return;
        onSave({ ...goal, saved: Math.min(goal.target, goal.saved + Number(amount)) });
        onClose();
    }
    const remaining = goal.target - goal.saved;
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div className="modal-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                <div className="modal-header">
                    <h3 className="modal-title">{goal.icon} Add Contribution</h3>
                    <button className="btn-icon" onClick={onClose}><X size={16} /></button>
                </div>
                <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <strong>{goal.name}</strong> — Still needs {formatCurrency(remaining)} more
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label>Add Amount (₹)</label>
                        <input type="number" min="1" max={remaining} placeholder={`Max: ${remaining}`} value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[500, 1000, 2000, 5000].filter(v => v <= remaining).map(v => (
                            <button key={v} type="button" className="btn btn-secondary btn-sm" onClick={() => setAmount(String(v))}>₹{v}</button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                            <Check size={15} /> Add Savings
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function GoalsPage() {
    const { goals, addGoal, updateGoal, deleteGoal } = useApp();
    const [showAdd, setShowAdd] = useState(false);
    const [contributeGoal, setContributeGoal] = useState(null);

    function getAISuggestion(pct) {
        if (pct >= 100) return AI_SUGGESTIONS['100'];
        if (pct >= 75) return AI_SUGGESTIONS['75'];
        if (pct >= 50) return AI_SUGGESTIONS['50'];
        if (pct >= 25) return AI_SUGGESTIONS['25'];
        return AI_SUGGESTIONS.default;
    }

    function getDeadlineInfo(goal) {
        if (!goal.deadline) return null;
        const deadline = new Date(goal.deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return { text: 'Deadline passed!', color: 'var(--accent-red)' };
        if (daysLeft < 7) return { text: `${daysLeft} days left`, color: 'var(--accent-orange)' };
        return { text: `${daysLeft} days left`, color: 'var(--text-muted)' };
    }

    const totalTarget = goals.reduce((s, g) => s + Number(g.target), 0);
    const totalSaved = goals.reduce((s, g) => s + Number(g.saved), 0);
    const completed = goals.filter(g => g.saved >= g.target).length;

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h2 className="page-title">🎯 Savings Goals</h2>
                    <p className="page-subtitle">Track your financial goals and celebrate milestones</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                    <Plus size={16} /> New Goal
                </button>
            </div>

            {/* Summary Stats */}
            {goals.length > 0 && (
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Active Goals', value: goals.length, sub: `${completed} completed` },
                        { label: 'Total Target', value: formatCurrency(totalTarget), sub: 'Combined goal value' },
                        { label: 'Total Saved', value: formatCurrency(totalSaved), sub: `${Math.round((totalSaved / totalTarget) * 100)}% overall progress` },
                        { label: 'Remaining', value: formatCurrency(Math.max(0, totalTarget - totalSaved)), sub: 'To reach all goals' },
                    ].map((card, i) => (
                        <motion.div key={card.label} className="glass-card stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                            <div className="stat-label">{card.label}</div>
                            <div className="stat-value mono">{card.value}</div>
                            <div className="stat-sub">{card.sub}</div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Goals list */}
            {goals.length === 0 ? (
                <motion.div className="glass-card empty-state" style={{ padding: 60 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>🎯</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No Goals Yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 300, margin: '0 auto 24px', lineHeight: 1.6 }}>
                        Set your first savings goal and watch your progress grow! Whether it's a new laptop, trip, or emergency fund.
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                        <Plus size={16} /> Set Your First Goal
                    </button>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                        {goals.map((goal, i) => {
                            const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
                            const isComplete = pct >= 100;
                            const dl = getDeadlineInfo(goal);
                            const dailyNeeded = goal.deadline ? Math.ceil((goal.target - goal.saved) / Math.max(1, Math.ceil((new Date(goal.deadline) - new Date()) / 86400000))) : null;

                            return (
                                <motion.div
                                    key={goal.id}
                                    className="glass-card"
                                    style={{ padding: 24, position: 'relative', overflow: 'hidden', border: isComplete ? '1px solid rgba(34,197,94,0.3)' : undefined }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    layout
                                >
                                    {isComplete && (
                                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 99, padding: '3px 10px', fontSize: 11, color: 'var(--accent-green)', fontWeight: 700 }}>
                                            ✓ COMPLETE
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
                                        <div style={{ fontSize: 36 }}>{goal.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 16 }}>{goal.name}</div>
                                            {dl && <div style={{ fontSize: 12, color: dl.color, marginTop: 3 }}>⏰ {dl.text}</div>}
                                        </div>
                                        <button className="btn-icon btn-danger" onClick={() => deleteGoal(goal.id)} title="Delete goal">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    {/* Progress */}
                                    <div style={{ marginBottom: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                                            <span style={{ fontWeight: 700, color: isComplete ? 'var(--accent-green)' : 'var(--accent-purple)' }}>{pct}%</span>
                                        </div>
                                        <div className="progress-bar-wrap" style={{ height: 10 }}>
                                            <motion.div
                                                className={`progress-bar-fill ${isComplete ? '' : ''}`}
                                                style={{ background: isComplete ? 'linear-gradient(90deg, #22c55e, #14b8a6)' : 'var(--grad-primary)' }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.08 }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                                            <span className="mono">{formatCurrency(goal.saved)} saved</span>
                                            <span className="mono">Goal: {formatCurrency(goal.target)}</span>
                                        </div>
                                    </div>

                                    {/* AI Suggestion */}
                                    <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                                        🤖 {getAISuggestion(pct)}
                                        {dailyNeeded && !isComplete && (
                                            <div style={{ marginTop: 6, fontWeight: 600, color: 'var(--accent-purple)' }}>
                                                Save {formatCurrency(dailyNeeded)}/day to reach your deadline!
                                            </div>
                                        )}
                                    </div>

                                    {!isComplete && (
                                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setContributeGoal(goal)}>
                                            <PlusIcon size={14} /> Add Savings
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showAdd && <GoalModal onSave={g => { addGoal(g); setShowAdd(false); }} onClose={() => setShowAdd(false)} />}
                {contributeGoal && <ContributeModal goal={contributeGoal} onSave={updateGoal} onClose={() => setContributeGoal(null)} />}
            </AnimatePresence>
        </div>
    );
}
