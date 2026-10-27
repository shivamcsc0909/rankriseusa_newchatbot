// src/pages/PrivacyPolicyPage.tsx
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Globe, Eye, UserCheck, Scale, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'Introduction',
      content: 'Rankriseusa ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our digital marketing and IT services. It applies to all data processed by us, whether online or offline.'
    },
    {
      icon: Lock,
      title: 'Information We Collect',
      subsections: [
        { subtitle: 'Personal Data', text: 'Contact details: name, email address, phone number, company name. Account credentials, payment information, and direct communications.' },
        { subtitle: 'Automated Data', text: 'Browser type, device parameters, IP address, and usage patterns analyzed via secure neural protocols.' }
      ]
    },
    {
      icon: Scale,
      title: 'Legal Protocols',
      content: 'We process data based on explicit consent, contractual necessity, legitimate business interests, and legal obligations. For EEA residents, we strictly adhere to GDPR standards.'
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: 'We implement industry-standard encryption and multi-layer access controls. While no digital transmission is 100% secure, we deploy state-of-the-art defensive measures to protect your assets.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <Seo
        title="Privacy Policy | Data Protection & Privacy | RankRise USA"
        description="Learn how RankRise USA collects, uses, and safeguards your confidential data. Strict adherence to international privacy and data protection standards."
        canonical="https://rankriseusa.com/privacy-policy"
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Privacy Policy", item: "https://rankriseusa.com/privacy-policy" }
        ]}
      />
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
          >
            <Shield className="w-3 h-3 text-primary fill-primary/20" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Security Protocol v2.0</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter">
            Privacy <br />
            <span className="text-gradient-gold italic">Protocols.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Our commitment to data sovereignty and transparent intelligence processing. <br />
            <span className="text-primary/70 font-black text-xs uppercase tracking-widest">Effective January 1, 2026</span>
          </p>
        </div>

        {/* Content Grid */}
        <div className="max-w-5xl mx-auto space-y-12">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-12 md:p-16 rounded-[4rem] border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-700"
            >
              <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity group-hover:scale-110 duration-700">
                <section.icon className="w-48 h-48 text-primary" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-all duration-500 group-hover:-translate-y-2">
                  <section.icon className="w-10 h-10 text-primary" />
                </div>
                
                <div className="flex-grow">
                  <h2 className="text-4xl font-black text-foreground mb-8 tracking-tighter uppercase leading-none">{section.title}</h2>
                  {section.content && (
                    <p className="text-muted-foreground font-medium text-xl leading-relaxed">{section.content}</p>
                  )}
                  {section.subsections && (
                    <div className="grid md:grid-cols-2 gap-10 mt-10">
                      {section.subsections.map((sub, i) => (
                        <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                          <h3 className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">{sub.subtitle}</h3>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed">{sub.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[4.5rem] border-primary/20 bg-primary/[0.02] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <h2 className="text-4xl font-black text-foreground mb-12 tracking-tight relative z-10">Protocol Inquiries</h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto relative z-10">
              <div className="flex flex-col items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Email Terminal</div>
                  <a href="mailto:hr@Rankriseusa.com" className="text-2xl font-black text-foreground hover:text-primary transition-colors tracking-tighter">hr@Rankriseusa.com</a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-6 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all duration-500">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">HQ Coordinates</div>
                  <div className="text-lg font-black text-foreground tracking-tight">Washington, DC 20016, USA</div>
                </div>
              </div>
            </div>
            
            {/* Internal Navigation Outlinks */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm font-bold text-muted-foreground relative z-10">
              <Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                Contact Strategy Team <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/services" className="hover:text-primary transition-colors flex items-center gap-1">
                Explore Growth Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                Return to Base <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
