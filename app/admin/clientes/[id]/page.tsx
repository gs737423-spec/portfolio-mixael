'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Upload, X, Plus, Trash2, ExternalLink,
  Camera, Film, Video, Save, Link as LinkIcon, FolderOpen,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Client, ClientMedia, Project } from '@/lib/types'

interface ClientForm {
  name: string
  slug: string
  description: string
  active: boolean
}

interface MediaForm {
  title: string
  video_url: string
}

export default function EditClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [reels, setReels] = useState<ClientMedia[]>([])
  const [videos, setVideos] = useState<ClientMedia[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [addingMedia, setAddingMedia] = useState<'reel' | 'video' | null>(null)
  const [mediaForm, setMediaForm] = useState<MediaForm>({ title: '', video_url: '' })
  const [savingMedia, setSavingMedia] = useState(false)
  const [linkingProject, setLinkingProject] = useState(false)

  const { register, handleSubmit, reset } = useForm<ClientForm>()

  const load = async () => {
    const [{ data: c }, { data: p }, { data: ap }, { data: m }] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('projects').select('*').eq('client_id', id).order('display_order'),
      supabase.from('projects').select('id,title,cover_image,published').is('client_id', null).order('title'),
      supabase.from('client_media').select('*').eq('client_id', id).order('display_order'),
    ])

    if (!c) { router.push('/admin/clientes'); return }
    setClient(c as Client)
    reset({ name: (c as Client).name, slug: (c as Client).slug, description: (c as Client).description ?? '', active: (c as Client).active })
    setCoverPreview((c as Client).cover_image)
    setProjects((p ?? []) as Project[])
    setAllProjects((ap ?? []) as Project[])
    const media = (m ?? []) as ClientMedia[]
    setReels(media.filter(x => x.type === 'reel'))
    setVideos(media.filter(x => x.type === 'video'))
  }

  useEffect(() => { load() }, [id])

  const saveInfo = async (data: ClientForm) => {
    setSaving(true)
    try {
      let coverUrl = coverPreview
      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `clients/${data.slug}/cover.${ext}`
        const { data: up, error } = await supabase.storage.from('portfolio').upload(path, coverFile, { upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(up.path)
        coverUrl = publicUrl
      }
      const { error } = await supabase.from('clients').update({
        name: data.name, slug: data.slug, description: data.description || null,
        active: data.active, cover_image: coverUrl,
      }).eq('id', id)
      if (error) throw error
      toast.success('Informações salvas!')
      load()
    } catch (e: unknown) {
      toast.error((e as Error).message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const linkProject = async (projectId: string) => {
    await supabase.from('projects').update({ client_id: id }).eq('id', projectId)
    toast.success('Projeto vinculado!')
    setLinkingProject(false)
    load()
  }

  const unlinkProject = async (projectId: string) => {
    await supabase.from('projects').update({ client_id: null }).eq('id', projectId)
    toast.success('Projeto desvinculado')
    load()
  }

  const addMedia = async () => {
    if (!mediaForm.title || !addingMedia) return
    setSavingMedia(true)
    const { error } = await supabase.from('client_media').insert({
      client_id: id,
      type: addingMedia,
      title: mediaForm.title,
      video_url: mediaForm.video_url || null,
      display_order: 0,
    })
    if (error) { toast.error('Erro ao adicionar'); setSavingMedia(false); return }
    toast.success('Adicionado!')
    setMediaForm({ title: '', video_url: '' })
    setAddingMedia(null)
    setSavingMedia(false)
    load()
  }

  const removeMedia = async (mediaId: string) => {
    await supabase.from('client_media').delete().eq('id', mediaId)
    toast.success('Removido')
    load()
  }

  if (!client) return <div className="min-h-screen flex items-center justify-center text-[#71717A]">Carregando...</div>

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} />
          Voltar para Clientes
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-sora)' }}>
            {client.name}
          </h1>
          <Link href={`/clientes/${client.slug}`} target="_blank" className="flex items-center gap-1.5 text-[#8B5CF6] text-sm hover:text-[#C084FC] transition-colors">
            <ExternalLink size={14} />
            Ver página
          </Link>
        </div>

        {/* ── SEÇÃO: Informações ── */}
        <section className="rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-sora)' }}>
            <FolderOpen size={16} className="text-[#8B5CF6]" />
            Informações
          </h2>
          <form onSubmit={handleSubmit(saveInfo)} className="flex flex-col gap-4">
            {/* Cover */}
            <div>
              <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-2">Imagem de capa</label>
              {coverPreview ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden group">
                  <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center h-28 rounded-xl border border-dashed border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[rgba(139,92,246,0.4)] transition-colors">
                  <div className="text-center">
                    <Upload size={20} className="text-[#555] mx-auto mb-1" />
                    <span className="text-[#555] text-xs">Upload da capa</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]; if (!f) return
                    setCoverFile(f); setCoverPreview(URL.createObjectURL(f))
                  }} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-2">Nome *</label>
                <input {...register('name', { required: true })} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-2">Slug URL</label>
                <input {...register('slug', { required: true })} className="admin-input w-full" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-2">Descrição</label>
              <textarea {...register('description')} rows={2} className="admin-input w-full resize-none" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('active')} className="accent-[#8B5CF6]" />
                <span className="text-sm text-[#A1A1AA]">Página ativa</span>
              </label>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'rgba(139,92,246,0.85)' }}>
                <Save size={14} />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </section>

        {/* ── SEÇÃO: Fotos (Projetos) ── */}
        <section className="rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-sora)' }}>
              <Camera size={16} className="text-[#8B5CF6]" />
              Fotos
              <span className="text-xs text-[#555] font-normal">— projetos com subpágina</span>
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setLinkingProject(!linkingProject)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8B5CF6] border border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.1)] transition-all">
                <LinkIcon size={12} />
                Vincular projeto
              </button>
              <Link href="/admin/projetos/novo"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white border border-[rgba(255,255,255,0.1)] hover:bg-white/5 transition-all">
                <Plus size={12} />
                Novo projeto
              </Link>
            </div>
          </div>

          {/* Link existing project */}
          {linkingProject && allProjects.length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-[rgba(139,92,246,0.07)] border border-[rgba(139,92,246,0.15)]">
              <p className="text-xs text-[#A1A1AA] mb-3">Selecione um projeto para vincular a este cliente:</p>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {allProjects.map(p => (
                  <button key={p.id} onClick={() => linkProject(p.id)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                    {p.cover_image && <img src={p.cover_image} alt={p.title} className="w-8 h-8 rounded object-cover" />}
                    <span className="text-white text-sm">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {projects.length === 0 ? (
            <p className="text-[#555] text-sm text-center py-6">Nenhum projeto vinculado ainda</p>
          ) : (
            <div className="flex flex-col gap-2">
              {projects.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {p.cover_image && <img src={p.cover_image} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                  <span className="flex-1 text-white text-sm">{p.title}</span>
                  <Link href={`/admin/projetos/${p.id}`} className="p-1.5 text-[#555] hover:text-[#8B5CF6] transition-colors" title="Editar">
                    <ExternalLink size={13} />
                  </Link>
                  <button onClick={() => unlinkProject(p.id)} className="p-1.5 text-[#555] hover:text-red-400 transition-colors" title="Desvincular">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── SEÇÃO: Reels ── */}
        <MediaSection
          title="Reels"
          icon={<Film size={16} className="text-[#8B5CF6]" />}
          subtitle="tudo junto"
          items={reels}
          adding={addingMedia === 'reel'}
          mediaForm={mediaForm}
          savingMedia={savingMedia}
          onStartAdd={() => { setAddingMedia('reel'); setMediaForm({ title: '', video_url: '' }) }}
          onCancelAdd={() => setAddingMedia(null)}
          onChangeForm={setMediaForm}
          onSave={addMedia}
          onRemove={removeMedia}
        />

        {/* ── SEÇÃO: Vídeos Institucionais ── */}
        <MediaSection
          title="Vídeos Institucionais"
          icon={<Video size={16} className="text-[#8B5CF6]" />}
          subtitle="tudo junto"
          items={videos}
          adding={addingMedia === 'video'}
          mediaForm={mediaForm}
          savingMedia={savingMedia}
          onStartAdd={() => { setAddingMedia('video'); setMediaForm({ title: '', video_url: '' }) }}
          onCancelAdd={() => setAddingMedia(null)}
          onChangeForm={setMediaForm}
          onSave={addMedia}
          onRemove={removeMedia}
        />
      </div>
    </div>
  )
}

function MediaSection({
  title, icon, subtitle, items, adding, mediaForm, savingMedia,
  onStartAdd, onCancelAdd, onChangeForm, onSave, onRemove,
}: {
  title: string
  icon: React.ReactNode
  subtitle: string
  items: ClientMedia[]
  adding: boolean
  mediaForm: MediaForm
  savingMedia: boolean
  onStartAdd: () => void
  onCancelAdd: () => void
  onChangeForm: (f: MediaForm) => void
  onSave: () => void
  onRemove: (id: string) => void
}) {
  return (
    <section className="rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 mb-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--font-sora)' }}>
          {icon}
          {title}
          <span className="text-xs text-[#555] font-normal">— {subtitle}</span>
        </h2>
        {!adding && (
          <button onClick={onStartAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white border border-[rgba(255,255,255,0.1)] hover:bg-white/5 transition-all">
            <Plus size={12} />
            Adicionar
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4 p-4 rounded-xl bg-[rgba(139,92,246,0.07)] border border-[rgba(139,92,246,0.15)] flex flex-col gap-3">
          <div>
            <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-1.5">Título *</label>
            <input
              value={mediaForm.title}
              onChange={e => onChangeForm({ ...mediaForm, title: e.target.value })}
              placeholder="Nome do vídeo"
              className="admin-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-[#71717A] uppercase tracking-wider mb-1.5">Link do vídeo (YouTube/Vimeo)</label>
            <input
              value={mediaForm.video_url}
              onChange={e => onChangeForm({ ...mediaForm, video_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="admin-input w-full"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={onCancelAdd} className="flex-1 py-2 rounded-lg text-sm text-[#71717A] border border-[rgba(255,255,255,0.08)] hover:text-white transition-colors">
              Cancelar
            </button>
            <button onClick={onSave} disabled={savingMedia || !mediaForm.title}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'rgba(139,92,246,0.85)' }}>
              {savingMedia ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-[#555] text-sm text-center py-6">Nenhum item adicionado ainda</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.title}</p>
                {item.video_url && (
                  <p className="text-[#555] text-xs truncate mt-0.5">{item.video_url}</p>
                )}
              </div>
              {item.video_url && (
                <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-[#555] hover:text-[#8B5CF6] transition-colors">
                  <ExternalLink size={13} />
                </a>
              )}
              <button onClick={() => onRemove(item.id)}
                className="p-1.5 text-[#555] hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

interface MediaForm {
  title: string
  video_url: string
}
