'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function submitHandler(e) {
    e.preventDefault()
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (!res.error) router.push('/')
    else alert(res.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      {/* Floating Emoji Backgrounds */}
      <div className="absolute top-1/4 right-10 text-7xl animate-spin-slow opacity-15 select-none">📚</div>
      <div className="absolute bottom-20 left-20 text-6xl animate-pulse-slower opacity-20 select-none">📝</div>
      <div className="absolute bottom-10 right-5 text-5xl animate-bounce-slower opacity-15 select-none">📖</div>

      {/* Glass Container */}
      <form
        onSubmit={submitHandler}
        className="relative w-full max-w-md p-10 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/30 shadow-2xl dark:bg-gray-900/30 dark:border-gray-700/40 transition-all"
        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
      >
        {/* Additional Floating Circles */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--accent)]/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-12 -right-8 w-48 h-48 bg-[var(--primary)]/30 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-20 right-0 w-24 h-24 bg-[var(--accent)]/20 rounded-full blur-2xl animate-pulse-slowest"></div>

        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-8 text-[var(--text)] text-center drop-shadow-lg">
          Welcome Back <span className="inline-block animate-bounce">👋</span>
        </h2>

        {/* Inputs */}
        <div className="flex flex-col gap-5">
          <input
            className="w-full p-3 rounded-xl border-2 border-[var(--accent)] bg-white/10 placeholder-[var(--text)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shadow-md transition-all"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl border-2 border-[var(--accent)] bg-white/10 placeholder-[var(--text)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shadow-md transition-all"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-[var(--bg)] font-bold text-lg hover:bg-[var(--primary)] transition-all shadow-2xl hover:shadow-3xl flex justify-center items-center gap-2"
          >
            Login <span className="text-xl animate-pulse">📖</span>
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-[var(--text)]/80 text-sm">
          New here?{' '}
          <Link href="/register" className="font-semibold hover:underline text-[var(--accent)]">
            Register
          </Link>
        </p>

        {/* Footer */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[var(--text)]/40 text-xs">
          BookWorm &copy; 2026
        </div>
      </form>
    </div>
  )
}
