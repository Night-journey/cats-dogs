CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS animals (
  id SERIAL PRIMARY KEY,
  avatar_url TEXT,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(20) NOT NULL CHECK (species IN ('cat', 'dog')),
  coat_color VARCHAR(50),
  gender VARCHAR(20),
  age VARCHAR(50),
  neutered BOOLEAN DEFAULT FALSE,
  location TEXT,
  active_time VARCHAR(20),
  personality_tags TEXT[],
  description TEXT,
  adoption_status VARCHAR(40) NOT NULL DEFAULT 'campus resident',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  author_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  author_id INT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS help_requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  location TEXT,
  contact_info TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adoption_requests (
  id SERIAL PRIMARY KEY,
  animal_id INT REFERENCES animals(id) ON DELETE CASCADE,
  applicant_id INT REFERENCES users(id) ON DELETE CASCADE,
  applicant_name VARCHAR(100) NOT NULL,
  contact TEXT NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
