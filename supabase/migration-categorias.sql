-- =============================================
-- MIGRATION: Categorias dinâmicas + Settings expandido
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

-- 1. Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  active        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed com categorias existentes
INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Casamentos', 'casamentos', 1),
  ('Ensaios', 'ensaios', 2),
  ('Eventos', 'eventos', 3),
  ('Corporativo', 'corporativo', 4),
  ('Drone', 'drone', 5),
  ('Reels', 'reels', 6),
  ('Produções Audiovisuais', 'producoes-audiovisuais', 7)
ON CONFLICT DO NOTHING;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "admin_manage_categories"
  ON public.categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Remove restrição de categoria fixa nos projetos
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

-- 3. Adiciona display_order nos projetos
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 4. Novos campos em site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_title TEXT DEFAULT 'Vamos criar algo incrível juntos.',
  ADD COLUMN IF NOT EXISTS contact_subtitle TEXT DEFAULT 'Tem um projeto em mente? Entre em contato e vamos conversar.',
  ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT 'Olá! Vim pelo site e gostaria de solicitar um orçamento.';
