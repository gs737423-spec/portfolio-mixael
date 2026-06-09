'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut, Camera, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import { DEMO_PROJECTS_DATA } from '@/lib/demoData'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
    loadProjects()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
    }
  }

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      setProjects(DEMO_PROJECTS_DATA)
    } else {
      setProjects(data as Project[])
    }
    setLoading(false)
  }

  const togglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ published: !project.published })
      .eq('id', project.id)
    if (error) {
      toast.error('Erro ao atualizar projeto.')
      return
    }
    setProjects((prev) =>
      prev.map((p) => p.id === project.id ? { ...p, published: !p.published } : p)
    )
    toast.success(project.published ? 'Projeto ocultado.' : 'Projeto publicado!')
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
    setDeleting(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir projeto.')
      setDeleting(null)
      return
    }
    setProjects((prev) => prev.filter((p) => p.id !== id))
    toast.success('Projeto excluído.')
    setDeleting(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center">
              <Camera size={16} color="white" />
            </div>
            <span
              className="font-display font-700 text-white text-base"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}
            >
              Meu Portfólio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <ExternalLink size={13} />
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-red-400 transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-800 text-white"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
            >
              Meus Projetos
            </h1>
            <p
              className="text-[#A1A1AA] text-sm mt-0.5"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
            </p>
          </div>
          <Link
            href="/admin/projetos/novo"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
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
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="mx-auto text-[#333] mb-4" />
            <h2
              className="text-xl font-display font-600 text-white mb-2"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Nenhum projeto ainda
            </h2>
            <p
              className="text-[#A1A1AA] text-sm mb-6"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Adicione seu primeiro projeto agora!
            </p>
            <Link href="/admin/projetos/novo" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Adicionar projeto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
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
                  <h3
                    className="font-display font-600 text-white text-sm leading-snug mb-1 line-clamp-1"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {project.title}
                  </h3>
                  {project.short_description && (
                    <p
                      className="text-[#666] text-xs line-clamp-1 mb-3"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {project.short_description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projetos/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all text-xs border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      <Pencil size={12} />
                      Editar
                    </Link>
                    <button
                      onClick={() => togglePublish(project)}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                      title={project.published ? 'Ocultar' : 'Publicar'}
                    >
                      {project.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={deleting === project.id}
                      className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-red-900/20 text-[#A1A1AA] hover:text-red-400 transition-all border border-[#2a2a2a] hover:border-red-900/40 disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
