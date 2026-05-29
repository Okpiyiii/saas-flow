import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Lead } from '../types';
import { Badge } from './ui/GlassComponents';

interface TaskBoardProps {
    tasks: Task[];
    leads: Lead[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, leads, onEditTask, onDeleteTask, onUpdateStatus }) => {
    const columns = [
        { id: TaskStatus.TODO, label: 'To Do', color: 'from-slate-100 to-slate-50', dot: 'bg-slate-400' },
        { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'from-blue-100/60 to-blue-50/30', dot: 'bg-blue-500' },
        { id: TaskStatus.WAITING, label: 'Waiting', color: 'from-amber-100/60 to-amber-50/30', dot: 'bg-amber-500' },
        { id: TaskStatus.DONE, label: 'Done', color: 'from-emerald-100/60 to-emerald-50/30', dot: 'bg-emerald-500' },
    ];

    const getPriorityStyles = (p: TaskPriority) => {
        switch (p) {
            case TaskPriority.HIGH: return { text: 'text-red-700', bg: 'rgba(239,68,68,0.1)', ring: 'rgba(239,68,68,0.2)' };
            case TaskPriority.MEDIUM: return { text: 'text-amber-700', bg: 'rgba(245,158,11,0.1)', ring: 'rgba(245,158,11,0.2)' };
            case TaskPriority.LOW: return { text: 'text-slate-600', bg: 'rgba(0,0,0,0.06)', ring: 'rgba(0,0,0,0.1)' };
            default: return { text: 'text-slate-600', bg: 'rgba(0,0,0,0.06)', ring: 'rgba(0,0,0,0.1)' };
        }
    };

    return (
        <div className="flex h-full overflow-x-auto gap-4 pb-4">
            {columns.map(column => {
                const columnTasks = tasks.filter(t => t.status === column.id);
                return (
                    <div
                        key={column.id}
                        className="min-w-[300px] w-80 flex flex-col h-full rounded-[16px] overflow-hidden flex-shrink-0"
                        style={{
                            background: 'rgba(255,255,255,0.3)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.2)',
                        }}
                    >
                        <div
                            className="p-3 flex items-center justify-between"
                            style={{
                                background: 'rgba(255,255,255,0.4)',
                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${column.dot}`} />
                                <span className="font-inter font-medium text-sm text-slate-800">{column.label}</span>
                            </div>
                            <span
                                className="font-inter text-[11px] text-slate-500 px-2 py-0.5 rounded-[8px]"
                                style={{
                                    background: 'rgba(0,0,0,0.06)',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                }}
                            >
                                {columnTasks.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {columnTasks.map(task => {
                                const lead = leads.find(l => l.id === task.related_lead_id);
                                const priorityStyle = getPriorityStyles(task.priority);
                                return (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                        className="rounded-[14px] cursor-pointer group relative hover:scale-[1.02] transition-transform duration-200"
                                        style={{
                                            background: 'rgba(255,255,255,0.7)',
                                            backdropFilter: 'blur(12px)',
                                            WebkitBackdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.2), 0px 2px 8px rgba(0,0,0,0.04)',
                                        }}
                                        onClick={() => onEditTask(task)}
                                    >
                                        <div className="p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <span
                                                    className="font-inter text-[10px] px-2 py-1 rounded-[8px] font-medium"
                                                    style={{
                                                        color: priorityStyle.text,
                                                        background: priorityStyle.bg,
                                                        border: `1px solid ${priorityStyle.ring}`,
                                                    }}
                                                >
                                                    {task.priority}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                                                >
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </div>

                                            <h3 className="font-inter font-medium text-sm text-slate-900 mb-1 line-clamp-2">{task.title}</h3>

                                            {task.description && (
                                                <p className="font-inter text-xs text-slate-400 line-clamp-2 mb-2">{task.description}</p>
                                            )}

                                            <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div className="font-inter text-[11px] text-slate-400">
                                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                                                </div>
                                                {lead && (
                                                    <div className="font-inter text-[10px] text-slate-500 px-1.5 py-0.5 rounded-[6px] truncate max-w-[100px]"
                                                        style={{
                                                            background: 'rgba(0,0,0,0.04)',
                                                            border: '1px solid rgba(0,0,0,0.06)',
                                                        }}
                                                    >
                                                        {lead.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
