import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Tag,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  CheckCircle2,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { fetchBlogPosts, fetchPopularPosts, extractCategories, extractTags } from '@/lib/blogStore';
import BlogSeo from '@/components/blog/BlogSeo';
import CommentSection from '@/components/community/CommentSection';
import { SkeletonBlogList } from '@/components/ui/SkeletonModel';
import WriteBlogModal from '@/components/blog/WriteBlogModal';
import AuthModal from '@/components/auth/AuthModal';
import { getStoredProfile } from '@/lib/communityStore';
import { PenSquare } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [popular, setPopular] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States from Query Parameters or State
  const search = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedTag = searchParams.get('tag') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [data, popularPosts] = await Promise.all([
        fetchBlogPosts(),
        fetchPopularPosts(4),
      ]);
      if (isMounted) {
        setPosts(data);
        setPopular(popularPosts);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const extracted = extractCategories(posts);
    return [{ id: 'cat_all', name: 'All', slug: 'all', count: posts.length }, ...extracted];
  }, [posts]);

  const tags = useMemo(() => {
    const extracted = extractTags(posts);
    return [{ id: 'tag_all', name: 'All', slug: 'all' }, ...extracted];
  }, [posts]);

  const latestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  }, [posts]);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const text = `${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')} ${post.author_name}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && post.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'All' && !post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [posts, search, selectedCategory, selectedTag]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (validPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, validPage]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', page.toString());
    setSearchParams(next);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const partners = [
    { name: 'Google Partner', type: 'certified' },
    { name: 'HubSpot', type: 'diamond' },
    { name: 'Clutch', type: 'top-rated' },
    { name: 'Trustpilot', type: 'verified' },
    { name: 'AWS', type: 'partner' },
    { name: 'Stripe', type: 'solutions' },
  ];

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-background">
      <BlogSeo title="Intelligence Hub & Blog | RankRise USA" description="Executive intelligence, AI search strategy, and growth mechanics for scaling digital enterprises." />

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Hero Section */}
        <section className="py-20 text-center max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Operational Intel v4.0</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tight">
            AI SEO &amp; Digital Growth <br />
            <span className="text-gradient-gold italic">Intelligence Hub</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Actionable strategies, algorithm updates, and executive breakdowns on AI SEO, Generative Engine Optimization, and digital marketing.
          </p>

          {/* Live Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-primary absolute left-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search intelligence publications, AI SEO, conversion mechanics..."
                value={search}
                onChange={(e) => updateParam('q', e.target.value)}
                className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm shadow-xl"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => updateParam('q', '')}
                  className="absolute right-5 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Action Row: Community Stats & Write Article Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
              <span className="text-xs font-bold text-muted-foreground">
                Showing <span className="text-foreground font-black">{paginatedPosts.length}</span> publications
              </span>
              <Button
                onClick={() => {
                  const prof = getStoredProfile();
                  if (!prof) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsWriteModalOpen(true);
                  }
                }}
                className="button-premium text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-2"
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write an Article
              </Button>
            </div>
          </div>
        </section>

        {/* Verified Ecosystem Partners */}
        <div className="py-12 mb-16 border-y border-white/5 bg-[#05070a] rounded-3xl relative overflow-hidden">
          <div className="container mx-auto px-4">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8">
              Verified ecosystem partners
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-40 hover:opacity-100 transition-opacity">
              {partners.map((partner, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <div className="h-8 w-auto bg-foreground/10 px-4 py-1 rounded-lg flex items-center justify-center border border-white/5">
                    <span className="text-foreground font-black tracking-tighter text-xs italic">{partner.name}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary">{partner.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular + Latest */}
        {!loading && (popular.length > 0 || latestPosts.length > 0) && (
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {popular.length > 0 && (
              <section className="glass-card rounded-3xl border-white/10 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Popular Posts</h2>
                </div>
                <ul className="space-y-4">
                  {popular.map((p) => (
                    <li key={p.id}>
                      <Link to={`/blog/${p.slug}`} className="flex gap-3 group">
                        <img
                          src={p.featured_image}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary line-clamp-2 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
                            {(p.views || 0).toLocaleString()} views · {p.reading_time}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {latestPosts.length > 0 && (
              <section className="glass-card rounded-3xl border-white/10 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Latest Posts</h2>
                </div>
                <ul className="space-y-4">
                  {latestPosts.map((p) => (
                    <li key={p.id}>
                      <Link to={`/blog/${p.slug}`} className="flex gap-3 group">
                        <img
                          src={p.featured_image}
                          alt=""
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary line-clamp-2 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
                            {new Date(p.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* Filter Controls: Categories & Tags */}
        <div className="mb-12 space-y-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2 shrink-0 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-primary" /> Category:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.name)}
                  className={`h-10 px-5 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${
                    active
                      ? 'button-premium shadow-lg'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                  }`}
                >
                  {cat.name} {cat.count !== undefined && <span className="opacity-70 ml-1">({cat.count})</span>}
                </button>
              );
            })}
          </div>

          {/* Tag Badges */}
          {tags.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mr-2 shrink-0 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Tag:
              </span>
              {tags.map((tag) => {
                const active = selectedTag.toLowerCase() === tag.name.toLowerCase();
                return (
                  <button
                    key={tag.id}
                    onClick={() => updateParam('tag', tag.name)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                      active
                        ? 'bg-primary text-background font-black'
                        : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-primary'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="py-6">
            <SkeletonBlogList count={6} />
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="py-24 text-center glass-card rounded-3xl border-white/10 max-w-xl mx-auto p-12">
            <BookOpen className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-foreground mb-2">No Matching Articles</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We couldn't find any intelligence posts matching your active search filters.
            </p>
            <Button
              onClick={() => {
                setSearchParams({});
              }}
              className="button-premium px-8"
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPosts.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer"
              >
                <Link to={`/blog/${article.slug}`}>
                  <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 group-hover:border-primary/30 transition-all h-full flex flex-col">
                    {/* Image Container */}
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

                    {/* Content */}
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

                      <h3 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground font-bold text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          {article.author_avatar ? (
                            <img
                              src={article.author_avatar}
                              alt={article.author_name}
                              width={32}
                              height={32}
                              loading="lazy"
                              decoding="async"
                              className="w-8 h-8 rounded-full object-cover border border-primary/30"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xs">
                              {article.author_name.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs font-black uppercase tracking-widest text-foreground">{article.author_name}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={validPage <= 1}
              onClick={() => setPage(validPage - 1)}
              className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:border-primary/40 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                onClick={() => setPage(p)}
                className={`h-12 w-12 rounded-2xl text-xs font-black ${
                  p === validPage
                    ? 'button-premium'
                    : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              disabled={validPage >= totalPages}
              onClick={() => setPage(validPage + 1)}
              className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:border-primary/40 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Exclusive Access Newsletter Section */}
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

        {/* Community Discussion Section */}
        <div className="mt-20">
          <CommentSection targetType="blog" targetId="intelligence-hub" title="Executive Intelligence Discussion" />
        </div>
      </div>

      <WriteBlogModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmitted={() => {
          fetchBlogPosts().then(setPosts);
        }}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsWriteModalOpen(true);
        }}
      />
    </div>
  );
}
