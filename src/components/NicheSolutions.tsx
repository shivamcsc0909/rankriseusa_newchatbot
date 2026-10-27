import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight, ShoppingCart, Home, Briefcase, Rocket, Shield, Zap, Globe } from 'lucide-react';

const niches = [
  {
    id: 'ecommerce',
    title: 'E-commerce Mastery',
    icon: ShoppingCart,
    description: 'Custom neural architectures for high-conversion retail. We optimize for purchase intent and dynamic product discovery.',
    stats: ['94% Sales Lift', 'AI Upselling', 'Cart Recovery'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'local',
    title: 'Local Authority',
    icon: Home,
    description: 'Hyper-local optimization for service providers. Dominate map packs and capture local intent before competitors.',
    stats: ['#1 Map Rankings', 'Lead Generation', 'Reputation AI'],
    color: 'from-primary to-accent'
  },
  {
    id: 'enterprise',
    title: 'Enterprise Scalability',
    icon: Briefcase,
    description: 'Sophisticated systems for multi-location brands. Unified intelligence across global digital properties.',
    stats: ['Global Infrastructure', 'Brand Integrity', 'Workflow Automation'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'startup',
    title: 'Startup Acceleration',
    icon: Rocket,
    description: 'Fast-track authority for emerging tech. Build market share through aggressive discovery optimization.',
    stats: ['Rapid Indexing', 'VC Ready ROI', 'Aggressive Growth'],
    color: 'from-green-500 to-emerald-500'
  }
];

export default function NicheSolutions() {
  const [activeNiche, setActiveNiche] = useState<string | null>(niches[0].id);

  return (
    <section className="py-32 bg-[#05070a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      <div className="absolute inset-0 neural-grid opacity-[0.03]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          
          {/* Left Side: Accordion */}
          <div className="w-full lg:w-1/2 space-y-8 lg:space-y-10">
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-[1px] bg-primary" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Domain Specialization</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-6 lg:mb-8"
              >
                Specialized <br />
                <span className="text-gradient-gold italic">Intelligence.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xl text-white/40 font-medium max-w-xl leading-relaxed"
              >
                We deploy industry-specific neural models designed for your unique operational landscape and market dynamics.
              </motion.p>
            </div>

            <div className="space-y-6">
              {niches.map((niche) => (
                <div key={niche.id} className="group">
                  <button
                    onClick={() => setActiveNiche(activeNiche === niche.id ? null : niche.id)}
                    className={`w-full text-left transition-all duration-700 relative overflow-hidden rounded-[2.5rem] border ${
                      activeNiche === niche.id 
                        ? 'bg-primary border-primary p-10 shadow-[0_20px_60px_rgba(250,204,21,0.25)]' 
                        : 'bg-white/5 border-white/5 p-8 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          activeNiche === niche.id ? 'bg-black/10 scale-110 rotate-3' : 'bg-primary/10'
                        }`}>
                          <niche.icon className={`w-8 h-8 ${activeNiche === niche.id ? 'text-black' : 'text-primary'}`} />
                        </div>
                        <span className={`text-2xl font-black uppercase tracking-tight ${
                          activeNiche === niche.id ? 'text-black' : 'text-white'
                        }`}>
                          {niche.title}
                        </span>
                      </div>
                      {activeNiche === niche.id ? (
                        <Minus className="w-6 h-6 text-black" />
                      ) : (
                        <Plus className="w-6 h-6 text-white/30 group-hover:text-primary transition-colors" />
                      )}
                    </div>

                    <AnimatePresence>
                      {activeNiche === niche.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden relative z-10"
                        >
                          <div className="pt-10 space-y-8">
                            <p className={`text-lg leading-relaxed font-medium ${activeNiche === niche.id ? 'text-black/80' : 'text-white/60'}`}>
                              {niche.description}
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {niche.stats.map((stat, i) => (
                                <span key={i} className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                                  activeNiche === niche.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                                }`}>
                                  {stat}
                                </span>
                              ))}
                            </div>
                            <div className={`flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] pt-4 group/btn cursor-pointer transition-all ${
                              activeNiche === niche.id ? 'text-black hover:opacity-70' : 'text-primary hover:text-white'
                            }`}>
                              Deploy Industry Protocol
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Context */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-square">
              {/* Background Glows */}
              <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full opacity-30 animate-pulse" />
              
              <motion.div
                key={activeNiche}
                initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full bg-[#0d1117] rounded-[3rem] lg:rounded-[4rem] border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.5)] p-8 lg:p-16 flex flex-col justify-center overflow-hidden group"
              >
                {/* Visual Accent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] neural-grid" />

                {activeNiche ? (
                  <div className="relative z-10 text-center">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-12 shadow-[0_20px_50px_rgba(250,204,21,0.3)] transform hover:scale-110 hover:rotate-6 transition-all duration-500"
                    >
                      {(() => {
                        const Icon = niches.find(n => n.id === activeNiche)?.icon || ShoppingCart;
                        return <Icon className="w-20 h-20 text-black" />;
                      })()}
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 lg:mb-8 uppercase tracking-tighter leading-none"
                    >
                      {niches.find(n => n.id === activeNiche)?.title}
                    </motion.h3>
                    
                    <div className="space-y-6">
                      {niches.find(n => n.id === activeNiche)?.stats.map((stat, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          className="flex items-center justify-center gap-4 group/stat"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover/stat:scale-150 transition-transform" />
                          <span className="text-2xl font-black text-white/80 uppercase tracking-tight group-hover/stat:text-primary transition-colors">{stat}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-8 relative z-10">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-32 h-32 rounded-full border-4 border-dashed border-primary/30 mx-auto flex items-center justify-center"
                    >
                      <Globe className="w-16 h-16 text-primary/30" />
                    </motion.div>
                    <div className="space-y-4">
                      <p className="text-primary/40 font-black uppercase tracking-[0.3em] text-xs">Initialize Data Stream</p>
                      <p className="text-3xl text-white/20 font-black uppercase tracking-tighter">Select an Industry Protocol</p>
                    </div>
                  </div>
                )}

                {/* Decorative Data Elements */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between opacity-20">
                  <div className="flex flex-col gap-1">
                    <div className="w-12 h-[2px] bg-white/20" />
                    <div className="w-8 h-[2px] bg-white/20" />
                  </div>
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                    AI-MODEL-V.2.4.0
                  </div>
                </div>
              </motion.div>

              {/* Decorative Frame Elements */}
              <div className="absolute -top-10 -right-10 w-48 h-48 border-t-2 border-r-2 border-primary/20 rounded-tr-[6rem]" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 border-b-2 border-l-2 border-primary/20 rounded-bl-[6rem]" />
              
              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-5 left-1/4 w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center"
              >
                <Shield className="w-6 h-6 text-primary/40" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 -right-5 w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center"
              >
                <Zap className="w-7 h-7 text-primary/40" />
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
