// src/pages/CustomPlanPage.tsx
import { useState } from 'react';
import { submitToSheet } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Share2, Code, Brush, Palette, PenTool, Megaphone,
  Sparkles, Check, ArrowLeft, ArrowRight, Zap, Target, Shield,
  Layers, Rocket, Cpu, Briefcase, Activity, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Seo from '@/components/seo';

interface ServiceOption {
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  Icon: any;
  options: ServiceOption[];
}

export default function CustomPlanPage() {
  const [step, setStep] = useState<'initial' | 'selection' | 'details' | 'contact'>('initial');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', company: '', website: '', message: '' });
  const [totalCost, setTotalCost] = useState(0);

  const services: Service[] = [
    {
      id: 'seo',
      name: 'Neural SEO',
      description: 'Dismantle search barriers and capture organic dominance.',
      Icon: Search,
      options: [
        { name: 'Core SEO', price: 200, description: 'Essential protocols for digital visibility.', features: ['5 Keywords Tracking', 'Basic On-Page SEO', 'Monthly Reports'] },
        { name: 'Alpha SEO', price: 450, description: 'Tactical optimization for scaling brands.', features: ['25 Keywords Tracking', 'Technical SEO', 'Link Building'] },
        { name: 'Elite SEO', price: 700, description: 'Dominant search architecture for enterprises.', features: ['50 Keywords Tracking', 'Advanced Technical', 'Local Dominance'] }
      ]
    },
    {
      id: 'smo',
      name: 'Social Protocols',
      description: 'Engage digital communities with high-impact visibility.',
      Icon: Share2,
      options: [
        { name: 'Starter SMO', price: 300, description: 'Basic social presence management.', features: ['2 Platforms', '10 Posts per Month', 'Basic Analytics'] },
        { name: 'Growth SMO', price: 500, description: 'Strategic engagement and scaling.', features: ['4 Platforms', '20 Posts per Month', 'Advanced Intel'] },
        { name: 'Enterprise SMO', price: 800, description: 'Full-spectrum social dominance.', features: ['6 Platforms', '40 Posts per Month', 'Influencer Network'] }
      ]
    },
    {
      id: 'ppc',
      name: 'Paid Trajectories',
      description: 'Precision-targeted ad deployment for immediate ROI.',
      Icon: Target,
      options: [
        { name: 'Basic PPC', price: 350, description: 'Essential ad management.', features: ['1 Platform', 'Setup Protocol', 'Monthly Optimization'] },
        { name: 'Scale PPC', price: 600, description: 'Multi-channel ad scaling.', features: ['2 Platforms', 'A/B Deployment', 'Bi-weekly Intel'] },
        { name: 'Prime PPC', price: 900, description: 'High-performance ad architectures.', features: ['3 Platforms', 'Conversion Protocol', 'Weekly Reports'] }
      ]
    },
    {
      id: 'web-dev',
      name: 'Digital Forge',
      description: 'Architecting high-performance web environments.',
      Icon: Code,
      options: [
        { name: 'Landing Node', price: 500, description: 'Single-purpose conversion hub.', features: ['Up to 5 Pages', 'Responsive Build', 'Secure Form'] },
        { name: 'Business Core', price: 1200, description: 'Enterprise-grade digital presence.', features: ['Up to 15 Pages', 'CMS Protocol', 'Custom Logic'] },
        { name: 'Commerce Matrix', price: 2500, description: 'Full-scale storefront ecosystem.', features: ['Product Catalog', 'Payment Gateway', 'Order Tracking'] }
      ]
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const selectOption = (serviceId: string, optionName: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev, [serviceId]: optionName };
      // Recalculate total immediately
      let total = 0;
      Object.keys(newOptions).forEach(sid => {
        const s = services.find(x => x.id === sid);
        const o = s?.options.find(opt => opt.name === newOptions[sid]);
        if (o) total += o.price;
      });
      setTotalCost(total);
      return newOptions;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitToSheet('CustomPlan', {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      website: contactData.website,
      message: contactData.message,
      selectedServices: selectedServices.join(', '),
      totalCost: `$${totalCost}`,
    });
    toast.success('Custom protocol received. Transmission complete.', {
      icon: <Shield className="w-5 h-5 text-primary" />,
    });
    setStep('initial');
    setSelectedServices([]);
    setSelectedOptions({});
    setTotalCost(0);
    setContactData({ name: '', email: '', phone: '', company: '', website: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 relative overflow-hidden">
      <Seo
        title="Custom Plan Builder | Bespoke Growth Plans | RankRise USA"
        description="Configure a custom digital growth plan tailored to your enterprise scale. Select modular SEO, paid ads, web development, and AI tools."
        canonical="https://rankriseusa.com/custom-plan"
        keywords={[
          "custom seo plan",
          "bespoke digital marketing package",
          "growth plan builder",
          "custom marketing proposal"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Custom Plan", item: "https://rankriseusa.com/custom-plan" }
        ]}
      />
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 lg:px-8">
        <AnimatePresence mode="wait">
          {/* STEP: INITIAL */}
          {step === 'initial' && (
            <motion.div 
              key="initial"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-[70vh] flex flex-col justify-center items-center text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Custom Protocol Builder v1.0</span>
              </motion.div>
              
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-foreground mb-6 leading-[1.05] tracking-tight">
                Build Your Custom <br />
                <span className="text-gradient-gold italic">Growth &amp; SEO Strategy</span>
              </h1>
              
              <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto mb-12">
                Configure a bespoke digital intelligence protocol tailored to your specific operational scale and performance targets.
              </p>

              <Button
                onClick={() => setStep('selection')}
                className="h-20 px-12 rounded-3xl button-premium font-black uppercase tracking-widest text-lg group shadow-[0_20px_50px_rgba(var(--primary),0.2)]"
              >
                Initialize Configuration
                <Zap className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* STEP: SELECTION */}
          {step === 'selection' && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setStep('initial')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Back</span>
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-foreground mb-2">Service Selection</h2>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol Phase 01/03</div>
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {services.map(service => (
                  <motion.div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`glass-card p-8 rounded-[2.5rem] cursor-pointer border transition-all flex flex-col group ${
                      selectedServices.includes(service.id)
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all ${
                      selectedServices.includes(service.id) ? 'bg-primary text-background' : 'bg-white/5 text-primary'
                    }`}>
                      <service.Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-3">{service.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground leading-relaxed mb-6 flex-grow">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {selectedServices.includes(service.id) ? 'Selected' : 'Available'}
                      </div>
                      {selectedServices.includes(service.id) && <Check className="w-5 h-5 text-primary" />}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  disabled={selectedServices.length === 0}
                  onClick={() => setStep('details')}
                  className="h-16 px-12 rounded-2xl button-premium font-black uppercase tracking-widest group"
                >
                  Configure Details
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {selectedServices.length} Component(s) ready for parameterization
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP: DETAILS */}
          {step === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setStep('selection')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Back</span>
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-foreground mb-2">Parameter Tuning</h2>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol Phase 02/03</div>
                </div>
                <div className="w-10" />
              </div>

              <div className="grid lg:grid-cols-3 gap-12 mb-16">
                <div className="lg:col-span-2 space-y-12">
                  {selectedServices.map(serviceId => {
                    const service = services.find(s => s.id === serviceId);
                    if (!service) return null;
                    return (
                      <div key={serviceId} className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <service.Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-2xl font-black text-foreground">{service.name} Level</h3>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {service.options.map(option => (
                            <div
                              key={option.name}
                              onClick={() => selectOption(serviceId, option.name)}
                              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                                selectedOptions[serviceId] === option.name
                                  ? 'border-primary bg-primary/5'
                                  : 'border-white/5 bg-white/2'
                              }`}
                            >
                              <div className="text-lg font-black text-foreground mb-1">{option.name}</div>
                              <div className="text-primary font-black text-sm mb-4">${option.price}</div>
                              <div className="space-y-2">
                                {option.features.map((f, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                                    <Check className="w-3 h-3 text-primary" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-1">
                  <div className="glass-card p-8 rounded-[2.5rem] border-primary/20 sticky top-32">
                    <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-widest">Protocol Summary</h3>
                    <div className="space-y-6 mb-12">
                      {selectedServices.map(sid => (
                        <div key={sid} className="flex justify-between items-start">
                          <div>
                            <div className="text-xs font-black text-foreground uppercase tracking-widest">{services.find(s => s.id === sid)?.name}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase">{selectedOptions[sid] || 'Pending...'}</div>
                          </div>
                          <div className="text-primary font-black">${services.find(s => s.id === sid)?.options.find(o => o.name === selectedOptions[sid])?.price || 0}</div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-white/10 mb-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-black text-foreground uppercase tracking-widest">Total Investment</div>
                        <div className="text-3xl font-black text-foreground">${totalCost}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep('contact')}
                      disabled={Object.keys(selectedOptions).length < selectedServices.length}
                      className="w-full h-16 rounded-2xl button-premium font-black uppercase tracking-widest"
                    >
                      Initialize Contact
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: CONTACT */}
          {step === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setStep('details')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Back</span>
                </button>
                <div className="text-center">
                  <h2 className="text-3xl font-black text-foreground mb-2">Final Briefing</h2>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol Phase 03/03</div>
                </div>
                <div className="w-10" />
              </div>

              <div className="glass-card rounded-[3.5rem] border-white/5 overflow-hidden">
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-2 bg-primary/5 p-12 border-r border-white/5">
                    <h3 className="text-2xl font-black text-foreground mb-6">Final Verification</h3>
                    <p className="text-sm font-bold text-muted-foreground mb-12 leading-relaxed">
                      Initialize the secure communication channel to deploy your custom protocol.
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                        <Shield className="w-4 h-4 text-primary" />
                        Encrypted Data
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-black text-foreground uppercase tracking-[0.2em]">
                        <Zap className="w-4 h-4 text-primary" />
                        Fast Deployment
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3 p-6 sm:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Name</label>
                          <input
                            type="text"
                            required
                            value={contactData.name}
                            onChange={e => setContactData({ ...contactData, name: e.target.value })}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Email</label>
                          <input
                            type="email"
                            required
                            value={contactData.email}
                            onChange={e => setContactData({ ...contactData, email: e.target.value })}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground ml-2">Message (Optional)</label>
                        <textarea
                          rows={4}
                          value={contactData.message}
                          onChange={e => setContactData({ ...contactData, message: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-foreground focus:border-primary focus:outline-none resize-none"
                        />
                      </div>
                      <Button type="submit" className="w-full h-16 rounded-2xl button-premium font-black uppercase tracking-widest">
                        Submit Custom Protocol
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <p className="text-center text-[10px] font-bold text-muted-foreground mt-4 uppercase tracking-widest">
                        <Lock className="inline w-3 h-3 mr-1 mb-0.5" /> SECURE TRANSMISSION ENABLED
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}