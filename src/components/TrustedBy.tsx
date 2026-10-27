import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TrustedBy() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Trusted & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500">Supported By</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6 max-w-[1000px] mx-auto">
          {/* Card 1: Google Partner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-4 hover:-translate-y-1 transition-transform"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Certified Agency Partner Logo" title="RankRise USA Google Partner" width={80} height={27} loading="lazy" decoding="async" className="w-20" />
            <span className="text-xs font-bold text-slate-700 tracking-wide text-center">Google Partner</span>
          </motion.div>

          {/* Card 2: HubSpot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-3 hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 bg-[#ff7a59] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-2xl">H</span>
            </div>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider text-center leading-relaxed">Inbound Marketing<br />Certified</span>
          </motion.div>

          {/* Card 3: Google Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-2 hover:-translate-y-1 transition-transform"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Customer Reviews Logo" title="Google Reviews Rating" width={80} height={27} loading="lazy" decoding="async" className="w-20 mb-1" />
            <span className="text-xs font-bold text-slate-700">Reviews</span>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#fbbc04] text-[#fbbc04]" />)}
            </div>
          </motion.div>

          {/* Card 4: Clutch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-2 hover:-translate-y-1 transition-transform"
          >
            <span className="text-2xl font-black text-slate-900 tracking-tight">Clutch</span>
            <span className="text-xs font-bold text-slate-700">Reviews 4.7</span>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#fbbc04] text-[#fbbc04]" />)}
            </div>
          </motion.div>

          {/* Card 5: Trustpilot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-2 hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#00b67a] flex items-center justify-center rounded-sm">
                <Star className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">Trustpilot</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center rounded-sm">
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6: TechForex */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="w-full sm:w-[170px] h-[160px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center justify-center p-6 gap-2 hover:-translate-y-1 transition-transform"
          >
            <div className="w-10 h-10 bg-[#00b67a] rounded-full flex items-center justify-center mb-1 shadow-sm">
              <span className="text-white font-black text-sm">TF</span>
            </div>
            <span className="text-sm font-black text-slate-900">TechForex.in</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Forex Trading</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
