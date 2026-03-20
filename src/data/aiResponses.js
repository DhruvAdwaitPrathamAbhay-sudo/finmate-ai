// AI Chatbot response templates

export function generateAIResponse(input, expenses, goals, monthlyIncome) {
    const lower = input.toLowerCase();
    const now = new Date();

    // Get context
    const thisMonthExp = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const total = thisMonthExp.reduce((s, e) => s + Number(e.amount), 0);
    const remaining = monthlyIncome - total;
    const pct = Math.round((total / monthlyIncome) * 100);

    const catTotals = {};
    thisMonthExp.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount); });
    const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    const topCatName = topCat ? topCat[0] : 'Food';
    const topCatAmt = topCat ? topCat[1] : 0;

    // Route by keyword
    if (lower.includes('spend') || lower.includes('spent') || lower.includes('expense')) {
        return spendingResponses(total, remaining, pct, topCatName, topCatAmt);
    }
    if (lower.includes('save') || lower.includes('saving') || lower.includes('budget')) {
        return savingsResponses(remaining, pct, topCatName);
    }
    if (lower.includes('invest') || lower.includes('investment') || lower.includes('grow')) {
        return investmentResponses();
    }
    if (lower.includes('goal') || lower.includes('target')) {
        return goalResponses(goals);
    }
    if (lower.includes('risk') || lower.includes('warn') || lower.includes('over')) {
        return riskResponses(pct, topCatName, topCatAmt);
    }
    if (lower.includes('tip') || lower.includes('advice') || lower.includes('suggest')) {
        return tipsResponses(topCatName, remaining);
    }
    if (lower.includes('predict') || lower.includes('next month') || lower.includes('forecast')) {
        return predictionResponses(total);
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return greetResponses();
    }
    if (lower.includes('help') || lower.includes('what can')) {
        return helpResponse();
    }

    // Fallback: general analysis
    return generalResponses(total, remaining, pct, topCatName);
}

