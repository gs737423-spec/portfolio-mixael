'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Send, Instagram, Mail, MessageCircle, Phone } from 'lucide-react'
import type { ContactFormData } from '@/lib/types'

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    // Abre WhatsApp com a mensagem preenchida como fallback confiável
    // (substitua pela sua integração de e-mail preferida: Resend, EmailJS, Formspree, etc.)
    const text = encodeURIComponent(
      `Olá Lucas! Sou ${data.name}.\n\nTelefone: ${data.phone}\nE-mail: ${data.email}\n\n${data.message}`
    )
    const url = `https://wa.me/5511999990000?text=${text}`
    window.open(url, '_blank')
    toast.success('Redirecionando para o WhatsApp!')
    reset()
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section
      id="contato"
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0A0A0A] overflow-hidden"
      aria-label="Contato"
    >
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#8B5CF6] opacity-[0.05] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div>
              <div className="section-label mb-4">Contato</div>
              <h2
                className="section-title"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Vamos criar algo{' '}
                <span className="gradient-text">incrível</span>{' '}
                juntos.
              </h2>
            </div>

            <p
              className="text-[#A1A1AA] leading-relaxed text-base"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Tem um projeto em mente? Quer saber mais sobre meus serviços ou solicitar um orçamento?
              Adoraria ouvir sobre o seu projeto e como posso ajudá-lo a contar sua história.
            </p>

            {/* Contact info */}
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  value: '+55 (11) 99999-0000',
                  href: 'https://wa.me/5511999990000',
                  color: '#25D366',
                },
                {
                  icon: Mail,
                  label: 'E-mail',
                  value: 'contato@lucasoliveira.com',
                  href: 'mailto:contato@lucasoliveira.com',
                  color: '#8B5CF6',
                },
                {
                  icon: Instagram,
                  label: 'Instagram',
                  value: '@lucasoliveira.foto',
                  href: 'https://instagram.com/lucasoliveira.foto',
                  color: '#E1306C',
                },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl glass border border-[rgba(139,92,246,0.1)] hover:border-[rgba(139,92,246,0.3)] transition-all duration-300 hover:bg-[rgba(139,92,246,0.05)]"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${color}22`, color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <div
                      className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-0.5"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-white text-sm group-hover:text-[#C084FC] transition-colors"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social proof */}
            <div className="p-5 rounded-xl glass-light">
              <div
                className="text-[#A1A1AA] text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                ⚡ Respondo em até <strong className="text-white">2 horas</strong> em horário comercial.
                Para eventos urgentes, entre em contato via WhatsApp.
              </div>
            </div>
          </motion.div>

          {/* Right column — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass rounded-2xl p-8 border border-[rgba(139,92,246,0.15)] flex flex-col gap-5"
            >
              <div>
                <label
                  className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Nome completo
                </label>
                <input
                  {...register('name', { required: 'Informe seu nome' })}
                  type="text"
                  placeholder="Seu nome"
                  className="form-input"
                  autoComplete="name"
                />
                {errors.name && (
                  <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: 'var(--font-inter)' }}>
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Telefone
                  </label>
                  <input
                    {...register('phone', { required: 'Informe seu telefone' })}
                    type="tel"
                    placeholder="(11) 99999-0000"
                    className="form-input"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: 'var(--font-inter)' }}>
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    E-mail
                  </label>
                  <input
                    {...register('email', {
                      required: 'Informe seu e-mail',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
                    })}
                    type="email"
                    placeholder="seu@email.com"
                    className="form-input"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: 'var(--font-inter)' }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Mensagem
                </label>
                <textarea
                  {...register('message', { required: 'Escreva uma mensagem' })}
                  placeholder="Conte sobre seu projeto — data, local, tipo de cobertura..."
                  rows={5}
                  className="form-input resize-none"
                />
                {errors.message && (
                  <span className="text-red-400 text-xs mt-1 block" style={{ fontFamily: 'var(--font-inter)' }}>
                    {errors.message.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <Send size={14} />
                    Solicitar Orçamento
                  </>
                )}
              </button>

              <p
                className="text-center text-[11px] text-[#555]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Seus dados estão seguros. Sem spam, nunca.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
