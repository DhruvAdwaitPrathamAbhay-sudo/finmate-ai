import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Bell, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick, title }) {
    const { theme, toggleTheme, user } = useApp();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="btn-icon" onClick={onMenuClick} style={{ display: 'none' }} id="menu-btn">
                    <Menu size={18} />
                </button>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
            <div className="topbar-right">
                <button
                    onClick={toggleTheme}
                    className="btn-icon"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                {user && (
                    <div className="user-avatar" title={user.name}>
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </header>
    );
}
