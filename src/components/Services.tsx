import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, ArrowRight, Sparkles, Zap, Target, Shield, Smartphone, Bot, Users, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitToSheet } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { lazy, Suspense } from 'react';
const AnmlServices = lazy(() => import('./AnmlServices'));

type Service = {
  icon: React.ElementType;
  title: string;
  image: string;
  description: string;
  color: string;
  glowColor: string;
  bgGradient: string;
  expertise: number;
  details: string;
  features: string[];
  price: string;
  isQuote: boolean;
  comingSoon?: boolean;
};

type ServiceCardProps = {
  service: Service;
  index: number;
  onClick: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
};

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const services: Service[] = [
    {
      icon: Search,
      title: 'GEO + AI SEO',
      image: '/assets/images/services/service_seo.webp',
      description:
        'Rank on ChatGPT, Gemini, and Perplexity. We optimize your brand for the generative engine era.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 98,
      details:
        'AI engines are the new search. We use neural mapping and semantic optimization to ensure your brand is the top recommendation by LLMs.',
      features: ['Generative Engine Optimization', 'Semantic SEO', 'AI Discovery Tracking', 'Neural Link Building'],
      price: '$1,499',
      isQuote: false,
    },
    {
      icon: Bot,
      title: 'AI Automation',
      image: '/assets/images/services/service_automation.webp',
      description:
        'Custom AI agents and workflow automation that scale your business operations without increasing headcount.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 95,
      details:
        'Automate customer support, lead generation, and data processing with custom-trained AI models built for your business.',
      features: ['Custom AI Agents', 'LLM Integration', 'Process Automation', 'Lead Qualification Bots'],
      price: 'Quote Price',
      isQuote: true,
    },
    {
      icon: Code,
      title: 'Next-Gen Web Dev',
      image: '/assets/images/services/service_web_dev.webp',
      description:
        'Ultra-fast, animated, and high-conversion web experiences built with React, Next.js, and Framer Motion.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 99,
      details:
        'We build high-performance web applications that are not just beautiful but also optimized for maximum conversion and speed.',
      features: ['Next.js / React', 'Premium Animations', 'Headless CMS', 'Performance Optimization'],
      price: 'Quote Price',
      isQuote: true,
    },
    {
      icon: Target,
      title: 'Precision Ad Scaling',
      image: '/assets/images/services/service_ads.webp',
      description:
        'ROI-focused PPC and Meta Ads using AI-driven creative testing and predictive audience targeting.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 92,
      details:
        'Stop guessing. We use data-driven algorithms to find your most profitable customers and scale your ad spend efficiently.',
      features: ['Predictive Targeting', 'AI Ad Creatives', 'Cross-Platform Scaling', 'LTV Optimization'],
      price: '$1,999',
      isQuote: false,
    },
    {
      icon: Smartphone,
      title: 'App Development',
      image: '/assets/images/services/service_app_dev.webp',
      description: 'Premium mobile experiences for iOS and Android. Native performance with elite UI/UX design.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 94,
      details:
        'We turn your ideas into world-class mobile applications using modern frameworks like Flutter and React Native.',
      features: ['iOS & Android', 'Cloud Integration', 'Real-time Features', 'User Centered Design'],
      price: 'Quote Price',
      isQuote: true,
    },
    {
      icon: Shield,
      title: 'Brand Authority',
      image: '/assets/images/services/service_brand.webp',
      description:
        'Manage your digital reputation and build unwavering trust through strategic ORM and content authority.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 88,
      details:
        'We monitor your brand presence across the web and use strategic content to build high authority in your niche.',
      features: ['Crisis Management', 'Review Optimization', 'Authority Building', 'Sentiment Repair'],
      price: '$999',
      isQuote: false,
    },
    {
      icon: Users,
      title: 'Custom CRM/ERP',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&q=75&auto=format&fit=crop',
      description:
        'Tailor-made enterprise software that unifies your sales, finance, and operations into one powerful system.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 90,
      details:
        'Off-the-shelf software doesn’t always work. We build custom platforms designed specifically for your unique workflows.',
      features: ['Sales Pipeline', 'Inventory Management', 'Financial Reporting', 'Custom Dashboards'],
      price: 'Quote Price',
      isQuote: true,
    },
    {
      icon: LayoutGrid,
      title: 'UI/UX Design',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&q=75&auto=format&fit=crop',
      description:
        'World-class visual design that prioritizes user psychology and brand narrative. Design that converts.',
      color: 'from-primary to-accent',
      glowColor: 'rgba(250, 204, 21, 0.3)',
      bgGradient: 'from-primary/10 to-transparent',
      expertise: 96,
      details:
        'We create intuitive interfaces that guide users through a seamless journey, turning visitors into loyal brand advocates.',
      features: ['User Psychology', 'Design Systems', 'Interactive Prototypes', 'Conversion Audits'],
      price: 'Coming Soon',
      isQuote: false,
      comingSoon: true,
    },
  ];

  const handleGetQuote = () => {
    if (selectedService !== null) {
      setQuoteFormOpen(true);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedService === null) return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    const fullName = String(fd.get('full_name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const message = String(fd.get('message') || '').trim();

    try {
      setIsSubmittingQuote(true);

      await submitToSheet('ServiceQuote', {
        service_name: services[selectedService].title,
        selected_features: services[selectedService].features.join(', '),
        full_name: fullName,
        email,
        phone,
        message,
        source_page: 'Services Page',
        status: 'New',
      });

      alert('Quote request submitted! Our team will get back to you shortly.');
      form.reset();
      setQuoteFormOpen(false);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <section id="services" className="py-16 lg:py-24 relative overflow-hidden bg-[#05070a]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] neural-grid" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 lg:mb-16 gap-6 lg:gap-10 text-center lg:text-left">
          <div className="max-w-4xl flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-[1px] bg-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Our Capabilities</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 text-white leading-[0.9] tracking-tighter"
            >
              Architecting <br />
              <span className="text-gradient-gold">Digital Dominance.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-medium"
            >
              We merge neural engineering with high-performance marketing to deliver unfair competitive advantages in the AI-first world.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            <div className="flex -space-x-3 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-[#05070a] bg-zinc-800 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt={`RankRise USA Satisfied Client ${i} Avatar`}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#05070a] bg-primary flex items-center justify-center text-[10px] font-black text-background">
                +50
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">
              Trusted by global innovators
            </p>

            <Link to="/portfolio">
              <Button className="button-premium text-xs uppercase tracking-[0.2em] px-8 py-4 sm:py-5 h-auto rounded-xl sm:rounded-2xl group">
                <span>Explore Ecosystem</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              onClick={() => setSelectedService(index)}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        <Suspense fallback={null}>
          <AnmlServices />
        </Suspense>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 lg:mt-20 p-[1px] bg-gradient-to-r from-white/5 via-primary/40 to-white/5 rounded-3xl sm:rounded-[3rem]"
        >
          <div className="bg-[#080a0f] rounded-[1.4rem] sm:rounded-[2.9rem] p-6 sm:p-10 lg:p-16 text-center relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] transition-transform duration-1000 group-hover:scale-110 pointer-events-none">
              <Zap className="w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] text-primary" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-4 sm:mb-6 text-white tracking-tighter">
                Need a Bespoke <br className="sm:hidden" />
                <span className="text-gradient-gold italic">AI System?</span>
              </h3>

              <p className="text-base sm:text-lg text-slate-200 mb-8 sm:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                Our neural engineering team architects custom LLM integrations and autonomous growth engines tailored to your enterprise DNA.
              </p>

              <div className="flex justify-center w-full">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="button-premium text-xs sm:text-sm uppercase tracking-[0.2em] px-8 sm:px-12 py-4 sm:py-5 h-auto rounded-xl sm:rounded-2xl w-full sm:w-auto mx-auto block">
                    Initiate Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={selectedService !== null} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-4xl bg-[#0d1117]/95 backdrop-blur-3xl border-white/5 p-0 overflow-visible rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          {selectedService !== null && (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-visible">
                <img
                  src={services[selectedService].image}
                  alt={`${services[selectedService].title} - Digital Growth Service by RankRise USA`}
                  title={services[selectedService].title}
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0d1117] via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${services[selectedService].color} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform`}
                  >
                    {(() => {
                      const IconComponent = services[selectedService].icon;
                      return <IconComponent className="w-8 h-8 text-background" />;
                    })()}
                  </div>
                </div>
              </div>

              <div className="lg:w-3/5 p-8 sm:p-12 space-y-8 bg-[#0d1117]">
                <DialogHeader>
                  <DialogTitle className="text-4xl font-black text-white tracking-tighter mb-4">
                    {services[selectedService].title}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-slate-200 leading-relaxed font-medium">
                    {services[selectedService].details}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services[selectedService].features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 bg-white/5 px-5 py-4 rounded-2xl border border-white/10 group hover:border-primary/40 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        <span className="text-sm font-bold text-white">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link to="/pricing" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto px-8 py-5 rounded-2xl text-xs uppercase tracking-[0.2em] bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors font-bold">
                        Go to Pricing Page
                      </Button>
                    </Link>
                    <Button
                      className="button-premium w-full sm:w-auto px-8 py-5 rounded-2xl text-xs uppercase tracking-[0.2em]"
                      onClick={handleGetQuote}
                    >
                      Get Quote
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={quoteFormOpen} onOpenChange={setQuoteFormOpen}>
        <DialogContent className="max-w-2xl bg-[#0d1117]/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          {selectedService !== null && (
            <div className="p-6 sm:p-10 space-y-8">
              <DialogHeader>
                <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
                  Get a Quote for {services[selectedService].title}
                </DialogTitle>
                <DialogDescription className="text-slate-300">
                  Fill out the form and we&apos;ll prepare a tailored proposal.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                  Selected Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {services[selectedService].features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmitQuote} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
                      placeholder="+1 202 888 2806"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="button-premium w-full py-6 rounded-2xl text-sm uppercase tracking-[0.3em]"
                >
                  {isSubmittingQuote ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  onClick,
  isHovered,
  onHover,
  onLeave,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] h-[550px] bg-[#0d1117] border border-white/10 hover:border-primary/30 transition-all duration-700"
    >
      <div className="absolute inset-0 z-0">
        <motion.img
          src={service.image}
          alt={`${service.title} - RankRise USA Professional Service`}
          title={service.title}
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/50 to-transparent opacity-95" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
      </div>

      <div className="relative z-10 h-full p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              rotate: isHovered ? 5 : 0,
            }}
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-2xl"
          >
            <service.icon className="w-7 h-7 text-white group-hover:text-background transition-colors duration-500" />
          </motion.div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full"
              >
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {service.expertise}% Excellence
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white leading-[0.95] tracking-tighter group-hover:text-primary transition-colors duration-500">
              {service.title}
            </h3>
            <p className="text-slate-200 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors duration-500">
              {service.description}
            </p>
          </div>

          <div className="pt-6 relative">
            <div className="absolute top-0 left-0 w-12 h-[2px] bg-primary group-hover:w-full transition-all duration-700" />
            <Button className="w-full h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all duration-500 flex items-center justify-between px-6">
              <span>View Protocol</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-background/20 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"
        style={{ backgroundColor: 'var(--primary)' }}
      />
    </motion.div>
  );
}