/**
 * Security & Sanitization engine for Profile Submissions and Commenting System.
 * Includes XSS prevention, HTML sanitization, input validation, honeypot detection, and rate limiting.
 */

import DOMPurify from 'dompurify';

const BLOG_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'div', 'span', 'section',
  'ul', 'ol', 'li',
  'a', 'strong', 'em', 'b', 'i', 'u', 's', 'blockquote', 'code', 'pre',
  'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const BLOG_ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'width', 'height', 'loading', 'decoding', 'target', 'rel',
];

/** Sanitize CMS / blog HTML for safe rendering. */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  if (typeof window !== 'undefined' && DOMPurify?.sanitize) {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: BLOG_ALLOWED_TAGS,
      ALLOWED_ATTR: BLOG_ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta', 'style', 'base'],
      FORBID_ATTR: ['style', 'onerror', 'onclick', 'onload', 'onmouseover'],
    });
  }

  // SSR / non-DOM fallback (regex — DOMPurify preferred in browser)
  let clean = input;
  clean = clean.replace(/<(script|iframe|object|embed|style|link|template|applet|form)[^>]*>[\s\S]*?<\/\1>/gi, '');
  clean = clean.replace(/<(script|iframe|object|embed|style|link|template|applet|meta|base|form)[^>]*\/?>/gi, '');
  clean = clean.replace(/\son\w+\s*=\s*(['"])(.*?)\1/gi, '');
  clean = clean.replace(/\son\w+\s*=\s*[^>\s]+/gi, '');
  clean = clean.replace(/(href|src|action)\s*=\s*(['"])\s*(javascript|vbscript|data):.*?\2/gi, '$1="#"');
  clean = clean.replace(/(href|src|action)\s*=\s*(javascript|vbscript|data):[^\s>]+/gi, '$1="#"');
  return clean.trim();
}

// Input Validation utilities
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 150;
}

export function validateUrl(url: string): boolean {
  if (!url || url.trim() === '') return true; // Optional field
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim() === '') return true; // Optional field
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/;
  return phoneRegex.test(phone.trim());
}

export function validateText(text: string, minLength: number = 1, maxLength: number = 2000): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

// Honeypot check for spam bots
export function isHoneypotTriggered(hpValue?: string): boolean {
  return typeof hpValue === 'string' && hpValue.trim().length > 0;
}

// Client-side Rate Limiting helper
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(actionKey: string, maxCount: number = 5, windowMs: number = 60000): { allowed: boolean; waitSeconds: number } {
  const now = Date.now();
  const timestamps = rateLimitMap.get(actionKey) || [];
  
  // Filter out timestamps outside the time window
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= maxCount) {
    const oldest = validTimestamps[0];
    const waitMs = windowMs - (now - oldest);
    return {
      allowed: false,
      waitSeconds: Math.ceil(waitMs / 1000)
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(actionKey, validTimestamps);
  return { allowed: true, waitSeconds: 0 };
}
