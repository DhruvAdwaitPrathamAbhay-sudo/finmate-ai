import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    style,
    ...props
}) {
    const ref = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [ripple, setRipple] = useState(null);

    function handleMouseMove(e) {
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.15;
        const dy = (e.clientY - cy) * 0.15;
        setPos({ x: dx, y: dy });
    }

    function handleMouseLeave() {
        setPos({ x: 0, y: 0 });
    }

    function handleClick(e) {
        const rect = ref.current.getBoundingClientRect();
        setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now(),
        });
        setTimeout(() => setRipple(null), 600);
        onClick?.(e);
    }

    const variantClass =
        variant === 'primary'
            ? 'magnetic-btn-primary'
            : variant === 'danger'
                ? 'magnetic-btn-danger'
                : 'magnetic-btn-secondary';

    const sizeClass = size === 'sm' ? 'magnetic-btn-sm' : size === 'lg' ? 'magnetic-btn-lg' : '';

    return (
        <motion.button
            ref={ref}
            className={`magnetic-btn ${variantClass} ${sizeClass} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            animate={{ x: pos.x, y: pos.y }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={style}
            {...props}
        >
            <span className="magnetic-btn-content">{children}</span>
            {ripple && (
                <span
                    className="magnetic-btn-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                    key={ripple.id}
                />
            )}
        </motion.button>
    );
}
