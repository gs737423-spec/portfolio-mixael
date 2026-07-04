'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Upload, X, Plus, Image as ImageIcon,
  Youtube, FileText, Tag, Calendar, Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadFile as uploadToR2, uploadFiles as uploadFilesToR2 } from '@/lib/upload'
import { slugify } from '@/lib/utils'
import VideoThumb from '@/components/VideoThumb'
import type { AdminProjectForm, CategoryItem } from '@/lib/types'

const STEPS = ['Informações', 'Imagens', 'Publicar']

export default function NovoProjetoPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    supabase.from('categories').select('*').eq('active', true).order('display_order').then(({ data }) => {
      setCategories((data ?? []) as CategoryItem[])
    })
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminProjectForm>({
    defaultValues: { published: true, display_order: 0 },
  })

  const title = watch('title')

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles((prev) => [...prev, ...files])
    const previews = files.map((f) => URL.createObjectURL(f))
    setPhotoPreviews((prev) => [...prev, ...previews])
  }

  const removePhoto = (i: number) => {
    setPhotoFiles((prev) => prev.filter((_, idx) => idx !== i))
    setPhotoPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }


  const onSubmit = async (formData: AdminProjectForm) => {
    setSaving(true)
    try {
      const slug = slugify(formData.title)
      let coverUrl = null
      const imageUrls: string[] = []

      if (coverFile) {
        setUploadProgress({ done: 0, total: photoFiles.length + 1 })
        coverUrl = await uploadToR2(coverFile, `projects/${slug}`)
        setUploadProgress({ done: 1, total: photoFiles.length + 1 })
      }

      if (photoFiles.length > 0) {
        const urls = await uploadFilesToR2(
          photoFiles,
          `projects/${slug}`,
          (done) => setUploadProgress({ done: done + (coverFile ? 1 : 0), total: photoFiles.length + (coverFile ? 1 : 0) }),
        )
        imageUrls.push(...urls)
      }

      const { error } = await supabase.from('projects').insert({
        title: formData.title,
        slug,
        category: formData.category,
        description: formData.description || null,
        short_description: formData.short_description || null,
        cover_image: coverUrl,
        images: imageUrls,
        youtube_url: formData.youtube_url || null,
        date: formData.date || null,
        published: formData.published,
      })

      if (error) throw error

      toast.success('Projeto publicado com sucesso!')
      router.push('/admin')
    } catch (err) {
      toast.error('Erro ao salvar projeto. Tente novamente.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-[#080808]/95 backdrop-blur-xl border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1
            className="font-display font-700 text-white text-base"
            style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
          >
            Novo Projeto
          </h1>
        </div>

        {/* Step indicator */}
        <div className="max-w-2xl mx-auto px-6 pb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-600 transition-all ${
                    i === step
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                      : i < step
                      ? 'bg-[#8B5CF6]/30 text-[#8B5CF6] cursor-pointer hover:bg-[#8B5CF6]/50'
                      : 'bg-[#1a1a1a] text-[#555]'
                  }`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {i + 1}
                </button>
                <span
                  className={`text-xs flex-1 ${i === step ? 'text-white' : 'text-[#555]'}`}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-[1px] ${i < step ? 'bg-[#8B5CF6]/40' : 'bg-[#2a2a2a]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Step 1 — Informações */}
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.15)] p-4 flex items-start gap-3">
                <FileText size={18} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Preencha as informações do projeto. Não se preocupe com perfeição agora — você pode editar depois.
                </p>
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  Título do projeto *
                </label>
                <input
                  {...register('title', { required: 'Informe o título' })}
                  placeholder="Ex: Casamento João & Maria"
                  className="admin-input text-base"
                  autoFocus
                />
                {errors.title && <span className="text-red-400 text-xs mt-1 block">{errors.title.message}</span>}
                {title && (
                  <p className="text-[#555] text-xs mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
                    Link: /portfolio/{slugify(title)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  <Tag size={14} className="inline mr-1.5" />
                  Categoria *
                </label>
                <select
                  {...register('category', { required: true })}
                  className="admin-input"
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  Resumo curto
                  <span className="text-[#555] ml-1 text-xs">(aparece no card)</span>
                </label>
                <input
                  {...register('short_description')}
                  placeholder="Ex: Casamento íntimo com decoração floral em fazenda histórica"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  Descrição completa
                  <span className="text-[#555] ml-1 text-xs">(aparece na página do projeto)</span>
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Conte mais sobre o projeto, a história por trás dele..."
                  rows={5}
                  className="admin-input resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  <Calendar size={14} className="inline mr-1.5" />
                  Data do projeto
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="admin-input"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-primary w-full justify-center"
              >
                Próximo: Imagens →
              </button>
            </div>
          )}

          {/* Step 2 — Imagens */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.15)] p-4 flex items-start gap-3">
                <ImageIcon size={18} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Adicione a foto de capa e a galeria do projeto. Formatos: JPG, PNG, WEBP.
                </p>
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  Foto de capa *
                </label>
                {coverPreview ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image src={coverPreview} alt="Capa" fill className="object-cover" sizes="100vw" />
                    <button
                      type="button"
                      onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="aspect-video rounded-xl border-2 border-dashed border-[rgba(139,92,246,0.3)] flex flex-col items-center justify-center gap-3 bg-[#111] hover:border-[rgba(139,92,246,0.6)] hover:bg-[rgba(139,92,246,0.04)] transition-all">
                      <Upload size={28} className="text-[#8B5CF6]" />
                      <span className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        Clique para escolher a foto de capa
                      </span>
                      <span className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                        JPG, PNG, WEBP — até 10MB
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  Galeria de fotos e vídeos
                  <span className="text-[#555] ml-1 text-xs">(opcional — pode adicionar vários)</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {photoPreviews.map((src, i) => {
                    const isVideo = photoFiles[i]?.type?.startsWith('video/')
                    return (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        {isVideo ? (
                          <VideoThumb src={src} className="w-full h-full" />
                        ) : (
                          <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="33vw" />
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
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
                      onChange={handlePhotosChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                  <Youtube size={14} className="inline mr-1.5 text-red-400" />
                  Link do YouTube
                  <span className="text-[#555] ml-1 text-xs">(opcional)</span>
                </label>
                <input
                  {...register('youtube_url')}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="admin-input"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">
                  ← Voltar
                </button>
                <button type="button" onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Publicar */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-emerald-900/10 border border-emerald-800/30 p-4 flex items-start gap-3">
                <Eye size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  Revise e publique! Você pode deixar como rascunho e publicar depois.
                </p>
              </div>

              {/* Preview summary */}
              <div className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-5">
                {coverPreview && (
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image src={coverPreview} alt="Capa" fill className="object-cover" sizes="100vw" />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-display font-700 text-white" style={{ fontFamily: 'var(--font-manrope)' }}>
                    {watch('title') || '—'}
                  </h3>
                  <span className="category-badge">{watch('category')}</span>
                  {photoFiles.length > 0 && (
                    <p className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                      {photoFiles.length} foto(s) na galeria
                    </p>
                  )}
                </div>
              </div>

              {/* Publish toggle */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[rgba(139,92,246,0.15)] cursor-pointer">
                <div>
                  <div className="text-white text-sm font-500" style={{ fontFamily: 'var(--font-inter)' }}>
                    Publicar agora
                  </div>
                  <div className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                    Projeto fica visível no site imediatamente
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <input
                    {...register('published')}
                    type="checkbox"
                    defaultChecked
                    id="published-novo"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2a2a2a] peer-checked:bg-[#8B5CF6] rounded-full transition-colors duration-300 cursor-pointer" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5 pointer-events-none" />
                </div>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">
                  ← Voltar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {uploadProgress
                        ? `Enviando ${uploadProgress.done}/${uploadProgress.total} fotos...`
                        : 'Salvando...'}
                    </span>
                  ) : '✓ Publicar projeto'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
