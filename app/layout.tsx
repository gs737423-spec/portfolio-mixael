import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lucas Oliveira | Fotografia & Produção Audiovisual',
  description: 'Fotografia e produção audiovisual para marcas, eventos e pessoas. Casamentos, ensaios, eventos corporativos, drone e reels.',
  keywords: ['fotografia', 'videomaker', 'casamento', 'eventos', 'drone', 'São Paulo', 'reels', 'produção audiovisual'],
  openGraph: {
    title: 'Lucas Oliveira | Fotografia & Produção Audiovisual',
    description: 'Transformando momentos em histórias inesquecíveis.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Oliveira | Fotografia & Produção Audiovisual',
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
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-[#050505] text-white font-body antialiased overflow-x-hidden">
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
