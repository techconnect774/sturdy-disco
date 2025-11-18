-- Create comments table with auto-approval
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT true
);

-- Add index on article_id for performance
CREATE INDEX IF NOT EXISTS idx_comments_article 
  ON comments(article_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_created 
  ON comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_approved 
  ON comments(is_approved);
