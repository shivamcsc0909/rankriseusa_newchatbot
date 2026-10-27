import { motion } from 'framer-motion';
import About from '../components/About';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import { Target, Zap, Award, Users, Rocket, TrendingUp, Heart, Sparkles, Star, CheckCircle, ArrowRight, Shield, MessageSquare, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Seo from '../components/seo';

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: 'Velocity First',
      description: 'We ship fast, test faster, and iterate based on real data. While others are planning, we\'re already capturing market share.',
    },
    {
      icon: Target,
      title: 'Precision Growth',
      description: 'We don\'t do fluff. Every strategy is surgically engineered. Every campaign has clear KPIs. If it doesn\'t move the needle, it doesn\'t exist.',
    },
    {
      icon: Award,
      title: 'Elite Excellence',
      description: 'We\'re obsessed with being the top 0.1%. Industry-leading conversion rates and organic rankings or we don\'t consider it a win.',
    },
    {
      icon: Shield,
      title: 'Partner Security',
      description: 'Your growth is our survival. That\'s why 89% of our partners have been with us for years. We\'re an extension of your command team.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Engines Scaled', icon: Rocket },
    { number: '$50M+', label: 'Revenue Architected', icon: TrendingUp },
    { number: '89%', label: 'Loyalty Rate', icon: Heart },
    { number: '15+', label: 'Surgical Experts', icon: Users },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Seo
        title="About Us | Growth Engineers & AI SEO Team | RankRise USA"
        description="Meet RankRise USA: An elite team of AI search engineers, digital growth strategists, and web performance architects driving scalable enterprise revenue."
        canonical="https://rankriseusa.com/about"
        keywords={[
          "about rankrise usa",
          "ai seo team",
          "growth engineers usa",
          "digital marketing company team",
          "search optimization specialists"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "About Us", item: "https://rankriseusa.com/about" }
        ]}
      />
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Real Humans. Real Revenue.</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.05] tracking-tight mb-8">
              Data-Driven AI SEO Specialists &amp; <br className="hidden sm:block" />
              <span className="text-gradient-gold italic">Digital Growth Engineers in the USA</span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
              We are an elite team of search engine architects, web engineers, and performance marketers helping American businesses scale revenue with measurable ROI.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-12 border-t border-white/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              {stats.map((stat, i) => (
                <div key={i} className="group relative flex items-center gap-4 sm:gap-5 p-4 sm:pr-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden cursor-default">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 text-left">
                    <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 group-hover:to-white/90 transition-all duration-500 leading-none mb-1">
                      {stat.number}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary/80 transition-colors duration-500">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Humanized Story & Values Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5 relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Origin & Human Story</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
                Built By Real Growth Engineers, <span className="text-gradient-gold italic">Not Account Reps.</span>
              </h2>
              <p className="text-white/70 font-medium text-base sm:text-lg leading-relaxed mb-6">
                RankRise USA was founded with a clear mission: To eliminate the fluff and black-box secretiveness of traditional digital marketing agencies. We got tired of seeing hard-working business owners pay thousands in retainers for meaningless vanity metrics and zero sales growth.
              </p>
              <p className="text-white/70 font-medium text-base sm:text-lg leading-relaxed mb-8">
                We combine deep technical search knowledge (GEO & AI SEO), data-driven PPC campaigns, and conversion-optimized web development to build scalable revenue engines for our partners.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services">
                  <Button className="bg-[#EAB308] hover:bg-[#D4A017] text-black font-black uppercase text-xs px-6 py-5 rounded-xl flex items-center gap-2">
                    Explore Services <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="outline" className="border-white/20 text-white font-black uppercase text-xs px-6 py-5 rounded-xl">
                    View Verified Proof
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-card p-8 sm:p-10 rounded-[2.5rem] border-white/10 space-y-6">
              <h3 className="text-2xl font-black text-white">Why Businesses Partner With Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-black text-base">Direct Senior Access</h4>
                    <p className="text-white/60 text-sm font-medium">You collaborate directly with senior search architects and growth engineers, not junior interns.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-black text-base">100% Transparent ROI</h4>
                    <p className="text-white/60 text-sm font-medium">Clear live reporting dashboards with zero hidden fees. Track every keyword, call, and conversion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-black text-base">Generative Engine Optimization (GEO)</h4>
                    <p className="text-white/60 text-sm font-medium">Future-proof SEO positioning your brand in both Google search and AI models like ChatGPT & Perplexity.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <Link to="/pricing" className="text-primary text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:underline">
                  View Transparent Pricing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/free-audit" className="text-white/70 text-xs font-black uppercase tracking-wider hover:text-white">
                  Get Free Audit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different Component */}
      <About />

      {/* Operating Principles */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              Surgical <span className="text-gradient-gold italic">Principles.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
              Our operational logic is simple: Execution over rhetoric. Data over opinion. Growth over everything.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-primary/30 transition-all h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-4 leading-tight">{value.title}</h3>
                <p className="text-muted-foreground font-bold text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Team Integration */}
      <Team />

      {/* Client Success & Testimonials Section */}
      <div id="testimonials" className="pt-12 sm:pt-16 bg-[#05070a] border-t border-white/5">
        <Testimonials />
      </div>

      {/* High-Impact CTA */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-4 sm:mb-6 leading-[0.95] tracking-tighter">
              Ready to <br />
              <span className="text-gradient-gold italic">Scale?</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground font-bold mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join 500+ market leaders who secured their future with the Rankriseusa Protocol.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
              <Link to="/contact" className="w-full sm:w-auto flex justify-center">
                <Button className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl button-premium font-black uppercase tracking-widest text-xs sm:text-sm group">
                  Initialize Sync
                  <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/portfolio" className="w-full sm:w-auto flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-xl sm:rounded-2xl border-white/10 hover:border-primary/50 text-foreground font-black uppercase tracking-widest text-xs sm:text-sm">
                  Verify Proof
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-12">
              {['Surgical Precision', 'Zero Fluff', 'Pure ROI'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Missing Globe import fix
function Globe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}