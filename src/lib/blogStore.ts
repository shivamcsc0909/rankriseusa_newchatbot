import { BlogPost, BlogPostStatus, BlogCategory, BlogTag } from '@/types/blog';

const LOCAL_POSTS_KEY = 'rankrise_local_blog_posts';

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

/** Unwrap API envelope `{ ok: true, data: T }` used by RankRise PHP Response::ok(). */
function unwrapApiData<T = unknown>(json: unknown): T | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as { ok?: boolean; data?: T; posts?: unknown; post?: unknown };
  if (obj.ok === true && obj.data !== undefined) {
    return obj.data as T;
  }
  // Legacy / accidental plain payloads
  return json as T;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-neural-architectures-2024',
    slug: 'neural-architectures-future-of-seo-2024',
    title: 'Neural Architectures: The Future of SEO in 2024',
    excerpt: 'How AI-driven search intent and deep neural embeddings are redefining the hierarchy of digital visibility.',
    content: `
      <h2>The Shift to Neural Search & Intent Vectors</h2>
      <p>Search engine optimization has crossed an inflection point. Traditional keyword density and backlink volume metrics are no longer sufficient to dominate high-value search queries. Deep learning models—such as Google's Gemini, RankBrain, and MUM—process user queries by mapping semantic intent vectors in multi-dimensional space.</p>
      
      <div class="glass-card p-6 rounded-2xl border-primary/20 my-8">
        <h3 class="text-primary font-bold text-lg mb-2">Key Takeaway</h3>
        <p class="text-muted-foreground text-sm">To rank in 2024 and beyond, content must be structured around complete topic authority rather than isolated target phrases.</p>
      </div>

      <h2>3 Pillars of Neural Search Optimization</h2>
      <ul>
        <li><strong>Semantic Entity Mapping:</strong> Structuring page schemas, JSON-LD graphs, and contextual links to establish undeniable entity relationships.</li>
        <li><strong>User Engagement Velocity:</strong> Optimizing layout, interactive conversion mechanics, and page load speeds to maximize session duration and reduce drop-off.</li>
        <li><strong>AI Model Readability:</strong> Formatting technical content so LLM crawlers can easily ingest, cite, and recommend your domain in generative responses.</li>
      </ul>

      <h2>Executing a Neural Content Strategy</h2>
      <p>By shifting from legacy keyword targeting to comprehensive entity-based content clusters, RankRise clients have achieved up to 340% increases in non-brand organic traffic within 90 days. The key lies in creating authoritative, deeply researched intelligence hubs that fulfill complex intent pathways.</p>
    `,
    category: 'Intelligence',
    tags: ['AI', 'SEO Strategy', 'Neural Search', 'Growth'],
    featured_image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    seo_title: 'Neural Architectures: The Future of SEO in 2024 | RankRise USA',
    seo_description: 'Discover how AI-driven search intent and neural embeddings redefine organic ranking hierarchies in 2024.',
    canonical_url: 'https://rankriseusa.com/blog/neural-architectures-future-of-seo-2024',
    og_title: 'Neural Architectures: The Future of SEO in 2024',
    og_description: 'Deep dive into AI-driven search intent vectors and neural embeddings redefining digital visibility.',
    og_image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    twitter_card: 'summary_large_image',
    twitter_title: 'Neural Architectures: The Future of SEO in 2024',
    twitter_description: 'Discover how neural search models map semantic intent vectors to redefine organic rankings.',
    twitter_image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    reading_time: '5 min read',
    author_name: 'Sarah Chen',
    author_title: 'Head of Neural Search Strategy',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    status: 'published',
    scheduled_at: null,
    views: 2450,
    created_at: '2024-03-15T09:00:00.000Z',
    updated_at: '2024-03-15T09:00:00.000Z',
  },
  {
    id: 'post-hyper-growth-systems',
    slug: 'hyper-growth-systems-for-scaleups',
    title: 'Hyper-Growth Systems for Scale-ups',
    excerpt: 'The exact frameworks used by unicorn startups to automate customer acquisition and scale ARR rapidly.',
    content: `
      <h2>Designing Predictable Acquisition Engines</h2>
      <p>Scaling a digital enterprise beyond $10M ARR requires moving away from fragmented tactics and establishing an interconnected growth operating system. When acquisition channels operate in isolation, customer acquisition costs (CAC) inevitably balloon.</p>

      <h2>The Scale-up Growth Architecture</h2>
      <p>High-growth scale-ups leverage unified funnel optimization that aligns search intent, paid acquisition, and behavioral micro-conversions:</p>

      <ol>
        <li><strong>High-Intent Search Capture:</strong> Dominating commercial query clusters before competitors enter the bidding space.</li>
        <li><strong>Behavioral Personalization:</strong> Adapting page headlines, dynamic social proof, and pricing calculators in real time based on referral context.</li>
        <li><strong>Automated Nurture Loops:</strong> Retargeting visitors with hyper-specific executive insights rather than generic ad fatigue.</li>
      </ol>

      <p>Implementing these automated acquisition mechanics delivers exponential returns while maintaining strict unit economics.</p>
    `,
    category: 'Systems',
    tags: ['Scaleups', 'Acquisition', 'Growth', 'Automation'],
    featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    seo_title: 'Hyper-Growth Systems for Scale-ups | RankRise USA',
    seo_description: 'Learn the exact customer acquisition frameworks unicorn scale-ups rely on to achieve rapid revenue growth.',
    canonical_url: 'https://rankriseusa.com/blog/hyper-growth-systems-for-scaleups',
    og_title: 'Hyper-Growth Systems for Scale-ups',
    og_description: 'Proven acquisition engines and automation frameworks for rapid enterprise scaling.',
    og_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    twitter_card: 'summary_large_image',
    twitter_title: 'Hyper-Growth Systems for Scale-ups',
    twitter_description: 'Unicorn growth tactics and automated customer acquisition frameworks.',
    twitter_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    reading_time: '7 min read',
    author_name: 'Emily Watson',
    author_title: 'Enterprise Growth Lead',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    status: 'published',
    scheduled_at: null,
    views: 3820,
    created_at: '2024-03-12T11:30:00.000Z',
    updated_at: '2024-03-12T11:30:00.000Z',
  },
  {
    id: 'post-conversion-mechanics-ux',
    slug: 'conversion-mechanics-ux-psychology',
    title: 'Conversion Mechanics: UX Psychology',
    excerpt: 'Deep dive into the cognitive triggers and UI visual dynamics that drive high-ticket enterprise conversions.',
    content: `
      <h2>The Science of High-Ticket Decision Making</h2>
      <p>B2B enterprise buyers do not convert based on standard landing page templates. Enterprise purchasing decisions involve risk aversion, social validation within executive leadership, and clear ROI justification.</p>

      <h2>Cognitive Frameworks for Conversion UX</h2>
      <p>By structuring landing interfaces around cognitive psychology principles, brands eliminate friction at critical decision points:</p>
      
      <ul>
        <li><strong>Glassmorphic Visual Hierarchy:</strong> Using dark cinematic translucency and high-contrast gold accents to communicate premium brand authority.</li>
        <li><strong>Progressive Form Disclosure:</strong> Reducing initial field friction while gathering high-intent qualification metrics step-by-step.</li>
        <li><strong>Verifiable Ecosystem Proof:</strong> Displaying partner accreditations (Google Partner, AWS, Clutch) prominently alongside real-time metrics.</li>
      </ul>
    `,
    category: 'Mechanics',
    tags: ['UX', 'Conversion', 'Psychology', 'Design'],
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    seo_title: 'Conversion Mechanics: UX Psychology | RankRise USA',
    seo_description: 'Master the cognitive triggers and high-ticket conversion UI frameworks that convert enterprise buyers.',
    canonical_url: 'https://rankriseusa.com/blog/conversion-mechanics-ux-psychology',
    og_title: 'Conversion Mechanics: UX Psychology',
    og_description: 'Cognitive triggers and UI visual dynamics engineered for high-ticket enterprise conversions.',
    og_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    twitter_card: 'summary_large_image',
    twitter_title: 'Conversion Mechanics: UX Psychology',
    twitter_description: 'The cognitive psychology of high-ticket B2B enterprise conversions.',
    twitter_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    reading_time: '6 min read',
    author_name: 'Marcus Johnson',
    author_title: 'Director of Conversion Design',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    status: 'published',
    scheduled_at: null,
    views: 4210,
    created_at: '2024-03-10T14:15:00.000Z',
    updated_at: '2024-03-10T14:15:00.000Z',
  },
  {
    id: 'post-enterprise-seo-audit',
    slug: 'enterprise-technical-seo-audit-framework',
    title: 'Enterprise Technical SEO Audit Framework',
    excerpt: 'A comprehensive checklist to identify crawl budget leaks, JavaScript hydration issues, and schema indexation gaps.',
    content: `
      <h2>Eliminating Crawl & Rendering Bottlenecks</h2>
      <p>Large-scale websites with thousands of URLs frequently suffer from wasted crawl budget, unindexed client-rendered pages, and missing structured data schemas. A systematic audit uncovers these systemic bottlenecks.</p>

      <h2>Core Pillars of the Enterprise Audit</h2>
      <ul>
        <li><strong>Server-Side & Hydration Performance:</strong> Ensuring search bots receive pre-rendered HTML with full meta tags and structured schema before hydration.</li>
        <li><strong>XML Sitemap Index Architecture:</strong> Splitting pages, blogs, and services into dedicated sitemaps linked in robots.txt.</li>
        <li><strong>LLM & AI Crawler Compliance:</strong> Providing valid llms.txt files that guide automated AI agents to core landing pages and RSS feeds.</li>
      </ul>
    `,
    category: 'Intelligence',
    tags: ['SEO Audit', 'Technical SEO', 'Schema', 'Sitemap'],
    featured_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    seo_title: 'Enterprise Technical SEO Audit Framework | RankRise USA',
    seo_description: 'Comprehensive enterprise technical SEO audit guide covering crawl budgets, hydration, and schema compliance.',
    canonical_url: 'https://rankriseusa.com/blog/enterprise-technical-seo-audit-framework',
    og_title: 'Enterprise Technical SEO Audit Framework',
    og_description: 'Audit checklist for crawl budgets, JS hydration, and schema indexation.',
    og_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    twitter_card: 'summary_large_image',
    twitter_title: 'Enterprise Technical SEO Audit Framework',
    twitter_description: 'Comprehensive guide to enterprise crawl budgets, JS hydration, and sitemap architecture.',
    twitter_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    reading_time: '8 min read',
    author_name: 'Sarah Chen',
    author_title: 'Head of Neural Search Strategy',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    status: 'published',
    scheduled_at: null,
    views: 1950,
    created_at: '2024-03-05T08:45:00.000Z',
    updated_at: '2024-03-05T08:45:00.000Z',
  }
];

