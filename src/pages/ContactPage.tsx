import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { submitToSheet } from '@/lib/utils';
import Seo from '@/components/seo';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    objective: 'SEO Intelligence',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await submitToSheet('ContactPageLead', {
        full_name: formData.full_name,
        email: formData.email,
        objective: formData.objective,
        message: formData.message,
        source_page: 'Contact Page',
        status: 'New',
      });

      toast.success('Briefing request received. Our team will contact you shortly.');

      setFormData({
        full_name: '',
        email: '',
        objective: 'SEO Intelligence',
        message: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Seo
        title="Contact Us | Strategy & Growth Briefing | RankRise USA"
        description="Get in touch with RankRise USA's growth engineers and SEO strategists. Schedule a direct briefing for enterprise SEO, web dev, or PPC scaling."
        canonical="https://rankriseusa.com/contact"
        keywords={[
          "contact rankrise usa",
          "seo consultation usa",
          "digital marketing agency contact",
          "hire web developers",
          "growth strategy consultation"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Contact Us", item: "https://rankriseusa.com/contact" }
        ]}
      />
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">
              Direct Command Link
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight mb-4 sm:mb-6 break-words">
            Schedule Your <br />
            <span className="text-gradient-gold italic">Growth Strategy Briefing</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8">
            Connect directly with RankRise USA performance engineers. We analyze your digital presence, identify revenue bottlenecks, and build your scaling blueprint.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="glass-card p-1 rounded-[3rem] border-white/5 shadow-2xl"
            >
              <div className="bg-[#05070a]/80 backdrop-blur-3xl p-6 sm:p-10 md:p-12 h-full rounded-[2rem] sm:rounded-[2.8rem]">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                  <span className="w-2 h-8 bg-primary rounded-full" />
                  Secure Briefing Portal
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
                        Secure Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@company.ai"
                        className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
                      Primary Objective
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                      value={formData.objective}
                      onChange={(e) =>
                        setFormData({ ...formData, objective: e.target.value })
                      }
                    >
                      <option className="bg-background">SEO Intelligence</option>
                      <option className="bg-background">Neural Web Development</option>
                      <option className="bg-background">Social Amplification</option>
                      <option className="bg-background">AI Automation Protocol</option>
                      <option className="bg-background">Other Strategic Need</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
                      Mission Details
                    </label>
                    <textarea
                      placeholder="Describe your current landscape and targets..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 sm:h-20 rounded-full sm:rounded-[2rem] button-premium font-black uppercase tracking-widest sm:tracking-[0.3em] text-xs sm:text-lg group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-4">
                        <Clock className="w-6 h-6 animate-spin" />
                        Encrypting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-4">
                        Initialize Protocol
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                      </span>
                    )}
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-10">
                    {['End-to-End Encryption', 'Priority Queue', 'Direct Access'].map((badge) => (
                      <div
                        key={badge}
                        className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,215,0,0.5)] shrink-0" />
                        {badge}
                      </div>
                    ))}
                  </div>
                </form>

                <p className="mt-8 text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                  ⚡ Response Latency: &lt; 1 Hour
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col justify-center space-y-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-white/10 bg-[#080b11]/90 hover:border-primary/30 transition-all group shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                      <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                        Official Email Inquiries
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {[
                          'hello@rankriseusa.com',
                          'info@rankriseusa.com',
                          'hr@rankriseusa.com',
                          'luna@rankriseusa.com',
                          'meera@rankriseusa.com',
                        ].map((em) => (
                          <a
                            key={em}
                            href={`mailto:${em}`}
                            className="text-sm font-bold text-slate-200 hover:text-primary transition-colors flex items-center gap-2 break-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                            {em}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-white/10 bg-[#080b11]/90 hover:border-primary/30 transition-all group shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                      <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                        Direct Phone Channels
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { num: '+1 202-888-2806', label: 'Main' },
                          { num: '+1 202-780-0370', label: 'Local' },
                          { num: '+1 425-943-9223', label: 'Local' },
                        ].map((ph) => (
                          <div key={ph.num} className="flex items-center gap-3">
                            <a
                              href={`tel:${ph.num.replace(/[^+\d]/g, '')}`}
                              className="text-base sm:text-lg font-bold text-white hover:text-primary transition-colors"
                            >
                              {ph.num}
                            </a>
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary">
                              {ph.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-white/10 bg-[#080b11]/90 hover:border-primary/30 transition-all group shadow-xl">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shrink-0">
                      <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                          USA Global HQ
                        </div>
                        <p className="text-base font-bold text-white leading-relaxed">
                          4315 50th Street NW Suite 100, Washington, DC 20016, USA
                        </p>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
                          India Development Hub
                        </div>
                        <p className="text-base font-bold text-white leading-relaxed">
                          B-7, Sector 2, Noida, Uttar Pradesh 201301, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-[3rem] p-10 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">
                    Neural Metrics
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-black text-foreground mb-1">98%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Partner Retention
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-foreground mb-1">5x</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Median ROI Surge
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}