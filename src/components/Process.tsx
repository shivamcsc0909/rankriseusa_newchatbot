import { motion } from 'framer-motion';
import { Search, Target, Cpu, CheckCircle2, ArrowRight, Sparkles, Zap, Network } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discovery & Audit',
    description: 'We conduct a deep-dive analysis into your current digital footprint, market position, and AI search presence.',
    details: ['Generative Engine Audit', 'Competitive Neural Mapping', 'Brand Sentiment Analysis'],
    color: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.2)'
  },
  {
    icon: Target,
    title: 'Strategic Blueprint',
    description: 'Our AI engineers architect a bespoke growth system designed to dominate your specific market niche.',
    details: ['Semantic Content Strategy', 'AI Agent Integration Planning', 'Predictive ROI Modeling'],
    color: 'from-primary to-accent',
    glow: 'rgba(250, 204, 21, 0.2)'
  },
  {
    icon: Cpu,
    title: 'Neural Implementation',
    description: 'Deployment of custom models, GEO optimizations, and high-performance scaling systems.',
    details: ['LLM Optimization (GEO)', 'Automated Growth Loops', 'Real-time Performance Scaling'],
    color: 'from-purple-500 to-pink-500',
    glow: 'rgba(168, 85, 247, 0.2)'
  }
];

export default function Process() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Network className="w-3 h-3" />
            <span>Our Methodology</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-7xl font-black mb-8 text-white tracking-tighter"
          >
            The <span className="text-gradient-gold italic">Growth</span> <br />
            <span className="relative">
              Architecture
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-transparent" 
              />
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-white/50 leading-relaxed font-medium"
          >
            A systematic, neural-driven approach to scaling brands in the <br className="hidden md:block" /> 
            era of artificial intelligence and machine discovery.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[120px] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group relative"
            >
              <div className="glass-card-premium p-10 rounded-[3rem] h-full flex flex-col relative overflow-hidden group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                {/* Glow Effect */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-700 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: step.glow }}
                />

                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="absolute top-0 right-0 text-8xl font-black text-white/[0.03] group-hover:text-primary/[0.08] transition-colors leading-none select-none">
                    0{index + 1}
                  </div>

                  <h3 className="text-3xl font-black mb-6 text-white group-hover:text-primary transition-colors tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/60 mb-10 leading-relaxed font-medium">
                    {step.description}
                  </p>

                  <div className="space-y-4 mt-auto">
                    {step.details.map((detail, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (idx * 0.1) }}
                        className="flex items-center gap-4 text-sm font-bold text-white/80 group/item"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover/item:scale-150 transition-transform" />
                        {detail}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} transition-all duration-500 w-0 group-hover:w-full`} />
              </div>

              {/* Connector Arrow (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-[110px] -right-5 translate-x-1/2 z-20 items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-background border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-primary/50 transition-colors">
                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-flex items-center gap-3 p-1 pr-6 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-background">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-widest">Ready to initiate the protocol?</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
