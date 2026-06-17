'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? (y / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    setTimeout(() => {
      const id = href.replace('#', '')
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, mobileOpen ? 300 : 0)
  }

  return (
    <>
      {/* Scroll Progress */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[9990]"
      >
        {/* Glass backdrop */}
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-[rgba(5,5,5,0.85)] backdrop-blur-2xl border-b border-[rgba(139,92,246,0.1)] shadow-[0_1px_40px_rgba(0,0,0,0.6)]'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-[70px]">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="relative group flex items-center gap-3 flex-shrink-0"
              aria-label="Mixael Sevla — página inicial"
            >
              {/* Name */}
              <div className="flex flex-col leading-none gap-0.5">
                <span
                  className="text-white group-hover:text-[#C4B5FD] transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontWeight: 700,
                    fontSize: '17px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  Mixael Sevla
                </span>
                <span
                  className="text-[#555] group-hover:text-[#A78BFA] transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  Fotógrafo
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="relative px-4 py-2.5 group cursor-pointer"
                  style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                  <span
                    className="relative z-10 text-[#A1A1AA] group-hover:text-white transition-colors duration-250"
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 450,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Hover pill */}
                  <span className="absolute inset-0 rounded-md bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-250" />
                  {/* Underline */}
                  <span className="absolute bottom-1.5 left-4 right-4 h-px bg-[#8B5CF6] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              ))}
            </nav>

            {/* ── CTA + Mobile toggle ── */}
            <div className="flex items-center gap-3">
              {/* CTA — desktop */}
              <button
                onClick={() => handleNav('#contato')}
                className="hidden md:flex items-center gap-1.5 group cursor-pointer"
                style={{
                  padding: '9px 18px',
                  border: '1px solid rgba(139,92,246,0.45)',
                  borderRadius: '6px',
                  background: 'rgba(139,92,246,0.06)',
                  transition: 'all 0.25s ease',
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#C4B5FD',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(139,92,246,0.18)'
                  el.style.borderColor = 'rgba(139,92,246,0.7)'
                  el.style.color = '#fff'
                  el.style.boxShadow = '0 0 20px rgba(139,92,246,0.25)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(139,92,246,0.06)'
                  el.style.borderColor = 'rgba(139,92,246,0.45)'
                  el.style.color = '#C4B5FD'
                  el.style.boxShadow = 'none'
                }}
              >
                Orçamento
                <ArrowUpRight size={13} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-[#A1A1AA] hover:text-white transition-colors rounded-lg hover:bg-white/5"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                  >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[9970] bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[9980] w-[min(320px,85vw)] flex flex-col"
              style={{
                background: 'rgba(8,8,8,0.97)',
                borderLeft: '1px solid rgba(139,92,246,0.12)',
                backdropFilter: 'blur(40px)',
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[rgba(139,92,246,0.1)]">
                <span
                  className="text-[#555]"
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-white transition-colors rounded-md hover:bg-white/5"
                  aria-label="Fechar"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                    onClick={() => handleNav(link.href)}
                    className="text-left group py-4 border-b border-[rgba(255,255,255,0.04)] cursor-pointer"
                  >
                    <span
                      className="text-white group-hover:text-[#A78BFA] transition-colors duration-200"
                      style={{
                        fontFamily: 'var(--font-sora), Sora, sans-serif',
                        fontSize: '26px',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        display: 'block',
                      }}
                    >
                      {link.label}
                    </span>
                  </motion.button>
                ))}

                {/* CTA mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + navLinks.length * 0.06 + 0.05, duration: 0.4 }}
                  className="mt-6"
                >
                  <button
                    onClick={() => handleNav('#contato')}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      padding: '14px 24px',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                      borderRadius: '8px',
                      border: 'none',
                      fontFamily: 'var(--font-sora), Sora, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      boxShadow: '0 4px 24px rgba(139,92,246,0.4)',
                    }}
                  >
                    Solicitar Orçamento
                    <ArrowUpRight size={14} />
                  </button>
                </motion.div>
              </nav>

              {/* Footer */}
              <div className="px-8 pb-8 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                <p
                  className="text-[#444]"
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                  }}
                >
                  © 2025 Mixael Sevla
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
