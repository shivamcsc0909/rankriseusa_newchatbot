// src/pages/RefundCancellationPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ArrowRight, Check, X, ShieldAlert, Mail } from 'lucide-react';
import { submitToSheet } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function RefundCancellationPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', orderId: '', reason: '' });
  const [showModal, setShowModal] = useState(false);

  const timelineSteps = [
    { number: '01', title: 'Request', desc: 'Submit terminal request' },
    { number: '02', title: 'Review', desc: 'Eligibility check (1-2 days)' },
    { number: '03', title: 'Approval', desc: 'Confirmation transmitted' },
    { number: '04', title: 'Resolution', desc: 'Funds restored (5-10 days)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitToSheet('RefundRequests', formData);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Refund & Cancellation Policy | RankRise USA"
        description="Review RankRise USA's transparent refund, dispute resolution, and subscription cancellation terms."
        canonical="https://rankriseusa.com/refund-cancellation"
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Refund & Cancellation", item: "https://rankriseusa.com/refund-cancellation" }
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
            <RefreshCcw className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Resolution Protocol v1.0</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter">
            Refund & <br />
            <span className="text-gradient-gold italic">Cancellation.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Governing the parameters of financial reversal and service termination. <br />
            <span className="text-primary/70 font-black text-xs uppercase tracking-widest">Effective January 1, 2026</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto mb-32">
          {/* Timeline & Policy */}
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 md:p-16 rounded-[4rem] border-white/10 relative overflow-hidden"
            >
              <h2 className="text-3xl font-black text-foreground mb-12 tracking-tighter uppercase leading-none">Resolution Trajectory</h2>
              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-white/5 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-primary/50 transition-all duration-500">
                      <span className="text-[10px] font-black">{step.number}</span>
                    </div>
                    <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] glass-card p-8 rounded-3xl border-white/5 group-hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-2">
                      <h3 className="text-xl font-black text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 md:p-16 rounded-[4rem] border-white/10"
            >
              <h2 className="text-3xl font-black text-foreground mb-10 tracking-tighter uppercase leading-none">Eligibility Parameters</h2>
              <ul className="space-y-8">
                <li className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-all">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="block text-xl font-black text-foreground mb-2 tracking-tight">Uninitiated Protocols</span>
                    <span className="text-lg font-medium text-muted-foreground leading-relaxed">Service has not been started or delivered.</span>
                  </div>
                </li>
                <li className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-all">
                    <RefreshCcw className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="block text-xl font-black text-foreground mb-2 tracking-tight">Temporal Window</span>
                    <span className="text-lg font-medium text-muted-foreground leading-relaxed">Request made within 14 days of initialization.</span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-16 rounded-[4.5rem] border-primary/20 bg-primary/[0.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <div className="absolute top-0 right-0 p-16 opacity-[0.03]">
              <Mail className="w-48 h-48 text-primary" />
            </div>
            
            <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none relative z-10">Initiate Resolution</h2>
            <p className="text-xl text-muted-foreground font-medium mb-12 relative z-10 leading-relaxed">Deploy a formal request to our tactical support unit.</p>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Operative Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                  placeholder="e.g. John Wick"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Secure Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                  placeholder="john@operative.com"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Protocol ID (Order #)</label>
                <input
                  type="text"
                  required
                  value={formData.orderId}
                  onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                  placeholder="RR-88219"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Resolution Justification</label>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 font-bold text-foreground focus:border-primary focus:outline-none resize-none transition-all focus:bg-white/[0.08]"
                  placeholder="Briefly describe the reason for resolution..."
                />
              </div>

              <Button type="submit" className="w-full h-20 rounded-2xl button-premium font-black uppercase tracking-[0.2em] text-sm mt-12 group">
                Transmit Request
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </form>

            {/* Internal Outlinks */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm font-bold text-muted-foreground relative z-10">
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors flex items-center gap-1">
                Terms of Engagement <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                Contact Support <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl glass-card rounded-[4rem] border-white/20 p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-10 text-primary relative z-10 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                <Check className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none relative z-10">Transmission Secure</h3>
              <p className="text-xl text-muted-foreground font-medium mb-12 relative z-10 leading-relaxed">
                Your resolution request has been transmitted to our tactical unit. Stand by for contact within 24-48 hours.
              </p>
              <Button onClick={() => setShowModal(false)} className="w-full h-16 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-black uppercase tracking-[0.2em] relative z-10 transition-all duration-300">
                Acknowledge Protocol
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
