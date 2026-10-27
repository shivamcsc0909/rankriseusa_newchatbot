import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Globe,
  Megaphone,
  Briefcase,
  Bot,
  Laptop,
  Sparkles,
  Users,
  Video,
  GraduationCap,
  Wrench,
  Calendar,
  Clock,
  Star,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------
// Learning modes
// ----------------------------------------------------------------------
const learningModes = [
  { key: "all", label: "All Formats" },
  { key: "crash", label: "Crash Course" },
  { key: "workshop", label: "Workshop" },
  { key: "weekly", label: "Weekly Class" },
  { key: "weekend", label: "Weekend Class" },
];

// ----------------------------------------------------------------------
// Course categories
// ----------------------------------------------------------------------
const categories = [
  { key: "web-dev", label: "Engineering", icon: Code2 },
  { key: "ai-tech", label: "Intelligence", icon: Bot },
  { key: "digital-marketing", label: "Growth", icon: Megaphone },
  { key: "business-office", label: "Business", icon: Briefcase },
  { key: "cms-tools", label: "Platforms", icon: Laptop },
];

// ----------------------------------------------------------------------
// Courses data
// ----------------------------------------------------------------------
const allCourses = [
  { id: 1, category: "web-dev", title: "MERN Stack Architecture", price: "₹2,999", duration: "10 Weeks", mode: "Weekly", desc: "Build high-performance fullstack applications with modern microservices architecture.", tags: ["Fullstack", "System Design"], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format" },
  { id: 2, category: "ai-tech", title: "Applied Neural Networks", price: "₹2,999", duration: "8 Weeks", mode: "Weekend", desc: "Master the implementation of LLMs and generative AI in enterprise ecosystems.", tags: ["AI/ML", "Architecture"], image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format" },
  { id: 3, category: "digital-marketing", title: "Algorithmic Growth", price: "₹2,499", duration: "6 Weeks", mode: "Workshop", desc: "Advanced data-driven marketing strategies for hyper-scaling digital brands.", tags: ["Performance", "Data"], image: "https://images.unsplash.com/photo-1557838923-2987c318be48?w=600&auto=format" },
];

export default function HomeCourses() {
  const [selectedCategory, setSelectedCategory] = useState("web-dev");
  const [selectedMode, setSelectedMode] = useState("all");

  const filteredCourses = allCourses.filter(
    (course) => course.category === selectedCategory
  );

  return (
    <section className="bg-background relative overflow-hidden py-32">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[#05070a]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.1) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      
      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Rankriseusa Academy</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-8xl font-black text-foreground leading-[0.85] tracking-tighter">
              Master the <br />
              <span className="text-gradient-gold italic">Future.</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <p className="text-xl text-muted-foreground font-bold max-w-sm">
              Elite technical training for the next generation of digital architects.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border-white/5">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Live Sessions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border-white/5">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Global Certs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Filters */}
        <div className="space-y-8 mb-16">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">Track:</span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-background shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                      : "glass-card border-white/5 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Format:</span>
            <div className="flex gap-2 p-1.5 rounded-2xl glass-card border-white/5">
              {learningModes.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setSelectedMode(mode.key)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedMode === mode.key
                      ? "bg-white/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={course.id}
                className="group cursor-pointer"
              >
                <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 group-hover:border-primary/30 transition-all h-full flex flex-col">
                  {/* Visual Surface */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={`${course.title} - RankRise USA Academy Course`}
                      title={course.title}
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute top-6 right-6 px-4 py-2 rounded-xl glass-card border-white/10 text-primary font-black">
                      {course.price}
                    </div>
                    <div className="absolute bottom-6 left-6 flex gap-2">
                      <div className="px-3 py-1.5 rounded-lg glass-card border-white/10 text-[9px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3 text-primary" />
                        {course.duration}
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Core */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-6">
                      {course.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-tighter text-primary/70 border border-primary/20 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-8 flex-grow">
                      {course.desc}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        Live Batch
                      </div>
                      <Link to="/courses" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground group/link">
                        Curriculum
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Master CTA */}
        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/courses">
            <Button className="h-16 px-12 rounded-2xl button-premium font-black uppercase tracking-widest group">
              Explore All Intelligence
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 hover:border-primary/50 text-foreground font-black uppercase tracking-widest">
              Request Trial Session
            </Button>
          </Link>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground mt-16">
          Every program includes career mentorship & high-impact portfolio projects
        </p>
      </div>
    </section>
  );
}