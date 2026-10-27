-- RankRise MySQL Schema Migration: SEO Blog CMS System
-- Apply manually in Hostinger phpMyAdmin or automated migration script.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS blog_posts (
  id                  VARCHAR(64) NOT NULL PRIMARY KEY,
  slug                VARCHAR(191) NOT NULL UNIQUE,
  title               VARCHAR(255) NOT NULL,
  excerpt             TEXT NOT NULL,
  content             LONGTEXT NOT NULL,
  category            VARCHAR(100) NOT NULL DEFAULT 'Intelligence',
  tags                TEXT DEFAULT NULL,
  featured_image      TEXT DEFAULT NULL,
  seo_title           VARCHAR(255) DEFAULT NULL,
  seo_description     TEXT DEFAULT NULL,
  canonical_url       VARCHAR(255) DEFAULT NULL,
  og_title            VARCHAR(255) DEFAULT NULL,
  og_description      TEXT DEFAULT NULL,
  og_image            TEXT DEFAULT NULL,
  twitter_card        VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_title       VARCHAR(255) DEFAULT NULL,
  twitter_description TEXT DEFAULT NULL,
  twitter_image       TEXT DEFAULT NULL,
  json_ld             LONGTEXT DEFAULT NULL,
  reading_time        VARCHAR(50) DEFAULT '5 min read',
  author_name         VARCHAR(150) NOT NULL DEFAULT 'RankRise Intelligence',
  author_title        VARCHAR(150) DEFAULT 'Growth Strategist',
  author_avatar       TEXT DEFAULT NULL,
  status              ENUM('draft', 'published', 'scheduled') NOT NULL DEFAULT 'published',
  scheduled_at        DATETIME DEFAULT NULL,
  views               INT NOT NULL DEFAULT 0,
  created_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at          DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_blog_slug (slug),
  INDEX idx_blog_status (status),
  INDEX idx_blog_category (category),
  INDEX idx_blog_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO schema_migrations (migration) VALUES ('002_blog_cms_system');
