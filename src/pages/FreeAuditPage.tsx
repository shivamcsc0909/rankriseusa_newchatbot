// src/pages/FreeAuditPage.tsx
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Target, Zap, Send, ShieldCheck, Search, Activity, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { submitToSheet } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import Seo from '@/components/seo';

export default function FreeAuditPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    phone: '',
    business: '',
    goals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitToSheet('FreeAudit', {
      name: formData.name,
      email: formData.email,
      website: formData.website,
      phone: formData.phone,
      business: formData.business,
      goals: formData.goals,
    });
    toast.success('Audit protocol initiated! Expect secure briefing within 4–5 hours.', {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    });
    setFormData({ name: '', email: '', website: '', phone: '', business: '', goals: '' });
    setIsSubmitting(false);
  };

  const benefits = [
    {
      icon: Search,
      title: 'Neural SEO Scan',
      description: 'Deep-layer analysis of search architectures and semantic visibility.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Competitive Intel',
      description: 'Surgical breakdown of competitor protocols and market capture.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Activity,
      title: 'Performance Vector',
      description: 'Identifying growth nodes and optimization bottlenecks.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: ShieldCheck,
      title: 'Strategic Roadmap',
      description: 'Comprehensive 12-month intelligence protocol for scaling.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const process = [
    { step: '01', title: 'Data Intake', description: 'Initialize secure audit request parameters.' },
    { step: '02', title: 'Deep Analysis', description: 'Our team deploys proprietary intelligence tools.' },
    { step: '03', title: 'Briefing Delivery', description: 'Receive comprehensive report via secure channel.' },
    { step: '04', title: 'Strategy Session', description: 'Free 1-on-1 consultation with protocol lead.' },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 lg:pt-32 pb-16 relative overflow-hidden">
      <Seo
        title="Free Digital Audit & Technical SEO Scan | RankRise USA"
        description="Claim your complimentary 5-hour technical SEO and website performance audit. Uncover hidden ranking bottlenecks and ROI optimization roadmaps."
        canonical="https://rankriseusa.com/free-audit"
        keywords={[
          "free seo audit",
          "website audit tool usa",
          "technical seo audit",
          "free digital marketing review",
          "growth scan"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Free Audit", item: "https://rankriseusa.com/free-audit" }
        ]}
      />
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">Priority Access Available</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6 leading-[1.05] tracking-tight break-words">
            Claim Your Free <br />
            <span className="text-gradient-gold italic">Website &amp; AI SEO Audit</span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Receive a thorough technical SEO, speed, and conversion breakdown of your website within 5 hours — completely free, with no obligation.
          </p>
        </div>

        {/* Intelligence Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 sm:mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-[2rem] p-6 sm:p-8 border-white/10 hover:border-primary/30 transition-all duration-500 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-2.5 tracking-tight uppercase leading-none">{benefit.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Secure Briefing Form */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="glass-card rounded-[4.5rem] border-primary/20 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <div className="grid lg:grid-cols-2">
              {/* Left - Context */}
              <div className="bg-white/[0.02] p-16 border-r border-white/5 flex flex-col justify-center">
                <div className="mb-12">
                  <h2 className="text-4xl font-black text-foreground mb-6 tracking-tighter uppercase leading-none">Secure Intake Portal</h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    Initialize the protocol by providing your operative parameters. Our team will deploy full scanning tools upon submission.
                  </p>
                </div>

                <div className="space-y-10">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-sm font-black uppercase tracking-widest text-foreground mb-1">5-Hour Delivery</span>
                      <span className="text-xs text-muted-foreground font-medium">Rapid tactical response units.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-sm font-black uppercase tracking-widest text-foreground mb-1">Encrypted Reporting</span>
                      <span className="text-xs text-muted-foreground font-medium">Secure data transmission protocols.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-sm font-black uppercase tracking-widest text-foreground mb-1">ROI Visualization</span>
                      <span className="text-xs text-muted-foreground font-medium">Data-driven performance trajectories.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="p-16 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.02]">
                  <Send className="w-48 h-48 text-primary" />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Full Name</label>
                      <Input
                        placeholder="Operative Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-8 font-bold focus:border-primary transition-all focus:bg-white/[0.08]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Email Address</label>
                      <Input
                        type="email"
                        placeholder="secure@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-16 bg-white/5 border-white/10 rounded-2xl px-8 font-bold focus:border-primary transition-all focus:bg-white/[0.08]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Website URL</label>
                    <Input
                      type="url"
                      placeholder="https://target-site.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      required
                      className="h-16 bg-white/5 border-white/10 rounded-2xl px-8 font-bold focus:border-primary transition-all focus:bg-white/[0.08]"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Protocol Goals</label>
                    <Textarea
                      placeholder="What are your primary performance objectives?"
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      required
                      className="bg-white/5 border-white/10 rounded-3xl p-8 font-bold focus:border-primary transition-all resize-none min-h-[160px] focus:bg-white/[0.08]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-20 rounded-2xl button-premium font-black uppercase tracking-[0.2em] group shadow-[0_15px_40px_rgba(250,204,21,0.3)]"
                  >
                    {isSubmitting ? 'Initializing...' : 'Initialize Scan Protocol'}
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                    <Lock className="inline w-3 h-3 mr-2 mb-0.5" /> Secure Data Transmission
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Process Sequence */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none">
              Protocol <span className="text-gradient-gold italic">Sequence.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-12">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-10">
                  <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-black text-primary mx-auto relative z-10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                    {item.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-full h-[1px] bg-gradient-to-r from-primary/30 to-transparent z-0" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tighter uppercase">{item.title}</h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}