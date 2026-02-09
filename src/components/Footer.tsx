import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail, ArrowUp, Heart, Sparkles, MapPin, Phone, MessageCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Welcome aboard! Check your inbox for exclusive content 🎉');
    setEmail('');
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:bg-blue-500', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: Linkedin, href: '#', color: 'hover:bg-blue-600', label: 'LinkedIn' },
    { icon: Instagram, href: '#', color: 'hover:bg-pink-500', label: 'Instagram' },
  ];

  const footerLinks = {
    "Web Development": [
      { name: 'React JS Development', path: '/services' },
      { name: 'MERN Stack Development', path: '/services' },
      { name: 'MEAN Stack Development', path: '/services' },
      { name: 'Full Stack Solutions', path: '/services' },
    ],
    "Mobile Apps": [
      { name: 'Flutter Android Apps', path: '/services' },
      { name: 'Flutter iOS Apps', path: '/services' },
      { name: 'React Native Apps', path: '/services' },
      { name: 'Cross-Platform Apps', path: '/services' },
    ],
    "AI & Software": [
      { name: 'Python Development', path: '/services' },
      { name: 'Java Applications', path: '/services' },
      { name: 'Blockchain Solutions', path: '/services' },
      { name: 'Machine Learning AI', path: '/services' },
    ],
    "Company": [
      { name: 'About Us', path: '/about' },
      { name: 'Our Services', path: '/services' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Success Stories', path: '/blog' },
    ],
    "Resources": [
      { name: 'Free SEO Audit', path: '/free-audit' },
      { name: 'Pricing Plans', path: '/pricing' },
      { name: 'Case Studies', path: '/portfolio' },
      { name: 'Get in Touch', path: '/contact' },
    ]
  };

  const legalPages = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
    { name: 'Refund / Cancellation', path: '/refund-cancellation' },
    { name: 'Cookies Policy', path: '/cookies-policy' },
    { name: 'Disclaimer', path: '/disclaimer' },
  ];

  const address = "Address coming soon...";
  const mobileNumbers = [
    { number: "+91 7565031848", whatsapp: "917565031848" },
    { number: "+91 7704 074 403", whatsapp: "917704074403" }
  ];

  const emailAddresses = [
    { email: "hr@rankriseusa.com", label: "HR Department" },
    { email: "sid.rankriseusa@gmail.com", label: "General Inquiries" }
  ];
  
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.060173769528!2d77.49818857526816!3d28.47447587575122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce826aafbd3c9%3A0x5e9373f4e7d8d2f7!2sAmarpali%20Leisure%20Park%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1699623456789!5m2!1sen!2sin`;

  const internationalBranches = [
    { country: 'USA', status: 'Coming Soon', flag: '🇺🇸' },
    { country: 'UK', status: 'Coming Soon', flag: '🇬🇧' },
    { country: 'UAE', status: 'Coming Soon', flag: '🇦🇪' },
    { country: 'India', status: 'Current', flag: '🇮🇳' },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        {/* Dot Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Footer Content - Compact Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 mb-6">
          {/* Brand & Newsletter Section - 3 columns */}
          <div className="lg:col-span-3">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 mb-3 cursor-pointer group"
              >
                <motion.img
                  src="/assets/images/logo.png"
                  alt="Rankrise Logo"
                  className="h-12 w-auto object-contain"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            </Link>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              Digital growth partners for ambitious startups. Smart marketing & powerful tech.
            </p>
            
            {/* Newsletter */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <p className="text-white font-semibold text-sm">Weekly Growth Tips</p>
              </div>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-400 h-10 text-sm"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 h-10"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, color, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-full bg-white/10 hover:text-white flex items-center justify-center transition-all ${color} text-gray-300`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services Links - 5 columns */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(footerLinks).map(([title, links], columnIndex) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: columnIndex * 0.1 }}
                >
                  <h3 className="font-bold text-white mb-3 text-sm">{title}</h3>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link to={link.path}>
                          <motion.span
                            whileHover={{ x: 3 }}
                            className="text-gray-300 hover:text-purple-400 transition-colors inline-block cursor-pointer text-xs"
                          >
                            {link.name}
                          </motion.span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact & Map Section - 4 columns */}
          <div className="lg:col-span-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-white mb-3 text-sm">Contact Info</h3>
                
                {/* Address */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-xs leading-relaxed">
                    {address}
                  </p>
                </div>

                {/* Mobile Numbers */}
                <div className="space-y-2 mb-3">
                  {mobileNumbers.map((mobile, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <a 
                        href={`tel:${mobile.number}`}
                        className="text-gray-300 hover:text-purple-400 text-xs transition-colors"
                      >
                        {mobile.number}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Email Addresses */}
                <div className="space-y-2 mb-3">
                  {emailAddresses.map((emailItem, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <a 
                        href={`mailto:${emailItem.email}`}
                        className="text-gray-300 hover:text-purple-400 text-xs break-all transition-colors"
                      >
                        {emailItem.email}
                      </a>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Button */}
                <motion.a
                  href={`https://wa.me/${mobileNumbers[0].whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-fit transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </motion.a>
              </div>

              {/* Map & International */}
              <div className="space-y-4">
                {/* Map */}
                <div className="bg-white/10 rounded-lg border border-white/20 p-3">
                  <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    Our Location
                  </h4>
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Rankrise Office Location"
                      className="filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* International Branches */}
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <h4 className="text-white text-sm font-semibold">Global Presence</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {internationalBranches.map((branch, index) => (
                      <motion.div
                        key={branch.country}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                          branch.status === 'Current' 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-yellow-500/20 border border-yellow-500/30'
                        }`}
                      >
                        <span className={`flex items-center gap-1 font-medium ${
                          branch.status === 'Current' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          <span className="text-base">{branch.flag}</span>
                          <span>{branch.country}</span>
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Bottom Section - Compact */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-gray-400 text-xs text-center md:text-left">
            <div className="flex items-center gap-1">
              <span>© 2026 Rankrise USA.</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              </motion.span>
            </div>
            <span className="hidden md:inline">|</span>
            <span>Transforming businesses with cutting-edge solutions</span>
          </div>
           <span className="hidden md:inline">|</span>
            <span className="mr-1">Designed &amp; developed by</span>
            <a
      href="https://shivam-portfolio-pandey.netlify.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline hover:text-white transition-colors"
      aria-label="Open Shivam Pandey portfolio in a new tab"
    >
      Shivam Pandey
    </a>
         
          
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {legalPages.map((page, index) => (
              <Link to={page.path} key={page.name}>
                <motion.span
                  whileHover={{ scale: 1.05, color: '#a78bfa' }}
                  className="text-gray-400 hover:text-purple-400 text-xs cursor-pointer transition-colors"
                >
                  {page.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        // className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/50 transition-all z-50 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.div>
        
        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          initial={{ scale: 0, opacity: 0.5 }}
          whileHover={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </footer>
  );
}
