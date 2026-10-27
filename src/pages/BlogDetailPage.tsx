import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/blogStore';
import { sanitizeHtml } from '@/lib/sanitizer';
import BlogSeo from '@/components/blog/BlogSeo';
import BlogBreadcrumbs from '@/components/blog/BlogBreadcrumbs';
import BlogShareButtons from '@/components/blog/BlogShareButtons';
import RelatedBlogs from '@/components/blog/RelatedBlogs';
import CommentSection from '@/components/community/CommentSection';
import BlogReviewWidget from '@/components/blog/BlogReviewWidget';
import AuthModal from '@/components/auth/AuthModal';
import { SkeletonBlogDetail } from '@/components/ui/SkeletonModel';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const isPreview = searchParams.get('preview') === '1';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      if (!slug) return;

      const previewKey =
        isPreview
          ? sessionStorage.getItem('rankrise-blog-preview-key') ||
            sessionStorage.getItem('rankrise-admin-key') ||
            undefined
          : undefined;

      const found = await fetchBlogPostBySlug(slug, {
        preview: isPreview,
        adminKey: previewKey,
      });
      const posts = await fetchBlogPosts();

      if (isMounted) {
        setPost(found);
        setAllPosts(posts);
        setLoading(false);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, isPreview]);

  if (loading) {
    return <SkeletonBlogDetail />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-24 container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto glass-card p-12 rounded-3xl border-white/10">
          <h2 className="text-3xl font-black text-foreground mb-4">Article Not Found</h2>
          <p className="text-muted-foreground text-sm mb-8">
            The requested intelligence publication does not exist or has been archived.
          </p>
          <Button onClick={() => navigate('/blog')} className="button-premium px-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence Hub
          </Button>
        </div>
      </div>
    );
  }

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href.split('?')[0] : `https://rankriseusa.com/blog/${post.slug}`;
  const gallery = Array.isArray(post.gallery) ? post.gallery.filter(Boolean) : [];
  const safeContent = sanitizeHtml(post.content || '');

  return (
    <div className="pt-32 pb-24 relative overflow-hidden bg-background">
      <BlogSeo post={post} />

      {isPreview && post.status !== 'published' && (
        <div className="fixed top-20 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-black uppercase tracking-widest">
            Preview · {post.status}
          </div>
        </div>
      )}

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full" />
      </div>

      <article className="container mx-auto px-4 lg:px-8 relative z-10 max-w-5xl">
        <BlogBreadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` },
            { label: post.title },
          ]}
        />

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {post.reading_time}
              </span>
              {typeof post.views === 'number' && post.views > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    {post.views.toLocaleString()} views
                  </span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between p-6 rounded-2xl glass-card border-white/10">
            <div className="flex items-center gap-4">
              {post.author_avatar ? (
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-xl">
                  {post.author_name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-base font-black text-foreground flex items-center gap-2">
                  {post.author_name}
                </div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest">
                  {post.author_title || 'Growth Strategist'}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/blog')}
              className="hidden sm:flex border-white/10 hover:border-primary/40 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> All Articles
            </Button>
          </div>
        </header>

        {post.featured_image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-14 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative max-h-[500px]"
          >
            <img
              src={post.featured_image}
              alt={`${post.title} - Featured Image`}
              title={post.title}
              width={1200}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <BlogShareButtons title={post.title} url={currentUrl} />

        <div
          className="prose prose-invert max-w-none my-12 text-muted-foreground font-medium text-lg leading-relaxed
            prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-primary
            prose-p:mb-6
            prose-strong:text-foreground prose-strong:font-black
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3 prose-ul:mb-8
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-3 prose-ol:mb-8
            prose-li:text-muted-foreground
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/90 prose-blockquote:my-8
          "
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {gallery.length > 0 && (
          <section className="my-14">
            <h2 className="text-2xl font-black text-foreground mb-6">Gallery</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="rounded-2xl overflow-hidden border border-white/10 aspect-video"
                >
                  <img
                    src={src}
                    alt={`${post.title} gallery ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 my-10 pt-8 border-t border-white/10">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mr-2">
              <Tag className="w-3.5 h-3.5 text-primary" /> Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 text-xs font-bold text-muted-foreground hover:text-primary transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <BlogShareButtons title={post.title} url={currentUrl} />

        <RelatedBlogs currentPost={post} allPosts={allPosts} />

        {/* 🌟 1-5 Star Ratings & Community Reviews */}
        <BlogReviewWidget
          blogSlug={post.slug}
          onRequireAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Community Discussion & Replies */}
        <div className="mt-14">
          <CommentSection
            targetType="blog"
            targetId={post.slug}
            title={`Discussion: ${post.title}`}
          />
        </div>
      </article>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
