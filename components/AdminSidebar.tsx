'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import {
  FolderOpen, User, Settings,
  ExternalLink, LogOut, Camera, Menu, X,
  Image, MessageSquare, Search,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Projetos', icon: FolderOpen, exact: true },
  { href: '/admin/midia', label: 'Mídia', icon: Image },
  { href: '/admin/orcamentos', label: 'Orçamentos', icon: MessageSquare },
  { href: '/admin/sobre', label: 'Sobre', icon: User },
  { href: '/admin/seo', label: 'SEO', icon: Search },
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
      <div className="px-5 py-6 border-b border-[rgba(139,92,246,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Camera size={17} color="white" />
          </div>
          <div>
            <p
              className="text-white text-sm font-700 leading-none"
              style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
            >
              Mixael Sevla
            </p>
            <p
              className="text-[#555] text-[10px] mt-0.5 tracking-wide"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Painel Admin
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                active
                  ? 'bg-[rgba(139,92,246,0.15)] text-white border border-[rgba(139,92,246,0.3)] shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
              }`}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <Icon
                size={16}
                className={active ? 'text-[#8B5CF6]' : 'text-[#555]'}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-[rgba(139,92,246,0.1)] flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <ExternalLink size={16} className="text-[#555]" />
          Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A1A1AA] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-all duration-200 w-full"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <LogOut size={16} className="text-[#555]" />
          Sair
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 flex-col bg-[#0d0d0d] border-r border-[rgba(139,92,246,0.08)] sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-[#0d0d0d] border-r border-[rgba(139,92,246,0.08)] z-50 transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[rgba(139,92,246,0.08)] bg-[#0d0d0d] sticky top-0 z-30">
          <button
            onClick={() => setOpen(true)}
            className="text-[#A1A1AA] hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center">
              <Camera size={12} color="white" />
            </div>
            <span
              className="text-white text-sm font-700"
              style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700 }}
            >
              Admin
            </span>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
