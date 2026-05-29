import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, CheckSquare, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../src/lib/supabase';
import { Lead, Task, ViewState } from '../types';
import { Badge } from './ui/GlassComponents';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: ViewState, id?: string) => void;
}

type SearchResult =
    | { type: 'LEAD', data: Lead }
    | { type: 'TASK', data: Task };

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'LEADS' | 'TASKS'>('ALL');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                let newResults: SearchResult[] = [];

                const fetchLeads = (filter === 'ALL' || filter === 'LEADS')
                    ? supabase
                        .from('leads')
                        .select('*')
                        .or(`name.ilike.%${query}%,company.ilike.%${query}%,email.ilike.%${query}%`)
                        .limit(5)
                    : Promise.resolve({ data: [] });

                const fetchTasks = (filter === 'ALL' || filter === 'TASKS')
                    ? supabase
                        .from('tasks')
                        .select('*')
                        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
                        .limit(5)
                    : Promise.resolve({ data: [] });

                const [leadsRes, tasksRes] = await Promise.all([fetchLeads, fetchTasks]);

                if (leadsRes.data) {
                    newResults = [...newResults, ...leadsRes.data.map((l: any) => ({ type: 'LEAD', data: l } as SearchResult))];
                }
                if (tasksRes.data) {
                    newResults = [...newResults, ...tasksRes.data.map((t: any) => ({ type: 'TASK', data: t } as SearchResult))];
                }

                setResults(newResults);

            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(handleSearch, 300);
        return () => clearTimeout(debounce);
    }, [query, filter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div className="absolute inset-0 bg-slate-950/15 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div
                className="relative w-full max-w-2xl rounded-[20px] overflow-hidden flex flex-col max-h-[70vh] animate-in fade-in slide-in-from-top-4 duration-200"
                style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: 'inset 0px 4px 4px rgba(255,255,255,0.3), 0px 16px 48px rgba(0,0,0,0.12)',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center px-5 py-4 gap-3"
                    style={{
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        background: 'rgba(255,255,255,0.4)',
                    }}
                >
                    <Search className="text-slate-400" size={18} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search leads and tasks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent font-inter text-[16px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                    {loading && <Loader2 className="animate-spin text-slate-400" size={16} />}
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <kbd className="hidden sm:inline-block px-2 py-0.5 font-inter text-[11px] text-slate-400 rounded-[8px]"
                            style={{
                                background: 'rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.08)',
                            }}>
                            ESC
                        </kbd>
                    </button>
                </div>

                {/* Filters */}
                <div
                    className="flex px-5 py-2.5 gap-2"
                    style={{
                        background: 'rgba(255,255,255,0.25)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}
                >
                    {([
                        { key: 'ALL', label: 'All' },
                        { key: 'LEADS', label: 'Leads' },
                        { key: 'TASKS', label: 'Tasks' },
                    ] as const).map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className="font-inter text-[13px] px-4 py-1.5 rounded-[10px] transition-all duration-200"
                            style={filter === key ? {
                                background: 'rgba(255,255,255,0.8)',
                                color: '#0f172a',
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
                                fontWeight: 500,
                            } : {
                                color: '#94a3b8',
                                background: 'transparent',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-2">
                    {results.length === 0 && query.trim() !== '' && !loading ? (
                        <div className="p-8 text-center font-inter text-sm text-slate-400">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {results.map((result) => (
                                <div
                                    key={`${result.type}-${result.data.id}`}
                                    onClick={() => {
                                        if (result.type === 'LEAD') onNavigate('LEADS', result.data.id);
                                        if (result.type === 'TASK') onNavigate('TASKS', result.data.id);
                                        onClose();
                                    }}
                                    className="group flex items-center p-3 rounded-[12px] hover:bg-black/[0.03] cursor-pointer transition-colors"
                                >
                                    <div
                                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center mr-3 shrink-0`}
                                        style={result.type === 'LEAD'
                                            ? { background: 'rgba(0,132,255,0.08)', color: '#0084FF' }
                                            : { background: 'rgba(16,185,129,0.08)', color: '#10B981' }
                                        }
                                    >
                                        {result.type === 'LEAD' ? <User size={15} /> : <CheckSquare size={15} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-inter font-medium text-sm text-slate-900 truncate">
                                                {result.type === 'LEAD' ? result.data.name : result.data.title}
                                            </h3>
                                            {result.type === 'LEAD' && <Badge color="gray" size="sm" className="ml-2">{result.data.status}</Badge>}
                                            {result.type === 'TASK' && <Badge color="gray" size="sm" className="ml-2">{result.data.status}</Badge>}
                                        </div>
                                        <p className="font-inter text-xs text-slate-400 truncate mt-0.5">
                                            {result.type === 'LEAD' ? result.data.company : (result.data.description || 'No description')}
                                        </p>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                    {!query.trim() && (
                        <div className="p-8 text-center font-inter text-sm text-slate-400">
                            Type to search leads and tasks...
                        </div>
                    )}
                </div>

                <div
                    className="px-5 py-2.5 flex justify-end gap-4 font-inter text-[11px] text-slate-400"
                    style={{
                        borderTop: '1px solid rgba(0,0,0,0.05)',
                        background: 'rgba(255,255,255,0.25)',
                    }}
                >
                    <span><strong className="font-medium text-slate-500">↑↓</strong> to navigate</span>
                    <span><strong className="font-medium text-slate-500">Enter</strong> to select</span>
                    <span><strong className="font-medium text-slate-500">Esc</strong> to close</span>
                </div>
            </div>
        </div>
    );
};
