'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

const WORDS = ['momentos', 'emoções', 'memórias', 'sonhos']

export default function HeroSection({ settings }: { settings?: SiteSettings }) {
  const s = settings ?? DEFAULT_SETTINGS
  const stats = [
    { value: s.hero_stat1_value, label: s.hero_stat1_label },
    { value: s.hero_stat2_value, label: s.hero_stat2_label },
    { value: s.hero_stat3_value, label: s.hero_stat3_label },
  ]
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  // Animated rotating word — direct DOM to avoid React re-render flicker
  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    let idx = 0
    const rotate = () => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(12px)'
      setTimeout(() => {
        idx = (idx + 1) % WORDS.length
        el.textContent = WORDS[idx]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 320)
    }
    const interval = setInterval(rotate, 2800)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (target: string) => {
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
      aria-label="Hero"
    >
      {/* ── Background ── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale }}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Orb top-left — não sobrepõe o texto */}
        <motion.div
          className="orb w-[700px] h-[700px] bg-[#8B5CF6] top-[-280px] left-[-200px] opacity-[0.08]"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Orb bottom-right */}
        <motion.div
          className="orb w-[600px] h-[600px] bg-[#A855F7] bottom-[-160px] right-[-160px] opacity-[0.07]"
          animate={{ x: [0, -35, 0], y: [0, -45, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Edge vignette — não cobre texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(5,5,5,0.7) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-40" />
      </motion.div>

      {/* Letterbox bars */}
      <div className="letterbox-top" />
      <div className="letterbox-bottom" />

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-7"
        >
          {/* Category label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
            <span
              className="text-[10px] font-semibold tracking-[0.32em] uppercase text-[#8B5CF6]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Fotografia & Produção Audiovisual
            </span>
            <div className="w-8 h-px bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
          </motion.div>

          {/* ── Main Title ── */}
          <motion.h1
            variants={itemVariants}
            className="leading-[1.08] tracking-tight text-center"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 800,
              fontSize: 'clamp(1.9rem, 4.6vw, 4.5rem)',
            }}
          >
            {/* Line 1 — "Transformando [palavra]" sempre juntos */}
            <span className="block whitespace-nowrap">
              <span className="text-white">Transformando </span>
              <span
                ref={wordRef}
                className="gradient-text inline-block"
                style={{
                  transition: 'opacity 0.32s ease, transform 0.32s ease',
                  textShadow: '0 0 40px rgba(139,92,246,0.5)',
                  fontStyle: 'italic',
                }}
              >
                momentos
              </span>
            </span>

            {/* Line 2 */}
            <span className="block mt-1">
              <span className="text-white">em histórias </span>
              <span
                style={{
                  WebkitTextStroke: '1.5px rgba(192,132,252,0.7)',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                inesquecíveis
              </span>
              <span className="gradient-text">.</span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[#A1A1AA] text-base md:text-lg max-w-lg leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
          >
            {s.hero_subtitle}
            <span className="block text-[#555] text-sm mt-1">{s.hero_location}</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => handleScroll('portfolio')} className="btn-primary group">
              <Play size={13} className="group-hover:scale-110 transition-transform" />
              Ver Portfólio
            </button>
            <button onClick={() => handleScroll('contato')} className="btn-outline">
              Solicitar Orçamento
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-10 pt-8 mt-2 border-t border-[rgba(139,92,246,0.12)]"
          >
            {stats.map((st) => (
              <div key={st.label} className="text-center">
                <div
                  className="gradient-text font-display font-extrabold text-2xl leading-none"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
                >
                  {st.value}
                </div>
                <div
                  className="text-[10px] text-[#555] mt-1.5 tracking-[0.18em] uppercase"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {st.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
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
