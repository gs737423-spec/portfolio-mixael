'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, FileVideo, X } from 'lucide-react'
import { supabase, getPublicImageUrl } from '@/lib/supabase'

interface MediaItem {
  name: string
  url: string
  size: number
  created_at: string
  type: 'image' | 'video'
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MidiaPage() {
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(async () => {
    const { data, error } = await supabase.storage.from('portfolio').list('media', {
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (!error && data) {
      const items: MediaItem[] = data
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => ({
          name: f.name,
          url: getPublicImageUrl(`media/${f.name}`),
          size: f.metadata?.size ?? 0,
          created_at: f.created_at ?? '',
          type: f.name.match(/\.(mp4|mov|avi|webm)$/i) ? 'video' : 'image',
        }))
      setFiles(items)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = Array.from(e.target.files ?? [])
    if (!uploadFiles.length) return
    setUploading(true)

    let success = 0
    for (const file of uploadFiles) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('portfolio')
        .upload(`media/${fileName}`, file, { cacheControl: '3600', upsert: false })
      if (!error) success++
    }

    toast.success(`${success} arquivo${success > 1 ? 's' : ''} enviado${success > 1 ? 's' : ''}!`)
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    loadFiles()
  }

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Excluir "${item.name}"?`)) return
    setDeleting(item.name)
    const { error } = await supabase.storage.from('portfolio').remove([`media/${item.name}`])
    if (!error) {
      toast.success('Arquivo excluído.')
      setFiles((prev) => prev.filter((f) => f.name !== item.name))
      if (selected?.name === item.name) setSelected(null)
    } else {
      toast.error('Erro ao excluir.')
    }
    setDeleting(null)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copiada!')
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="border-b border-[rgba(139,92,246,0.1)] bg-[#080808]/95">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white text-base" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}>
              Biblioteca de Mídia
            </h1>
            <p className="text-[#555] text-xs mt-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
              {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
            </p>
          </div>

          <label className="btn-primary cursor-pointer flex items-center gap-2" style={{ padding: '10px 20px', fontSize: '13px' }}>
            {uploading ? (
              <><Loader2 size={15} className="animate-spin" /> Enviando...</>
            ) : (
              <><Upload size={15} /> Enviar arquivos</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Drop zone hint */}
        <div
          className="mb-6 border-2 border-dashed border-[rgba(139,92,246,0.2)] rounded-xl p-8 text-center cursor-pointer hover:border-[rgba(139,92,246,0.4)] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={24} className="mx-auto text-[#555] mb-2" />
          <p className="text-[#666] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
            Clique ou arraste arquivos aqui para enviar
          </p>
          <p className="text-[#444] text-xs mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Imagens e vídeos suportados
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="text-[#8B5CF6] animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon size={40} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#555] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>Nenhum arquivo ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {files.map((file) => (
              <div
                key={file.name}
                className={`group relative rounded-xl overflow-hidden bg-[#111] border cursor-pointer transition-all duration-200 ${
                  selected?.name === file.name
                    ? 'border-[#8B5CF6] shadow-[0_0_16px_rgba(139,92,246,0.3)]'
                    : 'border-[rgba(139,92,246,0.08)] hover:border-[rgba(139,92,246,0.25)]'
                }`}
                onClick={() => setSelected(selected?.name === file.name ? null : file)}
              >
                <div className="aspect-square relative">
                  {file.type === 'image' ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                      <FileVideo size={28} className="text-[#555]" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[#A1A1AA] text-[10px] truncate" style={{ fontFamily: 'var(--font-inter)' }}>
                    {file.name}
                  </p>
                  <p className="text-[#555] text-[9px]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {formatBytes(file.size)}
                  </p>
                </div>

                {/* Hover actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(file.url) }}
                    className="p-1.5 rounded-lg bg-[#111]/90 text-[#A1A1AA] hover:text-white transition-colors"
                    title="Copiar URL"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(file) }}
                    disabled={deleting === file.name}
                    className="p-1.5 rounded-lg bg-[#111]/90 text-[#A1A1AA] hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    {deleting === file.name ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side panel for selected file */}
      {selected && (
        <div className="fixed right-0 top-0 h-full w-72 bg-[#0d0d0d] border-l border-[rgba(139,92,246,0.1)] z-50 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(139,92,246,0.1)]">
            <span className="text-white text-sm font-600" style={{ fontFamily: 'var(--font-manrope)', fontWeight: 600 }}>
              Detalhes
            </span>
            <button onClick={() => setSelected(null)} className="text-[#555] hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {/* Preview */}
            <div className="aspect-video relative rounded-xl overflow-hidden bg-[#111]">
              {selected.type === 'image' ? (
                <Image src={selected.url} alt={selected.name} fill className="object-contain" sizes="288px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileVideo size={32} className="text-[#555]" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-[#555] text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Nome</p>
                <p className="text-white text-xs break-all" style={{ fontFamily: 'var(--font-inter)' }}>{selected.name}</p>
              </div>
              <div>
                <p className="text-[#555] text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>Tamanho</p>
                <p className="text-white text-xs" style={{ fontFamily: 'var(--font-inter)' }}>{formatBytes(selected.size)}</p>
              </div>
            </div>

            {/* URL */}
            <div>
              <p className="text-[#555] text-[10px] uppercase tracking-wider mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>URL</p>
              <div className="bg-[#111] border border-[rgba(139,92,246,0.15)] rounded-lg p-3">
                <p className="text-[#A1A1AA] text-[10px] break-all leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {selected.url}
                </p>
              </div>
            </div>

            <button
              onClick={() => copyUrl(selected.url)}
              className="btn-primary w-full justify-center"
              style={{ padding: '10px', fontSize: '12px' }}
            >
              <Copy size={13} />
              Copiar URL
            </button>

            <button
              onClick={() => handleDelete(selected)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-red-400 hover:bg-red-900/10 border border-red-900/20 hover:border-red-900/40 transition-all text-xs"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <Trash2 size={13} />
              Excluir arquivo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
