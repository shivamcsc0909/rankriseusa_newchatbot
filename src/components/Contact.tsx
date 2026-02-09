import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Clock, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.', {
      icon: <CheckCircle className="w-5 h-5" />,
    });
    setFormData({ name: '', email: '', message: '', company: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email Us', 
      value: 'sid.rankriseusa@gmail.com',
      subtext: 'Get a response within 24 hours',
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: Phone, 
      label: 'Call Us', 
      value: '+917565031848',
      subtext: 'Mon-Fri, 9AM-6PM EST',
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: MapPin, 
      label: 'Visit Us', 
      value: 'San Francisco, CA',
      subtext: 'Remote-first, Global reach',
      color: 'from-green-500 to-emerald-500' 
    },
  ];

  const quickStats = [
    { label: 'Avg Response Time', value: '< 24hrs', icon: Clock },
    { label: 'Projects Started', value: '500+', icon: MessageCircle },
    { label: 'Global Clients', value: '200+', icon: Globe },
  ];

  return (
    <section id="contact" className="py-20 sm:py-24 relative overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-6"
          >
            <MessageCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">Let's Talk</span>
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Grow?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Book a free strategy call and let's discuss how we can scale your business
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-black mb-4 text-gray-900">Let's Build Something Amazing</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you need SEO, web development, or AI automation, we're here to help you dominate your market.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden">
                    {/* Background gradient on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5`}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <item.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">{item.label}</p>
                        <p className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500">{item.subtext}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 text-white mb-4">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-bold text-lg">Why Choose Us?</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {quickStats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1, type: 'spring' }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-purple-100">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Quick Response Guaranteed</h4>
                  <p className="text-sm text-gray-600">We respond within 24 hours on business days</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Form Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10 space-y-5">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Send Us a Message</h3>
                  <p className="text-sm text-gray-600">Fill out the form and we'll get back to you ASAP</p>
                </div>

                {/* Name Field */}
                <motion.div
                  animate={{
                    scale: focusedField === 'name' ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  animate={{
                    scale: focusedField === 'email' ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </motion.div>

                {/* Company Field */}
                <motion.div
                  animate={{
                    scale: focusedField === 'company' ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <Input
                    placeholder="Your Company Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    onFocus={() => setFocusedField('company')}
                    onBlur={() => setFocusedField(null)}
                    className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div
                  animate={{
                    scale: focusedField === 'message' ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell us about your project *
                  </label>
                  <Textarea
                    placeholder="I need help with..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={5}
                    className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 group relative overflow-hidden shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <motion.span
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10">Send Message</span>
                        <Send className="ml-2 relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Privacy Text */}
                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to our privacy policy. We'll never share your information.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}