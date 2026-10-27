// src/pages/Costcalculatorpage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Send, FileDown, Calculator, ShieldCheck, Zap, ArrowRight, Lock, Activity, Layers, Sparkles } from 'lucide-react';
import { submitToSheet } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Seo from '@/components/seo';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'quantity' | 'toggle';
  unit?: string;
  min?: number;
  selected: boolean;
  quantity: number;
}

export default function CostCalculatorPage() {
  const [packageType, setPackageType] = useState<'landing' | 'full'>('full');
  const [pages, setPages] = useState(7);
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Custom Design', description: 'Unique architecture from scratch', price: 13, type: 'quantity', unit: 'per hour', min: 0, selected: false, quantity: 0 },
    { id: 2, name: 'Mobile Optimization', description: 'Surgical responsive tuning', price: 80, type: 'toggle', selected: false, quantity: 0 },
    { id: 3, name: 'CMS Protocol', description: 'Dynamic content management', price: 107, type: 'toggle', selected: false, quantity: 0 },
    { id: 4, name: 'E-commerce Engine', description: 'High-conversion storefront', price: 240, type: 'toggle', selected: false, quantity: 0 },
    { id: 5, name: 'SEO Core Setup', description: 'Search visibility foundation', price: 47, type: 'toggle', selected: false, quantity: 0 },
    { id: 6, name: 'Secure Hosting', description: 'Tier-1 infrastructure', price: 7, type: 'quantity', unit: 'per month', min: 1, selected: false, quantity: 12 }
  ]);

  const [contactModal, setContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', business: '', phone: '', email: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateSubtotal = () => {
    let total = packageType === 'landing' ? 67 : 200;
    if (packageType === 'full' && pages > 7) {
      total += (pages - 7) * 16;
    }
    services.forEach(service => {
      if (service.type === 'toggle' && service.selected) {
        total += service.price;
      } else if (service.type === 'quantity' && service.quantity > 0) {
        total += service.price * service.quantity;
      }
    });
    return total;
  };

  const subtotal = calculateSubtotal();
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const toggleService = (id: number) => {
    setServices(services.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const updateQuantity = (id: number, value: number) => {
    setServices(services.map(s => s.id === id ? { ...s, quantity: Math.max(s.min || 0, value) } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitToSheet('CostCalculator', {
      name: contactForm.name,
      business: contactForm.business,
      phone: contactForm.phone,
      email: contactForm.email,
      packageType,
      totalAmount: `$${total.toFixed(2)}`,
      selectedServices: services
        .filter(s => s.selected || s.quantity > 0)
        .map(s => s.name)
        .join(', '),
    });
    setContactModal(false);
    toast.success('Quote transmission complete. Expect tactical briefing soon.', {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      window.location.href = '/';
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Project Cost Calculator | Instant Estimates | RankRise USA"
        description="Calculate website development, custom software, and digital marketing project costs instantly. Interactive pricing estimation tool by RankRise USA."
        canonical="https://rankriseusa.com/cost-calculator"
        keywords={[
          "website cost calculator",
          "seo pricing calculator",
          "web design cost estimator",
          "digital marketing calculator"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Cost Calculator", item: "https://rankriseusa.com/cost-calculator" }
        ]}
      />
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <header className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
          >
            <Calculator className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Investment Architect v4.0</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tight">
            Calculate Your <br />
            <span className="text-gradient-gold italic">Digital Project Investment</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Configure your technical requirements to generate an instantaneous investment projection tailored to your growth goals.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-7 space-y-20">
            {/* Package Selection */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                  <Layers className="w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Core Architecture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => { setPackageType('landing'); setPages(1); }}
                  className={`p-10 rounded-[3.5rem] glass-card border cursor-pointer transition-all duration-500 relative group overflow-hidden ${
                    packageType === 'landing' ? 'border-primary/50 bg-primary/[0.05] shadow-[0_0_60px_rgba(250,204,21,0.2)]' : 'border-white/10 bg-white/[0.02] hover:border-primary/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors">Landing Node</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Single Page Protocol</p>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-foreground mb-4 tracking-tighter relative z-10">$67</div>
                  {packageType === 'landing' && <Check className="w-6 h-6 text-primary absolute bottom-10 right-10" />}
                </motion.div>

                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => { setPackageType('full'); if (pages < 7) setPages(7); }}
                  className={`p-10 rounded-[3.5rem] glass-card border cursor-pointer transition-all duration-500 relative group overflow-hidden ${
                    packageType === 'full' ? 'border-primary/50 bg-primary/[0.05] shadow-[0_0_60px_rgba(250,204,21,0.2)]' : 'border-white/10 bg-white/[0.02] hover:border-primary/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-foreground mb-1 tracking-tight group-hover:text-primary transition-colors">Business Core</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">7 Page Foundation</p>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-foreground mb-4 tracking-tighter relative z-10">$200</div>
                  {packageType === 'full' && <Check className="w-6 h-6 text-primary absolute bottom-10 right-10" />}
                </motion.div>
              </div>
            </section>

            {/* Pages Control */}
            <section className="glass-card p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-white/10 bg-white/[0.01] shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
                <div>
                  <h3 className="text-3xl font-black text-foreground mb-3 tracking-tighter uppercase leading-none">Expansion Modules</h3>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Add extra pages to your core architecture</p>
                </div>
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-6 bg-white/5 p-3 rounded-3xl border border-white/10">
                    <button
                      onClick={() => packageType === 'full' && pages > 7 && setPages(pages - 1)}
                      disabled={packageType === 'landing' || pages <= 7}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground text-xl font-black hover:bg-primary hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-3xl font-black text-foreground tracking-tighter">{pages}</span>
                    <button
                      onClick={() => packageType === 'full' && setPages(pages + 1)}
                      disabled={packageType === 'landing'}
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground text-xl font-black hover:bg-primary hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs font-black text-primary uppercase tracking-[0.4em] bg-primary/10 px-4 py-2 rounded-full border border-primary/20">$16 / page</div>
                </div>
              </div>
            </section>

            {/* Main Services */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Operational Enhancements</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map(service => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => service.type === 'toggle' && toggleService(service.id)}
                    className={`p-8 rounded-[3rem] glass-card border transition-all duration-500 group relative overflow-hidden ${
                      service.selected || service.quantity > 0
                        ? 'border-primary/40 bg-primary/[0.04] shadow-[0_0_50px_rgba(250,204,21,0.15)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-primary/30'
                    } ${service.type === 'toggle' ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{service.name}</h3>
                      {service.type === 'toggle' && (
                        <div className={`w-14 h-7 rounded-full border border-white/20 p-1 ${service.selected ? 'bg-primary' : 'bg-white/5'} relative transition-all duration-500`}>
                          <motion.div
                            className={`w-5 h-5 rounded-full ${service.selected ? 'bg-background shadow-lg' : 'bg-muted-foreground'}`}
                            animate={{ x: service.selected ? 28 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 relative z-10 group-hover:text-foreground/80 transition-colors">{service.description}</p>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="text-lg font-black text-primary tracking-tight">${service.price} <span className="text-[10px] uppercase opacity-60 tracking-widest">{service.unit || ''}</span></div>
                      {service.type === 'quantity' && (
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(service.id, service.quantity - 1); }}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground font-black hover:bg-primary hover:text-background transition-all"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-lg font-black text-foreground">{service.quantity}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(service.id, service.quantity + 1); }}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground font-black hover:bg-primary hover:text-background transition-all"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-5 relative">
            <div className="glass-card rounded-[4rem] p-12 border-primary/20 sticky top-32 shadow-[0_30px_100px_rgba(0,0,0,0.6)] overflow-hidden bg-primary/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              
              <h2 className="text-3xl font-black text-foreground mb-10 tracking-tighter uppercase leading-none relative z-10">Protocol Intel</h2>
              
              <div className="space-y-6 mb-12 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                <div className="flex justify-between items-start group">
                  <div className="text-xs font-black text-foreground uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                    {packageType === 'landing' ? 'Landing Page Architecture' : 'Full Website Protocol'}
                  </div>
                  <div className="text-lg font-black text-foreground tracking-tighter">${packageType === 'landing' ? 67 : 200}</div>
                </div>
                
                {packageType === 'full' && pages > 7 && (
                  <div className="flex justify-between items-start animate-in fade-in slide-in-from-right-4">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Extra Modules <span className="text-primary/70">({pages - 7})</span></div>
                    <div className="text-lg font-black text-foreground tracking-tighter">${(pages - 7) * 16}</div>
                  </div>
                )}
                
                {services.filter(s => (s.type === 'toggle' && s.selected) || (s.type === 'quantity' && s.quantity > 0)).map(service => (
                  <div key={service.id} className="flex justify-between items-start animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                      {service.name} <span className="text-primary/70">{service.type === 'quantity' ? `[x${service.quantity}]` : ''}</span>
                    </div>
                    <div className="text-lg font-black text-foreground tracking-tighter">${service.type === 'toggle' ? service.price : service.price * service.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-10 border-t border-white/10 mb-12 relative z-10">
                <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                  <span>Subtotal Matrix</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                  <span>GST Protocol (18%)</span>
                  <span>${gst.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Total Investment</span>
                  <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-gradient-gold tracking-tighter">${total.toFixed(2)}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pb-1">USD Est.</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setContactModal(true)}
                disabled={total === 0}
                className="w-full h-20 rounded-2xl button-premium font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_50px_rgba(250,204,21,0.2)] group"
              >
                Initialize Briefing Request
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>

              <div className="mt-10 flex justify-center items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] relative z-10">
                <Lock className="w-3 h-3 text-primary" /> Secure Protocol Transmission
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactModal(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-[2.5rem] sm:rounded-[4rem] border-white/20 p-6 sm:p-10 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-foreground mb-2 tracking-tighter uppercase leading-none">Tactical Briefing</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Secure Personnel Data Required</p>
                </div>
                <button onClick={() => setContactModal(false)} className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-foreground hover:bg-primary hover:text-background transition-all group min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Operative Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                      placeholder="e.g. John Wick"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Business Designation</label>
                    <input
                      type="text"
                      required
                      value={contactForm.business}
                      onChange={e => setContactForm({ ...contactForm, business: e.target.value })}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                      placeholder="Agency / Corp"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Secure Phone</label>
                    <input
                      type="tel"
                      required
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Operative Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground focus:border-primary focus:outline-none transition-all focus:bg-white/[0.08]"
                      placeholder="secure@email.com"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-20 rounded-2xl button-premium font-black uppercase tracking-[0.2em] text-sm mt-8 group">
                  Deploy Quote Transmission
                  <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                </Button>
                <div className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">
                  <Lock className="inline w-3 h-3 mr-2 mb-0.5" /> End-to-End Encryption Enabled
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative text-center max-w-xl w-full glass-card p-16 rounded-[5rem] border-primary/20 shadow-[0_0_100px_rgba(250,204,21,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="w-28 h-28 bg-primary/10 border border-primary/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 animate-bounce relative z-10 shadow-[0_0_40px_rgba(250,204,21,0.3)]">
                <Check className="w-14 h-14 text-primary" />
              </div>
              <h3 className="text-5xl font-black text-foreground mb-6 tracking-tighter uppercase relative z-10">Transmission <br /><span className="text-gradient-gold italic">Complete.</span></h3>
              <p className="text-xl font-medium text-muted-foreground mb-12 relative z-10 leading-relaxed">Protocol initiated successfully. Operational briefing redirecting in 5 seconds...</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden relative z-10 shadow-inner">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}