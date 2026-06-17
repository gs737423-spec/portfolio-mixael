import Navigation from '@/components/Navigation'
import PortfolioSection from '@/components/PortfolioSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { MessageCircle } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Project, SiteSettings, AboutContent, CategoryItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function fetchAll() {
  try {
    const supabase = await createSupabaseServerClient()

    const [projectsRes, settingsRes, aboutRes, categoriesRes] = await Promise.all([
      supabase.from('projects').select('*').eq('published', true).order('display_order', { ascending: true }).order('date', { ascending: false }),
      supabase.from('site_settings').select('*').eq('id', 1).single(),
      supabase.from('about_content').select('*').eq('id', 1).single(),
      supabase.from('categories').select('*').eq('active', true).order('display_order', { ascending: true }),
    ])

    return {
      projects: (projectsRes.data ?? []) as Project[],
      settings: settingsRes.data as SiteSettings | null,
      about: aboutRes.data as AboutContent | null,
      categories: (categoriesRes.data ?? []) as CategoryItem[],
    }
  } catch {
    return { projects: [], settings: null, about: null, categories: [] }
  }
}

export default async function HomePage() {
  const { projects, settings, about, categories } = await fetchAll()

  return (
    <>
      <Navigation />
      <main>
        <PortfolioSection projects={projects} categories={categories} />
        <AboutSection about={about ?? undefined} />
        <ContactSection settings={settings ?? undefined} />
      </main>
      <Footer settings={settings ?? undefined} />

      <a
        href={`https://wa.me/${settings?.whatsapp ?? '5511999990000'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={24} color="white" />
      </a>
    </>
  )
}
