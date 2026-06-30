
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MetaState } from '../types';
import { GraphicsQuality } from '../types';
import { audioManager } from '../services/audioManager';

interface SettingsScreenProps {
  onBack: () => void;
  metaState: MetaState;
  updateMetaState: (newState: Partial<MetaState>) => void;
  setShowPatchNotes: (show: boolean) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, metaState, updateMetaState, setShowPatchNotes }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'graphics'>('general');
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleMasterReset = () => {
    audioManager.playSound('button-click');
    localStorage.clear();
    window.location.reload();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    audioManager.setVolume(newVolume);
    updateMetaState({
        customization: {
            ...metaState.customization,
            volume: newVolume,
        }
    });
  };

  const handleGraphicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const qualities = [GraphicsQuality.Minimal, GraphicsQuality.Low, GraphicsQuality.Medium, GraphicsQuality.High, GraphicsQuality.Ultra];
    const newQuality = qualities[value];
    
    updateMetaState({
        customization: {
            ...metaState.customization,
            graphicsQuality: newQuality,
        }
    });
  };

  const getGraphicsValue = (quality?: GraphicsQuality) => {
      const qualities = [GraphicsQuality.Minimal, GraphicsQuality.Low, GraphicsQuality.Medium, GraphicsQuality.High, GraphicsQuality.Ultra];
      return qualities.indexOf(quality || GraphicsQuality.High);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white relative">
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div
        key="settings"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center"
      >
        <h1 className="text-6xl font-bold font-serif-display text-white mb-10 drop-shadow-2xl tracking-tighter">System</h1>
        
        <div className="bg-black/60 p-10 rounded-[40px] space-y-10 w-full border border-white/5 backdrop-blur-3xl shadow-2xl">
            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('general')} className={`flex-1 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-black' : 'bg-gray-950 text-gray-500'}`}>General</button>
                <button onClick={() => setActiveTab('graphics')} className={`flex-1 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'graphics' ? 'bg-white text-black' : 'bg-gray-950 text-gray-500'}`}>Graphics</button>
            </div>

            {activeTab === 'general' && (
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Audio Synthesis</h2>
                            <span className="text-xs font-bold text-red-500">{Math.round((metaState.customization.volume ?? 0.5) * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={metaState.customization.volume ?? 0.5}
                            onChange={handleVolumeChange}
                            className="w-full h-2 bg-gray-950 rounded-full appearance-none cursor-pointer accent-red-500 border border-white/5"
                        />
                    </div>

                    <div className="pt-6 border-t border-white/5 text-center space-y-4">
                        <button
                            onClick={() => setShowPatchNotes(true)}
                            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-colors border border-zinc-700"
                        >
                            View Patch Notes
                        </button>
                        <button
                            onClick={() => setIsConfirmingReset(true)}
                            className="text-red-500/40 text-[10px] hover:text-red-500 font-black uppercase tracking-widest underline transition-colors"
                        >
                            Purge All Neural Data
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'graphics' && (
                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Graphics Quality</h2>
                            <span className="text-xs font-bold text-blue-400">{metaState.customization.graphicsQuality || GraphicsQuality.High}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            step="1"
                            value={getGraphicsValue(metaState.customization.graphicsQuality)}
                            onChange={handleGraphicsChange}
                            className="w-full h-2 bg-gray-950 rounded-full appearance-none cursor-pointer accent-blue-500 border border-white/5"
                        />
                        <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase tracking-widest px-1">
                            <span>Min</span>
                            <span>Low</span>
                            <span>Med</span>
                            <span>High</span>
                            <span>Ultra</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Device Mode</h2>
                            <span className="text-xs font-bold text-purple-500">{metaState.customization.deviceMode === 'desktop' ? 'Desktop' : 'Mobile'}</span>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <button 
                                onClick={() => updateMetaState({ customization: { ...metaState.customization, deviceMode: 'mobile' } })}
                                className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${metaState.customization.deviceMode === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-950 text-gray-600 border border-white/5'}`}
                            >
                                Mobile
                            </button>
                            <button 
                                onClick={() => updateMetaState({ customization: { ...metaState.customization, deviceMode: 'desktop' } })}
                                className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${metaState.customization.deviceMode === 'desktop' ? 'bg-purple-600 text-white' : 'bg-gray-950 text-gray-600 border border-white/5'}`}
                            >
                                Desktop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <motion.button
          onClick={onBack}
          className="mt-12 px-12 py-4 bg-gray-900 border border-white/10 text-white font-black rounded-2xl hover:bg-gray-800 uppercase text-xs tracking-widest transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Main Menu
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isConfirmingReset && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 z-[200] flex items-center justify-center backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gray-950 p-12 rounded-[50px] border border-red-500/30 text-center max-w-sm shadow-[0_0_100px_rgba(220,38,38,0.2)]"
                >
                    <h3 className="text-3xl font-black text-red-500 uppercase tracking-tighter mb-4 font-serif-display">Neural Purge</h3>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed font-bold">This action will permanently delete all $RELIC, Shards, and Syndicate progress. <b>Neuro-destruction is irreversible.</b></p>
                    <div className="space-y-4">
                        <button onClick={handleMasterReset} className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-2xl">Confirm Deletion</button>
                        <button onClick={() => setIsConfirmingReset(false)} className="w-full py-5 bg-transparent text-gray-500 hover:text-white font-black rounded-2xl uppercase text-xs tracking-widest">Abort</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsScreen;