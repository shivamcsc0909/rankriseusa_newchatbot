import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Globe,
  Share2,
  CheckCircle2,
  X,
  AlertCircle,
  Save,
  Tag,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BlogPost, BlogPostStatus } from '@/types/blog';
import { fetchBlogPosts, saveBlogPost, deleteBlogPost, generateSlug, calculateReadingTime } from '@/lib/blogStore';

interface AdminBlogManagerProps {
  adminKey?: string;
}

export default function AdminBlogManager({ adminKey }: AdminBlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BlogPostStatus | 'all'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'seo' | 'publishing'>('general');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Intelligence',
    tags: [],
    featured_image: '',
    gallery: [],
    seo_title: '',
    seo_description: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    json_ld: '',
    reading_time: '',
    author_name: 'RankRise Intelligence',
    author_title: 'Growth Strategist',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    status: 'published',
    scheduled_at: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function openPreview(slug: string, status?: BlogPostStatus) {
    if (!slug) return;
    const needsPreview = status && status !== 'published';
    if (needsPreview && adminKey) {
      sessionStorage.setItem('rankrise-blog-preview-key', adminKey);
      window.open(`/blog/${slug}?preview=1`, '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(`/blog/${slug}${needsPreview ? '?preview=1' : ''}`, '_blank', 'noopener,noreferrer');
  }

  async function uploadImage(file: File, target: 'featured' | 'gallery' | 'avatar' = 'featured') {
    if (!adminKey) {
      toast.error('Admin key required to upload images.');
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('webp', '1');
      body.append('maxWidth', target === 'avatar' ? '400' : '1920');
      body.append('maxHeight', target === 'avatar' ? '400' : '1920');
      body.append('quality', '82');
      // Center-crop to 16:9 for featured when possible (server applies if GD available)
      if (target === 'featured') {
        // Client sends optional crop; server crops then compresses to WebP
      }
      const res = await fetch('/api/index.php/v1/admin/uploads', {
        method: 'POST',
        headers: { 'X-Admin-Key': adminKey, Accept: 'application/json' },
        body,
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        throw new Error(json?.error?.message || 'Upload failed');
      }
      const url = json?.data?.url as string | undefined;
      if (!url) throw new Error('Upload response missing URL');
      setFormData((prev) => {
        if (target === 'gallery') {
          return { ...prev, gallery: [...(prev.gallery || []), url] };
        }
        if (target === 'avatar') {
          return { ...prev, author_avatar: url };
        }
        return {
          ...prev,
          featured_image: url,
          og_image: prev.og_image || url,
          twitter_image: prev.twitter_image || url,
        };
      });
      toast.success(json?.data?.format === 'webp' ? 'Uploaded & optimized (WebP)' : 'Image uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [adminKey]);

  async function loadPosts() {
    setLoading(true);
    const data = await fetchBlogPosts(true, adminKey);
    setPosts(data);
    setLoading(false);
  }

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Intelligence',
      tags: ['AI', 'SEO Strategy'],
      featured_image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=1200&q=80',
      gallery: [],
      seo_title: '',
      seo_description: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_card: 'summary_large_image',
      twitter_title: '',
      twitter_description: '',
      twitter_image: '',
      json_ld: '',
      reading_time: '',
      author_name: 'RankRise Intelligence',
      author_title: 'Growth Strategist',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      status: 'published',
      scheduled_at: '',
    });
    setTagInput('');
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setTagInput('');
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      const slug = prev.slug && editingPost ? prev.slug : generateSlug(val);
      return {
        ...prev,
        title: val,
        slug,
        seo_title: prev.seo_title || `${val} | RankRise USA`,
        og_title: prev.og_title || val,
        twitter_title: prev.twitter_title || val,
      };
    });
  };

  const handleContentChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      content: val,
      reading_time: calculateReadingTime(val),
    }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim();
    if (!formData.tags?.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), clean],
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }

    setSubmitting(true);
    const result = await saveBlogPost(
      {
        ...formData,
        id: editingPost?.id,
      },
      adminKey
    );

    setSubmitting(false);
    if (result.success) {
      toast.success(editingPost ? 'Article updated successfully!' : 'Article published/created successfully!');
      setIsModalOpen(false);
      loadPosts();
    } else {
      toast.error(result.error || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const result = await deleteBlogPost(id, adminKey);
    if (result.success) {
      toast.success('Post deleted successfully');
      loadPosts();
    } else {
      toast.error('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filterStatus !== 'all' && post.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.author_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-[#05070a] rounded-3xl p-6 lg:p-8 text-foreground">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            SEO Blog <span className="text-gradient-gold italic">CMS Manager</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Publish, edit, schedule, and optimize blog intelligence publications for RankRise USA.
          </p>
        </div>

        <Button onClick={openCreateModal} className="button-premium px-6 h-12 font-black uppercase text-xs tracking-wider gap-2">
          <Plus className="w-4 h-4" /> Create New Article
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-white/10 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['all', 'published', 'draft', 'scheduled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all capitalize shrink-0 ${
                filterStatus === st
                  ? 'button-premium'
                  : 'bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground uppercase font-bold tracking-widest">
          Loading Articles...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center border border-white/10 rounded-2xl bg-white/5">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-bold text-foreground">No Blog Articles Found</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first blog post using the button above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-black tracking-widest text-foreground">
              <tr>
                <th className="py-4 px-6">Article</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Author</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <button
                          type="button"
                          onClick={() => openPreview(post.slug, post.status)}
                          className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1 text-sm text-left"
                        >
                          {post.title}
                        </button>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          /blog/{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-foreground">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black tracking-wider">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-foreground font-bold">{post.author_name}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : post.status === 'scheduled'
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                          : 'bg-white/10 border border-white/20 text-muted-foreground'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[11px]">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openPreview(post.slug, post.status)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                        title="Preview Article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0d14] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-8"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-xl font-black text-foreground">
                    {editingPost ? 'Edit Blog Article' : 'Create New Article'}
                  </h3>
                  <p className="text-xs text-muted-foreground">Configure content, media, author, and full SEO metadata.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-white/10 bg-white/5 px-6 gap-2">
                {[
                  { key: 'general', label: 'General & Content', icon: FileText },
                  { key: 'media', label: 'Media & Author', icon: ImageIcon },
                  { key: 'seo', label: 'SEO & Metadata', icon: Globe },
                  { key: 'publishing', label: 'Publishing', icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === tab.key
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'general' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Neural Search & SEO Architecture"
                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                        placeholder="neural-search-seo-architecture"
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Category
                        </label>
                        <select
                          value={formData.category || 'Intelligence'}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="Intelligence" className="bg-background">Intelligence</option>
                          <option value="Systems" className="bg-background">Systems</option>
                          <option value="Mechanics" className="bg-background">Mechanics</option>
                          <option value="SEO Strategy" className="bg-background">SEO Strategy</option>
                          <option value="Growth" className="bg-background">Growth</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Reading Time
                        </label>
                        <input
                          type="text"
                          value={formData.reading_time || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
                          placeholder="e.g. 5 min read"
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Tags (Press Add or Enter)
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Add tag e.g. AI Search"
                          className="flex-1 h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline" className="h-10 px-4 text-xs font-bold">
                          Add Tag
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground flex items-center gap-1.5"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Short Excerpt (Summary for cards & search)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief 1-2 sentence executive summary..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Article Content (HTML supported)
                      </label>
                      <textarea
                        rows={10}
                        required
                        value={formData.content || ''}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="<h2>Heading</h2><p>Write your article content here...</p>"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Featured Image URL (or upload)
                      </label>
                      <input
                        type="text"
                        value={formData.featured_image || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                        placeholder="https://… or upload below"
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                      <label className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs cursor-pointer hover:bg-white/5">
                        {uploading ? 'Uploading…' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void uploadImage(f, 'featured');
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Auto-compresses &amp; converts to WebP (max 1920px).
                      </p>
                      {formData.featured_image && (
                        <div className="mt-3 h-40 rounded-xl overflow-hidden border border-white/10 max-w-sm">
                          <img
                            src={formData.featured_image}
                            alt="Featured preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Gallery Images
                      </label>
                      <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs cursor-pointer hover:bg-white/5">
                        {uploading ? 'Uploading…' : 'Add gallery image'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void uploadImage(f, 'gallery');
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {(formData.gallery || []).length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(formData.gallery || []).map((url) => (
                            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 text-[10px] font-bold uppercase"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    gallery: (prev.gallery || []).filter((g) => g !== url),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <hr className="border-white/10 my-6" />

                    <h4 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Author Profile
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={formData.author_name || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                          placeholder="Sarah Chen"
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Author Title / Role
                        </label>
                        <input
                          type="text"
                          value={formData.author_title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, author_title: e.target.value }))}
                          placeholder="Head of Neural Strategy"
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Author Avatar URL
                      </label>
                      <input
                        type="text"
                        value={formData.author_avatar || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, author_avatar: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.seo_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                        placeholder="Article Title | RankRise USA"
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                      />
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        Length: {(formData.seo_title || '').length} / 60 characters
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.seo_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder="Compelling search result description..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                      />
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        Length: {(formData.seo_description || '').length} / 160 characters
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={formData.canonical_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                        placeholder="https://rankriseusa.com/blog/..."
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <hr className="border-white/10 my-6" />

                    <h4 className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-primary" /> OpenGraph & Twitter Card Override
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          OpenGraph Title
                        </label>
                        <input
                          type="text"
                          value={formData.og_title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          OpenGraph Image URL
                        </label>
                        <input
                          type="text"
                          value={formData.og_image || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        OpenGraph Description
                      </label>
                      <textarea
                        rows={2}
                        value={formData.og_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Twitter Card
                        </label>
                        <select
                          value={formData.twitter_card || 'summary_large_image'}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              twitter_card: e.target.value as BlogPost['twitter_card'],
                            }))
                          }
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="summary_large_image">summary_large_image</option>
                          <option value="summary">summary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Twitter Image URL
                        </label>
                        <input
                          type="text"
                          value={formData.twitter_image || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitter_image: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Twitter Title
                        </label>
                        <input
                          type="text"
                          value={formData.twitter_title || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Twitter Description
                        </label>
                        <input
                          type="text"
                          value={formData.twitter_description || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                        Custom JSON-LD Schema (Optional Override)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.json_ld || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, json_ld: e.target.value }))}
                        placeholder='{"@context":"https://schema.org","@type":"BlogPosting",...}'
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'publishing' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">
                        Publication Status
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['published', 'draft', 'scheduled'] as const).map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setFormData(prev => ({ ...prev, status: st }))}
                            className={`p-4 rounded-2xl border text-center transition-all capitalize font-black text-xs ${
                              formData.status === st
                                ? 'bg-primary/20 border-primary text-primary shadow-lg'
                                : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.status === 'scheduled' && (
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                          Scheduled Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.scheduled_at ? formData.scheduled_at.slice(0, 16) : ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: new Date(e.target.value).toISOString() }))}
                          className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3 bg-white/[0.02]">
                <div>
                  {formData.slug ? (
                    <button
                      type="button"
                      onClick={() => openPreview(formData.slug!, formData.status)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-white/10 text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="button-premium px-8 font-black text-xs uppercase tracking-widest gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? 'Saving...' : editingPost ? 'Update Article' : 'Publish Article'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
