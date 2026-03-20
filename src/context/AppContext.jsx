import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

const AppContext = createContext(null);

const CATEGORIES = ['Food', 'Transportation', 'Education', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Others'];

const DEFAULT_BUDGETS = {
  Food: 3000, Transportation: 1500, Education: 2000,
  Entertainment: 1000, Shopping: 2000, Bills: 1500,
  Healthcare: 1000, Others: 500
};

function expenseReducer(state, action) {
  switch (action.type) {
    case 'SET': return action.payload;
    case 'ADD': return [action.payload, ...state];
    case 'UPDATE': return state.map(e => e.id === action.payload.id ? action.payload : e);
    case 'DELETE': return state.filter(e => e.id !== action.payload);
    default: return state;
  }
}

function goalsReducer(state, action) {
  switch (action.type) {
    case 'SET': return action.payload;
    case 'ADD': return [...state, action.payload];
    case 'UPDATE': return state.map(g => g.id === action.payload.id ? action.payload : g);
    case 'DELETE': return state.filter(g => g.id !== action.payload);
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [expenses, dispatchExpenses] = useReducer(expenseReducer, []);
  const [goals, dispatchGoals] = useReducer(goalsReducer, []);
  const [monthlyIncome, setMonthlyIncome] = useState(15000);
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS);
  const [overspendAlert, setOverspendAlert] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('finmate_session');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadUserData(u.email);
    }
    const savedTheme = localStorage.getItem('finmate_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  function loadUserData(email) {
    const key = `finmate_data_${email}`;
    const d = localStorage.getItem(key);
    if (d) {
      const data = JSON.parse(d);
      dispatchExpenses({ type: 'SET', payload: data.expenses || [] });
      dispatchGoals({ type: 'SET', payload: data.goals || [] });
      setMonthlyIncome(data.monthlyIncome || 15000);
      setBudgets(data.budgets || DEFAULT_BUDGETS);
    } else {
      // Seed demo data for new users
      const demo = generateDemoExpenses();
      dispatchExpenses({ type: 'SET', payload: demo });
      saveData(email, demo, [], 15000, DEFAULT_BUDGETS);
    }
  }

  function generateDemoExpenses() {
    const now = new Date();
    const demos = [
      { id: 'd1', amount: 450, category: 'Food', description: 'Lunch at college canteen', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-1).toISOString().split('T')[0] },
      { id: 'd2', amount: 800, category: 'Transportation', description: 'Monthly bus pass', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-2).toISOString().split('T')[0] },
      { id: 'd3', amount: 1200, category: 'Education', description: 'Online course subscription', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-3).toISOString().split('T')[0] },
      { id: 'd4', amount: 350, category: 'Entertainment', description: 'Movie night with friends', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-4).toISOString().split('T')[0] },
      { id: 'd5', amount: 620, category: 'Shopping', description: 'New notebook & stationery', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-5).toISOString().split('T')[0] },
      { id: 'd6', amount: 999, category: 'Bills', description: 'Mobile phone recharge', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-6).toISOString().split('T')[0] },
      { id: 'd7', amount: 280, category: 'Food', description: 'Groceries from local market', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-7).toISOString().split('T')[0] },
      { id: 'd8', amount: 500, category: 'Healthcare', description: 'Vitamin supplements', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-8).toISOString().split('T')[0] },
      { id: 'd9', amount: 1500, category: 'Shopping', description: 'New shoes sale', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-9).toISOString().split('T')[0] },
      { id: 'd10', amount: 200, category: 'Food', description: 'Zomato delivery order', date: new Date(now.getFullYear(), now.getMonth(), now.getDate()-10).toISOString().split('T')[0] },
      // prev month
      { id: 'd11', amount: 600, category: 'Food', description: 'Weekend outing food', date: new Date(now.getFullYear(), now.getMonth()-1, 15).toISOString().split('T')[0] },
      { id: 'd12', amount: 900, category: 'Bills', description: 'Internet bill', date: new Date(now.getFullYear(), now.getMonth()-1, 10).toISOString().split('T')[0] },
      { id: 'd13', amount: 1100, category: 'Entertainment', description: 'OTT subscription combo', date: new Date(now.getFullYear(), now.getMonth()-1, 5).toISOString().split('T')[0] },
      { id: 'd14', amount: 750, category: 'Transportation', description: 'Cab rides this week', date: new Date(now.getFullYear(), now.getMonth()-1, 20).toISOString().split('T')[0] },
      { id: 'd15', amount: 2200, category: 'Education', description: 'Semester exam fees', date: new Date(now.getFullYear(), now.getMonth()-1, 2).toISOString().split('T')[0] },
    ];
    return demos;
  }

  function saveData(email, exp, gls, income, bdg) {
    const key = `finmate_data_${email}`;
    localStorage.setItem(key, JSON.stringify({
      expenses: exp, goals: gls, monthlyIncome: income, budgets: bdg
    }));
  }

  function persistExpenses(newExpenses) {
    if (user) saveData(user.email, newExpenses, goals, monthlyIncome, budgets);
  }

  function persistGoals(newGoals) {
    if (user) saveData(user.email, expenses, newGoals, monthlyIncome, budgets);
  }

  function addExpense(exp) {
    const newExp = { ...exp, id: Date.now().toString() };
    const updated = [newExp, ...expenses];
    dispatchExpenses({ type: 'ADD', payload: newExp });
    persistExpenses(updated);
    // Check overspend
    const catTotal = updated.filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      return e.category === exp.category && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((s, e) => s + e.amount, 0);
    if (catTotal > budgets[exp.category]) setOverspendAlert(exp.category);
  }

  function updateExpense(exp) {
    const updated = expenses.map(e => e.id === exp.id ? exp : e);
    dispatchExpenses({ type: 'UPDATE', payload: exp });
    persistExpenses(updated);
  }

  function deleteExpense(id) {
    const updated = expenses.filter(e => e.id !== id);
    dispatchExpenses({ type: 'DELETE', payload: id });
    persistExpenses(updated);
  }

  function addGoal(goal) {
    const newGoal = { ...goal, id: Date.now().toString(), saved: 0, createdAt: new Date().toISOString() };
    const updated = [...goals, newGoal];
    dispatchGoals({ type: 'ADD', payload: newGoal });
    persistGoals(updated);
  }

  function updateGoal(goal) {
    const updated = goals.map(g => g.id === goal.id ? goal : g);
    dispatchGoals({ type: 'UPDATE', payload: goal });
    persistGoals(updated);
  }

  function deleteGoal(id) {
    const updated = goals.filter(g => g.id !== id);
    dispatchGoals({ type: 'DELETE', payload: id });
    persistGoals(updated);
  }

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('finmate_theme', newTheme);
  }

  function login(email, name) {
    const u = { email, name };
    setUser(u);
    localStorage.setItem('finmate_session', JSON.stringify(u));
    loadUserData(email);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('finmate_session');
    dispatchExpenses({ type: 'SET', payload: [] });
    dispatchGoals({ type: 'SET', payload: [] });
  }

  function updateIncome(income) {
    setMonthlyIncome(income);
    if (user) saveData(user.email, expenses, goals, income, budgets);
  }

  function updateBudgets(newBudgets) {
    setBudgets(newBudgets);
    if (user) saveData(user.email, expenses, goals, monthlyIncome, newBudgets);
  }

  return (
    <AppContext.Provider value={{
      user, login, logout,
      theme, toggleTheme,
      expenses, addExpense, updateExpense, deleteExpense,
      goals, addGoal, updateGoal, deleteGoal,
      monthlyIncome, updateIncome,
      budgets, updateBudgets,
      overspendAlert, setOverspendAlert,
      CATEGORIES
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
