export interface Project {
  id: string
  title: string
  slug: string
  category: Category
  description: string | null
  short_description: string | null
  cover_image: string | null
  images: string[]
  youtube_url: string | null
  date: string | null
  published: boolean
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

export type Category =
  | 'Casamentos'
  | 'Ensaios'
  | 'Eventos'
  | 'Corporativo'
  | 'Drone'
  | 'Reels'
  | 'Produções Audiovisuais'

export const CATEGORIES: Category[] = [
  'Casamentos',
  'Ensaios',
  'Eventos',
  'Corporativo',
  'Drone',
  'Reels',
  'Produções Audiovisuais',
]

export interface ContactFormData {
  name: string
  phone: string
  email: string
  message: string
}

export interface AdminProjectForm {
  title: string
  category: Category
  description: string
  short_description: string
  youtube_url: string
  date: string
  published: boolean
}
