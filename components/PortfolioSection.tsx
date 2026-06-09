'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { Project, Category } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'

const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Casamento Isabela & Rafael',
    slug: 'casamento-isabela-rafael',
    category: 'Casamentos',
    description: 'Uma cerimônia ao pôr do sol repleta de emoção e beleza. Cada detalhe capturado com sensibilidade.',
    short_description: 'Cerimônia ao pôr do sol com 450 convidados',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-06-15',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Ensaio Ana Clara',
    slug: 'ensaio-ana-clara',
    category: 'Ensaios',
    description: 'Ensaio urbano com luz natural. Personalidade e autenticidade em cada frame.',
    short_description: 'Ensaio urbano com luz natural',
    cover_image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-08-20',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Evento Tech Summit 2024',
    slug: 'tech-summit-2024',
    category: 'Eventos',
    description: 'Cobertura completa do maior evento de tecnologia do Brasil.',
    short_description: 'Cobertura do maior evento tech do Brasil',
    cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-09-10',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'Campanha Corporativa Vivo',
    slug: 'campanha-corporativa-vivo',
    category: 'Corporativo',
    description: 'Produção visual completa para a campanha anual da Vivo Telecom.',
    short_description: 'Campanha visual para grande corporação',
    cover_image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-07-05',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    title: 'Litoral de Ilhabela — Drone',
    slug: 'litoral-ilhabela-drone',
    category: 'Drone',
    description: 'Imagens aéreas deslumbrantes do litoral de Ilhabela, capturando a imensidão do oceano.',
    short_description: 'Imagens aéreas do litoral paulista',
    cover_image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-05-30',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    title: 'Reels Restaurante Alma',
    slug: 'reels-restaurante-alma',
    category: 'Reels',
    description: 'Conteúdo de alto impacto para redes sociais. Conceito e execução completos.',
    short_description: 'Reels e conteúdo para redes sociais',
    cover_image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-10-01',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '7',
    title: 'Documentário "Raízes"',
    slug: 'documentario-raizes',
    category: 'Produções Audiovisuais',
    description: 'Documentário sobre as tradições culturais do interior do Brasil.',
    short_description: 'Documentário de curta-metragem',
    cover_image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&q=80',
    images: [],
    youtube_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    date: '2024-04-20',
    published: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '8',
    title: 'Casamento Marina & Carlos',
    slug: 'casamento-marina-carlos',
    category: 'Casamentos',
    description: 'Casamento intimista em fazenda histórica com decoração romântica.',
    short_description: 'Casamento intimista em fazenda histórica',
    cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80',
    images: [],
    youtube_url: null,
    date: '2024-11-03',
    published: true,
    created_at: '',
    updated_at: '',
  },
]

const ALL_LABEL = 'Todos'

export default function PortfolioSection({ projects }: { projects?: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL)
  const [filtered, setFiltered] = useState<Project[]>([])
  const data = projects && projects.length > 0 ? projects : DEMO_PROJECTS

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (activeCategory === ALL_LABEL) {
      setFiltered(data)
    } else {
      setFiltered(data.filter((p) => p.category === activeCategory))
    }
  }, [activeCategory, data])

  const allCategories = [ALL_LABEL, ...CATEGORIES]

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#050505]"
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
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
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
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
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
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
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
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
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
