import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const spanClasses = {
    '2col': 'bento-2col',
    tall: 'bento-tall',
    full: 'bento-full',
    default: '',
};

export default function GlassCard({
    children,
    className = '',
    span = 'default',
    tilt = true,
    delay = 0,
    style,
    onClick,
    ...props
}) {
    const ref = useRef(null);
    const [transform, setTransform] = useState('');

    function handleMouseMove(e) {
        if (!tilt || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`);
    }

    function handleMouseLeave() {
        setTransform('');
    }

    return (
        <motion.div
            ref={ref}
            className={`glass-card-v2 ${spanClasses[span] || ''} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ ...style, transform: transform || undefined }}
            {...props}
        >
            <div className="glass-card-inner-glow" />
            {children}
        </motion.div>
    );
}
