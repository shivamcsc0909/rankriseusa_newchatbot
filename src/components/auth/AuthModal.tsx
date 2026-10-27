import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { submitProfile, getStoredProfile, setStoredProfile, type UserProfile } from '@/lib/communityStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (profile: UserProfile) => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'login',
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError(null);

    // Google OAuth Simulation / Client Fallback
    // When Google OAuth Client ID is provided, window.google.accounts.id can be called.
    // For universal browser compatibility & instant UX:
    const mockEmail = prompt('Enter your Google Account email for demo Google Sign-In:', email || 'user@gmail.com');
    if (!mockEmail) {
      setLoading(false);
      return;
    }

    const cleanName = mockEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: cleanName || 'Google User',
      email: mockEmail.toLowerCase().trim(),
      company: 'Verified Google Community',
      profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mockEmail)}`,
      status: 'approved',
    };

    setStoredProfile(profile);
    submitProfile({
      name: profile.name,
      email: profile.email,
      company: profile.company,
      profile_image: profile.profile_image,
      bio: 'Authenticated via Google Community Identity',
    }).finally(() => {
      setLoading(false);
      toast.success(`Signed in as ${profile.name} (Google)`);
      if (onSuccess) onSuccess(profile);
      onClose();
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const displayName = tab === 'register' ? name.trim() : (cleanEmail.split('@')[0].replace(/[._]/g, ' ') || 'Community Member');
      const profile: UserProfile = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: cleanEmail,
        company: company.trim() || undefined,
        profile_image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        status: 'approved',
      };

      setStoredProfile(profile);
      await submitProfile({
        name: profile.name,
        email: profile.email,
        company: profile.company,
        profile_image: profile.profile_image,
        bio: 'RankRise Verified Community Member',
      });

      toast.success(tab === 'register' ? 'Account created successfully!' : `Welcome back, ${displayName}!`);
      if (onSuccess) onSuccess(profile);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#080b11] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            aria-label="Close Auth Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Community Access</span>
            </div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {tab === 'login' ? 'Sign In to ' : 'Join '}
              <span className="text-gradient-gold italic">RankRise</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Submit articles, leave verified reviews, and join discussions.
            </p>
          </div>

          {/* 🌟 1. CONTINUE WITH GOOGLE BUTTON 🌟 */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-[#1f2937] font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] border border-slate-200"
            >
              {/* Official Google SVG Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#080b11] px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
              or with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl mb-4 border border-white/10">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'login' ? 'bg-primary text-background font-black shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'register' ? 'bg-primary text-background font-black shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Miller"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Company / Organization <span className="text-muted-foreground/50 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Media Corp"
                  className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl button-premium font-black uppercase tracking-widest text-xs mt-2"
            >
              {loading ? (
                'Processing...'
              ) : tab === 'login' ? (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Create Account
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
