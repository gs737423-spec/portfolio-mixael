import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProjectPageClient from './ProjectPageClient'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { DEMO_PROJECTS_DATA } from '@/lib/demoData'
import type { Project } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getProject(slug: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const [projectRes, settingsRes] = await Promise.all([
      supabase.from('projects').select('*').eq('slug', slug).eq('published', true).single(),
      supabase.from('site_settings').select('whatsapp').eq('id', 1).single(),
    ])

    if (projectRes.error || !projectRes.data) throw new Error('not found')
    return {
      project: projectRes.data as Project,
      whatsapp: (settingsRes.data?.whatsapp as string) ?? '5521991838960',
    }
  } catch {
    const demo = DEMO_PROJECTS_DATA.find((p) => p.slug === slug)
    return demo ? { project: demo, whatsapp: '5521991838960' } : null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getProject(slug)
  if (!result) return { title: 'Projeto não encontrado' }
  return {
    title: `${result.project.title} | Mixelsevla`,
    description: result.project.description ?? result.project.short_description ?? '',
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const result = await getProject(slug)
  if (!result) notFound()
  return <ProjectPageClient project={result.project} whatsapp={result.whatsapp} />
}

export async function generateStaticParams() {
  // Usa apenas dados demo para build estático — projetos reais são carregados dinamicamente
  return DEMO_PROJECTS_DATA.map((p) => ({ slug: p.slug }))
}
