import React, { useState, useEffect, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  className?: string;
  rootMargin?: string;
}

export default function LazySection({
  children,
  minHeight = '300px',
  className = '',
  rootMargin = '300px 0px',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;

    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minHeight: !isVisible ? minHeight : undefined }}
    >
      {isVisible ? children : null}
    </div>
  );
}
