import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, Plus, Download, Upload, Loader2, Check, Trash2 } from 'lucide-react';
import { Lead, PipelineStage } from '../types';
import { Button, Badge } from './ui/GlassComponents';
import Papa from 'papaparse';
import { supabase } from '../src/lib/supabase';

interface LeadsProps {
  leads: Lead[];
  onAddLead?: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (id: string) => void;
  onDeleteLeads?: (ids: string[]) => void;
  onUpdateLeadStatus?: (id: string, status: PipelineStage) => void;
  onLeadsChanged?: () => void;
}

export const Leads: React.FC<LeadsProps> = ({ leads, onAddLead, onEditLead, onDeleteLead, onDeleteLeads, onUpdateLeadStatus, onLeadsChanged }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allFilteredSelected = filteredLeads.length > 0 && filteredLeads.every(l => selectedIds.has(l.id));
  const someFilteredSelected = filteredLeads.some(l => selectedIds.has(l.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected lead(s)? This cannot be undone.`)) return;
    onDeleteLeads?.([...selectedIds]);
  };

  const handleExport = () => {
    const csv = Papa.unparse(leads.map(l => ({
      Name: l.name,
      Company: l.company,
      Email: l.email,
      Phone: l.phone,
      Value: l.value,
      Status: l.status,
      Source: l.source,
      Created: l.created_at
    })));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const newLeads = results.data.map((row: any) => {
            if (!row.Name) return null;
            return {
              user_id: user.id,
              name: row.Name || row.name || 'Unknown',
              company: row.Company || row.company || '',
              email: row.Email || row.email || '',
              phone: row.Phone || row.phone || '',
              value: parseFloat(row.Value || row.value || '0'),
              status: (row.Status || row.status || PipelineStage.NEW) as PipelineStage,
              source: 'Import'
            };
          }).filter(l => l !== null);

          if (newLeads.length > 0) {
            const { error } = await supabase.from('leads').insert(newLeads);
            if (error) throw error;
            setImportSuccess(`Imported ${newLeads.length} leads successfully!`);
            onLeadsChanged?.();
            setTimeout(() => setImportSuccess(null), 3000);
          }
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing leads. Check console for details.');
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <h1 className="font-fustat font-bold text-[28px] tracking-[-0.5px] text-slate-950">Leads</h1>
          {importSuccess && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-inter text-xs text-emerald-700 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 px-2.5 py-1 rounded-[8px] flex items-center"
            >
              <Check size={12} className="mr-1.5" /> {importSuccess}
            </motion.span>
          )}
        </div>

        <div className="flex gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
          <Button variant="outline" size="sm" onClick={handleImportClick} disabled={isImporting}>
            {isImporting ? <Loader2 size={16} className="animate-spin mr-1" /> : <Upload size={16} className="mr-1" />}
            Import
          </Button>
          <Button size="sm" onClick={onAddLead}><Plus size={16} className="mr-1" /> Add Lead</Button>
        </div>
      </motion.div>

      {/* Glass Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex-1 flex flex-col overflow-hidden rounded-[16px]"
        style={{
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0px 1px 3px 0px rgba(0,0,0,0.04)',
        }}
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
              <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                <Trash2 size={14} className="mr-1.5" /> Delete ({selectedIds.size})
              </Button>
            )}
            <Button variant="outline" size="sm"><Filter size={14} className="mr-2" /> View</Button>
            <Button variant="outline" size="sm" onClick={handleExport}><Download size={14} className="mr-2" /> Export</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10"
              style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
            >
              <tr>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider w-10 bg-white/70 backdrop-blur-md">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={el => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
                    onChange={toggleSelectAll}
                    className="rounded border-black/20 checked:bg-[#0084FF] checked:border-[#0084FF] accent-[#0084FF] focus:ring-blue-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Contact</th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Company</th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Status</th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Value</th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider bg-white/70 backdrop-blur-md">Owner</th>
                <th className="px-4 py-3 font-inter font-medium text-slate-500 text-[11px] uppercase tracking-wider w-10 bg-white/70 backdrop-blur-md"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {filteredLeads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  selected={selectedIds.has(lead.id)}
                  onToggleSelect={() => toggleSelectOne(lead.id)}
                  onStatusChange={(status) => onUpdateLeadStatus?.(lead.id, status)}
                  onEdit={() => onEditLead?.(lead)}
                  onDelete={() => onDeleteLead?.(lead.id)}
                />
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 font-inter text-sm">
              <p>No leads found</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const LeadRow: React.FC<{ lead: Lead; selected: boolean; onToggleSelect: () => void; onStatusChange?: (s: PipelineStage) => void; onEdit?: () => void; onDelete?: () => void }> = ({ lead, selected, onToggleSelect, onStatusChange, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions: PipelineStage[] = [
    PipelineStage.NEW,
    PipelineStage.CONTACTED,
    PipelineStage.QUALIFIED,
    PipelineStage.PROPOSAL,
    PipelineStage.WON,
    PipelineStage.LOST
  ];

  return (
    <tr
      className="group relative transition-colors duration-150"
      onMouseLeave={() => { setShowDropdown(false); setShowStatusDropdown(false); }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; }}
      style={{ background: 'transparent' }}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="rounded border-black/20 text-blue-500 focus:ring-blue-300 cursor-pointer"
        />
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          {lead.avatar ? (
            <img src={lead.avatar} alt="" className="w-7 h-7 rounded-full grayscale opacity-80 ring-2 ring-white" />
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-inter font-medium text-[11px] text-slate-500"
              style={{ background: 'rgba(0,0,0,0.06)' }}>
              {lead.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-inter font-medium text-slate-900 text-sm">{lead.name}</div>
            <div className="font-inter text-xs text-slate-400">{lead.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5 font-inter text-sm text-slate-600">{lead.company}</td>
      <td className="px-4 py-2.5 relative">
        <div
          onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
          className="cursor-pointer hover:opacity-80 transition-opacity inline-block"
        >
          <Badge color={lead.status === PipelineStage.WON ? 'green' : lead.status === PipelineStage.LOST ? 'red' : 'gray'}>
            {lead.status}
          </Badge>
        </div>

        {showStatusDropdown && (
          <div
            className="absolute left-0 top-full mt-1 w-36 z-50 py-1 flex flex-col text-left animate-in fade-in zoom-in-95 duration-100 rounded-[12px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.2), 0px 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {statusOptions.map(option => (
              <button
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(option);
                  setShowStatusDropdown(false);
                }}
                className={`text-left px-3 py-2 text-xs transition-colors w-full flex items-center font-inter ${lead.status === option ? 'font-medium text-blue-600' : 'text-slate-700 hover:bg-black/[0.04]'}`}
                style={lead.status === option ? { background: 'rgba(0,132,255,0.06)' } : {}}
              >
                {lead.status === option && <Check size={10} className="mr-1.5" />}
                {option}
              </button>
            ))}
          </div>
        )}
      </td>
      <td className="px-4 py-2.5 font-inter font-medium text-sm text-slate-700">${lead.value.toLocaleString()}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center font-inter text-[10px] font-medium text-slate-600"
            style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>JD</div>
          <span className="font-inter text-xs text-slate-500">John Doe</span>
        </div>
      </td>
      <td className="px-4 py-2.5 text-right relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
          className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all p-1"
        >
          <MoreHorizontal size={14} />
        </button>
        {showDropdown && (
          <div
            className="absolute right-0 top-full mt-1 w-28 z-50 py-1 flex flex-col text-left rounded-[12px] overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.2), 0px 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onEdit?.(); }}
              className="text-left px-3 py-2 text-xs text-slate-700 hover:bg-black/[0.04] transition-colors w-full font-inter"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onDelete?.(); }}
              className="text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50/60 transition-colors w-full font-inter"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};
