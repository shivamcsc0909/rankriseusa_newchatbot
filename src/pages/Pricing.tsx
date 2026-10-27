// src/pages/PricingPage.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Share2, Megaphone, Code, Sparkles, Calculator,
  X, Check, Shield, CreditCard, Smartphone, Cloud, Database
} from 'lucide-react';
import {
  Globe, Lock, PenTool, Star, Rocket, Crown, Zap, Briefcase,
  TrendingUp, Users, Settings, HardDrive, Cpu, ArrowRight,
  ShieldCheck, ZapOff, Layers, Activity, Plus as PlusIcon, Clock, HelpCircle,
  Mail, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitToSheet } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PayPalModal from '@/components/PayPalModal';
import Seo from '@/components/seo';


// Types
interface PricingPlan {
  name: string;
  icon?: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
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
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);



  // small helper to format currency
  function fmtCurrency(n: number) {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // Discount factors (multiplier for total price)
  const discountFactor: Record<number, number> = {
    1: 1,
    3: 0.94,
    6: 0.85,
    9: 0.80,
    12: 0.75
  };

  // Pricing data for all categories
  const pricingData: PricingData = {
    // SEO – detailed packages from your input
    seo: [
      {
        name: 'BASIC',
        monthlyPrice: 400,
        popular: false,
        features: [
          'No. of Keywords – 20',
          'Landing Pages – 3',
          'Backlinks (per month) – 100',

          '---First Hand SEO Analysis',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis ✘',

          '---On Page Optimization Activities',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization ✘',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site navigation Analysis ✘',
          '404 Page Implementation – ✓',
          'Broken Link Check ✘',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'PHP Sitemap Setup ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data setup ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) | Applicable from 3rd month',

          '--- Off-page Optimization Activities',
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
          'Image Sharing – 5',
          'PPT Submissions – 1',
          'PPT Bookmarking – 10',
          'Social Bookmarking – 30',
          'PDF Sharing – 1',
          'PDF Bookmarking – 5',
          'Profile Creation – 5',
          'Quora Answering – 1',
          'Info Graphic Creation – 1',
          'Info Graphic Bookmarking – 5',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',

          '---SMO Activities',
          'Facebook ✘',
          'Instagram ✘',
          'Twitter ✘',
          'Pinterest ✘',

          '--- Reports',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',

          '--- Customer Support',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'STARTUP',
        monthlyPrice: 550,
        popular: false,
        features: [
          'No. of Keywords – 30',
          'Landing Pages – 5',
          'Backlinks (per month) – 120',

          '---First Hand SEO Analysis',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis ✘',

          '---On Page Optimization Activities',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization ✘',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site navigation Analysis ✘',
          '404 Page Implementation – ✓',
          'Broken Link Check ✘',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'PHP Sitemap Setup ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data setup ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) | Applicable from 3rd month',

          '--- Off-page Optimization Activities',
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
          'Image Sharing – 5',
          'PPT Submissions – 1',
          'PPT Bookmarking – 10',
          'Social Bookmarking – 30',
          'PDF Sharing – 1',
          'PDF Bookmarking – 5',
          'Profile Creation – 5',
          'Quora Answering – 1',
          'Info Graphic Creation – 1',
          'Info Graphic Bookmarking – 5',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',

          '---SMO Activities',
          'Facebook ✘',
          'Instagram ✘',
          'Twitter ✘',
          'Pinterest ✘',

          '--- Reports',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',

          '--- Customer Support',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'PROFESSIONAL',
        monthlyPrice: 800,
        popular: true, // best seller
        features: [
          'No. of Keywords – 40',
          'Landing Pages – 10',
          'Backlinks (per month) – 210',

          '---First Hand SEO Analysis',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis ✘',

          '---On Page Optimization Activities',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization ✘',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site navigation Analysis ✘',
          '404 Page Implementation – ✓',
          'Broken Link Check ✘',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'PHP Sitemap Setup ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data setup ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) | Applicable from 3rd month',

          '--- Off-page Optimization Activities',
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
          'Image Sharing – 10',
          'PPT Submissions – 2',
          'PPT Bookmarking – 20',
          'Social Bookmarking – 40',
          'PDF Sharing – 2',
          'PDF Bookmarking – 10',
          'Profile Creation – 6',
          'Quora Answering – 2',
          'Info Graphic Creation – 2',
          'Info Graphic Bookmarking – 10',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',

          '---SMO Activities',
          'Facebook ✓',
          'Instagram ✓',
          'Twitter ✓',
          'Pinterest ✓',

          '--- Reports',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',

          '--- Customer Support',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'ENTERPRISE',
        monthlyPrice: 1100,
        popular: false,
        features: [
          'No. of Keywords – 50',
          'Landing Pages – 15',
          'Backlinks (per month) – 300',

          '---First Hand SEO Analysis',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis ✓',

          '---On Page Optimization Activities',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization ✓',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site navigation Analysis ✓',
          '404 Page Implementation – ✓',
          'Broken Link Check ✓',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'PHP Sitemap Setup ✘',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data setup ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) | Applicable from 3rd month - 2',

          '--- Off-page Optimization Activities',
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
          'Image Sharing – 15',
          'PPT Submissions – 3',
          'PPT Bookmarking – 30',
          'Social Bookmarking – 50',
          'PDF Sharing – 3',
          'PDF Bookmarking – 15',
          'Profile Creation – 7',
          'Quora Answering – 3',
          'Info Graphic Creation – 3',
          'Info Graphic Bookmarking – 15',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',


          '---SMO Activities',
          'Facebook ✓',
          'Instagram ✓',
          'Twitter ✓',
          'Pinterest ✓',

          '--- Reports',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',

          '--- Customer Support',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      },
      {
        name: 'MASTER',
        monthlyPrice: 1800,
        popular: false,
        features: [
          'No. of Keywords – 100',
          'Landing Pages – 20',
          'Backlinks (per month) – 600',

          '---First Hand SEO Analysis',
          'Pre-Optimization Website Analysis – ✓',
          'Competitor Analysis – ✓',
          'Keyword Research & Analysis – ✓',
          'Baseline Ranking Check – ✓',
          'Duplicate Content Check – ✓',
          'Google Penalty Check – ✓',
          'Back Link Analysis ✓',

          '---On Page Optimization Activities',
          'Website Canonical Check – ✓',
          'Title Tag Optimization – ✓',
          'META Tags Optimization – ✓',
          'Heading Tags Optimization ✓',
          'Image Alt Tags Optimization – ✓',
          'Content Optimization – ✓',
          'SEO Friendly URL Setup – ✓',
          'Site navigation Analysis ✓',
          '404 Page Implementation – ✓',
          'Broken Link Check ✓',
          'Website Speed Check – ✓',
          'Google Indexed Pages Check – ✓',
          'Robots.txt Creation – ✓',
          'Google XML Sitemap – ✓',
          'PHP Sitemap Setup ✓',
          'Google Webmasters Tool Setup – ✓',
          'Google Analytics Setup – ✓',
          'Structured Data setup ✘',
          'On Site Blog Section Creation – ✓',
          'On Site Blog Posting (Draft Copy) | Applicable from 3rd month - 3',

          '--- Off-page Optimization Activities',
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
          'Image Sharing – 40',
          'PPT Submissions – 8',
          'PPT Bookmarking – 40',
          'Social Bookmarking – 80',
          'PDF Sharing – 6',
          'PDF Bookmarking – 40',
          'Profile Creation – 10',
          'Quora Answering – 10',
          'Info Graphic Creation – 6',
          'Info Graphic Bookmarking – 50',
          'Video Marketing (if Client provides) – ✓',
          'Press Release (If Client Provides News) – ✓',


          '---SMO Activities',
          'Facebook ✓',
          'Instagram ✓',
          'Twitter ✓',
          'Pinterest ✓',

          '--- Reports',
          'Monthly Website Analytics Report – ✓',
          'Monthly Keywords Ranking Report – ✓',
          'Monthly Off Page Submission Report – ✓',

          '--- Customer Support',
          'Email – ✓',
          'Phone – ✓',
          'Chat – ✓'
        ]
      }
    ],

    // SMO (fixed plans)
    smo: [
      {
        name: 'Starter SMO', monthlyPrice: 200, popular: false, features: [
          '2 Social Platforms',
          '--- Organic Promotion',
          'Competitor Analysis - ✓',
          'Strategy Formation - ✓',
          'Hashtag Creation & Promotion - ✓',
          '5 Monthly Creative Designs - ✓',
          '5 Monthly Postings - ✓',
          'Analytics Tracking - ✓',
          'Account Management - ✓',
          'Community Engagement - ✓',
          'Monthly Reporting - ✓',
          'Network Build-up - ✓',
          'Third-party Post Engagement - ✓',
          'Content Optimization - ✓',
          '--- Paid Promotion Setup',
          'Campaign Setup & Optimization - ✘',
          'Ad Creative Creation - ✘',
          'Sales Funnel Setup - ✘',
          'Conversion Tracking with Google Analytics - ✘',
          '--- Remarketing Setup',
          'Audience List Creation ✘',
          '--- SMO Activities',
          'Monthly Insight Report ✘',
          'Next Month Action Plan ✘',
          '--- Customer Support',
          'Email Support ✘',
          'Phone Support ✘',
          'Chat Support ✘'
        ]
      },
      {
        name: 'Professional SMO', monthlyPrice: 300, popular: true, features: [
          '--- Organic Promotion',
          'Competitor Analysis - ✓',
          'Strategy Formation - ✓',
          'Hashtag Creation & Promotion - ✓',
          '10 Monthly Creative Designs - ✓',
          '10 Monthly Postings - ✓',
          'Analytics Tracking - ✓',
          'Account Management - ✓',
          'Community Engagement - ✓',
          'Monthly Reporting - ✓',
          'Network Build-up - ✓',
          'Third-party Post Engagement - ✓',
          'Content Optimization - ✓',

          '--- Paid Promotion',
          'Budget Estimate - ✓',
          'Campaign Setup - ✓',
          'Ad Creative Creation - ✓',
          'Daily Account Optimization - ✓',
          'Sales Funnel Setup for Conversion Objective - ✓',
          'Conversion Tracking with Google Analytics - ✓',

          '--- Remarketing',
          'Audience List Creation ✘',
          'Campaign Setup ✘',
          'Ad Creative Creation ✘',
          'Daily Account Optimization ✘',
          'Sales Funnel Setup for Conversion Objective ✘',
          'Conversion Tracking with Google Analytics ✘',

          '--- SMO Activities',
          'Monthly Insight Report Generation - ✓',
          'Next Month Action Plan - ✓',

          '--- Customer Support',
          'Email Support - ✓',
          'Phone Support - ✓',
          'Chat Support - ✓'
        ]
      },
      {
        name: 'Enterprise SMO', monthlyPrice: 400, popular: false, features: [
          '--- Organic Promotion',
          'Competitor Analysis - ✓',
          'Strategy Formation - ✓',
          'Hashtag Creation & Promotion - ✓',
          '15 Monthly Creative Designs - ✓',
          '15 Monthly Postings - ✓',
          'Analytics Tracking - ✓',
          'Account Management - ✓',
          'Community Engagement - ✓',
          'Monthly Reporting - ✓',
          'Network Build-up - ✓',
          'Third-party Post Engagement - ✓',
          'Content Optimization - ✓',

          '--- Paid Promotion',
          'Budget Estimate - ✓',
          'Campaign Setup - ✓',
          'Ad Creative Creation - ✓',
          'Daily Account Optimization - ✓',
          'Sales Funnel Setup for Conversion Objective - ✓',
          'Conversion Tracking with Google Analytics - ✓',

          '--- Remarketing',
          'Audience List Creation - ✓',
          'Campaign Setup - ✓',
          'Ad Creative Creation - ✓',
          'Daily Account Optimization - ✓',
          'Sales Funnel Setup for Conversion Objective - ✓',
          'Conversion Tracking with Google Analytics - ✓',

          '--- SMO Activities',
          'Monthly Insight Report Generation - ✓',
          'Next Month Action Plan - ✓',

          '--- Customer Support',
          'Email Support - ✓',
          'Phone Support - ✓',
          'Chat Support - ✓'
        ]
      }
    ],

    // PPC + Meta Ads (fixed plans)
    ppc: [
      {
        name: 'BASIC',
        monthlyPrice: 339,
        popular: false,
        features: [
          'Setup Fee – $200',
          'Advertising Budget – $0-$2999/M',
          'Full Optimization – 1/M',
          'Ad Groups – Up to 5',
          'Ads per Group – Up to 2 Ads',
          'Keywords – Up to 50',
          'Negative Keywords – ✓',
          'Conversion Tracking – ✓',
          'Monthly Reporting – ✓',
          'No Contracts – ✓',
          'Ad Networks – Google Network',
          'Mobile Ads – ✘',
          'Call Extension – ✓',
          'Sitelink Extension – ✓',
          'Remarketing – ✘',
          'Monthly Conference Calls – ✘',
          'Display/Image Ads – ✘'
        ]
      },
      {
        name: 'PPC-SERIOUS',
        monthlyPrice: 439,
        popular: false,
        features: [
          'Setup Fee – $350',
          'Advertising Budget – $3000-$4999/M',
          'Full Optimization – 2/M',
          'Ad Groups – Up to 10',
          'Ads per Group – Up to 3 Ads',
          'Keywords – Up to 100',
          'Negative Keywords – ✓',
          'Conversion Tracking – ✓',
          'Monthly Reporting – ✓',
          'No Contracts – ✓',
          'Ad Networks – Google Network',
          'Mobile Ads – ✘',
          'Call Extension – ✓',
          'Sitelink Extension – ✓',
          'Remarketing – ✓',
          'Monthly Conference Calls – ✓',
          'Display/Image Ads – ✘'
        ]
      },
      {
        name: 'PPC-STRATEGY',
        monthlyPrice: 639,
        popular: false,
        features: [
          'Setup Fee – $500',
          'Advertising Budget – $5000-$7500/M',
          'Full Optimization – 3/M',
          'Ad Groups – Up to 20',
          'Ads per Group – Up to 4 Ads',
          'Keywords – Up to 200',
          'Negative Keywords – ✓',
          'Conversion Tracking – ✓',
          'Monthly Reporting – ✓',
          'No Contracts – ✓',
          'Ad Networks – Google Network',
          'Mobile Ads – ✘',
          'Call Extension – ✓',
          'Sitelink Extension – ✓',
          'Remarketing – ✓',
          'Monthly Conference Calls – ✓',
          'Display/Image Ads – ✘'
        ]
      },
      {
        name: 'PPC-STERIOD',
        monthlyPrice: 939,
        popular: false,
        features: [
          'Setup Fee – $750',
          'Advertising Budget – $7500-$10000/M',
          'Full Optimization – 5/M',
          'Ad Groups – Up to 40',
          'Ads per Group – Up to 6 Ads',
          'Keywords – Up to 750',
          'Negative Keywords – ✓',
          'Conversion Tracking – ✓',
          'Monthly Reporting – ✓',
          'No Contracts – ✓',
          'Ad Networks – Google, Yahoo, Bing & FB',
          'Mobile Ads – ✓',
          'Call Extension – ✓',
          'Sitelink Extension – ✓',
          'Remarketing – ✓',
          'Monthly Conference Calls – ✓',
          'Display/Image Ads – Up to 2 Ads/M'
        ]
      }
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
        name: 'Web Essential',
        yearlyPrice: 999,
        popular: false,
        features: [
          'Dynamic Website – ✓',
          'Website Pages – Up to 10 – ✓',
          'New Domain (Optional) – ✓',
          'New Logo Design – ✘',
          'AI Chat Feature – ✘',
          'Web Hosting – ✓',
          'SEO Friendly Website – ✓',
          'Website Pages Content – ✓',
          'SEO Keywords Research – ✓',
          'Competitor Analysis Report – ✘',
          'Explainer Video – ✘',
          'Customized Contact Form (Leads) – ✘',
          'Stock Images – ✓',
          'Premium Support (SSL) – ✓',
          'Advanced Site Security – ✘',
          '5 Hosted Domain Emails – ✓',
          'Daily Backup – ✘',
          'Unlimited Bandwidth – ✓',
          'Unlimited Databases – ✓',
          'Dedicated Resources – ✓',
          'Dedicated IP – ✓',
          '99.9% Uptime Guarantee – ✓',
          'User Friendly Admin Panel – ✓',
          'Web Maintenance – 50 Hours/Year – ✓',
          'Responsive Site (Desktop, Tablet, Mobile) – ✓',
          '5 Business Profile Creation – ✓',
          'Social Media Profile Creation – ✘',
          'Social Media Profile Linking – ✘',
          'Google Analytics Tracking – ✓',
          'Google Search Console Tracking – ✓',
          'Google Ecommerce Tracking – ✘',
          'Payment Gateway Integration – ✘',
          'Email/Chat Support – ✓',
          'Dedicated Account Manager – ✘',
          'Quarterly Website Progress Report – ✘'
        ]
      },
      {
        name: 'Web Advanced',
        yearlyPrice: 1999,
        popular: true,
        features: [
          'Ultra Dynamic Website – ✓',
          'Website Pages – Up to 15 – ✓',
          'New Domain (Optional) – ✓',
          'New Logo Design – ✓',
          'AI Chat Feature – ✓',
          'Web Hosting – ✓',
          'SEO Friendly Website – ✓',
          'Website Pages Content – ✓',
          'SEO Keywords Research – ✓',
          'Competitor Analysis Report – ✘',
          'Explainer Video – ✘',
          'Customized Contact Form (Leads) – ✘',
          'Stock Images – ✓',
          'Premium Support (SSL) – ✓',
          'Advanced Site Security – ✘',
          '5 Hosted Domain Emails – ✓',
          'Daily Backup – ✓',
          'Unlimited Bandwidth – ✓',
          'Unlimited Databases – ✓',
          'Dedicated Resources – ✓',
          'Dedicated IP – ✓',
          '99.9% Uptime Guarantee – ✓',
          'User Friendly Admin Panel – ✓',
          'Web Maintenance – 100 Hours/Year – ✓',
          'Responsive Site (Desktop, Tablet, Mobile) – ✘',
          '5 Business Profile Creation – ✓',
          'Social Media Profile Creation – ✓',
          'Social Media Profile Linking – ✓',
          'Google Analytics Tracking – ✓',
          'Google Search Console Tracking – ✓',
          'Google Ecommerce Tracking – ✘',
          'Payment Gateway Integration – ✘',
          'Email/Chat Support – ✓',
          'Dedicated Account Manager – ✘',
          'Quarterly Website Progress Report – ✘'
        ]
      }, {
        name: 'Web Professional',
        yearlyPrice: 2999,
        popular: false,
        features: [
          'Custom Website – ✓',
          'Website Pages – Up to 20 – ✓',
          'New Domain (Optional) – ✓',
          'New Logo Design – ✓',
          'AI Chat Feature – ✓',
          'Web Hosting – ✓',
          'SEO Friendly Website – ✓',
          'Website Pages Content – ✓',
          'SEO Keywords Research – ✓',
          'Competitor Analysis Report – ✓',
          'Explainer Video – ✓',
          'Customized Contact Form (Leads) – ✓',
          'Stock Images – ✓',
          'Premium Support (SSL) – ✓',
          'Advanced Site Security – ✓',
          '5 Hosted Domain Emails – ✓',
          'Daily Backup – ✓',
          'Unlimited Bandwidth – ✓',
          'Unlimited Databases – ✓',
          'Dedicated Resources – ✓',
          'Dedicated IP – ✓',
          '99.9% Uptime Guarantee – ✓',
          'User Friendly Admin Panel – ✓',
          'Web Maintenance – 150 Hours/Year – ✓',
          'Responsive Site (Desktop, Tablet, Mobile) – ✘',
          '5 Business Profile Creation – ✓',
          'Social Media Profile Creation – ✓',
          'Social Media Profile Linking – ✓',
          'Google Analytics Tracking – ✓',
          'Google Search Console Tracking – ✓',
          'Google Ecommerce Tracking – ✓',
          'Payment Gateway Integration – ✓',
          'Email/Chat Support – ✓',
          'Dedicated Account Manager – ✓',
          'Quarterly Website Progress Report – ✓'
        ]
      }, {
        name: 'Web Enterprise',
        yearlyPrice: 3999,
        popular: true,
        features: [
          'Ultra Custom Website – ✓',
          'Website Pages – Up to 25 – ✓',
          'New Domain (Optional) – ✓',
          'New Logo Design – ✓',
          'AI Chat Feature – ✓',
          'Web Hosting – ✓',
          'SEO Friendly Website – ✓',
          'Website Pages Content – ✓',
          'SEO Keywords Research – ✓',
          'Competitor Analysis Report – ✓',
          'Explainer Video – ✓',
          'Customized Contact Form (Leads) – ✓',
          'Stock Images – ✓',
          'Premium Support (SSL) – ✓',
          'Advanced Site Security – ✓',
          '5 Hosted Domain Emails – ✓',
          'Daily Backup – ✓',
          'Unlimited Bandwidth – ✓',
          'Unlimited Databases – ✓',
          'Dedicated Resources – ✓',
          'Dedicated IP – ✓',
          '99.9% Uptime Guarantee – ✓',
          'User Friendly Admin Panel – ✓',
          'Web Maintenance – 200 Hours/Year – ✓',
          'Responsive Site (Desktop, Tablet, Mobile) – ✓',
          '5 Business Profile Creation – ✓',
          'Social Media Profile Creation – ✓',
          'Social Media Profile Linking – ✓',
          'Google Analytics Tracking – ✓',
          'Google Search Console Tracking – ✓',
          'Google Ecommerce Tracking – ✓',
          'Payment Gateway Integration – ✓',
          'Email/Chat Support – ✓',
          'Dedicated Account Manager – ✓',
          'Quarterly Website Progress Report – ✓'
        ]
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
    setIsSubmitting(true);

    try {
      await submitToSheet('PricingQuote', {
        full_name: formData.name,
        email: formData.email,
        website: formData.website,
        phone: formData.phone,
        budget: formData.budget,
        business_type: formData.businessType,
        technology: formData.technology,
        features: formData.features,
        plan: selectedPlan?.name ?? '',
        category: selectedPlan?.category ?? '',
        duration: selectedPlan?.yearlyPrice ? '12 months (Yearly)' : `${duration} month(s)`,
        source_page: 'Pricing Page',
        status: 'New',
      });

      const isCustomPlan = selectedPlan?.isCustom;
      const amountToPay = selectedPlan ? getTotalPrice(selectedPlan) : 0;

      closeModal();

      if (!isCustomPlan && amountToPay > 0) {
        setPayAmount(amountToPay.toFixed(2));
        setIsPayModalOpen(true);
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price for a fixed plan
  const getTotalPrice = (plan: PricingPlan) => {
    if (plan.monthlyPrice) {
      return plan.monthlyPrice * duration * discountFactor[duration];
    }
    if (plan.yearlyPrice) {
      return plan.yearlyPrice;
    }
    return 0;
  };

  const renderCard = (plan: PricingPlan, index: number) => {
    const isFixed = !plan.isCustom;
    const total = isFixed ? getTotalPrice(plan) : null;
    const isExpanded = isAllExpanded;
    const PlanIcon = plan.name.toUpperCase().includes('BASIC') || plan.name.toUpperCase().includes('STARTER') ? Zap :
      plan.name.toUpperCase().includes('PRO') || plan.name.toUpperCase().includes('STARTUP') ? Crown :
        plan.name.toUpperCase().includes('ENTERPRISE') || plan.name.toUpperCase().includes('MASTER') ? ShieldCheck : Rocket;
    return (
      <motion.div
        key={plan.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={`glass-card rounded-[2rem] p-8 border-white/5 flex flex-col group relative transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 ${plan.popular ? 'border-primary/40 bg-primary/[0.03] ring-1 ring-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : ''
          }`}
      >
        {plan.popular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2.5 rounded-full bg-primary text-background text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(var(--primary),0.4)] whitespace-nowrap">
            Industry Leader
          </div>
        )}

        <div className="mb-10 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
              <PlanIcon className={`w-6 h-6 ${plan.popular ? 'text-primary' : 'text-foreground/70'}`} />
            </div>
            {plan.popular && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-bold text-foreground/50 uppercase tracking-wider">Active Status</span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors tracking-tight">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-2">
            {isFixed ? (
              <>
                <span className="text-5xl font-black text-foreground tracking-tighter">
                  {fmtCurrency(total ?? 0)}
                </span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  / {plan.monthlyPrice ? (duration === 1 ? 'Month' : `${duration} Months`) : 'Year'}
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-gradient-gold italic tracking-tight">Bespoke.</span>
            )}
          </div>
          {isFixed && plan.monthlyPrice && duration > 1 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-[0.2em]">
              <Zap className="w-3 h-3 fill-primary" />
              Save {Math.round((1 - discountFactor[duration]) * 100)}% Now
            </div>
          )}
        </div>

        {plan.description && (
          <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-10">
            {plan.description}
          </p>
        )}

        <div className="space-y-5 mb-12 flex-grow">
          {plan.features ? (
            (isExpanded
              ? plan.features
              : plan.features.slice(0, 10)
            ).map((feat, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-4 py-2 border-b border-white/5 ${feat.startsWith('---')
                  ? 'mt-5 pt-5 border-t border-primary/20 border-b-0'
                  : ''
                  }`}
              >
                {feat.startsWith('---') ? (
                  <div className="w-full px-1 py-1 text-[10px] uppercase tracking-[0.25em] font-black text-primary shadow-[0_0_20px_rgba(var(--primary),0.08)]">
                    {feat.replace(/---/g, '')}
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium text-foreground/80 leading-relaxed">
                      {feat.split(/\s*[–-]\s*/)[0].replace(/[✓✘]/, '').trim()}
                    </span>

                    {feat.includes('✓') ? (
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : feat.includes('✘') ? (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : (
                      <span className="text-xs font-black text-primary flex-shrink-0">
                        {feat.split(/\s*[–-]\s*/)[1]?.trim()}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="space-y-6">
              {plan.technology && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[9px] uppercase tracking-[0.25em] font-black text-primary mb-3">Tech Stack</div>
                  <div className="text-xs font-bold text-foreground/80 leading-relaxed">{plan.technology}</div>
                </div>
              )}
              {plan.featuresFunctionality && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[9px] uppercase tracking-[0.25em] font-black text-primary mb-3">Core Functionality</div>
                  <div className="text-xs font-bold text-foreground/80 leading-relaxed">{plan.featuresFunctionality}</div>
                </div>
              )}
            </div>
          )}
          {(plan.features?.length ?? 0) > 10 && (
            <>
              <button
                type="button"
                onClick={() => setIsAllExpanded(!isAllExpanded)}
                className="mt-4 ml-9 md:ml-3 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/10"
              >
                <PlusIcon
                  className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-45" : ""
                    }`}
                />

                {isExpanded
                  ? "Hide Metrics"
                  : `${(plan.features?.length ?? 0) - 10} Advanced Metrics`}
              </button>


            </>
          )}
        </div>

        {/* Action Buttons: Pay Now & Ask Question */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => openModal(plan, selectedCategory)}
            className="h-14 rounded-[1.2rem] font-black uppercase tracking-[0.15em] text-[10px] bg-primary text-background hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Pay Now
          </Button>
          <Button
            onClick={() => openModal(plan, selectedCategory)}
            className="h-14 rounded-[1.2rem] font-black uppercase tracking-[0.15em] text-[10px] bg-white/5 hover:bg-white/10 text-foreground border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Ask Question
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16 relative overflow-hidden">
      <Seo
        title="Pricing & Growth Plans | ROI-Driven Models | RankRise USA"
        description="Explore transparent, performance-indexed pricing plans for AI SEO, modern web development, PPC ad management, and software solutions."
        canonical="https://rankriseusa.com/pricing"
        keywords={[
          "seo pricing plans",
          "digital marketing packages",
          "web development cost",
          "ppc management fees",
          "rankrise pricing"
        ]}
        breadcrumbs={[
          { position: 1, name: "Home", item: "https://rankriseusa.com/" },
          { position: 2, name: "Pricing", item: "https://rankriseusa.com/pricing" }
        ]}
      />
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Neural Investment Framework v4.2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tight"
          >
            Transparent ROI-Driven <br />
            <span className="text-gradient-gold italic">AI SEO &amp; Growth Pricing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Performance-indexed pricing packages engineered for US businesses demanding predictable ROI and aggressive market dominance.
          </motion.p>

          {/* Duration Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="glass-card p-1.5 sm:p-2 rounded-3xl border-white/5 flex items-center justify-start sm:justify-center gap-1.5 w-full sm:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory">
              {([1, 3, 6, 9, 12] as const).map((dur) => {
                const discount = { 3: '6%', 6: '15%', 9: '20%', 12: '25%' }[dur];
                const isActive = duration === dur;
                return (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 relative flex items-center gap-2 shrink-0 snap-center ${
                      isActive
                        ? 'bg-primary text-background shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-100'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <span>{dur} {dur === 1 ? 'Month' : 'Months'}</span>
                    {discount && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-normal ${
                        isActive
                          ? 'bg-background/20 text-background'
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        Save {discount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Service Category Navigation */}
        <h2 className="sr-only">Growth Service Categories</h2>
        <div className="mb-24 overflow-x-auto pb-6 hide-scrollbar">
          <div className="flex justify-start lg:justify-center gap-5 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-4 px-8 py-5 rounded-2xl glass-card border-white/5 transition-all group relative overflow-hidden ${selectedCategory === category.id
                  ? 'border-primary/50 bg-primary/[0.03]'
                  : 'hover:border-white/20'
                  }`}
              >
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="active-cat-bg"
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"
                  />
                )}
                <category.Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedCategory === category.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-20"
          >
            {/* Primary Grid (Max 3) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${pricingData[selectedCategory]?.slice(0, 3).length === 2 ? 'lg:grid-cols-2 max-w-5xl' : pricingData[selectedCategory]?.slice(0, 3).length === 1 ? 'lg:grid-cols-1 max-w-lg' : 'lg:grid-cols-3 max-w-7xl'} gap-10 mx-auto`}>
              {pricingData[selectedCategory]?.slice(0, 3).map((plan, index) => renderCard(plan, index))}
            </div>

            {/* Secondary Grid (Remaining) */}
            {pricingData[selectedCategory]?.length > 3 && (
              <div className="space-y-12">
                <div className="flex items-center gap-6 opacity-30">
                  <div className="h-px flex-grow bg-white" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">Advanced Tiers</h2>
                  <div className="h-px flex-grow bg-white" />
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${pricingData[selectedCategory]?.slice(3).length === 2 ? 'lg:grid-cols-2 max-w-5xl' : pricingData[selectedCategory]?.slice(3).length === 1 ? 'lg:grid-cols-1 max-w-lg' : 'lg:grid-cols-3 max-w-7xl'} gap-10 mx-auto`}>
                  {pricingData[selectedCategory]?.slice(3).map((plan, index) => renderCard(plan, index + 3))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modern Modal / Briefing Portal */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-5xl glass-card rounded-[3em] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={closeModal}
                className="absolute top-10 right-10 p-4 rounded-2xl bg-white/5 border border-white/10 text-foreground hover:bg-primary hover:text-background transition-all z-20 group"
              >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
              </button>

              <div className="grid lg:grid-cols-5 h-[85vh] lg:h-auto max-h-[90vh]">
                {/* Left Sidebar - Briefing Info */}
                <div className="lg:col-span-2 bg-primary/5 p-10 lg:p-14 border-r border-white/5 overflow-y-auto">
                  <div className="mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                      <Layers className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol Brief</span>
                    </div>
                    <h3 className="text-4xl font-black text-foreground mb-4 tracking-tight">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                      {selectedCategory.replace('-', ' ')} Engineering
                    </p>
                  </div>

                  <div className="space-y-10">
                    <div className="p-8 rounded-[2.5rem] bg-[#05070a] border border-white/5 shadow-xl">
                      <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">Investment Allocation</div>
                      <div className="text-4xl font-black text-foreground tracking-tighter">
                        {selectedPlan.isCustom ? 'Custom.' : fmtCurrency(getTotalPrice(selectedPlan))}
                      </div>
                      {!selectedPlan.isCustom && (
                        <div className="inline-flex items-center gap-2 mt-4 text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                          <Clock className="w-3 h-3" />
                          Term Length: {selectedPlan.yearlyPrice ? '12 Months' : `${duration} months`}
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-[10px] font-black text-foreground uppercase tracking-[0.3em]">
                        <Activity className="w-5 h-5 text-primary" />
                        Core Deliverables
                      </div>
                      <div className="space-y-5">
                        {selectedPlan.features ? (
                          selectedPlan.features.slice(0, 6).map((f, i) => (
                            <div key={i} className="flex items-start gap-4 text-xs font-bold text-muted-foreground leading-relaxed">
                              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              {f.split(/\s*[–-]\s*/)[0].replace(/[✓✘]/, '').trim()}
                            </div>
                          ))
                        ) : (
                          <div className="space-y-4">
                            {selectedPlan.technology && (
                              <div className="text-xs font-bold text-muted-foreground leading-relaxed">
                                <span className="text-primary font-black uppercase tracking-widest text-[9px] block mb-1">Architecture</span>
                                {selectedPlan.technology}
                              </div>
                            )}
                            {selectedPlan.featuresFunctionality && (
                              <div className="text-xs font-bold text-muted-foreground leading-relaxed">
                                <span className="text-primary font-black uppercase tracking-widest text-[9px] block mb-1">Systems</span>
                                {selectedPlan.featuresFunctionality}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content - Secure Form */}
                <div className="lg:col-span-3 p-10 lg:p-16 overflow-y-auto bg-background/50">
                  <div className="mb-14">
                    <h4 className="text-3xl font-black text-foreground mb-4">Initialize Growth.</h4>
                    <p className="text-base text-muted-foreground font-medium">Transmit your business parameters to start the onboarding protocol.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Director Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Corporate Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@company.com"
                          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Digital Asset URL</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://company.com"
                          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Secure Contact</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {selectedPlan.isCustom && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Capital Allocation</label>
                            <input
                              type="text"
                              name="budget"
                              required
                              value={formData.budget}
                              onChange={handleInputChange}
                              placeholder="e.g. $10k - $50k"
                              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Market Sector</label>
                            <input
                              type="text"
                              name="businessType"
                              required
                              value={formData.businessType}
                              onChange={handleInputChange}
                              placeholder="e.g. Fintech, E-commerce"
                              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Protocol Scope & Objectives</label>
                          <textarea
                            name="features"
                            required
                            rows={4}
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="Describe your vision and technical requirements..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-all resize-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-6 sm:pt-8">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-auto min-h-14 w-full items-center justify-center rounded-2xl px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] sm:min-h-16 sm:rounded-[1.25rem] sm:px-6 sm:text-xs sm:tracking-[0.25em] lg:min-h-20 lg:rounded-[1.5rem] lg:tracking-[0.3em] button-premium disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="leading-relaxed px-4">Processing…</span>
                          </>
                        ) : (
                          <>
                            <span className="leading-relaxed px-4">
                              {selectedPlan.isCustom
                                ? 'Initiate Secure Consultation'
                                : 'Complete Onboarding Protocol'}
                            </span>
                            <ArrowRight className="ml-2 h-4 w-4 shrink-0 sm:ml-3 sm:h-5 sm:w-5" />
                          </>
                        )}
                      </Button>

                      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-6">
                        <p className="flex items-center gap-2 text-center text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:text-[9px] sm:tracking-[0.3em]">
                          <Lock className="h-3 w-3 shrink-0 text-primary" />
                          End-to-End Encryption
                        </p>

                        <div className="hidden h-1 w-1 rounded-full bg-white/10 sm:block" />

                        <p className="flex items-center gap-2 text-center text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground sm:text-[9px] sm:tracking-[0.3em]">
                          <ShieldCheck className="h-3 w-3 shrink-0 text-primary" />
                          SOC2 Compliant Transmission
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PayPalModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        initialAmount={payAmount}
      />
    </div>
  );
}
