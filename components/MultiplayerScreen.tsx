import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Shield, Sword } from 'lucide-react';

interface MultiplayerScreenProps {
  socket: any;
  onBack: () => void;
  onStartGame: (roomId: string) => void;
}

export default function MultiplayerScreen({ socket, onBack, onStartGame }: MultiplayerScreenProps) {
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'waiting' | 'ready'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_created', (id: string) => {
      setRoomId(id);
      setStatus('waiting');
    });

    socket.on('player_joined', ({ playerCount }: { playerCount: number }) => {
      if (playerCount === 2) {
        setStatus('ready');
        setTimeout(() => onStartGame(roomId), 1000);
      }
    });

    socket.on('error', (msg: string) => {
      setError(msg);
      setStatus('idle');
    });

    return () => {
      socket.off('room_created');
      socket.off('player_joined');
      socket.off('error');
    };
  }, [socket, roomId, onStartGame]);

  const handleCreateRoom = () => {
    setStatus('connecting');
    setError(null);
    const newRoomId = Math.random().toString(36).substring(7);
    socket.emit('create_room', newRoomId);
  };

  const handleJoinRoom = () => {
    if (!roomId) return;
    setStatus('connecting');
    setError(null);
    socket.emit('join_room', roomId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/90 text-white p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 bg-black/80 border border-purple-500/30 p-8 rounded-2xl backdrop-blur-md max-w-md w-full shadow-2xl shadow-purple-900/20"
      >
        <div className="flex items-center justify-center mb-6">
          <Users className="w-12 h-12 text-purple-400 mr-3" />
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Multiplayer Duel
            </h2>
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] text-center">Experimental Beta</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {status === 'idle' && (
          <div className="space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Create New Room
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">OR JOIN EXISTING</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomId}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors border border-gray-700 hover:border-gray-500"
              >
                Join
              </button>
            </div>
          </div>
        )}

        {status === 'waiting' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Waiting for Opponent...</h3>
            <p className="text-gray-400 mb-6">Share this code with your friend:</p>
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 text-2xl font-mono tracking-wider select-all cursor-pointer hover:bg-purple-900/50 transition-colors">
              {roomId}
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="text-center py-8">
            <Sword className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-green-400">Opponent Found!</h3>
            <p className="text-gray-400">Starting duel...</p>
          </div>
        )}

        <button
          onClick={onBack}
          className="mt-6 w-full py-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
        >
          Back to Main Menu
        </button>
      </motion.div>
    </div>
  );
}
