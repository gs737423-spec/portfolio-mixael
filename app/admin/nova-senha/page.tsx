'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, Camera, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewPasswordForm {
  password: string
  confirm: string
}

export default function NovaSenhaPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordForm>()

  useEffect(() => {
    // Verifica se há uma sessão válida do link de recuperação
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const onSubmit = async ({ password }: NewPasswordForm) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.error('Erro ao atualizar senha. O link pode ter expirado.')
      return
    }
    setDone(true)
    setTimeout(() => router.push('/admin'), 2500)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
        <div className="text-center flex flex-col items-center gap-4">
          <CheckCircle size={48} className="text-emerald-400" />
          <p className="text-white font-500" style={{ fontFamily: 'var(--font-inter)' }}>
            Senha atualizada! Redirecionando...
          </p>
        </div>
      </div>
    )
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
            Nova senha
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-1" style={{ fontFamily: 'var(--font-inter)' }}>
            Mixel Sevla — Fotografia
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-2xl p-7 border border-[rgba(139,92,246,0.15)] flex flex-col gap-5"
        >
          <div>
            <label
              className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Nova senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                {...register('password', {
                  required: 'Informe a nova senha',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="form-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#A1A1AA] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label
              className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Confirmar senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                {...register('confirm', {
                  required: 'Confirme a senha',
                  validate: (v) => v === watch('password') || 'As senhas não coincidem',
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="form-input pl-10"
              />
            </div>
            {errors.confirm && (
              <span className="text-red-400 text-xs mt-1 block">{errors.confirm.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !ready}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </span>
            ) : (
              'Salvar nova senha'
            )}
          </button>

          {!ready && (
            <p className="text-[#555] text-xs text-center" style={{ fontFamily: 'var(--font-inter)' }}>
              Aguardando verificação do link...
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
