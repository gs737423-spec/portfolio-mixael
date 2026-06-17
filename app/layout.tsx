import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const BackgroundScene = dynamic(() => import('@/components/BackgroundScene'), { ssr: false })

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mixael Sevla | Fotografia & Produção Audiovisual',
  description: 'Fotografia e produção audiovisual para marcas, eventos e pessoas. Casamentos, ensaios, eventos corporativos, drone e reels.',
  keywords: ['fotografia', 'videomaker', 'casamento', 'eventos', 'drone', 'São Paulo', 'reels', 'produção audiovisual'],
  openGraph: {
    title: 'Mixael Sevla | Fotografia & Produção Audiovisual',
    description: 'Transformando momentos em histórias inesquecíveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mixael Sevla | Fotografia & Produção Audiovisual',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <body className="lux-body text-white font-body antialiased overflow-x-hidden">
        <div className="grain-overlay" aria-hidden="true" />
        {/* Background scene: z-index 0, content wrapper: z-index 1 */}
        <BackgroundScene />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(139,92,246,0.3)',
              fontFamily: 'var(--font-inter)',
            },
            success: {
              iconTheme: { primary: '#8B5CF6', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}
