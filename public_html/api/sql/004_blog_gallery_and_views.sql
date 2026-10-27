-- Gallery JSON column + views index for Blog CMS
-- Apply in phpMyAdmin if ALTER was not auto-run by BlogStore::save().

SET NAMES utf8mb4;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS gallery TEXT NULL AFTER featured_image;

CREATE INDEX IF NOT EXISTS idx_blog_views ON blog_posts (views);

INSERT IGNORE INTO schema_migrations (migration) VALUES ('004_blog_gallery_and_views');
