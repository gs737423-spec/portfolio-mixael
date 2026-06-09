import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getPublicImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('portfolio').getPublicUrl(path)
  return data.publicUrl
}
