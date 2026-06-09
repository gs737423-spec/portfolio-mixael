-- =============================================
-- PORTFOLIO FOTOGRAFO — SCHEMA SUPABASE
-- Execute no SQL Editor do Supabase
-- =============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: projects
-- =============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Casamentos', 'Ensaios', 'Eventos', 'Corporativo',
    'Drone', 'Reels', 'Produções Audiovisuais'
  )),
  description TEXT,
  short_description TEXT,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  youtube_url TEXT,
  date DATE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  photo TEXT,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================

-- Projects: leitura pública para publicados
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published projects"
  ON public.projects FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can do everything"
  ON public.projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Testimonials: leitura pública
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read testimonials"
  ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON public.testimonials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET
-- =============================================

-- Criar bucket 'portfolio'
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Política de leitura pública para as imagens
CREATE POLICY "Public can read portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Apenas autenticados podem fazer upload
CREATE POLICY "Authenticated can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete portfolio images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- =============================================
-- FUNÇÃO: auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DADOS DE EXEMPLO (opcional)
-- =============================================
-- Descomente para inserir dados demo:

/*
INSERT INTO public.projects (title, slug, category, short_description, cover_image, published, date)
VALUES
  ('Casamento Isabela & Rafael', 'casamento-isabela-rafael', 'Casamentos',
   'Cerimônia ao pôr do sol com 450 convidados',
   'https://images.unsplash.com/photo-1519741497674-611481863552?w=900',
   true, '2024-06-15'),
  ('Ensaio Ana Clara', 'ensaio-ana-clara', 'Ensaios',
   'Ensaio urbano com luz natural em São Paulo',
   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900',
   true, '2024-08-20');
*/
