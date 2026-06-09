'use client'

import Link from 'next/link'
import { Instagram, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#050505] border-t border-[rgba(139,92,246,0.1)]">
      {/* Top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.4)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                style={{ background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', fontFamily: 'var(--font-space-grotesk)' }}
              >
                MS
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[#A1A1AA]"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 300, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}
                >
                  Mixael
                </span>
                <span
                  className="text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em' }}
                >
                  Sevla
                </span>
              </div>
            </div>
            <span
              className="text-[#444] text-[10px] tracking-[0.22em] uppercase"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Fotografia & Produção Audiovisual
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { href: 'https://instagram.com/lucasoliveira.foto', icon: Instagram, label: 'Instagram', color: '#E1306C' },
              { href: 'https://wa.me/5511999990000', icon: MessageCircle, label: 'WhatsApp', color: '#25D366' },
              { href: 'mailto:contato@lucasoliveira.com', icon: Mail, label: 'E-mail', color: '#8B5CF6' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full glass border border-[rgba(139,92,246,0.15)] flex items-center justify-center text-[#A1A1AA] hover:text-[#C084FC] hover:border-[rgba(139,92,246,0.5)] hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-110"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[#555] text-xs text-center md:text-right"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            © {year} Mixael Sevla. Todos os direitos reservados.
            <br />
            <Link href="/admin" className="text-[#333] hover:text-[#8B5CF6] transition-colors">
              Área restrita
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
