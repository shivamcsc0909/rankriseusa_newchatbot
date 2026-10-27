import { useEffect } from 'react';
import { BlogPost } from '@/types/blog';

interface BlogSeoProps {
  post?: BlogPost;
  title?: string;
  description?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
}

export default function BlogSeo({
  post,
  title,
  description,
  canonicalUrl,
  type = 'article',
}: BlogSeoProps) {
  useEffect(() => {
    const seoTitle = post?.seo_title || title || (post ? `${post.title} | RankRise USA` : 'Blog Intelligence | RankRise USA');
    const seoDesc = post?.seo_description || description || post?.excerpt || 'Executive insights and strategy on digital marketing, AI search, and growth mechanics.';
    const canonical = post?.canonical_url || canonicalUrl || (post ? `https://rankriseusa.com/blog/${post.slug}` : 'https://rankriseusa.com/blog');
    const ogImg = post?.og_image || post?.featured_image || 'https://rankriseusa.com/android-chrome-512x512.png';
    const twitterImg = post?.twitter_image || post?.featured_image || 'https://rankriseusa.com/android-chrome-512x512.png';
    const twitterCard = post?.twitter_card || 'summary_large_image';

    // 1. Page Title
    document.title = seoTitle;

    // 2. Helper to set or update meta tag
    const setMeta = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMeta('name', 'description', seoDesc);

    // Canonical link
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // OpenGraph Meta Tags
    setMeta('property', 'og:title', post?.og_title || seoTitle);
    setMeta('property', 'og:description', post?.og_description || seoDesc);
    setMeta('property', 'og:image', ogImg);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'RankRise USA');

    // Twitter Card Meta Tags
    setMeta('name', 'twitter:card', twitterCard);
    setMeta('name', 'twitter:title', post?.twitter_title || seoTitle);
    setMeta('name', 'twitter:description', post?.twitter_description || seoDesc);
    setMeta('name', 'twitter:image', twitterImg);

    // 3. JSON-LD Structured Schema Data
    let jsonLdScript = document.getElementById('blog-json-ld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'blog-json-ld';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    if (post) {
      const schemaData = post.json_ld
        ? post.json_ld
        : JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.seo_description || post.excerpt,
            image: [post.featured_image],
            datePublished: post.created_at,
            dateModified: post.updated_at,
            author: {
              '@type': 'Person',
              name: post.author_name,
              jobTitle: post.author_title || 'Growth Strategist',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RankRise USA',
              url: 'https://rankriseusa.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://rankriseusa.com/android-chrome-512x512.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonical,
            },
            keywords: post.tags?.join(', '),
            articleSection: post.category,
          });

      jsonLdScript.textContent = schemaData;
    } else {
      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'RankRise USA Intelligence Hub',
        description: 'Executive insights and strategic analysis on digital marketing, AI search, and growth mechanics.',
        url: 'https://rankriseusa.com/blog',
        publisher: {
          '@type': 'Organization',
          name: 'RankRise USA',
          url: 'https://rankriseusa.com',
        },
      });
    }

    return () => {
      // Clean up JSON-LD on unmount if needed
    };
  }, [post, title, description, canonicalUrl, type]);

  return null;
}
