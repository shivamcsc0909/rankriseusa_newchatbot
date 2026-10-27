import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

export default function MarketingBranding() {
  const benefits = [
    {
      title: 'Brand Identity',
      icon: Sparkles,
      description: 'Logos, visual systems, and consistent brand assets that make your business look polished and memorable.',
      highlight: 'Clear brand direction',
      color: 'text-primary'
    },
    {
      title: 'Social Media Marketing',
      icon: Zap,
      description: 'Creative content planning and campaign direction to help your brand stay visible and engaging.',
      highlight: 'Better audience reach',
      color: 'text-blue-400'
    },
    {
      title: 'Performance Advertising',
      icon: Target,
      description: 'Targeted ad strategies designed to bring in leads, boost sales, and improve campaign efficiency.',
      highlight: 'Focused conversions',
      color: 'text-orange-400'
    },
    {
      title: 'Email Marketing',
      icon: Mail,
      description: 'Simple, effective email flows that help you stay connected with customers and drive repeat business.',
      highlight: 'Stronger retention',
      color: 'text-green-400'
    }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80'
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#05070a]">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <span className="px-6 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20">
              Marketing & Branding
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase italic"
          >
            Grow Faster With <br />
            <span className="text-gradient-gold">Marketing + Brand Identity</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 max-w-3xl mx-auto font-medium text-lg lg:text-2xl leading-relaxed"
          >
            A combined strategy section for lead generation, visibility, and memorable brand presence — built to help your business look premium and perform better.
          </motion.p>
        </div>

        {/* Marketing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative p-10 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-primary/40 transition-all duration-700 overflow-hidden hover:-translate-y-3"
            >
              <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-10 shadow-2xl group-hover:bg-primary/10 transition-all duration-500 ${benefit.color}`}>
                <benefit.icon className="w-10 h-10 transition-transform duration-700 group-hover:scale-110" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">{benefit.title}</h3>
              <p className="text-white/40 text-base mb-12 leading-relaxed font-bold">
                {benefit.description}
              </p>
              <div className="flex items-center gap-4 pt-10 border-t border-white/5">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-ping absolute" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                </div>
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">
                  {benefit.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 transition-all duration-700 cursor-pointer hover:scale-105 shadow-2xl relative group"
            >
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-20 transition-opacity z-10" />
              <img src={img} alt={`RankRise USA Marketing & Branding Strategy Creative ${i + 1}`} title={`Marketing Creative ${i + 1}`} width={600} height={450} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link to="/contact">
            <Button className="h-20 px-16 rounded-full bg-primary text-background font-black uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-primary/20 relative z-10">
              Start a Project
              <ArrowRight className="w-6 h-6 ml-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
