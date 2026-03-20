import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler
} from 'chart.js';
import { getMonthExpenses, getWeeklyTrend, getMonthlyTrend, getCategoryTotals, formatCurrency } from '../utils/calculations';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const CATEGORY_COLORS = {
    Food: '#f97316', Transportation: '#3b82f6', Education: '#8b5cf6',
    Entertainment: '#ec4899', Shopping: '#eab308', Bills: '#ef4444',
    Healthcare: '#22c55e', Others: '#94a3b8'
};

export default function ChartsPage() {
    const { expenses, theme } = useApp();
    const [tab, setTab] = useState('monthly');

    const chartTextColor = theme === 'dark' ? '#ffffff' : '#1e293b';
    const chartMutedColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

    const tooltipConfig = {
        backgroundColor: theme === 'dark' ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: chartTextColor,
        bodyColor: chartTextColor,
        borderColor: 'rgba(139,92,246,0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 8,
        callbacks: { label: ctx => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}` }
    };

    const axisStyle = {
        x: { grid: { color: gridColor }, ticks: { color: chartMutedColor, font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: chartMutedColor, font: { size: 11 }, callback: v => `₹${v}` } }
    };

    const thisMonth = useMemo(() => getMonthExpenses(expenses, 0), [expenses]);
    const catTotals = useMemo(() => getCategoryTotals(thisMonth), [thisMonth]);
    const monthlyTrend = useMemo(() => getMonthlyTrend(expenses, 6), [expenses]);
    const weeklyTrend = useMemo(() => getWeeklyTrend(expenses, 8), [expenses]);

    const pieData = {
        labels: Object.keys(catTotals),
        datasets: [{
            data: Object.values(catTotals),
            backgroundColor: Object.keys(catTotals).map(c => CATEGORY_COLORS[c] + 'cc'),
            borderColor: Object.keys(catTotals).map(c => CATEGORY_COLORS[c]),
            borderWidth: 2, hoverOffset: 12,
        }]
    };

    const barMonthlyData = {
        labels: monthlyTrend.map(d => d.label),
        datasets: [{
            label: 'Monthly Spending',
            data: monthlyTrend.map(d => d.total),
            backgroundColor: monthlyTrend.map((_, i) => i === monthlyTrend.length - 1 ? 'rgba(139,92,246,0.85)' : 'rgba(59,130,246,0.6)'),
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const lineWeeklyData = {
        labels: weeklyTrend.map(d => d.label),
        datasets: [{
            label: 'Weekly Spending',
            data: weeklyTrend.map(d => d.total),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.1)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            fill: true,
            tension: 0.4,
        }]
    };

    const barWeeklyData = {
        labels: weeklyTrend.map(d => d.label),
        datasets: [{
            label: 'Weekly Spending',
            data: weeklyTrend.map(d => d.total),
            backgroundColor: weeklyTrend.map((_, i) => `rgba(20,184,166,${0.4 + i * 0.07})`),
            borderRadius: 8,
        }]
    };

    const opts = { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: chartTextColor, font: { size: 12, weight: '600' } } }, tooltip: tooltipConfig } };
    const barOpts = { ...opts, scales: axisStyle };

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h2 className="page-title">📊 Charts & Analytics</h2>
                    <p className="page-subtitle">Visual breakdown of your spending patterns</p>
                </div>
            </div>

            {/* Tab Switch */}
            <div className="tabs" style={{ maxWidth: 300, marginBottom: 24 }}>
                <button className={`tab-btn ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>📅 Monthly</button>
                <button className={`tab-btn ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>📆 Weekly</button>
            </div>

            {tab === 'monthly' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Pie + Bar row */}
                    <div className="two-col">
                        <motion.div className="glass-card chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="chart-title">🥧 Category Breakdown</h3>
                            {Object.keys(catTotals).length > 0 ? (
                                <Pie data={pieData} options={opts} />
                            ) : (
                                <div className="empty-state"><div className="empty-state-icon">📊</div><p>Add expenses to see breakdown</p></div>
                            )}
                        </motion.div>

                        <motion.div className="glass-card chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <h3 className="chart-title">📊 Monthly Spending Trend (6 months)</h3>
                            <Bar data={barMonthlyData} options={barOpts} />
                        </motion.div>
                    </div>

                    {/* Category Details */}
                    <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="chart-title">💰 This Month by Category</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                            {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                                <div key={cat} style={{ padding: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, marginBottom: 6 }}>
                                        {cat === 'Food' ? '🍱' : cat === 'Transportation' ? '🚌' : cat === 'Education' ? '📚' : cat === 'Entertainment' ? '🎬' : cat === 'Shopping' ? '🛒' : cat === 'Bills' ? '📱' : cat === 'Healthcare' ? '💊' : '📦'}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cat}</div>
                                    <div className="mono" style={{ fontWeight: 700, color: CATEGORY_COLORS[cat], marginTop: 4 }}>{formatCurrency(amt)}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Monthly summary table */}
                    <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                        <h3 className="chart-title">📋 Monthly Summary</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Month', 'Total Spent', 'vs Previous', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyTrend.map((m, i) => {
                                        const prev = monthlyTrend[i - 1];
                                        const diff = prev ? ((m.total - prev.total) / (prev.total || 1)) * 100 : 0;
                                        const isUp = diff > 0;
                                        return (
                                            <tr key={m.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 500 }}>{m.label}</td>
                                                <td style={{ padding: '12px 14px' }} className="mono">{formatCurrency(m.total)}</td>
                                                <td style={{ padding: '12px 14px', color: i === 0 ? 'var(--text-muted)' : isUp ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                                                    {i === 0 ? '—' : `${isUp ? '↑' : '↓'} ${Math.abs(diff.toFixed(1))}%`}
                                                </td>
                                                <td style={{ padding: '12px 14px' }}>
                                                    <span className={`badge ${m.total > 10000 ? 'badge-red' : m.total > 5000 ? 'badge-yellow' : 'badge-green'}`}>
                                                        {m.total > 10000 ? '⚠️ High' : m.total > 5000 ? '🟡 Medium' : '✅ Low'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <motion.div className="glass-card chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h3 className="chart-title">📈 Weekly Spending Trend (8 weeks)</h3>
                        <Line data={lineWeeklyData} options={barOpts} />
                    </motion.div>

                    <motion.div className="glass-card chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <h3 className="chart-title">📊 Weekly Expense Analysis</h3>
                        <Bar data={barWeeklyData} options={barOpts} />
                    </motion.div>

                    <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="chart-title">📋 Weekly Breakdown</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Week', 'Total Spent', 'Trend'].map(h => (
                                            <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyTrend.map((w, i) => {
                                        const prev = weeklyTrend[i - 1];
                                        const diff = prev ? ((w.total - prev.total) / (prev.total || 1)) * 100 : 0;
                                        const isUp = diff > 0;
                                        return (
                                            <tr key={w.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: 500 }}>{w.label}</td>
                                                <td style={{ padding: '12px 14px' }} className="mono">{formatCurrency(w.total)}</td>
                                                <td style={{ padding: '12px 14px', color: i === 0 ? 'var(--text-muted)' : isUp ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                                                    {i === 0 ? 'Baseline' : `${isUp ? '↑' : '↓'} ${Math.abs(diff.toFixed(1))}%`}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
