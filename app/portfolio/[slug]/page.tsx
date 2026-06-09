import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProjectPageClient from './ProjectPageClient'

// Demo data — replace with Supabase fetch
import { DEMO_PROJECTS_DATA } from '@/lib/demoData'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = DEMO_PROJECTS_DATA.find((p) => p.slug === slug)
  if (!project) return { title: 'Projeto não encontrado' }
  return {
    title: `${project.title} | Lucas Oliveira`,
    description: project.description ?? project.short_description ?? '',
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = DEMO_PROJECTS_DATA.find((p) => p.slug === slug)
  if (!project) notFound()
  return <ProjectPageClient project={project} />
}

export function generateStaticParams() {
  return DEMO_PROJECTS_DATA.map((p) => ({ slug: p.slug }))
}
