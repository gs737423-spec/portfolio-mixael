-- Migration: Add multiple videos and tags support to projects
-- Run this on your Supabase project (djnmknbwfvfaaidujrjh)

-- 1. Add video_urls column (JSONB array of {title, url} objects)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_urls JSONB DEFAULT '[]';

-- 2. Add tags column (text array for multi-tag filtering)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. Migrate existing youtube_url data into video_urls
UPDATE public.projects
SET video_urls = json_build_array(json_build_object('title', '', 'url', youtube_url))
WHERE youtube_url IS NOT NULL
  AND youtube_url != ''
  AND (video_urls IS NULL OR video_urls = '[]'::jsonb);

-- 4. Create index for tag-based filtering
CREATE INDEX IF NOT EXISTS idx_projects_tags ON public.projects USING GIN (tags);
