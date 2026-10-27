import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Sparkles,
  Phone,
  Mail,
  Clock,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link, useLocation } from 'react-router-dom';
import { submitToSheet } from '@/lib/utils';
import { toast } from 'sonner';
import { SOCIAL_LINKS } from './SocialIcons';
import AuthModal from './auth/AuthModal';
import { getStoredProfile, clearStoredProfile, type UserProfile } from '@/lib/communityStore';

function TopBar() {
  return (
    <div className="hidden lg:block bg-[#05070a] border-b border-white/10 py-1 px-4 lg:px-8">
      <div className="container mx-auto flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`RankRise USA on ${social.name}`}
                title={social.name}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200 ${social.topBarClass}`}
              >
                <social.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
          <div className="h-3.5 w-px bg-white/20" />
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Mon - Sat: 9:00 AM - 7:00 PM EST</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <a href="mailto:hello@rankriseusa.com" className="flex items-center gap-2 text-slate-200 hover:text-primary transition-colors font-bold">
            <Mail className="w-3.5 h-3.5 text-primary" />
            hello@rankriseusa.com
          </a>
          <a href="tel:+12028882806" className="flex items-center gap-2 text-slate-200 hover:text-primary transition-colors font-bold">
            <Phone className="w-3.5 h-3.5 text-primary" />
            +1 202 888 2806
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [auditFormOpen, setAuditFormOpen] = useState(false);
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const location = useLocation();

  useEffect(() => {
    setUserProfile(getStoredProfile());
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSubmitAudit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);

    const websiteUrl = String(fd.get('website_url') || '').trim();
    const fullName = String(fd.get('full_name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phone = String(fd.get('phone') || '').trim();

    try {
      setIsSubmittingAudit(true);

      await submitToSheet('FreeAuditRequests', {
        website_url: websiteUrl,
        full_name: fullName,
        email,
        phone,
        source_page: 'Header Free Audit',
        status: 'New',
      });

      toast.success('Audit request submitted! Our team will get back to you shortly.');
      form.reset();
      setAuditFormOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit audit request.');
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Courses', path: '/courses' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-0 m-0 bg-[#160d0d]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <TopBar />
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full m-0 p-0"
        >
          <div className="container mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between min-w-0 gap-2">
            <Link to="/" aria-label="RankRise USA Homepage" className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img
                  src="/assets/images/logo1.webp"
                  alt="RankRise USA - Digital Marketing & Web Development Agency"
                  title="RankRise USA Homepage"
                  width={263}
                  height={40}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-auto max-h-8 sm:max-h-9 w-auto max-w-[min(14rem,calc(100vw-8rem))] object-contain object-left overflow-visible grayscale invert brightness-200"
                />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <motion.div className="relative px-2 xl:px-3.5 py-1.5 group">
                    <span
                      className={`text-[10px] xl:text-[11px] font-black uppercase tracking-wider xl:tracking-[0.18em] transition-all duration-300 ${location.pathname === item.path ? 'text-primary' : 'text-white/70 group-hover:text-primary'
                        }`}
                    >
                      {item.name}
                    </span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 xl:left-3.5 xl:right-3.5 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
                {userProfile ? (
                  <div className="flex items-center gap-2 bg-white/5 border border-primary/30 rounded-full py-1.5 px-3">
                    {userProfile.profile_image ? (
                      <img
                        src={userProfile.profile_image}
                        alt={userProfile.name}
                        className="w-6 h-6 rounded-full object-cover border border-primary"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                        {userProfile.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-slate-200 max-w-[100px] truncate">
                      {userProfile.name}
                    </span>
                    <button
                      onClick={() => {
                        clearStoredProfile();
                        setUserProfile(null);
                        toast.success('Logged out successfully.');
                      }}
                      className="text-white/40 hover:text-red-400 p-1"
                      title="Sign Out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/20 font-bold text-[9px] xl:text-[10px] px-3.5 xl:px-4 py-3.5 rounded-full transition-all flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    Sign In
                  </Button>
                )}

                <Button
                  onClick={() => setAuditFormOpen(true)}
                  className="bg-transparent border border-white/20 hover:bg-white/5 text-white font-black uppercase tracking-widest text-[9px] xl:text-[10px] px-3.5 xl:px-5 py-3.5 xl:py-4 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm shrink-0"
                >
                  Get Free Audit
                </Button>
                <Link to="/contact" className="shrink-0">
                  <Button className="bg-[#EAB308] hover:bg-[#D4A017] text-black font-black uppercase tracking-widest text-[9px] xl:text-[10px] px-3.5 xl:px-5 py-3.5 xl:py-4 rounded-full transition-all duration-300 shadow-lg shrink-0">
                    Let's Talk
                  </Button>
                </Link>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </motion.nav>
      </header>

      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          x: isMobileMenuOpen ? 0 : '100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed inset-0 bg-background/98 backdrop-blur-2xl lg:hidden pt-24 z-40 overflow-y-auto overflow-x-hidden ${isMobileMenuOpen ? 'block pointer-events-auto' : 'hidden pointer-events-none'
          }`}
      >
        <div className="container mx-auto px-4 max-w-full">
          <div className="flex flex-col gap-2 mb-8">
            {navItems.map((item, index) => (
              <Link key={item.name} to={item.path}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-2xl font-bold p-5 rounded-2xl transition-all ${location.pathname === item.path
                      ? 'text-primary bg-primary/10 border-2 border-primary/20'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="w-full rounded-xl h-14 text-lg font-semibold">
                Let's Talk
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={() => setAuditFormOpen(true)}
              className="w-full button-elite text-white rounded-xl h-14 text-lg font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Free Audit
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={auditFormOpen} onOpenChange={setAuditFormOpen}>
        <DialogContent className="max-w-2xl bg-[#0d1117]/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[100]">
          <div className="p-6 sm:p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
                Get Your Free SEO Audit
              </DialogTitle>
              <DialogDescription className="text-white/50">
                Enter your details and website URL, and our experts will analyze your digital presence.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmitAudit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                  Website URL
                </label>
                <input
                  name="website_url"
                  type="url"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                  Full Name
                </label>
                <input
                  name="full_name"
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmittingAudit}
                className="button-premium w-full py-6 rounded-2xl text-sm uppercase tracking-[0.3em]"
              >
                {isSubmittingAudit ? 'Submitting...' : 'Request Audit'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
}