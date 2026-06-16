-- =============================================
-- PORTFOLIO MIXAEL SEVLA — SCHEMA SUPABASE
-- Execute no SQL Editor do Supabase Dashboard
-- =============================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: projects
-- =============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  category      TEXT NOT NULL CHECK (category IN (
                  'Casamentos', 'Ensaios', 'Eventos', 'Corporativo',
                  'Drone', 'Reels', 'Produções Audiovisuais'
                )),
  description       TEXT,
  short_description TEXT,
  cover_image       TEXT,
  images            TEXT[] DEFAULT '{}',
  youtube_url       TEXT,
  date              DATE,
  published         BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT,
  photo      TEXT,
  comment    TEXT NOT NULL,
  rating     INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY — projects
-- =============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Visitantes: lê apenas projetos publicados
CREATE POLICY "public_read_published"
  ON public.projects FOR SELECT
  USING (published = true);

-- Admin: acesso total
CREATE POLICY "admin_all"
  ON public.projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- ROW LEVEL SECURITY — testimonials
-- =============================================
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_testimonials"
  ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "admin_manage_testimonials"
  ON public.testimonials FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKET: portfolio
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública das imagens
CREATE POLICY "public_read_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio');

-- Upload por usuários autenticados
CREATE POLICY "admin_upload_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Atualização por usuários autenticados
CREATE POLICY "admin_update_images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Exclusão por usuários autenticados
CREATE POLICY "admin_delete_images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- =============================================
-- TRIGGER: atualiza updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABELA: site_settings (linha única)
-- =============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp        TEXT DEFAULT '5511999990000',
  email           TEXT DEFAULT 'contato@mixaelsevla.com',
  instagram_handle TEXT DEFAULT '@mixaelsevla.foto',
  instagram_url   TEXT DEFAULT 'https://instagram.com/mixaelsevla.foto',
  hero_subtitle   TEXT DEFAULT 'Fotografia e produção audiovisual para marcas, eventos e pessoas.',
  hero_location   TEXT DEFAULT 'São Paulo, Brasil',
  hero_stat1_value TEXT DEFAULT '500+',
  hero_stat1_label TEXT DEFAULT 'Projetos',
  hero_stat2_value TEXT DEFAULT '8+',
  hero_stat2_label TEXT DEFAULT 'Anos',
  hero_stat3_value TEXT DEFAULT '300+',
  hero_stat3_label TEXT DEFAULT 'Clientes',
  footer_tagline  TEXT DEFAULT 'Fotografia & Produção Audiovisual',
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_site_settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "admin_manage_site_settings"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABELA: about_content (linha única)
-- =============================================
CREATE TABLE IF NOT EXISTS public.about_content (
  id               INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  photo            TEXT DEFAULT 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
  name             TEXT DEFAULT 'Mixael Sevla',
  bio_paragraph1   TEXT DEFAULT 'Sou Mixael Sevla, fotógrafo e videomaker apaixonado por capturar a essência dos momentos. Com mais de 8 anos de experiência, me especializei em transformar visões criativas em narrativas visuais poderosas — de casamentos íntimos a grandes produções corporativas.',
  bio_paragraph2   TEXT DEFAULT 'Meu trabalho vai além da técnica: é sobre conexão genuína com as pessoas e o profundo respeito pela singularidade de cada momento. Cada projeto recebe atenção total, do planejamento criativo à entrega final.',
  skills           TEXT[] DEFAULT ARRAY['Fotografia de Casamentos', 'Produção Audiovisual', 'Drone & Aéreo', 'Reels & Social Media', 'Eventos Corporativos', 'Documentários', 'Color Grading', 'Motion Graphics'],
  stat1_value      TEXT DEFAULT '500+',
  stat1_label      TEXT DEFAULT 'Projetos',
  stat2_value      TEXT DEFAULT '8+',
  stat2_label      TEXT DEFAULT 'Anos',
  stat3_value      TEXT DEFAULT '300+',
  stat3_label      TEXT DEFAULT 'Clientes',
  stat4_value      TEXT DEFAULT '12',
  stat4_label      TEXT DEFAULT 'Prêmios',
  experience_years TEXT DEFAULT '8+',
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.about_content (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_about"
  ON public.about_content FOR SELECT USING (true);

CREATE POLICY "admin_manage_about"
  ON public.about_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_about_updated_at ON public.about_content;
CREATE TRIGGER update_about_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TABELA: contact_submissions (orçamentos)
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT,
  whatsapp     TEXT,
  email        TEXT,
  service_type TEXT,
  message      TEXT NOT NULL,
  read         BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode inserir (enviar formulário)
CREATE POLICY "public_insert_contact"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Apenas admin lê os contatos
CREATE POLICY "admin_read_contact"
  ON public.contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "admin_manage_contact"
  ON public.contact_submissions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- TABELA: seo_settings (linha única)
-- =============================================
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id               INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  meta_title       TEXT DEFAULT 'Mixael Sevla | Fotografia & Produção Audiovisual',
  meta_description TEXT DEFAULT 'Fotografia e produção audiovisual para marcas, eventos e pessoas. Casamentos, ensaios, eventos corporativos, drone e reels.',
  meta_keywords    TEXT DEFAULT 'fotografia, videomaker, casamento, eventos, drone, São Paulo, reels',
  og_title         TEXT DEFAULT 'Mixael Sevla | Fotografia & Produção Audiovisual',
  og_description   TEXT DEFAULT 'Transformando momentos em histórias inesquecíveis.',
  og_image         TEXT,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.seo_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_seo"
  ON public.seo_settings FOR SELECT USING (true);

CREATE POLICY "admin_manage_seo"
  ON public.seo_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_seo_updated_at ON public.seo_settings;
CREATE TRIGGER update_seo_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
