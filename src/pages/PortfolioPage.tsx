import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Zap,
  Sparkles,
  Target
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Seo from '@/components/seo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MarketingBranding from '@/components/MarketingBranding';

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Web Design', 'Marketing & Branding', 'Video'];

  const projects = [
    {
      id: 1,
      title: 'Attention Seeker 3D Portfolio',
      category: 'Web Design',
      tag: 'Portfolio',
      // image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Attention-Seeker-3D-Portfolio.webp',
      description: 'Immersive 3D portfolio experience with bold motion, modern layout, and a high-impact first impression.',
      link: 'https://attention-seeker-portfolio.vercel.app/'
    },
    {
      id: 2,
      title: 'Digital Mark Seven',
      category: 'Web Design',
      tag: 'Agency',
      // image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Digital-Mark-Seven.webp',
      description: 'Clean digital agency website built to present services, build trust, and convert visitors into inquiries.',
      link: 'https://digital-mark-seven.vercel.app/'
    },
    {
      id: 3,
      title: 'DJ Intro',
      category: 'Video',
      tag: 'Web App',
      // image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Dj-Intro.webp',
      description: 'Stylish intro site with music-forward visuals and an energetic presentation for a DJ brand.',
      link: 'https://dj-intro.netlify.app/'
    },
    {
      id: 4,
      title: 'GasXpert',
      category: 'Marketing & Branding',
      tag: 'Gas Service',
      // image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/GasXpert.webp',
      description: 'Modern gas service platform with booking flow, customer support, and a clean service-first UI.',
      link: 'https://gasxpert.in/'
    },
    {
      id: 5,
      title: 'Headphones Only',
      category: 'Web Design',
      tag: 'E-Commerce',
      // image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Headphones-Only.webp',
      description: 'Premium headphone storefront with a product-focused layout and conversion-friendly shopping experience.',
      link: 'https://headphonesonly.netlify.app/'
    },
    {
      id: 6,
      title: 'Lava Flameflow Animation',
      category: 'Video',
      tag: 'Web App',
      // image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Lava-Flameflow-Animation.webp',
      description: 'Experimental animated landing page with dramatic visuals and smooth motion-driven storytelling.',
      link: 'https://lava-flameflow-animation.netlify.app/'
    },
    {
      id: 7,
      title: 'Live Animation Login Form',
      category: 'Web Design',
      tag: 'Web App',
      // image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Live-Animation-Login-Form.webp',
      description: 'Interactive login page with animated polish, designed for a modern and premium user experience.',
      link: 'https://live-animation-login-page.netlify.app/'
    },
    {
      id: 8,
      title: 'Mohan Residency',
      category: 'Web Design',
      tag: 'Real Estate',
      // image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Mohan-Residency.webp',
      description: 'Real estate website crafted for property showcase, lead generation, and strong visual presentation.',
      link: 'https://real-estate-mohan-residency.vercel.app/'
    },
    {
      id: 9,
      title: 'My First CRM',
      category: 'Video',
      tag: 'CRM',
      // image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/My-First-CRM.webp',
      description: 'A full-featured CRM web application with lead pipeline management, client contact tracking, task assignments, and an intuitive dashboard.',
      link: 'https://my-first-crm.vercel.app/'
    },
    {
      id: 10,
      title: 'RankRise USA',
      category: 'Marketing & Branding',
      tag: 'Agency',
      // image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/RankRise-USA.webp',
      description: 'Performance marketing and SEO-style agency site with a professional, trust-building presentation.',
      link: 'https://rankriseusa.com/'
    },
    {
      id: 11,
      title: 'Shivam Portfolio Pandey',
      category: 'Web Design',
      tag: 'Portfolio',
      // image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Shivam-Portfolio-Pandey.webp',
      description: 'Personal portfolio with a clean structure, strong personal branding, and project showcase sections.',
      link: 'https://shivam-portfolio-pandey.netlify.app/'
    },
    {
      id: 12,
      title: 'Shopping Appa',
      category: 'Web Design',
      tag: 'E-Commerce',
      // image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Shopping-Appa.webp',
      description: 'Responsive shopping experience with product discovery, browsing flow, and easy-to-scan UI.',
      link: 'https://shoppingappa.netlify.app/'
    },
    {
      id: 13,
      title: 'Smart Gadget Shop',
      category: 'Web Design',
      tag: 'Electronics',
      // image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Smart-Gadget-Shop.webp',
      description: 'Gadget store layout built to highlight products, categories, and a modern tech-store feel.',
      link: 'https://smartgadgetshop.netlify.app/'
    },
    {
      id: 14,
      title: 'Villa Options',
      category: 'Web Design',
      tag: 'Real Estate',
      // image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Villa-Options.webp',
      description: 'Luxury villa presentation website with premium aesthetics and property-oriented content sections.',
      link: 'https://villaoptions.netlify.app/'
    },
    {
      id: 15,
      title: 'YesGasService',
      category: 'Marketing & Branding',
      tag: 'Gas Service',
      // image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/YesGasService.webp',
      description: 'Gas service platform designed for quick bookings, service trust, and mobile-friendly access.',
      link: 'https://yesgasservice.in/'
    },
    {
      id: 16,
      title: 'Ghar Ka Market',
      category: 'Web Design',
      tag: 'E-Commerce',
      // image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Ghar-Ka-Market.webp',
      description: 'Hyperlocal marketplace concept built for local buying and selling with a simple commerce flow.',
      link: 'https://gharkamarket.in/'
    },
    {
      id: 17,
      title: 'Rajasthani Royal Luxury',
      category: 'Web Design',
      tag: 'Restaurant',
      // image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Rajasthani-Royal-Luxury.webp',
      description: 'Premium restaurant website showcasing luxury dining experience, menu, and ambiance.',
      link: 'https://rajasthani-royal-luxury-website-raj.vercel.app/'
    },
    {
      id: 18,
      title: 'RankRise USA Redesign',
      category: 'Marketing & Branding',
      tag: 'IT & Digital Marketing',
      // image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/RankRise-USA-Redesign.webp',
      description: 'Redesigned IT and digital marketing agency website with modern aesthetics and performance focus.',
      link: 'https://rankriseusa-redesgin.vercel.app/'
    },
    {
      id: 19,
      title: 'Shivraj Hotel',
      category: 'Web Design',
      tag: 'Hotel',
      // image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Shivraj-Hotel.webp',
      description: 'Hotel booking and showcase website highlighting rooms, amenities, and hospitality.',
      link: 'https://shivrajhotel.vercel.app/'
    },
    {
      id: 20,
      title: 'Modern School Website',
      category: 'Web Design',
      tag: 'Education',
      image: '/assets/images/morden-school-website.webp',
      description: 'Comprehensive school website for students and parents featuring academic programs and admissions.',
      link: 'https://school-website-8hti.vercel.app/'
    },
    {
      id: 21,
      title: 'TechForex',
      category: 'Web Design',
      tag: 'Finance',
      // image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/TechForex.webp',
      description: 'Professional forex trading platform website with financial tools and market insights.',
      link: 'https://techforex.in/'
    },
    {
      id: 22,
      title: 'DNA Repcom Lab',
      category: 'Web Design',
      tag: 'Healthcare',
      // image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/DNA-Repcom-Lab.webp',
      description: 'Specialized cancer research institute website detailing facilities, research, and patient care.',
      link: 'https://dna-repcom-lab.vercel.app/'
    },
    {
      id: 23,
      title: 'Mero Vrindavan Dham',
      category: 'Web Design',
      tag: 'Real Estate',
      // image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Mero-Vrindavan-Dham.webp',
      description: 'Real estate platform for premium plots and properties in the sacred city of Vrindavan.',
      link: 'https://merovrindavandham.vercel.app/'
    },
    {
      id: 24,
      title: 'Bella Decor Art Gallery',
      category: 'Web Design',
      tag: 'Art & Design',
      image: '/assets/images/bella-decor.webp',
      description: 'Elegant art gallery website showcasing collections, exhibitions, and artists.',
      link: 'https://bella-decor-bella-decor.vercel.app/'
    },
    {
      id: 25,
      title: 'Gas & Chimney Care',
      category: 'Web Design',
      tag: 'Home Services',
      // image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      image: '/assets/images/Gas-&-Chimney-Care.webp',
      description: 'Reliable gas and chimney maintenance service website with booking integration.',
      link: 'https://gaschimneycare-testing.netlify.app/'
    }
  ];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#05070a] min-h-screen neural-grid pb-20 relative overflow-hidden text-foreground">
      <Seo
        title="Portfolio | Featured Work & Case Studies | RankRise USA"
        description="Explore RankRise USA's proven portfolio: high-converting web applications, custom software engineering, SEO case studies, and brand campaigns."
        canonical="https://rankriseusa.com/portfolio"
        keywords={[
          "rankrise portfolio",
          "web design case studies",
          "seo client results",
          "custom software projects",
          "digital marketing portfolio"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Portfolio", item: "https://rankriseusa.com/portfolio" }
        ]}
      />
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* pf-header */}
        <header className="pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            Our Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight break-words"
          >
            Client Success &amp; <span className="text-gradient-gold italic">Digital Case Studies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Explore high-performance websites, custom web applications, branding, and conversion-optimized digital marketing campaigns delivered for growing US brands.
          </motion.p>
        </header>

        {/* pf-search-wrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12 relative group"
        >
          <input
            type="search"
            placeholder="Search by title, tag, or description"
            className="w-full h-20 pl-16 pr-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white text-lg placeholder:text-white/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-6 h-6 group-focus-within:text-primary transition-colors" />
        </motion.div>

        {/* pf-filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-500 border ${activeCategory === cat
                ? 'bg-primary border-primary text-background shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-primary/50 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* pf-grid */}
        <section className="pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card-premium group rounded-md overflow-hidden flex flex-col h-full"
                >
                  {/* pf-media */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={`${project.title} - ${project.category} Client Project Showcase`}
                      title={project.title}
                      width={800}
                      height={500}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent opacity-80" />

                    {/* pf-overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-[2px]">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-background px-8 py-4 rounded-full flex items-center gap-3 font-black text-sm shadow-[0_0_40px_rgba(250,204,21,0.4)] scale-75 group-hover:scale-100 transition-all duration-500"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                        Live Demo
                      </a>
                    </div>
                  </div>

                  {/* pf-content */}
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                        {project.tag}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-white/40 text-sm mb-10 leading-relaxed font-bold flex-1 line-clamp-3">
                      {project.description}
                    </p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.3em] group/link"
                    >
                      View Project
                      <ArrowRight className="w-5 h-5 group-hover/link:translate-x-3 transition-transform" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Start Project CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-40 text-center"
          >
            <div className="flex justify-center w-full px-4 sm:px-0">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button className="h-16 sm:h-20 lg:h-24 w-full sm:w-auto px-6 sm:px-12 lg:px-20 rounded-[2rem] sm:rounded-full button-premium font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm lg:text-lg flex items-center justify-center gap-3 sm:gap-5 mx-auto group">
                  Start Protocol Sync
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:translate-x-2 sm:group-hover:translate-x-4 transition-transform" />
                </Button>
              </Link>
            </div>
            <h2 className="mt-12 text-white/30 font-black uppercase tracking-[0.4em] text-xs">
              Ascend to digital dominance today.
            </h2>
          </motion.div>
        </section>
        {/* <MarketingBranding /> */}
      </div>
    </div>
  );
}