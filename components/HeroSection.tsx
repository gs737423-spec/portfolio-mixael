'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const handleScroll = (target: string) => {
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
      aria-label="Hero"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="orb w-[600px] h-[600px] bg-[#8B5CF6] top-[-200px] left-[-150px] opacity-[0.07]" />
        <div className="orb w-[500px] h-[500px] bg-[#A855F7] bottom-[-100px] right-[-100px] opacity-[0.06]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="leading-[1.05] tracking-tight"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
          }}
        >
          <span className="text-white">Transformando </span>
          <span
            className="gradient-text"
            style={{ fontStyle: 'italic', textShadow: '0 0 40px rgba(139,92,246,0.4)' }}
          >
            emoções
          </span>
          <br />
          <span className="text-white">em histórias </span>
          <span
            style={{
              WebkitTextStroke: '1.5px rgba(192,132,252,0.6)',
              WebkitTextFillColor: 'transparent',
            }}
          >
            inesquecíveis
          </span>
          <span className="gradient-text">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <button onClick={() => handleScroll('portfolio')} className="btn-primary">
            Ver Portfólio
          </button>
          <button onClick={() => handleScroll('contato')} className="btn-outline">
            Solicitar Orçamento
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={() => handleScroll('portfolio')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#444] hover:text-[#A1A1AA] transition-colors"
        aria-label="Rolar para baixo"
      >
        <span className="text-[9px] tracking-[0.25em] uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
          scroll
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  )
}
