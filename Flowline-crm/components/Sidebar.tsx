import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Kanban, Users, Settings, LogOut, Command, User, CheckSquare, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Logo } from './Logo';
import { motion } from 'framer-motion';
import { ViewState } from '../types';
import { supabase } from '../src/lib/supabase';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut?: () => void;
  onAddLead?: () => void;
  onSearchClick: () => void;
}

const iconWrapVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
  tap: { scale: 0.92, transition: { type: 'spring', stiffness: 600, damping: 20 } },
};

const NavIcon: React.FC<{ children: React.ReactNode; isActive: boolean }> = ({ children, isActive }) => (
  <motion.div
    variants={iconWrapVariants}
    initial="idle"
    whileHover="hover"
    whileTap="tap"
    className="relative shrink-0"
  >
    {children}
  </motion.div>
);

const menuItems = [
  { id: 'DASHBOARD' as ViewState, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'PIPELINE' as ViewState, icon: Kanban, label: 'Pipeline' },
  { id: 'LEADS' as ViewState, icon: Users, label: 'Leads' },
  { id: 'TASKS' as ViewState, icon: CheckSquare, label: 'Tasks' },
  { id: 'SETTINGS' as ViewState, icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onSignOut, onAddLead, onSearchClick }) => {
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null }>({ full_name: 'Loading...', avatar_url: null });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="h-screen sticky top-0 flex flex-col z-50 relative shrink-0"
      style={{
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
      }}
    >
      {/* Subtle orb accent in sidebar background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute -bottom-[40%] -left-[30%] w-[200%] h-[200%] object-contain scale-150 mix-blend-screen"
          style={{ filter: 'hue-rotate(-55deg) saturate(250%) brightness(0.8) contrast(1.1)' }}
          src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
        />
      </div>

      {/* Header */}
      <div className={`p-4 mb-2 relative z-10 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className={`flex ${isCollapsed ? 'justify-center mb-4' : 'gap-2 mb-4 px-1'}`}>
          <Logo iconOnly={isCollapsed} size={isCollapsed ? 28 : 20} />
        </div>

        {/* Search Button */}
        <motion.button
          onClick={onSearchClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'justify-between w-full px-3 py-2'} rounded-[12px] text-sm font-inter text-zinc-500 hover:text-zinc-900 transition-colors duration-200 group`}
          style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.15)',
          }}
          title="Search (Cmd+K)"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(255,255,255,0.3), 0px 2px 8px rgba(0,0,0,0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(255,255,255,0.15)';
          }}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
            <Command size={14} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            {!isCollapsed && <span className="font-inter">Search...</span>}
          </div>
          {!isCollapsed && (
            <kbd
              className="hidden sm:inline-block px-1.5 py-0.5 font-inter text-[10px] text-zinc-400 rounded-[6px]"
              style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              ⌘K
            </kbd>
          )}
        </motion.button>
      </div>

      {/* New Lead Button */}
      <div className={`px-3 mb-2 relative z-10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <motion.button
          onClick={onAddLead}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center justify-center font-inter font-semibold text-white rounded-[12px] transition-shadow duration-200 ${isCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 gap-2 text-sm'}`}
          style={{
            background: 'rgba(0,132,255,0.8)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
          }}
          title="New Lead"
        >
          {isCollapsed ? <Plus size={18} /> : <span>New Lead</span>}
        </motion.button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-0.5 relative z-10">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              whileHover={{ scale: isActive ? 1 : 1.02, x: isActive ? 0 : 2 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center rounded-[12px] transition-colors duration-200 group font-inter ${isCollapsed ? 'justify-center w-full py-2.5 px-0' : 'w-full gap-3 px-3 py-2.5'
                } ${isActive ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'}`}
              style={isActive ? {
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: 'inset 0px 2px 4px 0px rgba(255,255,255,0.3)',
              } : {
                background: 'transparent',
                border: '1px solid transparent',
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <NavIcon isActive={isActive}>
                <item.icon
                  size={17}
                  className={`transition-all duration-200 ${isActive ? 'text-[#0084FF] drop-shadow-[0_0_6px_rgba(0,132,255,0.3)]' : 'text-zinc-400 group-hover:text-zinc-600'}`}
                />
              </NavIcon>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  className="text-sm truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-2 pt-2 relative z-10 flex justify-end" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-[8px] transition-colors"
          style={{
            background: 'rgba(255,255,255,0.3)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </motion.div>
        </motion.button>
      </div>

      {/* User Panel */}
      <div className={`p-3 relative z-10 ${isCollapsed ? 'flex justify-center' : ''}`} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <motion.div
          onClick={onSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center rounded-[12px] transition-colors cursor-pointer group ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2'}`}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          title={isCollapsed ? (profile.full_name || 'User') : undefined}
        >
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 font-medium text-xs overflow-hidden shrink-0"
            style={{
              background: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.2)',
            }}
            whileHover={{ scale: 1.08 }}
          >
            {profile.avatar_url ? (
              profile.avatar_url.startsWith('http') ? (
                <img src={profile.avatar_url} alt="Ava" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">{profile.avatar_url}</span>
              )
            ) : (
              <User size={14} />
            )}
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0 flex items-center justify-between"
            >
              <div className="min-w-0">
                <p className="font-inter text-sm font-medium text-zinc-700 group-hover:text-zinc-900 truncate">{profile.full_name || 'User'}</p>
                <p className="font-inter text-xs text-zinc-400 truncate">Pro Workspace</p>
              </div>
              <motion.div
                whileHover={{ x: 2, color: '#3f3f46' }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <LogOut size={14} className="text-zinc-400 shrink-0" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
};
