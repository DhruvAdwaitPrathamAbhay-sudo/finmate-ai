import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
    LayoutDashboard, Wallet, BarChart2, Bot, Lightbulb,
    TrendingUp, Target, LogOut, X, Menu
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/charts', icon: BarChart2, label: 'Charts' },
    { path: '/chatbot', icon: Bot, label: 'AI Assistant' },
    { path: '/insights', icon: Lightbulb, label: 'Insights' },
    { path: '/predictions', icon: TrendingUp, label: 'Predictions' },
    { path: '/goals', icon: Target, label: 'Goals' },
];

export default function Sidebar({ open, onClose }) {
    const { user, logout, monthlyIncome, updateIncome } = useApp();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99, backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
            )}
            <aside className={`sidebar ${open ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1>💎 FinMate AI</h1>
                            <p>Smart Finance for Students</p>
                        </div>
                        <button className="btn-icon" onClick={onClose} style={{ display: 'none' }} id="close-sidebar">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-section-title">Main Menu</p>
                    {navItems.map(({ path, icon: Icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}

                    <p className="nav-section-title" style={{ marginTop: 24 }}>Settings</p>
                    <div style={{ padding: '8px 10px' }}>
                        <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                            Monthly Income (₹)
                        </label>
                        <input
                            type="number"
                            value={monthlyIncome}
                            onChange={e => updateIncome(Number(e.target.value))}
                            style={{ fontSize: 13, padding: '8px 10px' }}
                        />
                    </div>
                </nav>

                <div className="sidebar-footer">
                    {user && (
                        <div className="sidebar-user">
                            <div className="user-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    )}
                    <button className="btn btn-danger btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={handleLogout}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
