import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Play } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Client, ClientMedia, Project } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ClientePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: clientData } = await supabase
    .from('clients').select('*').eq('slug', slug).eq('active', true).single()

  if (!clientData) notFound()

  const client = clientData as Client

  const [{ data: projs }, { data: media }] = await Promise.all([
    supabase.from('projects').select('*').eq('client_id', client.id).eq('published', true).order('display_order'),
    supabase.from('client_media').select('*').eq('client_id', client.id).order('display_order'),
  ])

  const projects = (projs ?? []) as Project[]
  const reels = ((media ?? []) as ClientMedia[]).filter(m => m.type === 'reel')
  const institutionalVideos = ((media ?? []) as ClientMedia[]).filter(m => m.type === 'video')

  const hasContent = projects.length > 0 || reels.length > 0 || institutionalVideos.length > 0

  return (
    <main className="min-h-screen">
      {/* Back nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <Link href="/#portfolio" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white text-sm transition-colors">
          <ArrowLeft size={15} />
          Voltar ao portfólio
        </Link>
      </div>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6">
        {client.cover_image && (
          <div className="absolute inset-0 overflow-hidden">
            <Image src={client.cover_image} alt={client.name} fill className="object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/60 via-[#060608]/80 to-[#060608]" />
          </div>
        )}
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-block text-xs text-[#8B5CF6] uppercase tracking-widest mb-4 px-3 py-1 rounded-full border border-[rgba(139,92,246,0.3)]">
            Cliente
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-sora)', letterSpacing: '-0.03em' }}>
            {client.name}
          </h1>
          {client.description && (
            <p className="text-[#71717A] text-lg max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
              {client.description}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-24 flex flex-col gap-20">

        {/* ── Fotos ── */}
        {projects.length > 0 && (
          <section>
            <SectionHeader title="Fotos" subtitle="Projetos fotográficos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map(p => (
                <Link key={p.id} href={`/portfolio/${p.slug}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] hover:border-[rgba(139,92,246,0.3)] transition-all">
                  {p.cover_image ? (
                    <Image src={p.cover_image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-[#111]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <span className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
                      {p.title}
                    </span>
                    <ArrowUpRight size={16} className="text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Reels ── */}
        {reels.length > 0 && (
          <section>
            <SectionHeader title="Reels" subtitle="Conteúdo em vídeo curto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reels.map(r => (
                <div key={r.id} className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
                  {r.video_url ? (
                    <div className="aspect-video bg-black">
                      <video
                        src={r.video_url}
                        poster={r.thumbnail ?? undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#111] flex items-center justify-center">
                      <Play size={32} className="text-[#333]" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>{r.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Vídeos Institucionais ── */}
        {institutionalVideos.length > 0 && (
          <section>
            <SectionHeader title="Vídeos Institucionais" subtitle="Produção audiovisual" />
            <div className="flex flex-col gap-4">
              {institutionalVideos.map(v => (
                <div key={v.id} className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
                  {v.video_url ? (
                    <div className="aspect-video bg-black">
                      <video
                        src={v.video_url}
                        poster={v.thumbnail ?? undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-[#111] flex items-center justify-center">
                      <Play size={32} className="text-[#333]" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-sora)' }}>{v.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hasContent && (
          <div className="text-center py-20 text-[#555]">
            Nenhum conteúdo publicado ainda.
          </div>
        )}
      </div>
    </main>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end gap-4 mb-6">
      <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-sora)', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <span className="text-[#555] text-sm pb-0.5" style={{ fontFamily: 'var(--font-inter)' }}>
        {subtitle}
      </span>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
    </div>
  )
}
