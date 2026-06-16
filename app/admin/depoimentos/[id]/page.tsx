'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Star, Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/types'

interface TestimonialForm {
  name: string
  role: string
  comment: string
}

export default function EditarDepoimentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rating, setRating] = useState(5)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TestimonialForm>()

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { toast.error('Não encontrado'); router.push('/admin/depoimentos'); return }
        const t = data as Testimonial
        reset({ name: t.name, role: t.role ?? '', comment: t.comment })
        setRating(t.rating)
        setPhotoPreview(t.photo ?? null)
        setLoading(false)
      })
  }, [id])

  const onSubmit = async (data: TestimonialForm) => {
    setSaving(true)
    try {
      let photoUrl = photoPreview

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const path = `depoimentos/${id}.${ext}`
        const { data: up, error: upErr } = await supabase.storage
          .from('portfolio')
          .upload(path, photoFile, { upsert: true })
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(up.path)
        photoUrl = publicUrl
      }

      const { error } = await supabase.from('testimonials').update({
        name: data.name,
        role: data.role || null,
        comment: data.comment,
        rating,
        photo: photoUrl,
      }).eq('id', id)

      if (error) throw error
      toast.success('Depoimento atualizado!')
      router.push('/admin/depoimentos')
    } catch {
      toast.error('Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 size={32} className="text-[#8B5CF6] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="bg-[#080808]/95 border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/depoimentos" className="text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1
            className="text-white text-base"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}
          >
            Editar Depoimento
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-5">
          {/* Photo */}
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[rgba(139,92,246,0.4)]">
                <Image src={photoPreview} alt="Foto" fill className="object-cover" sizes="80px" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={16} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setPhotoFile(f)
                    setPhotoPreview(URL.createObjectURL(f))
                  }} />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[rgba(139,92,246,0.3)] flex flex-col items-center justify-center gap-1 bg-[#111] hover:border-[rgba(139,92,246,0.6)] transition-all">
                  <Upload size={16} className="text-[#8B5CF6]" />
                  <span className="text-[9px] text-[#555]">Foto</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setPhotoFile(f)
                  setPhotoPreview(URL.createObjectURL(f))
                }} />
              </label>
            )}
            <p className="text-[#A1A1AA] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
              Foto do cliente (opcional)
            </p>
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>Nome *</label>
            <input {...register('name', { required: 'Obrigatório' })} className="admin-input" />
            {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>Cargo / Contexto</label>
            <input {...register('role')} className="admin-input" placeholder="Ex: Casamento — Junho 2024" />
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>Avaliação</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className="transition-transform hover:scale-110">
                  <Star size={28} className={n <= rating ? 'fill-[#8B5CF6] text-[#8B5CF6]' : 'text-[#333]'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>Depoimento *</label>
            <textarea {...register('comment', { required: 'Obrigatório' })} rows={5} className="admin-input resize-none" />
            {errors.comment && <span className="text-red-400 text-xs mt-1 block">{errors.comment.message}</span>}
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </span>
            ) : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
