export default function BackgroundScene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Orb 1 — grande, canto superior direito, roxo quente */}
      <div className="lux-orb lux-orb-1" />

      {/* Orb 2 — médio, canto inferior esquerdo, violeta profundo */}
      <div className="lux-orb lux-orb-2" />

      {/* Orb 3 — pequeno, centro-direita, luz chave de estúdio */}
      <div className="lux-orb lux-orb-3" />

      {/* Raio de luz diagonal — fresnel de estúdio */}
      <div className="lux-ray" />

      {/* Vinheta fotográfica — escurece bordas como lente de câmera */}
      <div className="lux-vignette" />

      {/* Luz central respirando — sensação cinematográfica */}
      <div className="lux-breath" />
    </div>
  )
}
