import { useState } from 'react';
import { Share2, Link2, Check, Twitter, Linkedin, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BlogShareButtonsProps {
  title: string;
  url: string;
}

export default function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-sky-400 hover:border-sky-400/40',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-500 hover:border-blue-500/40',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-600 hover:border-blue-600/40',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`,
      color: 'hover:text-primary hover:border-primary/40',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10 my-8">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mr-2">
        <Share2 className="w-4 h-4 text-primary" />
        <span>Share Article</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="h-10 px-4 rounded-xl border-white/10 bg-white/5 hover:border-primary/40 text-xs font-bold gap-2 transition-all"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4 text-primary" />}
        {copied ? 'Copied' : 'Copy Link'}
      </Button>

      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${link.name}`}
            className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground transition-all ${link.color}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
