
import React, { useRef, useEffect, useImperativeHandle, forwardRef, memo } from 'react';
import { GraphicsQuality } from '../types';

export interface ParticleSystemHandle {
    spawn: (x: number, y: number, type: 'coin' | 'blood' | 'sparkle', count: number) => void;
}

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    type: 'coin' | 'blood' | 'sparkle';
    size: number;
    color: string;
    gravity: number;
    decay: number;
};

const getParticleConfig = (graphicsQuality: GraphicsQuality) => {
    switch (graphicsQuality) {
        case GraphicsQuality.Minimal:
            return { scale: 0.2, maxParticles: 80, pixelRatio: 1 };
        case GraphicsQuality.Low:
            return { scale: 0.45, maxParticles: 140, pixelRatio: 1 };
        case GraphicsQuality.Medium:
            return { scale: 0.7, maxParticles: 220, pixelRatio: 1.25 };
        case GraphicsQuality.Ultra:
            return { scale: 1, maxParticles: 420, pixelRatio: 1.5 };
        case GraphicsQuality.High:
        default:
            return { scale: 0.85, maxParticles: 320, pixelRatio: 1.25 };
    }
};

const ParticleSystem = memo(forwardRef<ParticleSystemHandle, { graphicsQuality?: GraphicsQuality }>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const reqRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const { graphicsQuality = GraphicsQuality.High } = props;

    useImperativeHandle(ref, () => ({
        spawn: (x, y, type, count) => {
            const config = getParticleConfig(graphicsQuality);
            let adjustedCount = Math.floor(count * config.scale);
            
            if (adjustedCount < 1) adjustedCount = 1;
            const availableSlots = Math.max(0, config.maxParticles - particlesRef.current.length);
            adjustedCount = Math.min(adjustedCount, availableSlots);
            if (adjustedCount === 0) return;

            for (let i = 0; i < adjustedCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                let speed = Math.random() * 5 + 2;
                
                let color = '#fff';
                let size = Math.random() * 3 + 2;
                let gravity = 0.2;
                let decay = 0.01 + Math.random() * 0.02;
                let vy = Math.sin(angle) * speed;

                if (type === 'coin') {
                    color = '#fbbf24';
                    vy -= 4; // More aggressive jump
                    decay = 0.01;
                    size = Math.random() * 4 + 2; // Larger
                } else if (type === 'blood') {
                    color = Math.random() > 0.5 ? '#dc2626' : '#991b1b'; // Brighter red
                    size = Math.random() * 4 + 2; // Larger
                    gravity = 0.4; // More gravity
                    speed = Math.random() * 8 + 4; // Faster
                    vy = Math.sin(angle) * speed - 2; // Upward bias
                } else if (type === 'sparkle') {
                    color = Math.random() > 0.5 ? '#fef08a' : '#ffffff'; // Yellow/white
                    gravity = 0.05; 
                    decay = 0.015; 
                    speed = Math.random() * 6 + 2;
                }

                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy,
                    life: 1.0,
                    type,
                    size,
                    color,
                    gravity,
                    decay
                });
            }
            
            // Restart animation loop if it was stopped
            if (!reqRef.current) {
                lastTimeRef.current = performance.now();
                reqRef.current = requestAnimationFrame(updateRef.current);
            }
        }
    }));

    const updateRef = useRef<(time: number) => void>(() => {});

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        updateRef.current = (time: number) => {
            if (particlesRef.current.length === 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                reqRef.current = null;
                return; // Stop loop
            }

            const dt = Math.min((time - lastTimeRef.current) / 16.67, 2);
            lastTimeRef.current = time;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vy += p.gravity * dt;
                
                p.life -= p.decay * dt;

                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                
                if (p.type === 'coin') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * (0.5 + Math.abs(Math.sin(time / 100)) * 0.5), 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
            reqRef.current = requestAnimationFrame(updateRef.current);
        };

        const handleResize = () => {
            const { pixelRatio } = getParticleConfig(graphicsQuality);
            canvas.width = Math.floor(window.innerWidth * pixelRatio);
            canvas.height = Math.floor(window.innerHeight * pixelRatio);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        
        // Don't start loop immediately unless there are particles
        if (particlesRef.current.length > 0) {
            lastTimeRef.current = performance.now();
            reqRef.current = requestAnimationFrame(updateRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
            reqRef.current = null;
        };
    }, [graphicsQuality]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[90]" />;
}));

export default ParticleSystem;
