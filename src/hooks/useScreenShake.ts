
import { useState, useCallback } from 'react';

export const useScreenShake = () => {
    const [shake, setShake] = useState({ x: 0, y: 0 });

    const triggerShake = useCallback((intensity: number = 5, duration: number = 200) => {
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            if (elapsed < duration) {
                const remaining = 1 - (elapsed / duration);
                const x = (Math.random() - 0.5) * 2 * intensity * remaining;
                const y = (Math.random() - 0.5) * 2 * intensity * remaining;
                setShake({ x, y });
                requestAnimationFrame(animate);
            } else {
                setShake({ x: 0, y: 0 });
            }
        };
        
        requestAnimationFrame(animate);
    }, []);

    return { shake, triggerShake };
};
