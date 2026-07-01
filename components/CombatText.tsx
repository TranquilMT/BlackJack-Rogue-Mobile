
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CombatTextInfo = {
    id: number;
    value: number | string;
    type: 'player-damage' | 'boss-damage' | 'player-heal' | 'boss-heal' | 'shield' | 'xp-gain';
};

interface CombatTextProps {
    queue: CombatTextInfo[];
    onClear: (id: number) => void;
}

const CombatText: React.FC<CombatTextProps> = React.memo(({ queue, onClear }) => {
    
    const getTypeStyles = (type: CombatTextInfo['type']) => {
        switch (type) {
            case 'player-damage': return { color: '#ef4444', left: '20%', top: '65%' };
            case 'boss-damage': return { color: '#f97316', left: '80%', top: '15%' };
            case 'player-heal': return { color: '#22c55e', left: '20%', top: '65%' };
            case 'boss-heal': return { color: '#16a34a', left: '80%', top: '15%' };
            case 'shield': return { color: '#3b82f6', left: '20%', top: '70%' };
            case 'xp-gain': return { color: '#facc15', left: '10%', top: '15%' };
            default: return { color: 'white', left: '50%', top: '50%' };
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-[80] overflow-hidden">
            <AnimatePresence>
                {queue.map(item => {
                    const styles = getTypeStyles(item.type);
                    const isDamage = typeof item.value === 'number' && item.value < 0;
                    const displayValue = isDamage ? item.value : `${item.value}`;
                    
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20, scale: 0.5, rotate: (Math.random() - 0.5) * 20 }}
                            animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.5, 1, 0.8], rotate: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.1, 0.8, 1] }}
                            onAnimationComplete={() => onClear(item.id)}
                            className="absolute font-black text-3xl md:text-6xl tracking-tighter font-rogue-number"
                            style={{
                                left: styles.left,
                                top: styles.top,
                                color: styles.color,
                                textShadow: `0 0 10px ${styles.color}, 0 0 20px rgba(0,0,0,0.8)`,
                                transform: 'translateX(-50%)',
                            }}
                        >
                            {displayValue}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
});

export default CombatText;
