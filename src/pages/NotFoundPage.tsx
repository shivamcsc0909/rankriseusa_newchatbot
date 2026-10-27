import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Seo from '@/components/seo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden flex items-center justify-center">
      <Seo
        title="404 - Page Not Found | RankRise USA"
        description="The requested page could not be found on RankRise USA. Explore our services or return to home."
        canonical="https://rankriseusa.com/404"
        noIndex={true}
      />
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[180px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <AlertCircle className="w-4 h-4 text-primary" />
          <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">404 - Vector Not Found</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tighter">
          Page <span className="text-gradient-gold italic">Not Found</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          The node or matrix endpoint you requested does not exist or has been relocated within the network.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button className="h-14 px-8 rounded-full button-premium font-black uppercase tracking-widest text-sm inline-flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              Return to Nexus
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-sm inline-flex items-center gap-3 border-white/10 hover:bg-white/5">
              Explore Services
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
