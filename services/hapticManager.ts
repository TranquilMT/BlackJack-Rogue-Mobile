
class HapticManager {
    private enabled: boolean = true;

    constructor() {
        // Check if navigator.vibrate is available
        if (typeof window !== 'undefined' && !window.navigator.vibrate) {
            this.enabled = false;
        }
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    public trigger(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') {
        if (!this.enabled || typeof window === 'undefined') return;

        try {
            switch (type) {
                case 'light':
                    // Subtle tap (e.g., button hover, card deal)
                    navigator.vibrate(10);
                    break;
                case 'medium':
                    // Standard feedback (e.g., Hit, card landing)
                    navigator.vibrate(20);
                    break;
                case 'heavy':
                    // Impact (e.g., Taking damage, Busting)
                    navigator.vibrate(40);
                    break;
                case 'success':
                    // Win / Gain (e.g., Hand Win, Money gain)
                    navigator.vibrate([10, 30, 10]); 
                    break;
                case 'warning':
                    // Low HP / Critical state
                    navigator.vibrate([30, 20, 10]);
                    break;
                case 'error':
                    // Invalid action
                    navigator.vibrate([50, 50, 50]);
                    break;
            }
        } catch (e) {
            // Ignore errors if vibration fails or is blocked
        }
    }
}

export const hapticManager = new HapticManager();
