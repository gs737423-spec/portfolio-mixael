'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, ExternalLink, X } from 'lucide-react'
import type { Project, VideoLink } from '@/lib/types'
import VideoPlayer from '@/components/VideoPlayer'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const GALLERY_PAGE_SIZE = 12

function extractYoutubeId(url: string): string | null {
  return url.match(/(?:youtu\.be\/|v=)([^&\s]+)/)?.[1] ?? null
}

export default function ProjectPageClient({ project, whatsapp = '5521991838960' }: { project: Project; whatsapp?: string }) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE)

  const allImages = [
    ...(project.cover_image ? [project.cover_image] : []),
    ...project.images,
  ]
  const visibleImages = allImages.slice(0, visibleCount)
  const hasMoreImages = visibleCount < allImages.length

  // Merge video_urls with legacy youtube_url for backward compat
  const videos: VideoLink[] = useMemo(() => {
    if (project.video_urls && Array.isArray(project.video_urls) && project.video_urls.length > 0) {
      return project.video_urls
    }
    if (project.youtube_url) {
      return [{ title: '', url: project.youtube_url }]
    }
    return []
  }, [project.video_urls, project.youtube_url])

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
                {project.tags && project.tags.length > 0 && project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="category-badge"
                    style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.2)' }}
                  >
                    {tag}
                  </span>
                ))}
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
                  fontFamily: 'var(--font-manrope)',
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
                <div className="mb-12">
                  <p
                    className="text-[#A1A1AA] text-lg leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {project.description}
                  </p>
                </div>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <div className="mb-12">
                  <h2
                    className="font-display font-600 text-white text-xl mb-6"
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  >
                    {videos.length === 1 ? 'Vídeo' : 'Vídeos'}
                  </h2>
                  <div className="flex flex-col gap-6">
                    {videos.map((video, i) => {
                      const ytId = extractYoutubeId(video.url)
                      return (
                        <div key={i}>
                          {video.title && (
                            <h3 className="text-white text-sm font-500 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                              {video.title}
                            </h3>
                          )}
                          {ytId ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-[rgba(139,92,246,0.2)]">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                title={video.title || `${project.title} - Vídeo ${i + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                              />
                            </div>
                          ) : /\.(mp4|mov|avi|webm)$/i.test(video.url) ? (
                            <VideoPlayer src={video.url} />
                          ) : (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-4 rounded-xl bg-[#111] border border-[rgba(139,92,246,0.15)] hover:border-[rgba(139,92,246,0.4)] transition-colors group"
                            >
                              <ExternalLink size={18} className="text-[#8B5CF6] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm group-hover:text-[#C084FC] transition-colors truncate block" style={{ fontFamily: 'var(--font-inter)' }}>
                                  {video.title || 'Assistir vídeo externo'}
                                </span>
                                <span className="text-[#555] text-xs truncate block" style={{ fontFamily: 'var(--font-inter)' }}>
                                  {video.url}
                                </span>
                              </div>
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {allImages.length > 0 && (
                <div>
                  <h2
                    className="font-display font-600 text-white text-xl mb-6"
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  >
                    Galeria
                  </h2>
                  {/* Uploaded videos in gallery */}
                  {visibleImages.filter((img) => /\.(mp4|mov|avi|webm)$/i.test(img)).length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {visibleImages.map((img, i) => {
                        if (!/\.(mp4|mov|avi|webm)$/i.test(img)) return null
                        return (
                          <VideoPlayer key={`video-${i}`} src={img} />
                        )
                      })}
                    </div>
                  )}

                  {/* Photos */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {visibleImages.map((img, i) => {
                      if (/\.(mp4|mov|avi|webm)$/i.test(img)) return null
                      return (
                        <button
                          key={i}
                          onClick={() => setLightboxImg(img)}
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-zoom-in border border-[rgba(139,92,246,0.08)] hover:border-[rgba(139,92,246,0.35)] transition-all duration-300"
                        >
                          <Image
                            src={img}
                            alt={`${project.title} — foto ${i + 1}`}
                            fill
                            loading={i < 6 ? 'eager' : 'lazy'}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-[#050505]/0 group-hover:bg-[#050505]/20 transition-colors duration-300 flex items-center justify-center">
                            <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {hasMoreImages && (
                    <div className="flex flex-col items-center gap-3 mt-8">
                      <p className="text-[#555] text-xs" style={{ fontFamily: 'var(--font-inter)' }}>
                        Exibindo {visibleImages.length} de {allImages.length} fotos
                      </p>
                      <button
                        onClick={() => setVisibleCount((c) => c + GALLERY_PAGE_SIZE)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(139,92,246,0.3)] text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.6)] transition-all duration-300 text-sm"
                        style={{ fontFamily: 'var(--font-inter)', background: 'rgba(139,92,246,0.05)' }}
                      >
                        Carregar mais fotos
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div
                className="glass rounded-xl p-6 border border-[rgba(139,92,246,0.15)] sticky top-28"
              >
                <h3
                  className="font-display font-600 text-white text-lg mb-6 pb-4 border-b border-[rgba(139,92,246,0.1)]"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  Detalhes do Projeto
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Tag size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-[#555] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                        Categoria
                      </div>
                      <div className="text-white text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                        {project.category}
                      </div>
                    </div>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Tag size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                          Tags
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[10px] text-[#C084FC] border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)]"
                              style={{ fontFamily: 'var(--font-inter)' }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.date && (
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
                          Data
                        </div>
                        <div className="text-white text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                          {new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long' }).format(new Date(project.date))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(139,92,246,0.1)] flex flex-col gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}`}
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
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
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
