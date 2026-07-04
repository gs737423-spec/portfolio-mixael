'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star, Quote, User } from 'lucide-react'
import type { Testimonial } from '@/lib/types'

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Isabela & Rafael Mendes', role: 'Casamento — Junho 2024', photo: 'https://randomuser.me/api/portraits/women/44.jpg', comment: 'O Mixael superou todas as nossas expectativas! Cada foto do nosso casamento conta uma história linda. A sensibilidade dele em capturar os momentos espontâneos é incrível.', rating: 5, created_at: '' },
  { id: '2', name: 'Marina Costa', role: 'Ensaio de Gestante', photo: 'https://randomuser.me/api/portraits/women/68.jpg', comment: 'Fiz meu ensaio de gestante com o Mixael e não tenho palavras para descrever o resultado. Ele me deixou completamente à vontade e as fotos ficaram de tirar o fôlego.', rating: 5, created_at: '' },
  { id: '3', name: 'Carlos Eduardo Nunes', role: 'Diretor de Marketing — Vivo', photo: 'https://randomuser.me/api/portraits/men/32.jpg', comment: 'Trabalhamos com o Mixael em nossa campanha corporativa e o resultado foi absolutamente profissional. Entrega pontual, comunicação excelente e imagens que trouxeram nossa marca à vida.', rating: 5, created_at: '' },
  { id: '4', name: 'Ana Paula Ferreira', role: 'CEO — Restaurante Alma', photo: 'https://randomuser.me/api/portraits/women/26.jpg', comment: 'Os reels que o Mixael produziu para o restaurante aumentaram nosso engajamento em mais de 300%! O olhar criativo dele é único. Recomendo sem hesitar.', rating: 5, created_at: '' },
  { id: '5', name: 'Rodrigo & Beatriz Santos', role: 'Casamento — Novembro 2024', photo: 'https://randomuser.me/api/portraits/men/76.jpg', comment: 'Que profissional incrível! O Mixael captou absolutamente tudo. A equipe dele foi discreta, criativa e entregou um álbum e filme que nos emocionam toda vez que revisitamos.', rating: 5, created_at: '' },
]

export default function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  const data = testimonials && testimonials.length > 0 ? testimonials : DEMO_TESTIMONIALS
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoPlay) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % data.length)
    }, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [autoPlay, current])

  const go = (dir: number) => {
    setAutoPlay(false)
    setCurrent((c) => (c + dir + data.length) % data.length)
  }

  const t = data[current]

  return (
    <section
      id="depoimentos"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-label="Depoimentos"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-label justify-center mb-4">Depoimentos</div>
          <h2
            className="section-title"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            O que meus{' '}
            <span className="gradient-text">clientes dizem</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="testimonial-card glass glow-border">
            <div className="absolute top-6 right-8 text-[#8B5CF6] opacity-30">
              <Quote size={48} />
            </div>

            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-[#8B5CF6] text-[#8B5CF6]" />
              ))}
            </div>

            <p
              className="text-white text-lg md:text-xl leading-relaxed mb-8 text-balance relative z-10"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
            >
              &ldquo;{t.comment}&rdquo;
            </p>

            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(139,92,246,0.4)] flex-shrink-0 bg-[#1a1a1a] flex items-center justify-center">
                {t.photo ? (
                  <Image src={t.photo} alt={t.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <User size={20} className="text-[#555]" />
                )}
              </div>
              <div>
                <div
                  className="font-display font-600 text-white text-sm"
                  style={{ fontFamily: 'var(--font-manrope)' }}
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
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {data.map((_, i) => (
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

          <div className="flex justify-center gap-4 mt-10">
            {data.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { setAutoPlay(false); setCurrent(i) }}
                className={`relative w-10 h-10 rounded-full overflow-hidden bg-[#1a1a1a] flex items-center justify-center transition-all duration-300 ${
                  i === current
                    ? 'ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-[#050505] scale-110'
                    : 'opacity-40 hover:opacity-70'
                }`}
              >
                {item.photo ? (
                  <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="40px" />
                ) : (
                  <User size={16} className="text-[#555]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
