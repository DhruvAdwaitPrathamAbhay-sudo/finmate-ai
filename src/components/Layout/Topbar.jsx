import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Sun, Moon } from 'lucide-react';

function getGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    if (h >= 17 && h < 21) return 'Good evening';
    return 'Good night';
}

export default function Topbar({ onMenuClick, title }) {
    const { theme, toggleTheme, user } = useApp();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="btn-icon" onClick={onMenuClick} style={{ display: 'block' }}>
                    <Menu size={18} />
                </button>
                <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {title}
                    </div>
                    {user && (
                        <span className="greeting-text">
                            {getGreeting()}, <strong>{user.name?.split(' ')[0]}</strong> 👋
                        </span>
                    )}
                </div>
            </div>
            <div className="topbar-right">
                <button
                    className={`theme-toggle ${theme === 'light' ? 'light' : ''}`}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    <div className="theme-toggle-knob" />
                </button>
                {user && (
                    <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
        </header>
    );
}
