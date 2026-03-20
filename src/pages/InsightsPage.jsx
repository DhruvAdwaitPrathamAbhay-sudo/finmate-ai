import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getMonthExpenses, getCategoryTotals, getRiskLevel, detectSubscriptions, formatCurrency, getTotalAmount } from '../utils/calculations';
import { AlertTriangle, Lightbulb, TrendingDown, RefreshCw, Shield } from 'lucide-react';

const CATEGORY_EMOJIS = {
    Food: '🍱', Transportation: '🚌', Education: '📚',
    Entertainment: '🎬', Shopping: '🛒', Bills: '📱',
    Healthcare: '💊', Others: '📦'
};

const SAVING_TIPS = {
    Food: ['Cook meals at home 4 days a week to save 30-40%', 'Use student meal cards & combo offers', 'Avoid food delivery apps — markup is 25-40%'],
    Transportation: ['Get a monthly student bus/metro pass', 'Carpool with classmates', 'Use cycling for short distances'],
    Education: ['Use NPTEL, MIT OCW for free courses', 'Buy second-hand textbooks', 'Access library resources before buying'],
    Entertainment: ['Share OTT subscriptions with friends (2-4 way split)', 'Use student discounts (Spotify, Prime)', 'Attend free campus events & fests'],
    Shopping: ['Wait 24 hours before buying anything over ₹500', 'Use cashback apps (CRED, PhonePe)', 'Buy during sale season (Flipkart Big Billion, Amazon Great Indian)'],
    Bills: ['Bundle internet + mobile for combo discount', 'Cancel unused subscriptions monthly', 'Switch to prepaid for better control'],
    Healthcare: ['Exercise regularly to reduce healthcare costs', 'Use campus clinic for free consultation', 'Buy generic medicines instead of branded'],
    Others: ['Track and categorize uncategorized expenses', 'Set a weekly cash limit', 'Review "Others" category weekly'],
};

