'use client'

import { useState, useRef, useEffect } from 'react'
import { Play } from 'lucide-react'

export default function VideoThumb({ src, className = '' }: { src: string; className?: string }) {
  const [thumb, setThumb] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.preload = 'metadata'
    video.src = src

    const handleLoaded = () => {
      video.currentTime = 0.5
    }

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 320
        canvas.height = video.videoHeight || 180
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          setThumb(canvas.toDataURL('image/jpeg', 0.7))
        }
      } catch {
        // CORS may block canvas - fall back to gradient
      }
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

  return (
    <div className={`relative ${className}`}>
      {thumb ? (
        <img src={thumb} alt="Thumbnail" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
          <Play size={18} className="text-white ml-0.5" />
        </div>
      </div>
    </div>
  )
}
