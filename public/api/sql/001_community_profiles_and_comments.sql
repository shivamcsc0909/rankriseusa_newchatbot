-- RankRise MySQL Schema Migration: User Profiles & Community Comments
-- Apply manually in Hostinger phpMyAdmin or automated migration script.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id            VARCHAR(64) NOT NULL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(191) NOT NULL UNIQUE,
  company       VARCHAR(150) DEFAULT NULL,
  website       VARCHAR(255) DEFAULT NULL,
  industry      VARCHAR(100) DEFAULT NULL,
  country       VARCHAR(100) DEFAULT NULL,
  phone         VARCHAR(50) DEFAULT NULL,
  profile_image TEXT DEFAULT NULL,
  bio           TEXT DEFAULT NULL,
  status        ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_profiles_email (email),
  INDEX idx_profiles_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
  id            VARCHAR(64) NOT NULL PRIMARY KEY,
  profile_id    VARCHAR(64) NOT NULL,
  author_name   VARCHAR(150) NOT NULL,
  author_email  VARCHAR(191) NOT NULL,
  author_company VARCHAR(150) DEFAULT NULL,
  author_industry VARCHAR(100) DEFAULT NULL,
  author_avatar TEXT DEFAULT NULL,
  target_type   VARCHAR(64) NOT NULL DEFAULT 'blog',
  target_id     VARCHAR(191) NOT NULL,
  parent_id     VARCHAR(64) DEFAULT NULL,
  content       TEXT NOT NULL,
  status        ENUM('pending', 'approved', 'rejected', 'hidden') NOT NULL DEFAULT 'approved',
  is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address    VARCHAR(45) DEFAULT NULL,
  created_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at    DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX idx_comments_target (target_type, target_id),
  INDEX idx_comments_parent (parent_id),
  INDEX idx_comments_status (status),
  INDEX idx_comments_pinned (is_pinned),
  CONSTRAINT fk_comments_profile FOREIGN KEY (profile_id) REFERENCES user_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO schema_migrations (migration) VALUES ('001_community_profiles_and_comments');
