import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LightingOverlay: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div 
            className="fixed inset-0 pointer-events-none z-10 mix-blend-overlay"
            style={{
                background: `
                    radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%),
                    radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.05) 0%, rgba(0, 0, 0, 0) 100%)
                `,
            }}
        />
    );
};
