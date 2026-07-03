'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  active: boolean
  display_order: number
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const load = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const addCategory = async () => {
    const name = newName.trim()
    if (!name) return
    setAdding(true)
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.display_order ?? 0), 0)
    const { error } = await supabase.from('categories').insert({ name, slug: slugify(name), active: true, display_order: maxOrder + 1 })
    if (error) toast.error('Erro ao criar categoria')
    else { toast.success('Categoria criada!'); setNewName('') }
    await load()
    setAdding(false)
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('categories').update({ active: !active }).eq('id', id)
    toast.success(active ? 'Categoria desativada' : 'Categoria ativada')
    await load()
  }

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Excluir a categoria "${name}"?`)) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir')
    else toast.success('Categoria excluida')
    await load()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-[#8B5CF6]" size={32} />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Categorias</h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          placeholder="Nome da nova categoria"
          className="flex-1 bg-[#1a1a2e] border border-[rgba(139,92,246,0.2)] rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#8B5CF6] transition-colors"
        />
        <button
          onClick={addCategory}
          disabled={adding || !newName.trim()}
          className="flex items-center gap-2 px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          Adicionar
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-[#A1A1AA] text-center py-12">Nenhuma categoria criada ainda.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 bg-[#1a1a2e] border border-[rgba(139,92,246,0.1)] rounded-lg px-4 py-3"
            >
              <GripVertical size={16} className="text-[#555] flex-shrink-0" />
              <span className={`flex-1 ${cat.active ? 'text-white' : 'text-[#555] line-through'}`}>
                {cat.name}
              </span>
              <button
                onClick={() => toggleActive(cat.id, cat.active)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  cat.active
                    ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                    : 'border-[#555]/30 text-[#555] hover:bg-[#555]/10'
                }`}
              >
                {cat.active ? 'Ativa' : 'Inativa'}
              </button>
              <button
                onClick={() => deleteCategory(cat.id, cat.name)}
                className="p-2 text-[#555] hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
