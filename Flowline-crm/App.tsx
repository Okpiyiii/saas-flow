import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './src/lib/supabase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Pipeline } from './components/Pipeline';
import { Leads } from './components/Leads';
import { Tasks } from './components/Tasks';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { CreateLeadModal } from './components/CreateLeadModal';
import { TaskModal } from './components/TaskModal';
import { Lead, PipelineStage, ViewState, Task } from './types';
import { Loader2 } from 'lucide-react';

import { SearchOverlay } from './components/SearchOverlay';

const Workspace: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [taskRefreshTrigger, setTaskRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        fetchLeads();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error('Error fetching leads:', error);
      } else {
        setLeads(data as unknown as Lead[] || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: PipelineStage) => {
    // Optimistic update
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      fetchLeads(); // Revert on error
    }
  };

  const handleSubmitLead = async (leadData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (leadData.id) {
      // Update existing
      const { error } = await supabase
        .from('leads')
        .update({
          name: leadData.name,
          company: leadData.company,
          email: leadData.email,
          value: leadData.value,
          status: leadData.status
        })
        .eq('id', leadData.id);

      if (error) throw error;

      setLeads(prev => prev.map(l => l.id === leadData.id ? { ...l, ...leadData } : l));
    } else {
      // Create new
      const newLead = {
        ...leadData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(newLead)
        .select('*')
        .single();

      if (error) throw error;
      setLeads(prev => [...prev, data as unknown as Lead]);
    }
    setEditingLead(null);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return;
    }

    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleDeleteLeads = async (ids: string[]) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Error deleting leads:', error);
      return;
    }

    setLeads(prev => prev.filter(l => !ids.includes(l.id)));
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingLead(null);
  };

  const handleSubmitTask = async (taskData: Partial<Task>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (taskData.id) {
      await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          due_date: taskData.due_date,
          related_lead_id: taskData.related_lead_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskData.id);
    } else {
      await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }
    setTaskRefreshTrigger(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      );
    }

    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard leads={leads} />;
      case 'PIPELINE':
        return (
          <Pipeline
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddLead={() => setIsCreateModalOpen(true)}
            onEditLead={openEditModal}
            onDeleteLead={handleDeleteLead}
          />
        );
      case 'LEADS':
        return (
          <Leads
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddLead={() => setIsCreateModalOpen(true)}
            onEditLead={openEditModal}
            onDeleteLead={handleDeleteLead}
            onDeleteLeads={handleDeleteLeads}
            onLeadsChanged={fetchLeads}
          />
        );
      case 'TASKS':
        return (
          <Tasks
            leads={leads}
            onOpenTaskModal={(task?: Task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
            refreshTrigger={taskRefreshTrigger}
          />
        );
      case 'SETTINGS':
        return <Settings />;
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 font-inter antialiased relative overflow-hidden" style={{ WebkitFontSmoothing: 'antialiased' }}>
      {/* Background Glow Accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-200px] right-[-100px] w-[700px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(ellipse, #60B1FF 0%, transparent 70%)',
            filter: 'blur(100px)',
            transform: 'rotate(-15deg)',
          }}
        />
        <div
          className="absolute bottom-[-150px] left-[200px] w-[500px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, #319AFF 0%, transparent 70%)',
            filter: 'blur(90px)',
            transform: 'rotate(10deg)',
          }}
        />
        {/* Glassy Orb Background Accent */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] object-contain scale-150 mix-blend-screen pointer-events-none"
          style={{
            filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
          }}
          src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
        />
      </div>

      <Sidebar
        currentView={currentView}
        onChangeView={setCurrentView}
        onSignOut={handleSignOut}
        onAddLead={() => setIsCreateModalOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 overflow-y-auto h-screen relative z-10">
        <div className="max-w-screen-2xl mx-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitLead}
        initialData={editingLead}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(undefined); }}
        onSubmit={async (taskData) => {
          await handleSubmitTask(taskData);
          setIsTaskModalOpen(false);
          setEditingTask(undefined);
        }}
        initialData={editingTask}
        leads={leads}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(view, id) => {
          setCurrentView(view);
          // In a real app we might pass the 'id' to focus/open the item.
          // For now, we just switch views.
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)', scale: 0.98 },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)', scale: 0.98, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen w-full"
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Auth mode="LOGIN" /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Auth mode="SIGNUP" /></PageWrapper>} />
          <Route path="/app/*" element={<PageWrapper><Workspace /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><Navigate to="/" replace /></PageWrapper>} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;