'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

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
      setScrolled(y > 60)
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? (y / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Scroll Progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
          scrolled
            ? 'glass-dark border-b border-[rgba(139,92,246,0.12)] py-3'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

          {/* ── Logo — Mixael Sevla ── */}
          <Link href="/" className="relative group flex-shrink-0 flex items-center gap-2.5">
            {/* Monogram */}
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                boxShadow: '0 0 12px rgba(139,92,246,0.4)',
              }}
            >
              <span
                className="text-white text-xs font-bold leading-none"
                style={{ fontFamily: 'var(--font-manrope)', letterSpacing: '-0.02em' }}
              >
                MS
              </span>
            </div>

            {/* Name */}
            <div className="flex flex-col leading-none">
              <span
                className="text-[#A1A1AA] group-hover:text-[#C084FC] transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                }}
              >
                Mixael
              </span>
              <span
                className="text-white group-hover:text-[#C084FC] transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Sevla
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="relative text-sm text-[#A1A1AA] hover:text-white transition-colors duration-300 group"
                style={{ fontFamily: 'var(--font-inter)', fontWeight: 400 }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#8B5CF6] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden md:block flex-shrink-0">
            <button
              onClick={() => handleNav('#contato')}
              className="btn-primary py-2.5 px-5 text-[11px]"
            >
              Solicitar Orçamento
            </button>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#A1A1AA] hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9980] glass-dark pt-20 px-8 flex flex-col"
          >
            <nav className="flex flex-col gap-7 mt-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleNav(link.href)}
                  className="text-3xl font-display font-bold text-white text-left hover:text-[#A855F7] transition-colors tracking-tight"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                onClick={() => handleNav('#contato')}
                className="btn-primary mt-4 w-full justify-center"
              >
                Solicitar Orçamento
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
