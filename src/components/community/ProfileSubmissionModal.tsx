import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Building2, Globe, Briefcase, Flag, Phone, Image as ImageIcon, FileText, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitProfile, getStoredProfile, type UserProfile } from '@/lib/communityStore';
import { toast } from 'sonner';

interface ProfileSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSaved?: (profile: UserProfile) => void;
}

export default function ProfileSubmissionModal({ isOpen, onClose, onProfileSaved }: ProfileSubmissionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    industry: '',
    country: '',
    phone: '',
    profile_image: '',
    bio: '',
    hp_field: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredProfile();
      if (existing) {
        setFormData({
          name: existing.name || '',
          email: existing.email || '',
          company: existing.company || '',
          website: existing.website || '',
          industry: existing.industry || '',
          country: existing.country || '',
          phone: existing.phone || '',
          profile_image: existing.profile_image || '',
          bio: existing.bio || '',
          hp_field: '',
        });
      }
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await submitProfile(formData);

    setLoading(false);

    if (result.success) {
      toast.success(
        getStoredProfile()?.status === 'pending'
          ? 'Profile submitted for moderation.'
          : 'Profile saved successfully!'
      );
      if (result.profile && onProfileSaved) {
        onProfileSaved(result.profile);
      }
      onClose();
    } else {
      toast.error(result.error || 'Failed to submit profile.');
      if (result.error?.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: result.error || 'Invalid email' }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto my-0 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#080b11] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden my-8"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-primary text-[10px] font-black uppercase tracking-widest">Verified Identity</span>
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Community <span className="text-gradient-gold italic">Profile</span>
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Submit your professional profile to join discussions, leave comments, and network with industry leaders.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Honeypot hidden input */}
            <input
              type="text"
              name="hp_field"
              value={formData.hp_field}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />

            <div className="grid md:grid-cols-2 gap-4">
              {/* Name (Required) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Chen"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Email (Required) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@company.com"
                  className={`w-full h-12 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40`}
                />
                {errors.email && <p className="text-[10px] text-red-400 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Apex Technologies"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Digital Marketing / SaaS"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-primary" /> Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" /> Profile Image URL (optional)
                </label>
                <input
                  type="url"
                  name="profile_image"
                  value={formData.profile_image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Short Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your expertise, growth targets, or professional background..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-semibold text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/40 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 px-6 rounded-xl border-white/10 text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-8 rounded-xl button-premium font-black uppercase tracking-widest text-xs flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
