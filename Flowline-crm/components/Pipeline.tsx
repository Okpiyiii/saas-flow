import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Plus, GripVertical } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { PIPELINE_COLUMNS } from '../constants';
import { Badge, Button } from './ui/GlassComponents';

interface PipelineProps {
  leads: Lead[];
  onUpdateLeadStatus: (id: string, newStatus: PipelineStage) => void;
  onAddLead?: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (id: string) => void;
}

export const Pipeline: React.FC<PipelineProps> = ({ leads, onUpdateLeadStatus, onAddLead, onEditLead, onDeleteLead }) => {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const leadsByStage = leads.reduce((acc, lead) => {
    if (!acc[lead.status]) acc[lead.status] = [];
    acc[lead.status].push(lead);
    return acc;
  }, {} as Record<PipelineStage, Lead[]>);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLead(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (draggedLead) {
      onUpdateLeadStatus(draggedLead, stage);
      setDraggedLead(null);
      setDragOverStage(null);
    }
  };

  const getColumnColor = (stage: PipelineStage): string => {
    const colors: Record<string, string> = {
      [PipelineStage.NEW]: '#60B1FF',
      [PipelineStage.CONTACTED]: '#0084FF',
      [PipelineStage.QUALIFIED]: '#0066CC',
      [PipelineStage.PROPOSAL]: '#0055AA',
      [PipelineStage.WON]: '#10B981',
      [PipelineStage.LOST]: '#EF4444',
    };
    return colors[stage] || '#0084FF';
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-black/5">
        <div>
          <h1 className="text-xl font-fustat font-bold text-zinc-900 tracking-tight">Pipeline</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Filter</Button>
          <Button size="sm" onClick={onAddLead}><Plus size={16} className="mr-1" /> New Deal</Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex space-x-0 h-full min-w-max">
          {PIPELINE_COLUMNS.map((stage) => {
            const stageLeads = leadsByStage[stage] || [];
            const stageValue = stageLeads.reduce((acc, lead) => acc + lead.value, 0);
            const stageColor = getColumnColor(stage);
            const isDragOver = dragOverStage === stage;

            return (
              <div
                key={stage}
                className={`flex flex-col w-80 h-full px-3 first:pl-0 last:pr-0 transition-colors duration-200 ${isDragOver ? '' : ''}`}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Column Glass Panel */}
                <div
                  className="flex flex-col flex-1 rounded-[16px] overflow-hidden transition-all duration-200"
                  style={{
                    background: isDragOver ? 'rgba(0,132,255,0.04)' : 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(15px)',
                    border: isDragOver ? '1px solid rgba(0,132,255,0.25)' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: isDragOver
                      ? 'inset 0px 4px 4px 0px rgba(0,132,255,0.08), 0px 2px 8px 0px rgba(0,132,255,0.08)'
                      : 'inset 0px 4px 4px 0px rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center px-4 pt-4 pb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stageColor }}
                      />
                      <h3 className="text-sm font-fustat font-bold text-zinc-900 tracking-tight">{stage}</h3>
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-[8px]"
                        style={{
                          background: `${stageColor}15`,
                          color: stageColor,
                          border: `1px solid ${stageColor}25`,
                        }}
                      >
                        {stageLeads.length}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <div className="text-[11px] text-zinc-400 font-medium">
                        ${(stageValue / 1000).toFixed(1)}k
                      </div>
                    )}
                  </div>

                  {/* Drop Zone */}
                  <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
                    <AnimatePresence>
                      {stageLeads.map((lead) => (
                        <KanbanCard
                          key={lead.id}
                          lead={lead}
                          isDragging={draggedLead === lead.id}
                          stageColor={stageColor}
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onEdit={() => onEditLead?.(lead)}
                          onDelete={() => onDeleteLead?.(lead.id)}
                        />
                      ))}
                    </AnimatePresence>
                    {stageLeads.length === 0 && (
                      <div
                        className="h-full min-h-[80px] rounded-[12px] flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.015)' }}
                      >
                        <p className="text-xs text-zinc-300">Drop leads here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const KanbanCard: React.FC<{
  lead: Lead;
  onDragStart: (e: any) => void;
  isDragging: boolean;
  stageColor: string;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ lead, onDragStart, isDragging, stageColor, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{
        opacity: isDragging ? 0.3 : 1,
        y: 0,
        scale: isDragging ? 0.96 : 1,
        filter: isDragging ? 'blur(1px)' : 'blur(0px)',
      }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      draggable
      onDragStart={onDragStart}
      className="mb-3 cursor-grab active:cursor-grabbing group relative"
      onMouseLeave={() => setShowDropdown(false)}
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
    >
      <div
        className="rounded-[14px] overflow-hidden transition-all duration-200 group-hover:border-black/15"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(10px)',
          border: isDragging
            ? '1px dashed rgba(0,132,255,0.4)'
            : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isDragging
            ? 'none'
            : 'inset 0px 3px 3px 0px rgba(255,255,255,0.3), 0px 1px 2px 0px rgba(0,0,0,0.03)',
        }}
      >
        {/* Stage Color Accent Bar */}
        <div className="h-[3px] w-full" style={{ backgroundColor: stageColor, opacity: 0.6 }} />

        <div className="p-3.5">
          <div className="flex justify-between items-start mb-1.5">
            <span className="text-xs font-medium text-zinc-400 tracking-wide">{lead.company}</span>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                className="text-zinc-300 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <MoreHorizontal size={14} />
              </button>
              {showDropdown && (
                <div
                  className="absolute right-0 top-full mt-1 w-24 rounded-[12px] overflow-hidden z-50 py-1 flex flex-col"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.08)',
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onEdit?.(); }}
                    className="text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-black/5 transition-colors w-full"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onDelete?.(); }}
                    className="text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50/50 transition-colors w-full"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <h4 className="text-sm font-fustat font-bold text-zinc-900 mb-3 tracking-tight">{lead.name}</h4>

          <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-[8px]"
              style={{
                background: `${stageColor}10`,
                color: stageColor,
                border: `1px solid ${stageColor}20`,
              }}
            >
              ${lead.value.toLocaleString()}
            </span>
            {lead.avatar && (
              <img
                src={lead.avatar}
                alt="Avatar"
                className="w-6 h-6 rounded-full border border-white/50 shadow-sm"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
