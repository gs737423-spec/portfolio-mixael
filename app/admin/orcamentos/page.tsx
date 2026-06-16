'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Mail, MessageCircle, Phone, CheckCircle, Circle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ContactSubmission } from '@/lib/types'

export default function OrcamentosPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setSubmissions(data as ContactSubmission[])
    setLoading(false)
  }

  const toggleRead = async (sub: ContactSubmission) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ read: !sub.read })
      .eq('id', sub.id)

    if (!error) {
      setSubmissions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, read: !s.read } : s)
      )
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Excluir este orçamento?')) return
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (!error) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
      toast.success('Excluído.')
    }
  }

  const filtered = submissions.filter((s) => {
    if (filter === 'unread') return !s.read
    if (filter === 'read') return s.read
    return true
  })

  const unreadCount = submissions.filter((s) => !s.read).length

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="border-b border-[rgba(139,92,246,0.1)] bg-[#080808]/95">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700 }}>
              Orçamentos
            </h1>
            <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
              {unreadCount > 0 ? `${unreadCount} não lidos` : 'Tudo em dia'}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-[#111] border border-[rgba(139,92,246,0.1)] rounded-xl p-1">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  filter === f
                    ? 'bg-[rgba(139,92,246,0.2)] text-white border border-[rgba(139,92,246,0.3)]'
                    : 'text-[#666] hover:text-white'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {f === 'all' ? 'Todos' : f === 'unread' ? 'Não lidos' : 'Lidos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-[#8B5CF6] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle size={40} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#555] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              {filter === 'unread' ? 'Nenhuma mensagem não lida.' : 'Nenhum orçamento ainda.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((sub) => (
              <div
                key={sub.id}
                className={`rounded-xl border p-5 transition-all duration-200 ${
                  sub.read
                    ? 'bg-[#0d0d0d] border-[rgba(139,92,246,0.06)]'
                    : 'bg-[#111] border-[rgba(139,92,246,0.2)] shadow-[0_0_20px_rgba(139,92,246,0.05)]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Read indicator */}
                    <button
                      onClick={() => toggleRead(sub)}
                      className="mt-0.5 text-[#555] hover:text-[#8B5CF6] transition-colors flex-shrink-0"
                      title={sub.read ? 'Marcar como não lido' : 'Marcar como lido'}
                    >
                      {sub.read ? <CheckCircle size={16} className="text-[#8B5CF6]" /> : <Circle size={16} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Name + service */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-white text-sm font-600" style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 600 }}>
                          {sub.name}
                        </span>
                        {sub.service_type && (
                          <span className="category-badge text-[9px]">{sub.service_type}</span>
                        )}
                        {!sub.read && (
                          <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] text-[9px] font-600 border border-[#8B5CF6]/30">
                            Novo
                          </span>
                        )}
                      </div>

                      {/* Contacts */}
                      <div className="flex items-center gap-4 flex-wrap mb-3">
                        {sub.phone && (
                          <a href={`tel:${sub.phone}`} className="flex items-center gap-1.5 text-[#A1A1AA] hover:text-white text-xs transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                            <Phone size={11} />
                            {sub.phone}
                          </a>
                        )}
                        {sub.whatsapp && (
                          <a
                            href={`https://wa.me/55${sub.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[#25D366] hover:text-[#25D366]/80 text-xs transition-colors"
                            style={{ fontFamily: 'var(--font-inter)' }}
                          >
                            <MessageCircle size={11} />
                            {sub.whatsapp}
                          </a>
                        )}
                        {sub.email && (
                          <a href={`mailto:${sub.email}`} className="flex items-center gap-1.5 text-[#8B5CF6] hover:text-[#C084FC] text-xs transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                            <Mail size={11} />
                            {sub.email}
                          </a>
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-[#A1A1AA] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sub.message}
                      </p>

                      {/* Date */}
                      <p className="text-[#444] text-xs mt-2" style={{ fontFamily: 'var(--font-inter)' }}>
                        {new Date(sub.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteSubmission(sub.id)}
                    className="p-2 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-900/10 transition-all flex-shrink-0"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
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
