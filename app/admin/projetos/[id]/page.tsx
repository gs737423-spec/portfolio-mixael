'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X, Plus, Save, Loader2, Trash2, Youtube, Tag } from 'lucide-react'
import VideoThumb from '@/components/VideoThumb'
import { supabase } from '@/lib/supabase'
import { uploadFile as uploadToR2, uploadFiles as uploadFilesToR2, deleteFiles } from '@/lib/upload'
import type { AdminProjectForm, Project, CategoryItem, VideoLink } from '@/lib/types'

const SUGGESTED_TAGS = ['Foto', 'Vídeo', 'Drone', 'Institucional', 'Campanha', 'Evento', 'Museu', 'Exposição', 'Reels']

export default function EditarProjetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [newPhotos, setNewPhotos] = useState<File[]>([])
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminProjectForm>()

  useEffect(() => {
    loadProject()
    supabase.from('categories').select('*').eq('active', true).order('display_order').then(({ data }) => {
      setCategories((data ?? []) as CategoryItem[])
    })
  }, [id])

  const loadProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      toast.error('Projeto não encontrado')
      router.push('/admin')
      return
    }

    const p = data as Project
    setProject(p)
    setExistingImages(p.images ?? [])
    setCoverPreview(p.cover_image)
    setSelectedTags(p.tags ?? [])

    // Load video_urls, falling back to youtube_url for backward compat
    const videos: VideoLink[] = (p.video_urls && Array.isArray(p.video_urls) && p.video_urls.length > 0)
      ? p.video_urls
      : (p.youtube_url ? [{ title: '', url: p.youtube_url }] : [])
    setVideoLinks(videos)

    reset({
      title: p.title,
      category: p.category,
      description: p.description ?? '',
      short_description: p.short_description ?? '',
      date: p.date ?? '',
      published: p.published,
    })
    setLoading(false)
  }

  const addVideoLink = () => {
    setVideoLinks((prev) => [...prev, { title: '', url: '' }])
  }

  const updateVideoLink = (i: number, field: keyof VideoLink, value: string) => {
    setVideoLinks((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))
  }

  const removeVideoLink = (i: number) => {
    setVideoLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    const tag = customTag.trim()
    if (!tag || selectedTags.includes(tag)) return
    setSelectedTags((prev) => [...prev, tag])
    setCustomTag('')
  }

  const onSubmit = async (formData: AdminProjectForm) => {
    if (!project) return
    setSaving(true)
    try {
      let coverUrl = project.cover_image
      if (coverFile) {
        setUploadProgress({ done: 0, total: newPhotos.length + 1 })
        coverUrl = await uploadToR2(coverFile, `projects/${project.slug}`)
        setUploadProgress({ done: 1, total: newPhotos.length + 1 })
      }

      let newUrls: string[] = []
      if (newPhotos.length > 0) {
        newUrls = await uploadFilesToR2(
          newPhotos,
          `projects/${project.slug}`,
          (done) => setUploadProgress({ done: done + (coverFile ? 1 : 0), total: newPhotos.length + (coverFile ? 1 : 0) }),
        )
      }

      const validVideos = videoLinks.filter((v) => v.url.trim())

      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          category: formData.category,
          tags: selectedTags,
          description: formData.description || null,
          short_description: formData.short_description || null,
          cover_image: coverUrl,
          images: [...existingImages, ...newUrls],
          youtube_url: validVideos[0]?.url || null,
          video_urls: validVideos,
          date: formData.date || null,
          published: formData.published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id)

      if (error) throw error

      const toDelete = [...removedImages]
      if (coverFile && project.cover_image) toDelete.push(project.cover_image)
      if (toDelete.length > 0) deleteFiles(toDelete)

      toast.success('Projeto atualizado!')
      router.push('/admin')
    } catch (err) {
      toast.error('Erro ao atualizar projeto.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 size={32} className="text-[#8B5CF6] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-[#080808] border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1
            className="font-display font-700 text-white text-base flex-1 truncate"
            style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
          >
            Editar: {project?.title}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Título *
            </label>
            <input {...register('title', { required: 'Obrigatório' })} className="admin-input text-base" />
            {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                Categoria
              </label>
              <select {...register('category')} className="admin-input">
                {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                Data
              </label>
              <input {...register('date')} type="date" className="admin-input" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              <Tag size={14} className="inline mr-1.5" />
              Tags
              <span className="text-[#555] ml-1 text-xs">(filtros adicionais)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-500 transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                      : 'bg-[#1a1a1a] text-[#A1A1AA] border border-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.5)]'
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.filter((t) => !SUGGESTED_TAGS.includes(t)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.filter((t) => !SUGGESTED_TAGS.includes(t)).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-500 bg-[#8B5CF6] text-white flex items-center gap-1.5"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {tag}
                    <button type="button" onClick={() => toggleTag(tag)} className="hover:text-red-200">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
                placeholder="Adicionar tag personalizada..."
                className="admin-input flex-1 text-sm"
              />
              <button
                type="button"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
                className="px-4 py-2 bg-[#1a1a1a] border border-[rgba(139,92,246,0.2)] rounded-lg text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.5)] transition-colors disabled:opacity-40 text-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Resumo curto
            </label>
            <input {...register('short_description')} className="admin-input" placeholder="Aparece no card do portfólio" />
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Descrição completa
            </label>
            <textarea {...register('description')} rows={4} className="admin-input resize-none" />
          </div>

          {/* Video Links */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              <Youtube size={14} className="inline mr-1.5 text-red-400" />
              Vídeos do projeto
              <span className="text-[#555] ml-1 text-xs">(YouTube ou link externo)</span>
            </label>

            {videoLinks.length > 0 && (
              <div className="flex flex-col gap-3 mb-3">
                {videoLinks.map((video, i) => (
                  <div key={i} className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                        Vídeo {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVideoLink(i)}
                        className="p-1 text-[#555] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) => updateVideoLink(i, 'title', e.target.value)}
                      placeholder="Título do vídeo (opcional)"
                      className="admin-input text-sm mb-2"
                    />
                    <input
                      type="url"
                      value={video.url}
                      onChange={(e) => updateVideoLink(i, 'url', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="admin-input text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addVideoLink}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[rgba(139,92,246,0.2)] text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.04)] transition-all flex items-center justify-center gap-2 text-sm"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <Plus size={16} />
              Adicionar vídeo
            </button>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Foto de capa
            </label>
            {coverPreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image src={coverPreview} alt="Capa" fill className="object-cover" sizes="100vw" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Upload size={24} />
                    <span className="text-sm" style={{ fontFamily: 'var(--font-inter)' }}>Trocar foto</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      setCoverFile(f)
                      setCoverPreview(URL.createObjectURL(f))
                    }}
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block aspect-video rounded-xl border-2 border-dashed border-[rgba(139,92,246,0.3)] flex flex-col items-center justify-center gap-3 bg-[#111] hover:border-[rgba(139,92,246,0.6)] transition-all">
                <Upload size={24} className="text-[#8B5CF6]" />
                <span className="text-sm text-[#A1A1AA]" style={{ fontFamily: 'var(--font-inter)' }}>Escolher foto de capa</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setCoverFile(f)
                  setCoverPreview(URL.createObjectURL(f))
                }} />
              </label>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Galeria ({existingImages.length + newPhotos.length} arquivos)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {existingImages.map((src, i) => {
                const isVideo = /\.(mp4|mov|avi|webm)$/i.test(src)
                return (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    {isVideo ? (
                      <VideoThumb src={src} className="w-full h-full" />
                    ) : (
                      <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="33vw" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setRemovedImages((prev) => [...prev, src])
                        setExistingImages((prev) => prev.filter((_, idx) => idx !== i))
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )
              })}
              {newPhotoPreviews.map((src, i) => {
                const isVideo = newPhotos[i]?.type?.startsWith('video/')
                return (
                  <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden ring-2 ring-[#8B5CF6]/50">
                    {isVideo ? (
                      <VideoThumb src={src} className="w-full h-full" />
                    ) : (
                      <Image src={src} alt={`Nova foto ${i + 1}`} fill className="object-cover" sizes="33vw" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setNewPhotos((prev) => prev.filter((_, idx) => idx !== i))
                        setNewPhotoPreviews((prev) => prev.filter((_, idx) => idx !== i))
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )
              })}
              <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-[rgba(139,92,246,0.2)] flex flex-col items-center justify-center hover:border-[rgba(139,92,246,0.5)] hover:bg-[rgba(139,92,246,0.04)] transition-all bg-[#111]">
                <Plus size={20} className="text-[#8B5CF6]" />
                <span className="text-[#555] text-[10px] mt-1" style={{ fontFamily: 'var(--font-inter)' }}>Adicionar</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                    setNewPhotos((prev) => [...prev, ...files])
                    setNewPhotoPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
                  }}
                />
              </label>
            </div>
          </div>

          {/* Published toggle */}
          <label className="flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[rgba(139,92,246,0.15)] cursor-pointer">
            <div>
              <div className="text-white text-sm font-500" style={{ fontFamily: 'var(--font-inter)' }}>Publicado</div>
              <div className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Visível no site</div>
            </div>
            <div className="relative flex-shrink-0">
              <input
                {...register('published')}
                type="checkbox"
                id="published-edit"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2a2a2a] peer-checked:bg-[#8B5CF6] rounded-full transition-colors duration-300 cursor-pointer" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5 pointer-events-none" />
            </div>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {uploadProgress
                  ? `Enviando ${uploadProgress.done}/${uploadProgress.total}...`
                  : 'Salvando...'}
              </span>
            ) : (
              <>
                <Save size={16} />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