export function getLocalPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(INITIAL_BLOG_POSTS));
      return INITIAL_BLOG_POSTS;
    }
    const posts: BlogPost[] = JSON.parse(raw);
    return posts.length > 0 ? posts : INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

export function saveLocalPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts to localStorage:', e);
  }
}

export async function fetchBlogPosts(includeDrafts = false, adminKey?: string): Promise<BlogPost[]> {
  try {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (includeDrafts && adminKey) headers['X-Admin-Key'] = adminKey;
    const res = await fetch(
      `/api/index.php/v1/blog${includeDrafts ? '?includeDrafts=true' : ''}`,
      { headers, cache: 'no-store' }
    );
    if (res.ok) {
      const json = await res.json();
      const data = unwrapApiData<{ posts?: BlogPost[]; count?: number }>(json);
      const posts = Array.isArray(data?.posts)
        ? data.posts
        : Array.isArray((json as { posts?: BlogPost[] }).posts)
          ? (json as { posts: BlogPost[] }).posts
          : null;
      if (posts) {
        saveLocalPosts(posts);
        return posts;
      }
    }
  } catch {
    // API offline, fallback to local posts
  }

  const posts = getLocalPosts();
  if (!includeDrafts) {
    const now = new Date().toISOString();
    return posts.filter(p => {
      if (p.status === 'published') return true;
      if (p.status === 'scheduled' && p.scheduled_at && p.scheduled_at <= now) return true;
      return false;
    });
  }
  return posts;
}

