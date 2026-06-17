'use client'

import { useEffect, useRef } from 'react'

interface Bokeh {
  x: number; y: number
  r: number
  vx: number; vy: number
  hue: number
  alpha: number
  phase: number
}

export default function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respeita prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf: number
    let t = 0
    let bokeh: Bokeh[] = []

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      bokeh = Array.from({ length: 10 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 140 + Math.random() * 220,       // 140-360px
        vx: (Math.random() - 0.5) * 0.14,   // muito lento
        vy: (Math.random() - 0.5) * 0.14,
        hue: 258 + Math.random() * 32,       // roxo 258-290
        alpha: 0.08 + Math.random() * 0.10,  // 8-18%
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const drawFrame = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      if (!reduced) t += 0.003

      for (const p of bokeh) {
        if (!reduced) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < -p.r) p.x = W + p.r
          if (p.x > W + p.r) p.x = -p.r
          if (p.y < -p.r) p.y = H + p.r
          if (p.y > H + p.r) p.y = -p.r
        }

        const pulse = reduced ? 1 : 1 + 0.10 * Math.sin(t + p.phase)
        const a = reduced ? p.alpha : p.alpha * (0.85 + 0.15 * Math.cos(t * 0.6 + p.phase))
        const r = p.r * pulse

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        g.addColorStop(0,   `hsla(${p.hue}, 78%, 62%, ${a})`)
        g.addColorStop(0.4, `hsla(${p.hue}, 70%, 50%, ${a * 0.45})`)
        g.addColorStop(1,   `hsla(${p.hue}, 65%, 40%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, 2 * Math.PI)
        ctx.fillStyle = g
        ctx.fill()
      }

      if (!reduced) {
        raf = requestAnimationFrame(drawFrame)
      }
    }

    const onResize = () => { init(); if (!reduced) return; drawFrame() }

    init()
    drawFrame()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      {/* Canvas: bokeh particles animadas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',   // partículas ADITIVAS sobre o preto
        }}
      />

      {/* SVG: geometria de abertura de câmera — linhas de difração */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Anéis de abertura (iris diaphragm) */}
        <circle cx="720" cy="450" r="420" fill="none" stroke="#8B5CF6" strokeWidth="0.6" opacity="0.06" />
        <circle cx="720" cy="450" r="300" fill="none" stroke="#7C3AED" strokeWidth="0.4" opacity="0.045" />
        <circle cx="720" cy="450" r="620" fill="none" stroke="#A855F7" strokeWidth="0.4" opacity="0.03" />
        <circle cx="720" cy="450" r="180" fill="none" stroke="#6D28D9" strokeWidth="0.3" opacity="0.035" />

        {/* Lâminas de iris (aperture blades) — 6 lâminas */}
        <line x1="720" y1="30"  x2="720" y2="870" stroke="#8B5CF6" strokeWidth="0.3" opacity="0.025" />
        <line x1="356" y1="240" x2="1084" y2="660" stroke="#8B5CF6" strokeWidth="0.3" opacity="0.025" />
        <line x1="356" y1="660" x2="1084" y2="240" stroke="#8B5CF6" strokeWidth="0.3" opacity="0.025" />

        {/* Raios de luz cruzando a cena (lens streak artifacts) */}
        <line x1="0"    y1="185" x2="1440" y2="390" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.04" />
        <line x1="1440" y1="90"  x2="0"    y2="680" stroke="#7C3AED" strokeWidth="0.4" opacity="0.03" />
        <line x1="210"  y1="0"   x2="940"  y2="900" stroke="#A855F7" strokeWidth="0.35" opacity="0.025" />

        {/* Ponto de foco central — aura */}
        <circle cx="720" cy="450" r="2" fill="#A855F7" opacity="0.12" />
        <circle cx="720" cy="450" r="8" fill="none" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.08" />
        <circle cx="720" cy="450" r="20" fill="none" stroke="#7C3AED" strokeWidth="0.3" opacity="0.05" />
      </svg>
    </>
  )
}
