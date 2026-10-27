import React, { useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles, Zap, Box, Cpu, Workflow, Database, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: '01',
    title: 'Design',
    icon: Box,
    accentIcon: Network,
    items: [
      'Web design',
      'App design',
      'Product interface',
      'Touch screen displays',
      'IoT experiences',
      'Visual Identity',
      'User Research',
      'Prototyping'
    ],
    link: '/services#design'
  },
  {
    id: '02',
    title: 'Branding',
    icon: Sparkles,
    accentIcon: Workflow,
    items: [
      'Strategy',
      'Naming',
      'Positioning',
      'Logo and identity',
      'Copywriting',
      'Voice & Tone',
      'Brand Guidelines',
      'Market Strategy'
    ],
    link: '/services#branding'
  },
  {
    id: '03',
    title: 'Development',
    icon: Cpu,
    accentIcon: Database,
    items: [
      'Creative development',
      'Front-end development',
      'Back-end development',
      'Cloud engineering',
      'Headless shopify',
      'Mobile Development',
      'API Integration',
      'System Architecture'
    ],
    link: '/services#development'
  }
];

export default function AnmlServices() {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#05070a] py-32 overflow-visible font-['Inter',_sans-serif] relative">
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[100] grain-texture" />

      {/* Global Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03),transparent_70%)] pointer-events-none" />

      <style dangerouslySetInnerHTML={{
        __html: `
        .grain-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          filter: contrast(150%) brightness(100%);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .spotlight-container {
          --x: 50%;
          --y: 50%;
        }
        .spotlight-container:hover .spotlight {
          background: radial-gradient(600px circle at var(--x) var(--y), rgba(250,204,21,0.04), transparent 80%);
        }
      `}} />

      <div className="w-full px-6 lg:px-16 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-40 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[11px] font-black uppercase tracking-[0.6em] text-primary mb-10 flex items-center gap-4"
            >
              <div className="w-12 h-[1px] bg-primary/30" />
              Our Ecosystem
            </motion.h4>
            <h2 className="text-4xl lg:text-[7rem] font-medium text-white max-w-6xl leading-[1] tracking-[-0.05em]">
              <LineReveal text="We're equally fluent in strategy," />
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-white/10"
              >
                <LineReveal text="technology, design, brand," />
              </motion.span>
              <LineReveal text="and business growth." delay={0.8} />
            </h2>
          </motion.div>
        </div>

        {/* Services List with Stacking Effect */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <ServiceBlock key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LineReveal({ text, delay = 0 }: { text: string, delay?: number }) {
  return (
    <span className="block overflow-hidden pb-2">
      <motion.span
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        className="block text-[1.2rem] md:text-[4rem] font-medium tracking-[0.02em] text-white/30 hover:text-white transition-colors duration-300"
      >
        {text}
      </motion.span>
    </span>
  );
}

function ServiceBlock({ service, index }: { service: typeof services[0], index: number }) {
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      className="sticky top-[30vh] min-h-[20vh] bg-black border-t border-b border-white/80"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[70vh] grid grid-cols-1 lg:grid-cols-[58%_42%] px-0 py-20 lg:py-16"
      >
        {/* Left Column */}
        <div className="flex flex-col justify-start">
          <h4 className="text-2xl lg:text-[1.8rem] font-black text-white mb-3 tracking-tight">
            {service.id}/
          </h4>

          <h2 className="text-[3rem] md:text-[4rem] lg:text-[4rem] font-black text-white tracking-[-0.08em] leading-[0.9] pl-8 lg:pl-16 px-20">
            <motion.span
              initial={{ opacity: 0, y: "100%", rotate: 2 }}
              whileInView={{ opacity: 1, y: "0%", rotate: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="block overflow-hidden"
            >
              {service.title}
            </motion.span>
          </h2>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col justify-start pt-8 lg:pt-14 ml-auto"
        >
          <ul className="space-y-3 mb-12 group">
            {service.items.slice(0, 5).map((item, i) => (
              <li
                key={i}
                className="
        text-sm lg:text-[1rem]
        font-medium
        leading-relaxed
        tracking-[0.01em]
        text-white/60
        hover:text-white
        transition-all
        duration-300
        cursor-default
      "
              >
                {item}
              </li>
            ))}
          </ul>

          <Link
            to={service.link}
            className="w-fit text-2xl font-bold text-white border-b border-white leading-none pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            View all
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceItem({ item, index, icon: Icon }: { item: string, index: number, icon: any }) {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: false, margin: "-5% 0px -5% 0px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: 20, filter: "blur(10px)", scale: 0.98 }}
      animate={isInView
        ? { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 }
        : { opacity: 0, x: 20, filter: "blur(10px)", scale: 0.98 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.03,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group flex items-center gap-10"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
        <Icon className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
      </div>

      <div className="flex-1 border-b border-white/5 pb-8 group-hover:border-primary/20 transition-colors duration-500">
        <div className="flex items-center justify-between">
          <h4 className="text-[20px] lg:text-[2rem] font-bold text-white/10 group-hover:text-white transition-all duration-500 cursor-default tracking-tighter leading-tight">
            {item}
          </h4>
          <span className="text-[10px] font-black text-white/5 group-hover:text-primary transition-colors duration-500">
            0{index + 1}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
