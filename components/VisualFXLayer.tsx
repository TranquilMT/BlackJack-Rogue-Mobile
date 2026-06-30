
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SlashParams = { id: number; x: number; y: number; angle: number };
export type SplatterParams = { id: number; x: number; y: number; scale: number; color: string };
export type ShockwaveParams = { id: number; x: number; y: number };

interface VisualFXLayerProps {
    slashes: SlashParams[];
    splatters: SplatterParams[];
    shockwaves?: ShockwaveParams[];
    onSlashComplete: (id: number) => void;
    onShockwaveComplete?: (id: number) => void;
    isBossStunned?: boolean;
}

const VisualFXLayer: React.FC<VisualFXLayerProps> = memo(({ slashes, splatters, shockwaves = [], onSlashComplete, onShockwaveComplete, isBossStunned }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-[45] overflow-hidden">
            {/* Stun Effect (Boss area) */}
            <AnimatePresence>
                {isBossStunned && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-[25%] right-[25%] transform translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                         {/* Flying Stars/Orbits */}
                         {Array.from({length: 3}).map((_, i) => (
                             <motion.div 
                                key={i}
                                className="absolute text-yellow-400 text-4xl"
                                animate={{ 
                                    rotate: 360,
                                    x: [0, 80, 0, -80, 0],
                                    y: [40, 0, -40, 0, 40],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: i * 0.6
                                }}
                             >💫</motion.div>
                         ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Blood Splatters on the 'floor' */}
            {splatters.map(splat => (
                <motion.div
                    key={splat.id}
                    initial={{ opacity: 0.8, scale: 0 }}
                    animate={{ opacity: 0, scale: splat.scale }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                    className="absolute rounded-full"
                    style={{
                        left: splat.x,
                        top: splat.y,
                        width: 100,
                        height: 100,
                        backgroundColor: splat.color,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        boxShadow: `0 0 10px 5px ${splat.color}`,
                        willChange: 'transform, opacity'
                    }}
                />
            ))}

            {/* Shockwaves */}
            <AnimatePresence>
                {shockwaves.map(wave => (
                    <motion.div
                        key={wave.id}
                        initial={{ scale: 0, opacity: 1, borderWidth: 60 }}
                        animate={{ scale: 8, opacity: 0, borderWidth: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        onAnimationComplete={() => onShockwaveComplete && onShockwaveComplete(wave.id)}
                        className="absolute rounded-full border-white"
                        style={{
                            left: wave.x,
                            top: wave.y,
                            width: 100,
                            height: 100,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 60,
                            boxShadow: '0 0 60px 30px rgba(255,255,255,0.9), inset 0 0 30px 15px rgba(255,255,255,0.6)',
                            willChange: 'transform, opacity'
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Slashes Overlay */}
            <AnimatePresence>
                {slashes.map(slash => (
                    <motion.div
                        key={slash.id}
                        initial={{ width: 0, opacity: 1, left: slash.x, top: slash.y, scaleY: 3 }}
                        animate={{ width: 1000, opacity: 0, left: slash.x - 500, scaleY: 0 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onAnimationComplete={() => onSlashComplete(slash.id)}
                        className="absolute h-8 bg-white shadow-[0_0_40px_#fff,0_0_80px_#ef4444]"
                        style={{
                            transform: `rotate(${slash.angle}deg)`,
                            transformOrigin: 'center',
                            zIndex: 50,
                            borderRadius: '50%',
                            willChange: 'transform, opacity'
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
});

export default VisualFXLayer;
