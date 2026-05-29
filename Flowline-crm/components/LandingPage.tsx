import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Star, Kanban, Users, CheckSquare, BarChart3, Search, Shield, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Logo } from './Logo';

const LogoPlaceholder = ({ name }: { name: string }) => (
    <div className="flex items-center justify-center h-8 opacity-40 grayscale hover:opacity-60 transition-opacity">
        <span className="text-sm font-semibold text-zinc-400 tracking-widest">{name}</span>
    </div>
);

const featureCards = [
  {
    icon: Kanban,
    title: 'Visual Pipeline',
    description: 'Drag-and-drop kanban board to track deals from lead to close. See your entire sales flow at a glance.',
    gradient: 'from-[#0084FF] to-[#0EA5E9]',
  },
  {
    icon: Users,
    title: 'Lead Management',
    description: 'Capture, organize, and nurture leads effortlessly. Rich profiles with full history and activity tracking.',
    gradient: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    icon: CheckSquare,
    title: 'Smart Tasks',
    description: 'Stay on top of follow-ups with intelligent task reminders. Link tasks directly to leads and deals.',
    gradient: 'from-[#0EA5E9] to-[#22D3EE]',
  },
  {
    icon: BarChart3,
    title: 'Rich Analytics',
    description: 'Real-time dashboards with revenue forecasts, conversion funnels, and team performance metrics.',
    gradient: 'from-[#6366F1] to-[#818CF8]',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find any lead, deal, or task in milliseconds with Cmd+K. Lightning-fast global search across your CRM.',
    gradient: 'from-[#0084FF] to-[#6366F1]',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with row-level permissions, real-time sync, and automatic backups.',
    gradient: 'from-[#7C3AED] to-[#C084FC]',
  },
];

const FeatureCard: React.FC<{
  icon: React.FC<{ size?: number; className?: string }>;
  title: string;
  description: string;
  gradient: string;
  index: number;
}> = ({ icon: Icon, title, description, gradient, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative rounded-[20px] p-6 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25), 0px 1px 3px 0px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top rim glow */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] rounded-t-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent 0%, #60B1FF 30%, #A855F7 70%, transparent 100%)` }}
      />

      <div className="relative z-10">
        <motion.div
          className={`w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 bg-gradient-to-br ${gradient}`}
          whileHover={{ rotate: [0, -6, 6, 0], scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            boxShadow: `inset 0px 2px 4px rgba(255,255,255,0.3), 0px 2px 12px rgba(0,0,0,0.08)`,
          }}
        >
          <Icon size={20} className="text-white" />
        </motion.div>
        <h3 className="font-fustat font-bold text-[15px] text-zinc-900 tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed font-inter">{description}</p>
      </div>

      {/* Subtle background orb on hover */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, #60B1FF 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#features') {
            const timer = setTimeout(() => {
                const el = document.getElementById('features');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [location.hash]);

    const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const el = document.getElementById('features');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative min-h-screen bg-white overflow-hidden font-inter antialiased" style={{ WebkitFontSmoothing: 'antialiased' }}>
            {/* Background Glow - Layered blurred ellipses */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div
                    className="absolute top-[-200px] left-[-100px] w-[800px] h-[600px] rounded-full opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse, #60B1FF 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        transform: 'rotate(-15deg)',
                    }}
                />
                <div
                    className="absolute top-[-150px] left-[100px] w-[600px] h-[400px] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(ellipse, #319AFF 0%, transparent 70%)',
                        filter: 'blur(100px)',
                        transform: 'rotate(-10deg)',
                    }}
                />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6">

                {/* Strong Liquid Glass Navbar */}
                <nav className="sticky top-[30px] z-50 mx-auto w-fit backdrop-blur-[50px] rounded-[16px]"
                    style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
                    }}>
                    <div className="flex items-center gap-8 px-6 py-3">
                        <Logo size={24} />
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#features" onClick={scrollToFeatures} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Features</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="group flex items-center gap-2 px-5 py-2 text-sm font-semibold text-zinc-900 bg-white/60 backdrop-blur-md rounded-[12px] border border-white/80 shadow-sm hover:shadow-md transition-all"
                            >
                                SignUp
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 pt-24 lg:pt-32 pb-16 lg:pb-24">
                    {/* Hero Left - Content */}
                    <motion.div
                        className="flex-1 flex flex-col items-start gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {/* Social Proof Badge */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-100">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-[#FF801E] text-[#FF801E]"
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-zinc-600">
                                Rated 4.9/5 by 2700+ customers
                            </span>
                        </div>

                        {/* Hero Headline */}
                        <h1
                            className="font-fustat font-bold text-[48px] sm:text-[60px] lg:text-[75px] leading-[1.05] tracking-[-2px] text-zinc-900 max-w-[600px]"
                        >
                            Work smarter, achieve faster
                        </h1>

                        {/* Subheadline */}
                        <p
                            className="text-lg text-zinc-500 max-w-[500px] leading-relaxed"
                            style={{ letterSpacing: '-1px' }}
                        >
                            Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
                        </p>

                        {/* Primary CTA */}
                        <button
                            onClick={() => navigate('/signup')}
                            className="group flex items-center gap-3 px-8 py-4 rounded-[16px] text-white font-semibold text-base backdrop-blur-[2px] transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                background: 'rgba(0,132,255,0.8)',
                                boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
                            }}
                        >
                            Get Started Now
                            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    </motion.div>

                    {/* Hero Right - Glassy Orb */}
                    <motion.div
                        className="flex-1 relative flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-contain scale-125 mix-blend-screen"
                                style={{
                                    filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                                }}
                                src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 lg:py-28">
                  <div className="text-center mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 mb-6"
                    >
                      <Sparkles size={14} className="text-[#0084FF]" />
                      <span className="text-sm font-medium text-zinc-600">Why Flowline</span>
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                      className="font-fustat font-bold text-[36px] sm:text-[44px] lg:text-[52px] tracking-[-1.5px] text-zinc-900 mb-4"
                    >
                      Everything you need to
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0084FF] via-[#6366F1] to-[#A855F7]">
                        close more deals
                      </span>
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                      className="text-lg text-zinc-500 max-w-[500px] mx-auto"
                    >
                      A modern CRM built for speed. Manage your pipeline, nurture leads, and hit revenue targets — all in one place.
                    </motion.p>
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto">
                    {featureCards.map((feature, i) => (
                      <FeatureCard key={feature.title} {...feature} index={i} />
                    ))}
                  </div>

                  {/* Bottom accent - liquid connector line */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-16 max-w-[400px] mx-auto h-[1px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, #A855F7 30%, #0084FF 70%, transparent 100%)',
                      transformOrigin: 'center',
                    }}
                  />
                </section>

                {/* Trusted By Footer Logos */}
                <div className="pb-20">
                    <p className="text-center text-sm font-medium text-zinc-400 mb-10 tracking-wide uppercase">
                        Trusted by Top-tier product companies
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-[60px] md:gap-[100px]">
                        <LogoPlaceholder name="STRIPE" />
                        <LogoPlaceholder name="AIRBNB" />
                        <LogoPlaceholder name="SPOTIFY" />
                        <LogoPlaceholder name="SHOPIFY" />
                        <LogoPlaceholder name="NOTION" />
                    </div>
                </div>

                {/* Footer Bar */}
                <footer className="border-t border-zinc-100 py-8 text-center text-zinc-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Flowline CRM. Built for speed and simplicity.</p>
                </footer>
            </div>
        </div>
    );
};
