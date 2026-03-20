import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { getMonthlyTrend, getTotalAmount, getMonthExpenses, formatCurrency, predictNextMonth } from '../utils/calculations';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function PredictionsPage() {
    const { expenses, monthlyIncome } = useApp();

    const trend = useMemo(() => getMonthlyTrend(expenses, 5), [expenses]);
    const prediction = useMemo(() => predictNextMonth(expenses), [expenses]);
    const thisMonth = useMemo(() => getTotalAmount(getMonthExpenses(expenses, 0)), [expenses]);
    const lastMonth = useMemo(() => getTotalAmount(getMonthExpenses(expenses, -1)), [expenses]);
    const pct = lastMonth > 0 ? (((prediction - thisMonth) / thisMonth) * 100).toFixed(1) : 12;
    const saving = monthlyIncome - prediction;

    const now = new Date();
    const nextMonthLabel = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleString('default', { month: 'short' });

    const labels = [...trend.map(d => d.label), `${nextMonthLabel} (Pred)`];
    const actuals = trend.map(d => d.total);

    const barData = {
        labels,
        datasets: [
            {
                label: 'Actual Spending',
                data: [...actuals, null],
                backgroundColor: actuals.map((_, i) => i === actuals.length - 1 ? 'rgba(139,92,246,0.8)' : 'rgba(59,130,246,0.6)'),
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Predicted',
                data: [...actuals.map(() => null), prediction],
                backgroundColor: 'rgba(239,68,68,0.7)',
                borderRadius: 8,
                borderSkipped: false,
                borderDash: [5, 5],
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
            tooltip: {
                backgroundColor: 'rgba(17,24,39,0.95)',
                titleColor: '#f0f4ff',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(139,92,246,0.3)',
                borderWidth: 1,
                callbacks: { label: ctx => ` ₹${Number(ctx.raw || 0).toLocaleString('en-IN')}` }
            }
        },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 }, callback: v => `₹${v}` } }
        }
    };

    const monthAvg = actuals.length > 0 ? Math.round(actuals.reduce((s, v) => s + v, 0) / actuals.length) : 0;

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h2 className="page-title">🔮 Spending Predictions</h2>
                    <p className="page-subtitle">AI-powered forecast for your next month's expenses</p>
                </div>
            </div>

            {/* Prediction Cards */}
            <div className="stats-grid" style={{ marginBottom: 24 }}>
                {[
                    { label: 'This Month', value: formatCurrency(thisMonth), sub: 'Current spending', color: 'var(--accent-blue)' },
                    { label: 'Last Month', value: formatCurrency(lastMonth), sub: 'Previous month', color: 'var(--accent-purple)' },
                    { label: 'Next Month (Prediction)', value: formatCurrency(prediction), sub: `≈ ${pct}% change expected`, color: 'var(--accent-red)' },
                    { label: 'Predicted Savings', value: formatCurrency(Math.max(0, saving)), sub: saving < 0 ? '⚠️ Predicted overspend!' : 'If income stays same', color: saving < 0 ? 'var(--accent-red)' : 'var(--accent-green)' },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        className="glass-card stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <div className="stat-label">{card.label}</div>
                        <div className="stat-value mono" style={{ color: card.color }}>{card.value}</div>
                        <div className="stat-sub">{card.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Prediction Chart */}
            <motion.div
                className="glass-card chart-container"
                style={{ marginBottom: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="chart-title">📊 Spending History + Next Month Prediction</h3>
                <Bar data={barData} options={barOptions} />
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                    🔴 The red bar shows your <strong>predicted spending for {nextMonthLabel}</strong> based on your historical pattern plus a 10–15% growth factor.
                </div>
            </motion.div>

            {/* Current vs Predicted comparison */}
            <div className="two-col">
                <motion.div
                    className="glass-card"
                    style={{ padding: 24 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <h3 className="chart-title">📈 Forecast Analysis</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { label: '6-Month Average', value: formatCurrency(monthAvg), note: 'Your historical baseline' },
                            { label: 'Predicted Increase', value: `+${pct}%`, note: 'Based on spending trend', color: 'var(--accent-orange)' },
                            { label: 'Predicted Total', value: formatCurrency(prediction), note: `For ${nextMonthLabel}`, color: 'var(--accent-red)' },
                            { label: 'Recommended Budget', value: formatCurrency(Math.round(monthAvg * 0.95)), note: '5% below average — ideal!', color: 'var(--accent-green)' },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{row.label}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.note}</div>
                                </div>
                                <div className="mono" style={{ fontWeight: 700, fontSize: 16, color: row.color || 'var(--text-primary)' }}>{row.value}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="glass-card"
                    style={{ padding: 24 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="chart-title">💡 How to Reduce Predicted Spending</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { icon: '🎯', tip: 'Set strict category budgets now', desc: 'Pre-commit to spending limits for each category' },
                            { icon: '📝', tip: 'Plan your week\'s expenses Sunday', desc: 'Weekly planning reduces impulse spending by 35%' },
                            { icon: '💳', tip: 'Use cash for discretionary spending', desc: 'Physical cash creates better spending awareness' },
                            { icon: '🚫', tip: 'Cancel 1 unused subscription', desc: 'Review all recurring charges and cancel unused ones' },
                            { icon: '🍱', tip: 'Meal prep 3 days a week', desc: 'Save ₹300-500/week on food delivery' },
                        ].map(({ icon, tip, desc }) => (
                            <div key={tip} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{tip}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
