import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { logError } from '../src/lib/logger';
import { throttleAuthAttempt } from '../src/lib/throttle';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type AuthMode = 'LOGIN' | 'SIGNUP';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(value)) return 'Please enter a valid email address.';
  return null;
}

function validatePassword(value: string, isSignup: boolean): string | null {
  if (!value) return 'Password is required.';
  if (value.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (isSignup) {
    if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter.';
    if (!/[0-9]/.test(value)) return 'Password must include at least one number.';
  }
  return null;
}

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

const errorFieldStyle: React.CSSProperties = {
  background: 'rgba(255,68,68,0.03)',
  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05), 0 0 0 1px #FF4444',
  borderWidth: '2px',
  borderColor: '#FF4444',
};

const normalFieldStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.03)',
  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05)',
  borderWidth: '1px',
  borderColor: 'transparent',
};

const focusFieldStyle: React.CSSProperties = {
  background: 'rgba(0,132,255,0.02)',
  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.05), 0px 0px 0px 4px rgba(0,132,255,0.1)',
  border: '2px solid rgba(0,132,255,0.6)',
};

export const Auth: React.FC<{ mode: AuthMode }> = ({ mode }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [shakeField, setShakeField] = useState<string | null>(null);

    const clearFieldErrors = () => {
      setEmailError(null);
      setPasswordError(null);
      setFormError(null);
    };

    const handleEmailBlur = () => {
      const err = validateEmail(email);
      setEmailError(err);
    };

    const handlePasswordBlur = () => {
      const err = validatePassword(password, mode === 'SIGNUP');
      setPasswordError(err);
    };

    const handleEmailChange = (value: string) => {
      setEmail(value);
      if (emailError) setEmailError(null);
      if (formError) setFormError(null);
    };

    const handlePasswordChange = (value: string) => {
      setPassword(value);
      if (passwordError) setPasswordError(null);
      if (formError) setFormError(null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        const { allowed, waitSeconds } = throttleAuthAttempt();
        if (!allowed) {
          setFormError(`Too many attempts. Please wait ${waitSeconds} seconds before trying again.`);
          setShakeField('email');
          setTimeout(() => setShakeField(null), 400);
          return;
        }

        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password, mode === 'SIGNUP');
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (emailErr || passwordErr) {
          setShakeField(emailErr ? 'email' : 'password');
          setTimeout(() => setShakeField(null), 400);
          return;
        }

        setLoading(true);
        setFormError(null);
        setShakeField(null);
        clearFieldErrors();

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
            logError('Auth', err);
            setFormError(err?.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please try again.'
              : 'Something went wrong. Please try again.');
            setShakeField('email');
            setTimeout(() => setShakeField(null), 400);
        } finally {
            setLoading(false);
        }
    };

    const fieldHasError = (fieldName: string) =>
      (fieldName === 'email' && emailError) ||
      (fieldName === 'password' && passwordError) ||
      (formError && shakeField === fieldName);

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
                            {formError && (
                                <div
                                    className={`p-3 text-sm text-red-600 bg-red-50 rounded-[12px] border ${shakeField === 'email' ? 'shake' : ''}`}
                                    style={{ borderColor: '#FF4444' }}
                                >
                                    {formError}
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
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 outline-none transition-all duration-200 font-inter text-[14px] text-slate-900 placeholder:text-slate-400 placeholder:font-inter placeholder:font-normal rounded-[12px] ${fieldHasError('email') ? 'shake border-[#FF4444]' : 'border-transparent'}`}
                                    style={fieldHasError('email') ? errorFieldStyle : normalFieldStyle}
                                    onFocus={(e) => {
                                        if (!fieldHasError('email')) {
                                          Object.assign(e.currentTarget.style, focusFieldStyle);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        handleEmailBlur();
                                        if (!fieldHasError('email')) {
                                          Object.assign(e.currentTarget.style, normalFieldStyle);
                                        }
                                    }}
                                    placeholder="name@company.com"
                                />
                                {emailError && (
                                  <p className="font-inter text-[12px] text-red-500 mt-1">{emailError}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block font-inter font-medium text-[14px] text-slate-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    required
                                    className={`w-full px-4 py-3 outline-none transition-all duration-200 font-inter text-[14px] text-slate-900 placeholder:text-slate-400 placeholder:font-inter placeholder:font-normal rounded-[12px] ${fieldHasError('password') ? 'shake border-[#FF4444]' : 'border-transparent'}`}
                                    style={fieldHasError('password') ? errorFieldStyle : normalFieldStyle}
                                    onFocus={(e) => {
                                        if (!fieldHasError('password')) {
                                          Object.assign(e.currentTarget.style, focusFieldStyle);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        handlePasswordBlur();
                                        if (!fieldHasError('password')) {
                                          Object.assign(e.currentTarget.style, normalFieldStyle);
                                        }
                                    }}
                                    placeholder="••••••••"
                                />
                                {passwordError && (
                                  <p className="font-inter text-[12px] text-red-500 mt-1">{passwordError}</p>
                                )}
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
