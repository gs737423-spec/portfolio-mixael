'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Camera, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ForgotForm {
  email: string
}

export default function RecuperarSenhaPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>()

  const onSubmit = async ({ email }: ForgotForm) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/nova-senha`,
    })
    if (error) {
      toast.error('Erro ao enviar e-mail. Verifique o endereço e tente novamente.')
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6] opacity-[0.05] blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] mb-4">
            <Camera size={24} color="white" />
          </div>
          <h1
            className="text-xl font-800 text-white"
            style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800 }}
          >
            Recuperar senha
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Mixael Sevla — Fotografia
          </p>
        </div>

        {sent ? (
          <div className="glass rounded-2xl p-7 border border-[rgba(139,92,246,0.15)] flex flex-col items-center gap-4 text-center">
            <CheckCircle size={40} className="text-emerald-400" />
            <div>
              <p className="text-white font-500 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                E-mail enviado!
              </p>
              <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
            <Link
              href="/admin/login"
              className="flex items-center gap-2 text-[#8B5CF6] text-sm hover:text-[#C084FC] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <ArrowLeft size={14} />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="glass rounded-2xl p-7 border border-[rgba(139,92,246,0.15)] flex flex-col gap-5"
          >
            <p className="text-[#A1A1AA] text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              Informe o e-mail da sua conta e enviaremos um link para redefinir a senha.
            </p>

            <div>
              <label
                className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
                <input
                  {...register('email', { required: 'Informe o e-mail' })}
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="form-input pl-10"
                />
              </div>
              {errors.email && (
                <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
                'Enviar link de recuperação'
              )}
            </button>

            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-2 text-[#555] text-xs hover:text-[#A1A1AA] transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <ArrowLeft size={12} />
              Voltar para o login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
