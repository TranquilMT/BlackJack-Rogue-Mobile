import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { X, Lock, Unlock } from 'lucide-react';
import { audioManager } from '../services/audioManager';

interface SkillTreeProps {
  isOpen: boolean;
  onClose: () => void;
  skillPoints: number;
  unlockedSkills: string[];
  onUnlockSkill: (skillId: string, cost: number) => void;
}

const initialNodes: Node[] = [
  {
    id: 'root',
    type: 'default',
    data: { label: 'The Awakening\n(Start)' },
    position: { x: 400, y: 50 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'hp_1',
    data: { label: 'Vitality I\n(+10 Max HP)\nCost: 50' },
    position: { x: 250, y: 150 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'dmg_1',
    data: { label: 'Strength I\n(+1 Damage)\nCost: 50' },
    position: { x: 550, y: 150 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'hp_2',
    data: { label: 'Vitality II\n(+20 Max HP)\nCost: 100' },
    position: { x: 100, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'shield_1',
    data: { label: 'Aegis I\n(+5 Shield on Stand)\nCost: 75' },
    position: { x: 250, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'crit_1',
    data: { label: 'Precision I\n(+5% Crit Chance)\nCost: 75' },
    position: { x: 550, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'dmg_2',
    data: { label: 'Strength II\n(+2 Damage)\nCost: 100' },
    position: { x: 700, y: 250 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'potion_1',
    data: { label: 'Alchemy I\n(+1 Potion Slot)\nCost: 150' },
    position: { x: 400, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'focus_1',
    data: { label: 'Clarity I\n(+1 Focus Gain)\nCost: 150' },
    position: { x: 400, y: 450 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'void_1',
    data: { label: 'Void Affinity I\n(+5% Void Chest Chance)\nCost: 200' },
    position: { x: 400, y: 550 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'void_2',
    data: { label: 'Void Power I\n(+10% Void Damage)\nCost: 250' },
    position: { x: 250, y: 650 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'void_3',
    data: { label: 'Void Resilience I\n(+10 Max HP in Void)\nCost: 1' },
    position: { x: 550, y: 650 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'luck_1',
    data: { label: 'Fortune I\n(+5% Luck)\nCost: 1' },
    position: { x: 700, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'shield_2',
    data: { label: 'Aegis II\n(+10 Shield on Stand)\nCost: 1' },
    position: { x: 100, y: 350 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'void_4',
    data: { label: 'Void Power II\n(+20% Void Damage)\nCost: 1' },
    position: { x: 250, y: 750 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
];

const initialEdges: Edge[] = [
  { id: 'e-root-hp1', source: 'root', target: 'hp_1', animated: true },
  { id: 'e-root-dmg1', source: 'root', target: 'dmg_1', animated: true },
  { id: 'e-hp1-hp2', source: 'hp_1', target: 'hp_2', animated: true },
  { id: 'e-hp1-shield1', source: 'hp_1', target: 'shield_1', animated: true },
  { id: 'e-dmg1-crit1', source: 'dmg_1', target: 'crit_1', animated: true },
  { id: 'e-dmg1-dmg2', source: 'dmg_1', target: 'dmg_2', animated: true },
  { id: 'e-shield1-potion1', source: 'shield_1', target: 'potion_1', animated: true },
  { id: 'e-crit1-potion1', source: 'crit_1', target: 'potion_1', animated: true },
  { id: 'e-potion1-focus1', source: 'potion_1', target: 'focus_1', animated: true },
  { id: 'e-focus1-void1', source: 'focus_1', target: 'void_1', animated: true },
  { id: 'e-void1-void2', source: 'void_1', target: 'void_2', animated: true },
  { id: 'e-void1-void3', source: 'void_1', target: 'void_3', animated: true },
  { id: 'e-crit1-luck1', source: 'crit_1', target: 'luck_1', animated: true },
  { id: 'e-shield1-shield2', source: 'shield_1', target: 'shield_2', animated: true },
  { id: 'e-void2-void4', source: 'void_2', target: 'void_4', animated: true },
];

const SKILL_COSTS: Record<string, number> = {
  'root': 0,
  'hp_1': 1,
  'dmg_1': 1,
  'hp_2': 1,
  'shield_1': 1,
  'crit_1': 1,
  'dmg_2': 1,
  'potion_1': 1,
  'focus_1': 1,
  'void_1': 1,
  'void_2': 1,
  'void_3': 1,
  'luck_1': 1,
  'shield_2': 1,
  'void_4': 1,
};

export default function SkillTree({ isOpen, onClose, skillPoints, unlockedSkills, onUnlockSkill }: SkillTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    audioManager.playSound('button-click');
  }, []);

  const handleUnlock = () => {
    if (!selectedNode) return;
    const cost = SKILL_COSTS[selectedNode.id];
    
    // Check if parent is unlocked (simplified logic: just check if it's not root)
    const incomingEdges = edges.filter(e => e.target === selectedNode.id);
    const canUnlock = selectedNode.id === 'root' || incomingEdges.some(e => unlockedSkills.includes(e.source) || e.source === 'root');

    if (canUnlock && skillPoints >= cost && !unlockedSkills.includes(selectedNode.id)) {
      onUnlockSkill(selectedNode.id, cost);
      audioManager.playSound('achievement-unlock');
    } else {
      audioManager.playSound('lose-hand');
    }
  };

  if (!isOpen) return null;

  // Update node styles based on unlock status
  const styledNodes = nodes.map(node => {
    const isUnlocked = unlockedSkills.includes(node.id) || node.id === 'root';
    const incomingEdges = edges.filter(e => e.target === node.id);
    const isUnlockable = node.id !== 'root' && incomingEdges.some(e => unlockedSkills.includes(e.source) || e.source === 'root');
    
    return {
      ...node,
      style: {
        background: isUnlocked ? '#4f46e5' : isUnlockable ? '#374151' : '#1f2937',
        color: isUnlocked ? '#fff' : '#9ca3af',
        border: isUnlocked ? '2px solid #818cf8' : '2px solid #4b5563',
        borderRadius: '8px',
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        boxShadow: isUnlocked ? '0 0 15px rgba(79, 70, 229, 0.5)' : 'none',
      }
    };
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border-2 border-indigo-500/50 rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl shadow-indigo-900/20 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/80 z-10">
          <div>
            <h2 className="text-3xl font-bold text-indigo-400 font-serif-display tracking-widest uppercase">Skill Tree</h2>
            <p className="text-sm text-gray-400">Unlock permanent meta-progression upgrades.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Skill Points</p>
              <p className="text-xl font-black text-yellow-400 font-rogue-number">{skillPoints} 💠</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative flex">
          <div className="flex-1 h-full">
            <ReactFlow
              nodes={styledNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              className="bg-gray-950"
              colorMode="dark"
            >
              <Background color="#374151" gap={16} />
              <Controls className="bg-gray-800 border-gray-700 fill-gray-300" />
              <MiniMap nodeColor={(n) => unlockedSkills.includes(n.id) ? '#4f46e5' : '#374151'} maskColor="rgba(0,0,0,0.7)" className="bg-gray-900" />
            </ReactFlow>
          </div>
          
          {/* Side Panel for Node Details */}
          <div className="w-80 bg-gray-900 border-l border-gray-800 p-6 flex flex-col">
            {selectedNode ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-2 whitespace-pre-line">{selectedNode.data.label.toString().split('\n')[0]}</h3>
                <p className="text-indigo-300 mb-6 whitespace-pre-line">{selectedNode.data.label.toString().split('\n').slice(1).join('\n')}</p>
                
                <div className="mt-auto">
                  {selectedNode.id === 'root' ? (
                    <div className="text-center text-gray-400 italic">Starting Node</div>
                  ) : unlockedSkills.includes(selectedNode.id) ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold p-3 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                      <Unlock className="w-5 h-5" /> Unlocked
                    </div>
                  ) : (
                    <button
                      onClick={handleUnlock}
                      disabled={skillPoints < SKILL_COSTS[selectedNode.id]}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
                    >
                      <Lock className="w-5 h-5" />
                      Unlock (<span className="font-rogue-number">{SKILL_COSTS[selectedNode.id]}</span> 💠)
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-center italic">
                Select a node to view details and unlock upgrades.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
