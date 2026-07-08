'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import type { Project, CategoryItem } from '@/lib/types'

const ALL_LABEL = 'Todos'
const PAGE_SIZE = 9

export default function PortfolioSection({ projects = [], categories = [] }: { projects?: Project[]; categories?: CategoryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [visible, setVisible] = useState<Project[]>([])
  const [page, setPage] = useState(1)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagSet.add(t))
      }
    })
    return Array.from(tagSet).sort()
  }, [projects])

  useEffect(() => {
    let f = projects

    if (activeCategory !== ALL_LABEL) {
      f = f.filter((p) => p.category === activeCategory)
    }

    if (activeTags.length > 0) {
      f = f.filter((p) =>
        activeTags.every((tag) => p.tags && p.tags.includes(tag))
      )
    }

    setFiltered(f)
    setPage(1)
    setVisible(f.slice(0, PAGE_SIZE))
  }, [activeCategory, activeTags, projects])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    setVisible(filtered.slice(0, next * PAGE_SIZE))
  }

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setActiveCategory(ALL_LABEL)
    setActiveTags([])
  }

  const hasFilters = activeCategory !== ALL_LABEL || activeTags.length > 0
  const hasMore = visible.length < filtered.length
  const activeCategories = categories.filter((c) => c.active)
  const allCategories = [ALL_LABEL, ...activeCategories.map((c) => c.name)]

  return (
    <section id="portfolio" className="relative pt-28 pb-24 md:pt-32 md:pb-32" aria-label="Portfólio">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <div className="section-label mb-4">Trabalhos</div>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-manrope)' }}>
            Meu{' '}<span className="gradient-text">Portfólio</span>
          </h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-display font-500 tracking-wide transition-colors duration-200 ${
                activeCategory === cat
                  ? 'text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]'
                  : 'text-[#A1A1AA] hover:text-white border border-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.4)]'
              }`}
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-[#555] text-xs mr-1" style={{ fontFamily: 'var(--font-inter)' }}>Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-500 transition-all duration-200 ${
                  activeTags.includes(tag)
                    ? 'bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/50'
                    : 'text-[#777] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(139,92,246,0.3)] hover:text-[#A1A1AA]'
                }`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {tag}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-[11px] font-500 text-red-400/70 border border-red-400/20 hover:border-red-400/40 hover:text-red-400 transition-all duration-200 flex items-center gap-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <X size={12} />
                Limpar
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug}`} className="block">
              <article className="project-card group">
                <div className="relative overflow-hidden aspect-[16/10]">
                  {project.cover_image ? (
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="card-img"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-[#333] text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="card-overlay" />
                  <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-display font-500" style={{ fontFamily: 'var(--font-manrope)' }}>
                        Ver projeto
                      </span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span className="category-badge">{project.category}</span>
                    {project.tags && project.tags.length > 0 && project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="category-badge"
                        style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.15)' }}
                      >
                        {tag}
                      </span>
                    ))}
                    {((project.video_urls && project.video_urls.length > 0) || project.youtube_url) && (
                      <span className="category-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
                        Vídeo
                      </span>
                    )}
                  </div>
                  <h3
                    className="font-display font-600 text-white text-lg mb-2 group-hover:text-[#C084FC] transition-colors duration-200 leading-snug"
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  >
                    {project.title}
                  </h3>
                  {project.short_description && (
                    <p className="text-[#A1A1AA] text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-inter)' }}>
                      {project.short_description}
                    </p>
                  )}
                  {project.date && (
                    <p className="text-[#555] text-xs mt-3" style={{ fontFamily: 'var(--font-inter)' }}>
                      {new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long' }).format(new Date(project.date))}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#A1A1AA]">
            <p className="mb-4" style={{ fontFamily: 'var(--font-inter)' }}>Nenhum projeto encontrado com esses filtros.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-[#8B5CF6] hover:text-[#C084FC] text-sm transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Limpar filtros e ver todos
              </button>
            )}
          </div>
        )}

        {hasMore && (
          <div className="flex flex-col items-center gap-3 mt-12">
            <p className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
              Exibindo {visible.length} de {filtered.length} projetos
            </p>
            <button
              onClick={loadMore}
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(139,92,246,0.3)] text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.6)] transition-all duration-200 text-sm"
              style={{ fontFamily: 'var(--font-inter)', background: 'rgba(139,92,246,0.05)' }}
            >
              Carregar mais
              <ChevronDown size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
