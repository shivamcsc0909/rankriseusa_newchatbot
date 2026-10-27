import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Image as ImageIcon, Tag, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getStoredProfile } from '@/lib/communityStore';

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  onRequireAuth?: () => void;
}

export default function WriteBlogModal({
  isOpen,
  onClose,
  onSubmitted,
  onRequireAuth,
}: WriteBlogModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SEO');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const profile = getStoredProfile();
    if (!profile || !profile.email) {
      toast.error('Please sign in to submit a blog article.');
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Title and Article Content are required.');
      return;
    }

    setLoading(true);

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

      const payload = {
        title: title.trim(),
        slug,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        featured_image: featuredImage.trim() || '/assets/images/services/seo.webp',
        author_name: profile.name || 'Community Contributor',
        author_title: profile.company || 'Community Author',
        author_avatar: profile.profile_image || undefined,
        status: 'pending', // Moderation workflow
      };

      const res = await fetch('/api/index.php/v1/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok && json.error) {
        throw new Error(json.error.message || 'Submission failed.');
      }

      toast.success('Your article has been submitted for review! It will be published after moderator approval.');
      setTitle('');
      setExcerpt('');
      setContent('');
      setTags('');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#080b11] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Community Publisher</span>
            </div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Submit an <span className="text-gradient-gold italic">Article</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Share your digital marketing, AI search, or SEO intelligence with the RankRise community.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How Generative AI is Reshaping Search Rankings"
                className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0d121c] border border-white/10 text-xs text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="SEO">SEO</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="AI Intelligence">AI Intelligence</option>
                  <option value="Strategy">Strategy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. AI, SEO, Marketing"
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Featured Image URL <span className="text-muted-foreground/50 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/cover-image.webp"
                className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Short Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief 1-2 sentence overview of your key insight..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                Full Article Content (HTML / Text) *
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article here. You can use standard paragraphs or HTML tags (<h2>, <p>, <ul>)..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/10 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="button-premium text-xs font-black uppercase tracking-wider px-6"
              >
                {loading ? 'Submitting...' : (
                  <span className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Submit For Review
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
