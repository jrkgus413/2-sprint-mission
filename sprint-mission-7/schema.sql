-- ENUM types
CREATE TYPE content_type AS ENUM ('post', 'product');

-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  email VARCHAR(50) UNIQUE NOT NULL,
  nickname VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  price NUMERIC(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id),
  category_id INT REFERENCES categories(id) ON DELETE CASCADE
);

-- likes
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  likeable_type content_type,
  likeable_id INT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
  UNIQUE (user_id, likeable_type, likeable_id)
);

-- comments
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  commentable_type content_type,
  commentable_id INT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- images
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  imageable_type content_type,
  imageable_id INT,
  url TEXT NOT NULL
);

-- tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  content TEXT UNIQUE
);

-- product_tags
CREATE TABLE product_tags (
  PRIMARY KEY (product_id, tag_id),
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  tag_id INT REFERENCES tags(id) ON DELETE CASCADE
);

