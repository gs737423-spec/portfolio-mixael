'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Loader2, Save, MessageCircle, Mail, Instagram, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { SiteSettings } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

type SettingsForm = Omit<SiteSettings, 'id' | 'updated_at'>

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset } = useForm<SettingsForm>()

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }) => {
      const s = (data as SiteSettings) ?? DEFAULT_SETTINGS
      reset({
        whatsapp: s.whatsapp,
        email: s.email,
        instagram_handle: s.instagram_handle,
        instagram_url: s.instagram_url,
        hero_subtitle: s.hero_subtitle,
        hero_location: s.hero_location,
        hero_stat1_value: s.hero_stat1_value,
        hero_stat1_label: s.hero_stat1_label,
        hero_stat2_value: s.hero_stat2_value,
        hero_stat2_label: s.hero_stat2_label,
        hero_stat3_value: s.hero_stat3_value,
        hero_stat3_label: s.hero_stat3_label,
        footer_tagline: s.footer_tagline,
      })
      setLoading(false)
    })
  }, [])

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true)
    try {
      const { error } = await supabase.from('site_settings').upsert({ id: 1, ...data })
      if (error) throw error
      toast.success('Configurações salvas!')
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

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-6 flex flex-col gap-5">
      <h2 className="text-white text-sm font-700 border-b border-[rgba(139,92,246,0.1)] pb-3"
        style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}
      >
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
    <div className="min-h-screen bg-[#080808]">
      <div className="bg-[#080808]/95 border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}>
            Configurações
          </h1>
          <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
            Contato, redes sociais e textos do site
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

          {/* Contato */}
          <Section title="📱 Contato & Redes Sociais">
            <Field label="WhatsApp" hint="(apenas números, ex: 5511999990000)">
              <div className="relative">
                <MessageCircle size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('whatsapp')} placeholder="5511999990000" className="admin-input pl-9" />
              </div>
            </Field>
            <Field label="E-mail">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('email')} type="email" placeholder="contato@seusite.com" className="admin-input pl-9" />
              </div>
            </Field>
            <Field label="Instagram — usuário" hint="(com @)">
              <div className="relative">
                <Instagram size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('instagram_handle')} placeholder="@seuperfil" className="admin-input pl-9" />
              </div>
            </Field>
            <Field label="Instagram — link completo">
              <div className="relative">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('instagram_url')} type="url" placeholder="https://instagram.com/seuperfil" className="admin-input pl-9" />
              </div>
            </Field>
          </Section>

          {/* Hero */}
          <Section title="🏠 Seção Principal (Hero)">
            <Field label="Subtítulo" hint="(frase abaixo do título principal)">
              <input {...register('hero_subtitle')} className="admin-input" />
            </Field>
            <Field label="Localização">
              <input {...register('hero_location')} placeholder="São Paulo, Brasil" className="admin-input" />
            </Field>
            <Field label="Estatísticas">
              <div className="grid grid-cols-3 gap-3">
                {([
                  { v: 'hero_stat1_value', l: 'hero_stat1_label' },
                  { v: 'hero_stat2_value', l: 'hero_stat2_label' },
                  { v: 'hero_stat3_value', l: 'hero_stat3_label' },
                ] as { v: keyof SettingsForm; l: keyof SettingsForm }[]).map(({ v, l }, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <input
                      {...register(v)}
                      placeholder="500+"
                      className="admin-input text-center"
                      style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}
                    />
                    <input
                      {...register(l)}
                      placeholder="Projetos"
                      className="admin-input text-center text-xs"
                    />
                  </div>
                ))}
              </div>
            </Field>
          </Section>

          {/* Rodapé */}
          <Section title="📌 Rodapé">
            <Field label="Tagline do rodapé" hint="(texto abaixo do logo)">
              <input {...register('footer_tagline')} className="admin-input" />
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
                Salvar configurações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
