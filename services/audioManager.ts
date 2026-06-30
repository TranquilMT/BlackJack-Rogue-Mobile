
import type { SoundId } from '../types';
import { hapticManager } from './hapticManager';

class AudioManager {
    private audioContext: AudioContext | null = null;
    private mainGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                this.mainGain = this.audioContext.createGain();
                this.mainGain.connect(this.audioContext.destination);
                this.setVolume(0.5); 
            }
        }
    }

    public setVolume(vol: number) {
        if (this.mainGain) {
            this.mainGain.gain.setValueAtTime(vol, this.audioContext!.currentTime);
        }
    }

    public async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    private play(soundFn: (ctx: AudioContext, destination: AudioNode) => void) {
        if (!this.audioContext || !this.mainGain) return;
        if (this.audioContext.state === 'suspended') {
            this.resume();
        }
        soundFn(this.audioContext, this.mainGain);
    }

    public playSound(id: SoundId): void {
        // Trigger haptic feedback based on sound type
        switch (id) {
            case 'button-click':
            case 'card-deal':
            case 'card-hit':
            case 'wheel-tick':
            case 'coin-pickup':
                hapticManager.trigger('light');
                break;
            case 'player-damage':
            case 'boss-damage':
            case 'rumble':
            case 'burn-token':
                hapticManager.trigger('heavy');
                break;
            case 'player-heal':
            case 'win-hand':
            case 'boon-acquire':
            case 'synergy':
            case 'level-up':
            case 'relic-acquire':
            case 'achievement-unlock':
            case 'victory-fanfare':
            case 'wheel-win':
            case 'shield-gain':
            case 'potion-use':
            case 'reward-reveal':
            case 'chest-open':
                hapticManager.trigger('success');
                break;
            case 'lose-hand':
            case 'shield-break':
                hapticManager.trigger('warning');
                break;
            case 'defeat-sting':
                hapticManager.trigger('error');
                break;
            case 'wheel-spin':
                hapticManager.trigger('medium');
                break;
            default:
                hapticManager.trigger('light');
                break;
        }

        this.play((ctx, dest) => {
            const now = ctx.currentTime;
            let osc: OscillatorNode;
            let gain: GainNode;

            switch (id) {
                case 'button-click':
                    osc = ctx.createOscillator();
                    gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, now);
                    gain.gain.setValueAtTime(1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                    osc.connect(gain);
                    gain.connect(dest);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;

                case 'card-deal':
                case 'card-hit':
                    this.playNoise(0.05, -2, 4000);
                    break;
                
                case 'player-damage':
                    this.playTone(300, 200, 0.2, 'sawtooth');
                    break;
                
                case 'boss-damage':
                    this.playTone(200, 100, 0.2, 'square');
                    break;

                case 'player-heal':
                    this.playArpeggio([440, 550, 660, 880], 0.05);
                    break;

                case 'win-hand':
                case 'boon-acquire':
                    this.playArpeggio([523, 659, 783], 0.08);
                    break;
                
                case 'lose-hand':
                    this.playArpeggio([220, 164, 110], 0.1);
                    break;
                
                case 'synergy':
                case 'level-up':
                case 'relic-acquire':
                case 'achievement-unlock':
                    this.playArpeggio([440, 587, 880, 1174], 0.06);
                    break;
                
                case 'victory-fanfare':
                    this.playArpeggio([523, 659, 783, 1046, 783, 1046], 0.1);
                    break;
                
                case 'defeat-sting':
                    this.playChord([110, 115, 120], 0.5, 'sawtooth');
                    break;

                case 'rumble':
                    this.playTone(80, 40, 0.5, 'triangle');
                    break;

                case 'wheel-tick':
                     this.playNoise(0.02, -10, 8000);
                    break;
                
                case 'wheel-win':
                    this.playArpeggio([600, 800, 1200], 0.15);
                    break;

                case 'wheel-spin':
                    this.playSweep(100, 50, 5, 'sawtooth');
                    break;

                case 'shield-gain':
                    this.playSweep(400, 1200, 0.2, 'sine');
                    break;
                
                case 'shield-break':
                    this.playNoise(0.3, -1, 1000);
                    break;

                case 'potion-use':
                case 'reward-reveal':
                     this.playArpeggio([880, 1318, 1046], 0.07);
                     break;

                case 'coin-pickup':
                    this.playTone(1046, 1046, 0.1, 'sine');
                    setTimeout(() => this.playTone(1396, 1396, 0.1, 'sine'), 50);
                    break;
                
                case 'focus-full':
                    this.playSweep(600, 900, 0.3, 'triangle');
                    break;

                case 'chest-open':
                    this.playSweep(100, 200, 0.1, 'square');
                    setTimeout(() => this.playArpeggio([600, 800], 0.05), 100);
                    break;

                case 'burn-token':
                    this.playTone(150, 50, 0.8, 'sawtooth');
                    this.playNoise(0.7, -5, 1500);
                    break;

                default:
                    // Generic sound for others like stand, split, double, curse
                    this.playTone(440, 440, 0.1, 'triangle');
                    break;
            }
        });
    }

    private playTone(startFreq: number, endFreq: number, duration: number, type: OscillatorType) {
        this.play((ctx, dest) => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.8);
            gain.gain.setValueAtTime(0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(now);
            osc.stop(now + duration);
        });
    }
    
    private playArpeggio(notes: number[], duration: number) {
        this.play((ctx, dest) => {
             notes.forEach((note, i) => {
                setTimeout(() => this.playTone(note, note, duration, 'sine'), i * (duration*1000));
            });
        });
    }
    
    private playChord(notes: number[], duration: number, type: OscillatorType) {
        this.play((ctx, dest) => {
            notes.forEach(note => {
                this.playTone(note, note, duration, type);
            });
        });
    }

    private playNoise(duration: number, filterQ: number, filterFreq: number) {
        this.play((ctx, dest) => {
            const now = ctx.currentTime;
            const bufferSize = ctx.sampleRate * duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = filterQ;
            filter.frequency.value = filterFreq;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(dest);
            noise.start(now);
            noise.stop(now + duration);
        });
    }

    private playSweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType) {
        this.play((ctx, dest) => {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
            osc.connect(gain);
            gain.connect(dest);
            osc.start(now);
            osc.stop(now + duration);
        });
    }
}

export const audioManager = new AudioManager();
