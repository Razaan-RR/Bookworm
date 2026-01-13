'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession() // NextAuth session

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  // Links for Admin vs User
  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Manage Books', href: '/admin/books' },
    { name: 'Manage Genres', href: '/admin/genres' },
    { name: 'Manage Users', href: '/admin/users' },
    { name: 'Moderate Reviews', href: '/admin/reviews' },
    { name: 'Manage Tutorials', href: '/admin/tutorials' },
  ]

  const userLinks = [
    { name: 'Dashboard', href: 'user/dashboard' },
    { name: 'Browse', href: 'user/browse' },
    { name: 'My Library', href: 'user/library' },
    { name: 'Tutorials', href: 'user/tutorials' },
  ]

  const links = session?.user?.role === 'admin' ? adminLinks : userLinks

  return (
    <nav className="w-full bg-(--primary) text-(--bg) px-4 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h1 className="text-xl font-extrabold">BookWorm</h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-sm font-semibold">
          {links.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-(--accent)">
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link
                href="/login"
                className="hidden md:block hover:text-(--accent) font-semibold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden md:block hover:text-(--accent) font-semibold"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Image
                src={session.user.image || '/default-avatar.png'}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full object-cover border"
              />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="hidden md:block hover:text-(--accent) font-semibold"
              >
                Logout
              </button>
            </>
          )}

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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-(--primary) rounded-lg p-4 space-y-3 text-sm">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block w-full text-left hover:text-(--accent)"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {!session ? (
            <>
              <Link
                href="/login"
                className="block w-full text-left hover:text-(--accent) font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full text-left hover:text-(--accent) font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                signOut({ callbackUrl: '/login' })
                setMenuOpen(false)
              }}
              className="block w-full text-left hover:text-(--accent) font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
