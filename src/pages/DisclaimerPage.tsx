// src/pages/DisclaimerPage.tsx
import { motion } from 'framer-motion';
import { ShieldAlert, Info, ExternalLink, Activity, Mail, MapPin, Zap, Lock, ChevronRight, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function DisclaimerPage() {
  const sections = [
    {
      title: 'General Information Purpose',
      desc: 'The content provided on this website by Rankriseusa is for general informational purposes only. While we strive to keep the information accurate, we make no representations or warranties of any kind regarding its absolute completeness or suitability.'
    },
    {
      title: 'No Professional Advice',
      desc: 'The information on this site is not intended to constitute professional, legal, or financial advice. Consult with a qualified operative for advice tailored to your specific situation. Reliance on any data appearing on this website is solely at your own risk.'
    },
    {
      title: 'External Trajectories',
      desc: 'This website may contain links to external nodes or content belonging to third parties. We have no control over the intelligence protocols, privacy practices, or availability of any third-party systems and accept no responsibility for any loss or damage.'
    },
    {
      title: 'Performance Variation',
      desc: 'Any testimonials or case studies displayed represent individual experiences and may not reflect typical performance vectors. The results you achieve depend on factors unique to your operation.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Legal Disclaimer & Liability Notice | RankRise USA"
        description="RankRise USA legal disclaimer, informational notice, third-party link policies, and performance variation disclosures."
        canonical="https://rankriseusa.com/disclaimer"
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Disclaimer", item: "https://rankriseusa.com/disclaimer" }
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
            <AlertTriangle className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Integrity Protocols v1.0</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter">
            Legal <br />
            <span className="text-gradient-gold italic">Disclaimer.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Defining the operational boundaries of our digital communications. <br />
            <span className="text-primary/70 font-black text-xs uppercase tracking-widest">Effective January 1, 2026</span>
          </p>
        </div>

        {/* Content Cards */}
        <div className="max-w-5xl mx-auto grid gap-10">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-12 md:p-16 rounded-[4rem] border-white/10 flex flex-col md:flex-row gap-12 items-start group hover:border-primary/30 transition-all duration-700"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-foreground mb-6 tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">{section.title}</h3>
                <p className="text-muted-foreground font-medium text-xl leading-relaxed">{section.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto text-center"
        >
          <div className="glass-card p-16 rounded-[4.5rem] border-primary/20 bg-primary/[0.02] relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <h3 className="text-3xl font-black text-foreground mb-8 tracking-tighter uppercase relative z-10">Protocol Clarification</h3>
            <p className="text-xl text-muted-foreground font-medium mb-12 max-w-2xl mx-auto relative z-10">
              For specialized legal inquiries or parameter verification, initialize contact via the terminal below.
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
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors flex items-center gap-1">
                Terms of Engagement <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-1">
                Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                Contact Strategy Team <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
