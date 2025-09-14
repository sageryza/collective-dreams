-- Dream Journal Database Schema

-- Users table for authentication (private)
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Dreams table (anonymous display)
CREATE TABLE dreams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Comments table (threaded, anonymous display)
CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dream_id uuid REFERENCES dreams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Hearts/Likes table (anonymous interactions)
CREATE TABLE hearts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dream_id uuid REFERENCES dreams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT NOW(),
  UNIQUE(dream_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_dreams_created_at ON dreams(created_at DESC);
CREATE INDEX idx_comments_dream_id ON comments(dream_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_hearts_dream_id ON hearts(dream_id);
CREATE INDEX idx_hearts_user_id ON hearts(user_id);

-- Row Level Security policies (for Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can only see their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Policies for dreams table
CREATE POLICY "Anyone can read dreams" ON dreams
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own dreams" ON dreams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams" ON dreams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams" ON dreams
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for comments table
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for hearts table
CREATE POLICY "Anyone can read hearts" ON hearts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own hearts" ON hearts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hearts" ON hearts
  FOR DELETE USING (auth.uid() = user_id);