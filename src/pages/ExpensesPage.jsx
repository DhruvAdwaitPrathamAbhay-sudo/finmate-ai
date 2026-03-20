import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus, Edit2, Trash2, Search, Filter, X, Check } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

const CATEGORY_EMOJIS = {
    Food: '🍱', Transportation: '🚌', Education: '📚',
    Entertainment: '🎬', Shopping: '🛒', Bills: '📱',
    Healthcare: '💊', Others: '📦'
};

const CAT_CLASSES = {
    Food: 'cat-food', Transportation: 'cat-transport', Education: 'cat-education',
    Entertainment: 'cat-entertainment', Shopping: 'cat-shopping', Bills: 'cat-bills',
    Healthcare: 'cat-healthcare', Others: 'cat-others'
};

function ExpenseModal({ expense, onSave, onClose, CATEGORIES }) {
    const [form, setForm] = useState(expense || {
        amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0]
    });

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.amount || !form.date) return;
        onSave({ ...form, amount: Number(form.amount) });
    }

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div
                className="modal-box"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
                <div className="modal-header">
                    <h3 className="modal-title">{expense ? '✏️ Edit Expense' : '➕ Add Expense'}</h3>
                    <button className="btn-icon" onClick={onClose}><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                        <label>Amount (₹) *</label>
                        <input name="amount" type="number" min="1" placeholder="0.00" value={form.amount} onChange={handleChange} required autoFocus />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input name="description" placeholder="What did you spend on?" value={form.description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Date *</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                            <Check size={15} /> {expense ? 'Update' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function ExpensesPage() {
    const { expenses, addExpense, updateExpense, deleteExpense, CATEGORIES } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('All');
    const [filterPeriod, setFilterPeriod] = useState('All');
    const [sortBy, setSortBy] = useState('date-desc');

    const filtered = useMemo(() => {
        let list = [...expenses];
        if (search) list = list.filter(e => e.description?.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
        if (filterCat !== 'All') list = list.filter(e => e.category === filterCat);
        if (filterPeriod !== 'All') {
            const now = new Date();
            list = list.filter(e => {
                const d = new Date(e.date);
                if (filterPeriod === 'This Week') {
                    const start = new Date(now); start.setDate(now.getDate() - now.getDay());
                    return d >= start;
                }
                if (filterPeriod === 'This Month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                if (filterPeriod === 'Last Month') {
                    const lm = new Date(now.getFullYear(), now.getMonth() - 1);
                    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
                }
                return true;
            });
        }
        if (sortBy === 'date-desc') list.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sortBy === 'date-asc') list.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (sortBy === 'amount-desc') list.sort((a, b) => b.amount - a.amount);
        if (sortBy === 'amount-asc') list.sort((a, b) => a.amount - b.amount);
        return list;
    }, [expenses, search, filterCat, filterPeriod, sortBy]);

    const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

    function handleSave(form) {
        if (editItem) { updateExpense({ ...editItem, ...form }); }
        else { addExpense(form); }
        setShowModal(false);
        setEditItem(null);
    }

    function handleEdit(e) { setEditItem(e); setShowModal(true); }
    function handleAdd() { setEditItem(null); setShowModal(true); }

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h2 className="page-title">💸 Expense Tracker</h2>
                    <p className="page-subtitle">Track and manage all your spending</p>
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            {/* Filters */}
            <motion.div className="glass-card" style={{ padding: 20, marginBottom: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                    </div>
                    <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 160 }}>
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
                    </select>
                    <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} style={{ width: 140 }}>
                        <option value="All">All Time</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 150 }}>
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    <Filter size={13} />
                    {filtered.length} expense{filtered.length !== 1 ? 's' : ''} • Total: <strong style={{ color: 'var(--accent-red)' }}>{formatCurrency(total)}</strong>
                    {(search || filterCat !== 'All' || filterPeriod !== 'All') && (
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setFilterCat('All'); setFilterPeriod('All'); }}>
                            <X size={12} /> Clear filters
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Expense List */}
            {filtered.length === 0 ? (
                <div className="empty-state glass-card" style={{ padding: 48 }}>
                    <div className="empty-state-icon">💸</div>
                    <p style={{ fontSize: 16, marginBottom: 8 }}>No expenses found</p>
                    <p style={{ fontSize: 13 }}>Try changing your filters or add a new expense</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={handleAdd}>
                        <Plus size={14} /> Add Expense
                    </button>
                </div>
            ) : (
                <AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtered.map((e, i) => (
                            <motion.div
                                key={e.id}
                                className="expense-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.02 }}
                                layout
                            >
                                <div className={`expense-icon ${CAT_CLASSES[e.category]}`}>
                                    {CATEGORY_EMOJIS[e.category]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {e.description || e.category}
                                    </div>
                                    <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                                        <span className={`badge ${CAT_CLASSES[e.category]}`} style={{ padding: '2px 8px', fontSize: 11 }}>
                                            {e.category}
                                        </span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginRight: 12 }}>
                                    <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-red)' }}>
                                        -{formatCurrency(e.amount)}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="btn-icon" onClick={() => handleEdit(e)} title="Edit">
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn-icon btn-danger" onClick={() => deleteExpense(e.id)} title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <ExpenseModal
                        expense={editItem}
                        onSave={handleSave}
                        onClose={() => { setShowModal(false); setEditItem(null); }}
                        CATEGORIES={CATEGORIES}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
