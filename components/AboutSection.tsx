'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Camera, Film, Award, Users } from 'lucide-react'

const STATS = [
  { icon: Camera, value: '500+', label: 'Projetos' },
  { icon: Film, value: '8+', label: 'Anos' },
  { icon: Users, value: '300+', label: 'Clientes' },
  { icon: Award, value: '12', label: 'Prêmios' },
]

const SKILLS = [
  'Fotografia de Casamentos',
  'Produção Audiovisual',
  'Drone & Aéreo',
  'Reels & Social Media',
  'Eventos Corporativos',
  'Documentários',
  'Color Grading',
  'Motion Graphics',
]

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section
      id="sobre"
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0A0A0A] overflow-hidden"
      aria-label="Sobre mim"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80"
                alt="Lucas Oliveira — Fotógrafo e Videomaker"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Color overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-transparent opacity-[0.08]" />
            </div>

            {/* Decorative border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[rgba(139,92,246,0.4)] via-transparent to-[rgba(139,92,246,0.1)] -z-[1]" />

            {/* Floating experience badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -right-6 glass glow-border rounded-xl p-4 text-center"
            >
              <div
                className="font-display font-800 text-3xl gradient-text"
                style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
              >
                8+
              </div>
              <div
                className="text-[10px] text-[#A1A1AA] tracking-wider uppercase mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Anos de<br />Experiência
              </div>
            </motion.div>

            {/* Decorative dots */}
            <div
              className="absolute -top-4 -left-4 w-24 h-24 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #8B5CF6 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />
          </motion.div>

          {/* Text Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants} className="section-label">
              Sobre Mim
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="section-title"
              style={{ fontFamily: 'var(--font-space-grotesk)' }}
            >
              Cada imagem conta{' '}
              <span className="gradient-text">uma história</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-[#A1A1AA] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Sou Lucas Oliveira, fotógrafo e videomaker apaixonado por capturar a essência dos momentos.
              Com mais de 8 anos de experiência, me especializei em transformar visões criativas em narrativas
              visuais poderosas — de casamentos íntimos a grandes produções corporativas.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-[#A1A1AA] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Meu trabalho vai além da técnica: é sobre conexão genuína com as pessoas e o profundo respeito
              pela singularidade de cada momento. Cada projeto recebe atenção total, do planejamento criativo
              à entrega final.
            </motion.p>

            {/* Skills */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-xs text-[#C084FC] border border-[rgba(139,92,246,0.25)] bg-[rgba(139,92,246,0.08)]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-4 gap-4 pt-6 border-t border-[rgba(139,92,246,0.1)] mt-2"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center group">
                  <Icon
                    size={18}
                    className="mx-auto mb-2 text-[#8B5CF6] group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className="font-display font-800 text-xl text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-[10px] text-[#A1A1AA] mt-1 tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={() => {
                  const el = document.getElementById('contato')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-primary mt-2"
              >
                Vamos conversar
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