export default function InsightsPage() {
    const { expenses, monthlyIncome, budgets } = useApp();

    const thisMonth = useMemo(() => getMonthExpenses(expenses, 0), [expenses]);
    const total = useMemo(() => getTotalAmount(thisMonth), [thisMonth]);
    const catTotals = useMemo(() => getCategoryTotals(thisMonth), [thisMonth]);
    const riskLevel = getRiskLevel(total, monthlyIncome);
    const subs = useMemo(() => detectSubscriptions(expenses), [expenses]);
    const overspentCats = Object.entries(catTotals).filter(([cat, amt]) => amt > budgets[cat]);
    const pct = Math.round((total / monthlyIncome) * 100);

    const riskColor = { Low: 'var(--accent-green)', Medium: 'var(--accent-yellow)', High: 'var(--accent-red)' }[riskLevel];
    const riskBadge = { Low: 'badge-green', Medium: 'badge-yellow', High: 'badge-red' }[riskLevel];
    const riskIcon = { Low: '🟢', Medium: '🟡', High: '🔴' }[riskLevel];

    // Top 3 spending categories for tips
    const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat]) => cat);

    // Unnecessary expenses: top category with >50% budget used AND in Entertainment/Shopping
    const unnecessary = Object.entries(catTotals).filter(([cat, amt]) => ['Entertainment', 'Shopping'].includes(cat) && amt > budgets[cat] * 0.5);

    // Weekly AI summary
    const weekSummary = `This week you've spent ${formatCurrency(total)} in ${Object.keys(catTotals).length} categories. ${riskLevel === 'High' ? '⚠️ Your risk level is HIGH — take immediate action to reduce spending.' : riskLevel === 'Medium' ? '🟡 You\'re at medium risk. Monitor your budget closely.' : '✅ You\'re in great shape financially this month!'}`;

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h2 className="page-title">💡 Smart Insights</h2>
                    <p className="page-subtitle">AI-powered analysis of your financial health</p>
                </div>
            </div>

            {/* Risk Level card — prominent */}
            <motion.div
                className="glass-card"
                style={{ padding: 28, marginBottom: 20, background: `linear-gradient(135deg, ${riskColor}18 0%, transparent 100%)`, border: `1px solid ${riskColor}44` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 60 }}>{riskIcon}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Financial Risk Level</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 800, color: riskColor }}>
                            {riskLevel} Risk
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
                            You've used <strong>{pct}%</strong> of your monthly income (₹{total.toLocaleString('en-IN')} / ₹{monthlyIncome.toLocaleString('en-IN')})
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className={`badge ${riskBadge}`} style={{ fontSize: 13, padding: '6px 16px' }}>
                            <Shield size={13} /> {riskLevel} Risk
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div className="progress-bar-wrap" style={{ height: 10, width: 200 }}>
                                <motion.div
                                    className={`progress-bar-fill ${riskLevel === 'High' ? 'danger' : riskLevel === 'Medium' ? 'warning' : ''}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(pct, 100)}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{pct}% used</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Weekly AI Summary */}
            <motion.div
                className="glass-card insight-card"
                style={{ marginBottom: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="insight-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    <RefreshCw size={20} color="var(--accent-blue)" />
                </div>
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 Weekly AI Summary Report</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{weekSummary}</div>
                </div>
            </motion.div>

            {/* Overspending Alerts */}
            {overspentCats.length > 0 && (
                <motion.div
                    className="glass-card"
                    style={{ padding: 20, marginBottom: 20, background: 'var(--grad-danger)', border: '1px solid rgba(239,68,68,0.3)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <AlertTriangle size={18} color="var(--accent-red)" />
                        <h3 style={{ fontWeight: 700, color: 'var(--accent-red)' }}>⚠️ Overspending Alerts</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {overspentCats.map(([cat, amt]) => {
                            const over = amt - budgets[cat];
                            return (
                                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                                    <span>{CATEGORY_EMOJIS[cat]} <strong>{cat}</strong></span>
                                    <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>Over by {formatCurrency(over)}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <div className="two-col">
                {/* Saving Tips */}
                <motion.div
                    className="glass-card"
                    style={{ padding: 24 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Lightbulb size={18} color="var(--accent-yellow)" />
                        <h3 style={{ fontWeight: 700 }}>💡 Personalized Saving Tips</h3>
                    </div>
                    {topCats.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Add expenses to get personalized tips!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {topCats.map(cat => (
                                <div key={cat}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <span>{CATEGORY_EMOJIS[cat]}</span>
                                        <span style={{ fontWeight: 600, fontSize: 14 }}>{cat}</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({formatCurrency(catTotals[cat])})</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 28 }}>
                                        {(SAVING_TIPS[cat] || []).map(tip => (
                                            <div key={tip} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 6 }}>
                                                <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>✓</span>
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Unnecessary Expenses + Subscriptions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <motion.div
                        className="glass-card"
                        style={{ padding: 24 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <TrendingDown size={18} color="var(--accent-orange)" />
                            <h3 style={{ fontWeight: 700 }}>💸 Cut Unnecessary Expenses</h3>
                        </div>
                        {unnecessary.length === 0 ? (
                            <div style={{ fontSize: 14, color: 'var(--accent-green)' }}>✅ No flagged unnecessary expenses this month. Great discipline!</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {unnecessary.map(([cat, amt]) => (
                                    <div key={cat} style={{ padding: '12px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10 }}>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{CATEGORY_EMOJIS[cat]} {cat}</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                                            ₹{amt.toLocaleString('en-IN')} spent • Consider cutting by 20% = save {formatCurrency(amt * 0.2)}/month
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Subscription Detector */}
                    <motion.div
                        className="glass-card"
                        style={{ padding: 24 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <RefreshCw size={18} color="var(--accent-purple)" />
                            <h3 style={{ fontWeight: 700 }}>🔄 Recurring Expenses Detected</h3>
                        </div>
                        {subs.length === 0 ? (
                            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>No repeated expenses detected. Good spending variety!</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {subs.slice(0, 5).map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, fontSize: 13 }}>
                                        <span>{CATEGORY_EMOJIS[s.category]} {s.description || s.category}</span>
                                        <span className="badge badge-purple">{formatCurrency(s.amount)}/recurring</span>
                                    </div>
                                ))}
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Review these subscriptions and cancel ones you don't use!</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
