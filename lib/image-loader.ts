export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const params = new URLSearchParams({ url: src, w: String(width), q: String(quality ?? 75) })
  return `/api/resize?${params.toString()}`
}
