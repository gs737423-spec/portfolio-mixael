'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Loader2, Save, MessageCircle, Mail, Instagram, Globe, Phone, Facebook, Music } from 'lucide-react'
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
        whatsapp: s.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
        phone: s.phone ?? '',
        email: s.email ?? DEFAULT_SETTINGS.email,
        instagram_handle: s.instagram_handle ?? DEFAULT_SETTINGS.instagram_handle,
        instagram_url: s.instagram_url ?? DEFAULT_SETTINGS.instagram_url,
        facebook_url: s.facebook_url ?? '',
        tiktok_url: s.tiktok_url ?? '',
        contact_title: s.contact_title ?? DEFAULT_SETTINGS.contact_title,
        contact_subtitle: s.contact_subtitle ?? DEFAULT_SETTINGS.contact_subtitle,
        whatsapp_message: s.whatsapp_message ?? DEFAULT_SETTINGS.whatsapp_message,
        footer_tagline: s.footer_tagline ?? DEFAULT_SETTINGS.footer_tagline,
      })
      setLoading(false)
    })
  }, [reset])

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
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 size={32} className="text-[#8B5CF6] animate-spin" />
      </div>
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] p-6 flex flex-col gap-5">
      <h2 className="text-white text-sm border-b border-[rgba(139,92,246,0.1)] pb-3"
        style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
      >
        {title}
      </h2>
      {children}
    </div>
  )

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm text-[#A1A1AA] mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
        {label}
        {hint && <span className="text-[#555] ml-1.5 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#080808]/95 border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
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
          <Section title="Contato">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="WhatsApp" hint="(só números)">
                <div className="relative">
                  <MessageCircle size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('whatsapp')} placeholder="5511999990000" className="admin-input pl-9" />
                </div>
              </Field>
              <Field label="Telefone" hint="(opcional)">
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('phone')} placeholder="(11) 3333-4444" className="admin-input pl-9" />
                </div>
              </Field>
            </div>
            <Field label="E-mail">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                <input {...register('email')} type="email" placeholder="contato@seusite.com" className="admin-input pl-9" />
              </div>
            </Field>
            <Field label="Mensagem padrão do WhatsApp" hint="(enviada ao clicar no botão)">
              <textarea {...register('whatsapp_message')} rows={2} className="admin-input resize-none" placeholder="Olá! Vim pelo site e gostaria de solicitar um orçamento." />
            </Field>
          </Section>

          {/* Redes Sociais */}
          <Section title="Redes Sociais">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Instagram — @usuário">
                <div className="relative">
                  <Instagram size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('instagram_handle')} placeholder="@seuperfil" className="admin-input pl-9" />
                </div>
              </Field>
              <Field label="Instagram — link">
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('instagram_url')} type="url" placeholder="https://instagram.com/seuperfil" className="admin-input pl-9" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Facebook" hint="(opcional)">
                <div className="relative">
                  <Facebook size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('facebook_url')} type="url" placeholder="https://facebook.com/seuperfil" className="admin-input pl-9" />
                </div>
              </Field>
              <Field label="TikTok" hint="(opcional)">
                <div className="relative">
                  <Music size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
                  <input {...register('tiktok_url')} type="url" placeholder="https://tiktok.com/@seuperfil" className="admin-input pl-9" />
                </div>
              </Field>
            </div>
          </Section>

          {/* Seção Contato */}
          <Section title="Texto da Seção de Contato">
            <Field label="Título">
              <input {...register('contact_title')} className="admin-input" placeholder="Vamos criar algo incrível juntos." />
            </Field>
            <Field label="Subtítulo / Descrição">
              <textarea {...register('contact_subtitle')} rows={2} className="admin-input resize-none" placeholder="Tem um projeto em mente? Entre em contato." />
            </Field>
          </Section>

          {/* Rodapé */}
          <Section title="Rodapé">
            <Field label="Tagline" hint="(texto abaixo do logo)">
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
