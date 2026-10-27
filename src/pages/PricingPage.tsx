// src/pages/PricingPage.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Share2, Megaphone, Code, Sparkles, Calculator,
  X, Check, Shield, CreditCard, Smartphone, Cloud, Database,
  Globe, Lock, PenTool, Star, Rocket, Crown, Zap, Briefcase,
  TrendingUp, Users, Settings, HardDrive, Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitToSheet } from '@/lib/utils';

// Types
interface PricingPlan {
  name: string;
  icon?: string;
  monthlyPrice?: number;        // undefined for custom quote
  isCustom?: boolean;
  description?: string;
  popular?: boolean;
  features?: string[];
  services?: any[];              // kept for compatibility
  technology?: string;           // for app dev, ai, software tools
  featuresFunctionality?: string;
}

interface PricingData {
  [key: string]: PricingPlan[];
}

export default function PricingPage() {
  const [selectedCategory, setSelectedCategory] = useState('seo');
  const [duration, setDuration] = useState<1 | 3 | 6 | 9 | 12>(1);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan & { category: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    phone: '',
    budget: '',
    businessType: '',
    technology: '',
    features: ''
  });

  // small helper to format currency
  function fmtCurrency(n: number) {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Discount factors (multiplier for total price)
  const discountFactor: Record<number, number> = {
    1: 1,
    3: 0.94,    // 6% off
    6: 0.85,    // 15% off
    9: 0.80,    // 20% off
    12: 0.75    // 25% off
  };

  // Pricing data for all categories
  const pricingData: PricingData = {
    // SEO – detailed packages from your input
    seo: [
      {
        name: 'BASIC',
        monthlyPrice: 500,
        popular: false,
        features: [
          'No. of Keywords – 30',
          'Landing Pages – 5',
          'Backlinks (per month) – 90',
          'GBP (GMB) – ✘',
          'Geotagging – ✘',
          'First Hand SEO Analysis – ✓',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Breadcrumb – ✘',
          '--- On-page Optimization ---',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization – ✘',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site Navigation Analysis – ✘',
          '404 Page Implementation – ✓',
          'Broken Links Check – ✘',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'php Sitemap Setup – ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data Setup – ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) – Applicable from 3rd month – 1',
          '--- Off-page Optimization ---',
          'Search Engine Submission – 10',
          'Article Writing – 1',
          'Article Posting – 1',
          'Article Bookmarking – 10',
          'Classified Submissions – 10',
          'Business Listing – 5',
          'Blog Writing – 1',
          'Blog Posting – 1',
          'Blog Bookmarking – 10',
          'On page Blog – 1',
          'On Page Blog Bookmarking – 5',
          'Image sharing – 5',
          'PPT Submissions – 1',
          'PPT Bookmarking – 10',
          'Social Bookmarking – 30',
          'PDF Sharing – 1',
          'PDF bookmarking – 5',
          'Profile Creation – 5',
          'Quora Answering – 1',
          'Info Graphic Creation – 1',
          'Info Graphic Bookmarking – 5',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',
          '--- SMO (not included) ---',
          'Facebook Profile Creation – ✘',
          'Facebook Fan Page Creation – ✘',
          'Facebook Posting & Sharing – ✘',
          'Instagram Business Profile Creation – ✘',
          'Creation of Interactive Branded Hashtag – ✘',
          'Instagram Posting – ✘',
          'Twitter Profile Creation – ✘',
          'Twitter Post – ✘',
          'Pinterest Account Creation/Management – ✘',
          'Pinterest Followers – ✘',
          'Updating of pin boards – ✘',
          'Pins – ✘',
          '--- Reports ---',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',
          '--- Customer Support ---',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'STARTUP',
        monthlyPrice: 800,
        popular: false,
        features: [
          'No. of Keywords – 40',
          'Landing Pages – 10',
          'Backlinks (per month) – 120',
          'GBP (GMB) – ✓',
          'Geotagging – ✘',
          'First Hand SEO Analysis – ✓',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Breadcrumb – ✘',
          '--- On-page Optimization ---',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization – ✘',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site Navigation Analysis – ✘',
          '404 Page Implementation – ✓',
          'Broken Links Check – ✘',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'php Sitemap Setup – ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data Setup – ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) – Applicable from 3rd month – 1',
          '--- Off-page Optimization ---',
          'Search Engine Submission – 20',
          'Article Writing – 2',
          'Article Posting – 2',
          'Article Bookmarking – 20',
          'Classified Submissions – 20',
          'Business Listing – 6',
          'Blog Writing – 2',
          'Blog Posting – 2',
          'Blog Bookmarking – 20',
          'On page Blog – 2',
          'On Page Blog Bookmarking – 10',
          'Image sharing – 10',
          'PPT Submissions – 2',
          'PPT Bookmarking – 20',
          'Social Bookmarking – 40',
          'PDF Sharing – 2',
          'PDF bookmarking – 6',
          'Profile Creation – 6',
          'Quora Answering – 2',
          'Info Graphic Creation – 2',
          'Info Graphic Bookmarking – 10',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',
          '--- SMO ---',
          'Facebook Profile Creation – ✓',
          'Facebook Fan Page Creation – ✓',
          'Facebook Posting & Sharing – 4',
          'Instagram Business Profile Creation – ✓',
          'Creation of Interactive Branded Hashtag – ✓',
          'Instagram Posting – 4',
          'Twitter Profile Creation – ✓',
          'Twitter Post – 4',
          'Pinterest Account Creation/Management – ✘',
          'Pinterest Followers – ✘',
          'Updating of pin boards – ✘',
          'Pins – ✘',
          '--- Reports ---',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',
          '--- Customer Support ---',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'PROFESSIONAL',
        monthlyPrice: 1000,
        popular: true, // best seller
        features: [
          'No. of Keywords – 50',
          'Landing Pages – 15',
          'Backlinks (per month) – 150',
          'GBP (GMB) – ✓',
          'Geotagging – ✓',
          'First Hand SEO Analysis – ✓',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis (If required) – ✓',
          '--- On-page Optimization ---',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization – ✓',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site Navigation Analysis – ✓',
          '404 Page Implementation – ✓',
          'Broken Links Check – ✓',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'php Sitemap Setup – ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data Setup – ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) – Applicable from 3rd month – 2',
          '--- Off-page Optimization ---',
          'Search Engine Submission – 30',
          'Article Writing – 3',
          'Article Posting – 3',
          'Article Bookmarking – 30',
          'Classified Submissions – 30',
          'Business Listing – 7',
          'Blog Writing – 3',
          'Blog Posting – 3',
          'Blog Bookmarking – 30',
          'On page Blog – 3',
          'On Page Blog Bookmarking – 15',
          'Image sharing – 15',
          'PPT Submissions – 3',
          'PPT Bookmarking – 30',
          'Social Bookmarking – 50',
          'PDF Sharing – 3',
          'PDF bookmarking – 15',
          'Profile Creation – 7',
          'Quora Answering – 3',
          'Info Graphic Creation – 3',
          'Info Graphic Bookmarking – 15',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',
          '--- SMO ---',
          'Facebook Profile Creation – ✓',
          'Facebook Fan Page Creation – ✓',
          'Facebook Posting & Sharing – 8',
          'Instagram Business Profile Creation – ✓',
          'Creation of Interactive Branded Hashtag – ✓',
          'Instagram Posting – 8',
          'Twitter Profile Creation – ✓',
          'Twitter Post – 8',
          'Pinterest Account Creation/Management – ✓',
          'Pinterest Followers – ✓',
          'Updating of pin boards – 4',
          'Pins – ✓',
          '--- Reports ---',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',
          '--- Customer Support ---',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'ENTERPRISE',
        monthlyPrice: 1500,
        popular: false,
        features: [
          'No. of Keywords – 75',
          'Landing Pages – 20',
          'Backlinks (per month) – 180',
          'GBP (GMB) – ✓',
          'Geotagging – ✓',
          'First Hand SEO Analysis – ✓',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis (If required) – ✓',
          '--- On-page Optimization ---',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization – ✓',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site Navigation Analysis – ✓',
          '404 Page Implementation – ✓',
          'Broken Links Check – ✓',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'php Sitemap Setup – ✓',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data Setup – ✓',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) – Applicable from 3rd month – 3',
          '--- Off-page Optimization ---',
          'Search Engine Submission – 40',
          'Article Writing – 6',
          'Article Posting – 6',
          'Article Bookmarking – 40',
          'Classified Submissions – 80',
          'Business Listing – 10',
          'Blog Writing – 6',
          'Blog Posting – 6',
          'Blog Bookmarking – 80',
          'On page Blog – 6',
          'On Page Blog Bookmarking – 80',
          'Image sharing – 40',
          'PPT Submissions – 8',
          'PPT Bookmarking – 40',
          'Social Bookmarking – 80',
          'PDF Sharing – 6',
          'PDF bookmarking – 40',
          'Profile Creation – 10',
          'Quora Answering – 10',
          'Info Graphic Creation – 6',
          'Info Graphic Bookmarking – 50',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',
          '--- SMO ---',
          'Facebook Profile Creation – ✓',
          'Facebook Fan Page Creation – ✓',
          'Facebook Posting & Sharing – 16',
          'Instagram Business Profile Creation – ✓',
          'Creation of Interactive Branded Hashtag – ✓',
          'Instagram Posting – 16',
          'Twitter Profile Creation – ✓',
          'Twitter Post – 16',
          'Pinterest Account Creation/Management – ✓',
          'Pinterest Followers – ✓',
          'Updating of pin boards – 8',
          'Pins – ✓',
          '--- Reports ---',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',
          '--- Customer Support ---',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'MASTER',
        monthlyPrice: 2000,
        popular: false,
        features: [
          'No. of Keywords – 100',
          'Landing Pages – 20',
          'Backlinks (per month) – 200',
          'GBP (GMB) – ✓',
          'Geotagging – ✓',
          'First Hand SEO Analysis – ✓',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis (If required) – ✓',
          '--- On-page Optimization ---',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization – ✓',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site Navigation Analysis – ✓',
          '404 Page Implementation – ✓',
          'Broken Links Check – ✓',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'php Sitemap Setup – ✓',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data Setup – ✓',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) – Applicable from 3rd month – 3',
          '--- Off-page Optimization ---',
          'Search Engine Submission – 40',
          'Article Writing – 6',
          'Article Posting – 6',
          'Article Bookmarking – 40',
          'Classified Submissions – 80',
          'Business Listing – 10',
          'Blog Writing – 6',
          'Blog Posting – 6',
          'Blog Bookmarking – 80',
          'On page Blog – 6',
          'On Page Blog Bookmarking – 80',
          'Image sharing – 40',
          'PPT Submissions – 8',
          'PPT Bookmarking – 40',
          'Social Bookmarking – 80',
          'PDF Sharing – 6',
          'PDF bookmarking – 40',
          'Profile Creation – 10',
          'Quora Answering – 10',
          'Info Graphic Creation – 6',
          'Info Graphic Bookmarking – 50',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',
          '--- SMO ---',
          'Facebook Profile Creation – ✓',
          'Facebook Fan Page Creation – ✓',
          'Facebook Posting & Sharing – 16',
          'Instagram Business Profile Creation – ✓',
          'Creation of Interactive Branded Hashtag – ✓',
          'Instagram Posting – 16',
          'Twitter Profile Creation – ✓',
          'Twitter Post – 16',
          'Pinterest Account Creation/Management – ✓',
          'Pinterest Followers – ✓',
          'Updating of pin boards – 8',
          'Pins – ✓',
          '--- Reports ---',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',
          '--- Customer Support ---',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      }
    ],

    // SMO (fixed plans)
    smo: [
      { name: 'Starter SMO', monthlyPrice: 300, popular: false, features: ['2 Social Platforms', '10 Posts per Month', 'Basic Analytics'] },
      { name: 'Professional SMO', monthlyPrice: 500, popular: true, features: ['4 Social Platforms', '20 Posts per Month', 'Advanced Analytics', 'Social Listening'] },
      { name: 'Enterprise SMO', monthlyPrice: 800, popular: false, features: ['All Platforms', '30+ Posts', 'Influencer Outreach', 'Custom Reports'] }
    ],

    // PPC + Meta Ads (fixed plans)
    ppc: [
      { name: 'BASIC', monthlyPrice: 300, popular: false, features: ['Setup Fee – $200', 'Ad Budget up to $1000/month', '1 Full Optimization/month', 'Up to 5 Ad Groups'] },
      { name: 'SILVER', monthlyPrice: 400, popular: false, features: ['Setup Fee – $350', 'Ad Budget up to $2000/month', '2 Optimizations/month', 'Up to 10 Ad Groups'] },
      { name: 'GOLD', monthlyPrice: 600, popular: true, features: ['Setup Fee – $500', 'Ad Budget up to $3000/month', '3 Optimizations/month', 'Up to 20 Ad Groups'] },
      { name: 'PREMIUM', monthlyPrice: 800, popular: false, features: ['Setup Fee – $750', 'Ad Budget above $3000/month', '5 Optimizations/month', 'Up to 40 Ad Groups'] }
    ],

    // ORM (fixed plans)
    orm: [
      { name: 'Basic ORM', monthlyPrice: 300, popular: false, features: ['Review Monitoring (2 sites)', 'Monthly Report', '1 Reputation Alert'] },
      { name: 'Pro ORM', monthlyPrice: 600, popular: true, features: ['Review Monitoring (5 sites)', 'Weekly Reports', 'Response Assistance', 'Sentiment Analysis'] },
      { name: 'Enterprise ORM', monthlyPrice: 1000, popular: false, features: ['Unlimited Monitoring', 'Real-time Alerts', 'Crisis Management', 'Brand Reputation Strategy'] }
    ],

    // Web Development (custom quote)
    'web-dev': [
      {
        name: 'Custom Web Development',
        isCustom: true,
        description: 'Tailored websites and web applications built with modern technologies (React, Node.js, PHP, etc.). We create everything from simple landing pages to complex portals.',
        features: ['Responsive design', 'SEO friendly', 'CMS integration', 'E-commerce solutions', 'API development']
      }
    ],

    // App Development (custom quote)
    'app-dev': [
      {
        name: 'Custom App Development',
        isCustom: true,
        description: 'Native or cross-platform mobile apps for iOS and Android. We use React Native, Flutter, Swift, Kotlin. Include features like push notifications, offline sync, payment gateways.',
        technology: 'React Native, Flutter, Swift, Kotlin',
        featuresFunctionality: 'User authentication, real-time data, maps, camera, push notifications, in-app purchases'
      }
    ],

    // Hosting (fixed plans)
    hosting: [
      { name: 'Shared Hosting', monthlyPrice: 10, popular: false, features: ['10 GB SSD', '1 website', 'Free SSL', '24/7 support'] },
      { name: 'VPS Hosting', monthlyPrice: 50, popular: true, features: ['4 vCPU', '8 GB RAM', '100 GB SSD', 'Root access'] },
      { name: 'Dedicated Server', monthlyPrice: 200, popular: false, features: ['8 vCPU', '32 GB RAM', '1 TB SSD', 'Full management'] }
    ],

    // AI Automation (custom quote)
    'ai-auto': [
      {
        name: 'AI Automation Solutions',
        isCustom: true,
        description: 'Automate workflows, integrate chatbots, implement predictive analytics. We use OpenAI, TensorFlow, LangChain, and custom models.',
        technology: 'OpenAI, TensorFlow, LangChain, RPA tools',
        featuresFunctionality: 'Chatbots, document processing, lead scoring, email automation, data extraction'
      }
    ],

    // Software Tools (custom quote) – separate plans for CRM, LMS, ERP, EPS
    'software-tools': [
      {
        name: 'CRM (Customer Relationship Management)',
        isCustom: true,
        description: 'Custom CRM to manage contacts, sales pipelines, and customer interactions. Tailored to your business processes.',
        technology: 'React, Node.js, PostgreSQL, Salesforce integration',
        featuresFunctionality: 'Lead tracking, task management, email integration, reporting dashboards'
      },
      {
        name: 'LMS (Learning Management System)',
        isCustom: true,
        description: 'Build a platform to create, deliver, and track online courses. Multi-tenant support, SCORM compliance.',
        technology: 'Laravel, React, MySQL, SCORM',
        featuresFunctionality: 'Course creation, quizzes, certificates, student analytics, payment gateway'
      },
      {
        name: 'ERP (Enterprise Resource Planning)',
        isCustom: true,
        description: 'Integrated management of core business processes: inventory, HR, finance, supply chain.',
        technology: 'Odoo, Python, PostgreSQL, Docker',
        featuresFunctionality: 'Inventory management, accounting, HRMS, procurement, reporting'
      },
      {
        name: 'EPS (Enterprise Payment System)',
        isCustom: true,
        description: 'Secure payment processing platform with subscription management, invoicing, and multi-currency support.',
        technology: 'Node.js, Stripe/PayPal integration, React, PCI compliant',
        featuresFunctionality: 'Recurring billing, invoice generation, payment gateways, fraud detection'
      }
    ],

    // Website Security & Maintenance (fixed plans)
    'website-sec-maint': [
      { name: 'Basic Security & Maintenance', monthlyPrice: 100, popular: false, features: ['Malware scanning', 'Weekly backups', 'Plugin updates', 'Firewall protection'] },
      { name: 'Advanced Security & Maintenance', monthlyPrice: 250, popular: true, features: ['Daily backups', 'Real-time monitoring', 'DDoS protection', 'Performance optimization'] },
      { name: 'Enterprise Security Suite', monthlyPrice: 500, popular: false, features: ['24/7 security monitoring', 'Penetration testing', 'Incident response', 'SLA guarantee'] }
    ]
  };

  // Categories with icons
  const categories = [
    { id: 'seo', name: 'SEO', Icon: Search },
    { id: 'smo', name: 'SMO', Icon: Share2 },
    { id: 'ppc', name: 'PPC + Meta Ads', Icon: Megaphone },
    { id: 'orm', name: 'ORM', Icon: TrendingUp },
    { id: 'web-dev', name: 'Web Dev', Icon: Code },
    { id: 'app-dev', name: 'App Dev', Icon: Smartphone },
    { id: 'hosting', name: 'Hosting', Icon: Cloud },
    { id: 'ai-auto', name: 'AI Automation', Icon: Cpu },
    { id: 'software-tools', name: 'Software Tools', Icon: Database },
    { id: 'website-sec-maint', name: 'Security & Maintenance', Icon: Shield }
  ];

  const openModal = (plan: PricingPlan, category: string) => {
    setSelectedPlan({ ...plan, category });
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setFormData({ name: '', email: '', website: '', phone: '', budget: '', businessType: '', technology: '', features: '' });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitToSheet('PricingQuote', {
      name: formData.name,
      email: formData.email,
      website: formData.website,
      phone: formData.phone,
      budget: formData.budget,
      businessType: formData.businessType,
      technology: formData.technology,
      features: formData.features,
      plan: selectedPlan?.name ?? '',
      category: selectedPlan?.category ?? '',
      duration: `${duration} month(s)`,
    });
    closeModal();
  };

  // Calculate total price for a fixed plan
  const getTotalPrice = (monthlyPrice: number) => {
    const total = monthlyPrice * duration * discountFactor[duration];
    return total;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-16">
      {/* Fixed Buttons - Desktop */}
      <div className="hidden lg:block">
        <Link
          to="/custom-plan"
          className="fixed left-5 top-30 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          Design Your Custom Plan
        </Link>
        <Link
          to="/cost-calculator"
          className="fixed right-5 top-30 z-50 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
        >
          <Calculator className="w-5 h-5" />
          Calculate Website Cost
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-blue-100 border border-blue-300 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Flexible pricing plans designed to grow with your business
          </p>
          <div className="flex justify-center items-center gap-2">
            <div className="h-0.5 w-5 bg-gradient-to-r from-transparent to-blue-600"></div>
            <div className="h-0.5 w-10 bg-blue-600"></div>
            <div className="h-0.5 w-5 bg-gradient-to-l from-transparent to-blue-600"></div>
          </div>
        </motion.div>

        {/* Duration Selector - Multi Switch Toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex justify-center mb-12">
          <div className="flex bg-gray-100 rounded-2xl p-1.5">
            {([1, 3, 6, 9, 12] as const).map((dur) => {
              const discount = { 3: '6% off', 6: '15% off', 9: '20% off', 12: '25% off' }[dur];
              const isActive = duration === dur;
              return (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 min-w-[72px] text-center"
                >
                  {isActive && (
                    <motion.div
                      layoutId="duration-slider"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 block leading-tight ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {dur} {dur === 1 ? 'Mo' : 'Mo'}
                  </span>
                  {discount && (
                    <span className={`relative z-10 block text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-green-600'}`}>
                      {discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile Fixed Buttons */}
        <div className="lg:hidden flex flex-col gap-3 mb-8">
          <Link to="/custom-plan" className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3.5 rounded-full font-semibold shadow-xl">
            <Sparkles className="w-5 h-5" />
            Design Your Custom Plan
          </Link>
          <Link to="/cost-calculator" className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-7 py-3.5 rounded-full font-semibold shadow-xl">
            <Calculator className="w-5 h-5" />
            Calculate Website Cost
          </Link>
        </div>

        {/* Service Categories */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const { Icon } = category;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 min-w-[100px] transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-600 shadow-xl'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedCategory === category.id ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">{category.name}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Pricing Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap justify-center gap-6">
            {pricingData[selectedCategory]?.map((plan, index) => {
              const isFixed = !plan.isCustom;
              const total = isFixed ? getTotalPrice(plan.monthlyPrice!) : null;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative bg-white rounded-2xl p-8 border-2 shadow-lg hover:shadow-2xl transition-all w-full max-w-[280px] sm:w-[280px] flex flex-col ${
                    plan.popular ? 'border-blue-600 shadow-blue-200' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 right-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold ${plan.popular ? 'text-blue-600' : 'text-gray-900'}`}>{plan.name}</h3>
                  </div>

                  {isFixed ? (
                    <>
                      <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                        {fmtCurrency(total ?? 0)}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {fmtCurrency(plan.monthlyPrice!)} / month × {duration} {duration === 1 ? 'month' : 'months'}
                        {duration > 1 && ` (${Math.round((1 - discountFactor[duration]) * 100)}% off)`}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-blue-600 mb-2">Custom Quote</div>
                      {plan.description && <p className="text-sm text-gray-600 mb-4">{plan.description}</p>}
                    </>
                  )}

                  {/* Features (short preview) */}
                  {plan.features && (
                    <ul className="space-y-2 mb-6 flex-grow">
                      {plan.features.slice(0, 5).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 text-xs">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && <li className="text-xs text-blue-500">+{plan.features.length - 5} more</li>}
                    </ul>
                  )}

                  <button
                    onClick={() => openModal(plan, selectedCategory)}
                    className={`w-full rounded-xl py-3 px-6 font-semibold transition-all mt-auto ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                        : 'bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                    }`}
                  >
                    {isFixed ? 'Get Started' : 'Get Quote'}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal with Form */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-200 relative"
            >
              <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all hover:rotate-90 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-100 p-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {selectedPlan.name}
                </h3>
                <p className="text-gray-600 capitalize">{selectedPlan.category.replace('-', ' ')} Service</p>
                {!selectedPlan.isCustom && (
                  <div className="mt-2 text-lg font-semibold">
                    Total: {fmtCurrency(getTotalPrice(selectedPlan.monthlyPrice!))} for {duration} {duration === 1 ? 'month' : 'months'}
                    {duration > 1 && ` (${Math.round((1 - discountFactor[duration]) * 100)}% discount applied)`}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business / Personal Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Website (if any)</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Extra fields for custom quote services */}
                {selectedPlan.isCustom && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget (USD) *</label>
                      <input
                        type="text"
                        name="budget"
                        required
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g. $5,000 - $10,000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                      <input
                        type="text"
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleInputChange}
                        placeholder="e.g. E-commerce, SaaS, Local Business"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technology Preferences (if any)</label>
                      <textarea
                        name="technology"
                        rows={2}
                        value={formData.technology}
                        onChange={handleInputChange}
                        placeholder="e.g. React, Python, AWS, OpenAI..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Features / Functionality Required *</label>
                      <textarea
                        name="features"
                        rows={3}
                        required
                        value={formData.features}
                        onChange={handleInputChange}
                        placeholder="Describe what you need..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {selectedPlan.isCustom ? 'Submit Quote Request' : 'Pay Now'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}