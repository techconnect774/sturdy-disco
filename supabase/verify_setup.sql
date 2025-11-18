-- Verification script to check your Supabase setup
-- Run this in your Supabase SQL Editor to verify everything is configured correctly

-- 1. Check if tables exist
SELECT 
  'Tables Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'articles') THEN '✓ articles table exists'
    ELSE '✗ articles table missing - run 001_create_articles_table.sql'
  END as articles,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'media') THEN '✓ media table exists'
    ELSE '✗ media table missing - run 002_create_media_table.sql'
  END as media,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN '✓ comments table exists'
    ELSE '✗ comments table missing - run 003_create_comments_table.sql'
  END as comments;

-- 2. Check if RLS is enabled
SELECT 
  'RLS Check' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ RLS enabled'
    ELSE '✗ RLS disabled - run 004_enable_rls_policies.sql'
  END as status
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('articles', 'media', 'comments');

-- 3. Check storage bucket
SELECT 
  'Storage Bucket Check' as check_type,
  CASE 
    WHEN EXISTS (SELECT FROM storage.buckets WHERE id = 'media') THEN '✓ media bucket exists'
    ELSE '✗ media bucket missing - run 005_create_storage_bucket.sql'
  END as bucket_status;

-- 4. Check auth users
SELECT 
  'Auth Users Check' as check_type,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ Admin users exist'
    ELSE '✗ No users - create one in Authentication panel'
  END as status
FROM auth.users;

-- 5. Check articles count
SELECT 
  'Articles Check' as check_type,
  COUNT(*) as total_articles,
  COUNT(*) FILTER (WHERE is_published = true) as published_articles,
  COUNT(*) FILTER (WHERE is_published = false) as draft_articles
FROM articles;

-- 6. List all users (for getting user ID)
SELECT 
  '=== Your Admin Users ===' as info,
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
