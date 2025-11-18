-- Create media table with foreign key relationships
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('upload', 'url')),
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes on article_id and order_index for performance
CREATE INDEX IF NOT EXISTS idx_media_article 
  ON media(article_id, order_index);

CREATE INDEX IF NOT EXISTS idx_media_article_id 
  ON media(article_id);

CREATE INDEX IF NOT EXISTS idx_media_type 
  ON media(type);
