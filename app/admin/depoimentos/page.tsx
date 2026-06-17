'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Star, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/types'

export default function DepoimentosPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setItems((data as Testimonial[]) ?? [])
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Excluir depoimento?')) return
    setDeleting(id)
    await supabase.from('testimonials').delete().eq('id', id)
    setItems((prev) => prev.filter((t) => t.id !== id))
    toast.success('Depoimento excluído.')
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800 }}
            >
              Depoimentos
            </h1>
            <p className="text-[#A1A1AA] text-sm mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
              {items.length} depoimento{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin/depoimentos/novo" className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Novo depoimento
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="rounded-xl skeleton h-24" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Star size={40} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#A1A1AA] mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
              Nenhum depoimento ainda.
            </p>
            <Link href="/admin/depoimentos/novo" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Adicionar depoimento
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-4 p-5 rounded-xl bg-[#111] border border-[rgba(139,92,246,0.1)] hover:border-[rgba(139,92,246,0.2)] transition-all"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-[rgba(139,92,246,0.2)]">
                  {t.photo ? (
                    <Image src={t.photo} alt={t.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-[#444]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-white text-sm font-600"
                      style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}
                    >
                      {t.name}
                    </span>
                    {t.role && (
                      <span className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                        — {t.role}
                      </span>
                    )}
                    <div className="flex gap-0.5 ml-auto">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#8B5CF6] text-[#8B5CF6]" />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-[#A1A1AA] text-sm leading-relaxed line-clamp-2"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    "{t.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/depoimentos/${t.id}`}
                    className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a] hover:border-[rgba(139,92,246,0.3)]"
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    onClick={() => del(t.id)}
                    disabled={deleting === t.id}
                    className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-red-900/20 text-[#A1A1AA] hover:text-red-400 transition-all border border-[#2a2a2a] hover:border-red-900/40 disabled:opacity-50"
                    title="Excluir"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
