'use client'

import Link from 'next/link'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

export default function Footer({ settings }: { settings?: SiteSettings }) {
  const s = settings ?? DEFAULT_SETTINGS
  const year = new Date().getFullYear()

  return (
    <footer className="relative  overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.35)] to-transparent" />

      {/* Ambient orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#8B5CF6] opacity-[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Main footer row */}
        <div className="py-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-10">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex flex-col gap-1">
              <span
                className="text-white leading-none"
                style={{
                  fontFamily: 'var(--font-sora), Sora, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  letterSpacing: '-0.02em',
                }}
              >
                Mixel Sevla
              </span>
              <span
                className="text-[#555]"
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {s.footer_tagline || 'Fotógrafo e Videomaker'}
              </span>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: s.instagram_url, icon: Instagram, label: 'Instagram' },
              { href: `https://wa.me/${s.whatsapp}`, icon: MessageCircle, label: 'WhatsApp' },
              { href: `mailto:${s.email}`, icon: Mail, label: 'E-mail' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-xl border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#555] hover:text-white hover:border-[rgba(139,92,246,0.4)] transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-[#444] text-center md:text-right"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '12px',
              lineHeight: 1.7,
            }}
          >
            © {year} Mixel Sevla.{' '}
            <span className="text-[#333]">Todos os direitos reservados.</span>
            <br />
            <Link
              href="/admin"
              className="text-[#2a2a2a] hover:text-[#8B5CF6] transition-colors duration-200"
            >
              Área restrita
            </Link>
          </p>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-[rgba(255,255,255,0.04)] py-4">
          <p
            className="text-center text-[#2a2a2a]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Feito com cuidado · São Paulo, Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
