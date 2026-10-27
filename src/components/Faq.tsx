import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export const defaultFaqs: FaqItem[] = [
  {
    question: 'What SEO & Digital Marketing services does RankRise USA specialize in?',
    answer: (
      <span>
        RankRise USA provides high-impact digital growth services including AI-driven Search Engine Optimization (GEO/SEO), PPC Campaign Management (Google & Meta Ads), Neural Web Development, Social Amplification, and Custom AI Automation. Explore our full breakdown on our <Link to="/services" className="text-primary underline hover:text-white transition-colors font-bold">Services Page</Link>.
      </span>
    ),
  },
  {
    question: 'How quickly can I expect real results from an SEO or PPC campaign?',
    answer: (
      <span>
        Paid acquisition (PPC) injects targeted traffic and leads within 24 to 48 hours of launch. For organic search (SEO), initial keyword movement and ranking surges typically occur within 30 to 60 days, building long-term organic dominance. Check out our <Link to="/portfolio" className="text-primary underline hover:text-white transition-colors font-bold">Client Success Stories</Link> to see real timeline data.
      </span>
    ),
  },
  {
    question: 'How does RankRise USA differ from conventional marketing agencies?',
    answer: (
      <span>
        We eliminate fluff, vanity metrics, and black-box reporting. Every campaign we engineer focuses strictly on trackable revenue, high conversion rates, and clear ROI. Learn more about our real human squad and methodology on our <Link to="/about" className="text-primary underline hover:text-white transition-colors font-bold">About Us Page</Link>.
      </span>
    ),
  },
  {
    question: 'What is your 90-Day ROI and Performance Guarantee?',
    answer: (
      <span>
        We share the growth risk with our clients. If we do not hit our agreed-upon revenue or rank milestones within 90 days of strategy deployment, our team works at zero extra cost until those targets are achieved.
      </span>
    ),
  },
  {
    question: 'Do you offer custom packages for startups and established enterprises?',
    answer: (
      <span>
        Yes. We architect tailored growth blueprints whether you are an agile startup or a scaled enterprise. Review our <Link to="/pricing" className="text-primary underline hover:text-white transition-colors font-bold">Pricing & Investment Tiers</Link> or build a <Link to="/custom-plan" className="text-primary underline hover:text-white transition-colors font-bold">Custom Plan</Link>.
      </span>
    ),
  },
  {
    question: 'How do I get started with a Free SEO Audit for my website?',
    answer: (
      <span>
        Requesting your audit takes under 60 seconds. Simply visit our <Link to="/free-audit" className="text-primary underline hover:text-white transition-colors font-bold">Free Audit Page</Link> or click "Get Free Audit" in our main navigation bar. Our experts will analyze your digital footprint and send a custom action plan.
      </span>
    ),
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 lg:py-20 relative overflow-hidden bg-[#05070a]">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">
              Transparency & Knowledge
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-4 uppercase">
            Frequently Asked <br className="hidden sm:block" />
            <span className="text-gradient-gold italic">Questions.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-bold max-w-2xl mx-auto">
            Clear, honest answers about our AI SEO strategy, ROI guarantees, service timelines, and growth protocols.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 mb-12">
          {defaultFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white/[0.04] border-primary/40 shadow-[0_10px_30px_rgba(234,179,8,0.1)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-black text-white flex items-center gap-3">
                    <span className="text-primary text-xs font-black uppercase tracking-wider shrink-0">
                      0{index + 1}.
                    </span>
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-primary text-black rotate-180' : 'bg-white/5 text-white'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-0 text-white/80 font-medium text-sm leading-relaxed border-t border-white/5 mt-1">
                        <div className="pt-3">{faq.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Internal Linking Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-white/[0.03] to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
        >
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-1">Have a Custom Project or Question?</h3>
            <p className="text-white/60 text-xs sm:text-sm font-bold">
              Our growth strategists are ready to analyze your market position.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/contact">
              <Button className="bg-[#EAB308] hover:bg-[#D4A017] text-black font-black uppercase tracking-wider px-5 py-3 h-auto rounded-xl text-xs flex items-center gap-2">
                Ask Strategy Team
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-black uppercase tracking-wider px-5 py-3 h-auto rounded-xl text-xs">
                Explore Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
