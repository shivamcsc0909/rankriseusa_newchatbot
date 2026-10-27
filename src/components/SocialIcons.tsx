import React from 'react';

export interface SocialLink {
  name: string;
  label: string;
  href: string;
  brandColor: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  badgeClass: string;
  topBarClass: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    brandColor: '#0A66C2',
    textClass: 'text-[#0A66C2]',
    bgClass: 'bg-[#0A66C2]/15',
    borderClass: 'border-[#0A66C2]/40',
    glowClass: 'shadow-[0_0_12px_rgba(10,102,194,0.25)]',
    badgeClass: 'bg-[#0A66C2]/15 text-[#38bdf8] border-[#0A66C2]/40 hover:bg-[#0A66C2]/25 hover:border-[#0A66C2] hover:shadow-[0_0_16px_rgba(10,102,194,0.45)] hover:text-white',
    topBarClass: 'bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/40 hover:bg-[#0A66C2]/30 hover:border-[#0A66C2] hover:text-[#38bdf8]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92M7.86 18.5V10.13H5.07V18.5h2.79z" />
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    label: 'X (Twitter)',
    href: 'https://x.com/rank_riseusa',
    brandColor: '#FFFFFF',
    textClass: 'text-white',
    bgClass: 'bg-white/10',
    borderClass: 'border-white/30',
    glowClass: 'shadow-[0_0_12px_rgba(255,255,255,0.2)]',
    badgeClass: 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.35)]',
    topBarClass: 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/rankrise_usa',
    brandColor: '#E1306C',
    textClass: 'text-[#E1306C]',
    bgClass: 'bg-[#E1306C]/15',
    borderClass: 'border-[#E1306C]/40',
    glowClass: 'shadow-[0_0_12px_rgba(225,48,108,0.25)]',
    badgeClass: 'bg-[#E1306C]/15 text-[#f472b6] border-[#E1306C]/40 hover:bg-[#E1306C]/25 hover:border-[#E1306C] hover:shadow-[0_0_16px_rgba(225,48,108,0.45)] hover:text-white',
    topBarClass: 'bg-[#E1306C]/15 text-[#E1306C] border-[#E1306C]/40 hover:bg-[#E1306C]/30 hover:border-[#E1306C] hover:text-[#f472b6]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61592640990930#',
    brandColor: '#1877F2',
    textClass: 'text-[#1877F2]',
    bgClass: 'bg-[#1877F2]/15',
    borderClass: 'border-[#1877F2]/40',
    glowClass: 'shadow-[0_0_12px_rgba(24,119,242,0.25)]',
    badgeClass: 'bg-[#1877F2]/15 text-[#60a5fa] border-[#1877F2]/40 hover:bg-[#1877F2]/25 hover:border-[#1877F2] hover:shadow-[0_0_16px_rgba(24,119,242,0.45)] hover:text-white',
    topBarClass: 'bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/40 hover:bg-[#1877F2]/30 hover:border-[#1877F2] hover:text-[#60a5fa]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Threads',
    label: 'Threads',
    href: 'https://www.threads.com/@rankrise_usa',
    brandColor: '#F8FAFC',
    textClass: 'text-[#F8FAFC]',
    bgClass: 'bg-white/10',
    borderClass: 'border-white/30',
    glowClass: 'shadow-[0_0_12px_rgba(255,255,255,0.2)]',
    badgeClass: 'bg-white/10 text-slate-100 border-white/30 hover:bg-white/20 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.35)] hover:text-white',
    topBarClass: 'bg-white/10 text-slate-100 border-white/30 hover:bg-white/20 hover:border-white',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.186 24C5.584 24 0 18.643 0 12.083 0 5.485 5.584 0 12.186 0c6.49 0 11.758 5.176 11.814 11.597h-2.474c-.056-5.074-4.238-9.155-9.34-9.155-5.26 0-9.61 4.316-9.61 9.641 0 5.324 4.35 9.64 9.61 9.64 3.738 0 7.027-2.188 8.528-5.385H12.18v-2.443h10.985c.14 1.134.208 2.288.208 3.468C23.373 18.91 18.32 24 12.186 24z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    label: 'Pinterest',
    href: 'https://pin.it/7FLGsDMMU',
    brandColor: '#E60023',
    textClass: 'text-[#E60023]',
    bgClass: 'bg-[#E60023]/15',
    borderClass: 'border-[#E60023]/40',
    glowClass: 'shadow-[0_0_12px_rgba(230,0,35,0.25)]',
    badgeClass: 'bg-[#E60023]/15 text-[#f87171] border-[#E60023]/40 hover:bg-[#E60023]/25 hover:border-[#E60023] hover:shadow-[0_0_16px_rgba(230,0,35,0.45)] hover:text-white',
    topBarClass: 'bg-[#E60023]/15 text-[#E60023] border-[#E60023]/40 hover:bg-[#E60023]/30 hover:border-[#E60023] hover:text-[#f87171]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
      </svg>
    ),
  },
  {
    name: 'Medium',
    label: 'Medium',
    href: 'https://medium.com/@rankriseusa',
    brandColor: '#00AB6C',
    textClass: 'text-[#00AB6C]',
    bgClass: 'bg-[#00AB6C]/15',
    borderClass: 'border-[#00AB6C]/40',
    glowClass: 'shadow-[0_0_12px_rgba(0,171,108,0.25)]',
    badgeClass: 'bg-[#00AB6C]/15 text-[#34d399] border-[#00AB6C]/40 hover:bg-[#00AB6C]/25 hover:border-[#00AB6C] hover:shadow-[0_0_16px_rgba(0,171,108,0.45)] hover:text-white',
    topBarClass: 'bg-[#00AB6C]/15 text-[#00AB6C] border-[#00AB6C]/40 hover:bg-[#00AB6C]/30 hover:border-[#00AB6C] hover:text-[#34d399]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    name: 'Linktree',
    label: 'Linktree',
    href: 'https://linktr.ee/rankriseusa',
    brandColor: '#43E660',
    textClass: 'text-[#43E660]',
    bgClass: 'bg-[#43E660]/15',
    borderClass: 'border-[#43E660]/40',
    glowClass: 'shadow-[0_0_12px_rgba(67,230,96,0.25)]',
    badgeClass: 'bg-[#43E660]/15 text-[#4ade80] border-[#43E660]/40 hover:bg-[#43E660]/25 hover:border-[#43E660] hover:shadow-[0_0_16px_rgba(67,230,96,0.45)] hover:text-white',
    topBarClass: 'bg-[#43E660]/15 text-[#43E660] border-[#43E660]/40 hover:bg-[#43E660]/30 hover:border-[#43E660] hover:text-[#4ade80]',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M7.74 8.44H2.4l4.8 4.8-4.8 4.8h5.34l4.26-4.26v10.22h4v-10.22l4.26 4.26h5.34l-4.8-4.8 4.8-4.8h-5.34l-4.26 4.26V2.67h-4v10.03L7.74 8.44z" />
      </svg>
    ),
  },
];
