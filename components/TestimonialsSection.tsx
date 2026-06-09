'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Isabela & Rafael Mendes',
    role: 'Casamento — Junho 2024',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment: 'O Mixael superou todas as nossas expectativas! Cada foto do nosso casamento conta uma história linda. A sensibilidade dele em capturar os momentos espontâneos é incrível. Com certeza o melhor investimento do nosso dia.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marina Costa',
    role: 'Ensaio de Gestante',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    comment: 'Fiz meu ensaio de gestante com o Mixael e não tenho palavras para descrever o resultado. Ele me deixou completamente à vontade e as fotos ficaram de tirar o fôlego. São memórias que vou guardar para sempre.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Carlos Eduardo Nunes',
    role: 'Diretor de Marketing — Vivo',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    comment: 'Trabalhamos com o Mixael em nossa campanha corporativa e o resultado foi absolutamente profissional. Entrega pontual, comunicação excelente e imagens que trouxeram nossa marca à vida de um jeito que nunca conseguimos antes.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Ana Paula Ferreira',
    role: 'CEO — Restaurante Alma',
    photo: 'https://randomuser.me/api/portraits/women/26.jpg',
    comment: 'Os reels que o Mixael produziu para o restaurante aumentaram nosso engajamento em mais de 300%! O olhar criativo dele é único. Cada vídeo parece um mini-filme. Recomendo sem hesitar.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Rodrigo & Beatriz Santos',
    role: 'Casamento — Novembro 2024',
    photo: 'https://randomuser.me/api/portraits/men/76.jpg',
    comment: 'Que profissional incrível! O Mixael captou absolutamente tudo. A equipe dele foi discreta, criativa e entregou um álbum e filme que nos emocionam toda vez que revisitamos. Nosso dia revivido para sempre.',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [autoPlay, current])

  const go = (dir: number) => {
    setAutoPlay(false)
    setCurrent((c) => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const t = TESTIMONIALS[current]

  return (
    <section
      id="depoimentos"
      ref={ref}
      className="relative py-24 md:py-32 bg-[#050505] overflow-hidden"
      aria-label="Depoimentos"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#8B5CF6] opacity-[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="section-label justify-center mb-4">Depoimentos</div>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            O que meus{' '}
            <span className="gradient-text">clientes dizem</span>
          </h2>
        </motion.div>

        {/* Main testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="testimonial-card glass glow-border"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-8 text-[#8B5CF6] opacity-30">
                <Quote size={48} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#8B5CF6] text-[#8B5CF6]" />
                ))}
              </div>

              {/* Comment */}
              <p
                className="text-white text-lg md:text-xl leading-relaxed mb-8 text-balance relative z-10"
                style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
              >
                "{t.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(139,92,246,0.4)] flex-shrink-0">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div
                    className="font-display font-600 text-white text-sm"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-[#A1A1AA] text-xs mt-0.5"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoPlay(false); setCurrent(i) }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 h-2 bg-[#8B5CF6]'
                      : 'w-2 h-2 bg-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.6)]'
                  }`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full glass border border-[rgba(139,92,246,0.2)] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full glass border border-[rgba(139,92,246,0.2)] flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[rgba(139,92,246,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                aria-label="Próximo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Thumbnail row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-4 mt-10"
        >
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => { setAutoPlay(false); setCurrent(i) }}
              className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 ${
                i === current
                  ? 'ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-[#050505] scale-110'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Image
                src={t.photo}
                alt={t.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
