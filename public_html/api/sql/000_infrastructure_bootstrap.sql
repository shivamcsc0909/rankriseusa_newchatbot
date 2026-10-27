-- RankRise MySQL schema stub (Phase 3 infrastructure)
-- Apply manually in Hostinger phpMyAdmin when ready.
-- Chat/KB tables will be expanded in a later phase.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS schema_migrations (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  migration   VARCHAR(191) NOT NULL UNIQUE,
  applied_at  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO schema_migrations (migration) VALUES ('000_infrastructure_bootstrap');
