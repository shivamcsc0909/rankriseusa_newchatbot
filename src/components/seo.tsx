// src/components/seo.tsx
import { useEffect } from "react";

type Hreflang = { hrefLang: string; href: string };

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  url?: string;
  image?: string;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  hreflangs?: Hreflang[];
  breadcrumbs?: { position: number; name: string; item: string }[];
  lang?: string;
  schema?: Record<string, unknown>;
  noIndex?: boolean;
}

export default function Seo({
  title,
  description,
  canonical,
  url,
  image,
  keywords = [],
  publishedTime,
  modifiedTime,
  author = "RankRise USA",
  hreflangs = [],
  breadcrumbs,
  lang = "en",
  schema,
  noIndex = false,
}: SeoProps) {
  useEffect(() => {
    const siteName = "RankRise USA";
    const safeTitle = title
      ? title.includes("RankRise USA")
        ? title
        : `${title} | ${siteName}`
      : `RankRise USA | AI SEO & Digital Marketing Agency`;
    const targetUrl = canonical || url || "https://rankriseusa.com/";
    const ogImg = image || "https://rankriseusa.com/assets/images/logo1.webp";

    // 1. Title & HTML Language
    document.title = safeTitle;
    document.documentElement.lang = lang;

    // Helper to set/update meta tag
    const setMeta = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags with Google SEO limits
    setMeta('name', 'description', description);
    if (keywords.length > 0) {
      setMeta('name', 'keywords', keywords.join(', '));
    }
    setMeta('name', 'author', author);
    setMeta(
      'name',
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // Canonical link tag
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', targetUrl);

    // Hreflang links
    hreflangs.forEach((h) => {
      let hLink = document.querySelector<HTMLLinkElement>(`link[hreflang="${h.hrefLang}"]`);
      if (!hLink) {
        hLink = document.createElement('link');
        hLink.setAttribute('rel', 'alternate');
        hLink.setAttribute('hreflang', h.hrefLang);
        document.head.appendChild(hLink);
      }
      hLink.setAttribute('href', h.href);
    });

    // OpenGraph (Facebook, LinkedIn, Pinterest)
    setMeta('property', 'og:type', publishedTime ? 'article' : 'website');
    setMeta('property', 'og:title', safeTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', targetUrl);
    setMeta('property', 'og:image', ogImg);
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:locale', 'en_US');

    // Twitter Card Meta Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', '@rank_riseusa');
    setMeta('name', 'twitter:creator', '@rank_riseusa');
    setMeta('name', 'twitter:title', safeTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImg);

    // Structured JSON-LD Data
    let jsonLdScript = document.getElementById('page-json-ld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'page-json-ld';
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    const defaultWebPageLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: safeTitle,
      description,
      url: targetUrl,
      publisher: {
        "@type": "Organization",
        name: "RankRise USA",
        url: "https://rankriseusa.com/",
        logo: "https://rankriseusa.com/assets/images/logo1.webp",
      },
    };

    if (breadcrumbs && breadcrumbs.length > 0) {
      defaultWebPageLd.breadcrumb = {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b) => ({
          "@type": "ListItem",
          position: b.position,
          name: b.name,
          item: b.item,
        })),
      };
    }

    const finalSchema = schema || defaultWebPageLd;
    jsonLdScript.textContent = JSON.stringify(finalSchema);
  }, [title, description, canonical, url, image, keywords, publishedTime, modifiedTime, author, hreflangs, breadcrumbs, lang, schema, noIndex]);

  return null;
}
