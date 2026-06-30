import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card as CardType } from '../types';
import Card from './Card';
import { X, Layers } from 'lucide-react';

interface DeckManagerProps {
  deck: CardType[];
  isOpen: boolean;
  onClose: () => void;
  onReorder: (newDeck: CardType[]) => void;
}

export default function DeckManager({ deck, isOpen, onClose, onReorder }: DeckManagerProps) {
  if (!isOpen) return null;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(deck);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gray-900 border-2 border-indigo-500/50 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl shadow-indigo-900/20"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-serif-display tracking-wide">Deck Manager</h2>
              <p className="text-sm text-gray-400">Drag and drop to reorder your upcoming draws.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="deck" direction="horizontal" isCombineEnabled={false}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-4 justify-center"
                >
                  {deck.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform ${snapshot.isDragging ? 'scale-110 z-50' : 'hover:-translate-y-2'}`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Card card={{ ...card }} className="shadow-xl" />
                          <div className="text-center mt-2 text-xs text-gray-500 font-mono">
                            #{index + 1}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </motion.div>
    </div>
  );
}
