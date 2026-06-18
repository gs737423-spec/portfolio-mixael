'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

interface ClientForm {
  name: string
  slug: string
  description: string
  active: boolean
}

export default function NovoClientePage() {
  const router = useRouter()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClientForm>({
    defaultValues: { active: true },
  })

  const name = watch('name')

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: ClientForm) => {
    setSaving(true)
    try {
      let coverUrl: string | null = null

      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `clients/${data.slug}/cover.${ext}`
        const { data: up, error } = await supabase.storage
          .from('portfolio')
          .upload(path, coverFile, { upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(up.path)
        coverUrl = publicUrl
      }

      const { error } = await supabase.from('clients').insert({
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description || null,
        cover_image: coverUrl,
        active: data.active,
        display_order: 0,
      })
      if (error) throw error

      toast.success('Cliente criado!')
      router.push('/admin/clientes')
    } catch (e: unknown) {
      toast.error((e as Error).message ?? 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} />
          Voltar para Clientes
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-sora)' }}>
          Novo Cliente
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Cover image */}
          <div>
            <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-3">
              Imagem de capa
            </label>
            {coverPreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border border-dashed border-[rgba(255,255,255,0.1)] cursor-pointer hover:border-[rgba(139,92,246,0.4)] transition-colors">
                <Upload size={24} className="text-[#555] mb-2" />
                <span className="text-[#555] text-sm">Clique para fazer upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCover} />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">
              Nome do cliente *
            </label>
            <input
              {...register('name', { required: 'Informe o nome' })}
              placeholder="Ex: Museu do Amanhã"
              className="admin-input w-full"
              onChange={(e) => {
                setValue('name', e.target.value)
                setValue('slug', slugify(e.target.value))
              }}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">
              URL (gerado automaticamente)
            </label>
            <div className="flex items-center gap-2 admin-input">
              <span className="text-[#555] text-sm">/clientes/</span>
              <input
                {...register('slug', { required: true })}
                className="flex-1 bg-transparent outline-none text-white text-sm"
                placeholder="museu-do-amanha"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#A1A1AA] uppercase tracking-wider mb-2">
              Descrição (opcional)
            </label>
            <textarea
              {...register('description')}
              placeholder="Breve descrição do cliente ou projeto..."
              rows={3}
              className="admin-input w-full resize-none"
            />
          </div>

          {/* Active */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('active')} className="w-4 h-4 accent-[#8B5CF6]" />
            <span className="text-sm text-[#A1A1AA]">Página visível no site</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/clientes" className="flex-1 py-3 rounded-xl text-center text-sm text-[#71717A] border border-[rgba(255,255,255,0.08)] hover:text-white transition-colors">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'rgba(139,92,246,0.9)' }}
            >
              {saving ? 'Salvando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
