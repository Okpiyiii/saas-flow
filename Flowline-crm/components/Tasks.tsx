import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List, Search } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Task, TaskStatus, Lead } from '../types';
import { Button } from './ui/GlassComponents';
import { TaskBoard } from './TaskBoard';
import { TaskList } from './TaskList';

interface TasksProps {
    leads: Lead[];
    onOpenTaskModal?: (task?: Task) => void;
    refreshTrigger?: number;
}

export const Tasks: React.FC<TasksProps> = ({ leads, onOpenTaskModal, refreshTrigger }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [viewMode, setViewMode] = useState<'BOARD' | 'LIST'>('BOARD');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, [refreshTrigger]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks:', error);
            } else {
                setTasks(data as unknown as Task[] || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!confirm("Delete this task?")) return;

        try {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) throw error;
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const handleUpdateStatus = async (id: string, status: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));

        const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
        if (error) {
            console.error("Error updating status:", error);
            fetchTasks();
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            >
                <h1 className="font-fustat font-bold text-[28px] tracking-[-0.5px] text-slate-950">Tasks</h1>
                <div className="flex gap-2">
                    <div className="flex p-1 rounded-[12px]"
                        style={{
                            background: 'rgba(0,0,0,0.04)',
                            border: '1px solid rgba(0,0,0,0.06)',
                        }}
                    >
                        <button
                            onClick={() => setViewMode('BOARD')}
                            className={`p-2 rounded-[10px] transition-all duration-200 font-inter text-sm ${viewMode === 'BOARD' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            style={viewMode === 'BOARD' ? {
                                background: 'rgba(255,255,255,0.8)',
                                boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.06)',
                            } : {}}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-2 rounded-[10px] transition-all duration-200 font-inter text-sm ${viewMode === 'LIST' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                            style={viewMode === 'LIST' ? {
                                background: 'rgba(255,255,255,0.8)',
                                boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.06)',
                            } : {}}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <Button size="sm" onClick={() => onOpenTaskModal?.()}>
                        <Plus size={16} className="mr-1" /> New Task
                    </Button>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-4"
            >
                <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[10px] pl-9 pr-4 py-2"
                        style={{
                            background: 'rgba(0,0,0,0.03)',
                            border: '1px solid transparent',
                            boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.background = 'rgba(0,132,255,0.02)';
                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05), 0px 0px 0px 4px rgba(0,132,255,0.1)';
                            e.currentTarget.style.border = '2px solid rgba(0,132,255,0.6)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05)';
                            e.currentTarget.style.border = '1px solid transparent';
                        }}
                    />
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex-1 min-h-0"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-48 font-inter text-sm text-slate-400">
                        Loading tasks...
                    </div>
                ) : viewMode === 'BOARD' ? (
                    <TaskBoard
                        tasks={filteredTasks}
                        leads={leads}
                        onEditTask={(t) => onOpenTaskModal?.(t)}
                        onDeleteTask={handleDeleteTask}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        leads={leads}
                        onEditTask={(t) => onOpenTaskModal?.(t)}
                        onDeleteTask={handleDeleteTask}
                        onUpdateStatus={handleUpdateStatus}
                    />
                )}
            </motion.div>
        </div>
    );
};
