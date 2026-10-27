-- ==============================================================================
-- RankRise USA - Complete Production Database Setup (Hostinger MySQL)
-- Database Name: u834013214_rrr
-- Compatible with: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ==============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- ------------------------------------------------------------------------------
-- 1. Schema Migrations Tracker
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `migration` VARCHAR(191) NOT NULL UNIQUE,
  `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `schema_migrations` (`migration`) VALUES 
('000_infrastructure_bootstrap'),
('001_community_profiles_and_comments'),
('002_blog_cms_system'),
('003_live_chat_system'),
('004_blog_gallery_and_views'),
('005_visitor_intelligence_and_reviews');

-- ------------------------------------------------------------------------------
-- 2. User Profiles & Authentication Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `auth_provider` VARCHAR(50) NOT NULL DEFAULT 'email', -- 'email' or 'google'
  `google_id` VARCHAR(191) DEFAULT NULL,
  `role` ENUM('user', 'author', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
  `company` VARCHAR(150) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `industry` VARCHAR(100) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `profile_image` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'suspended') NOT NULL DEFAULT 'approved',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_profiles_email` (`email`),
  INDEX `idx_profiles_status` (`status`),
  INDEX `idx_profiles_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Dynamic Blog Posts CMS Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Intelligence',
  `tags` TEXT DEFAULT NULL,
  `featured_image` TEXT DEFAULT NULL,
  `gallery` TEXT DEFAULT NULL,
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `og_title` VARCHAR(255) DEFAULT NULL,
  `og_description` TEXT DEFAULT NULL,
  `og_image` TEXT DEFAULT NULL,
  `twitter_card` VARCHAR(50) DEFAULT 'summary_large_image',
  `twitter_title` VARCHAR(255) DEFAULT NULL,
  `twitter_description` TEXT DEFAULT NULL,
  `twitter_image` TEXT DEFAULT NULL,
  `json_ld` LONGTEXT DEFAULT NULL,
  `reading_time` VARCHAR(50) DEFAULT '5 min read',
  `author_id` VARCHAR(64) DEFAULT NULL,
  `author_name` VARCHAR(150) NOT NULL DEFAULT 'RankRise Intelligence',
  `author_title` VARCHAR(150) DEFAULT 'Growth Strategist',
  `author_avatar` TEXT DEFAULT NULL,
  `status` ENUM('draft', 'pending', 'published', 'rejected', 'archived') NOT NULL DEFAULT 'published',
  `scheduled_at` DATETIME DEFAULT NULL,
  `views` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_status` (`status`),
  INDEX `idx_blog_category` (`category`),
  INDEX `idx_blog_views` (`views`),
  INDEX `idx_blog_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Blog Comments & Nested Replies Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `community_comments` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `profile_id` VARCHAR(64) NOT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_email` VARCHAR(191) NOT NULL,
  `author_company` VARCHAR(150) DEFAULT NULL,
  `author_industry` VARCHAR(100) DEFAULT NULL,
  `author_avatar` TEXT DEFAULT NULL,
  `target_type` VARCHAR(64) NOT NULL DEFAULT 'blog',
  `target_id` VARCHAR(191) NOT NULL,
  `parent_id` VARCHAR(64) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected', 'hidden') NOT NULL DEFAULT 'approved',
  `is_pinned` BOOLEAN NOT NULL DEFAULT FALSE,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_comments_target` (`target_type`, `target_id`),
  INDEX `idx_comments_parent` (`parent_id`),
  INDEX `idx_comments_status` (`status`),
  INDEX `idx_comments_pinned` (`is_pinned`),
  CONSTRAINT `fk_comments_profile` FOREIGN KEY (`profile_id`) REFERENCES `user_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Blog Ratings & Reviews Table (1-5 Star System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blog_reviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `blog_slug` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(150) NOT NULL,
  `user_email` VARCHAR(191) NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5, -- 1 to 5
  `review_text` TEXT DEFAULT NULL,
  `status` ENUM('approved', 'pending', 'hidden') NOT NULL DEFAULT 'approved',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY `uniq_user_blog_rating` (`blog_slug`, `user_id`),
  INDEX `idx_reviews_blog` (`blog_slug`),
  INDEX `idx_reviews_status` (`status`),
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `user_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Visitor Intelligence & Activity Tracking Tables
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `visitor_sessions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `visitor_token` VARCHAR(128) NOT NULL,
  `user_id` VARCHAR(64) DEFAULT NULL,
  `user_email` VARCHAR(191) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `country` VARCHAR(80) DEFAULT NULL,
  `city` VARCHAR(80) DEFAULT NULL,
  `browser` VARCHAR(64) DEFAULT NULL,
  `os` VARCHAR(64) DEFAULT NULL,
  `device` VARCHAR(64) DEFAULT NULL,
  `referrer` VARCHAR(512) DEFAULT NULL,
  `landing_page` VARCHAR(512) DEFAULT NULL,
  `pageviews_count` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_active_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_sessions_visitor` (`visitor_token`),
  INDEX `idx_sessions_email` (`user_email`),
  INDEX `idx_sessions_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `visitor_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(64) NOT NULL,
  `visitor_token` VARCHAR(128) NOT NULL,
  `user_email` VARCHAR(191) DEFAULT NULL,
  `event_type` VARCHAR(64) NOT NULL, -- 'pageview', 'lead_form', 'blog_read', 'cta_click', 'auth_login'
  `page_url` VARCHAR(512) NOT NULL,
  `page_title` VARCHAR(255) DEFAULT NULL,
  `event_data` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_events_session` (`session_id`),
  INDEX `idx_events_visitor` (`visitor_token`),
  INDEX `idx_events_type` (`event_type`),
  INDEX `idx_events_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Captured Leads Management Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `source` VARCHAR(100) NOT NULL DEFAULT 'contact_form',
  `name` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `company` VARCHAR(150) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `fields_json` LONGTEXT DEFAULT NULL,
  `status` ENUM('new', 'read', 'contacted', 'archived') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_email` (`email`),
  INDEX `idx_leads_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. Seed Default Initial Content & Admin Profile
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO `user_profiles` (`id`, `name`, `email`, `role`, `company`, `bio`, `status`)
VALUES 
('usr_admin_rankrise_001', 'RankRise Administrator', 'info@rankriseusa.com', 'superadmin', 'RankRise USA', 'Lead growth engineer & system administrator.', 'approved');

INSERT IGNORE INTO `blog_posts` (`id`, `slug`, `title`, `excerpt`, `content`, `category`, `tags`, `featured_image`, `author_name`, `status`, `views`)
VALUES 
('post_ai_seo_2026', 'ai-seo-strategies-2026', 'Next-Gen AI SEO: How Search Generative Experience is Changing Organic Traffic', 'A comprehensive breakdown of generative engine optimization (GEO), neural intent ranking, and how US brands are scaling organic acquisition.', '<h2>The Evolution of Search in 2026</h2><p>Search engines have evolved from keyword matching to neural intent architectures. To dominate the generative landscape, brands must engineer authority signals and direct answers.</p><h3>Key Pillars of Modern SEO</h3><ul><li>Generative Engine Optimization (GEO)</li><li>Entity-based semantic schema</li><li>Sub-second Time-to-First-Byte (TTFB)</li></ul>', 'SEO', 'AI, SEO, Strategy, Growth', '/assets/images/services/seo.webp', 'Shivam Pandey', 'published', 1420),
('post_web_dev_performance', 'modern-web-architecture-speed-optimization', 'Architecting Sub-Second Web Applications with React 19 & Edge Caching', 'Technical guide on optimizing Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and bundle chunking for enterprise web platforms.', '<h2>Performance as a Revenue Driver</h2><p>In competitive markets, every 100ms delay costs 1% in conversion. We build modular, edge-rendered applications that load instantly across all devices.</p>', 'Development', 'React, Performance, Web Development', '/assets/images/services/web.webp', 'RankRise Engineering', 'published', 980);

SET foreign_key_checks = 1;
