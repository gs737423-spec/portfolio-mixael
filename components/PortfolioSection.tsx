'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { Project, CategoryItem } from '@/lib/types'

const ALL_LABEL = 'Todos'

export default function PortfolioSection({ projects = [], categories = [] }: { projects?: Project[]; categories?: CategoryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL)
  const [filtered, setFiltered] = useState<Project[]>([])

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (activeCategory === ALL_LABEL) {
      setFiltered(projects)
    } else {
      setFiltered(projects.filter((p) => p.category === activeCategory))
    }
  }, [activeCategory, projects])

  const activeCategories = categories.filter((c) => c.active)
  const allCategories = [ALL_LABEL, ...activeCategories.map((c) => c.name)]

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative pt-28 pb-24 md:pt-32 md:pb-32 bg-[#050505]"
      aria-label="Portfólio"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-glow-primary opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="section-label mb-4">Trabalhos</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2
              className="section-title"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Meu{' '}
              <span className="gradient-text">Portfólio</span>
            </h2>
            <p
              className="text-[#A1A1AA] max-w-sm leading-relaxed text-sm"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Cada projeto conta uma história única, capturada com paixão e precisão técnica.
            </p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 rounded-full text-xs font-display font-500 tracking-wide transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-white'
                  : 'text-[#A1A1AA] hover:text-white border border-[rgba(139,92,246,0.2)] hover:border-[rgba(139,92,246,0.4)]'
              }`}
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#A1A1AA]">
            <p style={{ fontFamily: 'var(--font-inter)' }}>Nenhum projeto nesta categoria ainda.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/portfolio/${project.slug}`} className="block">
        <article className="project-card group">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[16/10]">
            {project.cover_image ? (
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="card-img"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[#333] text-4xl">🎬</span>
              </div>
            )}

            {/* Overlay */}
            <div className="card-overlay" />

            {/* Hover content */}
            <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10">
              <div className="flex items-center gap-2 text-white">
                <span
                  className="text-sm font-display font-500"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  Ver projeto
                </span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Glow border on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(139,92,246,0.5)' }}
            />
          </div>

          {/* Card Body */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="category-badge">{project.category}</span>
              {project.youtube_url && (
                <span className="category-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
                  Vídeo
                </span>
              )}
            </div>
            <h3
              className="font-display font-600 text-white text-lg mb-2 group-hover:text-[#C084FC] transition-colors duration-300 leading-snug"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {project.title}
            </h3>
            {project.short_description && (
              <p
                className="text-[#A1A1AA] text-sm leading-relaxed line-clamp-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
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
    </motion.div>
  )
}
