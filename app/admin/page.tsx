'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Camera,
  Copy, Archive, ArchiveRestore, MessageSquare,
  TrendingUp, FolderOpen,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { DEMO_PROJECTS_DATA } from '@/lib/demoData'
import { slugify } from '@/lib/utils'

type ViewFilter = 'all' | 'published' | 'draft' | 'archived'

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filter, setFilter] = useState<ViewFilter>('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadProjects()
    loadUnreadCount()
  }, [])

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    setProjects(error || !data ? DEMO_PROJECTS_DATA : (data as Project[]))
    setLoading(false)
  }

  const loadUnreadCount = async () => {
    const { count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
    setUnreadCount(count ?? 0)
  }

  const togglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id)
    if (error) { toast.error('Erro ao atualizar.'); return }
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, published: !p.published } : p))
    toast.success(project.published ? 'Projeto ocultado.' : 'Projeto publicado!')
  }

  const duplicateProject = async (project: Project) => {
    const newTitle = `${project.title} (cópia)`
    const newSlug = slugify(newTitle) + '-' + Date.now().toString(36)
    const { error } = await supabase.from('projects').insert({
      title: newTitle,
      slug: newSlug,
      category: project.category,
      description: project.description,
      short_description: project.short_description,
      cover_image: project.cover_image,
      images: project.images,
      youtube_url: project.youtube_url,
      date: project.date,
      published: false,
    })
    if (error) { toast.error('Erro ao duplicar.'); return }
    toast.success('Projeto duplicado!')
    loadProjects()
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Excluir permanentemente? Esta ação não pode ser desfeita.')) return
    setDeleting(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { toast.error('Erro ao excluir.'); setDeleting(null); return }
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast.success('Projeto excluído.')
    setDeleting(null)
  }

  const published = projects.filter((p) => p.published)
  const drafts = projects.filter((p) => !p.published)

  const filtered = projects.filter((p) => {
    if (filter === 'published') return p.published
    if (filter === 'draft') return !p.published
    return true
  })

  const stats = [
    { label: 'Total de projetos', value: projects.length, icon: FolderOpen, color: '#8B5CF6' },
    { label: 'Publicados', value: published.length, icon: Eye, color: '#10b981' },
    { label: 'Rascunhos', value: drafts.length, icon: EyeOff, color: '#f59e0b' },
    { label: 'Orçamentos novos', value: unreadCount, icon: MessageSquare, color: '#3b82f6', href: '/admin/orcamentos' },
  ]

  return (
    <div className="min-h-screen bg-[#080808]">
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            const Wrapper = stat.href ? Link : 'div'
            return (
              <Wrapper
                key={stat.label}
                href={stat.href ?? '#'}
                className={`rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-4 flex items-center gap-3 ${
                  stat.href ? 'hover:border-[rgba(139,92,246,0.25)] transition-all cursor-pointer' : ''
                }`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}18`, color: stat.color }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-white text-xl font-700 leading-none" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
                    {stat.value}
                    {stat.href && unreadCount > 0 && (
                      <span className="ml-1.5 text-[10px] text-[#3b82f6] font-600">novo</span>
                    )}
                  </div>
                  <div className="text-[#555] text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                    {stat.label}
                  </div>
                </div>
              </Wrapper>
            )
          })}
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 bg-[#111] border border-[rgba(139,92,246,0.1)] rounded-xl p-1">
            {(['all', 'published', 'draft'] as ViewFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  filter === f
                    ? 'bg-[rgba(139,92,246,0.2)] text-white border border-[rgba(139,92,246,0.3)]'
                    : 'text-[#666] hover:text-white'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {f === 'all' ? 'Todos' : f === 'published' ? 'Publicados' : 'Rascunhos'}
              </button>
            ))}
          </div>

          <Link href="/admin/projetos/novo" className="btn-primary flex items-center gap-2" style={{ padding: '10px 18px', fontSize: '13px' }}>
            <Plus size={15} />
            Novo Projeto
          </Link>
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl skeleton h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto text-[#333] mb-4" />
            <h2 className="text-xl font-display font-600 text-white mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
              Nenhum projeto ainda
            </h2>
            <p className="text-[#A1A1AA] text-sm mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
              Adicione seu primeiro projeto agora!
            </p>
            <Link href="/admin/projetos/novo" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Adicionar projeto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] overflow-hidden hover:border-[rgba(139,92,246,0.25)] transition-all duration-300 group"
              >
                {/* Cover */}
                <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
                  {project.cover_image ? (
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera size={32} className="text-[#333]" />
                    </div>
                  )}
                  {/* Published badge */}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-600 ${
                    project.published
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#333]/60 text-[#888] border border-[#444]/50'
                  }`} style={{ fontFamily: 'var(--font-inter)' }}>
                    {project.published ? 'Publicado' : 'Rascunho'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="category-badge text-[9px] mb-2 inline-block">
                    {project.category}
                  </span>
                  <h3 className="font-display font-600 text-white text-sm leading-snug mb-1 line-clamp-1" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}>
                    {project.title}
                  </h3>
                  {project.short_description && (
                    <p className="text-[#666] text-xs line-clamp-1 mb-3" style={{ fontFamily: 'var(--font-inter)' }}>
                      {project.short_description}
                    </p>
                  )}

                  {/* Actions row */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/projetos/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all text-xs border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <Pencil size={11} />
                      Editar
                    </Link>
                    <button
                      onClick={() => togglePublish(project)}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                      title={project.published ? 'Ocultar' : 'Publicar'}
                    >
                      {project.published ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => duplicateProject(project)}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                      title="Duplicar"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={deleting === project.id}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-red-900/20 text-[#A1A1AA] hover:text-red-400 transition-all border border-[#2a2a2a] hover:border-red-900/40 disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick tip */}
        {!loading && projects.length > 0 && (
          <p className="text-center text-[#333] text-xs mt-8" style={{ fontFamily: 'var(--font-inter)' }}>
            Dica: use o ícone <Copy size={10} className="inline" /> para duplicar um projeto rapidamente
          </p>
        )}
      </main>
    </div>
  )
}
