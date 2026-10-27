import { useState, useEffect } from 'react';
import {
  adminFetchAllComments,
  adminUpdateCommentStatus,
  adminTogglePinComment,
  adminDeleteComment,
  adminFetchAllProfiles,
  adminUpdateProfileStatus,
  type CommunityComment,
  type UserProfile
} from '@/lib/communityStore';
import { ShieldCheck, Pin, Trash2, CheckCircle2, XCircle, EyeOff, MessageSquare, Users, Building2, Mail, Globe, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminCommunityModerationProps {
  adminKey: string;
}

export default function AdminCommunityModeration({ adminKey }: AdminCommunityModerationProps) {
  const [subTab, setSubTab] = useState<'comments' | 'profiles'>('comments');
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [adminKey, subTab]);

  const loadData = async () => {
    setLoading(true);
    if (subTab === 'comments') {
      const data = await adminFetchAllComments(adminKey);
      setComments(data);
    } else {
      const data = await adminFetchAllProfiles(adminKey);
      setProfiles(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (commentId: string, status: CommunityComment['status']) => {
    const ok = await adminUpdateCommentStatus(adminKey, commentId, status);
    if (ok) {
      toast.success(`Comment status set to ${status}.`);
      loadData();
    } else {
      toast.error('Failed to update status.');
    }
  };

  const handleTogglePin = async (commentId: string, currentPin: boolean) => {
    const ok = await adminTogglePinComment(adminKey, commentId, !currentPin);
    if (ok) {
      toast.success(!currentPin ? 'Comment pinned.' : 'Comment unpinned.');
      loadData();
    } else {
      toast.error('Failed to update pin state.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Admin Delete: Are you sure you want to permanently delete this comment?')) return;
    const ok = await adminDeleteComment(adminKey, commentId);
    if (ok) {
      toast.success('Comment permanently deleted.');
      loadData();
    } else {
      toast.error('Failed to delete comment.');
    }
  };

  const handleProfileStatus = async (profileId: string, status: UserProfile['status']) => {
    const ok = await adminUpdateProfileStatus(adminKey, profileId, status);
    if (ok) {
      toast.success(`Profile status set to ${status}.`);
      loadData();
    } else {
      toast.error('Failed to update profile status.');
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.author_name.toLowerCase().includes(q) ||
      c.author_email.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      (c.author_company && c.author_company.toLowerCase().includes(q))
    );
  });

  const filteredProfiles = profiles.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.industry && p.industry.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden">
      {/* Moderation Top Navigation */}
      <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/5">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={subTab === 'comments' ? 'default' : 'outline'}
            onClick={() => { setSubTab('comments'); setFilter('all'); }}
            className={`h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              subTab === 'comments' ? 'button-premium' : 'border-white/10 text-muted-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.length})
          </Button>

          <Button
            size="sm"
            variant={subTab === 'profiles' ? 'default' : 'outline'}
            onClick={() => { setSubTab('profiles'); setFilter('all'); }}
            className={`h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              subTab === 'profiles' ? 'button-premium' : 'border-white/10 text-muted-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> User Profiles ({profiles.length})
          </Button>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${subTab}...`}
              className="w-full h-9 pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
            />
          </div>
          <Button size="sm" variant="ghost" onClick={loadData} className="h-9 px-3 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2 bg-[#080b11]">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Filter:</span>
        {['all', 'approved', 'pending', 'rejected', 'hidden'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-primary text-background'
                : 'bg-white/5 text-muted-foreground hover:text-foreground border border-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {subTab === 'comments' ? (
          filteredComments.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs font-bold">
              No comments matching criteria.
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-5 rounded-2xl border transition-all ${
                  comment.is_pinned
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center font-black text-xs text-primary">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-foreground">{comment.author_name}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">({comment.author_email})</span>
                        {comment.author_company && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5 text-primary" /> {comment.author_company}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 font-bold mt-0.5">
                        Target: <span className="text-primary">{comment.target_type} / {comment.target_id}</span> • {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {comment.is_pinned && (
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[9px] font-black uppercase flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5 fill-primary" /> Pinned
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      comment.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      comment.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      comment.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-foreground/90 bg-black/40 p-3 rounded-xl border border-white/5 mb-4 leading-relaxed">
                  {comment.content}
                </p>

                {/* Admin Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(comment.id, 'approved')}
                      className="h-7 px-2.5 text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(comment.id, 'rejected')}
                      className="h-7 px-2.5 text-[10px] font-black uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(comment.id, 'hidden')}
                      className="h-7 px-2.5 text-[10px] font-black uppercase text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 rounded-lg flex items-center gap-1"
                    >
                      <EyeOff className="w-3 h-3" /> Hide
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTogglePin(comment.id, comment.is_pinned)}
                      className={`h-7 px-2.5 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 ${
                        comment.is_pinned ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Pin className="w-3 h-3" /> {comment.is_pinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-7 px-2.5 text-[10px] font-black uppercase text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          filteredProfiles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs font-bold">
              No user profiles found.
            </div>
          ) : (
            filteredProfiles.map((prof) => (
              <div key={prof.id} className="p-5 rounded-2xl border border-white/10 bg-white/5 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-foreground">{prof.name}</h4>
                    <span className="text-xs font-bold text-primary">{prof.email}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      prof.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {prof.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Company:</strong> {prof.company || 'N/A'} • <strong>Industry:</strong> {prof.industry || 'N/A'} • <strong>Country:</strong> {prof.country || 'N/A'}
                  </p>
                  {prof.bio && (
                    <p className="text-xs text-foreground/80 italic bg-black/40 p-2.5 rounded-xl border border-white/5 mt-2">
                      "{prof.bio}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleProfileStatus(prof.id, 'approved')}
                    className="h-8 px-3 text-[10px] font-black uppercase button-premium"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleProfileStatus(prof.id, 'rejected')}
                    className="h-8 px-3 text-[10px] font-black uppercase border-white/10 text-red-400"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
