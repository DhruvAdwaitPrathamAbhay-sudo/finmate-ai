import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingIcon({
    children,
    size = 44,
    color,
    delay = 0,
    amplitude = 8,
    duration = 3,
    className = '',
    style,
}) {
    return (
        <motion.div
            className={`floating-icon ${className}`}
            animate={{ y: [-amplitude, amplitude, -amplitude] }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
            }}
            style={{
                width: size,
                height: size,
                background: color || 'rgba(139,92,246,0.15)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                ...style,
            }}
        >
            {children}
        </motion.div>
    );
}
