'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.status === 201) {
      alert('Registration successful! You can now login.')
      router.push('/login')
    } else {
      const data = await res.json()
      alert('Error: ' + JSON.stringify(data))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        <input type="text" placeholder="Username" className="border w-full p-2 mb-3 rounded"
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input type="email" placeholder="Email" className="border w-full p-2 mb-3 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="border w-full p-2 mb-3 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <input type="password" placeholder="Confirm Password" className="border w-full p-2 mb-3 rounded"
          onChange={e => setForm({ ...form, password2: e.target.value })} />
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  )
}
