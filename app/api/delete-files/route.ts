import { NextRequest, NextResponse } from 'next/server'
import { deleteManyFromR2 } from '@/lib/r2'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { urls } = await req.json()
    if (!urls || !Array.isArray(urls)) return NextResponse.json({ error: 'urls obrigatório' }, { status: 400 })

    await deleteManyFromR2(urls)
    return NextResponse.json({ deleted: urls.length })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
