'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Star, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TestimonialForm {
  name: string
  role: string
  comment: string
  rating: number
}

export default function NovoDepoimentoPage() {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TestimonialForm>({
    defaultValues: { rating: 5 },
  })

  const onSubmit = async (data: TestimonialForm) => {
    setSaving(true)
    try {
      let photoUrl: string | null = null

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const path = `depoimentos/${Date.now()}.${ext}`
        const { data: up, error: upErr } = await supabase.storage
          .from('portfolio')
          .upload(path, photoFile, { upsert: true })
        if (upErr) throw upErr
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(up.path)
        photoUrl = publicUrl
      }

      const { error } = await supabase.from('testimonials').insert({
        name: data.name,
        role: data.role || null,
        comment: data.comment,
        rating,
        photo: photoUrl,
      })
      if (error) throw error

      toast.success('Depoimento adicionado!')
      router.push('/admin/depoimentos')
    } catch {
      toast.error('Erro ao salvar depoimento.')
    } finally {
      setSaving(false)
    }
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
            Novo Depoimento
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-5">
          {/* Photo upload */}
          <div className="flex items-start gap-4">
            <div className="relative">
              {photoPreview ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[rgba(139,92,246,0.4)]">
                  <Image src={photoPreview} alt="Foto" fill className="object-cover" sizes="80px" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-[rgba(139,92,246,0.3)] flex flex-col items-center justify-center gap-1 bg-[#111] hover:border-[rgba(139,92,246,0.6)] transition-all">
                    <Upload size={16} className="text-[#8B5CF6]" />
                    <span className="text-[9px] text-[#555]" style={{ fontFamily: 'var(--font-inter)' }}>Foto</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      setPhotoFile(f)
                      setPhotoPreview(URL.createObjectURL(f))
                    }}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[#A1A1AA] text-xs mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                Foto do cliente (opcional)
              </p>
              <p className="text-[#555] text-[10px]" style={{ fontFamily: 'var(--font-inter)' }}>
                JPG, PNG — até 5MB
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Nome *
            </label>
            <input
              {...register('name', { required: 'Informe o nome' })}
              placeholder="Ex: Isabela & Rafael Mendes"
              className="admin-input"
              autoFocus
            />
            {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Cargo / Contexto
              <span className="text-[#555] ml-1 text-xs">(aparece embaixo do nome)</span>
            </label>
            <input
              {...register('role')}
              placeholder="Ex: Casamento — Junho 2024"
              className="admin-input"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Avaliação
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={n <= rating ? 'fill-[#8B5CF6] text-[#8B5CF6]' : 'text-[#333]'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Depoimento *
            </label>
            <textarea
              {...register('comment', { required: 'Escreva o depoimento' })}
              placeholder="O que o cliente disse sobre o trabalho..."
              rows={5}
              className="admin-input resize-none"
            />
            {errors.comment && <span className="text-red-400 text-xs mt-1 block">{errors.comment.message}</span>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/depoimentos" className="btn-outline flex-1 justify-center">
              Cancelar
            </Link>
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
                  Salvando...
                </span>
              ) : '✓ Salvar depoimento'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
