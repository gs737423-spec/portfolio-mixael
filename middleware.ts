import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicAdminPath =
    pathname === '/admin/login' ||
    pathname === '/admin/recuperar-senha' ||
    pathname === '/admin/nova-senha'

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  // Cookie de sessão criado pelo Supabase Auth no browser (formato sb-<ref>-auth-token)
  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (!isPublicAdminPath && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isPublicAdminPath && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
