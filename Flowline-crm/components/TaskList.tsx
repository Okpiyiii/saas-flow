import React from 'react';
import { Task, TaskStatus, TaskPriority, Lead } from '../types';
import { Badge } from './ui/GlassComponents';

interface TaskListProps {
    tasks: Task[];
    leads: Lead[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onUpdateStatus: (id: string, status: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, leads, onEditTask }) => {
    return (
        <div
            className="w-full overflow-hidden rounded-[16px]"
            style={{
                background: 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0px 1px 3px 0px rgba(0,0,0,0.04)',
            }}
        >
            <table className="w-full text-left text-sm border-collapse">
                <thead
                    style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
                >
                    <tr>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider w-10 bg-white/70 backdrop-blur-md">
                            <input type="checkbox" className="rounded border-black/20 checked:bg-[#0084FF] checked:border-[#0084FF] accent-[#0084FF] focus:ring-blue-300" />
                        </th>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Title</th>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Status</th>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Priority</th>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Due Date</th>
                        <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Related Lead</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                    {tasks.map(task => {
                        const lead = leads.find(l => l.id === task.related_lead_id);
                        return (
                            <tr
                                key={task.id}
                                className="group cursor-pointer transition-colors duration-150 hover:bg-white/40"
                                onClick={() => onEditTask(task)}
                            >
                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-black/20 checked:bg-[#0084FF] checked:border-[#0084FF] accent-[#0084FF] focus:ring-blue-300" />
                                </td>
                                <td className="px-4 py-3 font-inter font-medium text-sm text-slate-900">{task.title}</td>
                                <td className="px-4 py-3">
                                    <Badge color={task.status === TaskStatus.DONE ? 'green' : task.status === TaskStatus.IN_PROGRESS ? 'blue' : 'gray'}>
                                        {task.status}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="font-inter text-[10px] uppercase font-bold tracking-wide"
                                        style={{
                                            color: task.priority === TaskPriority.HIGH ? '#ef4444' :
                                                task.priority === TaskPriority.MEDIUM ? '#f59e0b' : '#78716c',
                                        }}
                                    >
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-inter text-sm text-slate-500">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                </td>
                                <td className="px-4 py-3 font-inter text-sm text-slate-500">
                                    {lead ? lead.name : '-'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {tasks.length === 0 && (
                <div className="p-8 text-center font-inter text-sm text-slate-400">No tasks found</div>
            )}
        </div>
    );
};
