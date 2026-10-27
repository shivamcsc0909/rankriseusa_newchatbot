// src/pages/CookiesPolicyPage.tsx
import { motion } from 'framer-motion';
import { Shield, Eye, Settings, Table as TableIcon, Info, Mail, MapPin, Zap, Lock, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function CookiesPolicyPage() {
  const cookieTypes = [
    {
      title: 'Necessary Protocols',
      status: 'Always On',
      desc: 'Essential for secure navigation and core digital infrastructure. These cannot be deactivated.',
      icon: Lock
    },
    {
      title: 'Performance Analytics',
      status: 'Configurable',
      desc: 'Surgical data collection to optimize performance trajectories and user experience.',
      icon: Zap
    },
    {
      title: 'Marketing Vectors',
      status: 'Configurable',
      desc: 'Tracking parameters used to deliver precision-targeted advertising and ROI measurement.',
      icon: Eye
    }
  ];

  const cookieData = [
    { name: '__cf_bm', provider: 'Rankriseusa (Necessary)', purpose: 'Bot Defusal & Security', duration: 'Session' },
    { name: 'consent_pref', provider: 'Rankriseusa', purpose: 'Stores Protocol Preferences', duration: '1 Year' },
    { name: '_ga', provider: 'Google Analytics', purpose: 'User Trajectory Tracking', duration: '2 Years' },
    { name: '_fbp', provider: 'Meta', purpose: 'Ad Delivery & Reporting', duration: '90 Days' }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Cookie Policy & Tracking Protocols | RankRise USA"
        description="Learn about RankRise USA's cookie usage, analytics cookies, user preference storage, and how to manage your privacy settings."
        canonical="https://rankriseusa.com/cookies-policy"
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Cookie Policy", item: "https://rankriseusa.com/cookies-policy" }
        ]}
      />
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
          >
            <Settings className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Consent Protocols v2.0</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter">
            Cookie <br />
            <span className="text-gradient-gold italic">Intelligence.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Transparent disclosure of digital tracking parameters and telemetry agents. <br />
            <span className="text-primary/70 font-black text-xs uppercase tracking-widest">Effective January 1, 2026</span>
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-32">
          {cookieTypes.map((type, idx) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-12 rounded-[3.5rem] border-white/10 group hover:border-primary/30 transition-all duration-700"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500">
                <type.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2 tracking-tighter uppercase">{type.title}</h3>
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">{type.status}</div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">{type.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Declaration Table */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <TableIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xs font-black text-foreground uppercase tracking-[0.4em]">Telemetry Declaration</h2>
          </div>
          
          <div className="glass-card rounded-[3.5rem] border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Protocol Name</th>
                    <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Operator</th>
                    <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Function</th>
                    <th className="px-10 py-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">TTL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cookieData.map((cookie, i) => (
                    <tr key={i} className="group hover:bg-primary/5 transition-colors">
                      <td className="px-10 py-8 text-sm font-black text-foreground tracking-tight">{cookie.name}</td>
                      <td className="px-10 py-8 text-xs font-black text-muted-foreground uppercase tracking-widest">{cookie.provider}</td>
                      <td className="px-10 py-8 text-xs font-medium text-muted-foreground">{cookie.purpose}</td>
                      <td className="px-10 py-8 text-xs font-black text-primary uppercase tracking-[0.2em]">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Contact Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-card p-16 rounded-[4.5rem] border-primary/20 bg-primary/[0.02] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 relative z-10">
            <Info className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-foreground mb-8 tracking-tighter uppercase relative z-10">Inquiry Terminal</h2>
          <p className="text-xl text-muted-foreground font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Questions regarding telemetry protocols or data retention periods should be directed to our tactical compliance lead.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-12 relative z-10">
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500">
                <Mail className="w-6 h-6" />
              </div>
              <a href="mailto:hr@Rankriseusa.com" className="text-sm font-black text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em]">hr@Rankriseusa.com</a>
            </div>
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-sm font-black text-foreground uppercase tracking-[0.2em]">Washington, DC, USA</span>
            </div>
          </div>

          {/* Internal Outlinks */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm font-bold text-muted-foreground relative z-10">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-1">
              Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/terms-and-conditions" className="hover:text-primary transition-colors flex items-center gap-1">
              Terms of Engagement <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
              Contact Team <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
