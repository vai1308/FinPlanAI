'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  // Detect client-side and read token safely
  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem('access_token')
    setLoggedIn(!!token)
  }, [])

  // If not yet on client, render a static skeleton (no mismatch)
  if (!isClient) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between">
          <div className="font-bold text-lg">FinPlanAI</div>
        </div>
      </nav>
    )
  }

  function logout() {
    localStorage.removeItem('access_token')
    setLoggedIn(false)
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold text-lg">FinPlanAI</Link>
          {loggedIn && (
            <>
              <Link href="/dashboard" className={pathname === '/dashboard' ? 'text-blue-600' : ''}>
                Dashboard
              </Link>
              <Link href="/add" className={pathname === '/add' ? 'text-blue-600' : ''}>
                Add
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {!loggedIn ? (
            <>
              <Link href="/login" className="px-3 py-1">Login</Link>
              <Link href="/register" className="px-3 py-1 bg-green-600 text-white rounded">Register</Link>
            </>
          ) : (
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}
