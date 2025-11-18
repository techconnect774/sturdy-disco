-- Enable Row Level Security on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ARTICLES TABLE POLICIES
-- ============================================

-- Public read access to published articles
CREATE POLICY "Public can view published articles"
  ON articles
  FOR SELECT
  USING (is_published = true);

-- Admin full access to all articles
CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- MEDIA TABLE POLICIES
-- ============================================

-- Public can view media for published articles
CREATE POLICY "Public can view media for published articles"
  ON media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM articles 
      WHERE articles.id = media.article_id 
      AND articles.is_published = true
    )
  );

-- Admin full access to media
CREATE POLICY "Authenticated users can view all media"
  ON media
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
  ON media
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
  ON media
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- COMMENTS TABLE POLICIES
-- ============================================

-- Public can read all approved comments
CREATE POLICY "Public can view approved comments"
  ON comments
  FOR SELECT
  USING (is_approved = true);

-- Public can create comments (auto-approved)
CREATE POLICY "Anyone can create comments"
  ON comments
  FOR INSERT
  WITH CHECK (is_approved = true);

-- Admin can view all comments
CREATE POLICY "Authenticated users can view all comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can delete comments
CREATE POLICY "Authenticated users can delete comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (true);

-- Admin can update comments (for moderation)
CREATE POLICY "Authenticated users can update comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
