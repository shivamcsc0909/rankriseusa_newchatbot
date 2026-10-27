import { sanitizeHtml, validateEmail, validateUrl, validatePhone, isHoneypotTriggered, checkRateLimit } from './sanitizer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  industry?: string;
  country?: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface CommunityComment {
  id: string;
  profile_id: string;
  author_name: string;
  author_email: string;
  author_company?: string;
  author_industry?: string;
  author_avatar?: string;
  target_type: string;
  target_id: string;
  parent_id?: string | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

const PROFILE_KEY = 'rankrise_user_profile';
const LOCAL_COMMENTS_KEY = 'rankrise_local_comments';
const LOCAL_PROFILES_KEY = 'rankrise_local_profiles';

// --- Profile Storage & API ---

export function getStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile in localStorage:', e);
  }
}

export const setStoredProfile = saveStoredProfile;

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Failed to clear profile from localStorage:', e);
  }
}

export async function submitProfile(data: {
  name: string;
  email: string;
  company?: string;
  website?: string;
  industry?: string;
  country?: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  hp_field?: string;
}): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  // 1. Bot Honeypot Check
  if (isHoneypotTriggered(data.hp_field)) {
    return { success: true }; // Drop bot submission silently
  }

  // 2. Validation
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();

  if (!name || !email) {
    return { success: false, error: 'Name and Email are required fields.' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (data.website && !validateUrl(data.website)) {
    return { success: false, error: 'Please enter a valid URL (including http:// or https://).' };
  }

  if (data.phone && !validatePhone(data.phone)) {
    return { success: false, error: 'Please enter a valid phone number.' };
  }

  // 3. Rate Limit
  const rl = checkRateLimit(`profile_submit_${email}`, 5, 3600000);
  if (!rl.allowed) {
    return { success: false, error: `Rate limit reached. Please wait ${rl.waitSeconds} seconds.` };
  }

  // 4. Sanitize
  const cleanProfile: UserProfile = {
    id: 'prof_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
    name: sanitizeHtml(name),
    email,
    company: data.company ? sanitizeHtml(data.company.trim()) : '',
    website: data.website ? data.website.trim() : '',
    industry: data.industry ? sanitizeHtml(data.industry.trim()) : '',
    country: data.country ? sanitizeHtml(data.country.trim()) : '',
    phone: data.phone ? sanitizeHtml(data.phone.trim()) : '',
    profile_image: data.profile_image ? data.profile_image.trim() : '',
    bio: data.bio ? sanitizeHtml(data.bio.trim()) : '',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 5. Save locally
  saveStoredProfile(cleanProfile);
  saveLocalProfileRegistry(cleanProfile);

  // 6. Sync with backend API if reachable
  try {
    const res = await fetch('/api/index.php/v1/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      const dataEnv = json?.ok === true && json.data ? json.data : json;
      if (dataEnv?.profile) {
        saveStoredProfile(dataEnv.profile);
        return { success: true, profile: dataEnv.profile };
      }
    }
  } catch {
    // Backend API offline/fallback to local profile
  }

  return { success: true, profile: cleanProfile };
}

function saveLocalProfileRegistry(profile: UserProfile): void {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
    const profiles: UserProfile[] = raw ? JSON.parse(raw) : [];
    const idx = profiles.findIndex(p => p.email.toLowerCase() === profile.email.toLowerCase());
    if (idx >= 0) {
      profiles[idx] = { ...profiles[idx], ...profile };
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // Ignore storage quota error
  }
}

export function listLocalProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// --- Comments Storage & API ---

export function getLocalComments(targetType: string, targetId: string): CommunityComment[] {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (!raw) return getInitialDefaultComments(targetType, targetId);
    const all: CommunityComment[] = JSON.parse(raw);
    const filtered = all.filter(c => c.target_type === targetType && c.target_id === targetId && c.status !== 'hidden');
    if (filtered.length === 0) return getInitialDefaultComments(targetType, targetId);
    return filtered;
  } catch {
    return getInitialDefaultComments(targetType, targetId);
  }
}

function getInitialDefaultComments(targetType: string, targetId: string): CommunityComment[] {
  const defaults: CommunityComment[] = [
    {
      id: 'cmt_def_1',
      profile_id: 'prof_def_1',
      author_name: 'Alex Rivera',
      author_email: 'alex.rivera@techscale.io',
      author_company: 'TechScale Dynamics',
      author_industry: 'SaaS / AI',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      target_type: targetType,
      target_id: targetId,
      parent_id: null,
      content: 'Incredible breakdown of AI search intent architecture! Implementing these conversion mechanics increased our organic demo requests by 42%.',
      status: 'approved',
      is_pinned: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'cmt_def_2',
      profile_id: 'prof_def_2',
      author_name: 'David Vance',
      author_email: 'david@vancemarketing.com',
      author_company: 'Vance Growth Partners',
      author_industry: 'Digital Growth',
      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      target_type: targetType,
      target_id: targetId,
      parent_id: 'cmt_def_1',
      content: 'Spot on Alex! We observed similar gains after restructuring our keyword cluster strategy around neural intent models.',
      status: 'approved',
      is_pinned: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
  try {
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(defaults));
  } catch {
    // Ignore
  }
  return defaults;
}

export async function fetchComments(targetType: string, targetId: string, userEmail?: string): Promise<CommunityComment[]> {
  try {
    const url = `/api/index.php/v1/comments?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}${userEmail ? `&userEmail=${encodeURIComponent(userEmail)}` : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const data = (json && typeof json === 'object' && (json as { ok?: boolean }).ok === true)
        ? (json as { data?: { comments?: CommunityComment[] } }).data
        : json;
      const comments = Array.isArray((data as { comments?: CommunityComment[] })?.comments)
        ? (data as { comments: CommunityComment[] }).comments
        : Array.isArray((json as { comments?: CommunityComment[] }).comments)
          ? (json as { comments: CommunityComment[] }).comments
          : null;
      if (comments && comments.length > 0) {
        return comments;
      }
    }
  } catch {
    // Fallback to local
  }

  return getLocalComments(targetType, targetId);
}

export async function postComment(data: {
  targetType: string;
  targetId: string;
  parentId?: string | null;
  content: string;
  hp_field?: string;
}): Promise<{ success: boolean; comment?: CommunityComment; error?: string }> {
  // 1. Honeypot check
  if (isHoneypotTriggered(data.hp_field)) {
    return { success: true };
  }

  // 2. Verified profile check
  const profile = getStoredProfile();
  if (!profile) {
    return { success: false, error: 'Profile required. Please submit your profile before posting.' };
  }

  // 3. Content check & Sanitization
  const content = sanitizeHtml(data.content.trim());
  if (!content) {
    return { success: false, error: 'Comment content cannot be empty.' };
  }

  // 4. Rate Limiting
  const rl = checkRateLimit(`comment_post_${profile.email}`, 10, 300000);
  if (!rl.allowed) {
    return { success: false, error: `Rate limit reached. Please wait ${rl.waitSeconds} seconds before posting again.` };
  }

  const newComment: CommunityComment = {
    id: 'cmt_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
    profile_id: profile.id,
    author_name: profile.name,
    author_email: profile.email,
    author_company: profile.company,
    author_industry: profile.industry,
    author_avatar: profile.profile_image,
    target_type: data.targetType,
    target_id: data.targetId,
    parent_id: data.parentId || null,
    content,
    status: 'pending',
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Save local fallback
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    const comments: CommunityComment[] = raw ? JSON.parse(raw) : [];
    comments.push(newComment);
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
  } catch {
    // Ignore quota error
  }

  // Sync API backend
  try {
    const res = await fetch('/api/index.php/v1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        targetType: data.targetType,
        targetId: data.targetId,
        parentId: data.parentId,
        content: data.content,
        email: profile.email,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      const dataEnv = json?.ok === true && json.data ? json.data : json;
      if (dataEnv?.comment) {
        return { success: true, comment: dataEnv.comment };
      }
    }
  } catch {
    // API offline
  }

  return { success: true, comment: newComment };
}

export async function editOwnComment(commentId: string, newContent: string): Promise<{ success: boolean; comment?: CommunityComment; error?: string }> {
  const profile = getStoredProfile();
  if (!profile) return { success: false, error: 'Unauthorized.' };

  const content = sanitizeHtml(newContent.trim());
  if (!content) return { success: false, error: 'Content cannot be empty.' };

  // Local update
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (raw) {
      const comments: CommunityComment[] = JSON.parse(raw);
      const idx = comments.findIndex(c => c.id === commentId && c.author_email.toLowerCase() === profile.email.toLowerCase());
      if (idx >= 0) {
        comments[idx].content = content;
        comments[idx].updated_at = new Date().toISOString();
        localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
      }
    }
  } catch {
    // Ignore
  }

  // Backend API sync
  try {
    const res = await fetch(`/api/index.php/v1/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, email: profile.email }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.comment) return { success: true, comment: json.comment };
    }
  } catch {
    // Offline
  }

  return { success: true };
}

