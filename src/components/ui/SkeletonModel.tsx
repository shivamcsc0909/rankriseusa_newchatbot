import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'default' | 'card' | 'circle' | 'text' | 'gold';
}

/**
 * Base Skeleton Component with cyber gold shimmer & dark luxury glow
 */
export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variantStyles = {
    default: 'bg-white/[0.06] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent',
    gold: 'bg-primary/10 border border-primary/20 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/15 before:to-transparent',
    card: 'bg-[#080b11]/90 border border-white/10 rounded-2xl relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent',
    circle: 'rounded-full bg-white/[0.08] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
    text: 'h-4 rounded-md bg-white/[0.07] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent',
  };

  return (
    <div
      className={cn(
        'animate-pulse rounded-lg',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton for Hero Sections across Pages
 */
export function SkeletonHero({ title = true, subtitle = true }: { title?: boolean; subtitle?: boolean }) {
  return (
    <div className="w-full pt-32 pb-16 px-4 max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
      {/* Badge Shimmer */}
      <Skeleton className="h-8 w-48 rounded-full bg-primary/15 border border-primary/25" />

      {/* Main Title Shimmer */}
      {title && (
        <div className="space-y-3 w-full max-w-3xl flex flex-col items-center">
          <Skeleton className="h-10 sm:h-14 w-4/5 rounded-2xl bg-white/10" />
          <Skeleton className="h-10 sm:h-14 w-3/5 rounded-2xl bg-white/10" />
        </div>
      )}

      {/* Subtitle Shimmer */}
      {subtitle && (
        <div className="space-y-2 w-full max-w-xl flex flex-col items-center pt-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
      )}

      {/* Action Buttons Shimmer */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Skeleton className="h-12 w-40 rounded-full bg-primary/20" />
        <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

/**
 * Skeleton for Service/Feature/Portfolio Cards
 */
export function SkeletonCard({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 sm:p-8 rounded-3xl bg-[#080b11]/90 border border-white/10 space-y-5 relative overflow-hidden"
        >
          {/* Icon shimmer */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25" />
            <Skeleton className="w-8 h-4 rounded-full bg-white/10" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>

          {/* Badges / Features list */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <Skeleton className="h-3 w-4/5 rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>

          {/* CTA Link Shimmer */}
          <div className="pt-2 flex justify-between items-center">
            <Skeleton className="h-4 w-24 rounded-md bg-primary/20" />
            <Skeleton className="w-6 h-6 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Interactive Map / Global Presence
 */
export function SkeletonMap({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full h-[450px] sm:h-[500px] rounded-[2rem] bg-[#080b11] border border-primary/20 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between',
        className
      )}
    >
      {/* Map Header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-lg bg-primary/20" />
          <Skeleton className="h-4 w-64 rounded-md bg-white/10" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-8 w-24 rounded-full bg-primary/15" />
        </div>
      </div>

      {/* Pulsing Coordinates Shimmer */}
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="absolute top-1/4 left-1/4 flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full bg-primary animate-ping" />
          <Skeleton className="h-3 w-20 rounded bg-white/10" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full bg-primary/80 animate-ping" />
          <Skeleton className="h-3 w-24 rounded bg-white/10" />
        </div>
        <div className="absolute top-1/3 right-1/4 flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full bg-primary/50 animate-ping" />
          <Skeleton className="h-3 w-16 rounded bg-white/10" />
        </div>
        <Skeleton className="w-64 h-32 rounded-3xl bg-white/[0.03] border border-white/5" />
      </div>

      {/* Map Footer Pins */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 z-10 pt-4 border-t border-white/5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-full bg-primary/30" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for Blog Posts List
 */
export function SkeletonBlogList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-3xl overflow-hidden border-white/10 p-4 space-y-4"
        >
          {/* Cover image shimmer */}
          <Skeleton className="w-full h-52 rounded-2xl bg-white/10" />

          {/* Meta tags */}
          <div className="flex items-center justify-between px-2">
            <Skeleton className="h-5 w-20 rounded-full bg-primary/15" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>

          {/* Title & snippet */}
          <div className="space-y-2 px-2">
            <Skeleton className="h-6 w-5/6 rounded-lg bg-white/10" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          {/* Footer author & link */}
          <div className="pt-3 px-2 flex items-center justify-between border-t border-white/5">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-4 w-16 rounded-md bg-primary/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for Blog Post Details
 */
export function SkeletonBlogDetail() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb shimmer */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <span className="text-white/20">/</span>
          <Skeleton className="h-4 w-20 rounded" />
          <span className="text-white/20">/</span>
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-28 rounded-full bg-primary/20" />
          <Skeleton className="h-10 sm:h-14 w-full rounded-2xl bg-white/10" />
          <Skeleton className="h-10 sm:h-14 w-4/5 rounded-2xl bg-white/10" />
        </div>

        {/* Author meta row */}
        <div className="flex items-center justify-between py-4 border-y border-white/10">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-3 w-36 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
            <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
          </div>
        </div>

        {/* Featured image shimmer */}
        <Skeleton className="w-full h-80 sm:h-[420px] rounded-3xl bg-white/10 border border-white/10" />

        {/* Body content paragraphs shimmer */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-11/12 rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <div className="py-4">
            <Skeleton className="h-8 w-1/2 rounded-xl bg-white/10" />
          </div>
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-5/6 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Universal Full-Page Skeleton (Used for Suspense / Page Transitions)
 */
export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-foreground">
      {/* Top Banner / Hero Skeleton */}
      <SkeletonHero />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-16">
        {/* Metrics / Highlight Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#080b11] border border-white/10 flex flex-col items-center justify-center space-y-2"
            >
              <Skeleton className="h-8 w-20 rounded-lg bg-primary/20" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          ))}
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <Skeleton className="h-4 w-32 rounded-full mx-auto bg-primary/20" />
          <Skeleton className="h-8 w-3/4 rounded-xl mx-auto bg-white/10" />
          <Skeleton className="h-4 w-5/6 rounded mx-auto" />
        </div>

        {/* Grid Cards Skeleton */}
        <SkeletonCard count={6} />

        {/* Bottom CTA Banner Skeleton */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#080b11] border border-primary/25 relative overflow-hidden flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-8 w-3/5 max-w-lg rounded-xl bg-white/10" />
          <Skeleton className="h-4 w-2/5 max-w-md rounded-md" />
          <Skeleton className="h-12 w-48 rounded-full bg-primary/25 mt-2" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
