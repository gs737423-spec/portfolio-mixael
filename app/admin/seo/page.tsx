'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Loader2, Save, Search, Globe, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { SeoSettings } from '@/lib/types'

type SeoForm = Omit<SeoSettings, 'id' | 'updated_at'>

const DEFAULT_SEO: SeoForm = {
  meta_title: 'Mixael Sevla | Fotografia & Produção Audiovisual',
  meta_description: 'Fotografia e produção audiovisual para marcas, eventos e pessoas. Casamentos, ensaios, eventos corporativos, drone e reels.',
  meta_keywords: 'fotografia, videomaker, casamento, eventos, drone, São Paulo, reels',
  og_title: 'Mixael Sevla | Fotografia & Produção Audiovisual',
  og_description: 'Transformando momentos em histórias inesquecíveis.',
  og_image: null,
}

export default function SeoPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, watch } = useForm<SeoForm>()
  const metaTitle = watch('meta_title', '')
  const metaDesc = watch('meta_description', '')

  useEffect(() => {
    supabase.from('seo_settings').select('*').eq('id', 1).single().then(({ data }) => {
      reset(data ? (data as SeoSettings) : DEFAULT_SEO)
      setLoading(false)
    })
  }, [reset])

  const onSubmit = async (data: SeoForm) => {
    setSaving(true)
    try {
      const { error } = await supabase.from('seo_settings').upsert({ id: 1, ...data })
      if (error) throw error
      toast.success('SEO salvo com sucesso!')
    } catch {
      toast.error('Erro ao salvar.')
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

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-6 flex flex-col gap-5">
      <h2 className="text-white text-sm font-700 border-b border-[rgba(139,92,246,0.1)] pb-3 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
      >
        <Icon size={15} className="text-[#8B5CF6]" />
        {title}
      </h2>
      {children}
    </div>
  )

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm text-[#A1A1AA] mb-1.5 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
        {hint && <span className="text-[#555] ml-1.5 text-xs font-400">{hint}</span>}
      </label>
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="border-b border-[rgba(139,92,246,0.1)] bg-[#080808]/95">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
            SEO
          </h1>
          <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
            Título, descrição e compartilhamento nas redes sociais
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

          {/* Preview Google */}
          <div className="rounded-xl bg-white p-5">
            <p className="text-[10px] text-[#999] mb-3 uppercase tracking-wider font-500">Prévia no Google</p>
            <div className="text-[#1a0dab] text-lg leading-tight mb-1 truncate" style={{ fontFamily: 'Arial, sans-serif' }}>
              {metaTitle || 'Título da página'}
            </div>
            <div className="text-[#006621] text-xs mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>
              mixaelsevla.com
            </div>
            <div className="text-[#545454] text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              {metaDesc || 'Descrição da página...'}
            </div>
          </div>

          {/* Meta básico */}
          <Section title="Meta Tags" icon={Search}>
            <Field label="Título da página" hint={`(${metaTitle.length}/60 chars)`}>
              <input {...register('meta_title')} className="admin-input" />
              <div className="h-1 mt-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((metaTitle.length / 60) * 100, 100)}%`,
                    background: metaTitle.length > 60 ? '#ef4444' : metaTitle.length > 50 ? '#f59e0b' : '#8B5CF6',
                  }}
                />
              </div>
            </Field>
            <Field label="Meta descrição" hint={`(${metaDesc.length}/160 chars)`}>
              <textarea {...register('meta_description')} rows={3} className="admin-input resize-none" />
              <div className="h-1 mt-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((metaDesc.length / 160) * 100, 100)}%`,
                    background: metaDesc.length > 160 ? '#ef4444' : metaDesc.length > 140 ? '#f59e0b' : '#8B5CF6',
                  }}
                />
              </div>
            </Field>
            <Field label="Keywords" hint="(separadas por vírgula)">
              <input {...register('meta_keywords')} placeholder="fotografia, casamento, São Paulo" className="admin-input" />
            </Field>
          </Section>

          {/* Open Graph */}
          <Section title="Open Graph (compartilhamento)" icon={Globe}>
            <Field label="Título OG">
              <input {...register('og_title')} className="admin-input" />
            </Field>
            <Field label="Descrição OG">
              <textarea {...register('og_description')} rows={3} className="admin-input resize-none" />
            </Field>
            <Field label="Imagem OG" hint="(URL da imagem, 1200×630px recomendado)">
              <div className="relative">
                <ImageIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('og_image')} placeholder="https://..." type="url" className="admin-input pl-9" />
              </div>
            </Field>
          </Section>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </span>
            ) : (
              <>
                <Save size={16} />
                Salvar SEO
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
