import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
    TrendingUp, TrendingDown, Wallet, PiggyBank, AlertTriangle, X,
    Star, Zap, Target, ArrowRight
} from 'lucide-react';
import {
    getMonthExpenses, getTotalAmount, getCategoryTotals, getTopCategory,
    getRiskLevel, formatCurrency, predictNextMonth
} from '../utils/calculations';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CATEGORY_COLORS = {
    Food: '#f97316', Transportation: '#3b82f6', Education: '#8b5cf6',
    Entertainment: '#ec4899', Shopping: '#eab308', Bills: '#ef4444',
    Healthcare: '#22c55e', Others: '#94a3b8'
};

const CATEGORY_EMOJIS = {
    Food: '🍱', Transportation: '🚌', Education: '📚',
    Entertainment: '🎬', Shopping: '🛒', Bills: '📱',
    Healthcare: '💊', Others: '📦'
};

function StatCard({ label, value, sub, icon, color, delay = 0 }) {
    return (
        <motion.div
            className="glass-card stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <div className="stat-label">{label}</div>
            <div className="stat-value mono" style={{ color: color || 'var(--text-primary)' }}>{value}</div>
            {sub && <div className="stat-sub">{sub}</div>}
            <div className="stat-icon" style={{ color: color || 'var(--accent-purple)' }}>
                {icon}
            </div>
        </motion.div>
    );
}