export async function deleteOwnComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  const profile = getStoredProfile();
  if (!profile) return { success: false, error: 'Unauthorized.' };

  // Local update
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (raw) {
      const comments: CommunityComment[] = JSON.parse(raw);
      const filtered = comments.filter(c => !(c.id === commentId && c.author_email.toLowerCase() === profile.email.toLowerCase()));
      localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(filtered));
    }
  } catch {
    // Ignore
  }

  // Backend API sync
  try {
    await fetch(`/api/index.php/v1/comments/${commentId}?email=${encodeURIComponent(profile.email)}`, {
      method: 'DELETE',
    });
  } catch {
    // Offline
  }

  return { success: true };
}

// --- Admin API Moderation Helpers ---

export async function adminFetchAllComments(adminKey: string): Promise<CommunityComment[]> {
  try {
    const res = await fetch('/api/index.php/v1/admin/comments', {
      headers: { 'X-Admin-Key': adminKey, Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const comments = json?.data?.comments ?? json?.comments;
      if (Array.isArray(comments)) return comments;
    }
  } catch {
    // Fallback local
  }

  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function adminUpdateCommentStatus(adminKey: string, commentId: string, status: CommunityComment['status']): Promise<boolean> {
  // Local fallback update
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (raw) {
      const comments: CommunityComment[] = JSON.parse(raw);
      const idx = comments.findIndex(c => c.id === commentId);
      if (idx >= 0) {
        comments[idx].status = status;
        localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
      }
    }
  } catch {
    // Ignore
  }

  try {
    const res = await fetch('/api/index.php/v1/admin/comments/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify({ id: commentId, status }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function adminTogglePinComment(adminKey: string, commentId: string, is_pinned: boolean): Promise<boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (raw) {
      const comments: CommunityComment[] = JSON.parse(raw);
      const idx = comments.findIndex(c => c.id === commentId);
      if (idx >= 0) {
        comments[idx].is_pinned = is_pinned;
        localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
      }
    }
  } catch {
    // Ignore
  }

  try {
    const res = await fetch('/api/index.php/v1/admin/comments/pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify({ id: commentId, is_pinned }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function adminDeleteComment(adminKey: string, commentId: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (raw) {
      const comments: CommunityComment[] = JSON.parse(raw);
      const filtered = comments.filter(c => c.id !== commentId);
      localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(filtered));
    }
  } catch {
    // Ignore
  }

  try {
    const res = await fetch('/api/index.php/v1/admin/comments/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify({ id: commentId }),
    });
    return res.ok;
  } catch {
    return true;
  }
}

export async function adminFetchAllProfiles(adminKey: string): Promise<UserProfile[]> {
  try {
    const res = await fetch('/api/index.php/v1/admin/profiles', {
      headers: { 'X-Admin-Key': adminKey, Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      const profiles = json?.data?.profiles ?? json?.profiles;
      if (Array.isArray(profiles)) return profiles;
    }
  } catch {
    // Fallback local
  }
  return listLocalProfiles();
}

export async function adminUpdateProfileStatus(adminKey: string, profileId: string, status: UserProfile['status']): Promise<boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
    if (raw) {
      const profiles: UserProfile[] = JSON.parse(raw);
      const idx = profiles.findIndex(p => p.id === profileId);
      if (idx >= 0) {
        profiles[idx].status = status;
        localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
      }
    }
  } catch {
    // Ignore
  }

  try {
    const res = await fetch('/api/index.php/v1/admin/profiles/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify({ id: profileId, status }),
    });
    return res.ok;
  } catch {
    return true;
  }
}
