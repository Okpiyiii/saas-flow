import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../src/lib/supabase';
import { logError } from '../src/lib/logger';
import { GlassCard, Button } from './ui/GlassComponents';
import { User, Bell, Loader2, Check } from 'lucide-react';

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

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, email, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      logError('getProfile', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      logError('updateProfile', error);
      alert('Error updating profile!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 font-inter text-sm text-slate-400">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="font-fustat font-bold text-[28px] tracking-[-0.5px] text-slate-950">Settings</h1>
        {showSuccess && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-inter text-sm text-emerald-700 flex items-center bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 px-3 py-1.5 rounded-[10px]"
          >
            <Check size={14} className="mr-1.5" /> Saved successfully
          </motion.span>
        )}
      </motion.div>

      <div className="space-y-6">
        <GlassCard>
          <h3 className="font-fustat font-bold text-[15px] text-slate-900 mb-6 flex items-center gap-2">
            <User size={16} className="text-slate-500" /> Profile
          </h3>
          <div className="flex items-start gap-6">
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden text-3xl"
                style={{
                  background: 'rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {formData.avatar_url && formData.avatar_url.startsWith('http') ? (
                  <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  formData.avatar_url || <User className="text-slate-400" size={32} />
                )}
              </div>

              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1.5">
                <label className="cursor-pointer font-inter text-[10px] text-white font-medium hover:text-blue-300 transition-colors bg-white/10 px-2 py-1 rounded-[6px]">
                  Upload
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    const file = e.target.files[0];
                    try {
                      setSaving(true);
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const filePath = `${fileName}`;

                      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
                      if (uploadError) throw uploadError;

                      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
                      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
                    } catch (error) {
                      logError('avatarUpload', error);
                      alert('Error uploading image');
                    } finally {
                      setSaving(false);
                    }
                  }} />
                </label>
                <button
                  onClick={() => {
                    const emoji = prompt('Enter an emoji:');
                    if (emoji) setFormData(prev => ({ ...prev, avatar_url: emoji }));
                  }}
                  className="font-inter text-[10px] text-white font-medium hover:text-blue-300 transition-colors bg-white/10 px-2 py-1 rounded-[6px]"
                >
                  Emoji
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                  style={glassInputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">Email (Profile)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full font-inter text-[14px] text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 rounded-[12px] px-4 py-3"
                  style={glassInputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, glassInputFocusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, glassInputStyle)}
                  placeholder="john@example.com"
                />
                <p className="font-inter text-[11px] text-slate-400 mt-1.5">This email is used for notifications and display. It does not change your login email.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Button onClick={updateProfile} disabled={saving}>
              {saving ? <><Loader2 size={14} className="animate-spin mr-2" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-fustat font-bold text-[15px] text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={16} className="text-slate-500" /> Notifications
          </h3>
          <div className="space-y-4">
            {['Email me when a lead is assigned', 'Email me on weekly pipeline summaries', 'Browser notifications'].map((label, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-black/20 checked:bg-[#0084FF] checked:border-[#0084FF] focus:ring-blue-300 focus:ring-offset-0 accent-[#0084FF]" />
                <span className="font-inter text-[14px] text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
