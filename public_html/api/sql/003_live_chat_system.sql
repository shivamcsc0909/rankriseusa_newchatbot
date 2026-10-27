-- RankRise USA Live Chat schema
-- Primary runtime on shared hosting uses JSON (storage/chat/*.json).
-- This SQL mirrors the same model for MySQL/MariaDB when available.

CREATE TABLE IF NOT EXISTS chat_agents (
  id VARCHAR(64) PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL,
  is_online TINYINT(1) NOT NULL DEFAULT 0,
  last_seen_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_visitors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NULL,
  ip VARCHAR(64) NULL,
  country VARCHAR(80) NULL,
  user_agent VARCHAR(512) NULL,
  browser VARCHAR(64) NULL,
  device VARCHAR(64) NULL,
  os VARCHAR(64) NULL,
  current_page VARCHAR(512) NULL,
  referrer VARCHAR(512) NULL,
  language VARCHAR(64) NULL,
  timezone VARCHAR(64) NULL,
  first_seen_at BIGINT NOT NULL,
  last_seen_at BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chat_visitors_last_seen (last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_sessions (
  id VARCHAR(64) PRIMARY KEY,
  visitor_id VARCHAR(64) NOT NULL,
  status ENUM('open','pending','closed') NOT NULL DEFAULT 'open',
  assigned_agent_id VARCHAR(64) NULL,
  unread_count INT NOT NULL DEFAULT 0,
  last_message_at BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chat_sessions_visitor (visitor_id),
  INDEX idx_chat_sessions_status (status),
  INDEX idx_chat_sessions_assigned (assigned_agent_id),
  INDEX idx_chat_sessions_last_message (last_message_at),
  CONSTRAINT fk_chat_sessions_visitor FOREIGN KEY (visitor_id) REFERENCES chat_visitors(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_sessions_agent FOREIGN KEY (assigned_agent_id) REFERENCES chat_agents(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  visitor_id VARCHAR(64) NOT NULL,
  author ENUM('visitor','agent') NOT NULL,
  agent_id VARCHAR(64) NULL,
  content TEXT NOT NULL,
  status ENUM('sent','delivered','seen') NOT NULL DEFAULT 'sent',
  seen_at BIGINT NULL,
  source VARCHAR(32) NULL COMMENT 'bot|human|system',
  created_at_ms BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_messages_session (session_id),
  INDEX idx_chat_messages_visitor (visitor_id),
  INDEX idx_chat_messages_created (created_at_ms),
  CONSTRAINT fk_chat_messages_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_messages_visitor FOREIGN KEY (visitor_id) REFERENCES chat_visitors(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_notifications (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(64) NOT NULL DEFAULT 'human_handover',
  conversation_id VARCHAR(64) NULL,
  visitor_id VARCHAR(64) NULL,
  trigger_code VARCHAR(120) NULL,
  label VARCHAR(190) NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'normal',
  visitor_message TEXT NULL,
  status VARCHAR(32) NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_notifications_read (is_read),
  INDEX idx_chat_notifications_conversation (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
