import { NextRequest } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'

const ALLOWED_HOSTS = [
  'pub-9c9ec03fb08944f5ae80942c706926e6.r2.dev',
  'images.unsplash.com',
  'randomuser.me',
]

function isAllowedHost(hostname: string) {
  return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const src = searchParams.get('url')
  const width = Math.min(Math.max(parseInt(searchParams.get('w') ?? '800', 10) || 800, 16), 2048)
  const quality = Math.min(Math.max(parseInt(searchParams.get('q') ?? '75', 10) || 75, 1), 100)

  if (!src) return new Response('Missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(src)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }

  if (!isAllowedHost(parsed.hostname)) {
    return new Response('Host not allowed', { status: 403 })
  }

  const upstream = await fetch(parsed.toString())
  if (!upstream.ok) {
    return new Response('Upstream fetch failed', { status: 502 })
  }
  const buffer = Buffer.from(await upstream.arrayBuffer())

  try {
    const resized = await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()

    return new Response(new Uint8Array(resized), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    // Não é imagem válida ou sharp falhou — serve original sem transformar
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }
}
