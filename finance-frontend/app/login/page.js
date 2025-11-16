'use client'  // this makes it a client-side component (with state, events)
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()

    // Send login request to Django backend
    const res = await fetch('https://finplanai.onrender.com/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (data.access) {
      // Save token to localStorage
      localStorage.setItem('access_token', data.access)
      router.push('/dashboard') // navigate to dashboard
    } else {
      alert('Login failed: ' + JSON.stringify(data))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="border w-full p-2 mb-3 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account? <a href="/register" className="text-blue-500 underline">Register</a>
        </p>
      </form>
    </div>
  )
}