export default function DashboardPage() {
    const { expenses, monthlyIncome, budgets, overspendAlert, setOverspendAlert, user, goals, theme } = useApp();
    const navigate = useNavigate();

    const chartTextColor = theme === 'dark' ? '#ffffff' : '#1e293b';
    const chartMutedColor = theme === 'dark' ? '#94a3b8' : '#64748b';

    const thisMonth = useMemo(() => getMonthExpenses(expenses, 0), [expenses]);
    const lastMonth = useMemo(() => getMonthExpenses(expenses, -1), [expenses]);
    const total = useMemo(() => getTotalAmount(thisMonth), [thisMonth]);
    const lastTotal = useMemo(() => getTotalAmount(lastMonth), [lastMonth]);
    const remaining = monthlyIncome - total;
    const catTotals = useMemo(() => getCategoryTotals(thisMonth), [thisMonth]);
    const topCat = useMemo(() => getTopCategory(thisMonth), [thisMonth]);
    const riskLevel = getRiskLevel(total, monthlyIncome);
    const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
    const savedThisMonth = Math.max(0, lastTotal - total);
    const prediction = useMemo(() => predictNextMonth(expenses), [expenses]);

    const diffPct = lastTotal > 0 ? (((total - lastTotal) / lastTotal) * 100).toFixed(1) : 0;
    const isUp = total > lastTotal;

    const pieData = {
        labels: Object.keys(catTotals),
        datasets: [{
            data: Object.values(catTotals),
            backgroundColor: Object.keys(catTotals).map(c => CATEGORY_COLORS[c] + 'cc'),
            borderColor: Object.keys(catTotals).map(c => CATEGORY_COLORS[c]),
            borderWidth: 2,
            hoverOffset: 8,
        }]
    };

    const budgetCategories = Object.keys(budgets);
    const budgetData = {
        labels: budgetCategories,
        datasets: [
            {
                label: 'Spent',
                data: budgetCategories.map(c => catTotals[c] || 0),
                backgroundColor: budgetCategories.map(c => CATEGORY_COLORS[c] + 'bb'),
                borderRadius: 6,
            },
            {
                label: 'Budget',
                data: budgetCategories.map(c => budgets[c]),
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                borderRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { labels: { color: chartTextColor, font: { size: 12, weight: '600' } } },
            tooltip: {
                backgroundColor: theme === 'dark' ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)',
                titleColor: chartTextColor,
                bodyColor: chartTextColor,
                borderColor: 'rgba(139,92,246,0.3)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 8,
                callbacks: {
                    label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}`
                }
            }
        }
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            x: {
                grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
                ticks: { color: chartMutedColor, font: { size: 10 } }
            },
            y: {
                grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
                ticks: { color: chartMutedColor, font: { size: 10 }, callback: v => `₹${v}` }
            }
        }
    };

    const riskColor = { Low: 'var(--accent-green)', Medium: 'var(--accent-yellow)', High: 'var(--accent-red)' }[riskLevel];

    return (
        <div className="page-wrapper">
            {/* Overspend Alert */}
            <AnimatePresence>
                {overspendAlert && (
                    <motion.div
                        className="alert-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="alert-box"
                            initial={{ scale: 0.8, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 40 }}
                        >
                            <div style={{ fontSize: 52, marginBottom: 12 }}>🚨</div>
                            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--accent-red)' }}>
                                Overspending Alert!
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                                You've exceeded your <strong style={{ color: 'var(--accent-orange)' }}>{overspendAlert}</strong> budget this month.
                                Time to cut back on this category!
                            </p>
                            <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setOverspendAlert(false)}>
                                <X size={16} /> Got it, I'll be careful
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="page-header">
                <div>
                    <h2 className="page-title">👋 Welcome back, {user?.name?.split(' ')[0]}!</h2>
                    <p className="page-subtitle">Here's your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/expenses')}>
                    + Add Expense <ArrowRight size={14} />
                </button>
            </div>

            {/* Savings banner */}
            {savedThisMonth > 0 && (
                <motion.div className="savings-banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Star size={18} />
                    You saved {formatCurrency(savedThisMonth)} compared to last month! Keep it up! 🎉
                </motion.div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    label="Monthly Spending"
                    value={formatCurrency(total)}
                    sub={`${isUp ? '↑' : '↓'} ${Math.abs(diffPct)}% vs last month`}
                    icon={<TrendingUp size={36} />}
                    color={isUp ? 'var(--accent-red)' : 'var(--accent-green)'}
                    delay={0.05}
                />
                <StatCard
                    label="Remaining Balance"
                    value={formatCurrency(Math.abs(remaining))}
                    sub={remaining < 0 ? '⚠️ Over budget!' : 'Available to spend'}
                    icon={<Wallet size={36} />}
                    color={remaining < 0 ? 'var(--accent-red)' : 'var(--accent-green)'}
                    delay={0.1}
                />
                <StatCard
                    label="Monthly Income"
                    value={formatCurrency(monthlyIncome)}
                    sub="Set in sidebar settings"
                    icon={<PiggyBank size={36} />}
                    delay={0.15}
                />
                <StatCard
                    label="Risk Level"
                    value={riskLevel}
                    sub={`${Math.round((total / monthlyIncome) * 100)}% of income used`}
                    icon={<AlertTriangle size={36} />}
                    color={riskColor}
                    delay={0.2}
                />
            </div>

            {/* Budget Progress */}
            <motion.div
                className="glass-card"
                style={{ padding: 24, marginBottom: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <h3 className="chart-title" style={{ margin: 0 }}>📊 Budget Usage</h3>
                    {topCat && (
                        <span className="badge badge-purple">
                            <Zap size={11} /> Top: {CATEGORY_EMOJIS[topCat[0]]} {topCat[0]}
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(budgets).map(([cat, budget]) => {
                        const spent = catTotals[cat] || 0;
                        const pct = Math.min(100, Math.round((spent / budget) * 100));
                        const isOver = spent > budget;
                        return (
                            <div key={cat}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        {CATEGORY_EMOJIS[cat]} {cat}
                                    </span>
                                    <span style={{ color: isOver ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: 600 }}>
                                        {formatCurrency(spent)} / {formatCurrency(budget)}
                                        {isOver && ' ⚠️'}
                                    </span>
                                </div>
                                <div className="progress-bar-wrap">
                                    <motion.div
                                        className={`progress-bar-fill ${isOver ? 'danger' : pct > 75 ? 'warning' : ''}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Charts Row */}
            <div className="two-col">
                <motion.div
                    className="glass-card chart-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="chart-title">🥧 Spending by Category</h3>
                    {Object.keys(catTotals).length > 0 ? (
                        <Pie data={pieData} options={chartOptions} />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <p>No expenses this month yet.</p>
                            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/expenses')}>
                                Add your first expense
                            </button>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="glass-card chart-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <h3 className="chart-title">📊 Budget vs Spent</h3>
                    <Bar data={budgetData} options={barOptions} />
                </motion.div>
            </div>

            {/* Bottom row: Goals preview + Prediction */}
            <div className="two-col" style={{ marginTop: 20 }}>
                <motion.div
                    className="glass-card"
                    style={{ padding: 24 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 className="chart-title" style={{ margin: 0 }}>🎯 Savings Goals</h3>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/goals')}>View All</button>
                    </div>
                    {goals.length === 0 ? (
                        <div className="empty-state" style={{ padding: 24 }}>
                            <div className="empty-state-icon">🎯</div>
                            <p>No goals set yet</p>
                            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/goals')}>
                                Set a Goal
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {goals.slice(0, 3).map(g => {
                                const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                                return (
                                    <div key={g.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ fontWeight: 500 }}>🎯 {g.name}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                                        </div>
                                        <div className="progress-bar-wrap">
                                            <motion.div
                                                className="progress-bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.8 }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                            <span>{formatCurrency(g.saved)} saved</span>
                                            <span>Goal: {formatCurrency(g.target)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="glass-card"
                    style={{ padding: 24, background: 'var(--grad-card)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                >
                    <h3 className="chart-title">🔮 Next Month Prediction</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justify: 'space-between', gap: 12 }}>
                            <div className="glass-card" style={{ flex: 1, padding: '16px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>This Month</div>
                                <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-blue)' }}>{formatCurrency(total)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 20 }}>→</div>
                            <div className="glass-card" style={{ flex: 1, padding: '16px 14px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)' }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Predicted</div>
                                <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-red)' }}>{formatCurrency(prediction)}</div>
                            </div>
                        </div>
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                            ⚠️ Spending is predicted to increase by ~12% next month. Consider setting stricter budgets now!
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/predictions')}>
                            View Full Prediction <ArrowRight size={13} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Recent Expenses */}
            <motion.div
                className="glass-card"
                style={{ padding: 24, marginTop: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 className="chart-title" style={{ margin: 0 }}>🕐 Recent Transactions</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/expenses')}>View All</button>
                </div>
                {thisMonth.length === 0 ? (
                    <div className="empty-state" style={{ padding: 24 }}>
                        <div className="empty-state-icon">💸</div>
                        <p>No expenses this month</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[...thisMonth].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(e => (
                            <div key={e.id} className="expense-item">
                                <div className={`expense-icon cat-${e.category.toLowerCase()}`}>
                                    {CATEGORY_EMOJIS[e.category]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{e.description}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.category} • {new Date(e.date).toLocaleDateString('en-IN')}</div>
                                </div>
                                <div className="mono" style={{ fontWeight: 700, color: 'var(--accent-red)' }}>-{formatCurrency(e.amount)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
