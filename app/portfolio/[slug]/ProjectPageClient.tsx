'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, ExternalLink, X } from 'lucide-react'
import type { Project } from '@/lib/types'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ProjectPageClient({ project }: { project: Project }) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const allImages = [
    ...(project.cover_image ? [project.cover_image] : []),
    ...project.images,
  ]

  const youtubeId = project.youtube_url
    ? project.youtube_url.match(/(?:youtu\.be\/|v=)([^&\s]+)/)?.[1] ?? null
    : null

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-[#050505]">
        {/* Hero */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#1a0030]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl w-full"
            >
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors text-sm mb-6 group"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Voltar ao portfólio
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="category-badge">{project.category}</span>
                {project.date && (
                  <span className="flex items-center gap-1.5 text-[#A1A1AA] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                    <Calendar size={12} />
                    {new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long' }).format(new Date(project.date))}
                  </span>
                )}
              </div>
              <h1
                className="font-display font-800 text-white leading-tight"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                }}
              >
                {project.title}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {project.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <p
                    className="text-[#A1A1AA] text-lg leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {project.description}
                  </p>
                </motion.div>
              )}

              {/* YouTube Video */}
              {youtubeId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mb-12"
                >
                  <h2
                    className="font-display font-600 text-white text-xl mb-4"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    Vídeo
                  </h2>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[rgba(139,92,246,0.2)]">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Photo Gallery */}
              {allImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2
                    className="font-display font-600 text-white text-xl mb-6"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    Galeria
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allImages.map((img, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setLightboxImg(img)}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-zoom-in border border-[rgba(139,92,246,0.08)] hover:border-[rgba(139,92,246,0.35)] transition-all duration-300"
                      >
                        <Image
                          src={img}
                          alt={`${project.title} — foto ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-[#050505]/0 group-hover:bg-[#050505]/20 transition-colors duration-300 flex items-center justify-center">
                          <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="glass rounded-xl p-6 border border-[rgba(139,92,246,0.15)] sticky top-28"
              >
                <h3
                  className="font-display font-600 text-white text-lg mb-6 pb-4 border-b border-[rgba(139,92,246,0.1)]"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  Detalhes do Projeto
                </h3>

                <div className="flex flex-col gap-4">
                  {[
                    { icon: Tag, label: 'Categoria', value: project.category },
                    project.date
                      ? { icon: Calendar, label: 'Data', value: new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long' }).format(new Date(project.date)) }
                      : null,
                  ].filter(Boolean).map((item) => {
                    if (!item) return null
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <Icon size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-[10px] text-[#555] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                            {item.label}
                          </div>
                          <div className="text-white text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                            {item.value}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(139,92,246,0.1)] flex flex-col gap-3">
                  <a
                    href="https://wa.me/5511999990000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center text-center"
                  >
                    Solicitar projeto similar
                  </a>
                  <Link
                    href="/#portfolio"
                    className="btn-outline w-full justify-center text-center"
                  >
                    Ver portfólio completo
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox — AnimatePresence required for exit animation */}
      <AnimatePresence>
      {lightboxImg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#8B5CF6] transition-colors"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImg}
              alt="Foto ampliada"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}
