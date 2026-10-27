import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Pin, Reply, Edit3, Trash2, UserPlus, Send, Check, X, ShieldCheck, Sparkles, AlertCircle, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getStoredProfile,
  fetchComments,
  postComment,
  editOwnComment,
  deleteOwnComment,
  type UserProfile,
  type CommunityComment
} from '@/lib/communityStore';
import ProfileSubmissionModal from './ProfileSubmissionModal';
import { toast } from 'sonner';

interface CommentSectionProps {
  targetType: string;
  targetId: string;
  title?: string;
}

export default function CommentSection({ targetType, targetId, title = 'Community Discussion' }: CommentSectionProps) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [newCommentContent, setNewCommentContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [hpField, setHpField] = useState('');

  useEffect(() => {
    setUserProfile(getStoredProfile());
    loadComments();
  }, [targetType, targetId]);

  const loadComments = async () => {
    const prof = getStoredProfile();
    const loaded = await fetchComments(targetType, targetId, prof?.email);
    setComments(loaded);
  };

  const handlePostTopComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    if (!newCommentContent.trim()) {
      toast.error('Comment content cannot be empty.');
      return;
    }

    setSubmitting(true);
    const res = await postComment({
      targetType,
      targetId,
      content: newCommentContent,
      hp_field: hpField,
    });
    setSubmitting(false);

    if (res.success) {
      toast.success(
        res.comment?.status === 'pending'
          ? 'Comment submitted for moderation.'
          : 'Comment posted successfully!'
      );
      setNewCommentContent('');
      loadComments();
    } else {
      toast.error(res.error || 'Failed to post comment.');
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply content cannot be empty.');
      return;
    }

    setSubmitting(true);
    const res = await postComment({
      targetType,
      targetId,
      parentId,
      content: replyContent,
      hp_field: hpField,
    });
    setSubmitting(false);

    if (res.success) {
      toast.success(
        res.comment?.status === 'pending'
          ? 'Reply submitted for moderation.'
          : 'Reply submitted successfully!'
      );
      setReplyContent('');
      setReplyingToId(null);
      loadComments();
    } else {
      toast.error(res.error || 'Failed to post reply.');
    }
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return;
    const res = await editOwnComment(commentId, editContent);
    if (res.success) {
      toast.success('Comment updated!');
      setEditingCommentId(null);
      loadComments();
    } else {
      toast.error(res.error || 'Failed to edit comment.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete your comment?')) return;
    const res = await deleteOwnComment(commentId);
    if (res.success) {
      toast.success('Comment deleted.');
      loadComments();
    } else {
      toast.error(res.error || 'Failed to delete comment.');
    }
  };

  // Organize comments into top-level and nested replies
  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter(c => c.parent_id === parentId);

  return (
    <div className="w-full mt-16 pt-12 border-t border-white/10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Verified Discussion</span>
          </div>
          <h3 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            {title} <span className="text-sm font-bold text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">{comments.length}</span>
          </h3>
        </div>

        {/* Profile Status Badge / Action */}
        <div>
          {userProfile ? (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2.5 px-4">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-sm overflow-hidden">
                {userProfile.profile_image ? (
                  <img src={userProfile.profile_image} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  userProfile.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-foreground flex items-center gap-1">
                  {userProfile.name} <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </p>
                <p className="text-[10px] font-bold text-muted-foreground">{userProfile.company || userProfile.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileModalOpen(true)}
                className="ml-2 text-[10px] font-black uppercase text-primary hover:text-primary hover:bg-primary/10 h-8 px-3 rounded-lg"
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsProfileModalOpen(true)}
              className="h-11 px-6 rounded-xl button-premium text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Submit Profile to Comment
            </Button>
          )}
        </div>
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handlePostTopComment} className="mb-12">
        <input type="text" name="hp_field" value={hpField} onChange={e => setHpField(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" />

        <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden">
          {!userProfile && (
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-8 h-8 text-primary mb-2 animate-bounce" />
              <p className="text-sm font-black text-foreground mb-1">Profile Required to Participate</p>
              <p className="text-xs text-muted-foreground mb-4 max-w-md">Submit your name, company, and bio to join high-level executive insights.</p>
              <Button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="h-10 px-6 rounded-xl button-premium text-xs font-black uppercase tracking-widest"
              >
                Complete Profile
              </Button>
            </div>
          )}

          <textarea
            rows={3}
            value={newCommentContent}
            onChange={e => setNewCommentContent(e.target.value)}
            placeholder={userProfile ? "Share your perspective or ask a question..." : "Submit profile above to start typing..."}
            disabled={!userProfile || submitting}
            className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none placeholder:text-muted-foreground/40 resize-none"
          />

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> XSS Sanitized & Moderated
            </span>
            <Button
              type="submit"
              disabled={!userProfile || submitting || !newCommentContent.trim()}
              className="h-10 px-6 rounded-xl button-premium text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              {submitting ? 'Posting...' : <><Send className="w-3.5 h-3.5" /> Post Comment</>}
            </Button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-3xl border border-white/5">
            <MessageSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-black text-muted-foreground">No discussions yet.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Be the first verified member to share an insight.</p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              currentUserEmail={userProfile?.email}
              replyingToId={replyingToId}
              onStartReply={(id) => {
                if (!userProfile) {
                  setIsProfileModalOpen(true);
                  return;
                }
                setReplyingToId(id);
                setReplyContent('');
              }}
              onCancelReply={() => setReplyingToId(null)}
              replyContent={replyContent}
              onReplyContentChange={setReplyContent}
              onSubmitReply={handlePostReply}
              editingCommentId={editingCommentId}
              onStartEdit={(id, content) => {
                setEditingCommentId(id);
                setEditContent(content);
              }}
              onCancelEdit={() => setEditingCommentId(null)}
              editContent={editContent}
              onEditContentChange={setEditContent}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
              submitting={submitting}
            />
          ))
        )}
      </div>

      {/* Profile Submission Modal */}
      <ProfileSubmissionModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileSaved={(prof) => {
          setUserProfile(prof);
          loadComments();
        }}
      />
    </div>
  );
}

