'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import {
  FolderOpen, User, Settings,
  ExternalLink, LogOut, Menu, X,
  Image, MessageSquare, Search, Tag, ArrowUpRight,
} from 'lucide-react'

const NAV = [
  { href: '/admin',               label: 'Projetos',      icon: FolderOpen,    exact: true },
  { href: '/admin/categorias',    label: 'Categorias',    icon: Tag },
  { href: '/admin/midia',         label: 'Mídia',         icon: Image },
  { href: '/admin/orcamentos',    label: 'Orçamentos',    icon: MessageSquare },
  { href: '/admin/sobre',         label: 'Sobre',         icon: User },
  { href: '/admin/seo',           label: 'SEO',           icon: Search },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

const AUTH_PATHS = ['/admin/login', '/admin/recuperar-senha', '/admin/nova-senha']

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (AUTH_PATHS.includes(pathname)) return <>{children}</>

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/admin/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[rgba(139,92,246,0.08)]">
        <Link href="/admin" className="flex flex-col gap-0.5 group">
          <span
            className="text-white group-hover:text-[#C4B5FD] transition-colors duration-200 leading-none"
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.01em',
            }}
          >
            Mixelsevla
          </span>
          <span
            className="text-[#444]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 400,
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Área Administrativa
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                active
                  ? 'text-white'
                  : 'text-[#555] hover:text-[#A1A1AA]'
              }`}
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: active ? 500 : 400 }}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#8B5CF6] rounded-full" />
              )}
              {/* Background */}
              <span className={`absolute inset-0 rounded-lg transition-colors duration-200 ${
                active
                  ? 'bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.15)]'
                  : 'group-hover:bg-[rgba(255,255,255,0.03)]'
              }`} />
              <Icon
                size={15}
                className={`relative z-10 flex-shrink-0 transition-colors ${active ? 'text-[#8B5CF6]' : 'text-[#444] group-hover:text-[#666]'}`}
              />
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-[rgba(255,255,255,0.04)] flex flex-col gap-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#444] hover:text-[#A1A1AA] hover:bg-[rgba(255,255,255,0.03)] transition-all duration-200 group"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          <ArrowUpRight size={15} className="group-hover:text-[#8B5CF6] transition-colors" />
          Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#444] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-all duration-200 w-full"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: 'transparent' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-56 flex-shrink-0 flex-col sticky top-0 h-screen"
        style={{
          background: 'rgba(5,5,5,0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(139,92,246,0.07)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 z-50 transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(139,92,246,0.08)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{
            background: 'rgba(5,5,5,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(139,92,246,0.07)',
          }}
        >
          <button
            onClick={() => setOpen(true)}
            className="text-[#555] hover:text-white transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>
          <span
            className="text-white text-sm"
            style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 600 }}
          >
            Mixelsevla
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
