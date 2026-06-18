'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Client } from '@/lib/types'

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true })
    setClients((data ?? []) as Client[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleActive = async (c: Client) => {
    await supabase.from('clients').update({ active: !c.active }).eq('id', c.id)
    toast.success(c.active ? 'Cliente ocultado' : 'Cliente ativado')
    load()
  }

  const remove = async (c: Client) => {
    if (!confirm(`Excluir "${c.name}"? Isso removerá todos os reels e vídeos associados.`)) return
    await supabase.from('clients').delete().eq('id', c.id)
    toast.success('Cliente excluído')
    load()
  }

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-sora)' }}>
              Clientes
            </h1>
            <p className="text-[#71717A] text-sm mt-1">
              Gerencie páginas por cliente com fotos, reels e vídeos
            </p>
          </div>
          <Link
            href="/admin/clientes/novo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ background: 'rgba(139,92,246,0.9)', fontFamily: 'var(--font-sora)' }}
          >
            <Plus size={16} />
            Novo Cliente
          </Link>
        </div>

        {loading ? (
          <div className="text-[#71717A] text-center py-20">Carregando...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={40} className="text-[#333] mx-auto mb-4" />
            <p className="text-[#71717A] mb-2">Nenhum cliente ainda</p>
            <p className="text-[#444] text-sm">Crie o primeiro cliente para organizar seus projetos por marca</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(255,255,255,0.06)] transition-all"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                {/* Cover thumb */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#111] flex items-center justify-center">
                  {c.cover_image ? (
                    <Image src={c.cover_image} alt={c.name} width={56} height={56} className="object-cover w-full h-full" />
                  ) : (
                    <Briefcase size={20} className="text-[#444]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-sora)' }}>
                      {c.name}
                    </span>
                    {!c.active && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#333] text-[#888]">Oculto</span>
                    )}
                  </div>
                  <p className="text-[#555] text-xs mt-0.5">/{c.slug}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/clientes/${c.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-all"
                    title="Ver página"
                  >
                    <Eye size={15} />
                  </Link>
                  <button
                    onClick={() => toggleActive(c)}
                    className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-white/5 transition-all"
                    title={c.active ? 'Ocultar' : 'Ativar'}
                  >
                    {c.active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <Link
                    href={`/admin/clientes/${c.id}`}
                    className="p-2 rounded-lg text-[#555] hover:text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.1)] transition-all"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => remove(c)}
                    className="p-2 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
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
