// Expense calculation utilities

export function getMonthExpenses(expenses, monthOffset = 0) {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    });
}

export function getWeekExpenses(expenses, weekOffset = 0) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return expenses.filter(e => {
        const d = new Date(e.date);
        return d >= startOfWeek && d <= endOfWeek;
    });
}

export function getTotalAmount(expenses) {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

export function getCategoryTotals(expenses) {
    const totals = {};
    expenses.forEach(e => {
        totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return totals;
}

export function getTopCategory(expenses) {
    const totals = getCategoryTotals(expenses);
    const entries = Object.entries(totals);
    if (!entries.length) return null;
    return entries.reduce((a, b) => b[1] > a[1] ? b : a);
}

export function getMonthlyTrend(expenses, months = 6) {
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
        const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = target.toLocaleString('default', { month: 'short' });
        const total = getTotalAmount(getMonthExpenses(expenses, -i));
        result.push({ label, total });
    }
    return result;
}

export function getWeeklyTrend(expenses, weeks = 8) {
    const result = [];
    for (let i = weeks - 1; i >= 0; i--) {
        const weekExp = getWeekExpenses(expenses, -i);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - i * 7);
        const label = `W${weekStart.toLocaleString('default', { month: 'short', day: 'numeric' })}`;
        result.push({ label, total: getTotalAmount(weekExp) });
    }
    return result;
}

export function detectSubscriptions(expenses) {
    const seen = {};
    const subs = [];
    expenses.forEach(e => {
        const key = `${e.category}_${e.amount}`;
        seen[key] = (seen[key] || 0) + 1;
        if (seen[key] === 2) subs.push(e);
    });
    return subs;
}

export function getRiskLevel(totalSpent, income) {
    const pct = (totalSpent / income) * 100;
    if (pct < 50) return 'Low';
    if (pct < 80) return 'Medium';
    return 'High';
}

export function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function predictNextMonth(expenses) {
    const thisMonth = getTotalAmount(getMonthExpenses(expenses, 0));
    const lastMonth = getTotalAmount(getMonthExpenses(expenses, -1));
    const avg = (thisMonth + lastMonth) / 2 || thisMonth;
    const increase = 0.10 + Math.random() * 0.05; // 10-15%
    return Math.round(avg * (1 + increase));
}
