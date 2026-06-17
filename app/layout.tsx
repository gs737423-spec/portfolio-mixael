import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

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
  title: 'Mixelsevla | Fotografia & Produção Audiovisual',
  description: 'Fotografia e produção audiovisual para marcas, eventos e pessoas. Casamentos, ensaios, eventos corporativos, drone e reels.',
  keywords: ['fotografia', 'videomaker', 'casamento', 'eventos', 'drone', 'São Paulo', 'reels', 'produção audiovisual'],
  openGraph: {
    title: 'Mixelsevla | Fotografia & Produção Audiovisual',
    description: 'Transformando momentos em histórias inesquecíveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mixelsevla | Fotografia & Produção Audiovisual',
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
        {children}
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
