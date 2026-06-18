export interface Project {
  id: string
  title: string
  slug: string
  category: string
  description: string | null
  short_description: string | null
  cover_image: string | null
  images: string[]
  youtube_url: string | null
  date: string | null
  display_order: number
  published: boolean
  client_id: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  active: boolean
  display_order: number
  created_at: string
}

export interface ClientMedia {
  id: string
  client_id: string
  type: 'reel' | 'video'
  title: string
  thumbnail: string | null
  video_url: string | null
  display_order: number
  created_at: string
}

export interface CategoryItem {
  id: string
  name: string
  slug: string
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  photo: string | null
  comment: string
  rating: number
  created_at: string
}

export interface SiteSettings {
  id: number
  whatsapp: string
  phone: string
  email: string
  instagram_handle: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  contact_title: string
  contact_subtitle: string
  whatsapp_message: string
  footer_tagline: string
  updated_at: string
}

export interface AboutContent {
  id: number
  photo: string | null
  name: string
  bio_paragraph1: string
  bio_paragraph2: string
  skills: string[]
  stat1_value: string
  stat1_label: string
  stat2_value: string
  stat2_label: string
  stat3_value: string
  stat3_label: string
  stat4_value: string
  stat4_label: string
  experience_years: string
  updated_at: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp: '5511999990000',
  phone: '',
  email: 'contato@mixaelsevla.com',
  instagram_handle: '@mixaelsevla.foto',
  instagram_url: 'https://instagram.com/mixaelsevla.foto',
  facebook_url: '',
  tiktok_url: '',
  contact_title: 'Vamos criar algo incrível juntos.',
  contact_subtitle: 'Tem um projeto em mente? Entre em contato e vamos conversar.',
  whatsapp_message: 'Olá! Vim pelo site e gostaria de solicitar um orçamento.',
  footer_tagline: 'Fotografia & Produção Audiovisual',
  updated_at: '',
}

export const DEFAULT_ABOUT: AboutContent = {
  id: 1,
  photo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80',
  name: 'Mixelsevla',
  bio_paragraph1: 'Sou Mixelsevla, fotógrafo e videomaker apaixonado por capturar a essência dos momentos. Com mais de 8 anos de experiência, me especializei em transformar visões criativas em narrativas visuais poderosas — de casamentos íntimos a grandes produções corporativas.',
  bio_paragraph2: 'Meu trabalho vai além da técnica: é sobre conexão genuína com as pessoas e o profundo respeito pela singularidade de cada momento. Cada projeto recebe atenção total, do planejamento criativo à entrega final.',
  skills: ['Fotografia de Casamentos', 'Produção Audiovisual', 'Drone & Aéreo', 'Reels & Social Media', 'Eventos Corporativos', 'Documentários', 'Color Grading', 'Motion Graphics'],
  stat1_value: '500+',
  stat1_label: 'Projetos',
  stat2_value: '8+',
  stat2_label: 'Anos',
  stat3_value: '300+',
  stat3_label: 'Clientes',
  stat4_value: '12',
  stat4_label: 'Prêmios',
  experience_years: '8+',
  updated_at: '',
}

export interface ContactFormData {
  name: string
  phone: string
  whatsapp: string
  email: string
  service_type: string
  message: string
}

export interface ContactSubmission {
  id: string
  name: string
  phone: string
  whatsapp: string
  email: string
  service_type: string | null
  message: string
  read: boolean
  created_at: string
}

export interface SeoSettings {
  id: number
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_title: string
  og_description: string
  og_image: string | null
  updated_at: string
}

export interface MediaFile {
  id: string
  name: string
  url: string
  path: string
  size: number
  type: string
  created_at: string
}

export interface AdminProjectForm {
  title: string
  category: string
  description: string
  short_description: string
  youtube_url: string
  date: string
  display_order: number
  published: boolean
}
