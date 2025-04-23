-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    status VARCHAR(20) NOT NULL
);

-- Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    likes INT NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    publication_id VARCHAR(36) NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    last_sent_at TIMESTAMP
);

-- Initial Super Admin User (password: superadmin123)
INSERT INTO users (id, email, password, role, created_at, status)
VALUES (
    UUID(),
    'superadmin@avolta.be',
    '$2a$10$OwuE.5uLELC1SJ1kkJLYBOT4JWUhbHFKdYUeFN5PnUFmOI6A.RpOu',
    'SUPERADMIN',
    NOW(),
    'ACTIVE'
);

-- Initial Admin User (password: admin123)
INSERT INTO users (id, email, password, role, created_at, status)
VALUES (
    UUID(),
    'admin@avolta.be',
    '$2a$10$8jw0xwzIJPPmVaHO.X9Xn.mb7aJnEE.XFiYZGaRsGxHVc5xJHxqHe',
    'ADMIN',
    NOW(),
    'ACTIVE'
);