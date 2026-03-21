import React, { useEffect, useState } from 'react';

function getTimeGradient() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return ['rgba(14, 165, 233, 0.1)', 'rgba(37, 99, 235, 0.08)']; // morning blue
    if (h >= 12 && h < 17) return ['rgba(37, 99, 235, 0.1)', 'rgba(30, 64, 175, 0.08)']; // afternoon blue
    if (h >= 17 && h < 21) return ['rgba(79, 70, 229, 0.1)', 'rgba(124, 58, 237, 0.08)']; // evening purple-blue
    return ['rgba(37, 99, 235, 0.12)', 'rgba(5, 8, 16, 0.2)']; // deep night
}

export default function ParallaxBackground() {
    const [scrollY, setScrollY] = useState(0);
    const [colors] = useState(getTimeGradient);

    useEffect(() => {
        function onScroll() {
            setScrollY(window.scrollY);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const parallax = scrollY * 0.5;

    return (
        <div className="parallax-bg" aria-hidden="true">
            {/* Background Blobs (moved from AuthPage for global theme consistency) */}
            <div className="auth-bg-blob" style={{ width: 600, height: 600, background: 'var(--accent-purple)', top: -200, left: -200, opacity: 0.1, filter: 'blur(120px)' }} />
            <div className="auth-bg-blob" style={{ width: 500, height: 500, background: 'var(--accent-blue)', bottom: -150, right: -150, opacity: 0.1, filter: 'blur(100px)' }} />
            <div className="auth-bg-blob" style={{ width: 400, height: 400, background: 'var(--accent-teal)', top: '40%', left: '40%', opacity: 0.08, filter: 'blur(90px)' }} />

            {/* Noise/grain overlay */}
            <svg className="grain-overlay" width="100%" height="100%">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* Floating blobs with parallax */}
            <div
                className="parallax-blob blob-1"
                style={{
                    background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
                    transform: `translateY(${-parallax * 0.3}px)`,
                }}
            />
            <div
                className="parallax-blob blob-2"
                style={{
                    background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
                    transform: `translateY(${-parallax * 0.2}px)`,
                }}
            />
            <div
                className="parallax-blob blob-3"
                style={{
                    background: `radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)`,
                    transform: `translateY(${-parallax * 0.15}px)`,
                }}
            />
        </div>
    );
}
