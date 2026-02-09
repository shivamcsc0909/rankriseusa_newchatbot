import { motion } from 'framer-motion';
import Contact from '../components/Contact';
import { Phone, Mail, MapPin, MessageCircle, Star, Clock, Users, CheckCircle, Globe, Target, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const whatsappLink = "https://wa.me/917565031848";
  const phoneNumber1 = "+91 75650 31848";
  const phoneNumber2 = "+91 77040 74403";
  const emails = [
    "sid.rankriseusa@gmail.com",
    "hr@rankriseusa.com", 
    "support@rankriseusa.com"
  ];
  const address = "Address available soon....";

  const quickActions = [
    { 
      icon: Phone, 
      label: 'Call Us', 
      value: phoneNumber1, 
      color: 'from-blue-500 to-cyan-500',
      link: `tel:${phoneNumber1}`,
      description: 'Speak directly with our team'
    },
    { 
      icon: Mail, 
      label: 'Email Us', 
      value: 'Multiple Options', 
      color: 'from-purple-500 to-pink-500',
      link: `mailto:${emails[0]}`,
      description: 'Choose from different departments'
    },
    { 
      icon: MessageCircle, 
      label: 'WhatsApp', 
      value: 'Instant Chat', 
      color: 'from-green-500 to-emerald-500',
      link: whatsappLink,
      description: 'Quick answers and support'
    },
    { 
      icon: MapPin, 
      label: 'Visit Office', 
      value: 'Greater Noida', 
      color: 'from-orange-500 to-red-500',
      description: 'Meet us in person'
    },
  ];

  const officeLocations = [
    {
      country: "India",
      status: "active",
      flag: "🇮🇳",
      address: address,
      phone: phoneNumber1,
      hours: "Mon - Sat: 9:00 AM - 7:00 PM",
      team: "Full Service Team Available",
      features: ["SEO Experts", "Web Developers", "AI Specialists", "24/7 Support"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      country: "United States",
      status: "coming",
      flag: "🇺🇸",
      address: "Coming Soon - 2026",
      features: ["Digital Marketing", "AI Automation", "Enterprise Solutions"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      country: "United Kingdom", 
      status: "coming",
      flag: "🇬🇧",
      address: "Coming Soon - 2026",
      features: ["SEO Services", "Web Development", "Growth Marketing"],
      gradient: "from-red-500 to-pink-500"
    },
    {
      country: "United Arab Emirates",
      status: "coming", 
      flag: "🇦🇪",
      address: "Coming Soon - 2026",
      features: ["Digital Transformation", "E-commerce Solutions", "Market Entry"],
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      country: "Australia",
      status: "coming", 
      flag: "🇦🇺",
      address: "Coming Soon - 2026",
      features: ["Digital Strategy", "Web Development", "Local SEO"],
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      country: "Canada",
      status: "coming", 
      flag: "🇨🇦",
      address: "Coming Soon - 2026",
      features: ["AI Solutions", "Web Development", "Digital Marketing"],
      gradient: "from-red-500 to-orange-500"
    }
  ];

  const stats = [
    { value: "24-48h", label: "Response Time" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "15+", label: "Experts Team" },
    { value: "50+", label: "Projects Completed" }
  ];

  const features = [
    {
      icon: Target,
      title: "Goal-Oriented Approach",
      description: "We align our strategies with your business objectives for maximum impact"
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Quick turnaround times without compromising on quality"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled professionals with diverse digital marketing expertise"
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "Track record of delivering measurable business growth"
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 sm:px-6 py-2.5 rounded-full mb-4 sm:mb-6"
            >
              <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-primary" />
              <span className="text-xs sm:text-sm font-medium">Let's Build Something Amazing</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Ready to <span className="text-gradient bg-gradient-to-r from-primary to-primary/70">Grow</span> Together?
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Get in touch with our expert team and let's discuss how we can transform your digital presence and drive real results for your business.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4"
            >
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 text-sm sm:text-base h-11 sm:h-12 shadow-lg hover:shadow-xl transition-all">
                Start Your Project
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base h-11 sm:h-12 border-2 hover:bg-primary/5">
                Book a Consultation
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center p-4 sm:p-5 bg-white dark:bg-card rounded-xl sm:rounded-2xl border-2 border-primary/10 hover:border-primary/30 transition-all group shadow-sm hover:shadow-md"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Why Choose <span className="text-gradient">RankRise</span>?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              We combine expertise, innovation, and dedication to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-border hover:shadow-xl transition-all duration-500 group text-center hover:border-primary/20 h-full flex flex-col"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Quick Actions */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Multiple Ways to <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Choose your preferred method to get in touch with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8
                }}
                className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer border border-border hover:shadow-2xl transition-all duration-500 group h-full flex flex-col"
                onClick={() => action.link && window.open(action.link, '_blank')}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center">{action.label}</h3>
                <p className="text-primary font-semibold text-base sm:text-lg text-center mb-2 sm:mb-3">{action.value}</p>
                <p className="text-muted-foreground text-sm text-center flex-grow">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Let's Talk Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-3 sm:mb-4"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-semibold">Let's Talk</span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Ready to <span className="text-gradient">Grow?</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Book a free strategy call and let's discuss how we can help transform your digital presence
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-5 sm:gap-6">
              {/* Greater Noida Office Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative bg-white dark:bg-card rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-green-500/20 overflow-hidden group hover:border-green-500/40 transition-all duration-500">
                  {/* Decorative Gradient Blob */}
                  <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="mb-5 sm:mb-6">
                      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 via-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl sm:text-2xl md:text-3xl mb-2">Greater Noida Office</h3>
                          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-950/50 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-700 dark:text-green-300 font-semibold text-xs">Fully Operational</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Details */}
                    <div className="space-y-3 mb-5 sm:mb-6">
                      {/* Address */}
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg sm:rounded-xl hover:from-muted to-muted/60 transition-all border border-border/50">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm leading-relaxed font-medium">{address}</p>
                      </div>
                      
                      {/* Phone */}
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg sm:rounded-xl hover:from-muted to-muted/60 transition-all border border-border/50">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1.5">
                          <a href={`tel:${phoneNumber1}`} className="text-sm hover:text-primary transition-colors block font-semibold">
                            {phoneNumber1}
                          </a>
                          <a href={`tel:${phoneNumber2}`} className="text-sm hover:text-primary transition-colors block font-semibold">
                            {phoneNumber2}
                          </a>
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg sm:rounded-xl hover:from-muted to-muted/60 transition-all border border-border/50">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1.5">
                          {emails.map((email, index) => (
                            <a 
                              key={index} 
                              href={`mailto:${email}`} 
                              className="text-sm hover:text-primary transition-colors block font-semibold"
                            >
                              {email}
                            </a>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hours & Team */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800/30">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold">Mon - Sat: 9AM-7PM</span>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800/30">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold">Full Service Team</span>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                        {officeLocations[0].features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/40 dark:to-emerald-950/30 p-2.5 sm:p-3 rounded-lg border border-green-200 dark:border-green-800/30">
                            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs font-bold text-green-800 dark:text-green-200">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 justify-center text-sm font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                      <a 
                        href={`tel:${phoneNumber1}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 justify-center text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Now</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Send us a Message Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative bg-white dark:bg-card rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-primary/10 overflow-hidden group hover:border-primary/30 transition-all duration-500">
                  {/* Decorative Gradient Blobs */}
                  <div className="absolute -top-20 -right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-20 -left-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative">
                    {/* Header with Icon */}
                    <div className="mb-5 sm:mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/20 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Send us a Message</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">We'll respond within 24 hours</p>
                    </div>
                    
                    {/* Trust Badge */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4 mb-5 sm:mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-1 text-green-900 dark:text-green-100">100% Confidential</p>
                          <p className="text-xs text-green-700 dark:text-green-300">Your information is secure and will only be used to contact you</p>
                        </div>
                      </div>
                    </div>
                    
                    <Contact />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Map Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Find Our <span className="text-gradient">Location</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Visit our India Operation Center in Greater Noida
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="relative bg-card backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
              
              {/* Header Section */}
              <div className="relative p-5 sm:p-6 md:p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl md:text-2xl mb-1">Greater Noida, India</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm text-green-600 font-medium">Office Open Now</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto sm:ml-auto">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>
                
                <p className="text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base">{address}</p>
              </div>

              {/* Map Container */}
              <div className="relative p-3 sm:p-4 md:p-6">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-border/30">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="India Operation Center Location Map"
                    className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] brightness-95"
                  />
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Working Hours</p>
                        <p className="text-xs sm:text-sm font-semibold">Mon-Sat: 9AM-7PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200/50 dark:border-green-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quick Call</p>
                        <p className="text-xs sm:text-sm font-semibold">{phoneNumber1}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">WhatsApp</p>
                        <p className="text-xs sm:text-sm font-semibold">Instant Support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compact International Offices Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-3 sm:mb-4">
              <Globe className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Global Expansion 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              International <span className="text-gradient">Branches Coming Soon</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Expanding globally to serve you better across different time zones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {officeLocations.slice(1).map((office, index) => (
              <motion.div
                key={office.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 border border-border relative overflow-hidden group hover:shadow-xl transition-all duration-500 h-full flex flex-col"
              >
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-500 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
                  2026
                </div>
                
                <div className={`bg-gradient-to-r ${office.gradient} rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-white`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{office.flag}</span>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">{office.country}</h3>
                      <span className="text-white/90 text-xs">Coming Soon</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{office.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Planned Services:</h4>
                    <div className="space-y-2">
                      {office.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${office.gradient}`}></div>
                          <span className="text-xs text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 cursor-not-allowed opacity-50 text-xs h-9"
                  disabled
                >
                  Coming Soon
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto mt-10 sm:mt-12"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-blue-200/50 dark:border-blue-800/30 shadow-lg">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Global Expansion 2026</h3>
              <p className="text-muted-foreground text-sm mb-5 sm:mb-6 max-w-xl mx-auto">
                Expanding to 5 international locations. Be first to know when we launch.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600 px-5 sm:px-6 py-2 h-10 text-sm">
                Notify Me
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}