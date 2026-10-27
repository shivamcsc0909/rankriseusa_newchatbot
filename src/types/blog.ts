export type BlogPostStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string;
  gallery?: string[];
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: 'summary' | 'summary_large_image';
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  json_ld?: string;
  reading_time: string;
  author_name: string;
  author_title?: string;
  author_avatar?: string;
  status: BlogPostStatus;
  scheduled_at?: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface BlogFilters {
  search: string;
  category: string;
  tag: string;
  status?: BlogPostStatus | 'all';
}

export interface PaginationState {
  currentPage: number;
  postsPerPage: number;
  totalPosts: number;
  totalPages: number;
}
