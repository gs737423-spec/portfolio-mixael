'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Upload, X, Plus, Loader2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { AboutContent } from '@/lib/types'
import { DEFAULT_ABOUT } from '@/lib/types'

type AboutForm = Omit<AboutContent, 'id' | 'photo' | 'skills' | 'updated_at'>

export default function SobrePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [skills, setSkills] = useState<string[]>(DEFAULT_ABOUT.skills)
  const [newSkill, setNewSkill] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AboutForm>()

  useEffect(() => {
    supabase.from('about_content').select('*').eq('id', 1).single().then(({ data }) => {
      const about = (data as AboutContent) ?? DEFAULT_ABOUT
      reset({
        name: about.name,
        bio_paragraph1: about.bio_paragraph1,
        bio_paragraph2: about.bio_paragraph2,
        stat1_value: about.stat1_value,
        stat1_label: about.stat1_label,
        stat2_value: about.stat2_value,
        stat2_label: about.stat2_label,
        stat3_value: about.stat3_value,
        stat3_label: about.stat3_label,
        stat4_value: about.stat4_value,
        stat4_label: about.stat4_label,
        experience_years: about.experience_years,
      })
      setPhotoPreview(about.photo)
      setSkills(about.skills ?? DEFAULT_ABOUT.skills)
      setLoading(false)
    })
  }, [])

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s])
      setNewSkill('')
    }
  }

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s))

  const onSubmit = async (data: AboutForm) => {
    setSaving(true)
    try {
      let photoUrl = photoPreview

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const path = `site/about.${ext}`
        const { data: up, error } = await supabase.storage
          .from('portfolio')
          .upload(path, photoFile, { upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(up.path)
        photoUrl = publicUrl
      }

      const { error } = await supabase.from('about_content').upsert({
        id: 1,
        ...data,
        photo: photoUrl,
        skills,
      })
      if (error) throw error
      toast.success('Seção "Sobre" atualizada!')
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

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-[#080808]/95 border-b border-[rgba(139,92,246,0.1)]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
            Seção Sobre
          </h1>
          <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
            Edite sua foto, bio e estatísticas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-7">

          {/* Foto */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Sua foto
            </label>
            {photoPreview ? (
              <div className="relative w-40 aspect-[4/5] rounded-2xl overflow-hidden">
                <Image src={photoPreview} alt="Foto" fill className="object-cover" sizes="160px" />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-white text-center">
                    <Upload size={20} className="mx-auto mb-1" />
                    <span className="text-xs" style={{ fontFamily: 'var(--font-inter)' }}>Trocar</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    setPhotoFile(f)
                    setPhotoPreview(URL.createObjectURL(f))
                  }} />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block w-40">
                <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-[rgba(139,92,246,0.3)] flex flex-col items-center justify-center gap-2 bg-[#111] hover:border-[rgba(139,92,246,0.6)] transition-all">
                  <Upload size={24} className="text-[#8B5CF6]" />
                  <span className="text-[#A1A1AA] text-xs text-center px-2" style={{ fontFamily: 'var(--font-inter)' }}>
                    Clique para adicionar
                  </span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  setPhotoFile(f)
                  setPhotoPreview(URL.createObjectURL(f))
                }} />
              </label>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Seu nome
            </label>
            <input {...register('name')} className="admin-input" />
          </div>

          {/* Experiência badge */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Anos de experiência
              <span className="text-[#555] ml-1 text-xs">(aparece no badge sobre a foto)</span>
            </label>
            <input {...register('experience_years')} className="admin-input" placeholder="8+" />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Primeiro parágrafo da bio
            </label>
            <textarea
              {...register('bio_paragraph1', { required: 'Obrigatório' })}
              rows={4}
              className="admin-input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#A1A1AA] mb-2 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Segundo parágrafo da bio
            </label>
            <textarea {...register('bio_paragraph2')} rows={4} className="admin-input resize-none" />
          </div>

          {/* Skills / especialidades */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Especialidades
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#C084FC] border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                placeholder="Nova especialidade..."
                className="admin-input flex-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 rounded-xl bg-[rgba(139,92,246,0.15)] text-[#8B5CF6] border border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.25)] transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div>
            <label className="block text-sm text-[#A1A1AA] mb-3 font-500" style={{ fontFamily: 'var(--font-inter)' }}>
              Estatísticas
            </label>
            <div className="grid grid-cols-2 gap-4">
              {([1, 2, 3, 4] as const).map((n) => (
                <div key={n} className="flex gap-2 items-center">
                  <input
                    {...register(`stat${n}_value` as keyof AboutForm)}
                    placeholder="500+"
                    className="admin-input w-20 text-center"
                    style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
                  />
                  <input
                    {...register(`stat${n}_label` as keyof AboutForm)}
                    placeholder="Projetos"
                    className="admin-input flex-1"
                  />
                </div>
              ))}
            </div>
            <p className="text-[#555] text-xs mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
              Formato: valor (500+) + descrição (Projetos realizados)
            </p>
          </div>

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
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
