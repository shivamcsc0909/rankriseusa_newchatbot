import { motion } from 'framer-motion';
import { Users, Award, Target, Zap, Rocket, TrendingUp, Heart, Shield, Sparkles, Brain, Cpu, Globe } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function About() {
  const [counts, setCounts] = useState({ projects: 500, clients: 200, years: 5, satisfaction: 98 });
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || hasAnimated.current) return;

    const startAnimation = () => {
      hasAnimated.current = true;
      setCounts({ projects: 0, clients: 0, years: 0, satisfaction: 0 });
      const targets = { projects: 500, clients: 200, years: 5, satisfaction: 98 };
      const duration = 1500;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setCounts({
          projects: Math.floor(progress * targets.projects),
          clients: Math.floor(progress * targets.clients),
          years: Math.floor(progress * targets.years),
          satisfaction: Math.floor(progress * targets.satisfaction),
        });
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      label: 'AI Integrations',
      value: counts.projects,
      suffix: '+',
      icon: Brain,
      color: 'from-primary to-accent',
      description: 'Neural networks deployed'
    },
    {
      label: 'Global Partners',
      value: counts.clients,
      suffix: '+',
      icon: Globe,
      color: 'from-primary to-accent',
      description: 'Across 15 countries'
    },
    {
      label: 'Elite Engineers',
      value: 45,
      suffix: '+',
      icon: Cpu,
      color: 'from-primary to-accent',
      description: 'Specialized experts'
    },
    {
      label: 'Success Rate',
      value: counts.satisfaction,
      suffix: '%',
      icon: TrendingUp,
      color: 'from-primary to-accent',
      description: 'Growth achieved'
    },
  ];

  const values = [
    {
      title: 'Neural Innovation',
      description: 'We leverage large language models and predictive AI to create strategies that are always three steps ahead.',
      icon: Sparkles,
      color: 'from-primary to-accent'
    },
    {
      title: 'Data Sovereignty',
      description: 'Your data is your power. We build systems that protect your intellectual property while maximizing its utility.',
      icon: Shield,
      color: 'from-primary to-accent'
    },
    {
      title: 'Hyper-Scale',
      description: 'Our solutions are built on elastic infrastructure, designed to scale from zero to millions of users seamlessly.',
      icon: Rocket,
      color: 'from-primary to-accent'
    },
    {
      title: 'Human-Centric AI',
      description: 'We believe AI should empower humans, not replace them. We focus on enhancing creativity and productivity.',
      icon: Users,
      color: 'from-primary to-accent'
    },
  ];

  return (
    <section ref={sectionRef} id="about" className="py-14 lg:py-20 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-50 border border-gray-100 text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em]"
            >
              <Zap className="w-3.5 h-3.5 fill-primary" />
              <span>Defining The Global Standard</span>
            </motion.div>

            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-black leading-[0.9] tracking-tighter uppercase break-words">
              Beyond Conventional <br />
              <span className="text-primary italic">Consultancy.</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium max-w-xl">
              Rankriseusa is a high-performance digital consultancy. We merge human expertise with neural engineering to architect comprehensive ecosystems that outpace the market.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
              <Link to="/services" className="w-full sm:w-auto">
                <Button className="button-premium w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] h-auto rounded-xl sm:rounded-2xl">
                  Our Methodology
                </Button>
              </Link>
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] h-auto rounded-xl sm:rounded-2xl border-gray-300 text-black hover:bg-gray-100 transition-all font-black">
                  Consultancy Intel
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-primary/30 transition-all duration-700 group relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
                  <stat.icon className="w-20 h-20 text-primary" />
                </div>

                <div className={`w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-5 shadow-sm group-hover:bg-primary/10 transition-all duration-700 relative z-10`}>
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>

                <div className="text-3xl sm:text-4xl font-black text-black mb-2 tracking-tighter relative z-10">
                  {stat.value}{stat.suffix}
                </div>
                <div className="font-black text-gray-700 uppercase text-[10px] tracking-[0.2em] relative z-10">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="pt-12 lg:pt-16 border-t border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h3 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tighter text-black uppercase">Technical <span className="text-primary italic">Sovereignty.</span></h3>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              We operate at the intersection of technical brilliance and strategic authority.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-5 rounded-2xl bg-gray-50/60 border border-gray-100"
              >
                <div className="mb-6 relative inline-block">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 mx-auto sm:mx-0 rounded-2xl bg-white border border-gray-300 flex items-center justify-center group-hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-md`}>
                    <value.icon className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-black mb-2 text-black tracking-tight uppercase group-hover:text-primary transition-colors">{value.title}</h4>
                <p className="text-gray-700 leading-relaxed font-medium text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}