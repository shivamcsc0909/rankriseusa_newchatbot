import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen h-[100dvh] overflow-hidden bg-[#2D1B1B]">

      {/* Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-contain sm:object-cover object-center opacity-60"
        >
          <source src="/assets/hero_sectionvideo.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/40 via-[#2D1B1B]/60 to-[#F43F5E]/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center pt-24 lg:pt-32 pb-12 lg:pb-16 text-center">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 max-w-5xl drop-shadow-lg text-center leading-[1.1] uppercase">
          USA's Premier <span className="text-gradient-gold italic">AI SEO</span> &amp; Digital Growth Agency
        </h1>

        <p className="text-base sm:text-xl text-white/90 max-w-3xl mb-8 font-medium leading-relaxed drop-shadow">
          We engineer top Google rankings, enterprise web architecture, and hyper-targeted PPC campaigns that accelerate revenue for US market leaders.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-[#EAB308]/20 blur-3xl rounded-full scale-150 animate-pulse" />

          <Link to="/contact" className="relative z-10">
            <Button className="bg-[#EAB308] hover:bg-[#D4A017] text-black font-black uppercase tracking-[0.2em] px-8 sm:px-10 py-5 sm:py-6 rounded-full text-[10px] sm:text-[11px]">
              Initiate Strategy
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}