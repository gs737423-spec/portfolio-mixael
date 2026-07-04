'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

export default function VideoPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.preload = 'metadata'
    video.src = src

    const handleLoaded = () => { video.currentTime = 0.5 }
    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          setThumb(canvas.toDataURL('image/jpeg', 0.7))
        }
      } catch {}
      video.remove()
    }

    video.addEventListener('loadedmetadata', handleLoaded)
    video.addEventListener('seeked', handleSeeked)
    video.load()

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded)
      video.removeEventListener('seeked', handleSeeked)
      video.remove()
    }
  }, [src])

  const handlePlay = () => {
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 100)
  }

  if (playing) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden border border-[rgba(139,92,246,0.15)] bg-black">
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          preload="auto"
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  return (
    <button
      onClick={handlePlay}
      className="relative aspect-video rounded-xl overflow-hidden border border-[rgba(139,92,246,0.15)] bg-black w-full cursor-pointer group"
    >
      {thumb ? (
        <img src={thumb} alt="Video" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d]" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>
    </button>
  )
}
