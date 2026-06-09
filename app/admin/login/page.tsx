'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface LoginForm {
  email: string
  password: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  const onSubmit = async ({ email, password }: LoginForm) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('E-mail ou senha incorretos.')
      return
    }
    toast.success('Bem-vindo!')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#080808]">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8B5CF6] opacity-[0.05] blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] mb-4">
            <Camera size={24} color="white" />
          </div>
          <h1
            className="text-xl font-800 text-white"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 800 }}
          >
            Área Administrativa
          </h1>
          <p
            className="text-[#A1A1AA] text-sm mt-1"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Mixael Sevla — Fotografia
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-2xl p-7 border border-[rgba(139,92,246,0.15)] flex flex-col gap-5"
        >
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

          <div>
            <label
              className="block text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
              <input
                {...register('password', { required: 'Informe a senha' })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
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
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p
          className="text-center text-[#333] text-xs mt-6"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Acesso restrito ao administrador
        </p>
      </div>
    </div>
  )
}