export async function fetchPopularPosts(limit = 6): Promise<BlogPost[]> {
  try {
    const res = await fetch(`/api/index.php/v1/blog/popular?limit=${limit}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const data = unwrapApiData<{ posts?: BlogPost[] }>(json);
      if (Array.isArray(data?.posts)) return data.posts;
    }
  } catch {
    // fallback
  }
  const posts = await fetchBlogPosts(false);
  return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
}

export async function fetchBlogPostBySlug(slug: string, opts?: { preview?: boolean; adminKey?: string }): Promise<BlogPost | null> {
  try {
    const q = opts?.preview ? '?preview=1' : '';
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (opts?.preview && opts.adminKey) headers['X-Admin-Key'] = opts.adminKey;
    const res = await fetch(`/api/index.php/v1/blog/slug/${encodeURIComponent(slug)}${q}`, {
      headers,
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      const data = unwrapApiData<{ post?: BlogPost }>(json);
      const post = data?.post ?? (json as { post?: BlogPost }).post;
      if (post) return post;
    }
    if (res.status === 401 || res.status === 404) {
      // Do not leak drafts via localStorage when API explicitly denies/misses.
      if (opts?.preview && !opts.adminKey) return null;
      if (!opts?.preview) {
        // still allow published local fallback below
      } else {
        return null;
      }
    }
  } catch {
    // API offline
  }

  const posts = getLocalPosts();
  const found = posts.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  if (!found) return null;
  if (opts?.preview) {
    // Offline preview requires an admin key in session.
    if (!opts.adminKey) return null;
    return found;
  }
  if (found.status === 'draft') return null;
  if (found.status === 'scheduled') {
    const now = new Date().toISOString();
    if (!found.scheduled_at || found.scheduled_at > now) return null;
  }
  return found;
}

export async function saveBlogPost(
  postData: Partial<BlogPost>,
  adminKey?: string
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  // Validate basic required fields
  if (!postData.title?.trim()) {
    return { success: false, error: 'Blog post title is required.' };
  }

  const title = postData.title.trim();
  const slug = postData.slug?.trim() || generateSlug(title);
  const content = postData.content?.trim() || '';
  const excerpt = postData.excerpt?.trim() || content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
  const category = postData.category?.trim() || 'Intelligence';
  const tags = Array.isArray(postData.tags) ? postData.tags.map(t => t.trim()).filter(Boolean) : ['Growth'];
  const readingTime = postData.reading_time || calculateReadingTime(content);
  const status: BlogPostStatus =
    postData.status === 'draft' || postData.status === 'published' || postData.status === 'scheduled'
      ? postData.status
      : 'draft';

  const posts = getLocalPosts();
  const existingIdx = posts.findIndex(p => p.id === postData.id || p.slug === slug);

  const now = new Date().toISOString();
  const postToSave: BlogPost = {
    id: postData.id || 'post_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    slug,
    title,
    excerpt,
    content,
    category,
    tags,
    featured_image: postData.featured_image || 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    gallery: Array.isArray(postData.gallery) ? postData.gallery.filter(Boolean) : [],
    seo_title: postData.seo_title || `${title} | RankRise USA`,
    seo_description: postData.seo_description || excerpt,
    canonical_url: postData.canonical_url || `https://rankriseusa.com/blog/${slug}`,
    og_title: postData.og_title || title,
    og_description: postData.og_description || excerpt,
    og_image: postData.og_image || postData.featured_image || 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    twitter_card: postData.twitter_card || 'summary_large_image',
    twitter_title: postData.twitter_title || title,
    twitter_description: postData.twitter_description || excerpt,
    twitter_image: postData.twitter_image || postData.featured_image || 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
    json_ld: postData.json_ld || '',
    reading_time: readingTime,
    author_name: postData.author_name || 'RankRise Intelligence',
    author_title: postData.author_title || 'Growth Strategist',
    author_avatar: postData.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    status,
    scheduled_at: postData.scheduled_at || null,
    views: postData.views || 0,
    created_at: existingIdx >= 0 ? posts[existingIdx].created_at : now,
    updated_at: now,
  };

  // Sync to API backend first when admin key is present (production source of truth).
  if (adminKey) {
    try {
      const res = await fetch('/api/index.php/v1/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Admin-Key': adminKey,
        },
        body: JSON.stringify(postToSave),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json as { ok?: boolean }).ok === false) {
        const msg =
          (json as { error?: { message?: string } })?.error?.message ||
          `Failed to save blog post (${res.status})`;
        return { success: false, error: msg };
      }
      const data = unwrapApiData<{ post?: BlogPost; success?: boolean }>(json);
      const post = data?.post ?? (json as { post?: BlogPost }).post ?? postToSave;
      // Mirror success locally for offline preview
      const next = getLocalPosts();
      const idx = next.findIndex(p => p.id === post.id || p.slug === post.slug);
      if (idx >= 0) next[idx] = post;
      else next.unshift(post);
      saveLocalPosts(next);
      return { success: true, post };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Network error while saving blog post.',
      };
    }
  }

  // Offline / no admin key: local only
  if (existingIdx >= 0) {
    posts[existingIdx] = postToSave;
  } else {
    posts.unshift(postToSave);
  }
  saveLocalPosts(posts);

  return { success: true, post: postToSave };
}

export async function deleteBlogPost(id: string, adminKey?: string): Promise<{ success: boolean; error?: string }> {
  if (adminKey) {
    try {
      const res = await fetch(`/api/index.php/v1/admin/blog/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey, Accept: 'application/json' },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        return {
          success: false,
          error:
            (json as { error?: { message?: string } })?.error?.message ||
            `Failed to delete blog post (${res.status})`,
        };
      }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Network error while deleting blog post.',
      };
    }
  }

  const posts = getLocalPosts().filter(p => p.id !== id);
  saveLocalPosts(posts);
  return { success: true };
}

export function extractCategories(posts: BlogPost[]): BlogCategory[] {
  const counts: Record<string, number> = {};
  posts.forEach(p => {
    if (p.category) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, count], i) => ({
    id: `cat_${i}`,
    name,
    slug: generateSlug(name),
    count,
  }));
}

export function extractTags(posts: BlogPost[]): BlogTag[] {
  const counts: Record<string, number> = {};
  posts.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    }
  });

  return Object.entries(counts).map(([name, count], i) => ({
    id: `tag_${i}`,
    name,
    slug: generateSlug(name),
    count,
  }));
}
