import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Sparkles,
  MapPin,
  Phone,
  Globe,
  Github,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { submitToSheet } from '@/lib/utils';
import { SOCIAL_LINKS } from './SocialIcons';

import LazySection from './LazySection';
import { SkeletonMap } from '@/components/ui/SkeletonModel';

const GlobalPresenceMap = lazy(() => import('./GlobalPresenceMap'));

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }

    try {
      setIsSubmitting(true);

      await submitToSheet('Newsletter', {
        email: email.trim(),
        source_page: 'Footer Newsletter',
        status: 'New',
      });

      toast.success('Intelligence Feed Subscribed. Welcome to the elite.');
      setEmail('');
    } catch {
      toast.error('Newsletter submit failed.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const offices = [
    {
      country: 'United States',
      city: 'Washington, DC',
      status: 'Global HQ',
      flag: '🇺🇸',
      address: '4315 50th Street NW Suite 100, Washington, DC 20016',
    },
    {
      country: 'India',
      city: 'Noida (Sector 2)',
      status: 'Engineering Hub',
      flag: '🇮🇳',
      address: 'B-7, Sector 2, Noida, Uttar Pradesh 201301',
    },
    {
      country: 'United Arab Emirates',
      city: 'Dubai',
      status: 'Coming Soon',
      flag: '🇦🇪',
      address: 'Dubai International Financial Centre (Coming Soon)',
    },
  ];

  const emailList = [
    'hello@rankriseusa.com',
    'info@rankriseusa.com',
    'hr@rankriseusa.com',
    'luna@rankriseusa.com',
    'meera@rankriseusa.com',
  ];

  const phoneList = [
    { number: '+1 202 888 2806', label: 'Main' },
    { number: '+1 202 780 0370', label: 'Local' },
    { number: '+1 425 943 9223', label: 'Local' },
  ];

  return (
    <footer className="bg-background pt-12 sm:pt-16 lg:pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <LazySection minHeight="450px" className="mb-12 sm:mb-16">
          <Suspense fallback={<SkeletonMap />}>
            <GlobalPresenceMap />
          </Suspense>
        </LazySection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 border border-primary/30 bg-[#080b11]/80 rounded-3xl p-6 sm:p-7 shadow-xl">
            <Link to="/" aria-label="RankRise USA Homepage Footer" className="inline-block">
              <img
                src="/assets/images/logo1.webp"
                alt="RankRise USA - Leading Full-Service Digital Growth Agency"
                title="RankRise USA Logo"
                width={368}
                height={56}
                loading="lazy"
                decoding="async"
                className="h-12 sm:h-14 w-auto max-w-full object-contain object-left overflow-visible grayscale invert brightness-200"
              />
            </Link>

            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              We architect the digital future. Our neural systems empower the world's most
              ambitious founders and tech leaders.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-4">
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Professional Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/15 h-14 rounded-2xl px-5 text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary transition-all font-bold"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 h-11 px-5 rounded-xl button-premium text-[10px] uppercase tracking-widest"
                >
                  {isSubmitting ? 'Sending...' : 'Join Elite'}
                </Button>
              </div>
              <p className="text-[10px] text-slate-300 uppercase font-black tracking-[0.2em] px-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                No Spam. Just Pure Intelligence.
              </p>
            </form>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Official Channels
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {SOCIAL_LINKS.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow RankRise USA on ${social.name}`}
                    title={social.name}
                    className={`group h-11 px-3 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${social.badgeClass} ${social.glowClass}`}
                  >
                    <social.icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-[11px] font-bold tracking-wide truncate">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {offices.map((office, i) => (
                <div key={i} className="p-6 rounded-3xl bg-[#080b11]/80 border border-white/10 space-y-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{office.flag}</span>
                    <div>
                      <h4 className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                        {office.status}
                      </h4>
                      <p className="text-base font-black text-white">{office.country}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-200 font-medium">
                    <p className="flex items-center gap-2 text-white font-bold">
                      <MapPin className="w-4 h-4 text-primary shrink-0" /> {office.city}
                    </p>
                    <p className="text-slate-300 pl-6 leading-relaxed">
                      {office.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/[0.03] backdrop-blur-sm rounded-3xl border border-white/10 shadow-lg">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Direct Communication Lines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                    <Mail className="w-4 h-4" /> Email Terminals
                  </h4>
                  <ul className="space-y-3">
                    {emailList.map((emailAddr, idx) => (
                      <li key={idx}>
                        <a
                          href={`mailto:${emailAddr}`}
                          className="text-slate-200 hover:text-primary text-xs font-semibold transition-colors break-all flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          {emailAddr}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                    <Phone className="w-4 h-4" /> Telephone Gateways
                  </h4>
                  <ul className="space-y-3">
                    {phoneList.map((phone, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <a
                          href={`tel:${phone.number.replace(/\s/g, '').replace(/-/g, '')}`}
                          className="text-slate-200 hover:text-primary text-xs font-semibold transition-colors"
                        >
                          {phone.number}
                        </a>
                        <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">
                          {phone.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 pt-12 border-t border-white/10">
              {[
                {
                  title: 'Core Systems',
                  links: [
                    { name: 'Neural SEO', path: '/services' },
                    { name: 'AI Engineering', path: '/services' },
                    { name: 'Growth Engines', path: '/services' },
                    { name: 'Brand Authority', path: '/services' },
                  ],
                },
                {
                  title: 'Ecosystem',
                  links: [
                    { name: 'Case Studies', path: '/portfolio' },
                    { name: 'The Process', path: '/about' },
                    { name: 'Founder Network', path: '/about' },
                    { name: 'Success Stories', path: '/about' },
                  ],
                },
                {
                  title: 'Legal',
                  links: [
                    { name: 'Privacy Policy', path: '/privacy-policy' },
                    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
                    { name: 'Refund / Cancellation', path: '/refund-cancellation' },
                    { name: 'Cookies Policy', path: '/cookies-policy' },
                    { name: 'Disclaimer', path: '/disclaimer' },
                  ],
                },
              ].map((column, i) => (
                <div key={i}>
                  <h3 className="text-foreground font-black text-[10px] uppercase tracking-[0.3em] mb-10">
                    {column.title}
                  </h3>
                  <ul className="space-y-5">
                    {column.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          to={link.path}
                          className="text-muted-foreground hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5">
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground border border-yellow-400 rounded-lg px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                © 2026 Rankrise USA.
              </span>
              <span className="hidden sm:inline text-muted-foreground/40">|</span>
              <span className="text-xs text-muted-foreground/70 hidden sm:inline">
                Transforming businesses with cutting-edge solutions
              </span>
              <span className="hidden sm:inline text-muted-foreground/40">|</span>
              <span className="text-xs">
                {' '}
                <strong className="text-primary font-black"> </strong>
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs uppercase tracking-widest font-black text-center py-2 text-muted-foreground max-w-full">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <span className="text-muted-foreground/30">•</span>
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <span className="text-muted-foreground/30">•</span>
              <Link to="/refund-cancellation" className="hover:text-primary transition-colors">Refund / Cancellation</Link>
              <span className="text-muted-foreground/30">•</span>
              <Link to="/cookies-policy" className="hover:text-primary transition-colors">Cookies Policy</Link>
              <span className="text-muted-foreground/30">•</span>
              <Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}