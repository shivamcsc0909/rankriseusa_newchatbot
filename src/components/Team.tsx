import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Linkedin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const team = [
    {
      name: 'Shivam Pandey',
      role: 'Technical Lead & Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/shivampandey-tech/',
      portfolio: 'https://shivam-pandey.com/',
    },
    {
      name: 'Vibhor',
      role: 'Performance Marketing Specialist',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Saumya',
      role: 'SEO Specialist',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Sid',
      role: 'Sales Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Mike',
      role: 'Sales Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Meera',
      role: 'Sales Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Luna',
      role: 'Business Development Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Aady',
      role: 'Client Relationship Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Vedant',
      role: 'Finance Manager',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
    {
      name: 'Sam',
      role: 'Operations Executive',
      linkedin: 'https://www.linkedin.com/in/rankrise-usa-9b86a5425/',
    },
  ];

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 4;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const maxIndex = Math.max(0, team.length - itemsPerView);

  const cardWidthClasses = [
    'w-full',
    'sm:w-[calc(50%-12px)]',
    'lg:w-[calc(33.333%-16px)]',
    'xl:w-[calc(25%-18px)]',
  ].join(' ');

  return (
    <section className="py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Our Team</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground mb-4 leading-[1.1]"
            >
              Meet Our <br />
              <span className="text-gradient-gold italic">Team</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-200 lg:max-w-md leading-relaxed font-medium"
          >
            Leadership, development, marketing, sales, finance and operations professionals working together to deliver exceptional digital solutions.
          </motion.p>
        </div>

        {/* Team Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 px-2"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 ${cardWidthClasses}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="glass-card rounded-[2rem] p-6 sm:p-8 border-white/10 hover:border-primary/40 bg-[#080b11]/90 transition-all duration-500 group relative h-full flex flex-col justify-between shadow-xl">
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />

                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                          <img
                            src="/assets/images/logo1.webp"
                            width={28}
                            height={28}
                            loading="lazy"
                            decoding="async"
                            className="w-7 invert opacity-70"
                            alt="RankRise USA Logo Icon"
                          />
                        </div>
                        <div className="flex gap-2">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} LinkedIn`}
                              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#0a66c2] hover:bg-[#0a66c2]/20 hover:border-[#0a66c2]/50 hover:shadow-[0_0_15px_rgba(10,102,194,0.5)] transition-all"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="space-y-1.5 relative z-10">
                        <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons / links */}
                    <div className="mt-6 pt-5 border-t border-white/10 relative z-10 flex flex-col gap-2.5">
                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-black border border-primary/40 font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md group/port"
                        >
                          <span>View Portfolio</span>
                          <ExternalLink className="w-3 h-3 group-hover/port:translate-x-0.5 transition-transform" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Linkedin className="w-3 h-3 text-[#0a66c2]" />
                          <span>Connect on LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8 sm:mt-10 px-2">
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === currentIndex ? 'w-10 bg-primary' : 'w-3 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-white/10 bg-white/5 hover:border-primary/50 text-foreground disabled:opacity-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-white/10 bg-white/5 hover:border-primary/50 text-foreground disabled:opacity-20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 sm:mt-16 flex justify-center"
        >
          <Button className="h-11 sm:h-12 px-6 sm:px-8 rounded-full text-xs font-black uppercase tracking-widest button-premium mx-auto">
            Join Our Neural Network
          </Button>
        </motion.div>
      </div>
    </section>
  );
}