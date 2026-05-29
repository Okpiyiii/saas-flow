import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Lead, PipelineStage } from '../types';

interface CreateLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (lead: any) => Promise<void>;
    initialData?: Lead | null;
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

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        value: '',
        status: PipelineStage.NEW,
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                company: initialData.company,
                email: initialData.email,
                value: String(initialData.value),
                status: initialData.status,
            });
        } else {
            setFormData({
                name: '',
                company: '',
                email: '',
                value: '',
                status: PipelineStage.NEW,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                value: Number(formData.value) || 0,
                id: initialData?.id
            });
            setFormData({
                name: '',
                company: '',
                email: '',
                value: '',
                status: PipelineStage.NEW,
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                                    {initialData ? 'Edit Lead' : 'New Lead'}
                                </h2>
                                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Lead Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Company</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                            style={glassInputStyle}
                                            onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                            onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Value ($)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                                            className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                            style={glassInputStyle}
                                            onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                            onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Initial Stage</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as PipelineStage })}
                                        className="w-full font-inter text-[14px] text-slate-900 outline-none transition-all duration-200 rounded-[12px] px-4 py-3 appearance-none"
                                        style={glassInputStyle}
                                        onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                                        onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                                    >
                                        {Object.values(PipelineStage).map(stage => (
                                            <option key={stage} value={stage}>{stage}</option>
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
                                        disabled={loading}
                                        className="px-5 py-2.5 font-inter font-semibold text-[14px] text-white rounded-[16px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 flex items-center gap-2"
                                        style={{
                                            background: 'rgba(0,132,255,0.8)',
                                            backdropFilter: 'blur(2px)',
                                            WebkitBackdropFilter: 'blur(2px)',
                                            boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
                                        }}
                                    >
                                        {loading && <Loader2 size={14} className="animate-spin" />}
                                        {initialData ? 'Save Changes' : 'Create'}
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
