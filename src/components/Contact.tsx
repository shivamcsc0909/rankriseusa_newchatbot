import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Clock, Globe, Sparkles } from 'lucide-react';
import { submitToSheet } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsSubmitting(true);

    await submitToSheet('ContactSection', {
      full_name: formData.name,
      email: formData.email,
      company: formData.company || 'N/A',
      message: formData.message,
      source_page: 'Contact Page',
      status: 'New',
    });

    toast.success(
      'Strategy request received! Our experts will contact you within 24 hours.',
      {
        icon: <CheckCircle className="w-5 h-5 text-primary" />,
        style: {
          background: '#05070a',
          color: '#fff',
          border: '1px solid rgba(255,215,0,0.2)',
        },
      }
    );

    setFormData({
      name: '',
      email: '',
      message: '',
      company: '',
    });

  } catch (error) {
    console.error(error);

    toast.error('Failed to submit form.');
  } finally {
    setIsSubmitting(false);
  }
};
  const contactInfo = [
    {
      icon: Mail,
      label: 'Secure Inquiry',
      value: 'hello@rankriseusa.com',
      subtext: 'info@rankriseusa.com | hr@rankriseusa.com',
    },
    {
      icon: Phone,
      label: 'Direct Line',
      value: '+1 202 888 2806',
      subtext: '+1 202 780 0370 | +1 425 943 9223',
    },
    {
      icon: MapPin,
      label: 'Global Command',
      value: 'Washington, DC & Noida Sector 2',
      subtext: 'USA HQ & India Development Hub',
    },
  ];

  const quickStats = [
    { label: 'SLA Response', value: '< 24H', icon: Clock },
    { label: 'Growth Nodes', value: '500+', icon: MessageCircle },
    { label: 'Global reach', value: '24/7', icon: Globe },
  ];

  return (
    <section id="contact" className="bg-background relative overflow-hidden py-16 md:py-32">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] md:h-[800px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Cinematic Header */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <MessageCircle className="w-3 h-3 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Neural Link Status: Ready</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-foreground leading-[0.85] md:leading-[0.85] tracking-tighter mb-8 md:mb-10">
            Initiate <br />
            <span className="text-gradient-gold italic">Ascension.</span>
          </h2>

          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Ready to redefine your digital presence? Our engineering team is standing by to architect your growth trajectory.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 max-w-7xl mx-auto items-start">
          {/* Information Column */}
          <div className="space-y-16">
            <div className="space-y-8">
              <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">Global Reach. <br /><span className="text-primary/70">Surgical Execution.</span></h3>
              <p className="text-muted-foreground font-medium leading-relaxed text-xl">
                Whether you're looking for AI-powered SEO systems or enterprise-grade software development, Rankriseusa delivers market-dominating results.
              </p>
            </div>

            {/* Contact Grid */}
            <div className="grid gap-6">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card group p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-xl group-hover:scale-110 shrink-0">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">{item.label}</p>
                      <p className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight break-all sm:break-normal">{item.value}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">{item.subtext}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dashboard Stats */}
            <div className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border-primary/20 relative overflow-hidden bg-primary/[0.02]">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                {quickStats.map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:border-primary/50 transition-colors">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-3xl font-black text-foreground mb-2 tracking-tighter">{stat.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-white/10 relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <div className="space-y-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">Secure <br /><span className="text-gradient-gold italic">Briefing.</span></h3>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 mb-3 block group-focus-within:text-primary transition-colors">Commander Name</label>
                    <Input
                      placeholder="Enter identity"
                      className="h-14 sm:h-16 bg-white/5 border-white/10 rounded-2xl px-6 sm:px-8 font-bold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/20 text-base sm:text-lg border-2"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 mb-3 block group-focus-within:text-primary transition-colors">Professional Email</label>
                    <Input
                      type="email"
                      placeholder="identity@domain.com"
                      className="h-14 sm:h-16 bg-white/5 border-white/10 rounded-2xl px-6 sm:px-8 font-bold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/20 text-base sm:text-lg border-2"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
<div className="group">
  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 mb-3 block group-focus-within:text-primary transition-colors">
    Company Name
  </label>

  <Input
    type="text"
    placeholder="Your company"
    className="h-14 sm:h-16 bg-white/5 border-white/10 rounded-2xl px-6 sm:px-8 font-bold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/20 text-base sm:text-lg border-2"
    value={formData.company}
    onChange={(e) =>
      setFormData({
        ...formData,
        company: e.target.value,
      })
    }
  />
</div>

                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 mb-3 block group-focus-within:text-primary transition-colors">Mission Objective</label>
                    <Textarea
                      placeholder="Brief us on your strategic objectives..."
                      className="min-h-[140px] sm:min-h-[180px] bg-white/5 border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 font-bold text-foreground focus:border-primary transition-all placeholder:text-muted-foreground/20 text-base sm:text-lg border-2 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 sm:h-20 rounded-full sm:rounded-[2rem] button-premium font-black uppercase tracking-widest sm:tracking-[0.3em] text-[10px] sm:text-xs shadow-[0_20px_60px_rgba(255,215,0,0.2)] group"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-4">
                      <Clock className="w-6 h-6 animate-spin" />
                      Encrypting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-4">
                      Initialize Strategic Sync
                      <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10">
                  {['End-to-End Encryption', 'Priority Queue', 'Direct Access'].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,215,0,0.5)] shrink-0" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}