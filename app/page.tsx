import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import PortfolioSection from '@/components/PortfolioSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { MessageCircle } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Project, SiteSettings, AboutContent } from '@/lib/types'

// Renderização dinâmica: qualquer atualização no painel aparece imediatamente no site
export const dynamic = 'force-dynamic'

async function fetchAll() {
  try {
    const supabase = await createSupabaseServerClient()

    const [projectsRes, settingsRes, aboutRes] = await Promise.all([
      supabase.from('projects').select('*').eq('published', true).order('date', { ascending: false }),
      supabase.from('site_settings').select('*').eq('id', 1).single(),
      supabase.from('about_content').select('*').eq('id', 1).single(),
    ])

    return {
      projects: (projectsRes.data ?? []) as Project[],
      settings: settingsRes.data as SiteSettings | null,
      about: aboutRes.data as AboutContent | null,
    }
  } catch {
    return { projects: [], settings: null, about: null }
  }
}

export default async function HomePage() {
  const { projects, settings, about } = await fetchAll()

  return (
    <>
      <Navigation />
      <main>
        <HeroSection settings={settings ?? undefined} />
        <PortfolioSection projects={projects} />
        <AboutSection about={about ?? undefined} />
        <ContactSection settings={settings ?? undefined} />
      </main>
      <Footer settings={settings ?? undefined} />

      {/* WhatsApp FAB */}
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
