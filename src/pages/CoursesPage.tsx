import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft, ArrowRight, Clock, Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

const courseTracks = [
  {
    icon: Sparkles,
    badge: 'Protocol 01',
    title: 'AI Search & Generative Engine Optimization (GEO)',
    description: 'Master indexing algorithms for ChatGPT, Claude, Perplexity, and Google Search Generative Experience. Learn how to optimize brand entity authority and secure top positions in AI response models.',
  },
  {
    icon: Cpu,
    badge: 'Protocol 02',
    title: 'Performance Web Engineering & React Architecture',
    description: 'Build sub-second, high-converting digital applications using modern framework stacks. Covers technical Core Web Vitals optimization, server-side caching, and enterprise security headers.',
  },
  {
    icon: BookOpen,
    badge: 'Protocol 03',
    title: 'Data-Driven SEO & Technical Audit Protocols',
    description: 'Deep-dive into enterprise site crawling, JSON-LD schema architecture, internal outlinks modeling, and automated technical audit remediation for large-scale production websites.',
  },
];

const academyHighlights = [
  'Direct battle-tested agency protocols used on live client campaigns',
  'Hands-on technical audits and real-world performance benchmarks',
  'Exclusive executive certification for growth engineers and marketing leaders',
];

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-24">
      <Seo
        title="Academy & Growth Courses | Master AI SEO | RankRise USA"
        description="RankRise USA Academy provides elite digital growth training, AI search masterclasses, and web engineering certifications for marketing leaders."
        canonical="https://rankriseusa.com/courses"
        keywords={[
          "seo masterclass",
          "ai search courses",
          "digital marketing academy",
          "growth engineering training"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Courses", item: "https://rankriseusa.com/courses" }
        ]}
      />
      
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">RankRise USA Academy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight uppercase leading-tight">
            RankRise Academy | <span className="text-gradient-gold italic">AI Search &amp; SEO Masterclasses</span>
          </h1>

          <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-6">
            RankRise USA Academy is an executive learning environment engineered for marketing directors, agency founders, and growth engineers seeking to master AI-driven search, performance engineering, and search engine dominance.
          </p>

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-foreground">
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            <span>Curriculum Under Active Calibration — Enrolling Q4 2026</span>
          </div>
        </motion.div>

        {/* Course Tracks Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center tracking-tight uppercase">
            Upcoming <span className="text-gradient-gold italic">Intelligence Tracks</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courseTracks.map((track, idx) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (idx + 1) }}
                  className="glass-card p-8 rounded-3xl border-white/10 flex flex-col justify-between hover:border-primary/30 transition-colors group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                        {track.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">
                      {track.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span>Status: calibrating</span>
                    <span className="text-primary font-bold">Preview Available</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Standards & Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 sm:p-12 rounded-3xl border-white/10 mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center tracking-tight uppercase">
            Executive <span className="text-gradient-gold italic">Learning Standards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {academyHighlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Navigation Footer */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/">
              <Button className="h-14 px-8 rounded-2xl button-premium font-black uppercase tracking-widest text-sm inline-flex items-center gap-3">
                <ArrowLeft className="w-5 h-5" />
                Return to Base
              </Button>
            </Link>

            <Link to="/services">
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm inline-flex items-center gap-3 border-white/10 hover:bg-white/5">
                Explore Core Services
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/contact">
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm inline-flex items-center gap-3 border-white/10 hover:bg-white/5">
                Request Protocol Sync
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;