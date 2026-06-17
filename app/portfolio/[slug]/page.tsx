import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProjectPageClient from './ProjectPageClient'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { DEMO_PROJECTS_DATA } from '@/lib/demoData'
import type { Project } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getProject(slug: string): Promise<Project | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) throw new Error('not found')
    return data as Project
  } catch {
    // Fallback para dados demo se Supabase não estiver configurado
    return DEMO_PROJECTS_DATA.find((p) => p.slug === slug) ?? null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Projeto não encontrado' }
  return {
    title: `${project.title} | Mixelsevla`,
    description: project.description ?? project.short_description ?? '',
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()
  return <ProjectPageClient project={project} />
}

export async function generateStaticParams() {
  // Usa apenas dados demo para build estático — projetos reais são carregados dinamicamente
  return DEMO_PROJECTS_DATA.map((p) => ({ slug: p.slug }))
}
