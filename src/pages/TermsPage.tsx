// src/pages/TermsPage.tsx
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Globe, Eye, UserCheck, Scale, Mail, MapPin, List, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function TermsPage() {
  const sections = [
    {
      id: 'agreement-overview',
      title: '1. Agreement Overview',
      content: 'This Terms and Conditions agreement (the "Agreement") governs your use of the digital marketing and IT services (collectively, the "Services") provided by Rankriseusa ("Company", "we", "us", or "our"). By accessing or using our Services, you agree to be bound by this Agreement. If you do not agree, you may not use the Services.'
    },
    {
      id: 'services-description',
      title: '2. Services Description',
      content: 'Rankriseusa provides digital marketing (SEO, PPC, social media management) and IT services (web development, cloud infrastructure, software maintenance). The exact scope, deliverables, and timelines will be outlined in separate Statements of Work (SOW) or proposals.'
    },
    {
      id: 'payment-terms',
      title: '3. Payment Protocols',
      content: 'Fees for Services are as set forth in the applicable SOW or invoice. Unless otherwise agreed, payments are due within 15 days of invoice date. Late payments may incur interest of 1.5% per month. We may suspend Services for non‑payment.'
    },
    {
      id: 'intellectual-property',
      title: '4. Intellectual Property',
      content: 'All materials provided by the Company (designs, code, reports, marketing assets) are owned by Rankriseusa and licensed to you for the duration of the Service, unless otherwise agreed in writing.'
    },
    {
      id: 'limitation-liability',
      title: '5. Limitation of Liability',
      content: 'To the maximum extent permitted by law, in no event shall Rankriseusa be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the amount you paid us during the 12 months preceding the claim.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Terms of Service & Conditions | RankRise USA"
        description="Review RankRise USA's client terms of service, payment agreements, intellectual property guidelines, and mutual performance provisions."
        canonical="https://rankriseusa.com/terms-and-conditions"
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Terms & Conditions", item: "https://rankriseusa.com/terms-and-conditions" }
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
            <Scale className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Operational Terms v3.0</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter">
            Terms of <br />
            <span className="text-gradient-gold italic">Engagement.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Governing the parameters of our digital partnership. <br />
            <span className="text-primary/70 font-black text-xs uppercase tracking-widest">Effective January 1, 2026</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4">
            <div className="glass-card p-10 rounded-[3rem] border-white/10 sticky top-32 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <List className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em]">Protocol Index</h3>
              </div>
              <nav className="space-y-4">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between group py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    <span className="text-xs font-black text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest">{section.title}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-8 space-y-12">
            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-12 md:p-16 rounded-[4rem] border-white/5 hover:border-primary/20 transition-all duration-700 group"
              >
                <h2 className="text-3xl font-black text-foreground mb-8 tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">{section.title}</h2>
                <p className="text-muted-foreground font-medium text-xl leading-relaxed">{section.content}</p>
              </motion.section>
            ))}

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass-card p-16 rounded-[4rem] border-primary/20 bg-primary/[0.02] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:border-primary/50 transition-all">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-6 tracking-tight relative z-10">Legal Clarification</h3>
              <p className="text-xl text-muted-foreground font-medium mb-10 relative z-10">
                For specialized legal inquiries or compliance verification, contact our tactical terminal.
              </p>
              <a href="mailto:hr@Rankriseusa.com" className="button-premium inline-flex px-10 py-6 h-auto text-xs uppercase tracking-widest relative z-10">
                Connect With Legal HQ
              </a>

              {/* Internal Outlinks */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm font-bold text-muted-foreground relative z-10">
                <Link to="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-1">
                  Privacy Policy <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-white/20">•</span>
                <Link to="/services" className="hover:text-primary transition-colors flex items-center gap-1">
                  Explore Services <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-white/20">•</span>
                <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                  Contact Team <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
