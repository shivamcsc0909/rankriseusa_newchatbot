import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Sparkles, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from '@/components/community/CommentSection';
import { BlogPost } from '@/types/blog';
import { fetchBlogPosts } from '@/lib/blogStore';

export default function Blog() {
  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchBlogPosts().then((posts) => {
      if (mounted) setArticles(posts.slice(0, 3));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const partners = [
    { name: 'Google Partner', type: 'certified' },
    { name: 'HubSpot', type: 'diamond' },
    { name: 'Clutch', type: 'top-rated' },
    { name: 'Trustpilot', type: 'verified' },
    { name: 'AWS', type: 'partner' },
    { name: 'Stripe', type: 'solutions' },
  ];

  return (
    <section id="blog" className="bg-background relative overflow-hidden">
      {/* Partner Gallery */}
      <div className="py-24 border-b border-white/5 bg-[#05070a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-12"
          >
            Verified ecosystem partners
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-40 hover:opacity-100 transition-opacity">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-pointer"
              >
                <div className="h-8 w-auto bg-foreground/10 px-4 py-1 rounded-lg flex items-center justify-center border border-white/5">
                  <span className="text-foreground font-black tracking-tighter text-sm italic">{partner.name}</span>
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">{partner.type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Blog Content */}
      <div className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-black uppercase tracking-widest">Intelligence Hub</span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black text-foreground leading-[0.9]">
                Deep <br />
                <span className="text-gradient-gold italic">Insights.</span>
              </h2>
            </div>

            <Button asChild variant="outline" className="h-16 px-10 rounded-2xl border-white/10 hover:border-primary/50 text-foreground group">
              <Link to="/blog">
                Explore All Intelligence
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <motion.article
                key={article.id}
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${article.slug}`}>
                  <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 group-hover:border-primary/30 transition-all h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={article.featured_image}
                        alt={`${article.title} - ${article.category} Article by RankRise USA`}
                        title={article.title}
                        width={800}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                      <div className="absolute top-6 left-6 px-4 py-2 rounded-xl glass-card border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-primary" />
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-primary" />
                          {article.reading_time}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-8 flex-grow">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs">
                            {article.author_name.charAt(0)}
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-foreground">
                            {article.author_name}
                          </span>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-primary transition-all ${
                            hoveredArticle === article.id
                              ? 'bg-primary text-background'
                              : 'bg-white/5'
                          }`}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Exclusive Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32"
          >
            <div className="glass-card rounded-[3.5rem] p-12 lg:p-24 border-primary/20 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-12">
                  <Mail className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                  Intelligence <br />
                  <span className="text-gradient-gold italic">Direct to Inbox.</span>
                </h3>

                <p className="text-xl text-muted-foreground font-bold mb-12">
                  Join 10,000+ industry leaders receiving high-performance growth tactics every Tuesday.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <div className="flex-1 relative group">
                    <input
                      type="email"
                      placeholder="Enter professional email"
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <Button className="h-16 px-12 rounded-2xl button-premium font-black uppercase tracking-widest">
                    Get Access
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  {['No Spam', 'Weekly Insights', 'Founder Network'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      <CheckCircle2 className="w-3 h-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <CommentSection targetType="blog" targetId="intelligence-hub" title="Executive Intelligence Discussion" />
        </div>
      </div>
    </section>
  );
}
