import { motion } from 'framer-motion';
import { Search, Share2, Code, Brain, Megaphone, BarChart3, CheckCircle, ArrowRight, Rocket, Target, Zap, Users, TrendingUp, Shield, Sparkles, Star, PenTool, Smartphone, Globe, Lock, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function ServicesPage() {
  const services = [
    {
      icon: Search,
      title: 'SEO Intelligence',
      definition: 'Surgical Search Engine Optimization engineered to dominate algorithmic landscape and capture high-intent traffic.',
      benefits: [
        'Rank #1 for high-value transactional keywords',
        '300% surge in qualified organic volume',
        'Sustainable market authority architecture',
        'Algorithmic moat against competitors'
      ],
      whyChooseUs: 'Our proprietary GEO (Generative Engine Optimization) protocols go beyond basic SEO, positioning your brand as the primary authority for both traditional and AI-driven search engines.',
      price: 'From $2,999/mo',
      results: '+350% Growth',
      cta: 'Initialize SEO Protocol'
    },
    {
      icon: Share2,
      title: 'Social Amplification',
      definition: 'Viral framework architecture that transforms brand presence into a high-frequency lead generation machine.',
      benefits: [
        'Rapid targeted audience acquisition',
        'High-conversion content ecosystem',
        'Brand sentiment optimization',
        'Multi-platform visibility dominance'
      ],
      whyChooseUs: 'We architect viral loops and community structures that don\'t just gather followers—they build a legion of brand advocates and high-LTV customers.',
      price: 'From $1,999/mo',
      results: '200K+ Reach',
      cta: 'Deploy Social Strategy'
    },
    {
      icon: TrendingUp,
      title: 'PPC Performance',
      definition: 'Data-driven paid acquisition systems focused on surgical ROI and immediate market penetration.',
      benefits: [
        'Instant high-intent traffic injection',
        'Precision conversion tracking',
        'Aggressive ROAS optimization',
        'Scalable revenue architecture'
      ],
      whyChooseUs: 'Our performance engineers have managed $50M+ in spend with an average 5x ROAS. We optimize for profit, not just clicks.',
      price: 'From $2,499/mo',
      results: '5x Avg ROAS',
      cta: 'Scale Your Ads'
    },
    {
      icon: Brain,
      title: 'AI & Automation',
      definition: 'Custom neural networks and automated workflows that streamline operations and enhance customer intelligence.',
      benefits: [
        'Autonomous customer interaction',
        'Predictive growth modeling',
        'Operational overhead reduction',
        'Real-time data synthesis'
      ],
      whyChooseUs: 'We implement practical AI that solves real business friction. From custom LLM agents to predictive analytics, we build the future of your operations.',
      price: 'From $4,999',
      results: '$400K+ Saved',
      cta: 'Automate Command'
    },
    {
      icon: Code,
      title: 'Neural Web Dev',
      definition: 'Ultra-performance web architecture built for speed, security, and maximum conversion psychology.',
      benefits: [
        'Sub-1s global load velocity',
        'Conversion-optimized UX/UI',
        'Headless CMS infrastructure',
        'Unbreakable security protocols'
      ],
      whyChooseUs: 'We build digital headquarters that convert at 15%+. Our sites are engineered to be your highest-performing salesperson.',
      price: 'From $7,999',
      results: '15%+ Conversion',
      cta: 'Architect Your Site'
    },
    {
      icon: Cpu,
      title: 'App Ecosystems',
      definition: 'Powerful mobile experiences designed to integrate seamlessly into your customers\' digital lives.',
      benefits: [
        'High-retention mobile experiences',
        'Native performance architecture',
        'Engagement-driven features',
        'Scalable backend systems'
      ],
      whyChooseUs: 'We build apps that people love to use. Our focus is on frictionless utility and psychological engagement loops.',
      price: 'From $12,999',
      results: '4.8+ Star Rating',
      cta: 'Develop Mobile Asset'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Intelligence Sync',
      desc: 'Deep-dive audit of your current digital architecture and market positioning.',
      icon: Target,
      time: '30 mins'
    },
    {
      step: '02',
      title: 'Strategic Blueprint',
      desc: 'Custom engineered growth map with clear milestones and ROI projections.',
      icon: Rocket,
      time: '48 Hours'
    },
    {
      step: '03',
      title: 'Tactical Deployment',
      desc: 'Rapid execution phase where we build and launch your growth assets.',
      icon: Zap,
      time: '2-8 Weeks'
    },
    {
      step: '04',
      title: 'Continuous Scaling',
      desc: 'Real-time optimization and iterative scaling to maximize market share.',
      icon: TrendingUp,
      time: 'Ongoing'
    },
  ];

  const stats = [
    { number: '500+', label: 'Engines Shipped', icon: Rocket },
    { number: '98%', label: 'Partner Retention', icon: Star },
    { number: '5x', label: 'Median ROI', icon: TrendingUp },
    { number: '<1hr', label: 'Response Velocity', icon: Zap },
  ];

  const faqs = [
    {
      q: 'How rapid is the result velocity?',
      a: 'PPC generates traffic in <48hrs. SEO benchmarks usually show significant movement in 60-90 days. We optimize for immediate quick-wins while building long-term dominance.'
    },
    {
      q: 'Do you work with early-stage ventures?',
      a: 'Yes. 70% of our partners started as agile startups. We provide the technical leverage needed to out-compete established giants.'
    },
    {
      q: 'What is your performance guarantee?',
      a: 'If we don\'t hit agreed-upon milestones within 90 days, we work at zero cost until we do. We share the risk because we believe in our protocol.'
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Seo
        title="Enterprise Digital Growth & AI SEO Services | RankRise USA"
        description="Explore RankRise USA's full-suite digital solutions: AI search engine optimization, modern web development, PPC ad management, and conversion growth."
        canonical="https://rankriseusa.com/services"
        keywords={[
          "seo services usa",
          "ai seo agency",
          "web development services",
          "ppc management agency",
          "digital marketing solutions",
          "search engine optimization company",
          "custom software engineering"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Services", item: "https://rankriseusa.com/services" }
        ]}
      />
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">Premium Intelligence Protocols</span>
          </motion.div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight mb-6 break-words">
            Enterprise AI SEO &amp; <br />
            <span className="text-gradient-gold italic">Digital Growth Services in the USA</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10">
            From Generative Engine Optimization (GEO) to custom high-converting web architecture. Every service is precision-engineered to capture market share and drive revenue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl button-premium font-black uppercase tracking-widest text-xs sm:text-sm group">
                Request Protocol Sync
                <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-12 sm:h-14 px-8 rounded-xl sm:rounded-2xl border-white/10 hover:border-primary/50 text-foreground font-black uppercase tracking-widest text-xs sm:text-sm">
                View Investment Tiers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-6 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-4xl font-black text-foreground mb-2 leading-none">{stat.number}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Core */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="glass-card p-1 rounded-[3rem] border-white/5 hover:border-primary/30 transition-all overflow-hidden"
              >
                <div className="bg-[#05070a]/80 backdrop-blur-3xl p-10 h-full rounded-[2.8rem] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-3xl font-black text-foreground leading-none">{service.title}</h3>
                    </div>

                    <p className="text-muted-foreground font-bold mb-10 leading-relaxed">
                      {service.definition}
                    </p>

                    <div className="space-y-4 mb-12">
                      {service.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          <span className="text-foreground font-bold text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Target Yield</div>
                      <div className="text-2xl font-black text-primary">{service.results}</div>
                    </div>
                    <Link to="/contact">
                      <Button className="h-14 px-8 rounded-xl bg-white/5 hover:bg-primary hover:text-background border border-white/10 text-foreground font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2">
                        {service.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Protocol (Process) */}
      <section className="py-32 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
              The Rankriseusa <span className="text-gradient-gold italic">Protocol.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-bold">Execution with mathematical precision.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {process.map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <item.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="text-primary text-xs font-black mb-2 uppercase tracking-[0.3em]">{item.step}</div>
                <h3 className="text-2xl font-black text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-primary">
                  <Star className="w-3 h-3" />
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence FAQ */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">Neural <span className="text-gradient-gold">Sync.</span></h2>
            <p className="text-muted-foreground font-bold text-sm sm:text-base italic">Quick answers for high-speed decision making.</p>
          </div>

          <div className="space-y-4 mb-10">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-white/5 hover:border-primary/20 transition-all"
              >
                <h3 className="text-lg sm:text-xl font-black text-foreground mb-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground font-medium text-sm sm:text-base pl-5 border-l border-white/10 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-primary/20 text-center flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-left">
              <h4 className="text-lg sm:text-xl font-black text-white mb-1">Looking for More Detailed Answers?</h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Check out our complete agency FAQ knowledge base on our homepage.</p>
            </div>
            <Link to="/#faq">
              <Button className="bg-[#EAB308] hover:bg-[#D4A017] text-black font-black uppercase tracking-widest text-xs px-5 py-3.5 h-auto rounded-xl shrink-0 flex items-center gap-2">
                View Full Homepage FAQs
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Strategic CTA */}
      <section className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground leading-[0.9] tracking-tighter mb-4 sm:mb-6">
              Ready To <br />
              <span className="text-gradient-gold italic">Command?</span>
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground font-bold mb-8 sm:mb-10">
              Deploy the protocol and witness the transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-12 rounded-xl sm:rounded-2xl button-premium font-black uppercase tracking-widest text-xs sm:text-sm group">
                  Initiate Sync
                  <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-muted-foreground font-black uppercase tracking-[0.25em] text-[10px]">
              Limited Partner Capacity • 90-Day Result Guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}