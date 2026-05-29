import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type AuthMode = 'LOGIN' | 'SIGNUP';

const shakeKeyframes = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.shake {
  animation: shake 0.4s ease-in-out;
}
`;

export const Auth: React.FC<{ mode: AuthMode }> = ({ mode }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shakeField, setShakeField] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShakeField(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/login');
                alert('Signup successful! Please check your email for verification (if enabled) or log in.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/app');
            }
        } catch (err: any) {
            console.error('Auth Error:', err);
            setError(err.message);
            setShakeField('email');
            setTimeout(() => setShakeField(null), 400);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/app`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error('Google Auth Error:', err);
            setError(err.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
            <style>{shakeKeyframes}</style>
            <div
                className="flex min-h-screen w-full antialiased"
                style={{ WebkitFontSmoothing: 'antialiased' }}
            >
                {/* --- Left Pane: Visual Anchor --- */}
                <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #60B1FF 0%, #319AFF 100%)',
                    }}
                >
                    {/* Subtle gradient noise/texture overlay */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                        }}
                    />

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute w-full h-full object-contain scale-150 mix-blend-screen pointer-events-none select-none"
                        style={{
                            filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                        }}
                        src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
                    />
                </div>

                {/* --- Right Pane: Form Container --- */}
                <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-[440px]">
                        {/* Mobile-only orb accent */}
                        <div className="lg:hidden w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden relative"
                            style={{
                                background: 'linear-gradient(135deg, #60B1FF, #319AFF)',
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover scale-150 mix-blend-screen"
                                style={{
                                    filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                                }}
                                src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
                            />
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <h1
                                className="font-fustat font-bold text-[42px] leading-[1.1] tracking-[-1px] text-slate-950"
                            >
                                {mode === 'LOGIN' ? 'Welcome back' : 'Create an account'}
                            </h1>
                            <p
                                className="font-inter font-normal text-[16px] text-slate-500 mt-2 tracking-[-0.5px]"
                            >
                                {mode === 'LOGIN'
                                    ? 'Please enter your details to access your workspace.'
                                    : 'Get started with Flowline today.'}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAuth} className="space-y-5">
                            {error && (
                                <div
                                    className={`p-3 text-sm text-red-600 bg-red-50 rounded-[12px] border ${shakeField === 'email' ? 'shake' : ''}`}
                                    style={{ borderColor: '#FF4444' }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 outline-none transition-all duration-200 font-inter text-[14px] text-slate-900 placeholder:text-slate-400 placeholder:font-inter placeholder:font-normal rounded-[12px] ${error || shakeField === 'email' ? 'border-[#FF4444] shake' : 'border-transparent'}`}
                                    style={{
                                        background: 'rgba(0,0,0,0.03)',
                                        boxShadow: error ? 'inset 0px 2px 4px rgba(0,0,0,0.05), 0 0 0 1px #FF4444' : 'inset 0px 2px 4px rgba(0,0,0,0.05)',
                                        borderWidth: error ? '2px' : '1px',
                                    }}
                                    onFocus={(e) => {
                                        if (!error) {
                                            e.currentTarget.style.background = 'rgba(0,132,255,0.02)';
                                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05), 0px 0px 0px 4px rgba(0,132,255,0.1)';
                                            e.currentTarget.style.border = '2px solid rgba(0,132,255,0.6)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!error) {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05)';
                                            e.currentTarget.style.border = '1px solid transparent';
                                        }
                                    }}
                                    placeholder="name@company.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className={`w-full px-4 py-3 outline-none transition-all duration-200 font-inter text-[14px] text-slate-900 placeholder:text-slate-400 placeholder:font-inter placeholder:font-normal rounded-[12px] ${error || shakeField === 'email' ? 'border-[#FF4444] shake' : 'border-transparent'}`}
                                    style={{
                                        background: 'rgba(0,0,0,0.03)',
                                        boxShadow: error ? 'inset 0px 2px 4px rgba(0,0,0,0.05), 0 0 0 1px #FF4444' : 'inset 0px 2px 4px rgba(0,0,0,0.05)',
                                        borderWidth: error ? '2px' : '1px',
                                    }}
                                    onFocus={(e) => {
                                        if (!error) {
                                            e.currentTarget.style.background = 'rgba(0,132,255,0.02)';
                                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05), 0px 0px 0px 4px rgba(0,132,255,0.1)';
                                            e.currentTarget.style.border = '2px solid rgba(0,132,255,0.6)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        if (!error) {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                                            e.currentTarget.style.boxShadow = 'inset 0px 2px 4px rgba(0,0,0,0.05)';
                                            e.currentTarget.style.border = '1px solid transparent';
                                        }
                                    }}
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Primary CTA */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 font-inter font-semibold text-[16px] text-white rounded-[16px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 flex items-center justify-center"
                                style={{
                                    background: 'rgba(0,132,255,0.8)',
                                    backdropFilter: 'blur(2px)',
                                    WebkitBackdropFilter: 'blur(2px)',
                                    boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
                                }}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    mode === 'LOGIN' ? 'Sign In' : 'Sign Up'
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-black/10" />
                                <span className="font-inter text-[13px] text-slate-400">or</span>
                                <div className="flex-1 h-px bg-black/10" />
                            </div>

                            {/* SSO: Sign in with Google */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading}
                                className="w-full py-3 px-6 rounded-[16px] font-inter font-medium text-[15px] text-slate-700 flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                style={{
                                    background: 'rgba(255,255,255,0.5)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                                    e.currentTarget.style.boxShadow = 'inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0px 4px 12px rgba(0,0,0,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                                    e.currentTarget.style.boxShadow = 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)';
                                }}
                            >
                                {googleLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Sign in with Google
                                    </>
                                )}
                            </button>

                            {/* Footer toggle */}
                            <div className="text-center font-inter text-[14px] text-slate-500 pt-2">
                                {mode === 'LOGIN' ? (
                                    <>
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="font-inter font-medium text-slate-700 hover:text-slate-900 transition-colors">
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-inter font-medium text-slate-700 hover:text-slate-900 transition-colors">
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
