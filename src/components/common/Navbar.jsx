'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <nav className="w-full bg-(--primary) text-(--bg) px-4 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-extrabold">BookWorm</h1>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-semibold">
          <button className="hover:text-(--accent)">Dashboard</button>
          <button className="hover:text-(--accent)">Browse</button>
          <button className="hover:text-(--accent)">My Library</button>
          <button className="hover:text-(--accent)">Tutorials</button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block hover:text-(--accent) font-semibold"
          >
            Login
          </Link>

          <button
            onClick={() => setDark(!dark)}
            className="bg-(--accent) text-(--text) px-3 py-1 rounded-lg"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 bg-(--primary) rounded-lg p-4 space-y-3 text-sm">
          <button className="block w-full text-left hover:text-(--accent)">
            Dashboard
          </button>
          <button className="block w-full text-left hover:text-(--accent)">
            Browse Books
          </button>
          <button className="block w-full text-left hover:text-(--accent)">
            My Library
          </button>
          <button className="block w-full text-left hover:text-(--accent)">
            Tutorials
          </button>
          <Link
            href="/login"
            className="block w-full text-left hover:text-(--accent) font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  )
}
