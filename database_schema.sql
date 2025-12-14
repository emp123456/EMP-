-- EMP DATABASE SCHEMA V1.0 --
-- Dialect: PostgreSQL / Generic SQL --

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Recommended to hash
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'user' -- 'admin' or 'user'
);

CREATE TABLE briefings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    target_name VARCHAR(255),
    site_type VARCHAR(100),
    insanity_level INTEGER,
    details TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE meetings (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    email VARCHAR(255),
    scheduled_date DATE,
    scheduled_time TIME,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    admin_id VARCHAR(50) DEFAULT 'ADMIN',
    message TEXT NOT NULL,
    direction VARCHAR(10) CHECK (direction IN ('USER_TO_ADMIN', 'ADMIN_TO_USER')),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- INDEXES --
CREATE INDEX idx_briefings_status ON briefings(status);
CREATE INDEX idx_chats_userid ON chats(user_id);
