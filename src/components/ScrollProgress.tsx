import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scaleX, setScaleX] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScaleX(window.scrollY / totalHeight);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent origin-left z-50 transition-transform duration-75 ease-out"
      style={{ transform: `scaleX(${scaleX})`, transformOrigin: 'left' }}
    />
  );
}
