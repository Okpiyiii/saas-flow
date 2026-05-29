import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button } from './ui/GlassComponents';
import { Logo } from './Logo';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, MoreHorizontal, Download } from 'lucide-react';
import { Lead, PipelineStage } from '../types';

interface DashboardProps {
  leads: Lead[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  const handleExportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Status', 'Value', 'Source', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.company}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      lead.value,
      `"${lead.source}"`,
      `"${lead.created_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowline-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const openLeads = leads.filter(l => l.status !== PipelineStage.WON && l.status !== PipelineStage.LOST).length;
  const wonLeads = leads.filter(l => l.status === PipelineStage.WON).length;
  const conversionRate = leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;
  const avgDealSize = leads.length > 0 ? Math.round(totalValue / leads.length) : 0;
  const winRate = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : '0.0';

  const activityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = leads.filter(l => l.created_at && l.created_at.startsWith(dateStr)).length;
    return { name: dayName, leads: count };
  });

  const valueByStageData = Object.values(PipelineStage).map(stage => {
    const value = leads.filter(l => l.status === stage).reduce((sum, l) => sum + l.value, 0);
    return { name: stage, value };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex justify-between items-center pb-2"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <Logo iconOnly size={32} />
          <h1 className="font-fustat font-bold text-[28px] tracking-[-0.5px] text-slate-950">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar size={12} className="mr-2" /> Last 7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download size={12} className="mr-2" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Value', value: `$${totalValue.toLocaleString()}`, trend: '12%' },
          { label: 'Active Leads', value: openLeads.toString(), trend: '4' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, trend: '2.1%' },
          { label: 'Deals Won', value: wonLeads.toString(), trend: '1' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i + 1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <GlassCard className="flex flex-col justify-between" hoverEffect>
              <div>
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide mb-1 font-inter">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <motion.h2
                    className="text-2xl font-fustat font-bold text-zinc-900 tracking-tight"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {kpi.value}
                  </motion.h2>
                  <span className="text-emerald-600 text-xs font-medium bg-emerald-50/80 backdrop-blur-sm px-2 py-0.5 rounded-[8px] flex items-center border border-emerald-200/50">
                    <TrendingUp size={10} className="mr-1" /> {kpi.trend}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <GlassCard className="h-80 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-fustat font-bold text-sm text-zinc-900 tracking-tight">Lead Acquisition</h3>
              <motion.button whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="text-zinc-400 hover:text-zinc-600">
                <MoreHorizontal size={16} />
              </motion.button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0084FF" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0084FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '12px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#18181b' }}
                    cursor={{ stroke: 'rgba(0,132,255,0.2)', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#0084FF" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" animationDuration={1200} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <GlassCard className="h-80 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-fustat font-bold text-sm text-zinc-900 tracking-tight">Value by Stage</h3>
              <motion.button whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="text-zinc-400 hover:text-zinc-600">
                <MoreHorizontal size={16} />
              </motion.button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valueByStageData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,132,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '12px', backdropFilter: 'blur(10px)' }}
                  />
                  <Bar dataKey="value" fill="#0084FF" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard className="flex flex-col justify-center" hoverEffect>
            <h3 className="text-sm font-medium text-zinc-500 mb-1 font-inter">Avg. Deal Size</h3>
            <motion.p
              className="text-2xl font-fustat font-bold text-zinc-900 tracking-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 20 }}
            >
              ${avgDealSize.toLocaleString()}
            </motion.p>
          </GlassCard>
        </motion.div>
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard className="flex flex-col justify-center" hoverEffect>
            <h3 className="text-sm font-medium text-zinc-500 mb-1 font-inter">Win Rate</h3>
            <motion.p
              className="text-2xl font-fustat font-bold text-zinc-900 tracking-tight"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 20 }}
            >
              {winRate}%
            </motion.p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};
