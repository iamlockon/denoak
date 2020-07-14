CREATE TABLE api_trace (
  id bigint PRIMARY KEY AUTO_INCREMENT,
  content json,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE api_trace ADD INDEX idx_created (created);
ALTER TABLE api_trace ADD INDEX idx_last_updated (last_updated);