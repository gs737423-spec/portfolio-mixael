import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/r2'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { fileName, contentType, folder } = await req.json()
    if (!fileName) return NextResponse.json({ error: 'fileName obrigatório' }, { status: 400 })

    const ext = fileName.split('.').pop()
    const key = `${folder || 'uploads'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

    const presignedUrl = await getPresignedUploadUrl(key, contentType || 'application/octet-stream')

    return NextResponse.json({ presignedUrl, publicUrl })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