function spendingResponses(total, remaining, pct, topCat, topCatAmt) {
    const opts = [
        `📊 This month you've spent **₹${total.toLocaleString('en-IN')}** which is **${pct}%** of your income. Your highest spend is on **${topCat}** (₹${topCatAmt.toLocaleString('en-IN')}). ${pct > 80 ? '⚠️ You are in the danger zone! Cut non-essentials immediately.' : '✅ You\'re managing well, keep it up!'}`,
        `💸 Current month spending: **₹${total.toLocaleString('en-IN')}**. You still have **₹${remaining.toLocaleString('en-IN')}** left. Your ${topCat} budget is taking the most hit — try to reduce it by 20% next week.`,
        `📉 You've used **${pct}%** of your monthly budget so far. Top category: **${topCat}**. ${remaining > 0 ? `Balance remaining: ₹${remaining.toLocaleString('en-IN')} — use it wisely!` : '🚨 You have exceeded your monthly income! Please review your expenses.'}`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}

function savingsResponses(remaining, pct, topCat) {
    const opts = [
        `💰 Great question! With **₹${remaining.toLocaleString('en-IN')}** remaining, I suggest saving at least **30%** of it. Try the **50-30-20 rule**: 50% needs, 30% wants, 20% savings. Start a recurring deposit today!`,
        `🎯 To save better, reduce your **${topCat}** spending by just 15% — that could save you **₹${Math.round(remaining * 0.15).toLocaleString('en-IN')}** this month. Set up auto-transfer to savings on salary day!`,
        `🏦 Pro tip: Before spending, ask yourself — "Do I *need* this or *want* this?" You've used ${pct}% of budget. With smart cuts, you could save 20-25% more each month and reach financial goals faster.`,
        `📈 Even saving ₹500/month at 7% annual interest grows to **₹72,000 in 10 years** through compounding! Start small, think big. Your remaining ₹${remaining.toLocaleString('en-IN')} is perfect to start.`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}

function investmentResponses() {
    const opts = [
        `📈 For students, here are the best investment options:\n\n1. **SIP in index funds** – Start with ₹500/month\n2. **PPF account** – Tax-free, safe, 7.1% returns\n3. **Digital Gold** – Buy as low as ₹1\n4. **FD laddering** – Split into 3, 6, 12-month FDs\n\nAlways invest what you can afford to lock away for 3+ years!`,
        `💡 Student investment strategy:\n\n• First, build an **emergency fund** (3 months expenses)\n• Then invest in **Nifty 50 index ETF** via Zerodha/Groww\n• Consider **RD** for disciplined monthly saving\n• Avoid F&O and crypto as a beginner\n\nRemember: Time in market > Timing the market! 🚀`,
        `🌱 The earlier you invest, the richer you become! At your age:\n• ₹1000/month @ 12% for 30 years = **₹35 lakhs**\n• ₹5000/month @ 12% for 30 years = **₹1.76 crores**\n\nStart with **Zerodha Coin** SIP in large-cap mutual funds. It's beginner-friendly!`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}

function goalResponses(goals) {
    if (!goals.length) {
        return `🎯 You haven't set any savings goals yet! Go to the **Goals** section and create your first goal — whether it's a new laptop, a trip, or emergency fund. Setting goals makes saving 3x more effective!`;
    }
    const g = goals[0];
    const progress = Math.round((g.saved / g.target) * 100);
    return `🎯 Your goal **"${g.name}"** is **${progress}%** complete (₹${Number(g.saved).toLocaleString('en-IN')} / ₹${Number(g.target).toLocaleString('en-IN')}). To reach it faster, set aside a fixed amount daily — even ₹50/day can make a big difference over time!`;
}

function riskResponses(pct, topCat, topCatAmt) {
    const level = pct < 50 ? 'LOW 🟢' : pct < 80 ? 'MEDIUM 🟡' : 'HIGH 🔴';
    const opts = [
        `⚠️ Your current financial risk level is **${level}**. You've used **${pct}%** of your monthly income. ${pct > 80 ? 'Immediate action needed! Cut your ' + topCat + ' spending by 30% now.' : pct > 50 ? 'Monitor your spending closely. You\'re approaching the warning zone.' : 'Great job! Keep maintaining this discipline.'}`,
        `🔍 Risk Assessment: **${level}** (${pct}% budget used)\n\nTop overspending area: **${topCat}** (₹${topCatAmt.toLocaleString('en-IN')})\n\n${pct > 80 ? '🚨 Alert: Your expenses are critically high. Review and cut non-essential spends immediately.' : 'Keep tracking your expenses to stay in the green zone!'}`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}

function tipsResponses(topCat, remaining) {
    const tips = {
        Food: '🍱 Cook meals at home 4 days a week. Use student meal plans. Avoid late-night food deliveries — they add 30-40% more cost!',
        Transportation: '🚌 Use public transport or bike-pool. Get a student metro pass — saves up to 40%! Plan trips to combine multiple errands.',
        Entertainment: '🎬 Use student discounts on OTT platforms. Share subscriptions with friends. Look for free events on campus!',
        Shopping: '🛒 Use cashback apps like CRED, PhonePe. Wait for sale seasons. Unsubscribe from promotional emails to reduce impulse buying!',
        Bills: '📱 Review all subscriptions monthly. Cancel unused ones. Bundle internet + mobile for better deals!',
        Education: '📚 Use library resources, free YouTube courses (NPTEL, MIT OCW). Buy second-hand textbooks!',
        Healthcare: '💊 Prevention > Cure! Exercise regularly. Many campus clinics offer free consultations!',
    };
    const tip = tips[topCat] || '💡 Track every expense, no matter how small. Small leaks sink big ships — ₹50 here, ₹100 there adds up fast!';
    return `${tip}\n\n💼 You have **₹${remaining.toLocaleString('en-IN')}** remaining this month — an excellent opportunity to save more!`;
}

function predictionResponses(total) {
    const predicted = Math.round(total * 1.12);
    return `🔮 Based on your current spending pattern, I predict next month's expenses to be around **₹${predicted.toLocaleString('en-IN')}** (approx. 10-15% increase).\n\nTo avoid this, set stricter category budgets now and review spending weekly. Proactive management is the key to financial freedom!`;
}

function greetResponses() {
    const opts = [
        `👋 Hello! I'm **FinMate AI**, your personal finance assistant! I can help you with:\n• Spending analysis\n• Saving tips\n• Investment advice\n• Goal planning\n\nWhat would you like to know?`,
        `🤖 Hey there! Ready to take control of your finances? Ask me anything about your spending, savings goals, investment options, or just say "give me tips"!`,
        `✨ Hi! Great to see you taking charge of your finances! I'm here to help you save more, spend smarter, and reach your goals faster. What's on your mind?`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}

function helpResponse() {
    return `🤖 **FinMate AI can help with:**\n\n• 📊 "Analyze my spending"\n• 💰 "How can I save more?"\n• 📈 "Investment tips for students"\n• 🎯 "Tell me about my goals"\n• ⚠️ "What's my risk level?"\n• 🔮 "Predict next month expenses"\n• 💡 "Give me saving tips"\n\nJust type naturally and I'll understand!`;
}

function generalResponses(total, remaining, pct, topCat) {
    const opts = [
        `📊 Here's your quick financial snapshot:\n• **Spent this month**: ₹${total.toLocaleString('en-IN')}\n• **Remaining**: ₹${remaining.toLocaleString('en-IN')}\n• **Budget used**: ${pct}%\n• **Top category**: ${topCat}\n\n${pct > 80 ? '⚠️ Warning: High spending detected!' : '✅ Looking good overall!'}`,
        `💡 Financial tip of the day: The **Latte Factor** — cutting small daily expenses (like ₹150 coffee) saves ₹4,500/month and ₹54,000/year! What small expense can you cut today?`,
        `🎓 Student finance hack: Use the **24-hour rule** before any purchase over ₹500. If you still want it after 24 hours, it might be worth it. This alone can save 20% on impulse buys!`,
        `📉 I noticed your ${topCat} is your top spending category this month. Try reducing it by just 10% — that's a saving of ₹${Math.round(total * 0.1).toLocaleString('en-IN')} instantly! Small changes = big results over time.`,
    ];
    return opts[Math.floor(Math.random() * opts.length)];
}
