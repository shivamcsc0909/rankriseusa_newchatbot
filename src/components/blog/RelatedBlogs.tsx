import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface RelatedBlogsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export default function RelatedBlogs({ currentPost, allPosts }: RelatedBlogsProps) {
  const related = allPosts
    .filter(
      p =>
        p.id !== currentPost.id &&
        p.status === 'published' &&
        (p.category === currentPost.category || p.tags.some(t => currentPost.tags.includes(t)))
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-white/10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2">
            Continue Reading
          </span>
          <h3 className="text-3xl font-black text-foreground">
            Related <span className="text-gradient-gold italic">Intelligence.</span>
          </h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((article, i) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <Link to={`/blog/${article.slug}`}>
              <div className="glass-card rounded-[2rem] overflow-hidden border-white/5 group-hover:border-primary/30 transition-all h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    width={600}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-xl glass-card border-white/10 text-[9px] font-black uppercase tracking-widest text-primary">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      {article.reading_time}
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-muted-foreground text-xs font-medium leading-relaxed mb-6 line-clamp-2 flex-grow">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                      {article.author_name}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
