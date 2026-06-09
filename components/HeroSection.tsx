'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'

const WORDS = ['momentos', 'histórias', 'emoções', 'memórias']

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const wordIndexRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // Animated rotating word
  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    let idx = 0
    const rotate = () => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      setTimeout(() => {
        idx = (idx + 1) % WORDS.length
        el.textContent = WORDS[idx]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 300)
    }
    const interval = setInterval(rotate, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = () => {
    const el = document.getElementById('portfolio')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.4 },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
      aria-label="Hero"
    >
      {/* Background Video / Gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale }}
      >
        {/* Gradient animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#080510] to-[#050505]" />

        {/* Orb glow effects */}
        <motion.div
          className="orb w-[600px] h-[600px] bg-[#8B5CF6] top-[-200px] left-[-150px] opacity-10"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb w-[500px] h-[500px] bg-[#A855F7] bottom-[-100px] right-[-100px] opacity-8"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="orb w-[300px] h-[300px] bg-[#C084FC] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #050505 100%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-50" />
      </motion.div>

      {/* Letterbox effect */}
      <div className="letterbox-top" />
      <div className="letterbox-bottom" />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Label */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
            <span
              className="text-[11px] font-600 tracking-[0.3em] uppercase text-[#8B5CF6]"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Fotografia & Produção Audiovisual
            </span>
            <div className="w-8 h-[1px] bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-800 leading-[1.05] tracking-tight text-center"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            }}
          >
            Transformando{' '}
            <span className="gradient-text glow-text inline-block">
              <span
                ref={wordRef}
                className="inline-block transition-all"
                style={{ minWidth: 'clamp(120px, 30vw, 280px)' }}
              >
                momentos
              </span>
            </span>
            <br />
            em histórias{' '}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: '1px rgba(139,92,246,0.6)',
                WebkitTextFillColor: 'transparent',
              }}
            >
              inesquecíveis
            </span>
            <span className="gradient-text">.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[#A1A1AA] text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Fotografia e produção audiovisual para marcas, eventos e pessoas.
            <br />
            <span className="text-white/60 text-sm">São Paulo, Brasil</span>
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            <button
              onClick={() => handleScroll()}
              className="btn-primary group"
            >
              <Play size={14} className="group-hover:scale-110 transition-transform" />
              Ver Portfólio
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('contato')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-outline"
            >
              Solicitar Orçamento
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-8 mt-6 pt-8 border-t border-[rgba(139,92,246,0.1)]"
          >
            {[
              { value: '500+', label: 'Projetos realizados' },
              { value: '8', label: 'Anos de experiência' },
              { value: '300+', label: 'Clientes satisfeitos' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-display font-800 text-2xl gradient-text"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[11px] text-[#A1A1AA] mt-1 tracking-wide uppercase"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={handleScroll}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors group"
        aria-label="Rolar para baixo"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  )
}
