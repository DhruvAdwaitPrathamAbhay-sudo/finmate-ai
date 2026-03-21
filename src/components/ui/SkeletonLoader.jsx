import React from 'react';

export default function SkeletonLoader({ width = '100%', height = 20, radius = 8, count = 1, gap = 10 }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton-shimmer"
                    style={{ width, height, borderRadius: radius }}
                />
            ))}
        </div>
    );
}
