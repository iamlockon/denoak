CREATE TABLE example (
  id bigint PRIMARY KEY AUTO_INCREMENT,
  description text,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE example AUTO_INCREMENT=10000;

ALTER TABLE example ADD INDEX idx_created (created);
ALTER TABLE example ADD INDEX idx_last_updated (last_updated);