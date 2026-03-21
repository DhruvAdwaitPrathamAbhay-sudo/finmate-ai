import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function onScroll() {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.div
            className="scroll-progress-bar"
            style={{ scaleX: progress / 100, transformOrigin: '0%' }}
        />
    );
}