// Single Comment Item (with recursion for replies)
interface CommentItemProps {
  comment: CommunityComment;
  replies: CommunityComment[];
  currentUserEmail?: string;
  replyingToId: string | null;
  onStartReply: (id: string) => void;
  onCancelReply: () => void;
  replyContent: string;
  onReplyContentChange: (val: string) => void;
  onSubmitReply: (parentId: string) => void;
  editingCommentId: string | null;
  onStartEdit: (id: string, content: string) => void;
  onCancelEdit: () => void;
  editContent: string;
  onEditContentChange: (val: string) => void;
  onSaveEdit: (id: string) => void;
  onDelete: (id: string) => void;
  submitting: boolean;
  isNested?: boolean;
}

function CommentItem({
  comment,
  replies,
  currentUserEmail,
  replyingToId,
  onStartReply,
  onCancelReply,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  editingCommentId,
  onStartEdit,
  onCancelEdit,
  editContent,
  onEditContentChange,
  onSaveEdit,
  onDelete,
  submitting,
  isNested = false,
}: CommentItemProps) {
  const isOwner = currentUserEmail && currentUserEmail.toLowerCase() === comment.author_email.toLowerCase();
  const isEditing = editingCommentId === comment.id;
  const isReplying = replyingToId === comment.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${
        comment.is_pinned
          ? 'glass-card border-primary/40 bg-primary/5 rounded-3xl p-6 shadow-xl'
          : isNested
          ? 'ml-6 md:ml-12 mt-4 pl-4 border-l-2 border-white/10'
          : 'glass-card rounded-3xl p-6 border-white/5 bg-[#05070a]'
      }`}
    >
      {/* Pinned Badge */}
      {comment.is_pinned && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Pin className="w-3 h-3 text-primary fill-primary" /> Pinned Comment
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm overflow-hidden shrink-0">
            {comment.author_avatar ? (
              <img src={comment.author_avatar} alt={comment.author_name} className="w-full h-full object-cover" />
            ) : (
              comment.author_name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-foreground">{comment.author_name}</h4>
              {comment.author_company && (
                <span className="text-[10px] font-black uppercase text-muted-foreground px-2 py-0.5 rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
                  <Building2 className="w-2.5 h-2.5 text-primary" /> {comment.author_company}
                </span>
              )}
              {comment.author_industry && (
                <span className="hidden sm:inline-flex text-[10px] font-black uppercase text-primary/70 px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 flex items-center gap-1">
                  <Briefcase className="w-2.5 h-2.5 text-primary" /> {comment.author_industry}
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-bold mt-0.5">
              {new Date(comment.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Owner Controls */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStartEdit(comment.id, comment.content)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
              title="Edit comment"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Comment Body */}
      {isEditing ? (
        <div className="space-y-3 my-3">
          <textarea
            rows={3}
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={onCancelEdit} className="h-8 text-xs font-bold text-muted-foreground">
              Cancel
            </Button>
            <Button size="sm" onClick={() => onSaveEdit(comment.id)} className="h-8 px-4 button-premium text-xs font-bold">
              Save Edit
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm font-medium text-foreground/90 leading-relaxed whitespace-pre-line mb-4">
          {comment.content}
        </p>
      )}

      {/* Reply Action */}
      {!isEditing && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => (isReplying ? onCancelReply() : onStartReply(comment.id))}
            className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <Reply className="w-3.5 h-3.5" /> Reply
          </button>
        </div>
      )}

      {/* Nested Reply Form */}
      {isReplying && (
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            placeholder={`Reply to ${comment.author_name}...`}
            className="w-full bg-transparent text-xs font-medium text-foreground focus:outline-none placeholder:text-muted-foreground/40 resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={onCancelReply} className="h-7 text-[10px] font-bold text-muted-foreground">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={submitting || !replyContent.trim()}
              onClick={() => onSubmitReply(comment.id)}
              className="h-7 px-4 button-premium text-[10px] font-black uppercase"
            >
              Post Reply
            </Button>
          </div>
        </div>
      )}

      {/* Render Nested Replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              currentUserEmail={currentUserEmail}
              replyingToId={replyingToId}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
              replyContent={replyContent}
              onReplyContentChange={onReplyContentChange}
              onSubmitReply={onSubmitReply}
              editingCommentId={editingCommentId}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              editContent={editContent}
              onEditContentChange={onEditContentChange}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              submitting={submitting}
              isNested={true}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
