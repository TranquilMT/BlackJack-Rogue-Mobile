import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart, Shield } from 'lucide-react';

interface SeasonalEventScreenProps {
    onSelect: (rewardId: string) => void;
}

const SeasonalEventScreen: React.FC<SeasonalEventScreenProps> = ({ onSelect }) => {
    const rewards = [
        {
            id: 'void_shards',
            name: 'Void Shards',
            description: 'Gain 250 Shards immediately.',
            icon: <Sparkles className="w-8 h-8 text-purple-400" />,
            color: 'from-purple-900/40 to-black',
            borderColor: 'border-purple-500/50'
        },
        {
            id: 'void_hp',
            name: 'Void Vitality',
            description: 'Increase Max HP by 20 and heal for 20.',
            icon: <Heart className="w-8 h-8 text-red-400" />,
            color: 'from-red-900/40 to-black',
            borderColor: 'border-red-500/50'
        },
        {
            id: 'void_relic',
            name: 'Void Essence',
            description: 'Harness the power of the void (Coming Soon).',
            icon: <Zap className="w-8 h-8 text-blue-400" />,
            color: 'from-blue-900/40 to-black',
            borderColor: 'border-blue-500/50'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-4xl p-8 text-center"
            >
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-purple-400 uppercase border border-purple-500/30 bg-purple-500/10 rounded-full">
                            Seasonal Event: The Void Awakening
                        </span>
                        <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">
                            The Mystic <span className="text-purple-500">Altar</span>
                        </h2>
                        <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
                            The void ripples as you approach the ancient altar. A gift is offered, but only one can be claimed.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rewards.map((reward, index) => (
                        <motion.button
                            key={reward.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSelect(reward.id)}
                            className={`group relative flex flex-col items-center p-8 rounded-3xl border ${reward.borderColor} bg-gradient-to-b ${reward.color} transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]`}
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                {reward.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {reward.description}
                            </p>
                            
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-3xl" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-zinc-500 text-xs uppercase tracking-widest font-medium"
                >
                    Choose wisely, wanderer.
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SeasonalEventScreen;
