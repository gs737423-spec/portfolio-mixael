'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Check, X, Loader2, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CategoryItem } from '@/lib/types'
import { slugify } from '@/lib/utils'

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    setCategories((data ?? []) as CategoryItem[])
    setLoading(false)
  }

  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return
    setSaving(true)
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), slug: editSlug.trim() || slugify(editName) })
      .eq('id', id)
    if (error) { toast.error('Erro ao salvar.') }
    else { toast.success('Categoria atualizada!'); setEditingId(null); load() }
    setSaving(false)
  }

  const toggleActive = async (cat: CategoryItem) => {
    const { error } = await supabase
      .from('categories')
      .update({ active: !cat.active })
      .eq('id', cat.id)
    if (!error) setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, active: !c.active } : c))
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Excluir esta categoria? Projetos com ela não serão excluídos, mas ficarão sem categoria.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) { toast.success('Excluída.'); setCategories(prev => prev.filter(c => c.id !== id)) }
    else toast.error('Erro ao excluir.')
  }

  const createCategory = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const slug = newSlug.trim() || slugify(newName)
    const maxOrder = Math.max(0, ...categories.map(c => c.display_order))
    const { error } = await supabase.from('categories').insert({
      name: newName.trim(),
      slug,
      display_order: maxOrder + 1,
      active: true,
    })
    if (error) { toast.error('Erro ao criar. Nome pode já existir.') }
    else { toast.success('Categoria criada!'); setNewName(''); setNewSlug(''); setCreating(false); load() }
    setSaving(false)
  }

  const moveOrder = async (cat: CategoryItem, direction: 'up' | 'down') => {
    const idx = categories.findIndex(c => c.id === cat.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= categories.length) return

    const other = categories[swapIdx]
    await Promise.all([
      supabase.from('categories').update({ display_order: other.display_order }).eq('id', cat.id),
      supabase.from('categories').update({ display_order: cat.display_order }).eq('id', other.id),
    ])
    load()
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <div className="border-b border-[rgba(139,92,246,0.1)] bg-[#080808]/95">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
              Categorias
            </h1>
            <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
              {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
            </p>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="btn-primary flex items-center gap-2"
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            <Plus size={15} />
            Nova Categoria
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Create form */}
        {creating && (
          <div className="mb-6 rounded-xl bg-[#111] border border-[rgba(139,92,246,0.25)] p-5 flex flex-col gap-4">
            <p className="text-white text-sm font-600" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}>
              Nova categoria
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>Nome</label>
                <input
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)) }}
                  placeholder="Ex: Casamentos"
                  className="admin-input"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>Slug</label>
                <input
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
                  placeholder="casamentos"
                  className="admin-input"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-lg text-[#666] hover:text-white text-xs transition-colors" style={{ fontFamily: 'var(--font-inter)' }}>
                Cancelar
              </button>
              <button onClick={createCategory} disabled={saving || !newName.trim()} className="btn-primary disabled:opacity-50" style={{ padding: '8px 16px', fontSize: '12px' }}>
                {saving ? <Loader2 size={13} className="animate-spin" /> : <><Check size={13} /> Criar</>}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-[#8B5CF6] animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={40} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#555] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>Nenhuma categoria ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className={`rounded-xl border p-4 transition-all ${
                  cat.active
                    ? 'bg-[#111] border-[rgba(139,92,246,0.1)]'
                    : 'bg-[#0d0d0d] border-[#1a1a1a] opacity-60'
                }`}
              >
                {editingId === cat.id ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="admin-input text-sm"
                        autoFocus
                      />
                      <input
                        value={editSlug}
                        onChange={e => setEditSlug(e.target.value)}
                        placeholder="slug"
                        className="admin-input text-sm"
                      />
                    </div>
                    <button onClick={() => saveEdit(cat.id)} disabled={saving} className="p-2 rounded-lg bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 transition-colors">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-[#1a1a1a] text-[#555] hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveOrder(cat, 'up')}
                        disabled={idx === 0}
                        className="p-0.5 text-[#444] hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <GripVertical size={12} />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-600" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}>
                          {cat.name}
                        </span>
                        {!cat.active && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#333] text-[#666]" style={{ fontFamily: 'var(--font-inter)' }}>
                            Inativa
                          </span>
                        )}
                      </div>
                      <p className="text-[#444] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                        /{cat.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleActive(cat)}
                        className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a]"
                        title={cat.active ? 'Desativar' : 'Ativar'}
                      >
                        {cat.active ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#A1A1AA] hover:text-white transition-all border border-[#2a2a2a]"
                        title="Editar"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-red-900/20 text-[#A1A1AA] hover:text-red-400 transition-all border border-[#2a2a2a] hover:border-red-900/40"
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[#333] text-xs mt-8" style={{ fontFamily: 'var(--font-inter)' }}>
          Categorias inativas não aparecem no site para os visitantes.
        </p>
      </div>
    </div>
  )
}
