import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Target, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      title: 'Neural Finance Hub',
      category: 'AI/ML',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      color: 'from-primary to-accent',
      description: 'Built an AI-driven fintech dashboard with predictive market analytics and automated asset management.',
      challenge: 'Needed to process 1M+ data points per second with sub-10ms latency.',
      solution: 'Custom neural networks integrated with a high-performance Rust backend.',
      stats: { accuracy: '99.4%', speed: '12ms', ROI: '+35%' },
      results: ['Ranked #1 AI Finance tool', 'Managed $500M in assets', 'Zero downtime over 12 months'],
      tech: ['PyTorch', 'Rust', 'Next.js', 'WebSockets'],
    },
    {
      title: 'GEO Dominance Strategy',
      category: 'GEO + SEO',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      color: 'from-primary to-accent',
      description: 'Secured top placement on ChatGPT and Gemini for a global SaaS brand using generative engine optimization.',
      challenge: 'Legacy SEO strategy was failing in the AI search era.',
      solution: 'Semantic content clusters and neural link building techniques.',
      stats: { impressions: '15M', ranking: '#1', growth: '450%' },
      results: ['Top recommendation by Perplexity', 'Organic leads up 300%', 'Domain authority boosted to 82'],
      tech: ['Semantic AI', 'LLM Agents', 'Data Mapping', 'Search Console'],
    },
    {
      title: 'E-commerce Evolution',
      category: 'Web Dev',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      color: 'from-primary to-accent',
      description: 'A headless e-commerce experience with interactive 3D product previews and instant checkout.',
      challenge: 'High bounce rates on mobile due to slow page loads.',
      solution: 'Headless Shopify architecture with Next.js and Three.js visuals.',
      stats: { conversion: '12.5%', speed: '98/100', sales: '+$5M' },
      results: ['Voted Site of the Month', 'Bounce rate dropped 65%', 'Average order value up 40%'],
      tech: ['Next.js', 'Three.js', 'Shopify Plus', 'Framer Motion'],
    },
    {
      title: 'AI Brand Ecosystem',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      color: 'from-primary to-accent',
      description: 'A complete future-proof brand identity that adapts across digital and spatial computing platforms.',
      challenge: 'Brand felt "stuck in 2020" and didn\'t reflect its AI tech.',
      solution: 'Generative design system with interactive brand guidelines.',
      stats: { recognition: '95%', leads: '4x', retention: '+60%' },
      results: ['Secured $20M Series B', 'Featured in Design Week', 'Consistent across all touchpoints'],
      tech: ['Generative Design', 'Figma', 'React', 'Spatial UI'],
    },
  ];

  const categories = ['All', 'AI/ML', 'GEO + SEO', 'Web Dev', 'Branding'];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-16 lg:py-24 relative overflow-hidden bg-[#05070a]">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 fill-primary" />
              <span>THE INTELLIGENCE VAULT</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 text-white leading-[0.9] tracking-tighter uppercase break-words"
            >
              Dominating <br />
              <span className="text-gradient-gold italic">The Web.</span>
            </motion.h2>

            <p className="text-base sm:text-xl text-white/70 leading-relaxed font-medium max-w-2xl">
              We don't just execute projects; we architect market dominance. Explore our protocols of high-impact neural transformations and market-leading expansions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                onClick={() => setFilter(category)}
                className={`rounded-xl px-5 sm:px-7 py-2.5 sm:py-3 h-auto text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${filter === category
                  ? 'button-premium border-0'
                  : 'bg-white/5 border-white/10 hover:border-primary/50 text-white/70 hover:text-primary'
                  }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12"
          >
            {filteredProjects.map((project, index) => (
              <ProtocolCard
                key={project.title}
                project={project}
                index={index}
                onClick={() => setSelectedProject(projects.indexOf(project))}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Marketing & Branding Section */}
        <section className="py-16 lg:py-20 mt-10 relative">
          <div className="text-center mb-12 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="px-5 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20">
                GROWTH ARCHITECTURE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tighter uppercase italic leading-[0.95]"
            >
              Grow Faster With <br />
              <span className="text-gradient-gold">Marketing + Brand Identity</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 max-w-2xl mx-auto font-medium text-base sm:text-lg leading-relaxed"
            >
              A combined strategy section for lead generation, visibility, and memorable brand presence.
            </motion.p>
          </div>

          <div className="mt-10 text-center">
            <Link to="/contact">
              <Button className="h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-primary text-background font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-lg relative z-10 group text-xs sm:text-sm">
                Initialize Protocol
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link to="/contact">
            <Button className="button-premium text-xs sm:text-sm uppercase tracking-[0.2em] px-8 sm:px-12 py-4 sm:py-5 h-auto rounded-2xl font-black group">
              <Zap className="w-4 h-4 fill-background mr-2 group-hover:scale-125 transition-transform" />
              Replicate Success protocol
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl bg-[#05070a]/95 backdrop-blur-3xl border-white/10 p-0 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)]">
          {selectedProject !== null && (
            <div className="relative max-h-[90vh] overflow-y-auto hide-scrollbar">
              {/* Cover Image */}
              <div className="h-[500px] relative">
                <img
                  src={projects[selectedProject].image}
                  alt={`${projects[selectedProject].title} - RankRise USA Case Study Project`}
                  title={projects[selectedProject].title}
                  width={1200}
                  height={500}
                  loading="lazy"
          decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/40 to-transparent" />
                <div className="absolute bottom-16 left-16 right-16">
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary text-background text-[11px] font-black uppercase tracking-[0.3em] mb-10 shadow-2xl">
                    {projects[selectedProject].category}
                  </div>
                  <h3 className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter leading-none uppercase italic">
                    {projects[selectedProject].title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-16 lg:p-24 space-y-24">
                <p className="text-3xl text-white/60 leading-relaxed font-medium">
                  {projects[selectedProject].description}
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="p-12 rounded-[3.5rem] bg-white/5 border border-white/5 group hover:border-primary/30 transition-all duration-700">
                    <h4 className="text-primary font-black text-[12px] uppercase tracking-[0.4em] flex items-center gap-4 mb-10">
                      <Target className="w-6 h-6" />
                      Tactical Challenge
                    </h4>
                    <p className="text-white/70 font-medium text-xl leading-relaxed">{projects[selectedProject].challenge}</p>
                  </div>
                  <div className="p-12 rounded-[3.5rem] bg-primary/[0.03] border border-primary/10 group hover:border-primary/50 transition-all duration-700">
                    <h4 className="text-primary font-black text-[12px] uppercase tracking-[0.4em] flex items-center gap-4 mb-10">
                      <Zap className="w-6 h-6 fill-primary" />
                      Neural Deployment
                    </h4>
                    <p className="text-white/70 font-medium text-xl leading-relaxed">{projects[selectedProject].solution}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white/40 font-black text-[12px] uppercase tracking-[0.5em] mb-16 text-center">Neural Output Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {Object.entries(projects[selectedProject].stats).map(([key, value]) => (
                      <div key={key} className="p-12 rounded-[3rem] bg-[#0d1117] text-center border border-white/5 hover:border-primary/40 transition-all duration-700 group">
                        <div className="text-6xl font-black text-primary mb-4 tracking-tighter group-hover:scale-110 transition-transform">{value}</div>
                        <div className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 justify-center">
                  {projects[selectedProject].tech.map((t) => (
                    <span key={t} className="px-8 py-4 rounded-2xl bg-white/5 text-white/50 text-[12px] font-black uppercase tracking-[0.2em] border border-white/5 hover:border-primary/30 transition-all">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-12 text-center">
                  <Button className="button-premium px-16 py-12 text-sm font-black uppercase tracking-[0.2em] h-auto rounded-[3rem] group">
                    Execute This protocol
                    <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// const marketingBenefits = [
//   {
//     title: 'Brand Identity',
//     icon: Sparkles,
//     description: 'Logos, visual systems, and consistent brand assets that make your business look polished and memorable.',
//     highlight: 'Clear brand direction',
//     color: 'text-primary'
//   },
//   {
//     title: 'Social Media Marketing',
//     icon: Zap,
//     description: 'Creative content planning and campaign direction to help your brand stay visible and engaging.',
//     highlight: 'Better audience reach',
//     color: 'text-blue-400'
//   },
//   {
//     title: 'Performance Advertising',
//     icon: Target,
//     description: 'Targeted ad strategies designed to bring in leads, boost sales, and improve campaign efficiency.',
//     highlight: 'Focused conversions',
//     color: 'text-orange-400'
//   },
//   {
//     title: 'Email Marketing',
//     icon: Mail,
//     description: 'Simple, effective email flows that help you stay connected with customers and drive repeat business.',
//     highlight: 'Stronger retention',
//     color: 'text-green-400'
//   }
// ];

// const marketingAssets = [
//   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
//   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
//   'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80',
//   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
//   'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
//   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80'
// ];

// function MarketingCard({ benefit, index }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: index * 0.1, duration: 0.8 }}
//       className="group relative p-10 rounded-[3.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-primary/40 transition-all duration-700 overflow-hidden hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(250,204,21,0.05)]"
//     >
//       <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

//       <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-10 shadow-2xl group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 ${benefit.color}`}>
//         <benefit.icon className="w-10 h-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" />
//       </div>

//       <h3 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">{benefit.title}</h3>

//       <p className="text-white/40 text-base mb-12 leading-relaxed font-bold">
//         {benefit.description}
//       </p>

//       <div className="flex items-center gap-4 pt-10 border-t border-white/5 relative z-10">
//         <div className="relative flex items-center justify-center w-4 h-4">
//           <div className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-ping absolute" />
//           <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
//         </div>
//         <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">
//           {benefit.highlight}
//         </span>
//       </div>
//     </motion.div>
//   );
// }

// function AssetCard({ img, index }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       whileInView={{ opacity: 1, scale: 1 }}
//       viewport={{ once: true }}
//       transition={{ delay: index * 0.05 }}
//       className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer hover:scale-105 shadow-2xl relative group"
//     >
//       <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-20 transition-opacity z-10" />
//       <img src={img} alt="Marketing Asset" width={400} height={400} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
//         <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Asset #{index + 1}</span>
//       </div>
//     </motion.div>
//   );
// }

function ProtocolCard({ project, index, onClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-[4rem] bg-[#0d1117] border border-white/5 hover:border-primary/50 transition-all duration-700 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
    >
      <div className="aspect-[16/11] overflow-hidden relative">
        <img
          src={project.image}
          alt={`${project.title} - ${project.category} Portfolio Case Study by RankRise USA`}
          title={project.title}
          width={800}
          height={550}
          loading="lazy"
          decoding="async"
          style={{ transitionDuration: '2000ms' }}
          className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all group-hover:scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent opacity-90 group-hover:opacity-40 transition-opacity duration-1000" />

        {/* Floating Category Badge */}
        <div className="absolute top-10 left-10 px-6 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
          {project.category}
        </div>

        {/* Action Icon */}
        <div className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-8 group-hover:translate-x-0 shadow-[0_0_30px_rgba(250,204,21,0.5)]">
          <ArrowRight className="w-6 h-6 text-background -rotate-45" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
            <div className="relative flex items-center justify-center w-3 h-3">
              <div className="w-2 h-2 rounded-full bg-primary/30 animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
            </div>
            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">
              Success Protocol
            </span>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-primary transition-all duration-700 uppercase italic leading-none">
            {project.title}
          </h3>

          <div className="flex gap-16 pt-8 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-12 group-hover:translate-y-0 delay-200">
            {Object.entries(project.stats).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                {/* <span className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-primary transition-colors">{value}</span> */}
                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2">{key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
