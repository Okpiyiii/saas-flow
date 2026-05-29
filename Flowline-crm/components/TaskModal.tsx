import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { Lead, Task, TaskStatus, TaskPriority } from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    initialData?: Task;
    leads: Lead[];
}

const glassInputStyle = {
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid transparent',
    boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
};

const glassInputFocusStyle = {
    background: 'rgba(0,132,255,0.02)',
    border: '2px solid rgba(0,132,255,0.6)',
    boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05), 0px 0px 0px 4px rgba(0,132,255,0.1)',
};

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, leads }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [relatedLeadId, setRelatedLeadId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setStatus(initialData.status);
            setPriority(initialData.priority);
            if (initialData.due_date) {
                const dateObj = new Date(initialData.due_date);
                setDueDate(dateObj.toISOString().split('T')[0]);
                setDueTime(dateObj.toTimeString().slice(0, 5));
            }
            setRelatedLeadId(initialData.related_lead_id || '');
        } else {
            resetForm();
        }
    }, [initialData, isOpen]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.TODO);
        setPriority(TaskPriority.MEDIUM);
        setDueDate('');
        setDueTime('');
        setRelatedLeadId('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        let combinedDate = undefined;
        if (dueDate) {
            const dateStr = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T12:00:00`;
            combinedDate = new Date(dateStr).toISOString();
        }

        const taskData: Partial<Task> = {
            title,
            description,
            status,
            priority,
            due_date: combinedDate,
            related_lead_id: relatedLeadId || undefined,
        };

        if (initialData) {
            taskData.id = initialData.id;
        }

        await onSubmit(taskData);
        setIsSubmitting(false);
        onClose();
        resetForm();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-slate-950/15 backdrop-blur-sm pointer-events-auto"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md pointer-events-auto rounded-[20px] overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.85)',
                                backdropFilter: 'blur(40px)',
                                WebkitBackdropFilter: 'blur(40px)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: 'inset 0px 4px 4px rgba(255,255,255,0.3), 0px 16px 48px rgba(0,0,0,0.12)',
                            }}
                        >
                            <div
                                className="flex justify-between items-center px-5 py-4"
                                style={{
                                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                                    background: 'rgba(255,255,255,0.4)',
                                }}
                            >
                                <h2 className="font-fustat font-bold text-[15px] text-slate-900">
                                    {initialData ? 'Edit Task' : 'New Task'}
                                </h2>
                                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Task Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        autoFocus
                                        className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        placeholder="e.g. Follow up with client"
                                    />
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3 resize-none"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        placeholder="Add notes or details..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Due Date</label>
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                            style={glassInputStyle}
                                            onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                            onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Due Time</label>
                                        <input
                                            type="time"
                                            value={dueTime}
                                            onChange={(e) => setDueTime(e.target.value)}
                                            className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                            style={glassInputStyle}
                                            onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                            onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                        className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3 appearance-none"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                    >
                                        <option value={TaskPriority.LOW}>Low Priority</option>
                                        <option value={TaskPriority.MEDIUM}>Medium Priority</option>
                                        <option value={TaskPriority.HIGH}>High Priority</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                        className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3 appearance-none"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                    >
                                        <option value={TaskStatus.TODO}>To Do</option>
                                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                        <option value={TaskStatus.WAITING}>Waiting</option>
                                        <option value={TaskStatus.DONE}>Done</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Related Lead</label>
                                    <select
                                        value={relatedLeadId}
                                        onChange={(e) => setRelatedLeadId(e.target.value)}
                                        className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3 appearance-none"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                    >
                                        <option value="">No related lead</option>
                                        {leads.map(lead => (
                                            <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2.5 font-inter font-medium text-[14px] text-slate-600 hover:text-slate-900 hover:bg-black/[0.04] rounded-[12px] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 font-inter font-semibold text-[14px] text-white rounded-[16px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 flex items-center gap-2"
                                        style={{
                                            background: 'rgba(0,132,255,0.8)',
                                            backdropFilter: 'blur(2px)',
                                            WebkitBackdropFilter: 'blur(2px)',
                                            boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
                                        }}
                                    >
                                        {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Task'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
